import { useEffect, useMemo } from 'react';
import { FormProvider } from 'react-hook-form';

import { ModalWithButton } from '@/components/common/Modal';
import { Checkbox } from '@/components/common/Checkbox';
import { Dropdown } from '@/components/common/Dropdown';
import { CommaInput } from '@/components/common/TextInput';
import TextArea from '@/components/common/TextArea';

import { AdjustmentRewardFormType, RewardAdjustForm } from '@/types/reward.type';
import { numberWithCommas } from '@/utilities/format';
import useAdjustmentReward from '@/hooks/useAdjustmentReward';
import { AdjustmentTypeEnum } from '@/constants/enum';

interface ModalAdjustmentRewardProps {
  isShow: boolean;
  rewardForm: RewardAdjustForm;
  onClose: () => void;
  onSubmit: (data: AdjustmentRewardFormType) => Promise<boolean>;
}

const ModalAdjustmentReward = ({ isShow, rewardForm, onClose, onSubmit }: ModalAdjustmentRewardProps) => {
  const {
    methodsForm,
    isMasterLoading,
    adjustmentRewardForm,
    masterDataStore,
    onChangeInput,
    onChangeCommaInput,
    handleSubmitAdjustReward,
    onClearAdjustForm,
  } = useAdjustmentReward({ onSubmitAdjust: onSubmit });

  const totalRedeemed = useMemo(() => {
    if (rewardForm?.totalRedeemed && rewardForm?.totalRewardQty) {
      return rewardForm?.totalRewardQty - rewardForm?.totalRedeemed;
    }
    return rewardForm?.totalRewardQty;
  }, [rewardForm?.totalRewardQty, rewardForm?.totalRedeemed]);

  const newTotalRewardQty = useMemo(() => {
    if (adjustmentRewardForm?.rewardAdjustmentType === AdjustmentTypeEnum?.INCREASE && rewardForm?.totalRewardQty) {
      return rewardForm?.totalRewardQty + (adjustmentRewardForm?.quantity || 0);
    }
    if (adjustmentRewardForm?.rewardAdjustmentType === AdjustmentTypeEnum?.DECREASE && rewardForm?.totalRewardQty) {
      return rewardForm?.totalRewardQty - (adjustmentRewardForm?.quantity || 0);
    }
    return rewardForm?.totalRewardQty;
  }, [rewardForm?.totalRewardQty, adjustmentRewardForm]);

  const newTotalRedeemed = useMemo(() => {
    if (adjustmentRewardForm?.rewardAdjustmentType === AdjustmentTypeEnum?.INCREASE && totalRedeemed) {
      return totalRedeemed + (adjustmentRewardForm?.quantity || 0);
    }
    if (adjustmentRewardForm?.rewardAdjustmentType === AdjustmentTypeEnum?.DECREASE && totalRedeemed) {
      return totalRedeemed - (adjustmentRewardForm?.quantity || 0);
    }
    return totalRedeemed;
  }, [totalRedeemed, adjustmentRewardForm]);

  const handleCloseModal = () => {
    onClose();
    onClearAdjustForm();
  };

  return (
    <ModalWithButton
      isOpen={isShow}
      title="Reward Adjustment"
      onClose={handleCloseModal}
      onSubmit={handleSubmitAdjustReward}
    >
      <div className="flex flex-col gap-4">
        <div className="border border-blue-fresh rounded-md bg-blue-light/10 p-5">
          <div className="grid grid-cols-4 gap-4">
            <p>Reward Sharing </p>
            <div className="mx-auto">
              <Checkbox disabled name="sharing" label="Share" checked={rewardForm?.isRewardSharing} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid grid-cols-2 gap-4">
              <p>Reward Type</p>
              <p className="text-center">{rewardForm?.rewardType}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <p>Reward Name</p>
              <p className="text-center">{rewardForm?.rewardName}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <p className="flex flex-col">
                Reward Value
                <span className="text-sm text-gray-dark">(มูลค่าของรางวัลต่อหน่วย)</span>
              </p>
              <p className="text-center">{numberWithCommas(rewardForm?.rewardValue || 0)}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <p className="flex flex-col">
                Total Reward Value
                <span className="text-sm text-gray-dark">(มูลค่าของรางวัลทั้งหมด)</span>
              </p>
              <p className="text-center">{numberWithCommas(rewardForm?.totalRewardValue || 0)}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <p className="flex flex-col">
                Total Reward Quantity
                <span className="text-sm text-gray-dark">(จำนวนของรางวัลทั้งหมด)</span>
              </p>
              <p className="text-center">{numberWithCommas(rewardForm?.totalRewardQty || 0)}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <p className="flex flex-col">
                Total Redeemed
                <span className="text-sm text-gray-dark">(จำนวนของรางวัลที่ถูกใช้ไปแล้ว)</span>
              </p>
              <p className="text-center">{`${numberWithCommas(rewardForm?.totalRedeemed || 0)}/${numberWithCommas(
                totalRedeemed || 0
              )}`}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <FormProvider {...methodsForm}>
            <div className="w-3/5 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <p>
                  Reward Adjustment<b className="text-red ml-0.5"> * </b>
                </p>
                <Dropdown
                  name="rewardAdjustmentType"
                  options={masterDataStore?.rewardAdjustmentTypeList}
                  value={adjustmentRewardForm?.rewardAdjustmentType}
                  onChange={onChangeInput}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <p>
                    Quantity<b className="text-red ml-0.5"> * </b>
                  </p>
                  <span className="text-sm text-gray-dark">(จำนวนของรางวัลที่เพิ่ม/ลด)</span>
                </div>
                <CommaInput
                  name="quantity"
                  decimal={0}
                  value={adjustmentRewardForm?.quantity}
                  onChange={onChangeCommaInput}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">Remark</div>
                <TextArea name="remark" value={adjustmentRewardForm?.remark} onChange={onChangeInput} />
              </div>
            </div>
          </FormProvider>
          <div className="w-2/5 flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-4">
              <p className="flex flex-col">
                New Total Quantity
                <span className="text-sm text-gray-dark">(จำนวนของรางวัลทั้งหมด)</span>
              </p>
              <p className="text-end">{numberWithCommas(newTotalRewardQty || 0)}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <p className="flex flex-col">
                New Total Redeemed
                <span className="text-sm text-gray-dark whitespace-nowrap">(จำนวนของรางวัลที่ถูกใช้ไปแล้ว)</span>
              </p>
              <p className="text-end">{`${numberWithCommas(rewardForm?.totalRedeemed || 0)}/${numberWithCommas(
                newTotalRedeemed || 0
              )}`}</p>
            </div>
          </div>
        </div>
      </div>
    </ModalWithButton>
  );
};

export default ModalAdjustmentReward;
