import { DateTypeReportEnum } from '@/constants/enum';

export interface RedemptionTransactionConditionFormType {
  building: string[];
  campaignType: string;
  redemptionDateFrom: string | null;
  redemptionDateTo: string | null;
  campaignName: string;
  redemptionStatus: string;
}

export interface RedemptionTransactionReceiptFormType {
  building: string[];
  campaignType: string;
  redemptionDateFrom?: string | null;
  redemptionDateTo?: string | null;
  receiptDateFrom?: string | null;
  receiptDateTo?: string | null;
  campaignName: string;
  redemptionStatus: string;
  ruleId: string;
  dateType: DateTypeReportEnum | null;
}

export interface SummaryRedemptionRewardFormType {
  building: string[];
  campaignDateFrom: string | null;
  campaignDateTo: string | null;
  campaignName: string;
  conditionGroupName: string;
  rewardType: string;
  rewardName: string;
}

export interface BankPromotionFormType {
  building: string[];
  redemptionDateFrom?: string | null;
  redemptionDateTo?: string | null;
  receiptDateFrom?: string | null;
  receiptDateTo?: string | null;
  campaignName: string;
  conditionGroupName: string;
  dateType: DateTypeReportEnum | null;
}

export interface ReceiptTransactionReportFormType {
  buildingCode?: string[];
  receiptDateStringFrom?: string | null;
  receiptDateStringTo?: string | null;
  receiptStatus?: string;
  isRedemption?: boolean;
  isVizCollect?: boolean;
  isPlatinumCollect?: boolean;
}

export interface OperationReportFormType {
  campaignStartDate?: string | null;
  campaignEndDate?: string | null;
}

export interface CampaignForOperationReportFormType {
  selectCampaign?: string[];
}

export type GetReportRequestType = {
  requestByUserId?: string;
  reportType?: ReportTypeEnum;
  status?: StatusReportEnum;
  page: number;
  limit: number;
};

export enum StatusReportEnum {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
}

export enum ReportTypeEnum {
  RECEIPT_TRANSACTION_REPORT = 'receipt-transaction-report',
  REDEMPTION_TRANSACTION_CONDITION_REPORT = 'redemption-transaction-condition-report',
  REDEMPTION_TRANSACTION_RECEIPT_REPORT = 'redemption-transaction-receipt-report',
  SUMMARY_REDEMPTION_REWARD_REPORT = 'summary-redemption-reward-report',
  BANK_PROMOTION_REPORT = 'bank-promotion-report',
  OPERATION_REPORT = 'operation-report',
}

export type ResponseGetListReport<T> = {
  meta: Meta;
  results: ListReport<T>[];
};

export type Meta = {
  currentPage: number;
  limit: number;
  totalPage: number;
  totalData: number;
};

export type ListReport<T> = {
  _id: string;
  reportType: string;
  jobId: string;
  requestByUserId: string;
  requestByUserName: string;
  transactionId: string;
  transactionChannel: string;
  transactionTimestamp: string;
  payload: T;
  status: StatusReportEnum;
  recordCount: number;
  fileSizeInMegabytes: number;
  filePath: string;
  signedUrl: string;
  openAt: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

// export type Payload = {
//   requestByUserId: string
//   requestByUserName: string
//   buildingCodeStrList: string
//   receiptDateStringFrom: string
//   receiptDateStringTo: string
// }

export interface ResponsePostRequestReport<T> {
  requestMessageQueue: RequestMessageQueue;
  requestCreate: ListReport<T>;
}

export interface RequestMessageQueue {
  topicName: string;
  partition: number;
  errorCode: number;
  baseOffset: string;
  logAppendTime: string;
  logStartOffset: string;
}
