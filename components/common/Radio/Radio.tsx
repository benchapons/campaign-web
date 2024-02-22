import { FC, memo, ChangeEventHandler } from 'react';

import { ChangeEventBaseType } from '@/types/event.interface';
import styles from '@/components/common/Radio/Radio.module.css';

interface RadioProps {
  label: string;
  name: string;
  checked?: boolean;
  value?: string | number;
  disabled?: boolean;
  desc?: string;
  testId?: string;
  onChange?: (onChange: ChangeEventBaseType<string>) => void;
}

/**
 * Radio component
 *
 * @param {string} [props.name]
 * @param {string | number} [props.value]
 * @param {string} [props.label]
 * @param {boolean} [props.disabled]
 * @param {boolean} [props.checked]
 * @param {(onChange: ChangeEventBaseType<string>) => void} [props.onChange]
 * @returns {React.ReactElement}
 */

const Radio: FC<RadioProps> = ({ label, name, checked, desc, onChange, value, disabled = false, testId = '' }) => {
  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const changeEvent: ChangeEventBaseType = {
      name: event.target.name,
      value: event.target.value,
    };
    onChange?.(changeEvent);
  };

  return (
    <label
      test-id={testId ? `radio-${testId}` : 'radio'}
      className={`${styles.radio} ${disabled ? styles.disabled : undefined} my-2`}
    >
      <input
        type="radio"
        value={value}
        name={name}
        checked={checked}
        onChange={handleOnChange}
        disabled={disabled}
        test-id={testId}
      />
      <span test-id={testId ? `radio-check-${testId}` : 'radio-check'} className={`${styles['check-mark']}`}></span>
      <div>
        <p className={`${disabled ? 'text-gray' : ''} mx-2 text-base`}>{label}</p>
        {desc ? <p className="text-gray-dark text-sm mx-2">{desc}</p> : null}
      </div>
    </label>
  );
};

export default memo(Radio);
