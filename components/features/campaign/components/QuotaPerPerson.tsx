import FormGroup from '@/components/common/FormGroup';
import { CheckboxWithCommaInput } from '@/components/common/Checkbox';

interface PropsType {
  name: string;
  value: any;
  disabledCondition?: boolean;
  disabledAmount?: boolean;
  onChangeInput: (data: any) => void;
}

const QuotaPerPerson = ({ disabledCondition, disabledAmount, name, value, onChangeInput }: PropsType) => {
  return (
    <FormGroup title="Quota Per Person" supTitle="(จำนวนสิทธิ์ที่ต่อคน)">
      <CheckboxWithCommaInput
        name={`${name}daily`}
        nameCheckbox={`${name}daily`}
        label="จำนวนสิทธิ์ ต่อวัน"
        value={value}
        disabledCondition={disabledCondition}
        disabledAmount={disabledAmount}
        onChange={onChangeInput}
      />
      <CheckboxWithCommaInput
        name={`${name}all`}
        nameCheckbox={`${name}all`}
        label="ตลอดระยะเวลารายการ"
        value={value}
        disabledCondition={disabledCondition}
        disabledAmount={disabledAmount}
        onChange={onChangeInput}
      />
    </FormGroup>
  );
};

export default QuotaPerPerson;
