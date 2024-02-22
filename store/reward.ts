import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';
import { v4 as uuidv4 } from 'uuid';

import { DaysFormType, QuotaRewardFormType, RewardFormType, WeekDaysQuotaRewardFormType } from '@/types/reward.type';
import { CheckedWeekDaysType } from '@/types/global.type';

const { persistAtom } = recoilPersist();

export const initCheckedDays: CheckedWeekDaysType = {
  monday: false,
  tuesday: false,
  wednesday: false,
  thursday: false,
  friday: false,
  saturday: false,
  sunday: false,
};

export const initDays: DaysFormType[] = [
  {
    order: 1,
    name: 'monday',
    isChecked: false,
    label: 'จันทร์',
    disabled: false,
  },
  {
    order: 2,
    name: 'tuesday',
    isChecked: false,
    label: 'อังคาร',
    disabled: false,
  },
  {
    order: 3,
    name: 'wednesday',
    isChecked: false,
    label: 'พุธ',
    disabled: false,
  },
  {
    order: 4,
    name: 'thursday',
    isChecked: false,
    label: 'พฤหัสบดี',
    disabled: false,
  },
  {
    order: 5,
    name: 'friday',
    isChecked: false,
    label: 'ศุกร์',
    disabled: false,
  },
  {
    order: 6,
    name: 'saturday',
    isChecked: false,
    label: 'เสาร์',
    disabled: false,
  },
  {
    order: 7,
    name: 'sunday',
    isChecked: false,
    label: 'อาทิตย์',
    disabled: false,
  },
];

export const initWeekDay: WeekDaysQuotaRewardFormType = {
  _id: uuidv4(),
  isChecked: true,
  amount: null,
  days: initDays,
};

export const initQuotaPerReward: QuotaRewardFormType = {
  daily: { isChecked: false, value: null },
  weekly: {
    isChecked: false,
    weekType: null, // WeeklyTypeEnum
    startAmount: null,
    weekDays: [initWeekDay],
    checked: initCheckedDays,
  },
  monthly: { isChecked: false, value: null },
};

export const initRewardFormStore: RewardFormType = {
  _id: '',
  rewardType: '',
  rewardName: '',
  isRequiredReferenceCode: false,
  ruleId: '',
  customTriggerId: '',
  voucherRewardId: '',
  spendingXBath: null,
  qtyPerRedemption: null,
  rewardValue: null,
  totalRewardQty: null,
  totalRewardValue: null,
  quotaPerReward: initQuotaPerReward,
};

export const rewardStore = atom({
  key: 'rewardForm',
  default: initRewardFormStore as RewardFormType,
  effects_UNSTABLE: [persistAtom],
});
