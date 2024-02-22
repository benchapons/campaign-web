import { TextInput } from '../TextInput';
import Radio from './Radio';

import { ChangeEventBaseType } from '@/types/event.interface';
import { Character } from '@/types/global.type';

interface RadioWithTextProps {
  label: string;
  nameRadio: string;
  nameTextInput: string;
  checked?: boolean;
  valueRadio?: string | number;
  valueInput?: string;
  disabledRadio?: boolean;
  character?: Character;
  onChange?: (onChange: ChangeEventBaseType<string>) => void;
}

const RadioWithText = ({
  label,
  nameRadio,
  nameTextInput,
  checked,
  valueRadio,
  valueInput,
  disabledRadio,
  character,
  onChange,
}: RadioWithTextProps) => {
  return (
    <div className="flex">
      <Radio
        disabled={disabledRadio}
        label={label}
        name={nameRadio}
        checked={checked}
        value={valueRadio}
        onChange={onChange}
      />
      <TextInput
        disabled={!checked}
        name={nameTextInput}
        value={valueInput}
        character={character}
        onChange={onChange}
      />
    </div>
  );
};

export default RadioWithText;
