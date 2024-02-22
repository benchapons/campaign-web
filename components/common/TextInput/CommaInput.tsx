import { memo } from 'react';
import { NumericFormat } from 'react-number-format';
import { useFormContext } from 'react-hook-form';

import { ChangeEventBaseNumberType } from '@/types/event.interface';
import { resolveName } from '@/utilities/format';

type InputPropsType = {
  isRequired?: boolean;
  isString?: boolean;
  disabled?: boolean;
  label?: string;
  desc?: string;
  className?: string;
  value?: string | number | null;
  name: string;
  id?: string;
  placeholder?: string;
  errWarning?: string;
  maxLength?: number;
  decimal?: number;
  testId?: string;
  onChange?: (data: ChangeEventBaseNumberType<string | number>) => void;
};

/**
 * NumCommaInput component
 *
 * @param {string} [props.placeHolder]
 * @param {string} [props.value]
 * @param {string} [props.label]
 * @param {string} [props.className]
 * @param {string} [props.id]
 * @param {string} [props.name]
 * @param {boolean} [props.disabled]
 * @param {boolean} [props.isRequired]
 * @param {boolean} [props.isString]
 * @param {number} [props.maxLength]
 * @param {(onChange: ChangeEventBaseNumberType) => void} [props.onChange]
 * @returns {React.ReactElement}
 */

const CommaInput = ({
  isString,
  className,
  value,
  name,
  id,
  placeholder,
  label,
  desc,
  errWarning,
  disabled = false,
  isRequired = false,
  maxLength = 20,
  decimal = 2,
  testId = '',
  onChange,
}: InputPropsType) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const field = register(name);

  const handleOnChange = (event: any) => {
    const changeEvent: ChangeEventBaseNumberType = {
      name: name || '',
      value: isString ? event.value : event.floatValue,
    };
    onChange?.(changeEvent);
    register(name)?.onChange({
      type: 'change',
      target: {
        name,
        value: isString ? event.value : event.floatValue,
      },
    });
  };

  return (
    <div className="flex flex-col" test-id={testId ? `comma-input-${testId}` : 'comma-input'}>
      {label && (
        <label htmlFor={id} className={`${desc ? 'pt-1' : 'py-1'}`}>
          {label}
          {isRequired && <b className="text-red ml-1"> * </b>}
        </label>
      )}
      {desc ? <p className="text-gray-dark text-sm pb-1">{desc}</p> : null}
      <NumericFormat
        decimalScale={decimal}
        name={field?.name}
        getInputRef={field?.ref}
        allowLeadingZeros={false}
        allowNegative={false}
        thousandsGroupStyle="thousand"
        thousandSeparator=","
        className={`text-base h-9 rounded-md px-4  outline-0 border  ${className} ${
          resolveName(name, errors)?.message ? 'border-red border-2 text-red' : ''
        } ${
          disabled
            ? 'bg-gray-gainsboro/60 border-gray-sliver text-gray-dim cursor-not-allowed'
            : 'bg-white border-gray text-blue-oxford focus:border-blue-pacific hover:border-blue-pacific cursor-pointer'
        }`}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onValueChange={(values) => handleOnChange(values)}
        maxLength={maxLength}
        test-id={testId}
      />
      {resolveName(name, errors)?.message && (
        <span className="text-red text-sm">{resolveName(name, errors)?.message}</span>
      )}
      {errWarning && !resolveName(name, errors)?.message ? (
        <span className="text-orange-tangerine text-sm">{errWarning}</span>
      ) : null}
    </div>
  );
};

export default memo(CommaInput);
