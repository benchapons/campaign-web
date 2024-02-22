import { FC, memo, useId, useMemo } from 'react';
import Select, { ActionMeta, OnChangeValue } from 'react-select';
import { useFormContext } from 'react-hook-form';

import { OptionsDropdown, ChangeEventMultiBaseType } from '@/types/event.interface';
import { resolveName } from '@/utilities/format';
import { AllOptionValue } from '@/constants/global';

interface SelectProps {
  isSearchable?: boolean;
  disabled?: boolean;
  isClearable?: boolean;
  isRequired?: boolean;
  label?: string;
  value?: string[];
  name?: string;
  options: OptionsDropdown[];
  placeholder?: string;
  className?: string;
  desc?: string;
  testId?: string;
  onChange?: (onChange: ChangeEventMultiBaseType<string>) => void;
}

/**
 * MultiSelect component
 *
 * @param {OptionsDropdown[]} [props.options]
 * @param {OptionsDropdown[]} [props.value]
 * @param {string} [props.label]
 * @param {string} [props.name]
 * @param {string} [props.placeholder]
 * @param {boolean} [props.isSearchable]
 * @param {boolean} [props.disabled]
 * @param {boolean} [props.isClearable]
 * @param {boolean} [props.isRequired]
 * @param {(data: OptionsDropdown[]) => void} [props.onChange]
 * @returns {React.ReactElement}
 */

const customStyles = {
  container: (provided: any) => ({
    ...provided,
    width: '100%',
  }),
  control: (provided: any, state: any) => ({
    ...provided,
    boxShadow: 'none',

    background: state.isDisabled ? '#e8ecef' : '#FFF',
    border: state.isDisabled ? '' : '1px solid #797e89',
    borderColor: state.isDisabled ? '#abb8c3' : '#797e89',
    color: state.isDisabled ? '#797e89' : '#1a2238',
    '&:hover': {
      borderColor: '#9daaf2',
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
    color: state.isDisabled ? '#797e89' : '#1a2238',
  }),
  menu: (provided: any) => ({
    ...provided,
    borderBottom: '1px dotted pink',
    color: '#1a2238',
  }),
  menuPortal: (provided: any) => ({
    ...provided,
    '&:hover': {
      background: '#8ed1fc',
    },
  }),
  multiValue: (styles: any, state: any) => {
    return {
      ...styles,
      backgroundColor: state.isDisabled ? '#797e894d' : state?.data?.isDisabled ? '#797e894d' : '#9daaf280',
    };
  },
  multiValueLabel: (styles: any, state: any) => ({
    ...styles,
    color: state.isDisabled ? '#797e89' : state?.data?.isDisabled ? '#797e89' : '#3b4ca8',
  }),
  multiValueRemove: (styles: any, state: any) => ({
    ...styles,
    color: state.isDisabled ? '#797e89' : '#3b4ca8',
    ':hover': {
      backgroundColor: '#3b4ca8',
      color: 'white',
    },
  }),
};

const MultiSelect: FC<SelectProps> = ({
  isSearchable,
  disabled,
  isClearable,
  isRequired,
  label,
  value,
  name,
  options,
  placeholder,
  className,
  desc,
  testId = '',
  onChange,
}) => {
  const {
    formState: { errors },
  } = useFormContext();

  const valueData: any = useMemo(() => value?.map((i) => options?.find((m) => m?.value === i)), [value, options]);

  const onChangeHandle = (newValue: OnChangeValue<OptionsDropdown, true>, actionMeta: ActionMeta<OptionsDropdown>) => {
    const changeEvent: ChangeEventMultiBaseType = {
      name: name || '',
      value: newValue?.some((obj: OptionsDropdown) => obj.value === AllOptionValue)
        ? [AllOptionValue]
        : newValue?.map((i) => i?.value) || [],
    };
    onChange?.(changeEvent);
  };
  return (
    <div
      test-id={testId ? `multi-dropdown-${testId}` : 'multi-dropdown'}
      className={` ${className} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
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
        isMulti
        classNamePrefix="select"
        value={valueData}
        isDisabled={disabled}
        isClearable={isClearable || false}
        isSearchable={isSearchable || false}
        name={name}
        inputId={name}
        options={options}
        styles={customStyles}
        placeholder={placeholder || 'กรุณาเลือก'}
        test-id={name}
        instanceId={useId()}
        onChange={onChangeHandle}
      />
      {resolveName(name, errors)?.message && (
        <span className="text-red text-sm">{resolveName(name, errors)?.message}</span>
      )}
    </div>
  );
};

export default memo(MultiSelect);
