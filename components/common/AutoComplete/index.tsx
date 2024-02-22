import { FC, memo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useCombobox } from 'downshift';

import { ChangeEventBaseType } from '@/types/event.interface';
import { resolveName } from '@/utilities/format';

interface SelectProps {
  disabled?: boolean;
  isRequired?: boolean;
  name: string;
  options: string[];
  label?: string;
  desc?: string;
  value?: string | number;
  placeholder?: string;
  className?: string;
  id?: string;
  testId?: string;
  onChange?: (data: ChangeEventBaseType<string>) => void;
}

const AutoComplete: FC<SelectProps> = ({
  disabled,
  isRequired,
  label,
  desc,
  value,
  name,
  id,
  options,
  placeholder,
  className,
  testId = '',
  onChange,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const [inputItems, setInputItems] = useState<string[]>(options);

  const { isOpen, getInputProps, getItemProps, getMenuProps, highlightedIndex, selectedItem } = useCombobox({
    items: options,
    itemToString: (item) => {
      return item ? item : '';
    },
    onInputValueChange: ({ inputValue }) => {
      const changeEvent: ChangeEventBaseType = {
        name: name || '',
        value: inputValue || '',
      };
      onChange?.(changeEvent);
      register(name)?.onChange({
        type: 'change',
        target: {
          name,
          value,
        },
      });
      const inputItem = options.filter((item) => {
        return !inputValue || item.toLowerCase().includes(inputValue.toLowerCase());
      });
      setInputItems(inputItem);
    },
    // onSelectedItemChange: ({ selectedItem }) => {
    //   // onChange(selectedItem);

    //   // setInputValue(selectedItem.value);
    // },
  });

  return (
    <div className="relative" test-id={testId ? `autocomplete-${testId}` : 'autocomplete'}>
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
        {...getInputProps({
          isOpen,
          value: value,
          disabled: disabled,
          placeholder: placeholder,
          id: id,
        })}
        className={`w-full text-base h-9 rounded-md px-4 outline-0 border ${className} ${
          resolveName(name, errors)?.message ? 'border-red border-2 text-red' : ''
        } ${
          disabled
            ? 'bg-gray-gainsboro/60 border-gray-sliver text-gray-dim cursor-not-allowed'
            : 'bg-white border-gray text-blue-oxford focus:border-blue-pacific hover:border-blue-pacific cursor-pointer'
        }`}
        test-id={testId}
      />
      <ul
        {...getMenuProps()}
        className={`${
          isOpen && inputItems?.length
            ? 'mt-1 py-1 rounded border border-gray-gainsboro max-h-60 overflow-auto absolute top-9 w-full z-50'
            : ''
        }`}
      >
        {isOpen &&
          inputItems.map((item, index) => (
            <li
              key={`${item}${index}`}
              className="p-2 cursor-pointer"
              test-id={testId ? `${testId}-${index}` : index}
              {...getItemProps({
                item,
                style: {
                  backgroundColor: highlightedIndex === index ? '#B0DAFF' : 'white',
                },
              })}
            >
              {item}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default memo(AutoComplete);
