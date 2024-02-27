import { FormProvider } from 'react-hook-form';
import { Loader } from '@/components/Loader';
import { PagePermission, Permission } from '@/constants/auth';
import withSession from '@/hoc/withSession';
import FormInput from '@/components/common/FormGroup/FormInput';
import { Dropdown, MultiDropdown } from '@/components/common/Dropdown';
import { DatePicker } from '@/components/common/DatePicker';
import AutoComplete from '@/components/common/AutoComplete';

import useSummaryRedemptionReward from '@/hooks/report/useSummaryRedemptionReward';
import { AUDIT_LOG_PAGE, OWNER_ID_REPORT } from '@/constants/auditlog';
import HeaderReport from '@/components/features/report/HeaderReport';
import { isPagePermission } from '@/utilities/auth';
import Forbidden from '@/components/error/Forbidden';
import { AllBuildOption, AllOptionValue } from '@/constants/global';
import { Fragment, useMemo } from 'react';
import dayjs from 'dayjs';
import { DateObject } from 'react-multi-date-picker';
import { convertDateByFormat } from '@/utilities/format';
import { CheckValueArrayInArrayOfObjects } from '@/utilities/global';
import { PageSessionType } from '@/types/session.type';
import TableReport from '@/components/features/report/TableReport';
import { ReportTypeEnum, SummaryRedemptionRewardFormType } from '@/types/report.type';

const SummaryRedemptionRewardPage = ({ authorizedUser }: PageSessionType) => {
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
    reSentEmail,
    deleteRequestReportId,

    page,
    sizePage,
    reportListPage,
    handlePerPage,
    handlePage,

    meta,
  } = useSummaryRedemptionReward(authorizedUser);

  if (!isPagePermission(authorizedUser, [Permission.RPT_REDEMP_04])) return <Forbidden />;

  const maxDateFrom = useMemo(() => {
    if (reportForm?.campaignDateTo) return reportForm?.campaignDateTo;
    return new Date();
  }, [reportForm?.campaignDateFrom, reportForm?.campaignDateTo]);

  const minDateFrom = useMemo(() => {
    if (reportForm?.campaignDateTo) {
      const newDate = dayjs(reportForm?.campaignDateTo)
        .subtract(90, 'day')
        .format('YYYY-MM-DD');
      return new Date(newDate);
    }
    return undefined;
  }, [reportForm?.campaignDateFrom, reportForm?.campaignDateTo]);

  const maxDateTo = useMemo(() => {
    if (reportForm?.campaignDateFrom) {
      const newDate = dayjs(reportForm?.campaignDateFrom)
        .add(90, 'day')
        .format('YYYY-MM-DD');
      return new Date(newDate);
    }
    return undefined;
  }, [reportForm?.campaignDateFrom, reportForm?.campaignDateTo]);

  const minDateTo = useMemo(() => {
    if (!reportForm?.campaignDateFrom) return undefined;
    if (reportForm?.campaignDateFrom) return reportForm?.campaignDateFrom;
  }, [reportForm?.campaignDateFrom, reportForm?.campaignDateTo]);

  const getCurrentDate = (dateStringFrom: string): DateObject | undefined => {
    if (dateStringFrom) return new DateObject(dayjs(dateStringFrom).format('YYYY-MM-DD'));
    return undefined;
  };

  if (isLoading) return <Loader />;


  return (
    <Fragment>

      <HeaderReport
        title="Summary Redemption Reward"
        handleClickAuditLog={() => handleClickAuditLog(OWNER_ID_REPORT.REPORT_04, AUDIT_LOG_PAGE.REPORT_04)}
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
          <section className="grid grid-cols-2 gap-3 mt-3">
            <FormInput isRequired title="Campaign Start Date" supTitle={`(เลือก Date ได้สูงสุดไม่เกิน 3 เดือน)`}>
              <DatePicker
                name="campaignDateFrom"
                value={reportForm?.campaignDateFrom}
                maxDate={maxDateFrom}
                minDate={minDateFrom}
                onChange={onChangeInput}
              />
            </FormInput>
            <FormInput isRequired title="Campaign End Date">
              <DatePicker
                name="campaignDateTo"
                value={reportForm?.campaignDateTo}
                maxDate={maxDateTo}
                minDate={minDateTo}
                currentDate={getCurrentDate(
                  convertDateByFormat(reportForm?.campaignDateFrom || dayjs().format('YYYY-MM-DD'), 'YYYY-MM-DD')
                )}
                onChange={onChangeInput}
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
        <TableReport<SummaryRedemptionRewardFormType>
          reportListPage={reportListPage}
          page={page}
          meta={meta}
          sizePage={sizePage}
          handlePage={handlePage}
          handlePerPage={handlePerPage}
          reportType={ReportTypeEnum.SUMMARY_REDEMPTION_REWARD_REPORT}
          reSentEmail={reSentEmail}
          deleteRequestReportId={deleteRequestReportId} />
      </div>
    </Fragment>
  );
};

export default withSession(SummaryRedemptionRewardPage, PagePermission.report_04);
