import Button from '@/components/common/Button';
import HeaderMasterCreate from '@/components/features/master/header/HeaderMasterCreate';
import MasterForm from '@/components/features/master/MasterForm';
import { HeaderRewardCreate } from '@/components/features/reward/header';
import RewardForm from '@/components/features/reward/RewardForm';
import { Loader } from '@/components/Loader';
import { PagePermission } from '@/constants/auth';

import withSession from '@/hoc/withSession';
import useMasterForm from '@/hooks/master/useMasterForm';
import useRewardForm from '@/hooks/reward/useRewardForm';
import { FormProvider } from 'react-hook-form';

const CreateMasterPage = ({ authorizedUser }: any) => {
  const {
    isLoading,
    methodsForm,
    masterForm,
    masterData,
    onChangeInput,
    onChangeFile,
    onDeleteFile,
    handleClickCancelMaster,
    handleClickSubmitMaster,
    onDeleteExistedFile,
  } = useMasterForm(authorizedUser);
  return (
    <div>
      {isLoading && <Loader />}
      <HeaderMasterCreate handleClickCancel={handleClickCancelMaster} handleClickSubmit={handleClickSubmitMaster} />
      <div className="overflow-auto h-[calc(100vh-61px)] mx-5 pt-5">
        <FormProvider {...methodsForm}>
          <MasterForm
            onDeleteExistedFile={onDeleteExistedFile}
            masterForm={masterForm}
            masterData={masterData}
            onChangeInput={onChangeInput}
            onChangeFile={onChangeFile}
            onDeleteFile={onDeleteFile}
          />
        </FormProvider>
      </div>
    </div>
  );
};
export default withSession(CreateMasterPage, PagePermission.masterCreate);
