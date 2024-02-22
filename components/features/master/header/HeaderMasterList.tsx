import Button from '@/components/common/Button';
import { Permission } from '@/constants/auth';
import { AuthorizedUserType } from '@/types/auth.type';
import { isPagePermission } from '@/utilities/auth';
import { MdAdd } from 'react-icons/md';

interface PropsType {
  authorizedUser: AuthorizedUserType;
  handleClickAddMaster: () => void;
}

const HeaderMasterList = ({ authorizedUser, handleClickAddMaster }: PropsType) => {
  return (
    <header className="flex justify-between items-center px-5 pt-3 pb-2 border-b border-gray-gainsboro shadow-sm bg-white-ghost/50">
      <h1 className="text-2xl font-semibold">Master management</h1>
      {isPagePermission(authorizedUser, [Permission.MASTER_CREATE]) && (
        <Button name="add-reward" onClick={handleClickAddMaster}>
          <MdAdd className="text-xl mr-1" />
          Add Master
        </Button>
      )}
    </header>
  );
};

export default HeaderMasterList;
