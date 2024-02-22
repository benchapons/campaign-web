import { FC, memo, useRef, useState } from 'react';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import { BsCalendar3 } from 'react-icons/bs';

import { ChangeEventBaseType } from '@/types/event.interface';
import { Controller, useFormContext } from 'react-hook-form';
import { resolveName } from '@/utilities/format';

interface DatePickerProps {
  isRequired?: boolean;
  disabled?: boolean;
  name: string;
  label?: string;
  value?: string | null;
  placeholder?: string;
  className?: string;
  classNameInput?: string;
  id?: string;
  minDate?: Date | string | null;
  maxDate?: Date | string | null;
  currentDate?: DateObject;
  testId?: string;
  onChange?: (data: ChangeEventBaseType<string>) => void;
  onOpen?: () => void;
}

/**
 * DatePicker component
 *
 * @param {Date | string} [props.value]
 * @param {string} [props.label]
 * @param {string} [props.name]
 * @param {string} [props.placeholder]
 * @param {string} [props.className]
 * @param {string} [props.id]
 * @param {Date | string} [props.minDate]
 * @param {Date | string} [props.maxDate]
 * @param {boolean} [props.disabled]
 * @param {boolean} [props.isRequired]
 * @param {(onChange: ChangeEventBaseType<string>) => void} [props.onChange]
 * @returns {React.ReactElement}
 */

const DatePickerUI: FC<DatePickerProps> = ({
  isRequired,
  disabled,
  value,
  name,
  label,
  placeholder,
  id,
  className,
  classNameInput,
  maxDate = undefined,
  minDate,
  currentDate,
  testId = '',
  onChange,
  onOpen,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const calendarRef = useRef<any>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleOnChange = (data: any) => {
    const changeEvent: ChangeEventBaseType = {
      name: name || '',
      value: data?.format('YYYY-MM-DD'), // don't change format
    };
    onChange?.(changeEvent);
  };

  return (
    <div className={`flex flex-col ${className}`} test-id={testId ? `date-picker-${testId}` : 'date-picker'}>
      {label && (
        <label htmlFor={id} className="py-1">
          {label}
          {isRequired && <b className="text-red ml-1"> * </b>}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div
            className={`h-10 py-0.5 px-2 flex justify-between items-center rounded border ${
              resolveName(name, errors)?.message ? 'border-red border-2' : ''
            } ${
              disabled
                ? 'bg-gray-gainsboro/60 border-gray-sliver text-gray-dim cursor-not-allowed'
                : classNameInput
                ? classNameInput
                : 'bg-white border-gray text-blue-oxford focus:border-blue-pacific hover:border-blue-pacific cursor-pointer'
            }  ${isFocused ? 'border-blue-pacific' : ''}`}
            test-id={testId ? `date-picker-content-${testId}` : 'date-picker-content'}
          >
            <DatePicker
              ref={calendarRef}
              containerClassName="w-[95%]"
              inputClass="w-full bg-transparent h-full outline-none"
              name={name}
              id={id}
              placeholder={placeholder}
              value={value ? new Date(value) : ''}
              format={'DD/MM/YYYY'}
              disabled={disabled}
              maxDate={maxDate || undefined}
              minDate={minDate || undefined}
              test-id={testId}
              onChange={(e: any) => {
                handleOnChange(e);
                return field.onChange(e ? e?.format('YYYY-MM-DD') : '');
              }}
              onOpen={() => {
                setIsFocused(true);
                onOpen ? onOpen() : undefined;
              }}
              onClose={() => setIsFocused(false)}
              currentDate={currentDate}
              // editable={false}
            />
            <BsCalendar3
              className={isFocused ? 'text-blue-pacific' : 'text-blue-oxford'}
              onClick={() => calendarRef?.current?.openCalendar()}
            />
          </div>
        )}
      />
      {resolveName(name, errors)?.message && (
        <span className="text-red text-sm">{resolveName(name, errors)?.message}</span>
      )}
    </div>
  );
};

export default memo(DatePickerUI);
