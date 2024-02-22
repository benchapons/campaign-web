import { validate as uuidValidate } from 'uuid';
import { WeeklyTypeEnum } from '@/constants/enum';
import { building } from '@/constants/global';
import { WeekDaysPayloadUpdateCampaignType } from '@/types/campaign.type';
import { DaysFormType, WeekDaysPayloadRewardType } from '@/types/reward.type';

export const transformPayloadWeeklyUpdateSpecial = (weekly: any) => {
  return weekly?.weekDays?.reduce((acc: WeekDaysPayloadUpdateCampaignType[], cur: any) => {
    if (cur?.isChecked) {
      acc.push({
        ...(cur?._id && !uuidValidate(cur?._id) && { _id: cur?._id }),
        amount: weekly?.weekType === WeeklyTypeEnum?.CAMPAIGN_STARTING ? weekly?.startAmount : cur?.amount,
        monday: cur?.days?.find((i: DaysFormType) => i?.name === 'monday')?.isChecked,
        tuesday: cur?.days?.find((i: DaysFormType) => i?.name === 'tuesday')?.isChecked,
        wednesday: cur?.days?.find((i: DaysFormType) => i?.name === 'wednesday')?.isChecked,
        thursday: cur?.days?.find((i: DaysFormType) => i?.name === 'thursday')?.isChecked,
        friday: cur?.days?.find((i: DaysFormType) => i?.name === 'friday')?.isChecked,
        saturday: cur?.days?.find((i: DaysFormType) => i?.name === 'saturday')?.isChecked,
        sunday: cur?.days?.find((i: DaysFormType) => i?.name === 'sunday')?.isChecked,
      });
    }
    return acc;
  }, []);
};

export const transformPayloadWeekly = (weekly: any) => {
  if (weekly?.weekType === WeeklyTypeEnum?.WEEKDAY) {
    return weekly?.weekDays?.reduce((acc: WeekDaysPayloadRewardType[], cur: any) => {
      if (cur?.isChecked) {
        acc.push({
          amount: cur?.amount,
          monday: cur?.days?.find((i: DaysFormType) => i?.name === 'monday')?.isChecked,
          tuesday: cur?.days?.find((i: DaysFormType) => i?.name === 'tuesday')?.isChecked,
          wednesday: cur?.days?.find((i: DaysFormType) => i?.name === 'wednesday')?.isChecked,
          thursday: cur?.days?.find((i: DaysFormType) => i?.name === 'thursday')?.isChecked,
          friday: cur?.days?.find((i: DaysFormType) => i?.name === 'friday')?.isChecked,
          saturday: cur?.days?.find((i: DaysFormType) => i?.name === 'saturday')?.isChecked,
          sunday: cur?.days?.find((i: DaysFormType) => i?.name === 'sunday')?.isChecked,
        });
      }
      return acc;
    }, []);
  } else if (weekly?.weekType === WeeklyTypeEnum?.CAMPAIGN_STARTING) {
    return [
      {
        amount: weekly?.startAmount,
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true,
        sunday: true,
      },
    ];
  } else return [];
};

export const buildingWithComma = (data: string[]): string => {
  return data?.reduce((acc: string, cur: string) => {
    if (acc) {
      return acc.concat(`, ${building?.[cur] ? building?.[cur] : cur}`);
    }
    return acc.concat(building[cur] ? building[cur] : cur);
  }, '');
};
