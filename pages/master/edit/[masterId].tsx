import { FormProvider } from 'react-hook-form';

import HeaderMasterEdit from '@/components/features/master/header/HeaderMasterEdit';
import MasterForm from '@/components/features/master/MasterForm';
import { Loader } from '@/components/Loader';
import { PagePermission } from '@/constants/auth';

import withSession from '@/hoc/withSession';
import useMasterForm from '@/hooks/master/useMasterForm';

const EditMasterPage = ({ authorizedUser }: any) => {
  const {
    isLoading,
    methodsForm,
    masterForm,
    masterData,
    onChangeInput,
    onChangeFile,
    onDeleteFile,
    handleClickCancelMaster,
    handleClickUpdateMaster,
    onDeleteExistedFile,
  } = useMasterForm(authorizedUser);
  return (
    <div>
      {isLoading && <Loader />}
      <HeaderMasterEdit
        masterName={masterForm?.masterId}
        handleClickCancel={handleClickCancelMaster}
        handleClickUpdate={handleClickUpdateMaster}
      />
      <div className="overflow-auto h-[calc(100vh-61px)] mx-5 pt-5">
        <FormProvider {...methodsForm}>
          <MasterForm
            isEdit
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
export default withSession(EditMasterPage, PagePermission.masterUpdate);
