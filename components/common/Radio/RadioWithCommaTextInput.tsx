import { NumericFormat } from 'react-number-format';
import { useFormContext } from 'react-hook-form';

import styles from '@/components/common/Radio/Radio.module.css';
import { ChangeEventBaseType } from '@/types/event.interface';
import { resolveName } from '@/utilities/format';
import { nameValidate } from '@/utilities/resolver';

interface RadioWithCommaTextInputProps {
  label: string;
  nameRadio: string;
  nameInput: string;
  valueRadio: any;
  valueInput: number | null;
  checked: boolean;
  disabledCondition?: boolean;
  disabledAmount?: boolean;
  desc?: string;
  onChange: (data: any) => void;
}

const RadioWithCommaTextInput = ({
  disabledCondition,
  disabledAmount,
  label,
  nameRadio,
  nameInput,
  valueRadio,
  checked,
  desc,
  valueInput,
  onChange,
}: RadioWithCommaTextInputProps) => {
  const realName = nameValidate(nameInput);
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const field = register(nameInput);

  const handleOnChangeRadio: any = (event: any) => {
    const changeEvent: ChangeEventBaseType = {
      name: event.target.name,
      value: event.target.value,
    };
    onChange?.(changeEvent);
  };

  const handleOnChangeInput: any = (event: any) => {
    const changeEvent: ChangeEventBaseType = {
      name: realName,
      value: event.floatValue,
    };
    onChange?.(changeEvent);
    register(nameInput)?.onChange({
      type: 'change',
      target: {
        name: nameInput,
        value: event.floatValue,
      },
    });
  };

  return (
    <div className="flex items-center">
      <label
        data-cy="radio-component-test"
        className={`${styles.radio} ${disabledCondition ? styles.disabled : undefined} my-2`}
      >
        <input
          type="radio"
          value={valueRadio}
          name={nameRadio}
          checked={checked}
          disabled={disabledCondition}
          test-id={nameRadio}
          onChange={handleOnChangeRadio}
        />
        <span data-cy="radio-check-test" className={`${styles['check-mark']}`}></span>
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
            resolveName(nameInput, errors)?.message ? 'border-red border-2 text-red' : ''
          } ${
            !checked || disabledAmount
              ? 'bg-gray-gainsboro/60 border-gray-sliver text-gray-dim cursor-not-allowed'
              : 'bg-white border-gray text-blue-oxford focus:border-blue-pacific hover:border-blue-pacific cursor-pointer'
          }`}
          value={valueInput}
          disabled={!checked || disabledAmount}
          test-id={nameInput}
          onValueChange={(values) => handleOnChangeInput(values)}
        />
        {resolveName(nameInput, errors)?.message && (
          <span className="text-red text-sm">{resolveName(nameInput, errors)?.message}</span>
        )}
      </div>
    </div>
  );
};

export default RadioWithCommaTextInput;
