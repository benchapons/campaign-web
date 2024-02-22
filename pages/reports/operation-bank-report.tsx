import { FormProvider } from 'react-hook-form';
import { SearchInput } from '@/components/common/TextInput';
import { Loader } from '@/components/Loader';
import { PagePermission, Permission } from '@/constants/auth';
import withSession from '@/hoc/withSession';
import FormInput from '@/components/common/FormGroup/FormInput';
import { DatePicker } from '@/components/common/DatePicker';

import { AUDIT_LOG_PAGE, OWNER_ID_REPORT } from '@/constants/auditlog';
import HeaderReport from '@/components/features/report/HeaderReport';
import { isPagePermission } from '@/utilities/auth';
import Forbidden from '@/components/error/Forbidden';
import useOperationReport from '@/hooks/report/useOperationReport';
import ReloadButton from '@/components/shared/ReloadButton';
import CampaignTableForSelect from '@/components/common/Table/CampaignTableForSelect';
import { formatDate } from '@/utilities/format';
import { Fragment } from 'react';

const OperationBankReportPage = ({ authorizedUser }: any) => {
  const {
    isLoading,
    methodsForm,
    handleClickAuditLog,
    campaignTargetList, // for render table
    reportBankProDetail,
    getReportDetailByDateAndSpecialCondition,
    getPaymentMethodTotalByCondition,
    getAmountByCondition,
    getPaymentMethodTotal,
    getAmount,
    keyword,
    campaignListForSelect,
    handleClearSearchCampaign,
    handleChangeSearch,
    handleClickReload,
    fetchCampaignData,
    onChangeInput,
    reportForm,
    handleClickExport,
    reportTableRef,
    isShowCloseBtn,
  } = useOperationReport();

  if (!isPagePermission(authorizedUser, [Permission.RPT_REDEMP_07])) return <Forbidden />;

  if (isLoading) return <Loader />;
  return (
    <Fragment>
      <HeaderReport
        title="Operation report"
        handleClickAuditLog={() => handleClickAuditLog(OWNER_ID_REPORT.REPORT_04, AUDIT_LOG_PAGE.REPORT_04)}
        handleClickExport={handleClickExport}
      />
      <div className="overflow-auto h-[calc(100vh-61px)] px-5 pb-5">
        <div className="overflow-auto px-5">
          <div className="flex mb-5 w-full mt-5">
            <SearchInput
              className="w-full"
              value={keyword}
              isShowCloseBtn={isShowCloseBtn}
              onReset={handleClearSearchCampaign}
              onChange={handleChangeSearch}
            />
            <ReloadButton handleClickReload={handleClickReload} />
          </div>
          <CampaignTableForSelect
            isLoading={isLoading}
            dataList={campaignListForSelect}
            authorizedUser={authorizedUser}
            onUpdateCampaignList={fetchCampaignData}
          />
        </div>
        {/* filter by date */}

        <div className="overflow-auto pt-5">
          <FormProvider {...methodsForm}>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <FormInput isRequired={false} title="Redemption Date From">
                <DatePicker
                  isRequired
                  name="campaignStartDate"
                  maxDate={reportForm.campaignEndDate || new Date()}
                  value={reportForm.campaignStartDate}
                  onChange={onChangeInput}
                />
              </FormInput>
              <FormInput isRequired={false} title="Redemption Date To">
                <DatePicker
                  isRequired
                  name="campaignEndDate"
                  minDate={reportForm.campaignStartDate || new Date()}
                  maxDate={new Date()}
                  value={reportForm.campaignEndDate}
                  onChange={onChangeInput}
                />
              </FormInput>
            </div>
          </FormProvider>
        </div>

        <br />
        <div className="overflow-auto px-5">
          <table ref={reportTableRef} className="OperationReportTable table-auto border-collapse w-full">
            <thead className="text-start text-blue-oxford text-[14px] bg-gradient-head-table rounded-t-lg w-full border-b border-blue-sea/30 py-2">
              <tr>
                <th className="px-1 py-3" colSpan={100}>
                  Bank promotion
                </th>
              </tr>
            </thead>
            <tbody>
              {campaignTargetList.length > 0 && reportBankProDetail.length > 0 ? (
                <Fragment>
                  <tr>
                    <td className="border" colSpan={2}>
                      Promotion Name/Campaign Name
                    </td>
                    {/* start report */}

                    {campaignTargetList.length > 0
                      ? campaignTargetList.map((campaignTarget, indexTar) => {
                          let colSpan: number = 0;
                          campaignTarget.campaignConditions.map((campaignCondition: any) => {
                            colSpan += campaignCondition.spendingConditions.length * 2;
                          });

                          return (
                            <td className="border" colSpan={colSpan} key={indexTar}>
                              {campaignTarget.campaignName}
                            </td>
                          );
                        })
                      : null}

                    {/* summary path */}
                    <td className="border" colSpan={2}>
                      {' '}
                    </td>
                  </tr>
                  <tr>
                    <td className="border" colSpan={2}>
                      Reward Name
                    </td>
                    {/* start report */}
                    {campaignTargetList.length > 0
                      ? campaignTargetList.map((campaignTarget) =>
                          campaignTarget.campaignConditions.map((campaignCondition: any) =>
                            campaignCondition.spendingConditions.map(
                              (spendingCondition: any, spendingIndex: number) => (
                                <td className="border" colSpan={2} key={spendingIndex}>
                                  {campaignCondition.conditionGroup}
                                </td>
                              )
                            )
                          )
                        )
                      : null}

                    {/* summary path */}
                    <td className="border" colSpan={2} />
                  </tr>

                  <tr>
                    <td className="border" colSpan={2}>
                      Period /Start date - End date
                    </td>
                    {/* start report */}

                    {campaignTargetList.length > 0
                      ? campaignTargetList.map((campaignTarget, indexTarget) => {
                          let colSpan: number = 0;
                          campaignTarget.campaignConditions.map((campaignCondition: any) => {
                            colSpan += campaignCondition.spendingConditions.length * 2;
                          });

                          return (
                            <td className="border" colSpan={colSpan} key={indexTarget}>
                              {formatDate(campaignTarget.campaignStartDate)} -{' '}
                              {formatDate(campaignTarget.campaignEndDate)}
                            </td>
                          );
                        })
                      : null}

                    {/* summary path */}
                    <td className="border" colSpan={2} />
                  </tr>
                  <tr>
                    <td className="border">Redemption date/ Transaction of redemption</td>
                    <td className="border">BANK NAME - payment method bank name</td>
                    {/* start report */}

                    {campaignTargetList.length > 0
                      ? campaignTargetList.map((campaignTarget) =>
                          campaignTarget.campaignConditions.map((campaignCondition: any) =>
                            campaignCondition.spendingConditions.map(
                              (spendingCondition: any, spendingConditionsIndex: number) => (
                                <Fragment key={spendingConditionsIndex}>
                                  <td className="border">Spending : ( Sum of Payment amount) (THB)</td>
                                  <td className="border">
                                    Transaction of no.of credit card no of redeemed receipt id or counter (จำนวนรายการ)
                                  </td>
                                </Fragment>
                              )
                            )
                          )
                        )
                      : null}

                    {/* summary path */}
                    <td className="border">Summary of payment amount by transaction date ( all Bank campaign)</td>
                    <td className="border">
                      Summary of no.of Transaction by Transaction date (redemption date) (จำนวนรายการ){' '}
                    </td>
                  </tr>
                  <tr>
                    <td className="border" colSpan={2}>
                      Total campaign name
                    </td>
                    {/* start report */}

                    {campaignTargetList.length > 0
                      ? campaignTargetList.map((campaignTarget) =>
                          campaignTarget.campaignConditions.map((campaignCondition: any) =>
                            campaignCondition.spendingConditions.map(
                              (spendingCondition: any, indexSpending: number) => (
                                <Fragment key={indexSpending}>
                                  <td className="border">{getAmountByCondition(spendingCondition._id)}</td>
                                  <td className="border">{getPaymentMethodTotalByCondition(spendingCondition._id)}</td>
                                </Fragment>
                              )
                            )
                          )
                        )
                      : null}

                    {/* summary path */}
                    <td className="border">{getAmount()}</td>
                    <td className="border">{getPaymentMethodTotal()}</td>
                  </tr>

                  {/* more detail path */}
                  {reportBankProDetail.length > 0
                    ? reportBankProDetail.map((row: any) =>
                        row.bankNameList.map((bankName: any, indexBank: number) => (
                          <tr key={indexBank}>
                            <td className="border">{formatDate(row.receiptDate)}</td>
                            <td className="border">{bankName.bankName}</td>
                            {/* start report */}

                            {campaignTargetList.length > 0
                              ? campaignTargetList.map((campaignTarget) =>
                                  campaignTarget.campaignConditions.map((campaignCondition: any) =>
                                    campaignCondition.spendingConditions.map(
                                      (spendingCondition: any, indexCondition: number) => (
                                        <Fragment key={indexCondition}>
                                          <td className="border">
                                            {
                                              getReportDetailByDateAndSpecialCondition(
                                                row.receiptDate,
                                                spendingCondition._id,
                                                bankName.bankName
                                              ).amount
                                            }
                                          </td>
                                          <td className="border">
                                            {
                                              getReportDetailByDateAndSpecialCondition(
                                                row.receiptDate,
                                                spendingCondition._id,
                                                bankName.bankName
                                              ).count
                                            }
                                          </td>
                                        </Fragment>
                                      )
                                    )
                                  )
                                )
                              : null}

                            {/* summary path */}
                            <td className="border">{bankName.amount}</td>
                            <td className="border">{bankName.count}</td>
                          </tr>
                        ))
                      )
                    : null}
                </Fragment>
              ) : (
                <tr>
                  <td className="px-1 py-3 text-center" colSpan={100}>
                    please select campaign
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Fragment>
  );
};

export default withSession(OperationBankReportPage, PagePermission.report_04);
