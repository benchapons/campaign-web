import { memo } from 'react';
import { RxReload } from 'react-icons/rx';

interface ReloadButtonProps {
  handleClickReload: () => void;
}

const ReloadButton = ({ handleClickReload }: ReloadButtonProps) => {
  return (
    <button
      test-id="reload"
      className="border border-gray px-6 rounded-md hover:border-blue-pacific"
      onClick={() => handleClickReload()}
    >
      <RxReload className="text-xl text-blue-pacific" />
    </button>
  );
};

export default memo(ReloadButton);
