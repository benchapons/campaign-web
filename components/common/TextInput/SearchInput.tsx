import { memo, FC, useState, ChangeEventHandler, Fragment } from 'react';
import { IoClose, IoSearch } from 'react-icons/io5';

import { ChangeEventBaseType } from '@/types/event.interface';

interface SearchInputProps {
  isShowCloseBtn: boolean;
  disabled?: boolean;
  label?: string;
  name?: string;
  value?: string;
  placeholder?: string;
  className?: string;
  testId?: string;
  onReset?: () => void;
  onChange?: (onChange: ChangeEventBaseType<string>) => void;
}

const SearchInput: FC<SearchInputProps> = ({
  isShowCloseBtn,
  label,
  name,
  value,
  onChange,
  disabled,
  className,
  placeholder,
  testId = '',
  onReset,
}) => {
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
    <div className="flex flex-col w-full" test-id={testId ? `search-input-${testId}` : 'search-input'}>
      {label && <div className="pb-1.5">{label}</div>}

      <div
        className={`h-10 py-0.5 px-2 flex rounded border ${
          disabled
            ? 'bg-gray-gainsboro/60 border-gray-sliver text-gray-dim cursor-not-allowed'
            : 'bg-white border-gray text-blue-oxford focus:border-blue-pacific hover:border-blue-pacific cursor-pointer'
        }  ${isFocused ? 'border-blue-pacific' : ''} ${className || ''}`}
      >
        <IoSearch className="text-4xl text-blue-oxford" />
        <input
          className="w-full outline-none ml-2"
          name={name}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          test-id={testId}
          onChange={handleOnChange}
          onBlur={() => setIsFocused(false)}
          onFocus={() => setIsFocused(true)}
        />
        {onReset && isShowCloseBtn ? (
          <IoClose
            className="text-4xl text-blue-oxford hover:text-blue-pacific hover:cursor-pointer"
            onClick={() => onReset()}
          />
        ) : null}
      </div>
    </div>
  );
};

export default memo(SearchInput);
