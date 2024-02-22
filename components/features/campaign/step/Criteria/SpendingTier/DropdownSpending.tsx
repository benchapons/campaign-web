import { Dropdown, MultiDropdown } from '@/components/common/Dropdown';
import { TextInput } from '@/components/common/TextInput';
import { ChangeEventBaseNumberType, ChangeEventBaseType, OptionsDropdown } from '@/types/event.interface';

interface TextInputSpendingProps {
  name: string;
  conditionId: string;
  tierId: string;
  label: string;
  desc: string;
  value: string[];
  disabled?: boolean;
  isRequired?: boolean;
  options: OptionsDropdown[];
  onChangeInputSpending: (
    data: ChangeEventBaseType | ChangeEventBaseNumberType,
    conditionId: string,
    tierId: string
  ) => void;
}

const DropdownSpending = ({
  disabled,
  isRequired,
  name,
  label,
  desc,
  value,
  conditionId,
  tierId,
  options,
  onChangeInputSpending,
}: TextInputSpendingProps) => {
  return (
    <div className="text-center">
      <label>
        {label}
        {isRequired ? <b className="text-red ml-0.5"> * </b> : null}
      </label>
      <p className="text-sm text-gray-dark mb-2 whitespace-nowrap">{desc}</p>
      <MultiDropdown
        options={options}
        disabled={disabled}
        name={name}
        value={value}
        onChange={(e: any) => onChangeInputSpending(e, conditionId, tierId)}
      />
    </div>
  );
};

export default DropdownSpending;
