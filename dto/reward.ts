import { FormStatusEnum, SpendingTypeEnum, WeeklyTypeEnum } from '@/constants/enum';
import {
  DaysFormType,
  ResByServiceRewardType,
  ResByServiceRewardWeekDaysType,
  RewardFormType,
  WeekDaysQuotaRewardFormType,
} from '@/types/reward.type';
import { checkDateBetween, numberWithCommas } from '@/utilities/format';
import { initCheckedDays, initDays } from '@/store/reward';
import { days, rewardType } from '@/constants/global';
import { CheckedWeekDaysType } from '@/types/global.type';
import { buildingWithComma } from './global.dto';

interface CampaignList {
  isStarted: boolean;
  name: string;
  conditionGroupName: string;
  building: string;
  condition: string;
}

export const transformCampaignList = (campaignList: any[]) => {
  const result = campaignList?.reduce((acc: CampaignList[], cur) => {
    if (cur?.campaignConditions?.length) {
      cur?.campaignConditions?.forEach((el: any) => {
        el?.spendingConditions?.forEach((i: any) => {
          acc?.push({
            name: cur?.campaignName,
            conditionGroupName: el?.conditionGroup,
            building: buildingWithComma(el?.building),
            condition: i?.conditionDesc,
            isStarted:
              cur?.formStatus === FormStatusEnum?.SUBMITTED
                ? checkDateBetween(cur?.campaignStartDate, cur?.campaignEndDate)
                : false,
          });
        });
      });
    }
    return acc;
  }, []);
  return result;
};

export const transformRewardTracking = (reward: any) => {
  const result = reward?.campaignConditions?.reduce((acc: any, cur: any) => {
    cur?.spendingConditions?.forEach((condition: any) => {
      if (condition?.rewards?.length) {
        condition?.rewards?.forEach((reward: any) => {
          const dailyTotal = reward?.quotaPerReward?.daily?.amount
            ? numberWithCommas(reward?.quotaPerReward?.daily?.amount || 0)
            : '-';
          const dailyBalance = reward?.quotaPerReward?.daily?.amount
            ? numberWithCommas(reward?.quotaPerReward?.daily?.amount - (reward?.quotaPerReward?.daily?.used || 0))
            : '-';

          const monthlyTotal = reward?.quotaPerReward?.monthly?.amount
            ? numberWithCommas(reward?.quotaPerReward?.monthly?.amount || 0)
            : '-';
          const monthlyBalance = reward?.quotaPerReward?.monthly?.amount
            ? numberWithCommas(reward?.quotaPerReward?.monthly?.amount - (reward?.quotaPerReward?.monthly?.used || 0))
            : '-';

          const totalBalance = numberWithCommas(reward?.totalRewardQty - reward?.totalRedeemed);
          const newReward = {
            conditionId: cur?._id,
            building: buildingWithComma(cur?.building),
            conditionName: cur?.conditionGroup,
            spending:
              cur?.spendingType === SpendingTypeEnum?.TIER
                ? `${numberWithCommas(condition?.minSpendingAmount || 0)} - ${numberWithCommas(
                    condition?.maxSpendingAmount || 0
                  )}`
                : numberWithCommas(condition?.minSpendingAmount || 0),
            type: rewardType?.[reward?.rewardType],
            rewardName: reward?.rewardName,
            daily: `${dailyBalance}/${dailyTotal}`,
            monthly: `${monthlyBalance}/${monthlyTotal}`,
            totalQuantity: `${totalBalance}/${numberWithCommas(reward?.totalRewardQty || 0)}`,
          };
          if (!reward?.quotaPerReward?.weekly?.weekType) {
            acc?.push({
              ...newReward,
              weekly: '-/-',
              weekdays: '-/-',
            });
          } else {
            if (reward?.quotaPerReward?.weekly?.weekType === WeeklyTypeEnum?.CAMPAIGN_STARTING) {
              reward?.quotaPerReward?.weekly?.weekDay?.forEach((day: any, index: number) => {
                const weekBalance = numberWithCommas(day?.amount - (day?.used || 0));
                acc?.push({
                  ...newReward,
                  weekly: `${weekBalance}/${numberWithCommas(day?.amount || 0)}`,
                  weekdays: '-/-',
                });
              });
            } else {
              let mapWeekdays = {
                ...newReward,
                weekly: '-/-',
                weekdays: '',
              };

              reward?.quotaPerReward?.weekly?.weekDay?.forEach((day: any, index: number) => {
                const weekBalance = numberWithCommas(day?.amount - (day?.used || 0));
                const weekdays = `รูปแบบที่ ${index + 1} ${day?.monday ? `${days?.monday},` : ''} ${
                  day?.tuesday ? `${days?.tuesday},` : ''
                } ${day?.wednesday ? `${days?.wednesday},` : ''} ${day?.thursday ? `${days?.thursday},` : ''} ${
                  day?.friday ? `${days?.friday},` : ''
                } ${day?.saturday ? `${days?.saturday},` : ''} ${
                  day?.sunday ? days?.sunday : ''
                } ${weekBalance}/${numberWithCommas(day?.amount || 0)}`;
                if (mapWeekdays?.weekdays) {
                  mapWeekdays = {
                    ...mapWeekdays,
                    weekdays: `${mapWeekdays?.weekdays}\n ${weekdays}`,
                  };
                } else {
                  mapWeekdays = {
                    ...newReward,
                    weekly: '-/-',
                    weekdays: weekdays,
                  };
                }
              });
              acc?.push(mapWeekdays);
            }
          }
        });
      }
    });
    return acc;
  }, []);
  return result;
};

// =-=-=-=-=-=-=-== Reward Form =-=-=-=-=-=-=-==

export const transformChecked = (weekdays: ResByServiceRewardWeekDaysType[]): CheckedWeekDaysType => {
  let initChecked: any = initCheckedDays;
  weekdays.forEach((element: any) => {
    Object.keys(initChecked)?.forEach((name) => {
      initChecked = {
        ...initChecked,
        [name]: initChecked?.[name] || element?.[name],
      };
    });
  });

  return initChecked;
};

export const transformWeekDays = (weekdays: ResByServiceRewardWeekDaysType[]): WeekDaysQuotaRewardFormType[] => {
  const checked: any = transformChecked(weekdays);

  return weekdays?.map((i: any) => ({
    _id: i?._id,
    isChecked: true,
    amount: i?.amount,
    days: initDays?.map((day: DaysFormType) => ({
      ...day,
      isChecked: i?.[day?.name],
      disabled: i?.[day?.name] ? false : checked?.[day?.name],
    })),
  }));
};

export const transformResponseToRewardForm = (res: ResByServiceRewardType): RewardFormType => ({
  _id: res?._id,
  isRequiredReferenceCode: res?.isRequiredReferenceCode,
  rewardType: res?.rewardType,
  rewardName: res?.rewardName,
  spendingXBath: res?.spendingXBath,
  qtyPerRedemption: res?.qtyPerRedemption,
  totalRewardQty: res?.totalRewardQty,
  rewardValue: res?.rewardValue,
  totalRewardValue: res?.totalRewardQty && res?.rewardValue ? res?.totalRewardQty * res?.rewardValue : null,
  ruleId: res?.ruleId,
  customTriggerId: res?.customTriggerId,
  voucherRewardId: res?.voucherRewardId,
  rewardList: [],
  quotaPerReward: {
    daily: { isChecked: !!res?.quotaPerReward?.daily, value: res?.quotaPerReward?.daily },
    weekly: {
      isChecked:
        res?.quotaPerReward?.weekly?.weekType === WeeklyTypeEnum?.WEEKDAY ||
        res?.quotaPerReward?.weekly?.weekType === WeeklyTypeEnum?.CAMPAIGN_STARTING,
      weekType: res?.quotaPerReward?.weekly?.weekType,
      startAmount:
        res?.quotaPerReward?.weekly?.weekType === WeeklyTypeEnum?.CAMPAIGN_STARTING
          ? res?.quotaPerReward?.weekly?.weekDays?.[0]?.amount
          : null,
      weekDays:
        res?.quotaPerReward?.weekly?.weekType === WeeklyTypeEnum?.WEEKDAY
          ? transformWeekDays(res?.quotaPerReward?.weekly?.weekDays)
          : [],
      checked: res?.quotaPerReward?.weekly?.weekType
        ? transformChecked(res?.quotaPerReward?.weekly?.weekDays)
        : initCheckedDays,
    },
    monthly: { isChecked: !!res?.quotaPerReward?.monthly, value: res?.quotaPerReward?.monthly },
  },
});

//edit reward master
export const transformResponseToRewardFormStore = (res: ResByServiceRewardType): RewardFormType => ({
  _id: res?._id,
  isRequiredReferenceCode: res?.isRequiredReferenceCode,
  rewardType: res?.rewardType,
  rewardName: res?.rewardName,
  spendingXBath: res?.spendingXBath,
  qtyPerRedemption: res?.qtyPerRedemption,
  totalRewardQty: res?.totalRewardQty,
  rewardValue: res?.rewardValue,
  totalRewardValue: res?.totalRewardQty && res?.rewardValue ? res?.totalRewardQty * res?.rewardValue : null,
  ruleId: res?.ruleId,
  customTriggerId: res?.customTriggerId,
  voucherRewardId: res?.voucherRewardId,
  rewardList: [],
  quotaPerReward: {
    daily: { isChecked: !!res?.quotaPerReward?.daily, value: res?.quotaPerReward?.daily },
    weekly: {
      isChecked:
        res?.quotaPerReward?.weekly?.weekType === WeeklyTypeEnum?.WEEKDAY ||
        res?.quotaPerReward?.weekly?.weekType === WeeklyTypeEnum?.CAMPAIGN_STARTING,
      weekType: res?.quotaPerReward?.weekly?.weekType,
      startAmount:
        res?.quotaPerReward?.weekly?.weekType === WeeklyTypeEnum?.CAMPAIGN_STARTING
          ? res?.quotaPerReward?.weekly?.weekDays?.[0]?.amount
          : null,
      weekDays: transformWeekDays(res?.quotaPerReward?.weekly?.weekDays),
      checked: res?.quotaPerReward?.weekly?.weekType
        ? transformChecked(res?.quotaPerReward?.weekly?.weekDays)
        : initCheckedDays,
    },
    monthly: { isChecked: !!res?.quotaPerReward?.monthly, value: res?.quotaPerReward?.monthly },
  },
});
