import { useFormContext } from 'react-hook-form';
import Checkbox from '../../../common/Checkbox/Checkbox';
import { TextInput } from '../../../common/TextInput';

interface CheckboxBuildingOtherProps {
  name: string;
  label: string;
  value: any;
  campaignId: string;
  disabled?: boolean;
  onChange: (campaignId: string, data: any) => void;
}

const CheckboxBuildingOther = ({ campaignId, name, label, value, disabled, onChange }: CheckboxBuildingOtherProps) => {
  const { register } = useFormContext();
  const handleOnChange: any = (event: any) => {
    const changeEvent = {
      ...value,
      ...(event?.name === 'isChecked' && { value: '' }),
      [event?.name]: event?.value,
      name,
    };
    onChange?.(campaignId, changeEvent);
    if (event?.name === 'value') {
      register(name)?.onChange({
        type: 'change',
        target: {
          name,
          value: [event?.value],
        },
      });
    }
  };
  return (
    <div className="flex items-center">
      <Checkbox
        label={label}
        name="isChecked"
        className="w-2/5"
        checked={value?.isChecked}
        disabled={disabled}
        onChange={handleOnChange}
      />
      <TextInput disabled={!value?.isChecked || disabled} name="value" value={value?.value} onChange={handleOnChange} />
    </div>
  );
};

export default CheckboxBuildingOther;
