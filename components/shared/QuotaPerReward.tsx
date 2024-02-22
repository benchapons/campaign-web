import FormGroup from '@/components/common/FormGroup';
import WeeklyQuota from './WeeklyQuota';
import { CheckboxWithCommaInput } from '../common/Checkbox';

interface QuotaPerRewardProps {
  value: any;
  name?: string;
  disabledCondition?: boolean;
  disabledAmount?: boolean;
  onChangeInput: (data: any) => void;
  onChangeWeeklyInput: (data: any) => void;
  handleAddPlanQuotaWeekly: () => void;
  handleDeletePlanQuotaWeekly: (weekDayId: string) => void;
}

const QuotaPerReward = ({
  value,
  name,
  disabledCondition,
  disabledAmount,
  onChangeInput,
  onChangeWeeklyInput,
  handleAddPlanQuotaWeekly,
  handleDeletePlanQuotaWeekly,
}: QuotaPerRewardProps) => {
  return (
    <FormGroup title="Quota Per Reward" supTitle="(จำนวนสิทธิ์ที่ได้ต่อรางวัล)">
      <CheckboxWithCommaInput
        disabledCondition={disabledCondition}
        disabledAmount={disabledAmount}
        name={name ? `${name}daily` : 'daily'}
        nameCheckbox={name ? `${name}daily` : ''}
        label="จำนวนสิทธิ์ ต่อวัน"
        value={value}
        onChange={onChangeInput}
      />
      <WeeklyQuota
        name={name ? `${name}weekly` : ''}
        disabledCondition={disabledCondition}
        disabledAmount={disabledAmount}
        value={value?.weekly}
        onChange={onChangeWeeklyInput}
        handleAddPlan={handleAddPlanQuotaWeekly}
        handleDeletePlan={handleDeletePlanQuotaWeekly}
      />
      <CheckboxWithCommaInput
        disabledCondition={disabledCondition}
        disabledAmount={disabledAmount}
        name={name ? `${name}monthly` : 'monthly'}
        nameCheckbox={name ? `${name}monthly` : ''}
        label="จำนวนสิทธิ์ ต่อเดือน"
        desc="(1-30, 1-31)"
        value={value}
        onChange={onChangeInput}
      />
    </FormGroup>
  );
};

export default QuotaPerReward;
