import FormGroup from '@/components/common/FormGroup';
import { Checkbox } from '@/components/common/Checkbox';
import { Dropdown } from '@/components/common/Dropdown';
import { CommaInput, TextInput } from '@/components/common/TextInput';
import TotalRewardForm from '@/components/shared/TotalRewardForm';
import QuotaPerReward from '@/components/shared/QuotaPerReward';
import RewardNameInput from '@/components/shared/RewardNameInput';

import { RewardTypeEnum } from '@/constants/enum';
import { ChangeEventBaseNumberType, ChangeEventBaseType, OptionsDropdown } from '@/types/event.interface';
import { StatusCampaignForm } from '@/types/campaign.type';

interface MasterDataList {
  rewardTypeList: OptionsDropdown[];
}

interface RewardProps {
  name: string;
  masterData: MasterDataList;
  conditionId: string;
  tierId: string;
  reward: any;
  status: StatusCampaignForm;
  onChangeInput: (
    data: ChangeEventBaseType<string | boolean> | ChangeEventBaseNumberType,
    conditionId: string,
    tierId: string,
    rewardId: string
  ) => void;
  onChangeQuotaRewardInput: (data: any, conditionId: string, tierId: string, rewardId: string) => void;
  onChangeQuotaWeeklyRewardInput: (data: any, conditionId: string, tierId: string, rewardId: string) => void;
  handleAddPlanQuotaWeeklyReward: (conditionId: string, tierId: string, rewardId: string) => void;
  handleDeletePlanQuotaWeeklyReward: (conditionId: string, tierId: string, rewardId: string, weekDayId: string) => void;
}

const RewardCriteria = ({
  status,
  name,
  masterData,
  conditionId,
  tierId,
  reward,
  onChangeInput,
  onChangeQuotaRewardInput,
  onChangeQuotaWeeklyRewardInput,
  handleAddPlanQuotaWeeklyReward,
  handleDeletePlanQuotaWeeklyReward,
}: RewardProps) => {
  return (
    <div className="bg-blue-fresh/10 py-8">
      <FormGroup
        title="Reward"
        isRequired
        isHiddenBorder
        supTitle={`(ONESIAM หรือ E-Voucher \n Reward Name ระบุชื่อให้ตรงตาม Perx)`}
      >
        <div className="flex gap-4 justify-between">
          <Checkbox
            disabled={status?.campaignStarting || status?.campaignEnded}
            label="Share"
            name={`${name}isRewardSharing`}
            checked={reward?.isRewardSharing}
            onChange={(e) => onChangeInput(e, conditionId, tierId, reward?._id)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Dropdown
            isRequired
            disabled={status?.campaignStarting || status?.campaignEnded}
            name={`${name}rewardType`}
            label="Reward Type"
            options={masterData?.rewardTypeList}
            value={reward?.rewardType}
            onChange={(e) => onChangeInput(e, conditionId, tierId, reward?._id)}
          />

          {reward?.isRewardSharing ? (
            <Dropdown
              isRequired
              disabled={status?.campaignEnded}
              name={`${name}rewardName`}
              label="Reward Name"
              options={reward?.rewardList}
              value={reward?.rewardName}
              onChange={(e) => onChangeInput(e, conditionId, tierId, reward?._id)}
            />
          ) : (
            <RewardNameInput
              isRequired
              disabled={status?.campaignEnded}
              name={`${name}rewardName`}
              label="Reward Name"
              value={reward?.rewardName}
              onChange={(e) => onChangeInput(e, conditionId, tierId, reward?._id)}
            />
          )}
        </div>
        {reward?.rewardType === RewardTypeEnum?.VIZ_COINS || reward?.rewardType === RewardTypeEnum?.E_VOUCHER ? (
          <div className="grid grid-cols-2 gap-4">
            <TextInput
              isRequired
              disabled={reward?.isRewardSharing || status?.campaignStarting || status?.campaignEnded}
              name={`${name}ruleId`}
              label="Rule ID"
              character="Number"
              value={reward?.ruleId}
              onChange={(e) => onChangeInput(e, conditionId, tierId, reward?._id)}
            />
            <TextInput
              isRequired
              disabled={reward?.isRewardSharing || status?.campaignStarting || status?.campaignEnded}
              name={`${name}customTriggerId`}
              label="Custom Trigger ID"
              value={reward?.customTriggerId}
              onChange={(e) => onChangeInput(e, conditionId, tierId, reward?._id)}
            />
            {reward?.rewardType === RewardTypeEnum?.E_VOUCHER ? (
              <TextInput
                isRequired
                disabled={reward?.isRewardSharing || status?.campaignStarting || status?.campaignEnded}
                name={`${name}voucherRewardId`}
                label="Reward ID"
                character="Number"
                value={reward?.voucherRewardId}
                onChange={(e) => onChangeInput(e, conditionId, tierId, reward?._id)}
              />
            ) : null}
          </div>
        ) : null}
        {reward?.rewardType === RewardTypeEnum?.LUCKY_DRAW ? (
          <div className="grid grid-cols-2 gap-4 my-2">
            <CommaInput
              disabled={reward?.isRewardSharing || status?.campaignStarting || status?.campaignEnded}
              name="spendingXBath"
              decimal={0}
              label="Spending Every X Bath "
              desc="(คำนวณยอดซื้อทุกๆ กี่บาท ที่จะได้รับคูปอง)"
              value={reward?.spendingXBath}
              onChange={(e) => onChangeInput(e, conditionId, tierId, reward?._id)}
            />
          </div>
        ) : null}
        <Checkbox
          disabled={reward?.isRewardSharing || status?.campaignStarting || status?.campaignEnded}
          label="Required Reference Code"
          name="isRequiredReferenceCode"
          checked={reward?.isRequiredReferenceCode}
          onChange={(e) => onChangeInput(e, conditionId, tierId, reward?._id)}
        />
      </FormGroup>
      <TotalRewardForm
        name={name}
        disabled={reward?.isRewardSharing || status?.campaignStarting || status?.campaignEnded}
        rewardForm={reward}
        onChangeCommaInput={(e) => onChangeInput(e, conditionId, tierId, reward?._id)}
      />
      <QuotaPerReward
        name={`${name}`}
        disabledAmount={reward?.isRewardSharing}
        disabledCondition={reward?.isRewardSharing || status?.campaignStarting || status?.campaignEnded}
        value={reward?.quotaPerReward}
        onChangeInput={(e) => onChangeQuotaRewardInput(e, conditionId, tierId, reward?._id)}
        onChangeWeeklyInput={(e) => onChangeQuotaWeeklyRewardInput(e, conditionId, tierId, reward?._id)}
        handleAddPlanQuotaWeekly={() => handleAddPlanQuotaWeeklyReward(conditionId, tierId, reward?._id)}
        handleDeletePlanQuotaWeekly={(e) => handleDeletePlanQuotaWeeklyReward(conditionId, tierId, reward?._id, e)}
      />
    </div>
  );
};

export default RewardCriteria;
