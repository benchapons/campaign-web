import { Tooltip } from 'react-tooltip';
import { FormProvider } from 'react-hook-form';

import Button from '@/components/common/Button';
import CampaignTrackingTable from '@/components/common/Table/CampaignTrackingTable';
import RewardForm from '@/components/features/reward/RewardForm';
import { Loader } from '@/components/Loader';
import { PagePermission, Permission } from '@/constants/auth';

import withSession from '@/hoc/withSession';
import useRewardForm from '@/hooks/reward/useRewardForm';
import { isPagePermission } from '@/utilities/auth';
import { HeaderRewardEdit } from '@/components/features/reward/header';

const EditRewardPage = ({ authorizedUser }: any) => {
  const {
    isLoading,
    methodsForm,
    rewardForm,
    masterData,
    campaignList,
    onChangeInput,
    onChangeCommaInput,
    onChangeQuotaInput,
    onChangeQuotaWeeklyInput,
    handleAddPlanQuotaWeekly,
    handleDeletePlanQuotaWeekly,
    handleClickCancel,
    handleClickUpdateReward,
    handleClickUpdateSpecialReward,
  } = useRewardForm(authorizedUser);
  return (
    <div>
      {isLoading && <Loader />}
      <HeaderRewardEdit
        rewardName={rewardForm?.rewardName}
        handleClickCancel={handleClickCancel}
        handleClickUpdate={
          rewardForm?.isCampaignStarted ? () => handleClickUpdateSpecialReward() : () => handleClickUpdateReward()
        }
      />
      <div className="overflow-auto h-[calc(100vh-80px)] px-5 pt-5">
        <FormProvider {...methodsForm}>
          <RewardForm
            isEdit
            isCampaignStarted={rewardForm?.isCampaignStarted}
            isPermission={isPagePermission(authorizedUser, [Permission.RWD_UPDATE])}
            rewardForm={rewardForm}
            masterData={masterData}
            onChangeInput={onChangeInput}
            onChangeCommaInput={onChangeCommaInput}
            onChangeQuotaInput={onChangeQuotaInput}
            onChangeQuotaWeeklyInput={onChangeQuotaWeeklyInput}
            handleAddPlanQuotaWeekly={handleAddPlanQuotaWeekly}
            handleDeletePlanQuotaWeekly={handleDeletePlanQuotaWeekly}
          />
        </FormProvider>
        <CampaignTrackingTable isLoading={isLoading} dataList={campaignList} />
      </div>
      <Tooltip id="campaign-tooltip" />
    </div>
  );
};
export default withSession(EditRewardPage, PagePermission.rewardUpdate);
