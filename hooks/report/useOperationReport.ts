import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { useDownloadExcel } from 'react-export-table-to-excel';
import { useRef } from 'react';

import { ChangeEventBaseType } from '@/types/event.interface';
import { OperationReportFormType } from '@/types/report.type';
import { SwalCustom } from '@/configurations/alert';
import useReport from './useReport';
import { getReceiptsByCampaignId, getCampaignListById, getCampaignList } from '@/services/client/report.service';
import { ResGetCampaignList } from '@/services/client/campaign.service';

const initReportForm: OperationReportFormType = {
  campaignStartDate: null,
  campaignEndDate: null,
};

const useOperationReport = () => {
  const {
    isMasterLoading,
    buildingList,
    campaignNameList,
    campaignList,
    fetchMasterSummaryData,
    fetchCampaignName,
    handleClickAuditLog,
  } = useReport();

  const [reportForm, setReportForm] = useState<OperationReportFormType>(initReportForm);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [campaignTargetList, setCampaignTargetList] = useState<any[]>([]);
  const [receiptCounting, setReceiptCounting] = useState<any[]>([]);
  const [reportBankProDetail, setReportBankProDetail] = useState<any[]>([]);
  const [reportCorProDetail, setReportCorProDetail] = useState<any[]>([]);
  const [keyword, setKeyword] = useState('');
  const [campaignListForSearch, setCampaignListForSearch] = useState<ResGetCampaignList[]>([]);
  const [initCampaignList, setInitCampaignList] = useState<ResGetCampaignList[]>([]);
  const [isShowCloseBtn, setIsShowCloseBtn] = useState(false);

  const schema = useMemo(() => {
    return yup.object().shape({
      campaignStartDate: yup.string().nullable().required('กรุณาระบุ'),
      campaignEndDate: yup.string().nullable().required('กรุณาระบุ'),
    });
  }, []);

  const methodsForm = useForm({
    resolver: yupResolver(schema),
  });

  function getRedeemCount(spendingConditionId: string, buildingCode: string) {
    return receiptCounting
      .filter(
        (item) =>
          (buildingCode === 'ALL' || item.buildingCode === buildingCode) &&
          item.spendingConditionId === spendingConditionId
      )
      .reduce((redeemCount, item) => redeemCount + item.redeemCount, 0);
  }

  function getCount(spendingConditionId: string, buildingCode: string) {
    return receiptCounting
      .filter(
        (item) =>
          (buildingCode === 'ALL' || item.buildingCode === buildingCode) &&
          item.spendingConditionId === spendingConditionId
      )
      .reduce((count, item) => count + item.count, 0);
  }

  function getSum(spendingConditionId: string, buildingCode: string) {
    return receiptCounting
      .filter(
        (item) =>
          (buildingCode === 'ALL' || item.buildingCode === buildingCode) &&
          item.spendingConditionId === spendingConditionId
      )
      .reduce((sum, item) => sum + item.sum, 0);
  }

  // for bank pro

  function getPaymentMethodTotalByCondition(spendingConditionId: string) {
    return receiptCounting.reduce((total, item) => {
      if (item.spendingConditionId === spendingConditionId) {
        return total + item.paymentMethodCount;
      }
      return total;
    }, 0);
  }

  function getAmountByCondition(spendingConditionId: string) {
    return receiptCounting.reduce((amount, item) => {
      if (item.spendingConditionId === spendingConditionId) {
        return amount + item.paymentAmount;
      }
      return amount;
    }, 0);
  }

  function getPaymentMethodTotal() {
    return receiptCounting.reduce((total, item) => total + item.paymentMethodCount, 0);
  }

  function getAmount() {
    return receiptCounting.reduce((total, item) => total + item.paymentAmount, 0);
  }

  function getCorPorReportDetailByCondition(date: string, specialConditionId: string, buildingCode: string) {
    // Initialize count to 0
    let amount = 0;
    let countReceipt = 0;
    let countRedeem = 0;

    // 1 loop for check date
    // 2 loop for check specialConditionId
    // 3 loop for check building
    // 4 return amount and count

    for (let item of reportCorProDetail) {
      if (item.receiptDate === date) {
        for (let condition of item.spendingConditionList) {
          if (condition.spendingConditionId === specialConditionId) {
            for (let buildingItem of condition.buildingList) {
              if (buildingItem.buildingCode === buildingCode || buildingCode === 'ALL') {
                amount += buildingItem.amount;
                countReceipt += buildingItem.countReceipt;
                countRedeem += buildingItem.redeemList.length;
              }
            }
          }
        }
      }
    }

    // retura amount and count
    return { amount, countReceipt, countRedeem };
  }

  function getReportDetailByDateAndSpecialCondition(date: string, specialConditionId: string, bankName: string) {
    // Initialize count to 0
    let amount = 0;
    let count = 0;

    // 1 loop for check date
    // 2 loop for check bankName
    // 3 loop for check specialConditionId
    // 4 return amount and count

    for (let item of reportBankProDetail) {
      if (item.receiptDate === date) {
        for (let bank of item.bankNameList) {
          if (bank.bankName === bankName) {
            for (let condition of bank.spendingConditionList) {
              if (condition.spendingConditionId === specialConditionId) {
                amount = condition.amount;
                count = condition.countPaymentMethod;
              }
            }
          }
        }
      }
    }

    // retura amount and count
    return { amount, count };
  }

  const fetchCampaignDataForSearch = async () => {
    try {
      const res: ResGetCampaignList[] = await getCampaignList();
      setCampaignListForSearch(res);
      setInitCampaignList(res);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const cancelToken = axios.CancelToken.source();

    if (!isLoading) return;
    fetchCampaignDataForSearch();
    fetchMasterSummaryData(cancelToken.token);

    fetchCampaignName({});
    return () => {
      cancelToken.cancel();
      setIsLoading(false);
    };
  }, []);

  // on campaignTargetList change
  useEffect(() => {
    if (campaignTargetList.length === 0) {
      setReceiptCounting([]);
      setReportCorProDetail([]);
      setReportBankProDetail([]);
    } else {
      for (const campaign of campaignTargetList) {
        fetchReceiptsByCampaignId(campaign._id);
      }
    }
  }, [campaignTargetList]);

  // on campaignTargetList change
  useEffect(() => {
    if (campaignTargetList.length === 0) {
    } else {
      for (const campaign of campaignTargetList) {
        fetchReceiptsByCampaignId(campaign._id);
      }
    }
  }, [reportForm.campaignEndDate, reportForm.campaignStartDate]);

  // =-=-=-=-=-=-=-=-= function =-=-=-=-=-=-=-=-=-=

  const fetchCampaignData = async (campaignId: string[]) => {
    setIsLoading(true);
    if (campaignId.length === 0) {
      setCampaignTargetList([]);
      setIsLoading(false);
    } else {
      try {
        const res = await getCampaignListById(campaignId);

        if (res?.success) {
          setCampaignTargetList(res?.data);
        }
      } catch (error: any) {
        SwalCustom.fire(`เกิดข้อผิดพลาด`, error?.errorMessageTh, 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const fetchReceiptsByCampaignId = async (campaignId: string) => {
    setIsLoading(true);
    try {
      const res = await getReceiptsByCampaignId(campaignId, {
        receiptDateStringFrom: reportForm.campaignStartDate,
        receiptDateStringTo: reportForm.campaignEndDate,
      });
      if (res?.success) {
        const receipts = res?.data;
        // count receipt group by spendingConditionId and buildingCode
        // { spendingConditionId: ?, building: ?, count: ? , paymentMethodCount: ?, paymentMethodList: [], paymentAmount: ?}

        let dateList: string[] = [];

        // loop
        const receiptsGroupBySpendingConditionIdAndBuilding = receipts?.reduce((acc: any, receipt: any) => {
          // add receiptDate to dateList
          if (dateList.indexOf(receipt?.receiptDate) === -1) {
            dateList.push(receipt?.receiptDate);
          } else {
            dateList = [...dateList, receipt?.receiptDate];
          }

          const index = acc?.findIndex(
            (i: any) =>
              i?.spendingConditionId === receipt?.spendingConditionId && i?.buildingCode === receipt?.buildingCode
          );

          // TODO: add paymentMethodCount if paymentMethod type is bank transfer

          let amount = 0;
          if (receipt?.paymentMethod?.length > 0) {
            amount = receipt?.paymentMethod?.reduce((acc: any, paymentMethod: any) => {
              if (paymentMethod?.paymentType === 'CREDIT_CARD_VISA') {
                acc = acc + paymentMethod?.amount;
              }
              return acc;
            }, 0);
          }

          if (index === -1) {
            // not found in lise
            acc?.push({
              buildingCode: receipt.buildingCode,
              spendingConditionId: receipt.spendingConditionId,
              redeemList: [receipt.redemptionId],
              redeemCount: 1,
              count: 1,
              paymentMethodCount: receipt?.paymentMethod.length,
              paymentMethodList: receipt?.paymentMethod,
              paymentAmount: +amount,
              paymentByBank: [],
              sum: receipt?.spendingAmount,
            });
          } else {
            // acc[index] is spendingConditionId
            acc[index].count = acc[index].count + 1;
            acc[index].sum = acc[index].sum + receipt?.spendingAmount;
            acc[index].paymentMethodCount = acc[index].paymentMethodCount + receipt?.paymentMethod.length;
            acc[index].paymentMethodList = [...acc[index].paymentMethodList, ...receipt?.paymentMethod];
            acc[index].paymentAmount = acc[index].paymentAmount + +amount;

            // acc[index].paymentByBank = [{date: "???", bankList: [{bankName: "", amount: 0, count: 0}]}]

            // check date of receipt

            if (acc[index].redeemList.indexOf(receipt.redemptionId) === -1) {
              acc[index].redeemList.push(receipt.redemptionId);
              acc[index].redeemCount = acc[index].redeemCount + 1;
            }
          }

          return acc;
        }, []);

        setReceiptCounting(receiptsGroupBySpendingConditionIdAndBuilding);

        // in loop receipt
        // check receiptDate is exist in dateList

        /*reportCorProDetail = [
          {
            receiptDate: '???',
            spendingConditionList: [
              {
                spendingConditionId: '',
                buildingList: [{ buildingCode: '', amount: 0, countReceipt: 0, redeemList: [] }],
              },
            ],
          },
        ];*/
        const reportCorProDetail = receipts?.reduce((acc: any, receipt: any) => {
          const indexOfReceiptDate = acc?.findIndex((i: any) => i?.receiptDate === receipt?.receiptDate);

          if (indexOfReceiptDate === -1) {
            // all new
            acc.push({
              receiptDate: receipt?.receiptDate,
              spendingConditionList: [
                {
                  spendingConditionId: receipt?.spendingConditionId,
                  buildingList: [
                    {
                      buildingCode: receipt?.buildingCode,
                      amount: receipt?.spendingAmount,
                      countReceipt: 1,
                      redeemList: [receipt?.redemptionId],
                    },
                  ],
                },
              ],
            });
          } else {
            const indexOfSpendingConditionId = acc[indexOfReceiptDate].spendingConditionList.findIndex(
              (i: any) => i?.spendingConditionId === receipt?.spendingConditionId
            );

            if (indexOfSpendingConditionId === -1) {
              // same date new spendingConditionId
              acc[indexOfReceiptDate].spendingConditionList.push({
                spendingConditionId: receipt?.spendingConditionId,
                buildingList: [
                  {
                    buildingCode: receipt?.buildingCode,
                    amount: receipt?.spendingAmount,
                    countReceipt: 1,
                    redeemList: [receipt?.redemptionId],
                  },
                ],
              });
            } else {
              const indexOfBuildingCode = acc[indexOfReceiptDate].spendingConditionList[
                indexOfSpendingConditionId
              ].buildingList.findIndex((i: any) => i?.buildingCode === receipt?.buildingCode);

              if (indexOfBuildingCode === -1) {
                // same date same spendingConditionId new buildingCode
                acc[indexOfReceiptDate].spendingConditionList[indexOfSpendingConditionId].buildingList.push({
                  buildingCode: receipt?.buildingCode,
                  amount: receipt?.spendingAmount,
                  countReceipt: 1,
                  redeemList: [receipt?.redemptionId],
                });
              } else {
                // same date same spendingConditionId same buildingCode
                acc[indexOfReceiptDate].spendingConditionList[indexOfSpendingConditionId].buildingList[
                  indexOfBuildingCode
                ].amount =
                  acc[indexOfReceiptDate].spendingConditionList[indexOfSpendingConditionId].buildingList[
                    indexOfBuildingCode
                  ].amount + receipt?.spendingAmount;
                acc[indexOfReceiptDate].spendingConditionList[indexOfSpendingConditionId].buildingList[
                  indexOfBuildingCode
                ].countReceipt =
                  acc[indexOfReceiptDate].spendingConditionList[indexOfSpendingConditionId].buildingList[
                    indexOfBuildingCode
                  ].countReceipt + 1;

                if (
                  acc[indexOfReceiptDate].spendingConditionList[indexOfSpendingConditionId].buildingList[
                    indexOfBuildingCode
                  ].redeemList.indexOf(receipt?.redemptionId) === -1
                ) {
                  acc[indexOfReceiptDate].spendingConditionList[indexOfSpendingConditionId].buildingList[
                    indexOfBuildingCode
                  ].redeemList.push(receipt?.redemptionId);
                }
              }
            }
          }

          return acc;
        }, []);

        setReportCorProDetail(reportCorProDetail);

        // in loop receipt
        // check receiptDate is exist in dateList

        // reportBankProDetail = [{receiptDate: "???", bankNameList: [{bankName: "", spendingConditionList: [{ spendingConditionId: "", amount: 0, countPaymentMethod: 0 }] }] }]
        const reportBankProDetail = receipts?.reduce((acc: any, receipt: any) => {
          if (receipt?.paymentMethod?.length > 0) {
            const index = acc?.findIndex((i: any) => i?.receiptDate === receipt?.receiptDate);

            if (index === -1) {
              const bankNameList = receipt?.paymentMethod.reduce((accPaymentMethod: any, paymentMethod: any) => {
                if (paymentMethod?.paymentType !== 'CREDIT_CARD_VISA') return accPaymentMethod;

                const indexOfBankName = accPaymentMethod.findIndex((i: any) => i?.bankName === paymentMethod?.bankName);
                if (indexOfBankName === -1) {
                  // not found in list
                  accPaymentMethod.push({
                    bankName: paymentMethod?.bankName,
                    amount: paymentMethod?.amount,
                    count: 1,
                    spendingConditionList: [
                      {
                        spendingConditionId: receipt?.spendingConditionId,
                        amount: paymentMethod?.amount,
                        countPaymentMethod: 1,
                      },
                    ],
                  });
                } else {
                  // found in list
                  accPaymentMethod[indexOfBankName].amount =
                    accPaymentMethod[indexOfBankName].amount + paymentMethod?.amount;
                  accPaymentMethod[indexOfBankName].count = accPaymentMethod[indexOfBankName].count + 1;

                  // check spendingConditionId is exist in spendingConditionList
                  const indexOfSpendingConditionId = accPaymentMethod[indexOfBankName].spendingConditionList.findIndex(
                    (i: any) => i?.spendingConditionId === receipt?.spendingConditionId
                  );

                  if (indexOfSpendingConditionId === -1) {
                    // not found in list
                    accPaymentMethod[indexOfBankName].spendingConditionList.push({
                      spendingConditionId: receipt?.spendingConditionId,
                      amount: paymentMethod?.amount,
                      countPaymentMethod: 1,
                    });
                  } else {
                    // found in list
                    accPaymentMethod[indexOfBankName].spendingConditionList[indexOfSpendingConditionId].amount =
                      accPaymentMethod[indexOfBankName].spendingConditionList[indexOfSpendingConditionId].amount =
                        paymentMethod?.amount;
                    accPaymentMethod[indexOfBankName].spendingConditionList[
                      indexOfSpendingConditionId
                    ].countPaymentMethod =
                      accPaymentMethod[indexOfBankName].spendingConditionList[indexOfSpendingConditionId]
                        .countPaymentMethod + 1;
                  }
                }
                return accPaymentMethod;
              }, []);

              acc.push({
                receiptDate: receipt?.receiptDate,
                bankNameList: bankNameList,
              });
            } else {
              const bankNameList = receipt?.paymentMethod.reduce((accPaymentMethod: any, paymentMethod: any) => {
                // check paymentType is VISA
                if (paymentMethod?.paymentType !== 'CREDIT_CARD_VISA') return accPaymentMethod;

                const indexOfBankName = accPaymentMethod.findIndex((i: any) => i?.bankName === paymentMethod?.bankName);
                if (indexOfBankName === -1) {
                  accPaymentMethod.push({
                    bankName: paymentMethod?.bankName,
                    amount: +paymentMethod?.amount,
                    count: 1,
                    spendingConditionList: [
                      {
                        spendingConditionId: receipt?.spendingConditionId,
                        amount: +paymentMethod?.amount,
                        countPaymentMethod: 1,
                      },
                    ],
                  });
                } else {
                  // forch amount to num for add
                  accPaymentMethod[indexOfBankName].amount =
                    accPaymentMethod[indexOfBankName].amount + +paymentMethod?.amount;
                  accPaymentMethod[indexOfBankName].count = accPaymentMethod[indexOfBankName].count + 1;

                  // check spendingConditionId is exist in spendingConditionList
                  const indexOfSpendingConditionId = accPaymentMethod[indexOfBankName].spendingConditionList.findIndex(
                    (i: any) => i?.spendingConditionId === receipt?.spendingConditionId
                  );

                  if (indexOfSpendingConditionId === -1) {
                    // not found in list
                    accPaymentMethod[indexOfBankName].spendingConditionList.push({
                      spendingConditionId: receipt?.spendingConditionId,
                      amount: paymentMethod?.amount,
                      countPaymentMethod: 1,
                    });
                  } else {
                    // found in list
                    accPaymentMethod[indexOfBankName].spendingConditionList[indexOfSpendingConditionId].amount =
                      accPaymentMethod[indexOfBankName].spendingConditionList[indexOfSpendingConditionId].amount =
                        paymentMethod?.amount;
                    accPaymentMethod[indexOfBankName].spendingConditionList[
                      indexOfSpendingConditionId
                    ].countPaymentMethod =
                      accPaymentMethod[indexOfBankName].spendingConditionList[indexOfSpendingConditionId]
                        .countPaymentMethod + 1;
                  }
                }

                return accPaymentMethod;
              }, acc[index].bankNameList);

              acc[index].bankNameList = bankNameList;
            }
          }

          return acc;
        }, []);

        setReportBankProDetail(reportBankProDetail);
        // set paymentMethodCounting()
      }
    } catch (error: any) {
      console.error(error);
      SwalCustom.fire(`เกิดข้อผิดพลาด`, error?.errorMessageTh, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // =-=-=-=-=-=-=-=-= Action =-=-=-=-=-=-=-=-=-=

  const onChangeInput = ({ name, value }: ChangeEventBaseType<string | boolean | string[]>) => {
    if (name === 'campaignStartDate' || name === 'campaignEndDate') {
      setReportForm({ ...reportForm, [name]: value });
    }
  };

  const reportTableRef = useRef(null);

  const { onDownload } = useDownloadExcel({
    currentTableRef: reportTableRef.current,
    filename: 'operation_report',
    sheet: 'report',
  });

  const campaignListForSelect = useMemo<ResGetCampaignList[]>(() => {
    if (!keyword) return campaignListForSearch;

    const src = keyword?.toLowerCase()?.trim() || '';
    const listSearch = campaignListForSearch.filter(
      (_campaign) =>
        _campaign?.building?.toLowerCase().indexOf(src) > -1 ||
        _campaign?.name?.toLowerCase().indexOf(src) > -1 ||
        _campaign?.code?.toLowerCase().indexOf(src) > -1 ||
        _campaign?.cost?.toString()?.toLowerCase().indexOf(src) > -1 ||
        _campaign?.status?.toLowerCase().indexOf(src) > -1
    );
    return listSearch;
  }, [keyword, campaignListForSearch]);

  const handleClearSearchCampaign = () => {
    setKeyword('');
    setCampaignListForSearch(initCampaignList);
    setIsShowCloseBtn(false);
  };

  const handleChangeSearch = (event: ChangeEventBaseType<string>) => {
    setKeyword(event.value);
    setIsShowCloseBtn(event.value === '' ? false : true);
  };

  const handleClickReload = () => {
    setKeyword('');
    fetchCampaignDataForSearch();
  };

  return {
    isLoading: isLoading || isMasterLoading,
    isShowCloseBtn,
    methodsForm,
    handleClickAuditLog,
    campaignTargetList,
    reportBankProDetail,
    reportCorProDetail,
    getReportDetailByDateAndSpecialCondition,
    getCorPorReportDetailByCondition,
    getCount,
    getSum,
    getRedeemCount,
    getPaymentMethodTotal,
    getAmount,
    getPaymentMethodTotalByCondition,
    getAmountByCondition,
    keyword,
    handleClearSearchCampaign,
    handleClickReload,
    handleChangeSearch,
    campaignListForSelect,
    fetchCampaignData,
    onChangeInput,
    handleClickExport: onDownload,
    reportTableRef,
    reportForm,
  };
};

export default useOperationReport;
