import { MdAdd } from 'react-icons/md';
import { Tooltip } from 'react-tooltip';

import { SearchInput } from '@/components/common/TextInput';
import Button from '@/components/common/Button';
import { ModalWithCloseButton } from '@/components/common/Modal';
import ReloadButton from '@/components/shared/ReloadButton';
import RewardTrackingTable from '@/components/common/Table/RewardTrackingTable';
import CampaignTable from '@/components/common/Table/CampaignTable';

import withSession from '@/hoc/withSession';
import { isPagePermission } from '@/utilities/auth';
import useCampaignList from '@/hooks/campaign/useCampaignList';
import { PagePermission, Permission } from '@/constants/auth';
import { HeaderCampaignList } from '@/components/features/campaign/header';

const CampaignPage = ({ authorizedUser }: any) => {
  const {
    isLoading,
    isShowModalReward,
    isShowCloseBtn,
    campaignList,
    rewardList,
    keyword,
    handleClickAddCampaign,
    handleCloseModalReward,
    handleClearSearchCampaign,
    handleChangeSearch,
    handleClickReload,
    handleClickEdit,
    handleClickDelete,
    handleClickDuplicate,
    handleClickReward,
    handleClickAuditLog,
  } = useCampaignList(authorizedUser);

  return (
    <div>
      <HeaderCampaignList authorizedUser={authorizedUser} handleClickAddCampaign={handleClickAddCampaign} />
      <div className="overflow-auto h-[calc(100vh-61px)] px-5">
        <div className="flex mb-5 w-full mt-5">
          <SearchInput
            className="w-full"
            value={keyword}
            isShowCloseBtn={isShowCloseBtn}
            onReset={handleClearSearchCampaign}
            onChange={handleChangeSearch}
          />
          <ReloadButton handleClickReload={handleClickReload} />
        </div>
        <CampaignTable
          isLoading={isLoading}
          dataList={campaignList}
          authorizedUser={authorizedUser}
          onClickEdit={handleClickEdit}
          onClickDelete={handleClickDelete}
          onClickDuplicate={handleClickDuplicate}
          onClickReward={handleClickReward}
          onClickAuditLog={handleClickAuditLog}
        />
      </div>
      <ModalWithCloseButton title="Reward Tracking" isOpen={isShowModalReward} onClose={handleCloseModalReward}>
        <RewardTrackingTable rewardTracking={rewardList} isLoading={isLoading} />
      </ModalWithCloseButton>
      <Tooltip id="campaign-tooltip" />
    </div>
  );
};

export default withSession(CampaignPage, PagePermission.campaignSearch);
