import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useSetRecoilState } from 'recoil';

import { deleteReward, getRewardList } from '@/services/client/reward.service';

import { SwalCustom } from '@/configurations/alert';
import { ChangeEventBaseType, OptionsDropdown } from '@/types/event.interface';
import { RewardFormType, rewardListType } from '@/types/reward.type';
import { initRewardFormStore, rewardStore } from '@/store/reward';
import { AuthorizedUserType } from '@/types/auth.type';
import { AUDIT_LOG_PAGE } from '@/constants/auditlog';
import { getMasterData } from '@/services/client/master.service';

const useRewardList = (authorizedUser: AuthorizedUserType) => {
  const router = useRouter();
  const setRewardForm = useSetRecoilState<RewardFormType>(rewardStore);

  const [rewardList, setRewardList] = useState<rewardListType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  //search
  const [initRewardList, setInitRewardList] = useState<rewardListType[]>([]);
  const [keyword, setKeyword] = useState('');
  const [isShowCloseBtn, setIsShowCloseBtn] = useState(false);

  useEffect(() => {
    setRewardForm(initRewardFormStore);
    if (!isLoading) return;
    fetchRewardData();
    return () => {
      setIsLoading(true);
    };
  }, []);

  const fetchRewardData = async () => {
    try {
      const res: rewardListType[] = await getRewardList();
      const rewardTypeMaster: OptionsDropdown[] = await getMasterData('REWARD_TYPE');

      const rewardListWithType = res?.map((reward: rewardListType) => {
        return {
          ...reward,
          type: rewardTypeMaster?.find((type) => type?.value === reward?.type)?.label || reward?.type,
        };
      });
      setRewardList(rewardListWithType);
      setInitRewardList(rewardListWithType);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  //handle button audit log
  const handleClickAuditLog = (ownerId: string) => {
    router.push(`auditlogs/${ownerId}?page=${AUDIT_LOG_PAGE.REWARD}`);
  };

  //handle button add
  const handleClickAddReward = () => {
    router.push(`reward/create`);
  };

  //handle action button
  const handleClickEdit = (rewardId: string) => router.push(`reward/edit/${rewardId}`);

  const handleClickDelete = (rewardId: string, name: string) => {
    SwalCustom.fire({
      icon: 'warning',
      title: `คุณต้องการที่จะลบรีวอร์ด ${name} ใช่หรือไม่?`,
      cancelButtonText: 'ไม่',
      confirmButtonText: 'ใช่',
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setIsLoading(true);
          const res = await deleteReward(rewardId);
          if (res?.success) {
            SwalCustom.fire(`ลบรีวอร์ด ${name} สำเร็จ`, '', 'success').then(() => {
              setIsLoading(true);
              fetchRewardData();
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

  // =-=-=-=-=-=-=-=-=-= search =-=-=-=-=-=-=-=-=-=
  const handleChangeSearch = (event: ChangeEventBaseType<string>) => {
    setKeyword(event.value);
  };

  const rewardSearch = useMemo<rewardListType[]>(() => {
    if (!keyword) {
      return rewardList;
    }
    const src = keyword?.toLowerCase()?.trim() || '';
    const listSearch = rewardList.filter(
      (_reward) =>
        _reward?.type?.toLowerCase().indexOf(src) > -1 ||
        _reward?.name?.toLowerCase().indexOf(src) > -1 ||
        _reward?.quantity?.toString()?.toLowerCase().indexOf(src) > -1 ||
        _reward?.value?.toString()?.toLowerCase().indexOf(src) > -1
    );
    return listSearch;
  }, [keyword, rewardList]);

  const handleClearSearchReward = () => {
    setKeyword('');
    setRewardList(initRewardList);
    setIsShowCloseBtn(false);
  };

  const handleClickReload = () => {
    fetchRewardData();
  };

  return {
    isLoading,
    isShowCloseBtn,
    rewardList: rewardSearch,
    keyword,
    handleClickAddReward,
    handleClearSearchReward,
    handleChangeSearch,
    handleClickReload,
    handleClickEdit,
    handleClickDelete,
    handleClickAuditLog,
  };
};
export default useRewardList;
