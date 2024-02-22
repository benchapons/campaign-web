import { memo, FC, ChangeEventHandler, useMemo } from 'react';

import { ChangeEventBaseType } from '@/types/event.interface';
import { useFormContext } from 'react-hook-form';
import { resolveName } from '@/utilities/format';

interface TextAreaProps {
  label?: string;
  value?: string;
  name: string;
  disabled?: boolean;
  isRequired?: boolean;
  placeholder?: string;
  className?: string;
  id?: string;
  cols?: number;
  rows?: number;
  isStartLabel?: boolean;
  testId?: string;
  onChange?: (onChange: ChangeEventBaseType<string>) => void;
}

/**
 * TextArea component
 *
 * @param {string} [props.placeHolder]
 * @param {string} [props.value]
 * @param {string} [props.label]
 * @param {string} [props.className]
 * @param {string} [props.id]
 * @param {string} [props.name]
 * @param {boolean} [props.disabled]
 * @param {boolean} [props.isRequired]
 * @param {(onChange: ChangeEventBaseType<string>) => void} [props.onChange]
 * @returns {React.ReactElement}
 */

const TextArea: FC<TextAreaProps> = ({
  isStartLabel = false,
  label,
  isRequired,
  value,
  disabled,
  onChange,
  name,
  placeholder,
  className,
  id,
  rows = 4,
  testId = '',
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const handleOnChange: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    const changeEvent: ChangeEventBaseType = {
      name: event.target.name,
      value: event.target.value,
    };
    onChange?.(changeEvent);
    register(name)?.onChange(event);
  };
  return (
    <div className="flex flex-col" test-id={testId ? `textarea-${testId}` : 'textarea'}>
      {label && (
        <label className={`${isStartLabel ? 'text-start' : ''} py-1`}>
          {label}
          {isRequired && <b className="text-red ml-1"> * </b>}
        </label>
      )}
      <textarea
        {...register(name)}
        rows={rows}
        className={`text-base rounded-md px-4 py-2 outline-0 border ${className} rounded ${
          resolveName(name, errors)?.message ? 'border-red border-2 text-red' : ''
        } ${
          disabled
            ? 'bg-gray-gainsboro/60 border-gray-sliver text-gray-dim cursor-not-allowed'
            : 'bg-white border-gray text-blue-oxford focus:border-blue-pacific hover:border-blue-pacific cursor-pointer'
        }`}
        id={id}
        test-id={testId}
        disabled={disabled}
        value={value}
        placeholder={placeholder}
        onChange={handleOnChange}
      />
      {resolveName(name, errors)?.message && (
        <span className="text-red text-sm">{resolveName(name, errors)?.message}</span>
      )}
    </div>
  );
};

export default memo(TextArea);
