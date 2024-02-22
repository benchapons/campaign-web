import axios, { CancelToken } from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { SwalCustom } from '@/configurations/alert';
import { getMasterData } from '@/services/client/master.service';
import { CampaignMasterState, campaignMasterState } from '@/store/master-campaign';
import { campaignDetailState } from '@/store/campaign';
import { rewardMasterState, RewardMasterStateType } from '@/store/master-reward';
import { StepCampaignEnum } from '@/constants/enum';
import { OptionsDropdown } from '@/types/event.interface';
import { regexFormat } from '@/constants/global';

const useMasterData = () => {
  const router = useRouter();
  const [masterDataStore, setMasterDataStore] = useRecoilState(campaignMasterState);
  const [masterDataRewardStore, setMasterDataRewardStore] = useRecoilState(rewardMasterState);
  const { step } = useRecoilValue(campaignDetailState);

  const [isMasterLoading, setIsMasterLoading] = useState(true);

  useEffect(() => {
    const cancelToken = axios.CancelToken.source();
    if (step === StepCampaignEnum?.INFORMATION) {
      fetchDataInformation(cancelToken.token);
    } else if (step === StepCampaignEnum?.CRITERIA) {
      fetchDataCriteria(cancelToken.token);
    } else {
      setIsMasterLoading(false);
    }
    return () => {
      cancelToken.cancel();
      setIsMasterLoading(true);
    };
  }, [step]);

  const checkMasterData = (master: any[], channel: string, cancelToken: CancelToken) => {
    if (master?.length) return Promise.resolve();
    return getMasterData(channel, cancelToken);
  };

  const fetchDataInformation = (cancelToken: CancelToken) => {
    const getSpendingChannelType = checkMasterData(
      masterDataStore?.spendingChannelList,
      'SPENDING_CHANNEL',
      cancelToken
    );
    const getStatusType = checkMasterData(masterDataStore?.statusList, 'CAMPAIGN_STATUS', cancelToken);
    const getTargetSegmentType = checkMasterData(masterDataStore?.targetSegmentList, 'TARGET_SEGMENT', cancelToken);
    const getCampaignObjectiveType = checkMasterData(
      masterDataStore?.campaignObjectiveList,
      'CAMPAIGN_OBJECTIVE',
      cancelToken
    );

    Promise.all([getSpendingChannelType, getStatusType, getTargetSegmentType, getCampaignObjectiveType])
      .then(([_spendingChannel, _status, _targetSegment, _objective]) => {
        setMasterDataStore((prev: CampaignMasterState) => ({
          ...prev,
          ...(_spendingChannel && { spendingChannelList: _spendingChannel }),
          ...(_status && { statusList: _status }),
          ...(_targetSegment && { targetSegmentList: _targetSegment }),
          ...(_objective && { campaignObjectiveList: _objective }),
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

  const fetchDataCriteria = (cancelToken: CancelToken) => {
    const getCampaignType = checkMasterData(masterDataStore?.campaignTypeList, 'CAMPAIGN_TYPE', cancelToken);
    const getBuildingType = checkMasterData(masterDataStore?.buildingList, 'CAMPAIGN_BUILDING', cancelToken);
    const getRewardType = checkMasterData(masterDataRewardStore?.rewardTypeList, 'REWARD_TYPE', cancelToken);
    const getConditionJoiner = checkMasterData(masterDataStore?.conditionJoinerList, 'CONDITION_JOINER', cancelToken);
    const getBank = checkMasterData(masterDataStore?.bankList, 'BANK', cancelToken);

    Promise.all([getCampaignType, getBuildingType, getRewardType, getConditionJoiner, getBank])
      .then(([_type, _building, _rewardType, _conditionJoiner, _bank]) => {
        setMasterDataStore((prev: CampaignMasterState) => ({
          ...prev,
          ...(_type && { campaignTypeList: _type }),
          ...(_building && { buildingList: _building }),
          ...(_conditionJoiner && { conditionJoinerList: _conditionJoiner }),
          ...(_bank && {
            bankList: _bank?.map((item: OptionsDropdown) => {
              return {
                ...item,
                label: item?.value,
                color: item?.desc && regexFormat.colorCode.test(item?.desc as string) ? item?.desc : '#bababa',
              };
            }),
          }),
        }));
        setMasterDataRewardStore((prev: RewardMasterStateType) => ({
          ...prev,
          ...(_rewardType && { rewardTypeList: _rewardType }),
        }));
      })
      .catch((error) => {
        SwalCustom.fire(`เกิดข้อผิดพลาด`, error?.errorMessageTh, 'error').then(() => {
          router.push('/campaign');
        });
      })
      .finally(() => {
        setIsMasterLoading(false);
      });
  };

  return {
    isMasterLoading,
  };
};
export default useMasterData;
