import { ChangeEventBaseNumberType, ChangeEventBaseType, OptionsDropdown } from '@/types/event.interface';
import Button from '@/components/common/Button';
import RewardCriteria from '../../../reward';
import HeadSpendingTier from './HeadSpendingTier';
import HeadReward from '../../../reward/HeadReward';
import { StatusCampaignForm } from '@/types/campaign.type';

interface MasterDataList {
  rewardTypeList: OptionsDropdown[];
  conditionJoinerList: OptionsDropdown[];
}

interface SpendingTierProps {
  isAdjustmentReward: boolean;
  name: string;
  idxSpending: number;
  masterData: MasterDataList;
  conditionId: string;
  spending: any;
  status: StatusCampaignForm;
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
  handleAddRewardCampaignCondition: (conditionId: string, TierId: string) => void;
  handleToggleExpandTier: (conditionId: string, TierId: string) => void;
  handleToggleExpandReward: (conditionId: string, TierId: string, rewardId: string) => void;
  handleDeleteTier: (conditionId: string, TierId: string) => void;
  handleDeleteReward: (conditionId: string, TierId: string, rewardId: string) => void;
  handleAddReward: (conditionId: string, tierId: string, rewardId: string) => void;
  handleOpenModalAdjustmentReward: (conditionId: string, tierId: string, rewardId: string, isShard: boolean) => void;
}

const SpendingTier = ({
  status,
  isAdjustmentReward,
  name,
  idxSpending,
  masterData,
  conditionId,
  spending,
  onChangeInputSpending,
  onChangeInputReward,
  onChangeQuotaRewardInput,
  onChangeQuotaWeeklyRewardInput,
  handleAddPlanQuotaWeeklyReward,
  handleDeletePlanQuotaWeeklyReward,
  handleAddRewardCampaignCondition,
  handleToggleExpandTier,
  handleToggleExpandReward,
  handleDeleteTier,
  handleDeleteReward,
  handleAddReward,
  handleOpenModalAdjustmentReward,
}: SpendingTierProps) => {
  return (
    <div className="flex flex-col border border-gray-gainsboro rounded-md">
      <HeadSpendingTier
        conditionJoinerList={masterData?.conditionJoinerList}
        status={status}
        name={name}
        conditionId={conditionId}
        tier={spending}
        index={idxSpending}
        handleToggleExpand={handleToggleExpandTier}
        handleDelete={handleDeleteTier}
        onChangeInputSpending={onChangeInputSpending}
      />
      {spending?.isExpand ? (
        <div className="p-5">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="text-lg">Reward</h2>
            </div>
            {!status?.campaignStarting && !status?.campaignEnded ? (
              <Button
                name="add-reward"
                theme="warning"
                onClick={() => handleAddRewardCampaignCondition(conditionId, spending?._id)}
              >
                + Reward
              </Button>
            ) : null}
          </div>
          <div className="flex flex-col gap-5">
            {spending?.rewards?.map((reward: any, index: number) => (
              <div key={reward?._id} className="rounded-md border border-gray-gainsboro">
                <HeadReward
                  isExpand={reward?.isExpand}
                  isShowDelete={index > 0 && !(status?.campaignStarting || status?.campaignEnded)}
                  isShowButtonRewardMaster={
                    reward?.isRewardSharing && !(status?.campaignStarting || status?.campaignEnded)
                  }
                  isShowButtonAdjustmentReward={isAdjustmentReward}
                  isShard={reward?.isRewardSharing}
                  conditionId={conditionId}
                  tierId={spending?._id}
                  rewardId={reward?._id}
                  name={`${reward?.rewardType || 'Reward Type'}: ${reward?.rewardName || 'Reward Name'}`}
                  handleAddReward={handleAddReward}
                  handleToggleExpand={handleToggleExpandReward}
                  handleDelete={handleDeleteReward}
                  handleOpenModalAdjustmentReward={handleOpenModalAdjustmentReward}
                />
                {reward?.isExpand ? (
                  <RewardCriteria
                    status={status}
                    name={`${name}reward.${index}.`}
                    masterData={masterData}
                    conditionId={conditionId}
                    tierId={spending?._id}
                    reward={reward}
                    onChangeInput={onChangeInputReward}
                    onChangeQuotaRewardInput={onChangeQuotaRewardInput}
                    onChangeQuotaWeeklyRewardInput={onChangeQuotaWeeklyRewardInput}
                    handleAddPlanQuotaWeeklyReward={handleAddPlanQuotaWeeklyReward}
                    handleDeletePlanQuotaWeeklyReward={handleDeletePlanQuotaWeeklyReward}
                  />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SpendingTier;
