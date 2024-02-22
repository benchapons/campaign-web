import { FormStatusEnum, SpendingTypeEnum, StatusCampaignEnum, WeeklyTypeEnum } from '@/constants/enum';
import { OptionsDropdown } from './event.interface';
import { QuotaRewardFormType, RewardFormType } from './reward.type';

export interface CampaignInfoForm {
  _id?: string;
  campaignCode?: string;
  campaignName: string;
  campaignDesc: string;
  conditionDetail: string;
  campaignObjective: string;
  campaignStartDate: string | null;
  campaignEndDate: string | null;
  campaignCost: number | null;
  campaignBudget: number | null;
  targetSegment: string;
  spendingChannels: string[];
  campaignStatus: string;
}

export interface CriteriaCustomerQuota {
  _id?: string;
  daily: CheckedValue;
  all: CheckedValue;
}

export interface CriteriaCampaignQuota extends QuotaRewardFormType {
  _id?: string;
  redeemed: number | null;
}

export interface CriteriaSpendingConditionsReward extends RewardFormType {
  _id?: string;
  isRewardSharing: boolean;
  isExpand: boolean;
  quotaPerReward: CriteriaCampaignQuota;
  rewardList: OptionsDropdown[];
}

export interface CriteriaSpendingConditions {
  _id?: string;
  isExpand: boolean;
  conditionDesc: string[];
  minSpendingAmount: number | null;
  maxSpendingAmount: number | null;
  rewards: CriteriaSpendingConditionsReward[];
  sharedRewardIds: string[];
}

export interface CampaignCriteriaForm {
  _id?: string;
  isExpand: boolean;
  campaignType: string;
  bankNames: string[];
  isExtraCondition: boolean;
  conditionGroup: string;
  spendingType: SpendingTypeEnum;
  building: string[];
  buildingOther: CheckedValue;
  customerQuota: CriteriaCustomerQuota;
  spendingConditions: CriteriaSpendingConditions[];
  brand: string;
}

export interface CheckedValue {
  isChecked: boolean;
  value: number | null;
}

// =-=-=-=-=-=-=-=-=-=-= Response by Service Campaign =-=-=-=-=-=-=-=-=-=-=

export interface ResByServiceCampaignType {
  _id: string;
  campaignCode: string;
  campaignName: string;
  campaignDesc: string;
  conditionDetail: string;
  campaignObjective: string;
  campaignStartDate: string | null;
  campaignEndDate: string | null;
  campaignCost: number | null;
  campaignBudget: number | null;
  targetSegment: string;
  spendingChannels: string[];
  campaignStatus: StatusCampaignEnum;
  formStatus: FormStatusEnum;
  campaignConditions: ConditionResByServiceCampaignType[];
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  dailyUsage: any[];
  weeklyUsage: any[];
  monthUsage: any[];
  customerQuotaDaily: any[];
  customerQuotaAll: any[];
}

export interface ConditionResByServiceCampaignType {
  _id: string;
  campaignType: string;
  isExtraCondition: boolean;
  conditionGroup: string;
  spendingType: SpendingTypeEnum;
  building: string[];
  spendingConditions: SpendingConditionsResByServiceCampaignType[];
  customerQuota: CustomerQuotaResByServiceCampaignType;
  brand: string;
}

export interface CustomerQuotaResByServiceCampaignType {
  daily: number | null;
  all: number | null;
  spending: number | null;
}

export interface SpendingConditionsResByServiceCampaignType {
  _id: string;
  conditionDesc: string[];
  minSpendingAmount: number | null;
  maxSpendingAmount: number | null;
  sharedRewardIds: string[];
  rewards: RewardResByServiceCampaignType[];
}

export interface RewardResByServiceCampaignType {
  _id: string;
  isRequiredReferenceCode: boolean;
  isRewardSharing: boolean;
  rewardType: string;
  rewardName: string;
  ruleId: string;
  customTriggerId: string;
  voucherRewardId: string;
  rewardValue: number | null;
  totalRewardQty: number | null;
  totalRewardValue: number | null;
  spendingXBath: number | null;
  qtyPerRedemption: number | null;
  totalRedeemed: number | null;
  quotaPerReward: QuotaPerRewardResByServiceCampaignType;
}

export interface QuotaPerRewardResByServiceCampaignType {
  _id: string;
  daily: number | null;
  monthly: number | null;
  redeemed: number | null;
  weekly: WeeklyResByServiceCampaignType;
}

export interface WeeklyResByServiceCampaignType {
  weekType: WeeklyTypeEnum | null;
  weekDays: WeekDaysResByServiceCampaignType[];
}

export interface WeekDaysResByServiceCampaignType {
  amount: number | null;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

// =-=-=-=-=-=-=-=-=-=-= Payload Campaign =-=-=-=-=-=-=-=-=-=-=

export interface PayloadUpdateCampaignType {
  campaignName: string;
  campaignDesc: string;
  conditionDetail: string;
  campaignObjective: string;
  campaignStartDate: string | null;
  campaignEndDate: string | null;
  campaignCost: number | null;
  campaignBudget: number | null;
  targetSegment: string;
  campaignStatus: string;
  spendingChannels: string[];
  campaignConditions: CampaignConditionsPayloadUpdateCampaignType[];
  // updatedBy: string;
  // userId: string;
}

export interface CampaignConditionsPayloadUpdateCampaignType {
  _id: string;
  campaignType: string;
  isExtraCondition: boolean;
  conditionGroup: string;
  spendingType: SpendingTypeEnum;
  building: string[];
  brand: string;
  customerQuota: CustomerQuotaPayloadUpdateCampaignType;
  spendingConditions: SpendingConditionsPayloadUpdateCampaignType[];
}

export interface CustomerQuotaPayloadUpdateCampaignType {
  daily: number | null;
  all: number | null;
}

export interface SpendingConditionsPayloadUpdateCampaignType {
  conditionDesc: string[];
  minSpendingAmount: number | null;
  maxSpendingAmount: number | null;
  rewards: RewardPayloadUpdateCampaignType[];
  sharedRewardIds: string[];
}

export interface RewardPayloadUpdateCampaignType {
  _id: string;
  rewardType: string;
  isRequiredReferenceCode: boolean;
  rewardName: string;
  ruleId: string;
  customTriggerId: string;
  voucherRewardId: string;
  spendingXBath: number | null;
  qtyPerRedemption: number | null;
  rewardValue: number | null;
  totalRewardQty: number | null;
  totalRewardValue: number | null;
  quotaPerReward: QuotaPerRewardPayloadUpdateCampaignType;
}

export interface QuotaPerRewardPayloadUpdateCampaignType {
  daily: number | null;
  monthly: number | null;
  weekly: WeeklyPayloadUpdateCampaignType;
}

export interface WeeklyPayloadUpdateCampaignType {
  weekType: WeeklyTypeEnum | null;
  weekDays: WeekDaysPayloadUpdateCampaignType[];
}

export interface WeekDaysPayloadUpdateCampaignType {
  _id: string;
  amount: number | null;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-= Create =-=-=-=-=-=-=-=-=-=-=-=-=-=
export interface RewardPayloadCreateType {
  rewardType: string;
  isRequiredReferenceCode: boolean;
  rewardName: string;
  ruleId: string;
  customTriggerId: string;
  voucherRewardId: string;
  spendingXBath: number | null;
  qtyPerRedemption: number | null;
  rewardValue: number | null;
  totalRewardQty: number | null;
  totalRewardValue: number | null;
  quotaPerReward: QuotaPerRewardPayloadCreateType;
}

interface QuotaPerRewardPayloadCreateType {
  daily: number | null;
  monthly: number | null;
  weekly: WeeklyPayloadCreateType;
}

interface WeeklyPayloadCreateType {
  weekType: WeeklyTypeEnum | null;
  weekDays: WeekDaysPayloadCreateType[];
}

interface WeekDaysPayloadCreateType {
  amount: number | null;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

export interface StatusCampaignForm {
  formStatus: FormStatusEnum | '';
  campaignStarting: boolean;
  campaignEnded: boolean;
}

export interface RewardPayloadCreateWithIdType {
  _id?: string;
  rewardType: string;
  isRequiredReferenceCode: boolean;
  rewardName: string;
  ruleId: string;
  customTriggerId: string;
  voucherRewardId: string;
  spendingXBath: number | null;
  qtyPerRedemption: number | null;
  rewardValue: number | null;
  totalRewardQty: number | null;
  totalRewardValue: number | null;
  quotaPerReward: QuotaPerRewardPayloadCreateWithIdType;
}

interface QuotaPerRewardPayloadCreateWithIdType {
  daily: number | null;
  monthly: number | null;
  weekly: WeeklyPayloadCreateWithIdType;
}

interface WeeklyPayloadCreateWithIdType {
  weekType: WeeklyTypeEnum | null;
  weekDays: WeekDaysPayloadCreateWithIdType[];
}

interface WeekDaysPayloadCreateWithIdType {
  _id: string;
  amount: number | null;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}
