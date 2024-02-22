import { WeeklyTypeEnum } from '@/constants/enum';
import { CheckedWeekDaysType } from './global.type';

type NameOfDays = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

// =-=-=-=-=-=-=-== Form =-=-=-=-=-=-=-==
export interface RewardFormType {
  _id?: string;
  isCampaignStarted?: boolean;
  isRequiredReferenceCode: boolean;
  rewardType: string;
  ruleId: string;
  customTriggerId: string;
  voucherRewardId: string;
  rewardName: string;
  spendingXBath: number | null;
  qtyPerRedemption: number | null;
  totalRewardQty: number | null;
  rewardValue: number | null;
  totalRewardValue: number | null;
  rewardList?: any[];
  quotaPerReward: QuotaRewardFormType;
}

export interface QuotaRewardFormType {
  daily: CheckedValue;
  weekly: WeeklyQuotaRewardFormType;
  monthly: CheckedValue;
}

export interface WeeklyQuotaRewardFormType {
  isChecked: boolean;
  weekType: WeeklyTypeEnum | null;
  startAmount: number | null;
  weekDays: WeekDaysQuotaRewardFormType[];
  checked: CheckedWeekDaysType;
}

export interface WeekDaysQuotaRewardFormType {
  _id?: string;
  isChecked: boolean;
  amount: number | null;
  days: DaysFormType[];
}
export interface DaysFormType {
  name: NameOfDays;
  isChecked: boolean;
  label: string;
  disabled: boolean;
  order: number;
}

// =-=-=-=-=-=-=-== Payload =-=-=-=-=-=-=-==

export interface WeekDaysQuotaRewardPayloadType {
  _id?: string;
  amount: number | null;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}
export interface CheckedValue {
  isChecked: boolean;
  value: string | number | null;
}

export interface ResByServiceRewardWeekDaysType {
  _id?: string;
  amount: number | null;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

export interface ResByServiceRewardType {
  _id: string;
  rewardType: string;
  isRequiredReferenceCode: false;
  ruleId: string;
  customTriggerId: string;
  voucherRewardId: string;
  rewardName: string;
  spendingXBath: number | null;
  qtyPerRedemption: number | null;
  rewardValue: number | null;
  totalRewardValue: number | null;
  totalRewardQty: number | null;
  quotaPerReward: {
    daily: number | null;
    weekly: {
      weekType: null;
      weekDays: ResByServiceRewardWeekDaysType[];
      _id: string;
    };
    monthly: number | null;
    redeemed: number | null;
    _id: string;
  };
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface TransformResponseRewardType {
  _id: string;
  rewardType: string;
  isRequiredReferenceCode: false;
  ruleId: string;
  customTriggerId: string;
  rewardName: string;
  spendingXBath: number | null;
  qtyPerRedemption: number | null;
  rewardValue: number | null;
  totalRewardValue: number | null;
  totalRewardQty: number | null;
  quotaPerReward: WeeklyQuotaRewardFormType;
}

// =-=-=-=-=-=-=-== Payload =-=-=-=-=-=-=-==

export interface PayloadRewardType {
  isRequiredReferenceCode: boolean;
  rewardType: string;
  rewardName: string;
  spendingXBath: number | null;
  qtyPerRedemption: number | null;
  totalRewardQty: number | null;
  rewardValue: number | null;
  totalRewardValue: number | null;
  ruleId: string;
  customTriggerId: string;
  voucherRewardId: string;
  quotaPerReward: QuotaPayloadRewardType;
}

export interface WeekDaysPayloadRewardType {
  _id?: string;
  amount: number | null;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

export interface WeeklyPayloadRewardType {
  weekType: WeeklyTypeEnum | null;
  weekDays: WeekDaysPayloadRewardType[];
}

export interface QuotaPayloadRewardType {
  daily: number | null;
  monthly: number | null;
  weekly: WeeklyPayloadRewardType;
}

export interface RewardAdjustForm {
  _id: string;
  isRewardSharing: boolean;
  rewardType: string;
  rewardName: string;
  rewardValue: number | null;
  totalRewardValue: number | null;
  totalRewardQty: number | null;
  totalRedeemed: number | null;
}

export interface AdjustmentRewardFormType {
  rewardAdjustmentType: string;
  quantity: number | null;
  remark: string;
}

export interface rewardListType {
  _id: string;
  name: string;
  quantity: string;
  value: string;
  type: string;
  modifyName: string;
  modifyDate: string;
}
