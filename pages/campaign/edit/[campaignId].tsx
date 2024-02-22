import { FormProvider } from 'react-hook-form';
import { useRecoilValue } from 'recoil';

import Button from '@/components/common/Button';
import CampaignForm from '@/components/features/campaign/CampaignForm';
import { Loader } from '@/components/Loader';

import { campaignDetailState } from '@/store/campaign';
import { campaignMasterState } from '@/store/master-campaign';
import { rewardMasterState } from '@/store/master-reward';
import { FormStatusEnum, StepCampaignEnum } from '@/constants/enum';
import withSession from '@/hoc/withSession';
import useCampaignForm from '@/hooks/campaign/useCampaignForm';
import { PagePermission, Permission } from '@/constants/auth';
import { isPagePermission } from '@/utilities/auth';
import Forbidden from '@/components/error/Forbidden';
import HeaderCampaignEdit from '@/components/features/campaign/header/HeaderCampaignEdit';

const EditCampaignPage = ({ authorizedUser }: any) => {
  const {
    isLoading,
    isShowModalReward,
    isShowModalAdjustmentReward,
    status,
    isAdjustmentReward,
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
    handleAddReward,
    handleCloseModalReward,
    handleSubmitModalReward,
    handleClickUpdateCampaign,
    handleClickUpdateSpecialCampaign,
    handleClickNextEdit,
    handleClickNext,
    handleClickNextToCriteria,
    handleOpenModalAdjustmentReward,
    handleCloseModalAdjustmentReward,
    handleSubmitModalAdjustmentReward,
  } = useCampaignForm(authorizedUser);
  const campaignStore = useRecoilValue(campaignDetailState);
  const masterData = useRecoilValue(campaignMasterState);
  const masterDataReward = useRecoilValue(rewardMasterState);

  if (status?.campaignStarting && !isPagePermission(authorizedUser, [Permission.CAMP_AFGL_UPDATE]))
    return <Forbidden />;

  return (
    <div>
      {isLoading && <Loader />}
      <HeaderCampaignEdit
        isShowBtnDraft={status?.formStatus === FormStatusEnum?.DRAFTED}
        isShowBtnNext={campaignStore?.step === StepCampaignEnum?.INFORMATION}
        isShowBtnSubmit={campaignStore?.step === StepCampaignEnum?.CRITERIA && !status?.campaignEnded}
        textButtonSubmit={status?.formStatus === FormStatusEnum?.DRAFTED ? 'Submit' : 'Update'}
        campaignCode={campaignInfoForm?.campaignCode}
        campaignStatus={status?.formStatus}
        campaignStarting={status?.campaignStarting}
        campaignEnded={status?.campaignEnded}
        handleClickCancel={handleClickCancel}
        handleSaveDraft={handleSaveDraft}
        handleClickNext={
          status?.formStatus === FormStatusEnum?.DRAFTED
            ? () => handleClickNext()
            : status?.campaignEnded
            ? () => handleClickNextToCriteria()
            : () => handleClickNextEdit()
        }
        handleClickSubmit={
          status?.campaignStarting ? () => handleClickUpdateSpecialCampaign() : () => handleClickUpdateCampaign()
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

export default withSession(EditCampaignPage, PagePermission.campaignUpdate);
