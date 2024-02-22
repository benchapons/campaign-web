import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSetRecoilState } from 'recoil';

import { AuthorizedUserType } from '@/types/auth.type';
import { deleteMaster, getMasterList } from '@/services/client/master-manament.service';
import { initMasterFormStore, masterStore } from '@/store/master-management';
import { MasterFormType } from '@/types/master-management.type';
import { SwalCustom } from '@/configurations/alert';
import { ChangeEventBaseType, OptionsDropdown } from '@/types/event.interface';
import { getMasterData } from '@/services/client/master.service';
import { AUDIT_LOG_PAGE } from '@/constants/auditlog';

const useMasterList = (authorizedUser: AuthorizedUserType) => {
  const router = useRouter();
  const setMasterForm = useSetRecoilState<MasterFormType>(masterStore);

  const [isLoading, setIsLoading] = useState(true);
  const [masterList, setMasterList] = useState([]);
  const [groupMasterList, setGroupMasterList] = useState<OptionsDropdown[]>([]);
  const [groupMaster, setGroupMaster] = useState<string>('');

  //search
  const [initMasterList, setInitMasterList] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [isShowCloseBtn, setIsShowCloseBtn] = useState(false);

  useEffect(() => {
    setMasterForm(initMasterFormStore);
    if (!isLoading) return;
    fetchData();
    return () => {
      setIsLoading(true);
    };
  }, []);

  useEffect(() => {
    if (groupMaster) handleSearch(groupMaster);
    else fetchData();
  }, [groupMaster]);

  const fetchData = () => {
    Promise.all([getMasterData('GROUP_MASTER')])
      .then(async ([_groupMaster]) => {
        setMasterList([]);
        setInitMasterList([]);
        setGroupMasterList(_groupMaster);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };
  const handleClickAddMaster = () => {
    router.push(`master/create`);
  };

  const handleSearch = (group: string) => {
    getMasterList({ group: group })
      .then((_masterList) => {
        setMasterList(_masterList);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  const handleClickEditMaster = (masterId: string) => {
    router.push(`master/edit/${masterId}`);
  };

  const handleClickDeleteMaster = (masterId: string, name: string) => {
    SwalCustom.fire({
      icon: 'warning',
      title: `คุณต้องการที่จะ Inactive ${name} ใช่หรือไม่?`,
      cancelButtonText: 'ไม่',
      confirmButtonText: 'ใช่',
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setIsLoading(true);
          const res = await deleteMaster(masterId);
          if (res?.success) {
            SwalCustom.fire(`ลบ Master ${name} สำเร็จ`, '', 'success').then(() => {
              groupMaster && handleSearch(groupMaster);
            });
          }
        } catch (error: any) {
          SwalCustom.fire(`ขออภัย`, error?.errorMessageTh, 'error');
        } finally {
          setIsLoading(false);
        }
      }
    });
  };

  const handleClickAuditLog = (ownerId: string) => {
    router.push(`auditlogs/${ownerId}?page=${AUDIT_LOG_PAGE.MASTER}`);
  };

  const handleChangeGroupMaster = (event: ChangeEventBaseType) => {
    setGroupMaster(event?.value);
  };

  return {
    isLoading,
    masterList,
    handleClickAddMaster,
    handleClickEditMaster,
    handleClickDeleteMaster,
    handleClickAuditLog,
    handleChangeGroupMaster,
    groupMasterList,
    groupMaster,
  };
};

export default useMasterList;
