import { ButtonExpandAndDelete } from '../../components';

interface HeadConditionCriteriaProps {
  isExpand: boolean;
  name: string;
  conditionId: string;
  isShowDelete: boolean;
  handleToggleExpand: (id: string) => void;
  handleDelete: (id: string) => void;
}

const HeadConditionCriteria = ({
  isExpand,
  name,
  conditionId,
  isShowDelete,
  handleToggleExpand,
  handleDelete,
}: HeadConditionCriteriaProps) => {
  return (
    <div
      className={`px-3 py-5 flex justify-between  ${isExpand ? 'border-b border-gray-gainsboro bg-blue-light/10' : ''}`}
    >
      <h1 className="text-lg font-semibold">{name || 'Condition Group Name'}</h1>
      <ButtonExpandAndDelete
        isExpand={isExpand}
        isShowDelete={isShowDelete}
        testIdExpand="expand-condition"
        testIdDelete="delete-condition"
        handleToggleExpand={() => handleToggleExpand(conditionId)}
        handleDelete={() => handleDelete(conditionId)}
      />
    </div>
  );
};

export default HeadConditionCriteria;
