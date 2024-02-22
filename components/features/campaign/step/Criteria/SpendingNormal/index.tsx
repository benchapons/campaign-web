import FormGroup from '@/components/common/FormGroup';
import { TextInput } from '@/components/common/TextInput';
import CommaInput from '@/components/common/TextInput/CommaInput';
import Button from '@/components/common/Button';

import { ChangeEventBaseNumberType, ChangeEventBaseType, OptionsDropdown } from '@/types/event.interface';
import RewardCriteria from '../../../reward';
import HeadReward from '../../../reward/HeadReward';
import { StatusCampaignForm } from '@/types/campaign.type';
import { Dropdown, MultiDropdown } from '@/components/common/Dropdown';

interface MasterDataList {
  rewardTypeList: OptionsDropdown[];
  conditionJoinerList: OptionsDropdown[];
}

interface SpendingNormalProps {
  isAdjustmentReward: boolean;
  name: string;
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
  handleToggleExpandReward: (conditionId: string, TierId: string, rewardId: string) => void;
  handleDeleteReward: (conditionId: string, TierId: string, rewardId: string) => void;
  handleAddReward: (conditionId: string, tierId: string, rewardId: string) => void;
  handleOpenModalAdjustmentReward: (conditionId: string, tierId: string, rewardId: string, isShard: boolean) => void;
}

const SpendingNormal = ({
  isAdjustmentReward,
  name,
  conditionId,
  spending,
  masterData,
  status,
  onChangeInputSpending,
  onChangeInputReward,
  onChangeQuotaRewardInput,
  onChangeQuotaWeeklyRewardInput,
  handleAddPlanQuotaWeeklyReward,
  handleDeletePlanQuotaWeeklyReward,
  handleAddRewardCampaignCondition,
  handleToggleExpandReward,
  handleDeleteReward,
  handleAddReward,
  handleOpenModalAdjustmentReward,
}: SpendingNormalProps) => {
  return (
    <div>
      <FormGroup
        isRequired
        isHiddenBorder
        title="Minimum Spending Amount"
        supTitle="(จำกัดยอดซื้อขั้นต่ำที่ใช้ร่วมกิจกรรม)"
      >
        <CommaInput
          disabled={status?.campaignStarting || status?.campaignEnded}
          name={`${name}.0.minSpendingAmount`}
          value={spending?.minSpendingAmount}
          onChange={(e) => onChangeInputSpending(e, conditionId, spending?._id)}
        />
      </FormGroup>
      <FormGroup isRequired isHiddenBorder title="Condition Joiner" supTitle={`(ONESIAM,AIS,MCard))`}>
        {Array.isArray(spending?.conditionDesc) ? (
          <MultiDropdown
            disabled={status?.campaignStarting || status?.campaignEnded}
            name={`${name}.0.conditionDesc`}
            value={spending?.conditionDesc}
            onChange={(e: any) => onChangeInputSpending(e, conditionId, spending?._id)}
            options={masterData?.conditionJoinerList}
          />
        ) : (
          <TextInput
            disabled={status?.campaignStarting || status?.campaignEnded}
            name={`${name}.0.conditionDesc`}
            value={spending?.conditionDesc}
            onChange={(e: any) => onChangeInputSpending(e, conditionId, spending?._id)}
          />
        )}
      </FormGroup>
      <div className="py-8 px-4">
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
                  key={reward?._id}
                  status={status}
                  name={`${name}.0.reward.${index}.`}
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
    </div>
  );
};

export default SpendingNormal;
