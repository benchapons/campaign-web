import { memo, FC, ChangeEventHandler, useState } from 'react';

import { ChangeEventBaseType } from '@/types/event.interface';
import { useFormContext } from 'react-hook-form';
import { resolveName } from '@/utilities/format';

interface PrefixInput {
  isRequired?: boolean;
  disabled?: boolean;
  prefix: string;
  label?: string;
  placeholder?: string;
  name?: string;
  value?: string;
  className?: string;
  onChange?: (onChange: ChangeEventBaseType<string>) => void;
}

const PrefixInput: FC<PrefixInput> = ({
  isRequired,
  label,
  prefix,
  name,
  value,
  disabled,
  className,
  placeholder,
  onChange,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const [isFocused, setIsFocused] = useState(false);

  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const { name, value } = event.target;
    const changeEvent: ChangeEventBaseType = {
      name: name || '',
      value: value,
    };
    onChange?.(changeEvent);
  };
  return (
    <div className="flex flex-col">
      {label ? (
        <label className=" py-1">
          {label}
          {isRequired && <b className="text-red ml-1"> * </b>}
        </label>
      ) : null}
      <div
        className={`h-10 flex rounded border  ${
          resolveName(name, errors)?.message ? 'border-red border-2 text-red' : ''
        } ${
          disabled
            ? 'bg-gray-gainsboro/60 border-gray-sliver text-gray-dim cursor-not-allowed'
            : 'bg-white border-gray text-blue-oxford focus:border-blue-pacific hover:border-blue-pacific cursor-pointer'
        }  ${isFocused ? 'border-lavender' : ''}  ${className || ''}`}
      >
        <p
          className={`flex items-center h-full text-blue-oxford border-r  px-2 ${
            isFocused ? 'border-blue-pacific' : 'border-gray'
          }`}
        >
          {prefix}
        </p>
        <input
          className="w-full outline-none mx-2"
          name={name}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onChange={handleOnChange}
          onBlur={() => setIsFocused(false)}
          onFocus={() => setIsFocused(true)}
        />
      </div>
      {resolveName(name, errors)?.message && (
        <span className="text-red text-sm">{resolveName(name, errors)?.message}</span>
      )}
    </div>
  );
};

export default memo(PrefixInput);
