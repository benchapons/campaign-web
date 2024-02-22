import Criteria from './step/Criteria';
import Information from './step/Information';
import { StepProgressBar } from './components';

import { CampaignMasterState } from '@/store/master-campaign';
import {
  ChangeEventBaseNumberType,
  ChangeEventBaseType,
  ChangeEventMultiBaseType,
  OptionsDropdown,
} from '@/types/event.interface';
import { CampaignCriteriaForm, CampaignInfoForm, StatusCampaignForm } from '@/types/campaign.type';
import { StepCampaignEnum } from '@/constants/enum';
import ModalCreateReward from './ModalCreateReward';
import ModalAdjustmentReward from './ModalAdjustmentReward';
import { AdjustmentRewardFormType, RewardAdjustForm } from '@/types/reward.type';
import { AuthorizedUserType } from '@/types/auth.type';

interface MasterDataList extends CampaignMasterState {
  rewardTypeList: OptionsDropdown[];
}

interface CampaignFormProps {
  isShowModalReward: boolean;
  isAdjustmentReward: boolean;
  isShowModalAdjustmentReward: boolean;
  authorizedUser: AuthorizedUserType;
  step: number;
  campaignInfoForm: CampaignInfoForm;
  campaignCriteriaForm: CampaignCriteriaForm[];
  masterData: MasterDataList;
  rewardForm: RewardAdjustForm;
  status: StatusCampaignForm;
  onChangeInputInfo: (data: ChangeEventBaseType | ChangeEventBaseNumberType | ChangeEventMultiBaseType<string>) => void;
  onChangeInputBuildingOther: (campaignId: string, data: any) => void;
  onChangeInputCriteria: (
    data: ChangeEventBaseType<string | boolean> | ChangeEventBaseNumberType | ChangeEventMultiBaseType,
    campaignId: string
  ) => void;
  onChangeConditionQuotaInput: (data: any, conditionId: string) => void;
  onChangeInputSpending: (
    data: ChangeEventBaseType | ChangeEventBaseNumberType,
    conditionId: string,
    tierId: string
  ) => void;
  onChangeInputReward: (
    data: ChangeEventBaseType<string | boolean> | ChangeEventBaseNumberType,
    conditionId: string,
    tierId: string,
    rewardId: string
  ) => void;
  onChangeQuotaRewardInput: (data: any, conditionId: string, tierId: string, rewardId: string) => void;
  onChangeQuotaWeeklyRewardInput: (data: any, conditionId: string, tierId: string, rewardId: string) => void;
  handleAddPlanQuotaWeeklyReward: (conditionId: string, tierId: string, rewardId: string) => void;
  handleDeletePlanQuotaWeeklyReward: (conditionId: string, tierId: string, rewardId: string, weekDayId: string) => void;
  handleAddCampaignCondition: () => void;
  handleAddTierCampaignCondition: (conditionId: string) => void;
  handleAddRewardCampaignCondition: (conditionId: string, TierId: string) => void;
  handleToggleExpandCondition: (conditionId: string) => void;
  handleToggleExpandTier: (conditionId: string, TierId: string) => void;
  handleToggleExpandReward: (conditionId: string, TierId: string, rewardId: string) => void;
  handleDeleteCondition: (conditionId: string) => void;
  handleDeleteTier: (conditionId: string, TierId: string) => void;
  handleDeleteReward: (conditionId: string, TierId: string, rewardId: string) => void;
  handleAddReward: (conditionId: string, tierId: string, rewardId: string) => void;
  handleCloseModalReward: () => void;
  handleSubmitModalReward: (payload: any) => void;
  handleOpenModalAdjustmentReward: (conditionId: string, tierId: string, rewardId: string, isShard: boolean) => void;
  handleCloseModalAdjustmentReward: () => void;
  handleSubmitModalAdjustmentReward: (data: AdjustmentRewardFormType) => Promise<boolean>;
}

const CampaignForm = ({
  isShowModalReward,
  isAdjustmentReward,
  isShowModalAdjustmentReward,
  authorizedUser,
  status,
  step,
  campaignInfoForm,
  campaignCriteriaForm,
  rewardForm,
  masterData,
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
  handleOpenModalAdjustmentReward,
  handleCloseModalAdjustmentReward,
  handleSubmitModalAdjustmentReward,
}: CampaignFormProps) => {
  return (
    <div>
      {/* <StepProgressBar /> */}

      {step === StepCampaignEnum?.INFORMATION ? (
        <Information
          status={status}
          masterData={{
            campaignObjectiveList: masterData?.campaignObjectiveList,
            targetSegmentList: masterData?.targetSegmentList,
            spendingChannelList: masterData?.spendingChannelList,
            statusList: masterData?.statusList,
          }}
          campaignForm={campaignInfoForm}
          onChangeInput={onChangeInputInfo}
        />
      ) : null}
      {step === StepCampaignEnum?.CRITERIA ? (
        <Criteria
          status={status}
          isAdjustmentReward={isAdjustmentReward}
          campaignForm={campaignCriteriaForm}
          masterData={{
            campaignTypeList: masterData?.campaignTypeList,
            buildingList: masterData?.buildingList,
            rewardTypeList: masterData?.rewardTypeList,
            conditionJoinerList: masterData?.conditionJoinerList,
            bankList: masterData?.bankList,
          }}
          onChangeInput={onChangeInputCriteria}
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
          handleOpenModalAdjustmentReward={handleOpenModalAdjustmentReward}
        />
      ) : null}
      <ModalCreateReward
        isShowModalReward={isShowModalReward}
        authorizedUser={authorizedUser}
        handleCloseModalReward={handleCloseModalReward}
        handleSubmitModalReward={handleSubmitModalReward}
      />
      <ModalAdjustmentReward
        isShow={isShowModalAdjustmentReward}
        rewardForm={rewardForm}
        onClose={handleCloseModalAdjustmentReward}
        onSubmit={handleSubmitModalAdjustmentReward}
      />
    </div>
  );
};

export default CampaignForm;
