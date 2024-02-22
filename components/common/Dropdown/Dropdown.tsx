import { FC, memo, useId, useMemo } from 'react';
import Select, { ActionMeta, OnChangeValue } from 'react-select';
import { useFormContext } from 'react-hook-form';

import { OptionsDropdown, ChangeEventBaseType } from '@/types/event.interface';
import { resolveName } from '@/utilities/format';

interface SelectProps {
  isSearchable?: boolean;
  disabled?: boolean;
  isClearable?: boolean;
  isRequired?: boolean;
  isFull?: boolean;
  name: string;
  options: OptionsDropdown[];
  label?: string;
  desc?: string;
  value?: string | number;
  placeholder?: string;
  className?: string;
  testId?: string;
  onChange?: (data: ChangeEventBaseType<string>) => void;
}

/**
 * Dropdown component
 *
 * @param {OptionsDropdown[]} [props.options]
 * @param {OptionsDropdown} [props.value]
 * @param {string} [props.label]
 * @param {string} [props.name]
 * @param {string} [props.placeholder]
 * @param {string} [props.className]
 * @param {boolean} [props.isSearchable]
 * @param {boolean} [props.disabled]
 * @param {boolean} [props.isClearable]
 * @param {boolean} [props.isRequired]
 * @param {boolean} [props.isFull]
 * @param {(data: OptionsDropdown) => void} [props.onChange]
 * @returns {React.ReactElement}
 */

const Dropdown: FC<SelectProps> = ({
  isSearchable,
  disabled,
  isClearable,
  isRequired,
  isFull,
  label,
  desc,
  value,
  name,
  options,
  placeholder,
  className,
  testId = '',
  onChange,
}) => {
  // disable 'bg-gray-gainsboro/60 border-gray-sliver text-gray-dim cursor-not-allowed'
  //  'bg-white border-gray text-blue-oxford focus:border-blue-pacific hover:border-blue-pacific cursor-pointer'
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const colorStyles = useMemo(() => {
    return {
      container: (provided: any) => ({
        ...provided,
        width: '100%',
      }),
      control: (provided: any, state: any) => ({
        ...provided,
        minHeight: '36px',
        boxShadow: 'none',
        background: state.isDisabled ? 'rgba(220,220,220, 0.6)' : '#fff',
        borderWidth: resolveName(name, errors)?.message ? '2px' : state.isDisabled ? '1px' : '1px',
        borderColor: resolveName(name, errors)?.message ? '#D2001A' : state.isDisabled ? '#C0C0C0' : '#808080',
        color: state.isDisabled ? '#696969' : '#0A2647',
        '&:hover': {
          borderColor: '#19A7CE',
          cursor: 'pointer',
        },
      }),
      indicatorSeparator: () => ({
        display: 'none',
      }),
      dropdownIndicator: (provided: any) => ({
        ...provided,
        color: 'inherit',
      }),
      singleValue: (provided: any, state: any) => ({
        ...provided,
        color: state.isDisabled ? '#797e89' : state?.data?.isDisabled ? '#797e89' : '#1a2238',
      }),
      menu: (provided: any) => ({
        ...provided,
        borderBottom: '1px dotted pink',
        color: '#1a2238',
        zIndex: 99,
      }),
      menuPortal: (provided: any) => ({
        ...provided,
        zIndex: 99,
        '&:hover': {
          background: '#8ed1fc',
        },
      }),
    };
  }, [resolveName(name, errors)?.message]);

  const onChangeHandle = (newValue: OnChangeValue<OptionsDropdown, false>, actionMeta: ActionMeta<OptionsDropdown>) => {
    const { value, ...data }: any = newValue;
    const changeEvent: ChangeEventBaseType = {
      name: name || '',
      value: value || '',
      ...(data?.masterId && { masterId: data?.masterId }),
      ...(data && { data }),
    };
    onChange?.(changeEvent);
    register(name)?.onChange({
      type: 'change',
      target: {
        name,
        value,
      },
    });
  };
  return (
    <div
      id={name}
      test-id={testId ? `dropdown-${testId}` : 'dropdown'}
      className={`${className || ''} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${isFull ? 'w-full' : ''}`}
    >
      {label && (
        <div className="flex justify-between">
          <label className=" py-1">
            {label}
            {isRequired && <b className="text-red ml-1"> * </b>}
          </label>
          {desc ? <p className="text-orange-tangerine">{desc}</p> : null}
        </div>
      )}
      <Select
        {...register(name)}
        menuPosition={'fixed'}
        classNamePrefix="select"
        value={options?.find((i) => i.value === value || i.label === value) || ('' as any)}
        isDisabled={disabled}
        isClearable={isClearable || false}
        isSearchable={isSearchable || false}
        inputId={name}
        options={options}
        styles={colorStyles}
        placeholder={placeholder || 'กรุณาเลือก'}
        isOptionSelected={() => false}
        instanceId={useId()}
        onChange={onChangeHandle}
        name={name}
        test-id={testId}
      />
      {resolveName(name, errors)?.message && (
        <span className="text-red text-sm">{resolveName(name, errors)?.message}</span>
      )}
    </div>
  );
};

export default memo(Dropdown);
