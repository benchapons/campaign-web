import { Tooltip } from 'react-tooltip';
import { MdEditNote, MdOutlineDeleteForever } from 'react-icons/md';
import { FiEdit3 } from 'react-icons/fi';

interface ActionButtonProps {
  isPermissionDelete: boolean;
  isPermissionEdit: boolean;
  isPermissionAuditLog: boolean;
  isDisableEdit?: boolean;
  isDisableDelete?: boolean;
  index: number;
  onClickEdit: () => void;
  onClickDelete: () => void;
  onClickAuditLog: () => void;
}

const ActionButton = ({
  isDisableEdit,
  isDisableDelete,
  isPermissionAuditLog,
  isPermissionDelete,
  isPermissionEdit,
  index,
  onClickEdit,
  onClickDelete,
  onClickAuditLog,
}: ActionButtonProps) => {
  return (
    <div className="flex gap-2.5 text-xl">
      {isPermissionEdit && (
        <button
          disabled={isDisableEdit}
          data-tooltip-id="my-tooltip"
          data-tooltip-content="Edit"
          className="disabled:text-gray-bluish disabled:cursor-not-allowed"
          test-id={`reward-edit-${index}`}
          onClick={onClickEdit}
        >
          <FiEdit3 className="text-blue-pacific" />
        </button>
      )}
      {isPermissionDelete && (
        <button
          disabled={isDisableDelete}
          data-tooltip-id="my-tooltip"
          data-tooltip-content="Delete"
          className="disabled:text-gray-bluish disabled:cursor-not-allowed"
          test-id={`reward-delete-${index}`}
          onClick={onClickDelete}
        >
          <MdOutlineDeleteForever className="text-red" />
        </button>
      )}
      {isPermissionAuditLog && (
        <button
          data-tooltip-id="my-tooltip"
          data-tooltip-content="Audit Log"
          className="disabled:text-gray-bluish disabled:cursor-not-allowed"
          test-id={`reward-audit-log-${index}`}
          onClick={onClickAuditLog}
        >
          <MdEditNote className="text-yellow-funny" />
        </button>
      )}

      <Tooltip id="my-tooltip" />
    </div>
  );
};

export default ActionButton;
