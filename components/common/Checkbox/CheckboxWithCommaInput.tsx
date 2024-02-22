import { useFormContext } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';

import styles from '@/components/common/Checkbox/Checkbox.module.css';
import { resolveName } from '@/utilities/format';
import { nameValidate } from '@/utilities/resolver';

interface PropsType {
  label: string;
  name: string;
  nameCheckbox?: string;
  value: any;
  disabledCondition?: boolean;
  disabledAmount?: boolean;
  desc?: string;
  testId?: string;
  onChange?: (data: any) => void;
}

const CheckboxWithCommaInput = ({
  disabledCondition,
  disabledAmount,
  label,
  name,
  nameCheckbox,
  value,
  desc,
  testId = '',
  onChange,
}: PropsType) => {
  const realName = nameValidate(name);
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const field = register(nameCheckbox ? `${name}.value` : name);

  const handleOnChange: any = (event: any) => {
    const checkBoxName = nameCheckbox ? nameValidate(event?.target?.name) : event?.target?.name;
    const changeEvent = {
      ...value,
      [realName]: {
        ...value?.[realName],
        ...(checkBoxName === 'isChecked'
          ? event?.target?.checked
            ? { isChecked: event?.target?.checked }
            : { isChecked: event?.target?.checked, value: '' }
          : { value: event?.floatValue }),
      },
    };
    onChange?.(changeEvent);
    if (checkBoxName === 'isChecked') {
      const name = nameCheckbox ? `${nameCheckbox}.isChecked` : 'isChecked';
      register(name)?.onChange({
        type: 'change',
        target: {
          name,
          value: event?.target?.checked,
        },
      });
    } else {
      const inputName = nameCheckbox ? `${nameCheckbox}.value` : name;
      register(inputName)?.onChange({
        type: 'change',
        target: {
          name: inputName,
          value: event.floatValue,
        },
      });
    }
  };

  return (
    <div
      className="flex items-center"
      test-id={testId ? `checkbox-with-comma-input-${testId}` : 'checkbox-with-comma-input'}
    >
      <label className={`${styles.container} ${disabledCondition ? styles.disabled : ''} my-2 min-w-[222px]`}>
        <input
          type="checkbox"
          name={nameCheckbox ? `${nameCheckbox}.isChecked` : 'isChecked'}
          checked={value?.[realName]?.isChecked}
          onChange={handleOnChange}
          disabled={disabledCondition}
          test-id={testId ? `checkbox-${testId}` : 'checkbox'}
        />
        <span className={`${styles['check-mark']} ${disabledCondition ? styles.disabled : ''}`}></span>
        <div>
          <p className={`${disabledCondition ? 'text-gray' : ''} mx-2 text-base`}>{label}</p>
          {desc ? <p className="text-gray-dark text-sm mx-2">{desc}</p> : null}
        </div>
      </label>
      <div className="flex flex-col">
        <NumericFormat
          name={field?.name}
          getInputRef={field?.ref}
          allowLeadingZeros={false}
          allowNegative={false}
          thousandsGroupStyle="thousand"
          thousandSeparator=","
          decimalScale={0}
          className={`text-base h-9 rounded-md px-4  outline-0 border ${
            resolveName(nameCheckbox ? `${name}.value` : name, errors)?.message ? 'border-red border-2 text-red' : ''
          } ${
            !value?.[realName]?.isChecked || disabledAmount
              ? 'bg-gray-gainsboro/60 border-gray-sliver text-gray-dim cursor-not-allowed'
              : 'bg-white border-gray text-blue-oxford focus:border-blue-pacific hover:border-blue-pacific cursor-pointer'
          }`}
          // defaultValue={value?.[name]?.value}
          value={value?.[realName]?.value}
          disabled={!value?.[realName]?.isChecked || disabledAmount}
          test-id={testId}
          onValueChange={(values) => handleOnChange(values)}
        />
        {resolveName(nameCheckbox ? `${name}.value` : name, errors)?.message && (
          <span className="text-red text-sm">
            {resolveName(nameCheckbox ? `${name}.value` : name, errors)?.message}
          </span>
        )}
      </div>
    </div>
  );
};

export default CheckboxWithCommaInput;
