import { FormProvider } from 'react-hook-form';

import { Loader } from '@/components/Loader';
import { Dropdown, MultiDropdown } from '@/components/common/Dropdown';
import FormInput from '@/components/common/FormGroup/FormInput';

import { PagePermission, Permission } from '@/constants/auth';
import withSession from '@/hoc/withSession';
import useBankPromotion from '@/hooks/report/useBankPromotion';
import SwitchDate from '@/components/features/report/SwitchDate';
import AutoComplete from '@/components/common/AutoComplete';
import { AUDIT_LOG_PAGE, OWNER_ID_REPORT } from '@/constants/auditlog';
import HeaderReport from '@/components/features/report/HeaderReport';
import { isPagePermission } from '@/utilities/auth';
import Forbidden from '@/components/error/Forbidden';
import { AllBuildOption, AllOptionValue } from '@/constants/global';
import { CheckValueArrayInArrayOfObjects } from '@/utilities/global';
import { Fragment } from 'react';
import TableReport from '@/components/features/report/TableReport';
import { BankPromotionFormType } from '@/types/report.type';
import { PageSessionType } from '@/types/session.type';

const BankPromotionPage = ({ authorizedUser }: PageSessionType) => {
  const {
    isLoading,
    methodsForm,
    reportForm,
    buildingList,
    campaignNameList,
    campaignGroupNameList,
    onChangeInput,
    handleClickExport,
    handleClickAuditLog,

    deleteRequestReportId,
    page,
    sizePage,
    reportListPage,
    handlePerPage,
    handlePage,
    meta,
  } = useBankPromotion(authorizedUser);

  if (!isPagePermission(authorizedUser, [Permission.RPT_REDEMP_03])) return <Forbidden />;

  if (isLoading) return <Loader />;

  return (
    <Fragment>
      <HeaderReport
        title="Bank Promotion"
        handleClickAuditLog={() => handleClickAuditLog(OWNER_ID_REPORT.REPORT_03, AUDIT_LOG_PAGE.REPORT_03)}
        handleClickExport={handleClickExport}
      />
      <div className="overflow-auto h-[calc(100vh-61px)] px-5 pb-5">
        <FormProvider {...methodsForm}>
          <div className="grid grid-cols-2 gap-3 mt-5">
            <FormInput isRequired title="Campaign Building">
              <MultiDropdown
                name="building"
                options={
                  Array.isArray(reportForm?.building) && reportForm?.building?.includes(AllOptionValue)
                    ? [AllBuildOption]
                    : Array.isArray(reportForm?.building) &&
                      CheckValueArrayInArrayOfObjects(reportForm?.building, buildingList)
                      ? buildingList
                      : [AllBuildOption, ...buildingList]
                }
                value={reportForm?.building}
                onChange={(e) => onChangeInput({ name: e.name, value: e.value })}
              />
            </FormInput>
          </div>
          <SwitchDate reportForm={reportForm} onChangeInput={onChangeInput} />
          <section className="grid grid-cols-2 gap-3 mt-3">
            <FormInput title="Campaign Name">
              <AutoComplete
                name="campaignName"
                options={campaignNameList}
                value={reportForm?.campaignName}
                onChange={onChangeInput}
              />
            </FormInput>
            <FormInput title="Condition Group Name">
              <Dropdown
                name="conditionGroupName"
                options={campaignGroupNameList}
                value={reportForm?.conditionGroupName}
                onChange={onChangeInput}
              />
            </FormInput>
          </section>
        </FormProvider>
        <TableReport<BankPromotionFormType>
          reportListPage={reportListPage}
          page={page}
          meta={meta}
          sizePage={sizePage}
          handlePage={handlePage}
          handlePerPage={handlePerPage}
          deleteRequestReportId={deleteRequestReportId} />
      </div>
    </Fragment>
  );
};

export default withSession(BankPromotionPage, PagePermission.report_03);
