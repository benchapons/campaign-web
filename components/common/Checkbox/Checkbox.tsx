import { FC, memo, ChangeEventHandler } from 'react';
import { useFormContext } from 'react-hook-form';

import { ChangeEventBaseType } from '@/types/event.interface';
import styles from '@/components/common/Checkbox/Checkbox.module.css';

interface CheckboxProps {
  label: string;
  name: string;
  checked?: boolean;
  value?: string | number;
  disabled?: boolean;
  className?: string;
  desc?: string;
  testId?: string;
  onChange?: (onChange: ChangeEventBaseType<boolean>) => void;
}

/**
 * Checkbox component
 *
 * @param {string} [props.label]
 * @param {string} [props.name]
 * @param {string | number} [props.value]
 * @param {boolean} [props.disabled]
 * @param {boolean} [props.checked]
 * @param {string} [props.className]
 * @param {string} [props.desc]
 * @param {(onChange: ChangeEventBaseType<boolean>) => void} [props.onChange]
 * @returns {React.ReactElement}
 */

const Checkbox: FC<CheckboxProps> = ({
  label,
  name,
  checked,
  className,
  value,
  disabled = false,
  desc,
  testId = '',
  onChange,
}) => {
  const { register } = useFormContext();
  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const changeEvent: ChangeEventBaseType<boolean> = {
      name: event.target.name,
      value: event.target.checked,
      data: event?.target?.value,
    };
    onChange?.(changeEvent);
    register(name)?.onChange(event);
  };

  return (
    <label
      test-id={testId ? `checkbox-${testId}` : 'checkbox'}
      className={`${styles.container} ${disabled ? styles.disabled : ''} my-2 ${className ? className : ''}`}
    >
      <input
        {...register(name)}
        // {...register(name, { disabled: disabled })} //issue: Uncontrolled disabled checkbox assigned the wrong defaultChecked
        type="checkbox"
        value={value}
        name={name}
        checked={checked}
        test-id={testId}
        disabled={disabled}
        onChange={handleOnChange}
      />
      <span className={`${styles['check-mark']} ${disabled ? styles.disabled : ''}`}></span>
      <div>
        <p className={`${disabled ? 'text-gray' : ''} mx-2 text-base`}>{label}</p>
        {desc ? <p className="text-gray-dark text-sm mx-2">{desc}</p> : null}
      </div>
    </label>
  );
};

export default memo(Checkbox);
