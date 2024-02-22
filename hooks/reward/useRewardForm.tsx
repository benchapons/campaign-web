import { useEffect, useMemo, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { TableColumn } from 'react-data-table-component';
import { useRecoilState } from 'recoil';
import { v4 as uuidv4 } from 'uuid';

import useMasterData from './useMasterData';
import { SwalCustom } from '@/configurations/alert';
import { initRewardFormStore, initWeekDay, rewardStore } from '@/store/reward';
import { RewardGroupTypeEnum, RewardTypeEnum, WeeklyTypeEnum } from '@/constants/enum';
import { RewardFormType } from '@/types/reward.type';
import { ChangeEventBaseNumberType, ChangeEventBaseType } from '@/types/event.interface';
import { createReward, getRewardById, updateReward, updateSpecialReward } from '@/services/client/reward.service';
import { AuthorizedUserType } from '@/types/auth.type';
import { transformPayloadReward, transformPayloadUpdateSpecialReward } from '@/dto/reward/payload.dto';
import { onCheckedWeekFull } from '@/utilities/global';

const useRewardForm = (authorizedUser: AuthorizedUserType) => {
  const router = useRouter();
  const { isMasterLoading, rewardTypeList } = useMasterData();
  const { rewardId } = router?.query;
  const [rewardForm, setRewardForm] = useRecoilState<RewardFormType>(rewardStore);

  const [campaignList, setCampaignList] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const schema = useMemo(() => {
    return yup.object().shape({
      rewardName: yup.string().required('กรุณาระบุ'),
      rewardType: yup.string().required('กรุณาเลือก type'),
      rewardValue: yup.number().typeError('กรุณาระบุ').positive().min(1, 'กรุณาระบุมากกว่า 1').required('กรุณาระบุ'),
      totalRewardQty: yup.number().typeError('กรุณาระบุ').positive().min(1, 'กรุณาระบุมากกว่า 1').required('กรุณาระบุ'),
      ...((!rewardForm?.rewardType ||
        rewardForm?.rewardType === RewardTypeEnum?.VOUCHER_CODE ||
        rewardForm?.rewardType === RewardTypeEnum?.PHYSICAL_GIFT) && {
        qtyPerRedemption: yup
          .number()
          .typeError('กรุณาระบุ')
          .positive()
          .min(1, 'กรุณาระบุมากกว่า 1')
          .required('กรุณาระบุ'),
      }),
      ...((rewardForm?.rewardType === RewardTypeEnum?.VIZ_COINS ||
        rewardForm?.rewardType === RewardTypeEnum?.E_VOUCHER) && {
        ruleId: yup.string().required('กรุณาระบุ'),
        customTriggerId: yup.string().uuid('format ไม่ถูกต้อง').required('กรุณาระบุ'),
      }),
      ...(rewardForm?.rewardType === RewardTypeEnum?.E_VOUCHER && {
        voucherRewardId: yup.string().required('กรุณาระบุ'),
      }),
      ...(rewardForm?.quotaPerReward?.daily?.isChecked && {
        daily: yup
          .number()
          .typeError('กรุณาระบุ')
          .min(1, 'กรุณาระบุ')
          .max(Number(rewardForm?.totalRewardQty), 'กรุณาระบุให้น้อยกว่าค่า total reward quantity')
          .required('กรุณาระบุ'),
      }),
      ...(rewardForm?.quotaPerReward?.weekly?.isChecked &&
        rewardForm?.quotaPerReward?.weekly?.weekType === WeeklyTypeEnum?.CAMPAIGN_STARTING && {
          startAmount: yup
            .number()
            .typeError('กรุณาระบุ')
            .min(1, 'กรุณาระบุ')
            .max(Number(rewardForm?.totalRewardQty), 'กรุณาระบุให้น้อยกว่าค่า total reward quantity')
            .required('กรุณาระบุ'),
        }),
      ...(rewardForm?.quotaPerReward?.weekly?.isChecked &&
        rewardForm?.quotaPerReward?.weekly?.weekType === WeeklyTypeEnum?.WEEKDAY && {
          weekdays: yup.array().of(
            yup.object().shape({
              isChecked: yup.boolean(),
              amount: yup
                .string()
                .nullable()
                .when('isChecked', {
                  is: true,
                  then: (schema) => schema.required('กรุณาระบุ amount'),
                }),
              days: yup
                .array()
                .of(yup.string())
                .when('isChecked', {
                  is: true,
                  then: (schema) => schema.min(1, 'กรุณาระบุวันอย่างน้อย 1 วัน').required('กรุณาระบุ'),
                })
                .default([]),
            })
          ),
        }),
      ...(rewardForm?.quotaPerReward?.monthly?.isChecked && {
        monthly: yup
          .number()
          .typeError('กรุณาระบุ')
          .min(1, 'กรุณาระบุ')
          .max(Number(rewardForm?.totalRewardQty), 'กรุณาระบุให้น้อยกว่าค่า total reward quantity')
          .required('กรุณาระบุ'),
      }),
    });
  }, [rewardForm]);

  const methodsForm = useForm({
    defaultValues: {
      rewardName: '',
      rewardType: '',
      qtyPerRedemption: 0,
      rewardValue: 0,
      totalRewardQty: 0,
      ruleId: '',
      customTriggerId: '',
      voucherRewardId: '',
      daily: 0,
      startAmount: 0,
      monthly: 0,
      weekdays: [
        {
          isChecked: true,
          amount: null,
          days: [],
        },
      ],
    },
    values: {
      rewardName: rewardForm?.rewardName,
      rewardType: rewardForm?.rewardType,
      spendingXBath: rewardForm?.spendingXBath,
      qtyPerRedemption: rewardForm?.qtyPerRedemption,
      rewardValue: rewardForm?.rewardValue,
      totalRewardQty: rewardForm?.totalRewardQty,
      ruleId: rewardForm?.ruleId,
      customTriggerId: rewardForm?.customTriggerId,
      voucherRewardId: rewardForm?.voucherRewardId,
      daily: rewardForm?.quotaPerReward?.daily?.value,
      monthly: rewardForm?.quotaPerReward?.monthly?.value,
      startAmount: rewardForm?.quotaPerReward?.weekly?.startAmount,
      weekdays: rewardForm?.quotaPerReward?.weekly?.weekDays?.map((i) => ({
        ...i,
        days: i?.days?.reduce((acc: string[], cur: any) => {
          if (cur?.isChecked) {
            acc.push(cur?.name);
          }
          return acc;
        }, []),
      })),
    },
    resetOptions: {
      keepDirtyValues: true, // user-interacted input will be retained
      keepErrors: true, // input errors will be retained with value update
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (!router?.isReady || !rewardId) return;

    fetchData(rewardId as string);
  }, [router?.query]);

  const fetchData = async (rewardId: string) => {
    setIsLoading(true);
    try {
      const res = await getRewardById(rewardId, {
        isAdjustment: false,
        rewardGroupType: RewardGroupTypeEnum?.SHARED_REWARD,
      });
      const { campaigns, ...reward } = res;
      setRewardForm(reward);
      setCampaignList(res?.campaigns);
    } catch (error: any) {
      SwalCustom.fire(`เกิดข้อผิดพลาด`, error?.errorMessageTh, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const onChangeInput = ({ name, value }: ChangeEventBaseType<string | number | boolean>) => {
    let data = {};
    if (name === 'rewardType') {
      if (value !== RewardTypeEnum?.VOUCHER_CODE && value !== RewardTypeEnum?.PHYSICAL_GIFT)
        data = { qtyPerRedemption: 1 };
      else data = { qtyPerRedemption: '' };
      if (value !== RewardTypeEnum.LUCKY_DRAW) data = { ...data, spendingXBath: null };
    }
    setRewardForm({ ...rewardForm, ...data, [name]: value });
  };

  const onChangeCommaInput = ({ name, value }: ChangeEventBaseNumberType<string | number>) => {
    if (name === 'totalRewardQty') {
      if (rewardForm?.rewardValue) {
        setRewardForm({
          ...rewardForm,
          totalRewardQty: Number(value) || null,
          totalRewardValue: rewardForm?.rewardValue * Number(value),
        });
        return;
      }
      setRewardForm({
        ...rewardForm,
        totalRewardQty: Number(value),
      });
      return;
    }

    if (name === 'rewardValue' && rewardForm?.totalRewardQty) {
      setRewardForm({
        ...rewardForm,
        rewardValue: Number(value) || null,
        totalRewardValue: rewardForm?.totalRewardQty * Number(value),
      });
      return;
    }

    setRewardForm({ ...rewardForm, [name]: value });
  };

  //onChange quota input
  const onChangeQuotaInput = (data: any) => {
    setRewardForm({ ...rewardForm, quotaPerReward: { ...rewardForm.quotaPerReward, ...data } });
  };

  const onChangeQuotaWeeklyInput = (data: any) => {
    setRewardForm({ ...rewardForm, quotaPerReward: { ...rewardForm.quotaPerReward, weekly: data } });
  };

  const handleAddPlanQuotaWeekly = () => {
    const checkWeekFull = onCheckedWeekFull(rewardForm?.quotaPerReward?.weekly?.checked);
    if (checkWeekFull) {
      SwalCustom.fire(`ไม่สามารถเพิ่มได้`, 'เนื่องจาก คุณได้เลือกวันที่ ครบ 7 วันแล้ว', 'warning');
      return;
    }
    const newWeek = {
      ...initWeekDay,
      _id: uuidv4(),
      days: initWeekDay?.days?.map((i) => ({ ...i, disabled: rewardForm?.quotaPerReward?.weekly?.checked?.[i?.name] })),
    };
    const newReward = {
      ...rewardForm,
      quotaPerReward: {
        ...rewardForm?.quotaPerReward,
        weekly: {
          ...rewardForm?.quotaPerReward?.weekly,
          weekDays: [...rewardForm?.quotaPerReward?.weekly?.weekDays, { ...newWeek }],
        },
      },
    };
    setRewardForm(newReward);
  };

  const handleDeletePlanQuotaWeekly = (weekDayId: string) => {
    const index = rewardForm?.quotaPerReward?.weekly?.weekDays?.findIndex((plan: any) => plan?._id === weekDayId);
    const currentWeekDays = rewardForm?.quotaPerReward?.weekly?.weekDays?.find((plan: any) => plan?._id === weekDayId);
    const checked: any = currentWeekDays?.days?.reduce((acc, cur: any) => {
      return { ...acc, [cur?.name]: !cur?.isChecked };
    }, {});
    const weekDays = rewardForm?.quotaPerReward?.weekly?.weekDays
      ?.filter((item: any) => item?._id !== weekDayId)
      ?.map((i) => {
        return { ...i, days: i?.days?.map((m) => (m?.disabled ? { ...m, disabled: checked?.[m?.name] } : m)) };
      });

    SwalCustom.fire({
      icon: 'warning',
      title: `คุณต้องการลบรูปแบบที่ ${index + 1} ใช่หรือไม่?`,
      cancelButtonText: 'ไม่',
      confirmButtonText: 'ใช่',
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const newReward = {
          ...rewardForm,
          quotaPerReward: {
            ...rewardForm?.quotaPerReward,
            weekly: { ...rewardForm?.quotaPerReward?.weekly, weekDays, checked },
          },
        };
        setRewardForm(newReward);
      }
    });
  };

  const handleClickCancel = () => {
    //clear store
    // back to campaign list
    SwalCustom.fire({
      icon: 'warning',
      title: `คุณต้องการยกเลิกการบันทึกข้อมูลหรือไม่?`,
      cancelButtonText: 'ไม่',
      confirmButtonText: 'ใช่',
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        router.push('/reward');
      }
    });
  };
  const handleClickSubmit = async () => {
    //check validate
    //api submit
    const payload = transformPayloadReward(rewardForm);
    SwalCustom.fire({
      icon: 'warning',
      title: `คุณต้องการบันทึกข้อมูลหรือไม่?`,
      cancelButtonText: 'ไม่',
      confirmButtonText: 'ใช่',
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await createReward({ ...payload, isCampaign: false });
          if (res?.success) {
            SwalCustom.fire(`สร้าง Reward สำเร็จ`, '', 'success').then(() => {
              router?.push('/reward');
            });
          }
        } catch (error: any) {
          SwalCustom.fire(`เกิดข้อผิดพลาด`, error?.errorMessageTh, 'error');
        }
      }
    });
  };

  const handleClickUpdateReward = async () => {
    //check validate
    //api submit

    if (!rewardForm?._id) return;

    const payload = transformPayloadReward(rewardForm);
    SwalCustom.fire({
      icon: 'warning',
      title: `คุณต้องการบันทึกข้อมูลหรือไม่?`,
      cancelButtonText: 'ไม่',
      confirmButtonText: 'ใช่',
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed && rewardForm?._id) {
        try {
          setIsLoading(true);
          const res = await updateReward(rewardForm?._id, payload);
          if (res?.success) {
            SwalCustom.fire(`อัพเดn Reward สำเร็จ`, '', 'success').then(() => {
              router?.push('/reward');
            });
          }
        } catch (error: any) {
          SwalCustom.fire(`เกิดข้อผิดพลาด`, error?.errorMessageTh, 'error');
        } finally {
          setIsLoading(false);
        }
      }
    });
  };

  const handleClickUpdateSpecialReward = async () => {
    //check validate
    //api submit

    if (!rewardForm?._id) return;

    const payload = transformPayloadUpdateSpecialReward(rewardForm);
    SwalCustom.fire({
      icon: 'warning',
      title: `คุณต้องการบันทึกข้อมูลหรือไม่?`,
      cancelButtonText: 'ไม่',
      confirmButtonText: 'ใช่',
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed && rewardForm?._id) {
        try {
          setIsLoading(true);
          const res = await updateSpecialReward(rewardForm?._id, payload);
          if (res?.success) {
            SwalCustom.fire(`อัพเดn Reward สำเร็จ`, '', 'success').then(() => {
              router?.push('/reward');
            });
          }
        } catch (error: any) {
          SwalCustom.fire(`เกิดข้อผิดพลาด`, error?.errorMessageTh, 'error');
        } finally {
          setIsLoading(false);
        }
      }
    });
  };

  const payloadReward = () => {
    return transformPayloadReward(rewardForm);
  };

  return {
    isLoading: isMasterLoading || isLoading,
    rewardForm,
    methodsForm,
    masterData: { rewardTypeList },
    campaignList,
    onChangeInput,
    onChangeCommaInput,
    onChangeQuotaInput,
    onChangeQuotaWeeklyInput,
    handleAddPlanQuotaWeekly,
    handleDeletePlanQuotaWeekly,
    handleClickCancel,
    payloadReward,
    handleClickSubmit: methodsForm?.handleSubmit(handleClickSubmit),
    handleClickUpdateReward: methodsForm?.handleSubmit(handleClickUpdateReward),
    handleClickUpdateSpecialReward: methodsForm?.handleSubmit(handleClickUpdateSpecialReward),
  };
};

export default useRewardForm;
