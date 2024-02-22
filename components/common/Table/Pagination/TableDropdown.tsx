import { FC, memo } from 'react';
import Select, { ActionMeta, OnChangeValue } from 'react-select';

import { OptionsDropdown, ChangeEventBaseType } from '@/types/event.interface';

interface PropsType {
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
  errorMsg?: string;
  placeholder?: string;
  className?: string;
  testId?: string;
  onChange?: (data: ChangeEventBaseType<string>) => void;
}

const colorStyles = {
  container: (provided: any) => ({
    ...provided,
    maxHeight: '32px',
    width: '100%',
  }),
  control: (provided: any, state: any) => ({
    ...provided,
    minHeight: '32px',
    height: '32px',
    boxShadow: 'none',

    background: state.isDisabled ? '#DCE3E7' : '#fff',
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
  indicatorsContainer: (provided: any) => ({
    ...provided,
    height: '32px',
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
    zIndex: 99,
  }),
  menuPortal: (provided: any) => ({
    ...provided,
    zIndex: 99,
    '&:hover': {
      background: '#8ed1fc',
    },
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    height: '30px',
    padding: '0 6px',
  }),
};

const TableDropdown: FC<PropsType> = ({
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
  errorMsg,
  placeholder,
  className,
  testId = '',
  onChange,
}) => {
  const onChangeHandle = (newValue: OnChangeValue<OptionsDropdown, false>) => {
    const changeEvent: ChangeEventBaseType = {
      name: name || '',
      value: newValue?.value || '',
    };
    onChange?.(changeEvent);
  };
  return (
    <div
      test-id="table-drop-down"
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
        menuPosition={'fixed'}
        classNamePrefix="select"
        value={options?.find((i) => i.value === value || i.label === value) || ('' as any)}
        isDisabled={disabled}
        isClearable={isClearable || false}
        isSearchable={isSearchable || false}
        name={name}
        inputId={name}
        options={options}
        styles={colorStyles}
        onChange={onChangeHandle}
        placeholder={placeholder || 'กรุณาเลือก'}
        isOptionSelected={() => false}
        test-id={testId}
      />
      {errorMsg && <span className="text-red text-sm">{errorMsg}</span>}
    </div>
  );
};

export default memo(TableDropdown);
