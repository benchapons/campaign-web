import { Tooltip } from 'react-tooltip';

import withSession from '@/hoc/withSession';

import { SearchInput } from '@/components/common/TextInput';
import ReloadButton from '@/components/shared/ReloadButton';
import RewardTable from '@/components/common/Table/RewardTable';

import useRewardList from '@/hooks/reward/useRewardList';
import { PagePermission } from '@/constants/auth';
import { HeaderRewardList } from '@/components/features/reward/header';

const RewardPage = ({ authorizedUser }: any) => {
  const {
    isLoading,
    isShowCloseBtn,
    rewardList,
    keyword,
    handleClickAddReward,
    handleClearSearchReward,
    handleChangeSearch,
    handleClickReload,
    handleClickEdit,
    handleClickDelete,
    handleClickAuditLog,
  } = useRewardList(authorizedUser);

  return (
    <div>
      <HeaderRewardList authorizedUser={authorizedUser} handleClickAddReward={handleClickAddReward} />
      {/* <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold">Reward</h1>
        {isPagePermission(authorizedUser, [Permission.RWD_CREATE]) && (
          <Button onClick={handleClickAddReward}>
            <MdAdd className="text-xl mr-1" />
            Add Reward
          </Button>
        )}
      </div> */}
      <div className="overflow-auto h-[calc(100vh-61px)] px-5">
        <div className="flex mb-5 w-full mt-5">
          <SearchInput
            className="w-full"
            value={keyword}
            isShowCloseBtn={isShowCloseBtn}
            onReset={handleClearSearchReward}
            onChange={handleChangeSearch}
          />
          <ReloadButton handleClickReload={handleClickReload} />
        </div>
        <RewardTable
          isLoading={isLoading}
          authorizedUser={authorizedUser}
          dataList={rewardList}
          onClickEdit={handleClickEdit}
          onClickDelete={handleClickDelete}
          onClickAuditLog={handleClickAuditLog}
        />
      </div>
      <Tooltip id="reward-tooltip" />
    </div>
  );
};

export default withSession(RewardPage, PagePermission.rewardSearch);
