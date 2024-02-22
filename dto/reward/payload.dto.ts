import { PayloadRewardType, RewardFormType } from '@/types/reward.type';
import { transformPayloadWeekly, transformPayloadWeeklyUpdateSpecial } from '../global.dto';

export const transformPayloadUpdateSpecialReward = (reward: RewardFormType) => ({
  rewardName: reward?.rewardName,
  quotaPerReward: {
    daily: reward?.quotaPerReward?.daily?.value ? Number(reward?.quotaPerReward?.daily?.value) : null,
    weekly: {
      weekType: reward?.quotaPerReward?.weekly?.weekType,
      weekDays: transformPayloadWeeklyUpdateSpecial(reward?.quotaPerReward?.weekly),
    },
    monthly: reward?.quotaPerReward?.monthly?.value ? Number(reward?.quotaPerReward?.monthly?.value) : null,
  },
});

export const transformPayloadReward = (reward: RewardFormType): PayloadRewardType => ({
  isRequiredReferenceCode: reward?.isRequiredReferenceCode,
  rewardType: reward?.rewardType,
  rewardName: reward?.rewardName,
  spendingXBath: reward?.spendingXBath || null,
  qtyPerRedemption: reward?.qtyPerRedemption,
  totalRewardQty: reward?.totalRewardQty,
  rewardValue: reward?.rewardValue,
  totalRewardValue: reward?.totalRewardValue,
  ruleId: reward?.ruleId,
  customTriggerId: reward?.customTriggerId,
  voucherRewardId: reward?.voucherRewardId,
  quotaPerReward: {
    daily: reward?.quotaPerReward?.daily?.value ? Number(reward?.quotaPerReward?.daily?.value) : null,
    monthly: reward?.quotaPerReward?.monthly?.value ? Number(reward?.quotaPerReward?.monthly?.value) : null,
    weekly: {
      weekType: reward?.quotaPerReward?.weekly?.weekType,
      weekDays: transformPayloadWeekly(reward?.quotaPerReward?.weekly),
    },
  },
});
