import { WeeklyTypeEnum } from '@/constants/enum';
import {
  CampaignCriteriaForm,
  CampaignInfoForm,
  ConditionResByServiceCampaignType,
  CriteriaSpendingConditions,
  CriteriaSpendingConditionsReward,
  PayloadUpdateCampaignType,
  ResByServiceCampaignType,
  RewardResByServiceCampaignType,
  SpendingConditionsResByServiceCampaignType,
  RewardPayloadUpdateCampaignType,
  WeekDaysPayloadUpdateCampaignType,
} from '@/types/campaign.type';
import { DaysFormType } from '@/types/reward.type';
import { transformChecked, transformWeekDays } from './reward';
import { initCheckedDays, initQuotaPerReward } from '@/store/reward';
import { initCampaignCriteriaForm, initRewardCriteriaForm, initSpendingCondition } from '@/store/campaign';
import { transformPayloadWeeklyUpdateSpecial } from './global.dto';
import { getRewardList } from '@/services/client/reward.service';

// =-=-=-=-=-=-=-=-=-=-=-=  Response to Campaign Form =-=-=-=-=-=-=-=-=-=-=-=

export const transformResToCampaignInfoForm = async (res: ResByServiceCampaignType): Promise<CampaignInfoForm> => {
  return {
    _id: res?._id,
    campaignCode: res?.campaignCode,
    campaignName: res?.campaignName,
    campaignDesc: res?.campaignDesc,
    conditionDetail: res?.conditionDetail,
    campaignObjective: res?.campaignObjective,
    campaignStartDate: res?.campaignStartDate ? res?.campaignStartDate?.slice(0, 10) : null,
    campaignEndDate: res?.campaignEndDate ? res?.campaignEndDate?.slice(0, 10) : null,
    campaignCost: res?.campaignCost,
    campaignBudget: res?.campaignBudget,
    targetSegment: res?.targetSegment,
    spendingChannels: res?.spendingChannels,
    campaignStatus: res?.campaignStatus,
    // campaignConditions: res?.campaignConditions
    // campaignConditions,
  };
};

interface ParamResToCampaignCriteriaForm {
  isFindRewardList: boolean;
  conditions: ConditionResByServiceCampaignType[];
  campaignId?: string;
}

export const transformResToCampaignCriteriaForm = async ({
  isFindRewardList,
  conditions,
  campaignId,
}: ParamResToCampaignCriteriaForm): Promise<CampaignCriteriaForm[]> => {
  if (conditions?.length) {
    return await Promise.all(
      conditions?.map(async (condition: any) => ({
        _id: condition?._id,
        isExpand: true,
        campaignType: condition?.campaignType,
        bankNames: condition?.bankNames || [],
        isExtraCondition: condition?.isExtraCondition,
        conditionGroup: condition?.conditionGroup,
        spendingType: condition?.spendingType,
        building: condition?.building?.filter(
          (building: string) =>
            building === '3001' ||
            building === '1001' ||
            building === '1002' ||
            building === '5001' ||
            building === '5031' ||
            building === '6001'
        ),
        brand: condition?.brand,
        buildingOther: {
          isChecked: condition?.building?.some(
            (building: string) =>
              building !== '3001' &&
              building !== '1001' &&
              building !== '1002' &&
              building !== '5001' &&
              building !== '5031' &&
              building !== '6001'
          ),
          value: condition?.building?.reduce((acc: string, cur: string) => {
            if (
              cur !== '3001' &&
              cur !== '1001' &&
              cur !== '1002' &&
              cur !== '5001' &&
              cur !== '5031' &&
              cur !== '6001'
            ) {
              acc = cur;
            }
            return acc;
          }, ''),
        },
        customerQuota: {
          daily: { isChecked: !!condition?.customerQuota?.daily, value: condition?.customerQuota?.daily },
          all: { isChecked: !!condition?.customerQuota?.all, value: condition?.customerQuota?.all },
        },
        spendingConditions: condition?.spendingConditions?.length
          ? await Promise.all(
              condition?.spendingConditions?.map(async (spending: SpendingConditionsResByServiceCampaignType) => ({
                _id: spending?._id,
                isExpand: true,
                conditionDesc: spending?.conditionDesc,
                minSpendingAmount: spending?.minSpendingAmount,
                maxSpendingAmount: spending?.maxSpendingAmount,
                sharedRewardIds: spending?.sharedRewardIds,
                rewards: spending?.rewards?.length
                  ? await Promise.all(
                      spending?.rewards?.map(async (reward: RewardResByServiceCampaignType) => {
                        const rewardList =
                          reward?.isRewardSharing && isFindRewardList
                            ? await getRewardList({
                                rewardType: reward?.rewardType,
                                ...(campaignId && { campaignId: campaignId }),
                              })
                            : [];
                        return {
                          _id: reward?._id,
                          isRewardSharing: reward?.isRewardSharing,
                          isExpand: true,
                          rewardList,
                          isRequiredReferenceCode: reward?.isRequiredReferenceCode,
                          rewardType: reward?.rewardType,
                          rewardName: reward?.rewardName,
                          ruleId: reward?.ruleId,
                          customTriggerId: reward?.customTriggerId,
                          voucherRewardId: reward?.voucherRewardId,
                          spendingXBath: reward?.spendingXBath,
                          qtyPerRedemption: reward?.qtyPerRedemption,
                          totalRewardQty: reward?.totalRewardQty,
                          rewardValue: reward?.rewardValue,
                          totalRewardValue:
                            reward?.totalRewardQty && reward?.rewardValue
                              ? reward?.totalRewardQty * reward?.rewardValue
                              : null,
                          quotaPerReward: reward?.quotaPerReward
                            ? {
                                _id: reward?.quotaPerReward?._id,
                                redeemed: reward?.quotaPerReward?.redeemed,
                                daily: {
                                  isChecked: !!reward?.quotaPerReward?.daily,
                                  value: reward?.quotaPerReward?.daily,
                                },
                                monthly: {
                                  isChecked: !!reward?.quotaPerReward?.monthly,
                                  value: reward?.quotaPerReward?.monthly,
                                },
                                weekly: {
                                  isChecked: !!reward?.quotaPerReward?.weekly?.weekType,
                                  weekType: reward?.quotaPerReward?.weekly?.weekType,
                                  startAmount:
                                    reward?.quotaPerReward?.weekly?.weekType === WeeklyTypeEnum?.CAMPAIGN_STARTING
                                      ? reward?.quotaPerReward?.weekly?.weekDays?.[0]?.amount
                                      : null,
                                  weekDays: transformWeekDays(reward?.quotaPerReward?.weekly?.weekDays),
                                  checked: reward?.quotaPerReward?.weekly?.weekType
                                    ? transformChecked(reward?.quotaPerReward?.weekly?.weekDays)
                                    : initCheckedDays,
                                },
                              }
                            : initQuotaPerReward,
                        };
                      })
                    )
                  : [initRewardCriteriaForm],
              }))
            )
          : [initSpendingCondition],
      }))
    );
  } else {
    return [initCampaignCriteriaForm];
  }
};
