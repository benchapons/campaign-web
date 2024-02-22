import Button from '@/components/common/Button';
import { HeaderRewardCreate } from '@/components/features/reward/header';
import RewardForm from '@/components/features/reward/RewardForm';
import { Loader } from '@/components/Loader';
import { PagePermission } from '@/constants/auth';

import withSession from '@/hoc/withSession';
import useRewardForm from '@/hooks/reward/useRewardForm';
import { FormProvider } from 'react-hook-form';

const CreateRewardPage = ({ authorizedUser }: any) => {
  const {
    isLoading,
    methodsForm,
    rewardForm,
    masterData,
    onChangeInput,
    onChangeCommaInput,
    onChangeQuotaInput,
    onChangeQuotaWeeklyInput,
    handleAddPlanQuotaWeekly,
    handleDeletePlanQuotaWeekly,
    handleClickCancel,
    handleClickSubmit,
  } = useRewardForm(authorizedUser);
  return (
    <div>
      {isLoading && <Loader />}
      <HeaderRewardCreate handleClickCancel={handleClickCancel} handleClickSubmit={handleClickSubmit} />
      <div className="overflow-auto h-[calc(100vh-61px)] mx-5 pt-5">
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
      </div>
    </div>
  );
};
export default withSession(CreateRewardPage, PagePermission.rewardCreate);
