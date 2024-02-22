import { TextInput } from '@/components/common/TextInput';
import { ChangeEventBaseNumberType, ChangeEventBaseType } from '@/types/event.interface';

interface TextInputSpendingProps {
  name: string;
  conditionId: string;
  tierId: string;
  label: string;
  desc: string;
  value: string;
  disabled?: boolean;
  isRequired?: boolean;
  onChangeInputSpending: (
    data: ChangeEventBaseType | ChangeEventBaseNumberType,
    conditionId: string,
    tierId: string
  ) => void;
}

const TextInputSpending = ({
  disabled,
  isRequired,
  name,
  label,
  desc,
  value,
  conditionId,
  tierId,
  onChangeInputSpending,
}: TextInputSpendingProps) => {
  return (
    <div className="text-center">
      <label>
        {label}
        {isRequired ? <b className="text-red ml-0.5"> * </b> : null}
      </label>
      <p className="text-sm text-gray-dark mb-2 whitespace-nowrap">{desc}</p>
      <TextInput
        disabled={disabled}
        name={name}
        value={value}
        onChange={(e) => onChangeInputSpending(e, conditionId, tierId)}
      />
    </div>
  );
};

export default TextInputSpending;
