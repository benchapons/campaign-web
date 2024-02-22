import { Tooltip } from 'react-tooltip';
import { MdOutlineDeleteForever, MdOutlineDatasetLinked, MdEditNote } from 'react-icons/md';
import { FiEdit3 } from 'react-icons/fi';
import { IoDuplicateOutline } from 'react-icons/io5';

interface ActionButtonProps {
  isPermissionDelete: boolean;
  isPermissionEdit: boolean;
  isPermissionAuditLog: boolean;
  isDisableEdit?: boolean;
  isDisableDelete?: boolean;
  isDisableDuplicate?: boolean;
  isDisableReward?: boolean;
  index: number;
  onClickEdit: () => void;
  onClickDelete: () => void;
  onClickDuplicate: () => void;
  onClickReward: () => void;
  onClickAuditLog: () => void;
}

const ActionButton = ({
  isPermissionDelete,
  isPermissionEdit,
  isDisableEdit,
  isDisableDelete,
  isDisableDuplicate,
  isDisableReward,
  isPermissionAuditLog,
  index,
  onClickEdit,
  onClickDelete,
  onClickDuplicate,
  onClickReward,
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
          test-id={`campaign-edit-${index}`}
          onClick={onClickEdit}
        >
          <FiEdit3 className="text-blue-pacific" />
        </button>
      )}
      <button
        disabled={isDisableDuplicate}
        data-tooltip-id="my-tooltip"
        data-tooltip-content="Duplicate"
        className="disabled:text-gray-bluish disabled:cursor-not-allowed"
        test-id={`campaign-duplicate-${index}`}
        onClick={onClickDuplicate}
      >
        <IoDuplicateOutline className="text-blue-steel" />
      </button>
      <button
        disabled={isDisableReward}
        data-tooltip-id="my-tooltip"
        data-tooltip-content="Reward Tracking"
        className="disabled:text-gray-bluish disabled:cursor-not-allowed"
        test-id={`campaign-reward-tracking-${index}`}
        onClick={onClickReward}
      >
        <MdOutlineDatasetLinked className="text-blue-sea" />
      </button>
      {isPermissionDelete && (
        <button
          disabled={isDisableDelete}
          data-tooltip-id="my-tooltip"
          data-tooltip-content="Delete"
          className="disabled:text-gray-bluish disabled:cursor-not-allowed"
          test-id={`campaign-delete-${index}`}
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
          test-id={`campaign-audit-log-${index}`}
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
