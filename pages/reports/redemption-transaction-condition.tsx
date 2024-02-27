import { FormProvider } from 'react-hook-form';
import dayjs from 'dayjs';

import { Loader } from '@/components/Loader';
import { DatePicker } from '@/components/common/DatePicker';
import { Dropdown, MultiDropdown } from '@/components/common/Dropdown';
import FormInput from '@/components/common/FormGroup/FormInput';

import { PagePermission, Permission } from '@/constants/auth';
import withSession from '@/hoc/withSession';
import useRedemptionTransactionCondition from '@/hooks/report/useRedemptionTransactionCondition';
import AutoComplete from '@/components/common/AutoComplete';
import { AUDIT_LOG_PAGE, OWNER_ID_REPORT } from '@/constants/auditlog';
import HeaderReport from '@/components/features/report/HeaderReport';
import { isPagePermission } from '@/utilities/auth';
import Forbidden from '@/components/error/Forbidden';
import { AllBuildOption, AllOptionValue } from '@/constants/global';
import { Fragment, useMemo } from 'react';
import { DateObject } from 'react-multi-date-picker';
import { convertDateByFormat } from '@/utilities/format';
import { CheckValueArrayInArrayOfObjects } from '@/utilities/global';
import TableReport from '@/components/features/report/TableReport';
import { RedemptionTransactionConditionFormType, ReportTypeEnum } from '@/types/report.type';
import { PageSessionType } from '@/types/session.type';

const RedemptionTransactionConditionPage = ({ authorizedUser }: PageSessionType) => {
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
  } = useRedemptionTransactionCondition(authorizedUser);

  if (!isPagePermission(authorizedUser, [Permission.RPT_REDEMP_01])) return <Forbidden />;

  const maxDateFrom = useMemo(() => {
    if (reportForm?.redemptionDateTo) return reportForm?.redemptionDateTo;
    return new Date();
  }, [reportForm?.redemptionDateFrom, reportForm?.redemptionDateTo]);

  const minDateFrom = useMemo(() => {
    if (reportForm?.redemptionDateTo) {
      const newDate = dayjs(reportForm?.redemptionDateTo)
        .subtract(90, 'day')
        .format('YYYY-MM-DD');
      return new Date(newDate);
    }
    return undefined;
  }, [reportForm?.redemptionDateFrom, reportForm?.redemptionDateTo]);

  const maxDateTo = useMemo(() => {
    if (reportForm?.redemptionDateFrom) {
      const newDate = dayjs(reportForm?.redemptionDateFrom)
        .add(90, 'day')
        .format('YYYY-MM-DD');
      return new Date().setHours(0, 0, 0, 0) < new Date(newDate).setHours(0, 0, 0, 0) ? new Date() : new Date(newDate);
    }
    return new Date();
  }, [reportForm?.redemptionDateFrom, reportForm?.redemptionDateTo]);

  const minDateTo = useMemo(() => {
    if (!reportForm?.redemptionDateFrom) return undefined;
    if (reportForm?.redemptionDateFrom) return reportForm?.redemptionDateFrom;
  }, [reportForm?.redemptionDateFrom, reportForm?.redemptionDateTo]);

  const getCurrentDate = (dateStringFrom: string): DateObject | undefined => {
    if (dateStringFrom) return new DateObject(dayjs(dateStringFrom).format('YYYY-MM-DD'));
    return undefined;
  };

  if (isLoading) return <Loader />;

  return (
    <Fragment>
      <HeaderReport
        title="Redemption Transaction by Condition"
        handleClickAuditLog={() => handleClickAuditLog(OWNER_ID_REPORT.REPORT_01, AUDIT_LOG_PAGE.REPORT_01)}
        handleClickExport={handleClickExport}
      />
      <div className="overflow-auto h-[calc(100vh-61px)] px-5 pb-5">
        <FormProvider {...methodsForm}>
          <section className="grid grid-cols-2 gap-3 mt-5">
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
            <FormInput isRequired title="Redemption Date From" supTitle={`(เลือก Date ได้สูงสุดไม่เกิน 3 เดือน)`}>
              <DatePicker
                name="redemptionDateFrom"
                value={reportForm?.redemptionDateFrom}
                maxDate={maxDateFrom}
                minDate={minDateFrom}
                onChange={onChangeInput}
              />
            </FormInput>
            <FormInput isRequired title="To">
              <DatePicker
                name="redemptionDateTo"
                value={reportForm?.redemptionDateTo}
                maxDate={maxDateTo}
                minDate={minDateTo}
                onChange={onChangeInput}
                currentDate={getCurrentDate(
                  convertDateByFormat(reportForm?.redemptionDateFrom || dayjs().format('YYYY-MM-DD'), 'YYYY-MM-DD')
                )}
              />
            </FormInput>
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
          </section>
        </FormProvider>
        <TableReport<RedemptionTransactionConditionFormType>
          reportListPage={reportListPage}
          page={page}
          meta={meta}
          sizePage={sizePage}
          handlePage={handlePage}
          handlePerPage={handlePerPage}
          reportType={ReportTypeEnum.REDEMPTION_TRANSACTION_CONDITION_REPORT}
          reSentEmail={reSentEmail}
          deleteRequestReportId={deleteRequestReportId} />
      </div>
    </Fragment>
  );
};

export default withSession(RedemptionTransactionConditionPage, PagePermission.report_01);
