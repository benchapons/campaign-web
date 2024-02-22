import { useEffect, useMemo, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';

import useMasterData from './useMasterData';
import { SwalCustom } from '@/configurations/alert';
import { MasterStatusTypeEnum } from '@/constants/enum';
import { ChangeEventBaseType, ChangeEventFileType, OptionsDropdown } from '@/types/event.interface';
import { AuthorizedUserType } from '@/types/auth.type';
import { masterStore } from '@/store/master-management';
import { MasterFormType } from '@/types/master-management.type';
import { transformPayloadCreateMaster, transformPayloadUpdateMaster } from '@/dto/master/payload-master.dto';
import { createMaster, getMasterById, updateMaster } from '@/services/client/master-manament.service';
import { getMasterData } from '@/services/client/master.service';
import { transformResponseToMasterForm } from '@/dto/master/master.dto';
import { regexFormat } from '@/constants/global';

const useMasterForm = (authorizedUser: AuthorizedUserType) => {
  const router = useRouter();
  const { isMasterLoading, groupList } = useMasterData();
  const { masterId } = router?.query;

  const [masterForm, setMasterForm] = useRecoilState<MasterFormType>(masterStore);
  const [parentList, setParentList] = useState<OptionsDropdown[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const schema = useMemo(() => {
    return yup.object().shape({
      group: yup.string().required('กรุณาระบุ'),
      value: yup.string().required('กรุณาระบุ'),
      nameTH: yup.string().required('กรุณาระบุ'),
      nameEN: yup.string().required('กรุณาระบุ'),
      status: yup.string().required('กรุณาระบุ'),
      ...(masterForm?.group === 'BANK' && {
        description: yup
          .string()
          .length(7, 'ระบุ code สี ความยาว 7 ตัวอักษร (ตัวอย่าง #000000)')
          .matches(regexFormat.colorCode, 'format code สี ไม่ถูกต้อง (ตัวอย่าง #000000)'),
      }),
    });
  }, [masterForm]);

  const methodsForm = useForm({
    defaultValues: {
      group: '',
      value: '',
      nameTh: '',
      nameEn: '',
      status: MasterStatusTypeEnum?.ACTIVE,
      description: '',
    },
    values: {
      group: masterForm.group,
      value: masterForm?.group,
      nameTH: masterForm?.nameTH,
      nameEN: masterForm?.nameEN,
      status: masterForm?.status,
      description: masterForm?.status,
    },
    resetOptions: {
      keepDirtyValues: true, // user-interacted input will be retained
      keepErrors: true, // input errors will be retained with value update
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setMasterForm({ ...masterForm, attachment: null });
    if (!router?.isReady || !(masterId && groupList.length)) return;

    fetchData(masterId as string, groupList);
  }, [router?.query, groupList]);

  useEffect(() => {
    if (!masterForm?.groupParent) return;
    fetchParentData(masterForm?.groupParent);
  }, [masterForm?.groupParent]);

  const fetchData = async (masterId: string, groupList: OptionsDropdown[]) => {
    setIsLoading(true);
    try {
      const res = await getMasterById(masterId);
      const data = transformResponseToMasterForm(res?.data);
      const groupValue = groupList?.find((item: any) => {
        return item?.prefix === String(res?.data?.parentID)?.substring(0, 2);
      })?.value;
      setMasterForm({ ...data, groupParent: groupValue });
    } catch (error: any) {
      SwalCustom.fire(`เกิดข้อผิดพลาด`, error?.errorMessageTh, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchParentData = async (group: string) => {
    try {
      const res = await getMasterData(group);
      setParentList(res);
      if (masterForm?.parentID) {
        const findParent = res?.find((i: OptionsDropdown) => i?.masterId === masterForm?.parentID);
        setMasterForm({ ...masterForm, parent: findParent?.value });
      }
    } catch (error: any) {
      SwalCustom.fire(`เกิดข้อผิดพลาด`, error?.errorMessageTh, 'error');
    }
  };

  const onChangeInput = ({ name, value, masterId, ...data }: ChangeEventBaseType<string | boolean | number>) => {
    setMasterForm({
      ...masterForm,
      [name]: value,
      ...(name === 'parent' && { parentID: masterId }),
      ...(name === 'group' && { masterId: `${data?.data?.prefix}XX` }),
    });
  };

  const onChangeFile = (data: ChangeEventFileType) => {
    setMasterForm({ ...masterForm, attachment: data?.value });
  };

  const onDeleteFile = () => {
    setMasterForm({ ...masterForm, attachment: null });
  };

  const onDeleteExistedFile = () => {
    setMasterForm({ ...masterForm, existedFile: '' });
  };

  const handleClickCancelMaster = () => {
    // back to campaign list
    SwalCustom.fire({
      icon: 'warning',
      title: `คุณต้องการยกเลิกการบันทึกข้อมูลหรือไม่?`,
      cancelButtonText: 'ไม่',
      confirmButtonText: 'ใช่',
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        router.push('/master');
      }
    });
  };
  const handleClickSubmitMaster = async () => {
    //check validate
    //api submit
    const payload = await transformPayloadCreateMaster(masterForm);
    // console.log('payload', payload);
    SwalCustom.fire({
      icon: 'warning',
      title: `คุณต้องการบันทึกข้อมูลหรือไม่?`,
      cancelButtonText: 'ไม่',
      confirmButtonText: 'ใช่',
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await createMaster({ ...payload });
          SwalCustom.fire(`สร้าง Master สำเร็จ`, `masterId: ${res?.masterId} ${res?.nameTH}`, 'success').then(() => {
            router?.push('/master');
          });
        } catch (error: any) {
          SwalCustom.fire(`เกิดข้อผิดพลาด`, error?.errorMessageTh, 'error');
        }
      }
    });
  };

  const handleClickUpdateMaster = async () => {
    //check validate
    //api submit

    if (!masterForm?._id) return;

    const payload = await transformPayloadUpdateMaster(masterForm);
    // console.log('payload', payload);
    SwalCustom.fire({
      icon: 'warning',
      title: `คุณต้องการบันทึกข้อมูลหรือไม่?`,
      cancelButtonText: 'ไม่',
      confirmButtonText: 'ใช่',
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed && masterForm?._id) {
        try {
          setIsLoading(true);
          const res = await updateMaster(masterForm?._id, payload);
          if (res?.success) {
            SwalCustom.fire(`อัพเดn Master สำเร็จ`, '', 'success').then(() => {
              router?.push('/master');
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

  return {
    isLoading: isMasterLoading || isLoading,
    masterForm,
    methodsForm,
    masterData: { groupList, parentList },
    onChangeInput,
    onChangeFile,
    onDeleteFile,
    handleClickCancelMaster,
    handleClickUpdateMaster: methodsForm?.handleSubmit(handleClickUpdateMaster),
    handleClickSubmitMaster: methodsForm?.handleSubmit(handleClickSubmitMaster),
    onDeleteExistedFile,
    // handleClickSubmitMaster,
  };
};

export default useMasterForm;
