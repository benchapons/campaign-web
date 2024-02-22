import { FormProvider } from 'react-hook-form';

import { ModalWithButton } from '@/components/common/Modal';
import useRewardForm from '@/hooks/reward/useRewardForm';
import { AuthorizedUserType } from '@/types/auth.type';
import RewardForm from '../reward/RewardForm';

interface ModalCreateRewardProps {
  isShowModalReward: boolean;
  authorizedUser: AuthorizedUserType;
  handleCloseModalReward: () => void;
  handleSubmitModalReward: (payload: any) => void;
}

const ModalCreateReward = ({
  isShowModalReward,
  authorizedUser,
  handleCloseModalReward,
  handleSubmitModalReward,
}: ModalCreateRewardProps) => {
  const {
    isLoading,
    rewardForm,
    masterData,
    methodsForm,
    onChangeInput,
    onChangeCommaInput,
    onChangeQuotaInput,
    payloadReward,
    onChangeQuotaWeeklyInput,
    handleAddPlanQuotaWeekly,
    handleDeletePlanQuotaWeekly,
  } = useRewardForm(authorizedUser);

  const handleSubmit = async () => {
    methodsForm?.reset();
    const payload = payloadReward();
    await handleSubmitModalReward(payload);
  };

  const handleClose = () => {
    methodsForm?.clearErrors();
    methodsForm?.reset();
    handleCloseModalReward();
  };

  return (
    <ModalWithButton
      isOpen={isShowModalReward}
      title="Create Reward"
      onClose={handleClose}
      onSubmit={methodsForm?.handleSubmit(handleSubmit)}
    >
      <FormProvider {...methodsForm}>
        <RewardForm
          rewardForm={rewardForm}
          masterData={masterData}
          onChangeInput={onChangeInput}
          onChangeCommaInput={onChangeCommaInput}
          onChangeQuotaInput={onChangeQuotaInput}
          onChangeQuotaWeeklyInput={onChangeQuotaWeeklyInput}
          handleAddPlanQuotaWeekly={handleAddPlanQuotaWeekly}
          handleDeletePlanQuotaWeekly={handleDeletePlanQuotaWeekly}
        />
      </FormProvider>
    </ModalWithButton>
  );
};

export default ModalCreateReward;
