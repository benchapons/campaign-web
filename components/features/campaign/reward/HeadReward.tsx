import Button from '@/components/common/Button';
import { MdAdd } from 'react-icons/md';
import { ButtonExpandAndDelete } from '../components';

interface HeadRewardProps {
  isExpand: boolean;
  isShowDelete: boolean;
  isShowButtonRewardMaster: boolean;
  isShowButtonAdjustmentReward: boolean;
  isShard: boolean;
  name: string;
  conditionId: string;
  tierId: string;
  rewardId: string;
  handleToggleExpand: (conditionId: string, tierId: string, rewardId: string) => void;
  handleDelete: (conditionId: string, tierId: string, rewardId: string) => void;
  handleAddReward: (conditionId: string, tierId: string, rewardId: string) => void;
  handleOpenModalAdjustmentReward: (conditionId: string, tierId: string, rewardId: string, isShard: boolean) => void;
}

const HeadReward = ({
  isExpand,
  isShowDelete,
  isShowButtonRewardMaster,
  isShowButtonAdjustmentReward,
  isShard,
  name,
  conditionId,
  tierId,
  rewardId,
  handleToggleExpand,
  handleDelete,
  handleAddReward,
  handleOpenModalAdjustmentReward,
}: HeadRewardProps) => {
  return (
    <div
      className={`px-3 py-5 flex justify-between  ${isExpand ? 'border-b border-gray-gainsboro bg-blue-light/10' : ''}`}
    >
      <h1 className="text-lg font-semibold">{name || 'Condition Group Name'}</h1>
      <div className="flex">
        {isShowButtonRewardMaster && isExpand ? (
          <Button
            name="reward-master"
            theme="outline-primary"
            onClick={() => handleAddReward(conditionId, tierId, rewardId)}
          >
            <MdAdd className="text-xl mr-1" /> Reward Master
          </Button>
        ) : null}
        {isShowButtonAdjustmentReward ? (
          <Button
            name="reward-adjustment"
            theme="outline-primary"
            onClick={() => handleOpenModalAdjustmentReward(conditionId, tierId, rewardId, isShard)}
          >
            Reward Adjustment
          </Button>
        ) : null}
        <ButtonExpandAndDelete
          isExpand={isExpand}
          isShowDelete={isShowDelete}
          testIdExpand="expand-reward"
          testIdDelete="delete-reward"
          handleToggleExpand={() => handleToggleExpand(conditionId, tierId, rewardId)}
          handleDelete={() => handleDelete(conditionId, tierId, rewardId)}
        />
      </div>
    </div>
  );
};

export default HeadReward;
