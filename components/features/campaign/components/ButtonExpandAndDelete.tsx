import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { MdOutlineDeleteForever } from 'react-icons/md';

interface ButtonExpandAndDeleteProps {
  isExpand: boolean;
  isShowDelete?: boolean;
  testIdExpand?: string;
  testIdDelete?: string;
  handleToggleExpand: () => void;
  handleDelete: () => void;
}

const ButtonExpandAndDelete = ({
  isExpand,
  isShowDelete = false,
  testIdExpand,
  testIdDelete,
  handleToggleExpand,
  handleDelete,
}: ButtonExpandAndDeleteProps) => {
  return (
    <div className="flex gap-2 min-w-[70px] justify-end">
      <button
        test-id={testIdExpand || 'expand'}
        className="min-w-[30px] min-h-[30px] border border-gray-gainsboro rounded-md flex justify-center items-center hover:border-blue-pacific"
        onClick={handleToggleExpand}
      >
        {isExpand ? (
          <IoIosArrowUp className="text-xl text-blue-pacific" />
        ) : (
          <IoIosArrowDown className="text-xl  text-blue-pacific" />
        )}
      </button>
      {isShowDelete ? (
        <button
          test-id={testIdDelete || 'delete'}
          className="min-w-[30px] min-h-[30px] border border-gray-gainsboro rounded-md flex justify-center items-center hover:border-red"
          onClick={handleDelete}
        >
          <MdOutlineDeleteForever className="text-xl text-red" />
        </button>
      ) : null}
    </div>
  );
};
export default ButtonExpandAndDelete;
