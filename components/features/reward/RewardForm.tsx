import { Checkbox } from '@/components/common/Checkbox';
import { Dropdown } from '@/components/common/Dropdown';
import FormGroup from '@/components/common/FormGroup';
import { CommaInput, TextInput } from '@/components/common/TextInput';
import QuotaPerReward from '@/components/shared/QuotaPerReward';
import TotalRewardForm from '@/components/shared/TotalRewardForm';

import { RewardTypeEnum } from '@/constants/enum';
import { ChangeEventBaseNumberType, ChangeEventBaseType, OptionsDropdown } from '@/types/event.interface';

interface RewardFormProps {
  isEdit?: boolean;
  isCampaignStarted?: boolean;
  isPermission?: boolean;
  rewardForm: any;
  masterData: MasterDataList;
  onChangeInput: (data: ChangeEventBaseType<string | boolean | number>) => void;
  onChangeCommaInput: (data: ChangeEventBaseNumberType<string | number>) => void;
  onChangeQuotaInput: (data: any) => void;
  onChangeQuotaWeeklyInput: (data: any) => void;
  handleAddPlanQuotaWeekly: () => void;
  handleDeletePlanQuotaWeekly: (weekDayId: string) => void;
}

interface MasterDataList {
  rewardTypeList: OptionsDropdown[];
}

const RewardForm = ({
  isEdit,
  isCampaignStarted = false,
  isPermission,
  rewardForm,
  masterData,
  onChangeInput,
  onChangeCommaInput,
  onChangeQuotaInput,
  onChangeQuotaWeeklyInput,
  handleAddPlanQuotaWeekly,
  handleDeletePlanQuotaWeekly,
}: RewardFormProps) => {
  return (
    <div>
      <FormGroup title="Reward Type" isRequired isHiddenBorder>
        <Dropdown
          isRequired={!isEdit}
          disabled={isEdit}
          name="rewardType"
          options={masterData?.rewardTypeList}
          value={rewardForm?.rewardType}
          onChange={onChangeInput}
        />
        {rewardForm?.rewardType === RewardTypeEnum?.LUCKY_DRAW ? (
          <div className="grid grid-cols-2 gap-4 my-2">
            <CommaInput
              disabled={isCampaignStarted}
              name="spendingXBath"
              decimal={0}
              label="Spending Every X Bath "
              desc="(คำนวณยอดซื้อทุกๆ กี่บาท ที่จะได้รับคูปอง)"
              value={rewardForm?.spendingXBath}
              onChange={onChangeInput}
            />
          </div>
        ) : null}
        {rewardForm?.rewardType === RewardTypeEnum?.VIZ_COINS ||
        rewardForm?.rewardType === RewardTypeEnum?.E_VOUCHER ? (
          <div className="grid grid-cols-2 gap-4">
            <TextInput
              isRequired={!isCampaignStarted}
              disabled={isCampaignStarted}
              name="ruleId"
              label="Rule ID"
              character="Number"
              value={rewardForm?.ruleId}
              onChange={onChangeInput}
            />
            <TextInput
              isRequired={!isCampaignStarted}
              disabled={isCampaignStarted}
              name="customTriggerId"
              label="Custom Trigger ID"
              value={rewardForm?.customTriggerId}
              onChange={onChangeInput}
            />
            {rewardForm?.rewardType === RewardTypeEnum?.E_VOUCHER ? (
              <TextInput
                isRequired={!isCampaignStarted}
                disabled={isCampaignStarted}
                name="voucherRewardId"
                label="Reward ID"
                character="Number"
                value={rewardForm?.voucherRewardId}
                onChange={onChangeInput}
              />
            ) : null}
          </div>
        ) : null}
        <Checkbox
          disabled={isCampaignStarted}
          label="Required Reference Code"
          name="isRequiredReferenceCode"
          checked={rewardForm?.isRequiredReferenceCode}
          onChange={onChangeInput}
        />
      </FormGroup>
      <FormGroup
        isRequired
        title="Reward Name"
        supTitle={`(ONESIAM หรือ E-Voucher \n Reward Name ระบุชื่อให้ตรงตาม Perx)`}
      >
        <TextInput isRequired name="rewardName" value={rewardForm?.rewardName} onChange={onChangeInput} />
      </FormGroup>
      <TotalRewardForm disabled={isCampaignStarted} rewardForm={rewardForm} onChangeCommaInput={onChangeCommaInput} />
      <QuotaPerReward
        disabledCondition={isCampaignStarted}
        disabledAmount={isCampaignStarted && !isPermission}
        value={rewardForm?.quotaPerReward}
        onChangeInput={onChangeQuotaInput}
        onChangeWeeklyInput={onChangeQuotaWeeklyInput}
        handleAddPlanQuotaWeekly={handleAddPlanQuotaWeekly}
        handleDeletePlanQuotaWeekly={handleDeletePlanQuotaWeekly}
      />
    </div>
  );
};

export default RewardForm;
