import { StatusCampaignForm } from '@/types/campaign.type';
import { ButtonExpandAndDelete } from '../../../components';
import TextCommaInputSpending from './TextCommaInputSpending';
import TextInputSpending from './TextInputSpending';
import { ChangeEventBaseNumberType, ChangeEventBaseType, OptionsDropdown } from '@/types/event.interface';
import DropdownSpending from './DropdownSpending';

interface HeadSpendingTierProps {
  name: string;
  conditionId: string;
  tier: any;
  index: number;
  status: StatusCampaignForm;
  onChangeInputSpending: (
    data: ChangeEventBaseType | ChangeEventBaseNumberType,
    conditionId: string,
    tierId: string
  ) => void;
  handleToggleExpand: (conditionId: string, tierId: string) => void;
  handleDelete: (conditionId: string, tierId: string) => void;
  conditionJoinerList: OptionsDropdown[];
}

const HeadSpendingTier = ({
  status,
  name,
  conditionId,
  tier,
  index,
  conditionJoinerList,
  handleToggleExpand,
  handleDelete,
  onChangeInputSpending,
}: HeadSpendingTierProps) => {
  return (
    <div
      className={`flex justify-between items-start px-3 py-5   ${
        tier?.isExpand ? 'border-b border-gray-gainsboro' : ''
      }`}
    >
      <div className="grid grid-cols-3 gap-4 w-full ">
        <TextCommaInputSpending
          isRequired
          disabled={status?.campaignStarting || status?.campaignEnded}
          name={`${name}minSpendingAmount`}
          label="Tier Criteria Spending Amount Form"
          desc="(ยอดใช้จ่ายเริ่มต้น)"
          conditionId={conditionId}
          tierId={tier?._id}
          value={tier?.minSpendingAmount}
          onChangeInputSpending={onChangeInputSpending}
        />
        <TextCommaInputSpending
          isRequired
          disabled={status?.campaignStarting || status?.campaignEnded}
          name={`${name}maxSpendingAmount`}
          label="Tier Criteria Spending Amount To"
          desc="(ยอดใช้จ่ายสูงสุด)"
          conditionId={conditionId}
          tierId={tier?._id}
          value={tier?.maxSpendingAmount}
          onChangeInputSpending={onChangeInputSpending}
        />
        {Array.isArray(tier?.conditionDesc) ? (
          <DropdownSpending
            isRequired
            disabled={status?.campaignStarting || status?.campaignEnded}
            name={`${name}conditionDesc`}
            desc="(ONESIAM,AIS,MCard)"
            label="Condition Joiner"
            value={tier?.conditionDesc}
            conditionId={conditionId}
            tierId={tier?._id}
            options={conditionJoinerList}
            onChangeInputSpending={onChangeInputSpending}
          />
        ) : (
          <TextInputSpending
            isRequired
            disabled={status?.campaignStarting || status?.campaignEnded}
            name={`${name}conditionDesc`}
            desc="(ONESIAM,AIS,MCard)"
            label="Condition Joiner"
            value={tier?.conditionDesc}
            conditionId={conditionId}
            tierId={tier?._id}
            onChangeInputSpending={onChangeInputSpending}
          />
        )}
      </div>
      <ButtonExpandAndDelete
        isExpand={tier?.isExpand}
        isShowDelete={index > 0 && !(status?.campaignStarting || status?.campaignEnded)}
        testIdExpand="expand-tier"
        testIdDelete="delete-tier"
        handleToggleExpand={() => handleToggleExpand(conditionId, tier?._id)}
        handleDelete={() => handleDelete(conditionId, tier?._id)}
      />
    </div>
  );
};

export default HeadSpendingTier;
