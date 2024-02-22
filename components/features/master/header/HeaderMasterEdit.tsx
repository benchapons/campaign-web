import Button from '@/components/common/Button';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';

interface PropsType {
  masterName: string;
  handleClickCancel: () => void;
  handleClickUpdate: () => void;
}

const HeaderMasterEdit = ({ masterName, handleClickCancel, handleClickUpdate }: PropsType) => {
  return (
    <header className="flex justify-between items-center px-5 pt-3 pb-2 border-b border-gray-gainsboro shadow-sm bg-white-ghost/50">
      <div
        test-id="back-to-reward"
        className="flex items-center hover:cursor-pointer hover:bg-blue-fresh/30 py-1 pr-2 rounded-md ease-in duration-150"
        onClick={handleClickCancel}
      >
        <MdOutlineKeyboardArrowLeft className="text-2xl text-blue-pacific font-bold" />
        <p className="text-gray-dim">Back to Master Management</p>
      </div>
      <h1 className="text-2xl font-semibold">{masterName || 'Edit Reward'}</h1>
      <div className="flex justify-end gap-4">
        <Button name="update-edit-reward" onClick={handleClickUpdate}>
          Update
        </Button>
      </div>
    </header>
  );
};

export default HeaderMasterEdit;
