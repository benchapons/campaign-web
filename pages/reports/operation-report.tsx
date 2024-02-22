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
import { v4 as uuidv4 } from 'uuid';
import ReloadButton from '@/components/shared/ReloadButton';
import CampaignTableForSelect from '@/components/common/Table/CampaignTableForSelect';
import { formatDate } from '@/utilities/format';

const OperationCorpoReportPage = ({ authorizedUser }: any) => {
  const {
    isLoading,
    methodsForm,
    handleClickAuditLog,
    campaignTargetList,
    reportBankProDetail,
    reportCorProDetail,
    getCorPorReportDetailByCondition,
    getCount,
    getSum,
    getRedeemCount,
    keyword,
    campaignListForSelect,
    handleClearSearchCampaign,
    handleChangeSearch,
    handleClickReload,
    fetchCampaignData,
    onChangeInput,
    handleClickExport,
    reportTableRef,
    isShowCloseBtn,
    reportForm,
  } = useOperationReport();

  if (!isPagePermission(authorizedUser, [Permission.RPT_REDEMP_06])) return <Forbidden />;

  return (
    <div>
      {isLoading && <Loader />}
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
            onUpdateCampaignList={(e) => {
              fetchCampaignData(e);
            }}
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
                  maxDate={reportForm?.campaignEndDate || new Date()}
                  value={reportForm?.campaignStartDate}
                  onChange={onChangeInput}
                />
              </FormInput>
              <FormInput isRequired={false} title="Redemption Date To">
                <DatePicker
                  isRequired
                  name="campaignEndDate"
                  minDate={reportForm?.campaignStartDate || new Date()}
                  maxDate={new Date()}
                  value={reportForm?.campaignEndDate}
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
                  Corp promotion
                </th>
              </tr>
            </thead>
            <tbody>
              {campaignTargetList.length > 0 ? (
                campaignTargetList.map((campaignTarget) => {
                  let colSpan: number = 0;
                  //colSpan += 1; // for title

                  campaignTarget.campaignConditions.map((campaignCondition: any) => {
                    let rewardsPerConditions: number = 0; // reward count of campaignCondition
                    campaignCondition.spendingConditions.map((spendingCondition: any) => {
                      spendingCondition.rewards.map((reward: any) => {
                        if (!reward.isRewardSharing) rewardsPerConditions++;
                      });
                    });

                    let allBuildings = 0;
                    if (campaignCondition.building?.length > 1) allBuildings = 1;

                    colSpan +=
                      ((campaignCondition.building?.length || 1) + rewardsPerConditions + allBuildings) *
                      campaignCondition.spendingConditions?.length *
                      3;
                  });

                  let shereRewards: string[] = [];
                  campaignTarget.campaignConditions?.map((campaignCondition: any) => {
                    campaignCondition?.spendingConditions?.map((spendingCondition: any) => {
                      if (spendingCondition?.sharedRewardIds.length > 0) {
                        spendingCondition.sharedRewardIds.map((_shereReward: any) => {
                          // todo: push shere reward data to array obj
                          if (!shereRewards.includes(_shereReward)) {
                            shereRewards.push(_shereReward);
                          }
                        });
                      }
                    });
                  });

                  colSpan += shereRewards.length;

                  return (
                    <>
                      <tr>
                        <td className="border">campaignCode</td>
                        <td className="border" colSpan={colSpan}>
                          {campaignTarget.campaignCode}
                        </td>
                      </tr>

                      <tr>
                        <td className="border">PROMOTION/campaignName</td>
                        <td className="border" colSpan={colSpan}>
                          {campaignTarget.campaignName}
                        </td>
                      </tr>

                      <tr>
                        <td className="border">PERIOD</td>
                        <td className="border" colSpan={colSpan}>
                          {formatDate(campaignTarget.campaignStartDate)} - {formatDate(campaignTarget.campaignEndDate)}
                        </td>
                      </tr>

                      <tr className="condition">
                        <td className="border">Tier Condition name</td>

                        {campaignTarget.campaignConditions.map((campaignCondition: any, index: number) => {
                          let rewardsPerCondition: number = 0; // reward count of campaignCondition
                          campaignCondition.spendingConditions.map((spendingCondition: any) => {
                            spendingCondition.rewards.map((reward: any) => {
                              if (!reward.isRewardSharing) rewardsPerCondition++;
                            });
                          });

                          let allBuilding = 0;
                          if (campaignCondition.building.length > 1) allBuilding = 1;

                          return (
                            <>
                              <td
                                key={uuidv4()}
                                className="border"
                                colSpan={
                                  ((campaignCondition.building?.length || 1) + rewardsPerCondition + allBuilding) *
                                  campaignCondition.spendingConditions?.length *
                                  3
                                }
                              >
                                campaignCondition {campaignCondition.conditionGroup}
                              </td>
                            </>
                          );
                        })}

                        {shereRewards.map((shereReward: string, index: number) => {
                          return (
                            <>
                              <td key={uuidv4()} className="border" rowSpan={4} colSpan={3}>
                                shereReward {shereReward}
                              </td>
                            </>
                          );
                        })}
                      </tr>
                      <tr>
                        <td className="border">Tier spending name</td>
                        {campaignTarget.campaignConditions.map((campaignCondition: any, _: number) => (
                          <>
                            {campaignCondition.spendingConditions.map((spendingCondition: any, index: number) => {
                              // check spendingCondition have normal reward
                              let rewardCount: number = 0;
                              spendingCondition.rewards.map((reward: any) => {
                                if (!reward.isRewardSharing) rewardCount++;
                              });

                              let allBuilding = 0;
                              if (campaignCondition.building.length > 1) allBuilding = 1;

                              return (
                                <>
                                  <td
                                    key={uuidv4()}
                                    className="border"
                                    colSpan={
                                      ((campaignCondition.building?.length || 1) + rewardCount + allBuilding) * 3
                                    }
                                  >
                                    tier {spendingCondition.minSpendingAmount} to {spendingCondition.maxSpendingAmount}
                                  </td>
                                </>
                              );
                            })}
                          </>
                        ))}
                      </tr>

                      <tr>
                        <td className="border">Campaign Building</td>

                        {campaignTarget.campaignConditions.map((campaignCondition: any, _: number) => (
                          <>
                            {campaignCondition.spendingConditions.map((spendingCondition: any, _: number) => {
                              let rewardCount: number = 0;
                              spendingCondition.rewards.map((reward: any) => {
                                if (!reward.isRewardSharing) rewardCount++;
                              });

                              let allBuilding = 0;
                              if (campaignCondition.building.length > 1) allBuilding = 1;

                              return (
                                <>
                                  <td
                                    className="border"
                                    colSpan={
                                      ((campaignCondition.building?.length || 1) + rewardCount + allBuilding) * 3
                                    }
                                  >
                                    {campaignCondition.building.map((building: string, _: number) => {
                                      return <>{building}/</>;
                                    })}
                                  </td>
                                </>
                              );
                            })}
                          </>
                        ))}
                      </tr>

                      <tr>
                        <td className="border">Receipt Building</td>
                        {campaignTarget.campaignConditions.map((campaignCondition: any, _: number) => (
                          <>
                            {campaignCondition.spendingConditions.map((spendingCondition: any, _: number) => (
                              <>
                                {/* building */}
                                {campaignCondition.building.map((building: string, index: number) => {
                                  return (
                                    <>
                                      <td key={uuidv4()} className="border" colSpan={3}>
                                        building {building}
                                      </td>
                                    </>
                                  );
                                })}

                                {/* all building */}
                                {campaignCondition.building.length > 1 ? (
                                  <>
                                    <td key={uuidv4()} className="border" colSpan={3}>
                                      {campaignCondition.building.map((building: string, index: number) => {
                                        if (index == campaignCondition.building.length - 1) {
                                          return <>{building}</>;
                                        } else {
                                          return <>{building}/</>;
                                        }
                                      })}
                                    </td>
                                  </>
                                ) : (
                                  <></>
                                )}

                                {/* reward (normal reward) */}
                                {spendingCondition.rewards.map((reward: any, index: number) => {
                                  // TODO: filter by tier

                                  if (!reward.isRewardSharing) {
                                    return (
                                      <>
                                        <td key={uuidv4()} className="border" colSpan={3}>
                                          reward: {reward.rewardName}
                                        </td>
                                      </>
                                    );
                                  }
                                })}
                              </>
                            ))}
                          </>
                        ))}
                      </tr>

                      <tr>
                        <td className="border">Definition</td>
                        {campaignTarget.campaignConditions.map((campaignCondition: any, _: number) => (
                          <>
                            {campaignCondition.spendingConditions.map((spendingCondition: any, _: number) => (
                              <>
                                {/* building */}
                                {campaignCondition.building.map((building: string, index: number) => {
                                  return (
                                    <>
                                      <td key={uuidv4()} className="border">
                                        no.of Redeemed txn
                                      </td>
                                      <td key={uuidv4()} className="border">
                                        no.of Receipt txn
                                      </td>
                                      <td key={uuidv4()} className="border">
                                        Spending amount (sum of receipt amount or redemption amount)
                                      </td>
                                    </>
                                  );
                                })}

                                {/* all building */}
                                {campaignCondition.building.length > 1 ? (
                                  <>
                                    <td key={uuidv4()} className="border">
                                      Total of redeemed transaction of this reward id
                                    </td>
                                    <td key={uuidv4()} className="border">
                                      Total of receipt transaction of this reward id
                                    </td>
                                    <td key={uuidv4()} className="border">
                                      Total of spending amount of this reward id
                                    </td>
                                  </>
                                ) : (
                                  <></>
                                )}

                                {/* reward (normal reward) */}
                                {spendingCondition.rewards.map((reward: any, index: number) => {
                                  if (!reward.isRewardSharing) {
                                    return (
                                      <>
                                        <td className="border">Total Reward QTY of this reward id</td>
                                        <td className="border">Total Redeemed QTY of this reward id</td>
                                        <td className="border">
                                          Reward Balance [Total reward QTY-Total redeemed QTY of this reward id]
                                        </td>
                                      </>
                                    );
                                  }
                                })}
                              </>
                            ))}
                          </>
                        ))}

                        {/* if have shere reward */}
                        {shereRewards.map((_shereReward: string, _index: number) => {
                          return (
                            <>
                              <td className="border">Total Reward QTY of this reward id</td>
                              <td className="border">Total Redeemed QTY of this reward id</td>
                              <td className="border">
                                Reward Balance [Total reward QTY-Total redeemed QTY of this reward id]
                              </td>
                            </>
                          );
                        })}
                      </tr>

                      <tr>
                        <td className="border">Total</td>
                        {campaignTarget.campaignConditions.map((campaignCondition: any, _: number) => (
                          <>
                            {campaignCondition.spendingConditions.map((spendingCondition: any, _: number) => {
                              return (
                                <>
                                  {/* building */}
                                  {campaignCondition.building.map((building: string, index: number) => {
                                    return (
                                      <>
                                        <td key={uuidv4()} className="border">
                                          {getRedeemCount(spendingCondition._id, building)}
                                        </td>
                                        <td key={uuidv4()} className="border">
                                          {getCount(spendingCondition._id, building)}
                                        </td>
                                        <td key={uuidv4()} className="border">
                                          {getSum(spendingCondition._id, building)}
                                        </td>
                                      </>
                                    );
                                  })}

                                  {/* all building */}
                                  {campaignCondition.building.length > 1 ? (
                                    <>
                                      <td key={uuidv4()} className="border">
                                        {getRedeemCount(spendingCondition._id, 'ALL')}
                                      </td>
                                      <td key={uuidv4()} className="border">
                                        {getCount(spendingCondition._id, 'ALL')}
                                      </td>
                                      <td key={uuidv4()} className="border">
                                        {getSum(spendingCondition._id, 'ALL')}
                                      </td>
                                    </>
                                  ) : (
                                    <></>
                                  )}

                                  {/* reward (normal reward) */}
                                  {spendingCondition.rewards.map((reward: any, index: number) => {
                                    if (!reward.isRewardSharing) {
                                      return (
                                        <>
                                          <td className="border">{reward.totalRewardQty}</td>
                                          <td className="border">{reward.totalRedeemed}</td>
                                          <td className="border">{reward.totalRewardQty - reward.totalRedeemed}</td>
                                        </>
                                      );
                                    }
                                  })}
                                </>
                              );
                            })}
                          </>
                        ))}

                        {/* if have shere reward */}

                        {campaignTarget?.sharedRewards ? (
                          campaignTarget?.sharedRewards.map((sharingReward: any, index: number) => {
                            return (
                              <>
                                <td className="border">{sharingReward.totalRewardQty}</td>
                                <td className="border">{sharingReward.totalRedeemed}</td>
                                <td className="border">{sharingReward.totalRewardQty - sharingReward.totalRedeemed}</td>
                              </>
                            );
                          })
                        ) : (
                          <></>
                        )}
                      </tr>

                      {reportCorProDetail.length > 0 ? (
                        reportBankProDetail.map((row: any) => {
                          return (
                            <tr>
                              <td className="border">{formatDate(row.receiptDate)}</td>
                              {campaignTarget.campaignConditions.map((campaignCondition: any, _: number) => (
                                <>
                                  {campaignCondition.spendingConditions.map((spendingCondition: any, _: number) => {
                                    return (
                                      <>
                                        {/* building */}
                                        {campaignCondition.building.map((building: string, index: number) => {
                                          return (
                                            <>
                                              <td className="border">
                                                {
                                                  getCorPorReportDetailByCondition(
                                                    row.receiptDate,
                                                    spendingCondition._id,
                                                    building
                                                  ).countRedeem
                                                }
                                              </td>
                                              <td className="border">
                                                {
                                                  getCorPorReportDetailByCondition(
                                                    row.receiptDate,
                                                    spendingCondition._id,
                                                    building
                                                  ).countReceipt
                                                }
                                              </td>
                                              <td className="border">
                                                {
                                                  getCorPorReportDetailByCondition(
                                                    row.receiptDate,
                                                    spendingCondition._id,
                                                    building
                                                  ).amount
                                                }
                                              </td>
                                            </>
                                          );
                                        })}

                                        {/* all building */}
                                        {campaignCondition.building.length > 1 ? (
                                          <>
                                            <td className="border">
                                              {
                                                getCorPorReportDetailByCondition(
                                                  row.receiptDate,
                                                  spendingCondition._id,
                                                  'ALL'
                                                ).countRedeem
                                              }
                                            </td>
                                            <td className="border">
                                              {
                                                getCorPorReportDetailByCondition(
                                                  row.receiptDate,
                                                  spendingCondition._id,
                                                  'ALL'
                                                ).countReceipt
                                              }
                                            </td>
                                            <td className="border">
                                              {
                                                getCorPorReportDetailByCondition(
                                                  row.receiptDate,
                                                  spendingCondition._id,
                                                  'ALL'
                                                ).amount
                                              }
                                            </td>
                                          </>
                                        ) : (
                                          <></>
                                        )}

                                        {/* reward (normal reward) */}
                                        {spendingCondition.rewards.map((reward: any, index: number) => {
                                          if (!reward.isRewardSharing) {
                                            return (
                                              <>
                                                <td className="border">{reward.totalRewardQty}</td>
                                                <td className="border">{reward.totalRedeemed}</td>
                                                <td className="border">
                                                  {reward.totalRewardQty - reward.totalRedeemed}
                                                </td>
                                              </>
                                            );
                                          }
                                        })}
                                      </>
                                    );
                                  })}
                                </>
                              ))}
                            </tr>
                          );
                        })
                      ) : (
                        <></>
                      )}
                    </>
                  );
                })
              ) : (
                <>
                  <tr>
                    <td className="px-1 py-3 text-center" colSpan={100}>
                      please select campaign
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default withSession(OperationCorpoReportPage, PagePermission.report_04);
