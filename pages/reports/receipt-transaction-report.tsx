import { FormProvider } from 'react-hook-form';

import { Dropdown, MultiDropdown } from '@/components/common/Dropdown';
import FormInput from '@/components/common/FormGroup/FormInput';
import { Loader } from '@/components/Loader';

import { Checkbox } from '@/components/common/Checkbox';
import Forbidden from '@/components/error/Forbidden';
import HeaderReport from '@/components/features/report/HeaderReport';
import ReceiptDateSelect from '@/components/features/report/ReceiptDateSelect';
import TableReport from '@/components/features/report/TableReport';
import { AUDIT_LOG_PAGE, OWNER_ID_REPORT } from '@/constants/auditlog';
import { PagePermission, Permission } from '@/constants/auth';
import { AllBuildOption, AllOptionValue } from '@/constants/global';
import withSession from '@/hoc/withSession';
import useReceiptTransactionReport from '@/hooks/report/useReceiptTransactionReport';
import { ReceiptTransactionReportFormType } from '@/types/report.type';
import { PageSessionType } from '@/types/session.type';
import { isPagePermission } from '@/utilities/auth';
import { CheckValueArrayInArrayOfObjects } from '@/utilities/global';
import { Fragment } from 'react';



const RedemptionTransactionReceiptPage = ({ authorizedUser }: PageSessionType) => {
  const {
    isLoading,
    methodsForm,
    filterReportForm,
    buildingList,
    receiptStatusOptionsLists,
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
  } = useReceiptTransactionReport(authorizedUser);

  if (!isPagePermission(authorizedUser, [Permission.RPT_REDEMP_05])) return <Forbidden />;

  if (isLoading) return <Loader />;

  return (
    <Fragment>
      <HeaderReport
        title="Receipt Transaction Report"
        handleClickAuditLog={() => handleClickAuditLog(OWNER_ID_REPORT.REPORT_05, AUDIT_LOG_PAGE.REPORT_05)}
        handleClickExport={handleClickExport}
      />
      <div className="overflow-auto h-[calc(100vh-61px)] px-5 pb-5">
        <FormProvider {...methodsForm}>
          <section className="mt-5">
            <div className="grid grid-cols-2 gap-3 mt-5">
              <FormInput isRequired title="Receipt Building">
                <MultiDropdown
                  name="buildingCode"
                  options={
                    Array.isArray(filterReportForm?.buildingCode) &&
                      filterReportForm?.buildingCode?.includes(AllOptionValue)
                      ? [AllBuildOption]
                      : Array.isArray(filterReportForm?.buildingCode) &&
                        CheckValueArrayInArrayOfObjects(filterReportForm?.buildingCode, buildingList)
                        ? buildingList
                        : [AllBuildOption, ...buildingList]
                  }
                  value={filterReportForm?.buildingCode}
                  onChange={(e) => onChangeInput({ name: e.name, value: e.value })}
                />
              </FormInput>
            </div>
            <ReceiptDateSelect
              receiptDateStringFrom={filterReportForm?.receiptDateStringFrom}
              receiptDateStringTo={filterReportForm?.receiptDateStringTo}
              isRequireStartAt={true}
              isRequireEndAt={true}
              onChangeInput={onChangeInput}
            />
            <div className="grid grid-cols-2 gap-3 mt-5">
              <FormInput title="Receipt Status">
                <Dropdown
                  name="receiptStatus"
                  options={receiptStatusOptionsLists}
                  value={filterReportForm?.receiptStatus}
                  onChange={onChangeInput}
                />
              </FormInput>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-5">
              <FormInput title="Receipt Collects">
                <Checkbox
                  checked={filterReportForm?.isVizCollect}
                  label="ONESIAM Spending"
                  name="vlcIsCollectVizSpending"
                  onChange={onChangeInput}
                />
                <Checkbox
                  checked={filterReportForm?.isPlatinumCollect}
                  label="Platinum Spending"
                  name="isPlatinum"
                  onChange={onChangeInput}
                />
                <Checkbox
                  checked={filterReportForm?.isRedemption}
                  label="Redemption"
                  name="isRedemption"
                  onChange={onChangeInput}
                />
              </FormInput>
            </div>
          </section>
        </FormProvider>
        <TableReport<ReceiptTransactionReportFormType>
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

export default withSession(RedemptionTransactionReceiptPage, PagePermission.report_05);
