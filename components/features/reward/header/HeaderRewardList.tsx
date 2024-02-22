import Button from '@/components/common/Button';
import { Permission } from '@/constants/auth';
import { AuthorizedUserType } from '@/types/auth.type';
import { isPagePermission } from '@/utilities/auth';
import { MdAdd } from 'react-icons/md';

interface PropsType {
  authorizedUser: AuthorizedUserType;
  handleClickAddReward: () => void;
}

const HeaderRewardList = ({ authorizedUser, handleClickAddReward }: PropsType) => {
  return (
    <header className="flex justify-between items-center px-5 pt-3 pb-2 border-b border-gray-gainsboro shadow-sm bg-white-ghost/50">
      <h1 className="text-2xl font-semibold">Reward</h1>
      {isPagePermission(authorizedUser, [Permission.RWD_CREATE]) && (
        <Button name="add-reward" onClick={handleClickAddReward}>
          <MdAdd className="text-xl mr-1" />
          Add Reward
        </Button>
      )}
    </header>
  );
};

export default HeaderRewardList;
