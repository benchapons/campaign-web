import { FormProvider } from 'react-hook-form';

import { Loader } from '@/components/Loader';
import FormInput from '@/components/common/FormGroup/FormInput';
import { Dropdown, MultiDropdown } from '@/components/common/Dropdown';
import { TextInput } from '@/components/common/TextInput';

import { PagePermission, Permission } from '@/constants/auth';
import withSession from '@/hoc/withSession';
import useRedemptionTransactionReceipt from '@/hooks/report/useRedemptionTransactionReceipt';
import SwitchDate from '@/components/features/report/SwitchDate';
import AutoComplete from '@/components/common/AutoComplete';
import { AUDIT_LOG_PAGE, OWNER_ID_REPORT } from '@/constants/auditlog';
import HeaderReport from '@/components/features/report/HeaderReport';
import { isPagePermission } from '@/utilities/auth';
import Forbidden from '@/components/error/Forbidden';
import { AllBuildOption, AllOptionValue } from '@/constants/global';
import { CheckValueArrayInArrayOfObjects } from '@/utilities/global';
import { PageSessionType } from '@/types/session.type';
import { Fragment } from 'react';
import { RedemptionTransactionReceiptFormType, ReportTypeEnum } from '@/types/report.type';
import TableReport from '@/components/features/report/TableReport';

const RedemptionTransactionReceiptPage = ({ authorizedUser }: PageSessionType) => {
  const {
    isLoading,
    methodsForm,
    reportForm,
    buildingList,
    campaignTypeList,
    statusList,
    campaignNameList,
    onChangeInput,
    handleClickExport,
    handleClickAuditLog,
    reSentEmail,
    deleteRequestReportId,
    page,
    sizePage,
    reportListPage,
    handlePerPage,
    handlePage,

    meta,
  } = useRedemptionTransactionReceipt(authorizedUser);

  if (!isPagePermission(authorizedUser, [Permission.RPT_REDEMP_02])) return <Forbidden />;

  if (isLoading) return <Loader />;


  return (
    <Fragment>
      <HeaderReport
        title="Redemption Transaction by Receipt"
        handleClickAuditLog={() => handleClickAuditLog(OWNER_ID_REPORT.REPORT_02, AUDIT_LOG_PAGE.REPORT_02)}
        handleClickExport={handleClickExport}
      />
      <div className="overflow-auto h-[calc(100vh-61px)] px-5 pb-5">
        <FormProvider {...methodsForm}>
          <section className="mt-5">
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
              <FormInput title="Campaign Type">
                <Dropdown
                  name="campaignType"
                  options={campaignTypeList}
                  value={reportForm?.campaignType}
                  onChange={onChangeInput}
                />
              </FormInput>
            </div>
            <SwitchDate reportForm={reportForm} onChangeInput={onChangeInput} />
            <div className="grid grid-cols-2 gap-3 mt-5">
              <FormInput title="Campaign Name">
                <AutoComplete
                  name="campaignName"
                  options={campaignNameList}
                  value={reportForm?.campaignName}
                  onChange={onChangeInput}
                />
              </FormInput>
              <FormInput title="Redemption Status">
                <Dropdown
                  name="redemptionStatus"
                  options={statusList}
                  value={reportForm?.redemptionStatus}
                  onChange={onChangeInput}
                />
              </FormInput>
              <FormInput title="Rule Id">
                <TextInput name="ruleId" value={reportForm?.ruleId} onChange={onChangeInput} />
              </FormInput>
            </div>
          </section>
        </FormProvider>
        <TableReport<RedemptionTransactionReceiptFormType>
          reportListPage={reportListPage}
          page={page}
          meta={meta}
          sizePage={sizePage}
          handlePage={handlePage}
          handlePerPage={handlePerPage}
          reportType={ReportTypeEnum.REDEMPTION_TRANSACTION_RECEIPT_REPORT}
          reSentEmail={reSentEmail}
          deleteRequestReportId={deleteRequestReportId} />
      </div>
    </Fragment>
  );
};

export default withSession(RedemptionTransactionReceiptPage, PagePermission.report_02);
