import axios, { CancelToken } from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

import { SwalCustom } from '@/configurations/alert';
import { getMasterData } from '@/services/client/master.service';
import { MasterListStateType, masterListStore } from '@/store/master-management';

const useMasterData = () => {
  const router = useRouter();
  const [masterDataStore, setMasterDataStore] = useRecoilState(masterListStore);

  const [isMasterLoading, setIsMasterLoading] = useState(true);

  useEffect(() => {
    const cancelToken = axios.CancelToken.source();
    fetchData(cancelToken.token);
    return () => {
      cancelToken.cancel();
      setIsMasterLoading(true);
    };
  }, []);

  const checkMasterData = (master: any[], channel: string, cancelToken: CancelToken) => {
    if (master?.length) return Promise.resolve();
    return getMasterData(channel, cancelToken);
  };

  const fetchData = (cancelToken: CancelToken) => {
    const getGroupType = checkMasterData(masterDataStore?.groupList, 'GROUP_MASTER', cancelToken);

    Promise.all([getGroupType])
      .then(([_groups]) => {
        setMasterDataStore((prev: MasterListStateType) => ({
          ...prev,
          ...(_groups && { groupList: _groups }),
        }));
      })
      .catch((error) => {
        SwalCustom.fire(`เกิดข้อผิดพลาด`, error?.errorMessageTh, 'error').then(() => {
          router.reload();
        });
      })
      .finally(() => {
        setIsMasterLoading(false);
      });
  };

  return {
    isMasterLoading,
    groupList: masterDataStore?.groupList,
  };
};
export default useMasterData;
