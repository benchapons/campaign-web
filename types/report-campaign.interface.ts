export interface QueryParamForGetTxnReportInterface {
  buildingCodeStrList: string | undefined;
  receiptDateStringFrom: string;
  receiptDateStringTo: string;
  receiptStatus?: string;
  isRedemption?: string;
  isVizCollect?: string;
  isPlatinumCollect?: string;
}

export interface ReceiptTxnReportResponseInterface {
  receiptBuildingName: string;
  receiptDateString: string;
  receiptNumber: string;
  receiptCollects: string;
  shopName: string;
  shopCategory: string;
  subShopCategory: string;
  merchantCategory: string;
  merchantTag: string;
  customerId: string;
  vizNumber: string;
  mCardNo: string;
  phoneNumber: string;
  paymentMethod: string;
  bankName: string;
  saleSlipAmount: number;
  spendingAmount: number;
  remark: string;
  receiptStatus: string;
  receiptCancelReason: string;
  receiptCancelRemark: string;
  receiptCreateDate: Date;
  receiptCreateBy: string;
  requestByUserId: string;
  requestByUserName: string;
}

export interface ResponseBffReceiptTxnReportInterface {
  success: boolean;
  data: ReceiptTxnReportResponseInterface[];
  credentialExcelForDecrypt: string;
}

export interface RedemptionTxnByReceiptReportInterface {
  campaignId: string;
  redemptionId: string;
  campaignName: string;
  conditionGroupName: string;
  campaignType: string;
  building: string[];
  rewardId: string;
  rewardName: string;
  rewardType: string;
  rewardValue: number;
  customerId: string;
  vizNo: string;
  saleSlipAmount: number;
  spendingAmount: number;
  phoneNumber: string;
  redemptionDate: string;
  redemptionStatus: string;
  ruleId: string;
  createdBy: string;
  referenceCode: string | null;
  redemptionCancelReason: string;
  redemptionCancelDate: string | null;
  redemptionRemark: string;
  receiptId: string;
  shopName: string;
  merchantCategories: string | null;
  merchantTag: string | null;
  receiptNo: string;
  receiptDate: string;
  receiptBuilding: string;
  paymentMethod: string;
  bankName: string;
  receiptStatus: string;
  receiptCancelReason: string;
  receiptCancelRemark: string;
  receiptCancelDate: string | null;
  notes: string;
  receiptAmount: number;
  shopCategory: string;
  subShopCategory: string;
}
