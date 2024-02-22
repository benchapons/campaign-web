import { useEffect, useMemo, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';
import isEqual from 'lodash/isEqual';

import useMasterData from './useMasterData';
import { ChangeEventBaseNumberType, ChangeEventBaseType, ChangeEventMultiBaseType } from '@/types/event.interface';
import {
  campaignDetailState,
  initCampaignStore,
  campaignInfoState,
  campaignCriteriaState,
  initCampaignInfoForm,
  initCampaignCriteriaForm,
  initRewardCriteriaForm,
  initSpendingCondition,
} from '@/store/campaign';
import { SwalCustom } from '@/configurations/alert';
import {
  createCampaign,
  draftCampaignCriteria,
  draftCampaignInfo,
  getCampaignById,
  updateSpecialCampaign,
} from '@/services/client/campaign.service';
import { adjustmentReward, createReward, getRewardById, getRewardList } from '@/services/client/reward.service';
import {
  AdjustmentTypeEnum,
  FormStatusEnum,
  RewardGroupTypeEnum,
  RewardTypeEnum,
  StatusCampaignEnum,
  StepCampaignEnum,
  WeeklyTypeEnum,
} from '@/constants/enum';
import { initRewardFormStore, initWeekDay, rewardStore } from '@/store/reward';
import { transformResponseToRewardForm } from '@/dto/reward';
import { nameValidate } from '@/utilities/resolver';
import { AuthorizedUserType } from '@/types/auth.type';
import { AdjustmentRewardFormType, RewardAdjustForm, RewardFormType } from '@/types/reward.type';
import {
  transformPayloadCampaignCriteria,
  transformPayloadCampaignInfo,
  transformPayloadSubmitCampaign,
  transformPayloadSubmitCampaignWithId,
  transformPayloadUpdateSpecialCampaign,
} from '@/dto/campaign/payload.dto';
import { onCheckedWeekFull, onFindCriteria } from '@/utilities/global';
import { transformResToCampaignCriteriaForm } from '@/dto/campaign';
import { CampaignInfoForm, StatusCampaignForm } from '@/types/campaign.type';
import dayjs from 'dayjs';

interface ModalReward {
  isShow: boolean;
  conditionId: string;
  tierId: string;
  rewardId: string;
}

interface ModalAdjustmentReward {
  isShow: boolean;
  isRewardSharing: boolean;
  conditionId: string;
  tierId: string;
  rewardId: string;
}

interface FocusType {
  isFocus: boolean;
  name: any;
}

const initRewardForm: RewardAdjustForm = {
  _id: '',
  isRewardSharing: false,
  rewardType: '',
  rewardName: '',
  rewardValue: null,
  totalRewardValue: null,
  totalRewardQty: null,
  totalRedeemed: null,
};

const initModalReward: ModalReward = { isShow: false, conditionId: '', tierId: '', rewardId: '' };
const initModalAdjustmentReward: ModalAdjustmentReward = {
  isShow: false,
  isRewardSharing: false,
  conditionId: '',
  tierId: '',
  rewardId: '',
};

const initStatusForm: StatusCampaignForm = {
  formStatus: '',
  campaignStarting: false,
  campaignEnded: false,
};

const initFocus: FocusType = {
  isFocus: true,
  name: 'condition.0.conditionGroup',
};
const useCampaignForm = (authorizedUser: AuthorizedUserType) => {
  const router = useRouter();
  const { campaignId } = router?.query;

  const [campaignStore, setCampaignStore] = useRecoilState(campaignDetailState);
  const [campaignInfoFormStore, setCampaignInfoFormStore] = useRecoilState(campaignInfoState);
  const [campaignCriteriaFormStore, setCampaignCriteriaFormStore] = useRecoilState(campaignCriteriaState);
  const setRewardFormStore = useSetRecoilState<RewardFormType>(rewardStore);

  const [rewardForm, setRewardForm] = useState<RewardAdjustForm>(initRewardForm);
  const [campaignInfoFormClone, setCampaignInfoFormClone] = useState<CampaignInfoForm>(initCampaignInfoForm);

  const [modalReward, setModalReward] = useState<ModalReward>(initModalReward);
  const [modalAdjustmentReward, setModalAdjustmentReward] = useState<ModalAdjustmentReward>(initModalAdjustmentReward);
  const [status, setStatus] = useState<StatusCampaignForm>(initStatusForm);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // const [indexFocus, setIndexFocus] = useState<number>(0);
  const [focus, setFocus] = useState<FocusType>(initFocus);

  const { isMasterLoading } = useMasterData();

  const schema = useMemo(() => {
    if (campaignStore?.step === StepCampaignEnum?.INFORMATION && !status?.campaignEnded) {
      return yup.object().shape({
        campaignName: yup.string().required('กรุณาระบุ'),
        campaignDesc: yup.string().required('กรุณาระบุ'),
        campaignObjective: yup.string().required('กรุณาระบุ'),
        campaignStartDate: yup.string().required('กรุณาระบุ'),
        campaignEndDate: yup.string().required('กรุณาระบุ'),
        campaignCost: yup.number().typeError('กรุณาระบุ').required('กรุณาระบุ'),
        campaignStatus: yup.string().required('กรุณาระบุ'),
      });
    }
    if (campaignStore?.step === StepCampaignEnum?.CRITERIA && !status?.campaignEnded) {
      return yup.object().shape({
        condition: yup.array().of(
          yup.object().shape({
            campaignType: yup.string().required('กรุณาระบุ'),
            conditionGroup: yup.string().required('กรุณาระบุ'),
            ...(!status?.campaignStarting && {
              building: yup.array().of(yup.string()).min(1, 'กรุณาระบุ'),
            }),
            bankNames: yup.array().when('campaignType', {
              is: 'Bank',
              then: (schema) => schema.of(yup.string()).min(1, 'กรุณาระบุ'),
              otherwise: (schema) => schema.notRequired(),
            }),
            brand: yup.string().when('campaignType', {
              is: 'Brand',
              then: (schema) => schema.required('กรุณาระบุ'),
              otherwise: (schema) => schema.notRequired(),
            }),
            customerQuota: yup.object().shape({
              daily: yup.object().shape({
                isChecked: yup.boolean(),
                value: yup.string().when('isChecked', {
                  is: true,
                  then: (schema) => schema.nullable().required('กรุณาระบุ'),
                  otherwise: (schema) => schema.nullable().notRequired(),
                }),
              }),
              all: yup.object().shape({
                isChecked: yup.boolean(),
                value: yup.string().when('isChecked', {
                  is: true,
                  then: (schema) => schema.nullable().required('กรุณาระบุ'),
                  otherwise: (schema) => schema.nullable().notRequired(),
                }),
              }),
            }),
            tier: yup.array().of(
              yup.object().shape({
                spendingType: yup.string(),
                minSpendingAmount: yup.number().required('กรุณาระบุ'),
                conditionDesc: yup.lazy((val) =>
                  Array.isArray(val)
                    ? yup.array().of(yup.string()).min(1, 'กรุณาระบุ')
                    : yup.string().required('กรุณาระบุ')
                ),
                maxSpendingAmount: yup.number().when('spendingType', {
                  is: 'TIER',
                  then: (schema) => schema.nullable().required('กรุณาระบุ'),
                  otherwise: (schema) => schema.nullable().notRequired(),
                }),
                reward: yup.array().of(
                  yup.object().shape({
                    isRewardSharing: yup.boolean(),
                    rewardType: yup.string().required('กรุณาระบุ'),
                    rewardName: yup.string().required('กรุณาระบุ'),
                    ruleId: yup.string().when('rewardType', {
                      is: (value: RewardTypeEnum) =>
                        value === RewardTypeEnum?.VIZ_COINS || value === RewardTypeEnum?.E_VOUCHER,
                      then: (schema) => schema.required('กรุณาระบุ'),
                      otherwise: (schema) => schema.nullable().notRequired(),
                    }),
                    customTriggerId: yup.string().when('rewardType', {
                      is: (value: RewardTypeEnum) =>
                        value === RewardTypeEnum?.VIZ_COINS || value === RewardTypeEnum?.E_VOUCHER,
                      then: (schema) => schema.uuid('format ไม่ถูกต้อง').required('กรุณาระบุ'),
                      otherwise: (schema) => schema.nullable().notRequired(),
                    }),
                    voucherRewardId: yup.string().when('rewardType', {
                      is: (value: RewardTypeEnum) => value === RewardTypeEnum?.E_VOUCHER,
                      then: (schema) => schema.required('กรุณาระบุ'),
                      otherwise: (schema) => schema.nullable().notRequired(),
                    }),
                    qtyPerRedemption: yup
                      .number()
                      .nullable()
                      .when('isRewardSharing', {
                        is: false,
                        then: (schema) =>
                          schema.typeError('กรุณาระบุ').positive().min(1, 'กรุณาระบุมากกว่า 1').required('กรุณาระบุ'),
                        otherwise: (schema) => schema.nullable().notRequired(),
                      }),
                    rewardValue: yup.number().when('isRewardSharing', {
                      is: false,
                      then: (schema) => schema.typeError('กรุณาระบุ').required('กรุณาระบุ'),
                      otherwise: (schema) => schema.nullable().notRequired(),
                    }),
                    totalRewardQty: yup.number().when('isRewardSharing', {
                      is: false,
                      then: (schema) =>
                        schema.typeError('กรุณาระบุ').positive().min(1, 'กรุณาระบุมากกว่า 1').required('กรุณาระบุ'),
                      otherwise: (schema) => schema.nullable().notRequired(),
                    }),
                    daily: yup.object().shape({
                      isChecked: yup.boolean(),
                      value: yup.string().when('isChecked', {
                        is: true,
                        then: (schema) => schema.typeError('กรุณาระบุ').required('กรุณาระบุ'),
                        otherwise: (schema) => schema.nullable().notRequired(),
                      }),
                    }),
                    weekly: yup.object().shape({
                      isChecked: yup.boolean(),
                      weekType: yup.string().nullable(),
                      startAmount: yup.string().when('weekType', {
                        is: WeeklyTypeEnum?.CAMPAIGN_STARTING,
                        then: (schema) => schema.required('กรุณาระบุ'),
                        otherwise: (schema) => schema.notRequired(),
                      }),
                      weekdays: yup.array().when('weekType', {
                        is: WeeklyTypeEnum?.WEEKDAY,
                        then: (schema) =>
                          schema.of(
                            yup.object().shape({
                              isChecked: yup.boolean(),
                              amount: yup
                                .string()
                                .nullable()
                                .when('isChecked', {
                                  is: true,
                                  then: (schema) => schema.typeError('กรุณาระบุ').required('กรุณาระบุ'),
                                }),
                              days: yup
                                .array()
                                .of(yup.string())
                                .when('isChecked', {
                                  is: true,
                                  then: (schema) =>
                                    schema
                                      .typeError('กรุณาระบุ')
                                      .min(1, 'กรุณาระบุวันอย่างน้อย 1 วัน')
                                      .required('กรุณาระบุ'),
                                })
                                .default([]),
                            })
                          ),
                        otherwise: (schema) => schema.notRequired(),
                      }),
                    }),
                    monthly: yup.object().shape({
                      isChecked: yup.boolean(),
                      value: yup.string().when('isChecked', {
                        is: true,
                        then: (schema) => schema.typeError('กรุณาระบุ').nullable().required('กรุณาระบุ'),
                        otherwise: (schema) => schema.nullable().notRequired(),
                      }),
                    }),
                  })
                ),
              })
            ),
          })
        ),
      });
    }
    return yup.object().shape({});
  }, [campaignStore?.step, status]);

  const methodsForm = useForm({
    defaultValues: {
      campaignName: '',
      campaignDesc: '',
      campaignObjective: '',
      campaignStartDate: '',
      campaignEndDate: '',
      campaignCost: 0,
      campaignStatus: '',
      condition: [
        {
          campaignType: '',
          conditionGroup: '',
          building: [],
          bankNames: [],
          brand: '',
          tier: [
            {
              spendingType: 'NORMAL',
              minSpendingAmount: 0,
              maxSpendingAmount: 0,
              conditionDesc: [],
              reward: [
                {
                  isRewardSharing: false,
                  rewardType: '',
                  rewardName: '',
                  ruleId: '',
                  customTriggerId: '',
                  voucherRewardId: '',
                  spendingXBath: null,
                  qtyPerRedemption: 0,
                  rewardValue: 0,
                  totalRewardQty: 0,
                  daily: {
                    isChecked: false,
                    value: '',
                  },
                  monthly: {
                    isChecked: false,
                    value: '',
                  },
                  weekly: {
                    isChecked: false,
                    weekType: null,
                    startAmount: '',
                    weekdays: [{ isChecked: false, amount: null, days: [] }],
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    values: {
      campaignName: campaignInfoFormStore?.campaignName,
      campaignDesc: campaignInfoFormStore?.campaignDesc,
      campaignObjective: campaignInfoFormStore?.campaignObjective,
      campaignStartDate: campaignInfoFormStore?.campaignStartDate,
      campaignEndDate: campaignInfoFormStore?.campaignEndDate,
      campaignCost: campaignInfoFormStore?.campaignCost,
      campaignStatus: campaignInfoFormStore?.campaignStatus,
      condition: campaignCriteriaFormStore?.map((condition: any) => ({
        campaignType: condition?.campaignType,
        bankNames: condition?.bankNames,
        conditionGroup: condition?.conditionGroup,
        brand: condition?.brand,
        building:
          condition?.buildingOther?.isChecked && condition?.buildingOther?.value
            ? [...condition?.building, condition?.buildingOther?.value]
            : condition?.building,
        customerQuota: {
          daily: {
            isChecked: condition?.customerQuota?.daily?.isChecked,
            value: condition?.customerQuota?.daily?.value,
          },
          all: {
            isChecked: condition?.customerQuota?.all?.isChecked,
            value: condition?.customerQuota?.all?.value,
          },
        },

        tier: condition?.spendingConditions?.map((tier: any) => ({
          spendingType: condition?.spendingType,
          minSpendingAmount: tier?.minSpendingAmount,
          maxSpendingAmount: tier?.maxSpendingAmount,
          conditionDesc: tier?.conditionDesc,
          reward: tier?.rewards?.map((reward: any) => ({
            isRewardSharing: reward?.isRewardSharing,
            rewardType: reward?.rewardType,
            rewardName: reward?.rewardName,
            ruleId: reward?.ruleId,
            customTriggerId: reward?.customTriggerId,
            voucherRewardId: reward?.voucherRewardId,
            spendingXBath: reward?.spendingXBath,
            qtyPerRedemption: reward?.qtyPerRedemption,
            rewardValue: reward?.rewardValue,
            totalRewardQty: reward?.totalRewardQty,
            daily: {
              isChecked: reward?.quotaPerReward?.daily?.isChecked,
              value: reward?.quotaPerReward?.daily?.value,
            },
            monthly: {
              isChecked: reward?.quotaPerReward?.monthly?.isChecked,
              value: reward?.quotaPerReward?.monthly?.value,
            },
            weekly: {
              isChecked: reward?.quotaPerReward?.weekly?.isChecked,
              weekType: reward?.quotaPerReward?.weekly?.weekType,
              startAmount: reward?.quotaPerReward?.weekly?.startAmount,
              weekdays: reward?.quotaPerReward?.weekly?.weekDays?.map((day: any) => ({
                isChecked: day?.isChecked,
                amount: day?.amount,
                days: day?.days?.reduce((acc: string[], cur: any) => {
                  if (cur?.isChecked) {
                    acc.push(cur?.name);
                  }
                  return acc;
                }, []),
              })),
            },
          })),
        })),
      })),
    },
    resetOptions: {
      keepDirtyValues: true, // user-interacted input will be retained
      keepErrors: true, // input errors will be retained with value update
    },
    resolver: yupResolver(schema),
  });

  // console.log('getValues', methodsForm?.getValues());
  // console.log('error', methodsForm?.formState?.errors);
  // console.log('campaignCriteriaFormStore', campaignCriteriaFormStore);

  useEffect(() => {
    const campaignCode = `CAM-${dayjs().year()?.toString()?.slice(-2)}-XXXXX`;
    setCampaignInfoFormStore({ ...campaignInfoFormStore, campaignCode });
  }, []);

  useEffect(() => {
    if (!router?.isReady || !campaignId) return;
    fetchData(campaignId as string);
  }, [router?.query]);

  useEffect(() => {
    if (campaignStore?.step === StepCampaignEnum?.CRITERIA && focus?.isFocus) {
      methodsForm?.setFocus(focus?.name);
    }
  }, [campaignStore?.step, methodsForm?.setFocus, focus]);

  const fetchData = async (campaignId: string) => {
    setIsLoading(true);
    try {
      const res = await getCampaignById(campaignId);
      if (res?.success) {
        const { campaignConditions, formStatus, isStarted, isEnded, ...info } = res?.data;
        setCampaignInfoFormStore(info);
        setCampaignInfoFormClone(info);
        const conditions = await transformResToCampaignCriteriaForm({
          isFindRewardList: true,
          conditions: campaignConditions,
          campaignId: campaignId,
        });
        setCampaignCriteriaFormStore(conditions);
        setStatus({ ...status, formStatus, campaignEnded: isEnded, campaignStarting: isStarted });
      }
    } catch (error: any) {
      SwalCustom.fire(`เกิดข้อผิดพลาด`, error?.errorMessageTh, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const clearStore = () => {
    setCampaignStore(initCampaignStore);
    setCampaignInfoFormStore(initCampaignInfoForm);
    setCampaignCriteriaFormStore([initCampaignCriteriaForm]);
  };

  const onChangeInputInfo = ({
    name,
    value,
  }: ChangeEventBaseType | ChangeEventBaseNumberType | ChangeEventMultiBaseType<string>) => {
    setCampaignInfoFormStore({ ...campaignInfoFormStore, [name]: value });
  };

  const onChangeInputCriteria = (
    { name, value, data }: ChangeEventBaseType<string | boolean> | ChangeEventBaseNumberType | ChangeEventMultiBaseType,
    conditionId: string
  ) => {
    const [_condition, _index] = name?.split('.');
    const realName = nameValidate(name);

    const newCampaignCriteriaForm = campaignCriteriaFormStore?.map((i: any) => {
      if (i?._id === conditionId) {
        if (realName === 'building') {
          // methodsForm?.setValue(name, data);
          return {
            ...i,
            [realName]: !value ? i?.[realName]?.filter((m: any) => m !== data) : [...i?.[realName], data],
          };
        } else if (realName === 'spendingType') {
          const tier: any = `${_condition}.${_index}.tier`;
          methodsForm?.unregister(tier);
          setFocus({
            isFocus: true,
            name: `${_condition}.${_index}.tier.0.minSpendingAmount`,
          });
          return { ...i, [realName]: value, spendingConditions: [initSpendingCondition] };
        } else {
          return { ...i, [realName]: value };
        }
      } else {
        return i;
      }
    });

    setCampaignCriteriaFormStore(newCampaignCriteriaForm);
  };

  const onChangeInputBuildingOther = (conditionId: string, data: any) => {
    const { name, ...building } = data;
    // methodsForm?.setValue(name, building?.value);
    const newCampaignCriteriaForm = campaignCriteriaFormStore?.map((i: any) =>
      i?._id === conditionId ? { ...i, buildingOther: building } : i
    );
    setCampaignCriteriaFormStore(newCampaignCriteriaForm);
  };

  //onChange quota input
  const onChangeConditionQuotaInput = (data: any, conditionId: string) => {
    const newCampaignCriteriaForm = campaignCriteriaFormStore?.map((i: any) =>
      i?._id === conditionId ? { ...i, customerQuota: data } : i
    );
    setCampaignCriteriaFormStore(newCampaignCriteriaForm);
  };

  const onChangeInputSpending = (
    { name, value }: ChangeEventBaseType | ChangeEventBaseNumberType,
    conditionId: string,
    tierId: string
  ) => {
    const realName = nameValidate(name);
    const newCampaignCriteriaForm = campaignCriteriaFormStore?.map((i: any) =>
      i?._id === conditionId
        ? {
            ...i,
            spendingConditions: i?.spendingConditions?.map((spending: any) =>
              spending?._id === tierId ? { ...spending, [realName]: value } : spending
            ),
          }
        : i
    );
    setCampaignCriteriaFormStore(newCampaignCriteriaForm);
  };

  const onChangeInputReward = async (
    { name, value, data }: ChangeEventBaseType<string | boolean> | ChangeEventBaseNumberType,
    conditionId: string,
    tierId: string,
    rewardId: string
  ) => {
    const realName = nameValidate(name);

    const newCampaignCriteriaForm = await Promise.all(
      campaignCriteriaFormStore?.map(async (i: any) =>
        i?._id === conditionId
          ? {
              ...i,
              spendingConditions: await Promise.all(
                i?.spendingConditions?.map(async (spending: any) =>
                  spending?._id === tierId
                    ? {
                        ...spending,
                        rewards: await Promise.all(
                          spending?.rewards?.map(async (reward: any) => {
                            if (reward?._id === rewardId) {
                              if (realName === 'isRewardSharing') {
                                return {
                                  ...reward,
                                  [realName]: value,
                                  ...(!value && { ...initRewardCriteriaForm }),
                                  qtyPerRedemption: '',
                                };
                              } else if (realName === 'rewardType') {
                                if (reward?.isRewardSharing) {
                                  try {
                                    const rewards = await getRewardList({
                                      rewardType: value,
                                      campaignId: campaignId || campaignInfoFormStore?._id,
                                    });
                                    return { ...reward, [realName]: value, rewardList: rewards };
                                  } catch (error: any) {
                                    SwalCustom.fire(`เกิดข้อผิดพลาด`, error?.errorMessageTh, 'error');
                                  }
                                } else {
                                  if (
                                    value !== RewardTypeEnum?.VOUCHER_CODE &&
                                    value !== RewardTypeEnum?.PHYSICAL_GIFT
                                  ) {
                                    if (value !== RewardTypeEnum.LUCKY_DRAW)
                                      return {
                                        ...reward,
                                        [realName]: value,
                                        rewardList: [],
                                        qtyPerRedemption: 1,
                                        spendingXBath: null,
                                      };
                                    else return { ...reward, [realName]: value, rewardList: [], qtyPerRedemption: 1 };
                                  } else {
                                    return { ...reward, [realName]: value, rewardList: [], qtyPerRedemption: '' };
                                  }
                                }
                              } else if (realName === 'rewardName' && reward?.isRewardSharing) {
                                const { rewardList, ...newReward } = transformResponseToRewardForm(data);
                                const result = { ...reward, ...newReward };
                                return result;
                              } else if (realName === 'totalRewardQty') {
                                if (reward?.rewardValue) {
                                  return {
                                    ...reward,
                                    [realName]: value,
                                    totalRewardValue: reward?.rewardValue * Number(value),
                                  };
                                }
                                return {
                                  ...reward,
                                  [realName]: value,
                                };
                              } else if (realName === 'rewardValue' && reward?.totalRewardQty) {
                                return {
                                  ...reward,
                                  [realName]: value,
                                  totalRewardValue: reward?.totalRewardQty * Number(value),
                                };
                              } else {
                                return { ...reward, [realName]: value };
                              }
                            } else {
                              return reward;
                            }
                          })
                        ),
                      }
                    : spending
                )
              ),
            }
          : i
      )
    );
    setCampaignCriteriaFormStore(newCampaignCriteriaForm);
  };

  // =-=-=-=-=-=-= quota reward =-=-=-=-=-=-=
  const onChangeQuotaRewardInput = (data: any, conditionId: string, tierId: string, rewardId: string) => {
    const newCampaignCriteriaForm = campaignCriteriaFormStore?.map((i: any) =>
      i?._id === conditionId
        ? {
            ...i,
            spendingConditions: i?.spendingConditions?.map((spending: any) =>
              spending?._id === tierId
                ? {
                    ...spending,
                    rewards: spending?.rewards?.map((reward: any) =>
                      reward?._id === rewardId ? { ...reward, quotaPerReward: data } : reward
                    ),
                  }
                : spending
            ),
          }
        : i
    );
    setCampaignCriteriaFormStore(newCampaignCriteriaForm);
  };

  const onChangeQuotaWeeklyRewardInput = (data: any, conditionId: string, tierId: string, rewardId: string) => {
    const newCampaignCriteriaForm = campaignCriteriaFormStore?.map((i: any) =>
      i?._id === conditionId
        ? {
            ...i,
            spendingConditions: i?.spendingConditions?.map((spending: any) =>
              spending?._id === tierId
                ? {
                    ...spending,
                    rewards: spending?.rewards?.map((reward: any) =>
                      reward?._id === rewardId
                        ? { ...reward, quotaPerReward: { ...reward?.quotaPerReward, weekly: data } }
                        : reward
                    ),
                  }
                : spending
            ),
          }
        : i
    );
    setCampaignCriteriaFormStore(newCampaignCriteriaForm);
  };

  const handleAddPlanQuotaWeeklyReward = (conditionId: string, tierId: string, rewardId: string) => {
    const { reward } = onFindCriteria({ criteriaForm: campaignCriteriaFormStore, conditionId, tierId, rewardId });

    const checkWeekFull = reward ? onCheckedWeekFull(reward?.quotaPerReward?.weekly?.checked) : false;
    if (checkWeekFull) {
      SwalCustom.fire(`ไม่สามารถเพิ่มได้`, 'เนื่องจาก คุณได้เลือกวันที่ ครบ 7 วันแล้ว', 'warning');
      return;
    }
    const newCampaignCriteriaForm = campaignCriteriaFormStore?.map((i: any) =>
      i?._id === conditionId
        ? {
            ...i,
            spendingConditions: i?.spendingConditions?.map((spending: any) =>
              spending?._id === tierId
                ? {
                    ...spending,
                    rewards: spending?.rewards?.map((reward: any) => {
                      if (reward?._id === rewardId) {
                        const newWeek = {
                          ...initWeekDay,
                          _id: uuidv4(),
                          days: initWeekDay?.days?.map((i) => ({
                            ...i,
                            disabled: reward?.quotaPerReward?.weekly?.checked?.[i?.name],
                          })),
                        };
                        return {
                          ...reward,
                          quotaPerReward: {
                            ...reward?.quotaPerReward,
                            weekly: {
                              ...reward?.quotaPerReward?.weekly,
                              weekDays: [...reward?.quotaPerReward?.weekly?.weekDays, { ...newWeek }],
                            },
                          },
                        };
                      }
                      return reward;
                    }),
                  }
                : spending
            ),
          }
        : i
    );
    setCampaignCriteriaFormStore(newCampaignCriteriaForm);
  };

  const handleDeletePlanQuotaWeeklyReward = (
    conditionId: string,
    tierId: string,
    rewardId: string,
    weekDayId: string
  ) => {
    const condition = campaignCriteriaFormStore?.find((i: any) => i?._id === conditionId);
    const tier = condition?.spendingConditions?.find((i: any) => i?._id === tierId);
    const reward = tier?.rewards?.find((i: any) => i?._id === rewardId);
    const index = reward?.quotaPerReward?.weekly?.weekDays?.findIndex((plan: any) => plan?._id === weekDayId);

    SwalCustom.fire({
      icon: 'warning',
      title: `คุณต้องการลบรูปแบบที่ ${index + 1} ใช่หรือไม่?`,
      cancelButtonText: 'ไม่',
      confirmButtonText: 'ใช่',
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const newCampaignCriteriaForm = campaignCriteriaFormStore?.map((i: any) =>
          i?._id === conditionId
            ? {
                ...i,
                spendingConditions: i?.spendingConditions?.map((spending: any) =>
                  spending?._id === tierId
                    ? {
                        ...spending,
                        rewards: spending?.rewards?.map((reward: any) => {
                          if (reward?._id === rewardId) {
                            const currentWeekDays = reward?.quotaPerReward?.weekly?.weekDays?.find(
                              (plan: any) => plan?._id === weekDayId
                            );
                            const checked: any = currentWeekDays?.days?.reduce((acc: any, cur: any) => {
                              return { ...acc, [cur?.name]: !cur?.isChecked };
                            }, {});
                            const weekDays = reward?.quotaPerReward?.weekly?.weekDays
                              ?.filter((item: any) => item?._id !== weekDayId)
                              ?.map((i: any) => {
                                return {
                                  ...i,
                                  days: i?.days?.map((m: any) =>
                                    m?.disabled ? { ...m, disabled: checked?.[m?.name] } : m
                                  ),
                                };
                              });
                            return {
                              ...reward,
                              quotaPerReward: {
                                ...reward?.quotaPerReward,
                                weekly: { ...reward?.quotaPerReward?.weekly, weekDays, checked },
                              },
                            };
                          }
                          return reward;
                        }),
                      }
                    : spending
                ),
              }
            : i
        );
        setCampaignCriteriaFormStore(newCampaignCriteriaForm);
      }
    });
  };

  // =-=-=-=-=-= handle ADD Button =-=-=-=-=-=

  // add button condition, tier, rewards
  const handleAddCampaignCondition = () => {
    const newCampaignCriteriaForm = campaignCriteriaFormStore?.map((i: any) => ({ ...i, isExpand: false }));
    setCampaignCriteriaFormStore([
      ...newCampaignCriteriaForm,
      { ...initCampaignCriteriaForm, _id: uuidv4(), isExpand: true },
    ]);
    setFocus({
      isFocus: true,
      name: `condition.${campaignCriteriaFormStore?.length}.conditionGroup`,
    });
  };

  const handleAddTierCampaignCondition = (conditionId: string) => {
    const newSpendingConditions = campaignCriteriaFormStore?.map((condition: any) => ({
      ...condition,
      spendingConditions: condition?.spendingConditions?.map((spending: any) => ({ ...spending, isExpand: false })),
    }));
    const newCampaignCriteriaForm = newSpendingConditions?.map((i: any) =>
      i?._id === conditionId
        ? {
            ...i,
            spendingConditions: [...i?.spendingConditions, { ...initSpendingCondition, _id: uuidv4(), isExpand: true }],
          }
        : i
    );
    // focus
    const conditionIndex = newCampaignCriteriaForm?.findIndex((condition: any) => condition?._id === conditionId);
    const spendingConditions = newCampaignCriteriaForm?.find((condition: any) => condition?._id === conditionId)
      ?.spendingConditions;

    setCampaignCriteriaFormStore(newCampaignCriteriaForm);
    setFocus({
      isFocus: true,
      name: `condition.${conditionIndex}.tier.${spendingConditions?.length - 1}.minSpendingAmount`,
    });
  };

  const handleAddRewardCampaignCondition = (conditionId: string, TierId: string) => {
    const newCampaignCriteriaForm = campaignCriteriaFormStore?.map((condition: any) =>
      condition?._id === conditionId
        ? {
            ...condition,
            spendingConditions: condition?.spendingConditions?.map((spending: any) =>
              spending?._id === TierId
                ? { ...spending, rewards: [...spending?.rewards, { ...initRewardCriteriaForm, _id: uuidv4() }] }
                : spending
            ),
          }
        : condition
    );
    setCampaignCriteriaFormStore(newCampaignCriteriaForm);
  };

  // =-=-=-=-=-= handle Toggle Expand Button =-=-=-=-=-=

  //toggle expand button
  const handleToggleExpandCondition = (conditionId: string) => {
    const indexCondition = campaignCriteriaFormStore?.findIndex((condition: any) => condition?._id === conditionId);
    const isExpand = campaignCriteriaFormStore?.find((condition: any) => condition?._id === conditionId)?.isExpand;
    const newCampaignCriteriaForm = campaignCriteriaFormStore?.map((condition: any) =>
      condition?._id === conditionId ? { ...condition, isExpand: !condition?.isExpand } : condition
    );
    if (!isExpand) {
      setFocus({
        isFocus: true,
        name: `condition.${indexCondition}.conditionGroup`,
      });
    } else {
      setFocus({
        isFocus: false,
        name: `condition.${indexCondition}.conditionGroup`,
      });
    }
    setCampaignCriteriaFormStore(newCampaignCriteriaForm);
  };

  const handleToggleExpandTier = (conditionId: string, tierId: string) => {
    const conditionIndex = campaignCriteriaFormStore?.findIndex((condition: any) => condition?._id === conditionId);
    const spendingConditions = campaignCriteriaFormStore?.find((condition: any) => condition?._id === conditionId)
      ?.spendingConditions;
    const tierIndex = spendingConditions?.findIndex((tier: any) => tier?._id === tierId);
    const newCampaignCriteriaForm = campaignCriteriaFormStore?.map((condition: any) =>
      condition?._id === conditionId
        ? {
            ...condition,
            spendingConditions: condition?.spendingConditions?.map((tier: any) =>
              tier?._id === tierId ? { ...tier, isExpand: !tier?.isExpand } : tier
            ),
          }
        : condition
    );
    setCampaignCriteriaFormStore(newCampaignCriteriaForm);
    setFocus({
      isFocus: true,
      name: `condition.${conditionIndex}.tier.${tierIndex}.minSpendingAmount`,
    });
  };

  const handleToggleExpandReward = (conditionId: string, tierId: string, rewardId: string) => {
    const newCampaignCriteriaForm = campaignCriteriaFormStore?.map((condition: any) =>
      condition?._id === conditionId
        ? {
            ...condition,
            spendingConditions: condition?.spendingConditions?.map((tier: any) =>
              tier?._id === tierId
                ? {
                    ...tier,
                    rewards: tier?.rewards?.map((reward: any) =>
                      reward?._id === rewardId ? { ...reward, isExpand: !reward?.isExpand } : reward
                    ),
                  }
                : tier
            ),
          }
        : condition
    );
    setCampaignCriteriaFormStore(newCampaignCriteriaForm);
  };

  // =-=-=-=-=-= handle  Delete Button =-=-=-=-=-=

  //delete button
  const handleDeleteCondition = (conditionId: string) => {
    const condition = campaignCriteriaFormStore?.find((i: any) => i?._id === conditionId);
    SwalCustom.fire({
      icon: 'warning',
      title: `คุณต้องการลบเงื่อนไข ${condition?.conditionGroup} หรือไม่?`,
      cancelButtonText: 'ไม่',
      confirmButtonText: 'ใช่',
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const newCampaignCriteriaForm = campaignCriteriaFormStore?.filter((i: any) => i?._id !== conditionId);
        setCampaignCriteriaFormStore(newCampaignCriteriaForm);
      }
    });
  };

  const handleDeleteTier = (conditionId: string, tierId: string) => {
    const condition = campaignCriteriaFormStore?.find((i: any) => i?._id === conditionId);
    const tier = condition?.spendingConditions?.find((i: any) => i?._id === tierId);
    SwalCustom.fire({
      icon: 'warning',
      title: `คุณต้องการลบTier ${tier?.conditionDesc} หรือไม่?`,
      cancelButtonText: 'ไม่',
      confirmButtonText: 'ใช่',
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const newCampaignCriteriaForm = campaignCriteriaFormStore?.map((condition: any) =>
          condition?._id === conditionId
            ? {
                ...condition,
                spendingConditions: condition?.spendingConditions?.filter((tier: any) => tier?._id !== tierId),
              }
            : condition
        );
        setCampaignCriteriaFormStore(newCampaignCriteriaForm);
      }
    });
  };

  const handleDeleteReward = (conditionId: string, tierId: string, rewardId: string) => {
    const condition = campaignCriteriaFormStore?.find((i: any) => i?._id === conditionId);
    const tier = condition?.spendingConditions?.find((i: any) => i?._id === tierId);
    const reward = tier?.rewards?.find((i: any) => i?._id === rewardId);
    SwalCustom.fire({
      icon: 'warning',
      title: `คุณต้องการลบรีวอร์ด ${reward?.rewardName} หรือไม่?`,
      cancelButtonText: 'ไม่',
      confirmButtonText: 'ใช่',
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const newCampaignCriteriaForm = campaignCriteriaFormStore?.map((condition: any) =>
          condition?._id === conditionId
            ? {
                ...condition,
                spendingConditions: condition?.spendingConditions?.map((tier: any) =>
                  tier?._id === tierId
                    ? { ...tier, rewards: tier?.rewards?.filter((reward: any) => reward?._id !== rewardId) }
                    : tier
                ),
              }
            : condition
        );
        setCampaignCriteriaFormStore(newCampaignCriteriaForm);
      }
    });
  };

  // =-=-=-=-=-= handle  Modal Reward Master =-=-=-=-=-=

  // show modal reward
  const handleAddReward = (conditionId: string, tierId: string, rewardId: string) => {
    setModalReward({ ...modalReward, conditionId, tierId, rewardId, isShow: true });
  };

  const handleCloseModalReward = () => {
    setRewardFormStore(initRewardFormStore);
    setModalReward(initModalReward);
  };

  const handleSubmitModalReward = (payload: any) => {
    SwalCustom.fire({
      icon: 'warning',
      title: `คุณต้องการบันทึกข้อมูลหรือไม่?`,
      cancelButtonText: 'ไม่',
      confirmButtonText: 'ใช่',
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await createReward({ ...payload, isCampaign: true });
          const { success, ...data } = res;
          if (success) {
            const rewards = await getRewardList({ rewardType: data?.rewardType, campaignId: campaignId });
            const newCampaignCriteriaForm = campaignCriteriaFormStore?.map((condition: any) =>
              condition?._id === modalReward?.conditionId
                ? {
                    ...condition,
                    spendingConditions: condition?.spendingConditions?.map((spending: any) =>
                      spending?._id === modalReward?.tierId
                        ? {
                            ...spending,
                            rewards: spending?.rewards?.map((reward: any) =>
                              reward?._id === modalReward?.rewardId
                                ? {
                                    ...reward,
                                    ...data,
                                    rewardList: rewards,
                                  }
                                : reward
                            ),
                          }
                        : spending
                    ),
                  }
                : condition
            );
            SwalCustom.fire(`สร้าง Reward สำเร็จ`, '', 'success');
            setCampaignCriteriaFormStore(newCampaignCriteriaForm);
          }
        } catch (error: any) {
          SwalCustom.fire(`เกิดข้อผิดพลาด`, error?.errorMessageTh, 'error');
        } finally {
          setModalReward({ ...modalReward, isShow: false });
          setRewardFormStore(initRewardFormStore);
        }
      }
    });
  };

  // =-=-=-=-=-= handle Modal Adjustment Reward =-=-=-=-=-=

  const handleOpenModalAdjustmentReward = async (
    conditionId: string,
    tierId: string,
    rewardId: string,
    isShard: boolean
  ) => {
    //fetch data
    setIsLoading(true);
    try {
      const res = await getRewardById(rewardId, {
        isAdjustment: true,
        rewardGroupType: isShard ? RewardGroupTypeEnum?.SHARED_REWARD : RewardGroupTypeEnum?.CAMPAIGN_REWARD,
      });
      const { success, ...reward } = res;
      if (success) {
        setRewardForm({ ...reward, isRewardSharing: isShard });
        setModalAdjustmentReward({
          ...modalAdjustmentReward,
          conditionId,
          tierId,
          rewardId,
          isShow: true,
          isRewardSharing: isShard,
        });
      }
    } catch (error: any) {
      setModalAdjustmentReward(initModalAdjustmentReward);
      SwalCustom.fire(`เกิดข้อผิดพลาด`, error?.errorMessageTh, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModalAdjustmentReward = () => {
    setModalAdjustmentReward(initModalAdjustmentReward);
  };

  const handleSubmitModalAdjustmentReward = async (data: AdjustmentRewardFormType): Promise<boolean> => {
    const payload = {
      ...data,
      isRewardSharing: modalAdjustmentReward?.isRewardSharing,
    };
    setIsLoading(true);
    try {
      const res = await adjustmentReward(modalAdjustmentReward?.rewardId, payload);
      if (res?.success) {
        setRewardForm(initRewardForm);

        const newCampaignCriteriaForm = campaignCriteriaFormStore?.map((condition: any) =>
          condition?._id === modalAdjustmentReward?.conditionId
            ? {
                ...condition,
                spendingConditions: condition?.spendingConditions?.map((spending: any) =>
                  spending?._id === modalAdjustmentReward?.tierId
                    ? {
                        ...spending,
                        rewards: spending?.rewards?.map((reward: any) => {
                          if (reward?._id === modalAdjustmentReward?.rewardId) {
                            let totalRewardQty = reward?.totalRewardQty;
                            if (data?.rewardAdjustmentType === AdjustmentTypeEnum?.INCREASE && data?.quantity) {
                              totalRewardQty = reward?.totalRewardQty + data?.quantity;
                            }
                            if (data?.rewardAdjustmentType === AdjustmentTypeEnum?.DECREASE && data?.quantity) {
                              totalRewardQty = reward?.totalRewardQty - data?.quantity;
                            }
                            return {
                              ...reward,
                              totalRewardQty,
                              totalRewardValue: totalRewardQty * reward?.rewardValue,
                            };
                          } else {
                            return reward;
                          }
                        }),
                      }
                    : spending
                ),
              }
            : condition
        );
        setCampaignCriteriaFormStore(newCampaignCriteriaForm);
        setModalAdjustmentReward(initModalAdjustmentReward);
        return true;
      }
    } catch (error: any) {
      setModalAdjustmentReward(initModalAdjustmentReward);
      SwalCustom.fire(`เกิดข้อผิดพลาด`, error?.errorMessageTh, 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
    return false;
  };

  // =-=-=-=-=-= handle  Header Button =-=-=-=-=-=

  //click button cancel
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
        clearStore();
        router.push('/campaign');
      }
    });
  };

  //click button save draft
  const handleSaveDraft = async () => {
    if (campaignStore?.step === StepCampaignEnum?.INFORMATION) {
      // check id
      // if id => patch save-draft-information
      // else => post campaign
      setIsLoading(true);
      const payload = transformPayloadCampaignInfo({
        campaignId: campaignInfoFormStore?._id,
        infoForm: campaignInfoFormStore,
      });
      try {
        const res = await draftCampaignInfo(payload);
        if (res?.id) {
          //show noti
          const campaignConditions = await transformResToCampaignCriteriaForm({
            isFindRewardList: true,
            conditions: res?.campaignConditions,
            campaignId: campaignInfoFormStore?._id,
          });
          if (campaignConditions?.length) {
            setCampaignCriteriaFormStore(campaignConditions);
          }
          SwalCustom.fire(`บันทึกแคมเปญสำเร็จ`, '', 'success').then(() => {
            setCampaignInfoFormStore({ ...campaignInfoFormStore, _id: res?.id, campaignCode: res?.campaignCode });
            setStatus({ ...status, formStatus: res?.formStatus });
          });
        }
      } catch (error: any) {
        SwalCustom.fire(`เกิดข้อผิดพลาด`, error?.errorMessageTh, 'error');
      } finally {
        setIsLoading(false);
      }
    }
    if (campaignStore?.step === StepCampaignEnum?.CRITERIA) {
      setIsLoading(true);
      const payload = transformPayloadCampaignCriteria({
        campaignId: campaignInfoFormStore?._id,
        criteriaForm: campaignCriteriaFormStore,
      });
      try {
        const res = await draftCampaignCriteria(payload);
        if (res?.id) {
          //show noti
          const campaignData = await getCampaignById(res?.id);
          const campaignConditions = await transformResToCampaignCriteriaForm({
            isFindRewardList: true,
            conditions: campaignData?.data?.campaignConditions,
            campaignId: campaignInfoFormStore?._id,
          });
          if (campaignConditions?.length) {
            setCampaignCriteriaFormStore(campaignConditions);
          }
          SwalCustom.fire(`บันทึกแคมเปญสำเร็จ`, '', 'success');
        }
      } catch (error: any) {
        SwalCustom.fire(`เกิดข้อผิดพลาด`, error?.errorMessageTh, 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  //click button next, step info
  const handleClickNext = async () => {
    //check validate step 1
    //set store
    if (
      isEqual(
        {
          ...campaignInfoFormStore,
          campaignBudget: campaignInfoFormStore?.campaignBudget || null,
        },
        campaignInfoFormClone
      )
    ) {
      setFocus({
        isFocus: true,
        name: 'condition.0.conditionGroup',
      });
      setCampaignStore({ ...campaignStore, step: 2 });
      return;
    }
    setIsLoading(true);
    const payload = transformPayloadCampaignInfo({
      campaignId: campaignInfoFormStore?._id,
      infoForm: campaignInfoFormStore,
    });

    try {
      const res = await draftCampaignInfo(payload);
      if (res?.id) {
        setCampaignInfoFormStore({ ...campaignInfoFormStore, _id: res?.id, campaignCode: res?.campaignCode });
        setCampaignStore({ ...campaignStore, step: 2 });
        setStatus({ ...status, formStatus: res?.formStatus });
        setFocus({
          isFocus: true,
          name: 'condition.0.conditionGroup',
        });
      }
    } catch (error: any) {
      SwalCustom.fire(`เกิดข้อผิดพลาด`, error?.errorMessageTh, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickNextToCriteria = async () => {
    setCampaignStore({ ...campaignStore, step: 2 });
    setFocus({
      isFocus: true,
      name: 'condition.0.conditionGroup',
    });
  };

  const handleClickNextEdit = async () => {
    //check validate step 1
    //set store
    if (
      isEqual(
        {
          ...campaignInfoFormStore,
          campaignBudget: campaignInfoFormStore?.campaignBudget || null,
        },
        campaignInfoFormClone
      )
    ) {
      setFocus({
        isFocus: true,
        name: 'condition.0.conditionGroup',
      });
      setCampaignStore({ ...campaignStore, step: 2 });
      return;
    }
    setIsLoading(true);
    if (status?.campaignStarting) {
      const payload = transformPayloadUpdateSpecialCampaign({
        infoForm: campaignInfoFormStore,
        criteriaForm: campaignCriteriaFormStore,
      });
      try {
        const res = await updateSpecialCampaign(campaignInfoFormStore?._id, payload);
        if (res?.success) {
          setCampaignStore({ ...campaignStore, step: 2 });
          setFocus({
            isFocus: true,
            name: 'condition.0.conditionGroup',
          });
        }
      } catch (error: any) {
        SwalCustom.fire(`เกิดข้อผิดพลาด`, error?.errorMessageTh, 'error');
      } finally {
        setIsLoading(false);
      }
    } else {
      const payload = transformPayloadSubmitCampaignWithId({
        campaignId: campaignInfoFormStore?._id,
        infoForm: campaignInfoFormStore,
        criteriaForm: campaignCriteriaFormStore,
      });
      try {
        const res = await createCampaign(payload);
        if (res?.success) {
          setCampaignStore({ ...campaignStore, step: 2 });
          const campaignConditions = await transformResToCampaignCriteriaForm({
            isFindRewardList: true,
            conditions: res?.campaignConditions,
            campaignId: campaignInfoFormStore?._id,
          });
          if (campaignConditions?.length) {
            setCampaignCriteriaFormStore(campaignConditions);
          }
          setFocus({
            isFocus: true,
            name: 'condition.0.conditionGroup',
          });
        }
      } catch (error: any) {
        SwalCustom.fire(`เกิดข้อผิดพลาด`, error?.errorMessageTh, 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  //click button submit, step criteria
  const handleClickSubmit = async () => {
    //check validate step 2
    setIsLoading(true);
    const payload = transformPayloadSubmitCampaign({
      campaignId: campaignInfoFormStore?._id,
      infoForm: campaignInfoFormStore,
      criteriaForm: campaignCriteriaFormStore,
    });
    // console.log('payload', payload);
    try {
      const res = await createCampaign(payload);
      if (res?.success) {
        SwalCustom.fire(`สร้างแคมเปญ ${res?.campaignCode} สำเร็จ`, '', 'success').then(() => {
          router?.push('/campaign');
        });
      }
    } catch (error: any) {
      SwalCustom.fire(`เกิดข้อผิดพลาด`, error?.errorMessageTh, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // updateCampaign
  const handleClickUpdateCampaign = async () => {
    //check validate step 2
    setIsLoading(true);

    const payload = transformPayloadSubmitCampaignWithId({
      campaignId: campaignInfoFormStore?._id,
      infoForm: campaignInfoFormStore,
      criteriaForm: campaignCriteriaFormStore,
    });
    try {
      const res = await createCampaign(payload);
      if (res?.success) {
        SwalCustom.fire(`แก้ไขแคมเปญ ${res?.campaignCode} สำเร็จ`, '', 'success').then(() => {
          router?.push('/campaign');
        });
      }
    } catch (error: any) {
      SwalCustom.fire(`เกิดข้อผิดพลาด`, error?.errorMessageTh, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // updateCampaign
  const handleClickUpdateSpecialCampaign = async () => {
    //check validate step 2
    setIsLoading(true);

    const payload = transformPayloadUpdateSpecialCampaign({
      infoForm: campaignInfoFormStore,
      criteriaForm: campaignCriteriaFormStore,
    });
    try {
      const res = await updateSpecialCampaign(campaignInfoFormStore?._id, payload);
      if (res?.success) {
        SwalCustom.fire(`แก้ไขแคมเปญ ${res?.campaignCode} สำเร็จ`, '', 'success').then(() => {
          router?.push('/campaign');
        });
      }
    } catch (error: any) {
      SwalCustom.fire(`เกิดข้อผิดพลาด`, error?.errorMessageTh, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading: isMasterLoading || isLoading,
    isShowModalReward: modalReward?.isShow,
    isShowModalAdjustmentReward: modalAdjustmentReward?.isShow,
    isAdjustmentReward:
      status?.campaignStarting &&
      status?.formStatus === FormStatusEnum?.SUBMITTED &&
      campaignInfoFormStore?.campaignStatus === StatusCampaignEnum?.ACTIVATED,
    campaignInfoForm: campaignInfoFormStore,
    campaignCriteriaForm: campaignCriteriaFormStore,
    methodsForm,
    rewardForm,
    status,
    onChangeInputInfo,
    onChangeInputCriteria,
    onChangeInputBuildingOther,
    onChangeConditionQuotaInput,
    onChangeInputSpending,
    onChangeInputReward,
    onChangeQuotaRewardInput,
    onChangeQuotaWeeklyRewardInput,
    handleAddPlanQuotaWeeklyReward,
    handleDeletePlanQuotaWeeklyReward,
    handleClickCancel,
    handleClickNext: methodsForm?.handleSubmit(handleClickNext),
    handleSaveDraft,
    handleAddCampaignCondition,
    handleAddTierCampaignCondition,
    handleAddRewardCampaignCondition,
    handleToggleExpandCondition,
    handleToggleExpandTier,
    handleToggleExpandReward,
    handleDeleteCondition,
    handleDeleteTier,
    handleDeleteReward,
    handleClickSubmit: methodsForm?.handleSubmit(handleClickSubmit),
    handleClickUpdateCampaign: methodsForm?.handleSubmit(handleClickUpdateCampaign),
    handleClickNextEdit: methodsForm?.handleSubmit(handleClickNextEdit),
    handleClickNextToCriteria,
    handleClickUpdateSpecialCampaign: methodsForm?.handleSubmit(handleClickUpdateSpecialCampaign),
    handleAddReward,
    handleCloseModalReward,
    handleSubmitModalReward,
    handleOpenModalAdjustmentReward,
    handleCloseModalAdjustmentReward,
    handleSubmitModalAdjustmentReward,
  };
};

export default useCampaignForm;
