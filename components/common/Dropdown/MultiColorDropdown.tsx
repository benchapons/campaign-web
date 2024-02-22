import { FC, memo, useMemo } from 'react';
import Select, { ActionMeta, OnChangeValue } from 'react-select';
import chroma from 'chroma-js';

import { OptionsDropdown, ChangeEventMultiBaseType } from '@/types/event.interface';
import { useFormContext } from 'react-hook-form';
import { resolveName } from '@/utilities/format';

interface SelectProps {
  isSearchable?: boolean;
  disabled?: boolean;
  isClearable?: boolean;
  isRequired?: boolean;
  label?: string;
  value?: string[];
  name?: string;
  options: OptionsDropdown[];
  errorMsg?: string;
  placeholder?: string;
  className?: string;
  onChange?: (onChange: ChangeEventMultiBaseType<string>) => void;
}

/**
 * MultiSelect component
 *
 * @param {OptionsDropdown[]} [props.options]
 * @param {OptionsDropdown[]} [props.value]
 * @param {string} [props.label]
 * @param {string} [props.name]
 * @param {string} [props.errorMsg]
 * @param {string} [props.placeholder]
 * @param {boolean} [props.isSearchable]
 * @param {boolean} [props.disabled]
 * @param {boolean} [props.isClearable]
 * @param {boolean} [props.isRequired]
 * @param {(data: OptionsDropdown[]) => void} [props.onChange]
 * @returns {React.ReactElement}
 */


const MultiColorDropdown: FC<SelectProps> = ({
  isSearchable,
  disabled,
  isClearable,
  isRequired,
  label,
  value,
  name,
  options,
  errorMsg,
  placeholder,
  className,
  onChange,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const valueData: any = useMemo(() => value?.map((i) => options?.find((m) => m?.value === i)), [value]);

  const onChangeHandle = (newValue: OnChangeValue<OptionsDropdown, true>, actionMeta: ActionMeta<OptionsDropdown>) => {
    const changeEvent: ChangeEventMultiBaseType = {
      name: name || '',
      value: newValue?.map((i) => i?.value) || [],
    };
    onChange?.(changeEvent);
  };

  const colorStyles = useMemo(() => {
    return {
      container: (provided: any) => ({
        ...provided,
        width: '100%',
      }),
      option: (styles: any, { data, isDisabled, isFocused, isSelected }: any) => {
        const color = chroma(data.color);
        return {
          ...styles,
          backgroundColor: isDisabled
            ? undefined
            : isSelected
            ? data.color
            : isFocused
            ? color.alpha(0.1).css()
            : undefined,
          color: isDisabled
            ? '#ccc'
            : isSelected
            ? chroma.contrast(color, 'white') > 2
              ? 'white'
              : 'black'
            : data.color,
          cursor: isDisabled ? 'not-allowed' : 'default',

          ':active': {
            ...styles[':active'],
            backgroundColor: !isDisabled ? (isSelected ? data.color : color.alpha(0.3).css()) : undefined,
          },
        };
      },
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
      multiValue: (styles: any, { data, isDisabled }: any) => {
        const color = chroma(data.color);
        return {
          ...styles,
          backgroundColor: isDisabled ? '#797e894d' : color.alpha(0.3).css(),
        };
      },
      multiValueLabel: (styles: any, { isDisabled, data }: any) => ({
        ...styles,
        color: isDisabled ? '#797e89' : data.color,
      }),
      multiValueRemove: (styles: any, { isDisabled, data }: any) => ({
        ...styles,
        color: isDisabled ? '#797e89' : data.color,
        ':hover': {
          backgroundColor: data.color,
          color: 'white',
        },
      }),
    };
  }, [resolveName(name, errors)?.message]);

  return (
    <div className={` ${className} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
      {label && (
        <label>
          {label}
          {isRequired && <b className="text-red ml-1"> * </b>}
        </label>
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
        styles={colorStyles}
        onChange={onChangeHandle}
        placeholder={placeholder || 'กรุณาเลือก'}
      />
      {resolveName(name, errors)?.message && (
        <span className="text-red text-sm">{resolveName(name, errors)?.message}</span>
      )}
    </div>
  );
};

export default memo(MultiColorDropdown);
