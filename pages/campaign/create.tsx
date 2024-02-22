import { useRecoilValue } from 'recoil';

import Button from '@/components/common/Button';
import CampaignForm from '@/components/features/campaign/CampaignForm';
import { Loader } from '@/components/Loader';

import withSession from '@/hoc/withSession';
import useCampaignForm from '@/hooks/campaign/useCampaignForm';

import { campaignDetailState } from '@/store/campaign';
import { campaignMasterState } from '@/store/master-campaign';
import { rewardMasterState } from '@/store/master-reward';
import { StepCampaignEnum } from '@/constants/enum';
import { FormProvider } from 'react-hook-form';
import { PagePermission } from '@/constants/auth';
import HeaderCampaignCreate from '@/components/features/campaign/header/HeaderCampaignCreate';

const CreateCampaignPage = ({ authorizedUser }: any) => {
  const {
    isLoading,
    status,
    isAdjustmentReward,
    isShowModalReward,
    isShowModalAdjustmentReward,
    campaignInfoForm,
    campaignCriteriaForm,
    methodsForm,
    rewardForm,
    onChangeInputInfo,
    onChangeInputCriteria,
    onChangeInputBuildingOther,
    onChangeConditionQuotaInput,
    onChangeInputSpending,
    onChangeInputReward,
    onChangeQuotaRewardInput,
    onChangeQuotaWeeklyRewardInput,
    handleAddPlanQuotaWeeklyReward,
    handleDeletePlanQuotaWeeklyReward,
    handleClickCancel,
    handleClickNext,
    handleSaveDraft,
    handleAddCampaignCondition,
    handleAddTierCampaignCondition,
    handleAddRewardCampaignCondition,
    handleToggleExpandCondition,
    handleToggleExpandTier,
    handleToggleExpandReward,
    handleDeleteCondition,
    handleDeleteTier,
    handleDeleteReward,
    handleClickSubmit,
    handleAddReward,
    handleCloseModalReward,
    handleSubmitModalReward,
    handleOpenModalAdjustmentReward,
    handleCloseModalAdjustmentReward,
    handleSubmitModalAdjustmentReward,
  } = useCampaignForm(authorizedUser);
  const campaignStore = useRecoilValue(campaignDetailState);
  const masterData = useRecoilValue(campaignMasterState);
  const masterDataReward = useRecoilValue(rewardMasterState);
  return (
    <div>
      {isLoading && <Loader />}
      <HeaderCampaignCreate
        textButtonSubmit={campaignStore?.step === StepCampaignEnum?.INFORMATION ? 'Next' : 'Submit'}
        campaignCode={campaignInfoForm?.campaignCode}
        campaignStatus={status?.formStatus}
        handleClickCancel={handleClickCancel}
        handleSaveDraft={handleSaveDraft}
        handleClickSubmit={
          campaignStore?.step === StepCampaignEnum?.INFORMATION ? () => handleClickNext() : () => handleClickSubmit()
        }
      />
      <div className="overflow-auto h-[calc(100vh-116px)] px-5 pb-5">
        <FormProvider {...methodsForm}>
          <CampaignForm
            isShowModalReward={isShowModalReward}
            isShowModalAdjustmentReward={isShowModalAdjustmentReward}
            status={status}
            isAdjustmentReward={isAdjustmentReward}
            authorizedUser={authorizedUser}
            step={campaignStore?.step}
            campaignInfoForm={campaignInfoForm}
            campaignCriteriaForm={campaignCriteriaForm}
            rewardForm={rewardForm}
            masterData={{ ...masterData, ...masterDataReward }}
            onChangeInputInfo={onChangeInputInfo}
            onChangeInputCriteria={onChangeInputCriteria}
            onChangeInputBuildingOther={onChangeInputBuildingOther}
            onChangeConditionQuotaInput={onChangeConditionQuotaInput}
            onChangeInputSpending={onChangeInputSpending}
            onChangeInputReward={onChangeInputReward}
            onChangeQuotaRewardInput={onChangeQuotaRewardInput}
            onChangeQuotaWeeklyRewardInput={onChangeQuotaWeeklyRewardInput}
            handleAddPlanQuotaWeeklyReward={handleAddPlanQuotaWeeklyReward}
            handleDeletePlanQuotaWeeklyReward={handleDeletePlanQuotaWeeklyReward}
            handleAddCampaignCondition={handleAddCampaignCondition}
            handleAddTierCampaignCondition={handleAddTierCampaignCondition}
            handleAddRewardCampaignCondition={handleAddRewardCampaignCondition}
            handleToggleExpandCondition={handleToggleExpandCondition}
            handleToggleExpandTier={handleToggleExpandTier}
            handleToggleExpandReward={handleToggleExpandReward}
            handleDeleteCondition={handleDeleteCondition}
            handleDeleteTier={handleDeleteTier}
            handleDeleteReward={handleDeleteReward}
            handleAddReward={handleAddReward}
            handleCloseModalReward={handleCloseModalReward}
            handleSubmitModalReward={handleSubmitModalReward}
            handleOpenModalAdjustmentReward={handleOpenModalAdjustmentReward}
            handleCloseModalAdjustmentReward={handleCloseModalAdjustmentReward}
            handleSubmitModalAdjustmentReward={handleSubmitModalAdjustmentReward}
          />
        </FormProvider>
      </div>
    </div>
  );
};

export default withSession(CreateCampaignPage, PagePermission.campaignCreate);
