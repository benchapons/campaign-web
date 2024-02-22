import { Fragment } from 'react';
import { LoaderTable } from '@/components/Loader';

interface PropsType {
  isLoading?: boolean;
  rewardTracking: any[];
}

const RewardTrackingTable = ({ isLoading, rewardTracking }: PropsType) => {
  return (
    <div className="w-full">
      {isLoading ? (
        <LoaderTable />
      ) : rewardTracking.length > 0 ? (
        <Fragment>
          <div className="overflow-x-auto overflow-y-hidden rounded-md">
            <table className="table-auto border-collapse w-full">
              <thead className="text-start text-blue-oxford text-[14px] bg-gradient-head-table rounded-t-lg">
                <tr>
                  <th className="px-1 py-2">Building</th>
                  <th className="px-1 py-2">Condition Name</th>
                  <th className="px-1 py-2">Tier Spending</th>
                  <th className="px-1 py-2">ประเภทของรางวัล</th>
                  <th className="px-1 py-2">ชื่อของรางวัล</th>
                  <th className="px-1 py-2">สิทธิ์คงเหลือต่อวัน</th>
                  <th className="px-1 py-2">
                    สิทธิ์คงเหลือต่ออาทิตย์
                    <br />
                    (นับจากวันที่เริ่มต้นแคมเปญ 7 วัน)
                  </th>
                  <th className="px-1 py-2">
                    สิทธิ์คงเหลือต่ออาทิตย์
                    <br />
                    (WeekDay/Weekly)
                  </th>
                  <th className="px-1 py-2">สิทธิ์คงเหลือต่อเดือน</th>
                  <th className="px-1 py-2">
                    จำนวนของรางวัล
                    <br />
                    คงเหลือทั้งหมด
                  </th>
                </tr>
              </thead>
              <tbody className="text-center text-[14px] bg-white-ghost">
                {rewardTracking.map((_child: any, i: number) => {
                  const rewardSameList = rewardTracking?.filter(
                    (_reward) =>
                      _child.conditionId.concat(_child.spendingConditionId) ===
                      _reward.conditionId.concat(_reward.spendingConditionId)
                  );
                  const isSameReward =
                    _child.conditionId.concat(_child.spendingConditionId) ===
                    rewardTracking?.[i - 1]?.conditionId.concat(rewardTracking?.[i - 1]?.spendingConditionId);
                  let isSameHeader = true;
                  if (i === 0) {
                    isSameHeader = false;
                  } else {
                    isSameHeader = rewardTracking?.[i - 1]?.conditionId === _child?.conditionId;
                  }
                  return (
                    <Fragment key={i.toString().concat('item-reward')}>
                      {isSameReward
                        ? null
                        : rewardSameList?.map((_reward, j) => (
                            <tr
                              key={j.toString().concat('rewards')}
                              id={j.toString().concat('rewards')}
                              className={
                                j.toString().concat('rewards') === '0rewards' ? `border-t border-gray-gainsboro` : ''
                              }
                            >
                              {j === 0 ? (
                                <Fragment>
                                  <td className="px-1 py-4 max-w-[120px]" rowSpan={rewardSameList.length}>
                                    {_reward.building}
                                  </td>
                                  <td className="px-1 py-4 max-w-[180px]" rowSpan={rewardSameList.length}>
                                    {_reward.conditionName}
                                  </td>
                                </Fragment>
                              ) : null}
                              <td className="px-1 py-4">{_reward?.spending}</td>
                              <td className="px-1 py-4">{_reward?.type}</td>
                              <td className="px-1 py-4 max-w-[180px]">{_reward.rewardName}</td>
                              <td className="px-1 py-4">
                                {_reward?.daily}
                                {/* {_reward?.campaignQuotaDaily?.max === null ? (
                                  '-'
                                ) : (
                                  <Fragment>
                                    <span
                                      className={
                                        _reward?.campaignQuotaDaily?.max - _reward?.campaignQuotaDaily?.used
                                          ? 'pl-2 text-[#04c417] font-[900]'
                                          : 'pl-2 text-[#f54e42] font-[900]'
                                      }
                                    >
                                      {formatQuota(
                                        _reward?.campaignQuotaDaily?.max - _reward?.campaignQuotaDaily?.used
                                      )}
                                    </span>
                                    / {formatQuota(_reward?.campaignQuotaDaily?.max)}
                                  </Fragment>
                                )} */}
                              </td>
                              <td className="px-1 py-4">
                                {_reward?.weekly}
                                {/* {_reward?.weekType === WeeklyTypeEnum.WEEKDAY ? (
                                  '-'
                                ) : _reward?.campaignQuotaWeekly?.max === null ? (
                                  '-'
                                ) : (
                                  <Fragment>
                                    <span
                                      className={
                                        _reward?.campaignQuotaWeekly?.max - _reward?.campaignQuotaWeekly?.used
                                          ? 'pl-2 text-[#04c417] font-[900]'
                                          : 'pl-2 text-[#f54e42] font-[900]'
                                      }
                                    >
                                      {formatQuota(
                                        _reward?.campaignQuotaWeekly?.max - _reward?.campaignQuotaWeekly?.used
                                      )}
                                    </span>
                                    /{formatQuota(_reward?.campaignQuotaWeekly?.max)}
                                  </Fragment>
                                )} */}
                              </td>
                              <td className="px-1 py-4 max-w-[180px] whitespace-pre">
                                {_reward?.weekdays}
                                {/* {_reward?.weekType === WeeklyTypeEnum.WEEKDAY ? (
                                  <div className="min-w-[180px] flex flex-col">
                                    {_reward?.quotaWeeklyLists?.map((_list, j) => (
                                      <div key={j}>
                                        รูปแบบที่#{j + 1} {formatWeek(_list)}
                                        {_list.max === null ? null : (
                                          <span className="pl-2 font-[900]">
                                            <span
                                              className={
                                                _list.max - _list.used
                                                  ? 'pl-2 text-[#04c417] font-[900]'
                                                  : 'pl-2 text-[#f54e42] font-[900]'
                                              }
                                            >
                                              {formatQuota(_list.max - _list.used)}
                                            </span>
                                            /{formatQuota(_list.max)}
                                          </span>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  '-'
                                )} */}
                              </td>
                              <td className="px-1 py-4">
                                {_reward?.monthly}
                                {/* {_reward?.campaignQuotaMonthly?.max === null ? (
                                  '-'
                                ) : (
                                  <Fragment>
                                    <span
                                      className={
                                        _reward?.campaignQuotaMonthly?.max - _reward?.campaignQuotaMonthly?.used > 0
                                          ? 'pl-2 text-[#04c417] font-[900]'
                                          : 'pl-2 text-[#f54e42] font-[900]'
                                      }
                                    >
                                      {formatQuota(
                                        _reward?.campaignQuotaMonthly?.max === null
                                          ? null
                                          : _reward?.campaignQuotaMonthly?.max - _reward?.campaignQuotaMonthly?.used
                                      )}
                                    </span>
                                    /{formatQuota(_reward?.campaignQuotaMonthly?.max)}
                                  </Fragment>
                                )} */}
                              </td>
                              <td className="px-1 py-4">
                                {_reward?.totalQuantity}
                                {/* {_reward.totalRewardQty === null ? (
                                  '-'
                                ) : (
                                  <Fragment>
                                    <span
                                      className={
                                        _reward.totalRewardQty - _reward.totalRedeemed > 0
                                          ? 'pl-2 text-[#04c417] font-[900]'
                                          : 'pl-2 text-[#f54e42] font-[900]'
                                      }
                                    >
                                      {formatQuota(_reward.totalRewardQty - _reward.totalRedeemed)}
                                    </span>
                                    /{formatQuota(_reward.totalRewardQty)}
                                  </Fragment>
                                )} */}
                              </td>
                            </tr>
                          ))}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Fragment>
      ) : (
        <div className="flex w-full justify-center min-h-[100px] items-center  bg-blue-light/10">
          ไม่พบข้อมูลของรางวัล
        </div>
      )}
    </div>
  );
};

export default RewardTrackingTable;
