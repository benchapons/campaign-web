import CommaInput from '@/components/common/TextInput/CommaInput';
import { ChangeEventBaseNumberType, ChangeEventBaseType } from '@/types/event.interface';

interface TextCommaInputSpendingProps {
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

const TextCommaInputSpending = ({
  isRequired,
  name,
  label,
  desc,
  value,
  conditionId,
  tierId,
  disabled,
  onChangeInputSpending,
}: TextCommaInputSpendingProps) => {
  return (
    <div className="text-center">
      <label>
        {label}
        {isRequired ? <b className="text-red ml-0.5"> * </b> : null}
      </label>
      <p className="text-sm text-gray-dark mb-2">{desc}</p>
      <CommaInput
        disabled={disabled}
        name={name}
        value={value}
        onChange={(e) => onChangeInputSpending(e, conditionId, tierId)}
      />
    </div>
  );
};

export default TextCommaInputSpending;
