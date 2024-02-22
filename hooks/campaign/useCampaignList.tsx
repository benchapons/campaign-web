import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useSetRecoilState } from 'recoil';

import {
  deleteCampaign,
  duplicateCampaign,
  getCampaignList,
  ResGetCampaignList,
} from '@/services/client/campaign.service';
import { SwalCustom } from '@/configurations/alert';
import {
  campaignDetailState,
  initCampaignCriteriaForm,
  initCampaignInfoForm,
  initCampaignStore,
  campaignCriteriaState,
  campaignInfoState,
} from '@/store/campaign';
import { ChangeEventBaseType } from '@/types/event.interface';
import { getRewardByCampaignId } from '@/services/client/reward.service';
import { AuthorizedUserType } from '@/types/auth.type';
import { isPagePermission } from '@/utilities/auth';
import { Permission } from '@/constants/auth';
import { AUDIT_LOG_PAGE } from '@/constants/auditlog';

const useCampaignList = (authorizedUser: AuthorizedUserType) => {
  const router = useRouter();
  const setCampaignStore = useSetRecoilState(campaignDetailState);
  const setCampaignInfoFormStore = useSetRecoilState(campaignInfoState);
  const setCampaignCriteriaFormStore = useSetRecoilState(campaignCriteriaState);

  const [campaignList, setCampaignList] = useState<ResGetCampaignList[]>([]);
  const [rewardList, setRewardList] = useState([]);
  const [isShowModalReward, setIsShowModalReward] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  //search
  const [initCampaignList, setInitCampaignList] = useState<ResGetCampaignList[]>([]);
  const [keyword, setKeyword] = useState('');
  const [isShowCloseBtn, setIsShowCloseBtn] = useState(false);

  useEffect(() => {
    if (!isLoading) return;
    fetchCampaignData();
    clearStore();
    return () => {
      setIsLoading(true);
    };
  }, []);

  const fetchCampaignData = async () => {
    try {
      const res: ResGetCampaignList[] = await getCampaignList();
      setCampaignList(res);
      setInitCampaignList(res);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRewardData = async (campaignId: string) => {
    try {
      const res = await getRewardByCampaignId(campaignId);
      return res;
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const clearStore = () => {
    setCampaignStore(initCampaignStore);
    setCampaignInfoFormStore(initCampaignInfoForm);
    setCampaignCriteriaFormStore([initCampaignCriteriaForm]);
  };

  //handle button audit log
  const handleClickAuditLog = (ownerId: string) => {
    router.push(`auditlogs/${ownerId}?page=${AUDIT_LOG_PAGE.CAMPAIGN}`);
  };

  //handle button add
  const handleClickAddCampaign = () => {
    setCampaignStore({
      step: 1,
    });
    router.push(`campaign/create`);
  };

  //handle action button
  const handleClickEdit = (campaignId: string) => {
    const campaign: any = campaignList?.find((i) => i._id === campaignId);

    if (campaign?.isStarted && !isPagePermission(authorizedUser, [Permission.CAMP_AFGL_UPDATE])) {
      SwalCustom.fire(
        'ขออภัย',
        'ไม่สามารถแก้ไขข้อมูล Campaign ได้ เนื่องจาก Campaign Start แล้วหากต้องการแก้ไข กรุณาแจ้ง Supervisor ของท่าน',
        'warning'
      );
      return;
    }

    router.push(`campaign/edit/${campaignId}`);
  };

  const handleClickDuplicate = async (campaignId: string) => {
    setIsLoading(true);
    try {
      const res = await duplicateCampaign(campaignId);
      const { success, ...newCampaign } = res;
      if (success) {
        SwalCustom.fire(`Copy Campaign สำเร็จ`, '', 'success').then(() => {
          router.push(`/campaign/edit/${newCampaign?._id}`);
        });
      }
    } catch (error: any) {
      SwalCustom.fire(`เกิดข้อผิดพลาด`, error?.errorMessageTh, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickDelete = (code: string, campaignId: string) => {
    const campaign = campaignList?.find((i) => i?._id === campaignId);
    if (campaign?.isStarted) {
      SwalCustom.fire(`ขออภัย`, 'ไม่สามารถลบ campaign นี้ได้ เนื่องจาก Campaign กำลังเริ่มใช้งาน', 'error');
      return;
    }
    SwalCustom.fire({
      icon: 'warning',
      title: `คุณต้องการที่จะลบแคมเปญ ${code} ใช่หรือไม่?`,
      cancelButtonText: 'ไม่',
      confirmButtonText: 'ใช่',
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteCampaign(campaignId);
          if (res?.success) {
            SwalCustom.fire(`ลบ Campaign ${code} สำเร็จ`, '', 'success').then(() => {
              setIsLoading(true);
              fetchCampaignData();
            });
          }
        } catch (error: any) {
          SwalCustom.fire(`เกิดข้อผิดพลาด`, error?.errorMessageTh, 'error');
        }
      }
    });
  };

  const handleClickReward = async (campaignId: string) => {
    // const rewards: any = campaignList?.find((i: any) => i?._id === campaignId);
    // setRewardList(rewards?.rewards);
    const result = await fetchRewardData(campaignId);
    setRewardList(result);
    setIsShowModalReward(true);
  };

  const handleCloseModalReward = () => {
    setRewardList([]);
    setIsShowModalReward(false);
  };

  // =-=-=-=-=-=-=-=-=-= search =-=-=-=-=-=-=-=-=-=
  const handleChangeSearch = (event: ChangeEventBaseType<string>) => {
    setKeyword(event.value);
  };

  const campaignSearch = useMemo<ResGetCampaignList[]>(() => {
    if (!keyword) {
      return campaignList;
    }
    const src = keyword?.toLowerCase()?.trim() || '';
    const listSearch = campaignList.filter(
      (_campaign) =>
        _campaign?.building?.toLowerCase().indexOf(src) > -1 ||
        _campaign?.name?.toLowerCase().indexOf(src) > -1 ||
        _campaign?.code?.toLowerCase().indexOf(src) > -1 ||
        _campaign?.cost?.toString()?.toLowerCase().indexOf(src) > -1 ||
        _campaign?.status?.toLowerCase().indexOf(src) > -1
    );
    return listSearch;
  }, [keyword, campaignList]);

  const handleClearSearchCampaign = () => {
    setKeyword('');
    setCampaignList(initCampaignList);
    setIsShowCloseBtn(false);
  };

  const handleClickReload = () => {
    setKeyword('');
    fetchCampaignData();
  };

  return {
    isShowModalReward,
    isShowCloseBtn,
    isLoading,
    campaignList: campaignSearch,
    rewardList,
    keyword,
    handleCloseModalReward,
    handleClickAddCampaign,
    handleClearSearchCampaign,
    handleChangeSearch,
    handleClickReload,
    handleClickEdit,
    handleClickDelete,
    handleClickDuplicate,
    handleClickReward,
    handleClickAuditLog,
  };
};
export default useCampaignList;
