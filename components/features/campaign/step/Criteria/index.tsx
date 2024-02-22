import { Control } from 'react-hook-form';
import { MdAdd } from 'react-icons/md';

import CampaignCriteria from './CampaignCriteria';

import {
  ChangeEventBaseNumberType,
  ChangeEventBaseType,
  ChangeEventMultiBaseType,
  OptionsDropdown,
} from '@/types/event.interface';
import { CampaignCriteriaForm, StatusCampaignForm } from '@/types/campaign.type';
import HeadConditionCriteria from './HeadConditionCriteria';
import SpendingNormal from './SpendingNormal';
import SpendingTier from './SpendingTier';
import { SpendingTypeEnum } from '@/constants/enum';
import Button from '@/components/common/Button';

interface MasterDataList {
  campaignTypeList: OptionsDropdown[];
  buildingList: OptionsDropdown[];
  rewardTypeList: OptionsDropdown[];
  conditionJoinerList: OptionsDropdown[];
  bankList: OptionsDropdown[];
}

interface CriteriaProps {
  isAdjustmentReward: boolean;
  campaignForm: CampaignCriteriaForm[];
  masterData: MasterDataList;
  status: StatusCampaignForm;
  onChangeInput: (
    data: ChangeEventBaseType<string | boolean> | ChangeEventBaseNumberType | ChangeEventMultiBaseType,
    campaignId: string
  ) => void;
  onChangeInputBuildingOther: (campaignId: string, data: any) => void;
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
  handleOpenModalAdjustmentReward: (conditionId: string, tierId: string, rewardId: string, isShard: boolean) => void;
}

const Criteria = ({
  isAdjustmentReward,
  status,
  masterData,
  campaignForm,
  onChangeInput,
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
  handleOpenModalAdjustmentReward,
}: CriteriaProps) => {
  return (
    <div className="flex flex-col gap-6 mt-5">
      {campaignForm?.map((condition: any, index: number) => (
        <div key={condition?._id} className="rounded-md border border-gray-gainsboro">
          <HeadConditionCriteria
            isExpand={condition?.isExpand}
            name={condition?.conditionGroup}
            conditionId={condition?._id}
            isShowDelete={index > 0 && !(status?.campaignStarting || status?.campaignEnded)}
            handleToggleExpand={handleToggleExpandCondition}
            handleDelete={handleDeleteCondition}
          />
          {condition?.isExpand ? (
            <div className="p-5">
              <CampaignCriteria
                status={status}
                name={`condition.${index}.`}
                condition={condition}
                masterData={masterData}
                onChangeInput={onChangeInput}
                onChangeInputBuildingOther={onChangeInputBuildingOther}
                onChangeQuotaInput={onChangeConditionQuotaInput}
              />
              {condition?.spendingType === SpendingTypeEnum?.NORMAL ? (
                <SpendingNormal
                  status={status}
                  isAdjustmentReward={isAdjustmentReward}
                  name={`condition.${index}.tier`}
                  masterData={{
                    rewardTypeList: masterData?.rewardTypeList,
                    conditionJoinerList: masterData?.conditionJoinerList,
                  }}
                  conditionId={condition?._id}
                  spending={condition?.spendingConditions?.[0]}
                  onChangeInputSpending={onChangeInputSpending}
                  onChangeInputReward={onChangeInputReward}
                  onChangeQuotaRewardInput={onChangeQuotaRewardInput}
                  onChangeQuotaWeeklyRewardInput={onChangeQuotaWeeklyRewardInput}
                  handleAddPlanQuotaWeeklyReward={handleAddPlanQuotaWeeklyReward}
                  handleDeletePlanQuotaWeeklyReward={handleDeletePlanQuotaWeeklyReward}
                  handleAddRewardCampaignCondition={handleAddRewardCampaignCondition}
                  handleToggleExpandReward={handleToggleExpandReward}
                  handleDeleteReward={handleDeleteReward}
                  handleAddReward={handleAddReward}
                  handleOpenModalAdjustmentReward={handleOpenModalAdjustmentReward}
                />
              ) : null}
              {condition?.spendingType === SpendingTypeEnum?.TIER ? (
                <div className="flex flex-col gap-5">
                  {condition?.spendingConditions?.map((spending: any, idx: number) => (
                    <SpendingTier
                      key={spending?._id}
                      status={status}
                      isAdjustmentReward={isAdjustmentReward}
                      name={`condition.${index}.tier.${idx}.`}
                      idxSpending={idx}
                      masterData={{
                        rewardTypeList: masterData?.rewardTypeList,
                        conditionJoinerList: masterData?.conditionJoinerList,
                      }}
                      conditionId={condition?._id}
                      spending={spending}
                      onChangeInputSpending={onChangeInputSpending}
                      onChangeInputReward={onChangeInputReward}
                      onChangeQuotaRewardInput={onChangeQuotaRewardInput}
                      onChangeQuotaWeeklyRewardInput={onChangeQuotaWeeklyRewardInput}
                      handleAddPlanQuotaWeeklyReward={handleAddPlanQuotaWeeklyReward}
                      handleDeletePlanQuotaWeeklyReward={handleDeletePlanQuotaWeeklyReward}
                      handleAddRewardCampaignCondition={handleAddRewardCampaignCondition}
                      handleToggleExpandTier={handleToggleExpandTier}
                      handleToggleExpandReward={handleToggleExpandReward}
                      handleDeleteTier={handleDeleteTier}
                      handleDeleteReward={handleDeleteReward}
                      handleAddReward={handleAddReward}
                      handleOpenModalAdjustmentReward={handleOpenModalAdjustmentReward}
                    />
                  ))}
                  {!status?.campaignStarting && !status?.campaignEnded ? (
                    <Button
                      name="add-tier"
                      theme="outline-primary"
                      className="py-3"
                      onClick={() => handleAddTierCampaignCondition(condition?._id)}
                    >
                      <MdAdd className="text-xl mr-1" /> Add Tier
                    </Button>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ))}
      {!status?.campaignStarting && !status?.campaignEnded ? (
        <Button name="add-condition" theme="outline-primary" className="py-3" onClick={handleAddCampaignCondition}>
          <MdAdd className="text-xl mr-1" /> Add Condition
        </Button>
      ) : null}
    </div>
  );
};

export default Criteria;
