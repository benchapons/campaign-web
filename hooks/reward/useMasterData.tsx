import axios, { CancelToken } from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

import { SwalCustom } from '@/configurations/alert';
import { getMasterData } from '@/services/client/master.service';
import { rewardMasterState, RewardMasterStateType } from '@/store/master-reward';

const useMasterData = () => {
  const router = useRouter();
  const [masterDataStore, setMasterDataStore] = useRecoilState(rewardMasterState);

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
    const getCampaignType = checkMasterData(masterDataStore?.rewardTypeList, 'REWARD_TYPE', cancelToken);

    Promise.all([getCampaignType])
      .then(([_type]) => {
        setMasterDataStore((prev: RewardMasterStateType) => ({
          ...prev,
          ...(_type && { rewardTypeList: _type }),
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
    rewardTypeList: masterDataStore?.rewardTypeList,
  };
};
export default useMasterData;
