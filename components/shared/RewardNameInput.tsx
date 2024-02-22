import { ChangeEventHandler, useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { ChangeEventBaseType } from '@/types/event.interface';
import { Character } from '@/types/global.type';
import { resolveName } from '@/utilities/format';

type InputPropsType = {
  isRequired?: boolean;
  disabled?: boolean;
  label?: string;
  className?: string;
  value?: string;
  name: string;
  id?: string;
  placeholder?: string;
  maxLength?: number;
  character?: Character;
  desc?: string;
  testId?: string;
  onChange?: (onChange: ChangeEventBaseType<string>) => void;
};

/**
 * TextInput component
 *
 * @param {string} [props.placeHolder]
 * @param {string} [props.value]
 * @param {string} [props.label]
 * @param {string} [props.className]
 * @param {string} [props.id]
 * @param {string} [props.name]
 * @param {boolean} [props.disabled]
 * @param {boolean} [props.isRequired]
 * @param {number} [props.maxLength]
 * @param {(onChange: ChangeEventBaseType<string>) => void} [props.onChange]
 * @returns {React.ReactElement}
 */

const RewardNameInput = ({
  className,
  value,
  name,
  id,
  placeholder,
  label,
  disabled = false,
  isRequired = false,
  maxLength = 255,
  desc,
  testId = '',
  onChange,
}: InputPropsType) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const newValue = useMemo(() => (value ? value?.slice(0, maxLength) : ''), [value]);

  const [currentValue, setCurrentValue] = useState<string>('');

  useEffect(() => {
    setCurrentValue(newValue);
  }, [newValue]);

  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (event: any) => {
    const { name, value } = event.target;
    const changeEvent: ChangeEventBaseType = {
      name: name,
      value: value.slice(0, maxLength),
    };
    setCurrentValue(value);
    onChange?.(changeEvent);
    register(name)?.onChange(event);
  };

  return (
    <div className="flex flex-col" test-id={testId ? `reward-input-${testId}` : 'reward-input'}>
      {label ? (
        <div className="flex justify-between">
          <label htmlFor={id} className="py-1">
            {label}
            {isRequired ? <b className="text-red ml-0.5"> * </b> : null}
          </label>
          {desc ? <p className="text-orange-tangerine">{desc}</p> : null}
        </div>
      ) : null}
      <input
        {...register(name)}
        autoFocus={true}
        className={`text-base h-9 rounded-md px-4 outline-0 border ${className} ${
          resolveName(name, errors)?.message ? 'border-red border-2 text-red' : ''
        } ${
          disabled
            ? 'bg-gray-gainsboro/60 border-gray-sliver text-gray-dim cursor-not-allowed'
            : 'bg-white border-gray text-blue-oxford focus:border-blue-pacific hover:border-blue-pacific cursor-pointer'
        }`}
        type="text"
        placeholder={placeholder}
        id={id}
        test-id={testId}
        // value={
        //   isCheckCharacterRe ? value?.replace(isCheckCharacterRe, '')?.slice(0, maxLength) : value?.slice(0, maxLength)
        // }
        value={currentValue?.slice(0, maxLength)}
        disabled={disabled}
        onChange={handleOnChange}
        maxLength={maxLength}
      />
      {resolveName(name, errors)?.message && (
        <span className="text-red text-sm">{resolveName(name, errors)?.message}</span>
      )}
    </div>
  );
};

export default RewardNameInput;
