import Button from '@/components/common/Button';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';

interface PropsType {
  handleClickCancel: () => void;
  handleClickSubmit: () => void;
}

const HeaderRewardCreate = ({ handleClickCancel, handleClickSubmit }: PropsType) => {
  return (
    <header className="flex justify-between items-center px-5 pt-3 pb-2 border-b border-gray-gainsboro shadow-sm bg-white-ghost/50">
      <div
        test-id="back-to-reward"
        className="flex items-center hover:cursor-pointer hover:bg-blue-fresh/30 py-1 pr-2 rounded-md ease-in duration-150"
        onClick={handleClickCancel}
      >
        <MdOutlineKeyboardArrowLeft className="text-2xl text-blue-pacific font-bold" />
        <p className="text-gray-dim">Back to Rewards</p>
      </div>
      <h1 className="text-2xl font-semibold">Create Reward</h1>
      <div className="flex justify-end gap-4">
        {/* <Button theme="secondary" onClick={handleClickCancel}>
          Cancel
        </Button> */}
        <Button name="submit-create-reward" onClick={handleClickSubmit}>
          Submit
        </Button>
      </div>
    </header>
  );
};

export default HeaderRewardCreate;
