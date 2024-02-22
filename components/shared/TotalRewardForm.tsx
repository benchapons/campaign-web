import { ChangeEventBaseNumberType } from '@/types/event.interface';
import FormGroup from '../common/FormGroup';
import { CommaInput } from '../common/TextInput';
import { RewardTypeEnum } from '@/constants/enum';

interface TotalRewardFormProps {
  name?: string;
  disabled?: boolean;
  rewardForm: any;
  onChangeCommaInput: (data: ChangeEventBaseNumberType<string | number>) => void;
}

const TotalRewardForm = ({ disabled = false, rewardForm, name, onChangeCommaInput }: TotalRewardFormProps) => {
  return (
    <FormGroup isRequired title="Quantity and Value Reward">
      <div className="grid grid-cols-2 gap-4">
        <CommaInput
          isRequired={!disabled}
          disabled={
            disabled ||
            (rewardForm?.rewardType &&
              rewardForm?.rewardType !== RewardTypeEnum?.VOUCHER_CODE &&
              rewardForm?.rewardType !== RewardTypeEnum?.PHYSICAL_GIFT &&
              rewardForm?.rewardType !== RewardTypeEnum?.LUCKY_DRAW)
          }
          decimal={0}
          name={name ? `${name}qtyPerRedemption` : 'qtyPerRedemption'}
          label="Quantity Per redemption"
          desc="(จำนวนของรางวัลต่อการแลกของรางวัล 1 ครั้ง)"
          value={rewardForm?.qtyPerRedemption}
          onChange={onChangeCommaInput}
        />
        <CommaInput
          isRequired={!disabled}
          disabled={disabled}
          decimal={0}
          name={name ? `${name}totalRewardQty` : 'totalRewardQty'}
          label="Total Reward Quantity"
          desc="(จำนวนของรางวัลทั้งหมด)"
          value={rewardForm?.totalRewardQty}
          onChange={onChangeCommaInput}
        />
        <CommaInput
          isRequired={!disabled}
          disabled={disabled}
          decimal={0}
          name={name ? `${name}rewardValue` : 'rewardValue'}
          label="Reward Value"
          desc="(มูลค่าของรางวัลต่อหน่วย)"
          value={rewardForm?.rewardValue}
          onChange={onChangeCommaInput}
        />
        <CommaInput
          disabled
          decimal={0}
          name={name ? `${name}totalRewardValue` : 'totalRewardValue'}
          label="Total Reward Value"
          desc="(มูลค่าของรางวัลทั้งหมด)"
          value={rewardForm?.totalRewardValue}
        />
      </div>
    </FormGroup>
  );
};

export default TotalRewardForm;
