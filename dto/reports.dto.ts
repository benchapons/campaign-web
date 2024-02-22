import {
  BankPromotionFormType,
  ReceiptTransactionReportFormType,
  RedemptionTransactionConditionFormType,
  RedemptionTransactionReceiptFormType,
  SummaryRedemptionRewardFormType,
} from '@/types/report.type';
import { DateTypeReportEnum } from '@/constants/enum';
import { OptionsDropdown } from '@/types/event.interface';
import {
  QueryParamForGetTxnReportInterface,
  ReceiptTxnReportResponseInterface,
  RedemptionTxnByReceiptReportInterface,
} from '@/types/report-campaign.interface';
import { FormatDateTimeAndShotEng, formatDateShotEng, numberWithCommas } from '@/utilities/format';

export const transformReportByCondition = (data: any[], rewardTypekey: any) => {
  const headerExcel = [
    'Redemption ID',
    'Campaign Name',
    'Condition Group Name',
    'Campaign Type',
    'Building',
    'Reward Name',
    'Reward Type',
    'Reference Code',
    'Customer ID',
    'ONESIAM No.',
    'Spending Amount',
    'Phone Number',
    'Redemption Date',
    'Total Quantity',
    'Extra Quantity',
    'Redemption Status',
    'Redemption Remark',
    'Redemption Cancel Reason',
    'Create By',
  ];
  const dataExcel = data?.map((i: any) => ({
    redemptionId: i?.redemptionId,
    campaignName: i?.campaignName,
    conditionGroupName: i?.conditionGroupName,
    campaignType: i?.campaignType,
    building: i?.building,
    rewardName: i?.rewardName,
    rewardType: rewardTypekey[i?.rewardType],
    referenceCode: i?.referenceCode,
    customerId: i?.customerId,
    vizNo: i?.vizNo,
    spendingAmount: i?.spendingAmount,
    phoneNumber: i?.phoneNumber,
    redemptionDate: i?.redemptionDate,
    quantity: i?.quantity + i?.extraQuantity,
    extraQuantity: i?.extraQuantity,
    redemptionStatus: i?.redemptionStatus,
    redemptionRemark: i?.redemptionRemark,
    redemptionCancelReason: i?.redemptionCancelReason,
    createdBy: i?.createdBy,
  }));

  return { dataExcel, headerExcel };
};

export const transformReportByReceipt = (
  data: RedemptionTxnByReceiptReportInterface[],
  receiptBuildingList: OptionsDropdown[]
) => {
  const headerExcel = [
    'Redemption ID',
    'Redemption Date',
    'Campaign Type',
    'Campaign Building',
    'Campaign Name',
    'Condition Group Name',
    'Reward Name',
    'Rule ID',
    'Reward Value',
    'Reward Type',
    'Receipt Amount',
    'Receipt ID',
    'Receipt No.',
    'Receipt Date',
    'Receipt Building',
    'Shop Name',
    'Merchant Category',
    'Merchant Tag',
    'Shop Category',
    'Sub Shop Category',
    'Reference Code',
    'Customer ID',
    'ONESIAM No.',
    'Phone Number',
    'Payment Method',
    'Bank Name',
    'Sale slip amount',
    'Spending Amount',
    'Receipt Remark',
    'Receipt Status',
    'Receipt Cancel Reason',
    'Receipt Cancel Remark',
    'Receipt Cancel Date',
    'Redemption Status',
    'Redemption Remark',
    'Redemption Cancel Reason',
    'Redemption Cancel Date',
    'Create By',
  ];
  let previousRecord: RedemptionTxnByReceiptReportInterface | null = null;
  const dataExcel = data?.map((i: RedemptionTxnByReceiptReportInterface) => {
    const receiptAmount =
      previousRecord && previousRecord?.receiptId === i?.receiptId && previousRecord?.redemptionId === i?.redemptionId
        ? 0
        : i?.receiptAmount;
    previousRecord = i;
    return {
      redemptionId: i?.redemptionId,
      redemptionDate: i?.redemptionDate,
      campaignType: i?.campaignType,
      building: i?.building,
      campaignName: i?.campaignName,
      conditionGroupName: i?.conditionGroupName,
      rewardName: i?.rewardName,
      ruleId: i?.ruleId,
      rewardValue: i?.rewardValue,
      rewardType: i?.rewardType,
      receiptAmount: receiptAmount,
      receiptId: i?.receiptId,
      receiptNo: i?.receiptNo,
      receiptDate: i?.receiptDate,
      receiptBuilding:
        receiptBuildingList.find((item) => item?.value === i?.receiptBuilding)?.label || i?.receiptBuilding,
      shopName: i?.shopName,
      merchantCategories: i?.merchantCategories,
      merchantTag: i?.merchantTag,
      shopCategory: i?.shopCategory,
      subShopCategory: i?.subShopCategory,
      referenceCode: i?.referenceCode,
      customerId: i?.customerId,
      vizNo: i?.vizNo,
      phoneNumber: i?.phoneNumber,
      paymentMethod: i?.paymentMethod,
      bankName: i?.bankName,
      saleSlipAmount: i?.saleSlipAmount,
      spendingAmount: i?.spendingAmount,
      notes: i?.notes,
      receiptStatus: i?.receiptStatus,
      receiptCancelReason: i?.receiptCancelReason,
      receiptCancelRemark: i?.receiptCancelRemark,
      receiptCancelDate: i?.receiptCancelDate,
      redemptionStatus: i?.redemptionStatus,
      redemptionRemark: i?.redemptionRemark,
      redemptionCancelReason: i?.redemptionCancelReason,
      redemptionCancelDate: i?.redemptionCancelDate,
      createdBy: i?.createdBy,
    };
  });

  return { dataExcel, headerExcel };
};

export const transformReportSummary = (data: any[], rewardTypekey: any) => {
  const headerExcel = [
    'Campaign Name',
    'Campaign Period',
    'Campaign Status',
    'Condition Group Name',
    'Reward ID',
    'Reward Name',
    'Reward Type',
    'Reward Value',
    // 'Spending',
    'Quantity Reward redeemed',
    'Total Quantity',
  ];
  const dataExcel = data?.map((i: any) => ({
    campaignName: i?.campaignName,
    campaignPeriod: i?.campaignPeriod,
    campaignStatus: i?.campaignStatus,
    conditionGroupName: i?.conditionGroupName,
    rewardId: i?.rewardId,
    rewardName: i?.rewardName,
    rewardType: rewardTypekey[i?.rewardType],
    rewardValue: i?.rewardValue,
    // spending: i?.spending,
    redeemQuantity: i?.redeemQuantity,
    totalQuantity: i?.totalQuantity,
  }));

  return { dataExcel, headerExcel };
};

export const transformReportBank = (data: any[]) => {
  const headerExcel = [
    'Redemption Id',
    'Campaign Name',
    'Condition Group Name',
    'Building',
    'Rewards Name',
    'Credit card No',
    'Name on card',
    'Credit card point',
    'Remark',
    'Sale slip amount',
    'Payment Method',
    'Bank Code',
    'Shop Name',
    'Receipt Date',
    'Redemption Date',
    'Redemption Status',
    'Redemption Cancel Reason',
  ];
  const dataExcel = data?.map((i: any) => ({
    redemptionId: i?.redemptionCode,
    campaignName: i?.campaignName,
    conditionGroupName: i?.conditionGroupName,
    building: i?.building,
    rewardName: i?.rewardName,
    creditCardNo: i?.creditCardNo,
    creditCardName: i?.creditCardName,
    creditCardPoint: i?.creditCardPoint,
    redemptionRemark: i?.redemptionRemark,
    saleSlipAmount: numberWithCommas(i?.saleSlipAmount),
    paymentMethod: i?.paymentMethod,
    bankCode: i?.bankName,
    shopName: i?.shopName,
    receiptDate: i?.receiptDate,
    redemptionDate: i?.redemptionDate,
    redemptionStatus: i?.redemptionStatus,
    redemptionCancelReason: i?.redemptionCancelReason,
  }));

  return { dataExcel, headerExcel };
};

export const transformReportReceiptTransaction = (recordsArrays: ReceiptTxnReportResponseInterface[]) => {
  const headerExcel = [
    'No.',
    'Receipt Building',
    'Receipt Date',
    'Receipt No.',
    'Receipt Collect',
    'Shop Name',
    'Shop Category',
    'Sub Shop Category',
    'Merchant Category',
    'Merchant Tag',
    'Customer ID',
    'ONESIAM No.',
    'M Card No.',
    'Phone Number',
    'Payment Method',
    'Bank Name',
    'Spending Amount',
    'Remark',
    'Receipt Status',
    'Receipt Cancel Reason',
    'Receipt Cancel Remark',
    'Create Date',
    'Create By',
  ];
  let count: number = 0;
  const dataExcel = recordsArrays?.map((record: ReceiptTxnReportResponseInterface, index: number) => {
    return {
      index: ++count,
      receiptBuildingName: record?.receiptBuildingName,
      receiptDateString: formatDateShotEng(record?.receiptDateString),
      receiptNumber: record?.receiptNumber,
      receiptCollects: record?.receiptCollects,
      shopName: record?.shopName,
      shopCategory: record?.shopCategory,
      subShopCategory: record?.subShopCategory,
      merchantCategory: record?.merchantCategory,
      merchantTag: record?.merchantTag,
      customerId: record?.customerId,
      vizNumber: record?.vizNumber,
      mCardNo: record?.mCardNo,
      phoneNumber: record?.phoneNumber,
      paymentMethod: record?.paymentMethod,
      bankName: record?.bankName,
      spendingAmount: record?.spendingAmount,
      remark: record?.remark,
      receiptStatus: record?.receiptStatus,
      receiptCancelReason: record?.receiptCancelReason,
      receiptCancelRemark: record?.receiptCancelRemark,
      receiptCreateDate: FormatDateTimeAndShotEng(record?.receiptCreateDate),
      receiptCreateBy: record?.receiptCreateBy,
    };
  });

  return { dataExcel, headerExcel };
};

// =-=-=-=-=-=-=-=-=-= Param =-=-=-=-=-=-=-=-=

export const paramsReportCondition = (report: RedemptionTransactionConditionFormType, campaignList: any[]) => {
  let campaignId = '';
  if (report?.campaignName) {
    campaignId = campaignList?.find((i: any) => i?.campaignName === report?.campaignName)?.campaignId;
  }
  return {
    building: report?.building.join(','),
    redemptionDateFrom: report?.redemptionDateFrom,
    redemptionDateTo: report?.redemptionDateTo,
    ...(report?.campaignType && { campaignType: report?.campaignType }),
    ...(campaignId ? { campaignId } : report?.campaignName && { campaignName: report?.campaignName }),
    ...(report?.redemptionStatus && { redemptionStatus: report?.redemptionStatus }),
  };
};

export const paramsReportReceipt = (report: RedemptionTransactionReceiptFormType, campaignList: any[]) => {
  let campaignId = '';
  if (report?.campaignName) {
    campaignId = campaignList?.find((i: any) => i?.campaignName === report?.campaignName)?.campaignId;
  }
  return {
    building: report?.building.join(','),
    ...(report?.dateType === DateTypeReportEnum?.REDEMPTION_DATE && {
      redemptionDateFrom: report?.redemptionDateFrom,
      redemptionDateTo: report?.redemptionDateTo,
    }),
    ...(report?.dateType === DateTypeReportEnum?.RECEIPT_DATE && {
      receiptDateFrom: report?.receiptDateFrom,
      receiptDateTo: report?.receiptDateTo,
    }),
    ...(report?.campaignType && { campaignType: report?.campaignType }),
    ...(campaignId ? { campaignId } : report?.campaignName && { campaignName: report?.campaignName }),
    ...(report?.redemptionStatus && { redemptionStatus: report?.redemptionStatus }),
    ...(report?.ruleId && { ruleId: report?.ruleId }),
  };
};

export const paramsReportSummary = (report: SummaryRedemptionRewardFormType, campaignList: any[]) => {
  let campaignId = '';
  if (report?.campaignName) {
    campaignId = campaignList?.find((i: any) => i?.campaignName === report?.campaignName)?.campaignId;
  }
  return {
    building: report?.building.join(','),
    campaignDateFrom: report?.campaignDateFrom,
    campaignDateTo: report?.campaignDateTo,
    ...(campaignId ? { campaignId } : report?.campaignName && { campaignName: report?.campaignName }),
    ...(report?.conditionGroupName && { conditionGroupName: report?.conditionGroupName }),
    ...(report?.rewardType && { rewardType: report?.rewardType }),
    ...(report?.rewardName && { rewardName: report?.rewardName }),
  };
};

export const paramsReportBank = (report: BankPromotionFormType, campaignList: any[]) => {
  let campaignId = '';
  if (report?.campaignName) {
    campaignId = campaignList?.find((i: any) => i?.campaignName === report?.campaignName)?.campaignId;
  }
  return {
    building: report?.building.join(','),
    ...(report?.dateType === DateTypeReportEnum?.REDEMPTION_DATE && {
      redemptionDateFrom: report?.redemptionDateFrom,
      redemptionDateTo: report?.redemptionDateTo,
    }),
    ...(report?.dateType === DateTypeReportEnum?.RECEIPT_DATE && {
      receiptDateFrom: report?.receiptDateFrom,
      receiptDateTo: report?.receiptDateTo,
    }),
    ...(campaignId ? { campaignId } : report?.campaignName && { campaignName: report?.campaignName }),
    ...(report?.conditionGroupName && { conditionGroupName: report?.conditionGroupName }),
  };
};

export const transformCampaignName = (campaignList: any[]) => {
  return campaignList?.map((i) => i?.campaignName);
};

export const queryParamForGetReceiptTxnReport = (
  filterForm: ReceiptTransactionReportFormType
): QueryParamForGetTxnReportInterface => {
  return {
    buildingCodeStrList: filterForm.buildingCode?.join(',') || undefined,
    receiptDateStringFrom: filterForm.receiptDateStringFrom || '',
    receiptDateStringTo: filterForm.receiptDateStringTo || '',
    ...(filterForm?.receiptStatus && { receiptStatus: filterForm?.receiptStatus }),
    ...(filterForm?.isVizCollect && { isVizCollect: 'true' }),
    ...(filterForm?.isPlatinumCollect && { isPlatinumCollect: 'true' }),
    ...(filterForm?.isRedemption && { isRedemption: 'true' }),
  };
};
