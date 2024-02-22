import { validate as uuidValidate } from 'uuid';

import {
  CampaignCriteriaForm,
  CampaignInfoForm,
  CriteriaSpendingConditions,
  CriteriaSpendingConditionsReward,
  PayloadUpdateCampaignType,
  RewardPayloadCreateType,
  RewardPayloadCreateWithIdType,
  RewardPayloadUpdateCampaignType,
} from '@/types/campaign.type';
import { transformPayloadWeekly, transformPayloadWeeklyUpdateSpecial } from '../global.dto';

interface TransformPayloadUpdateSpecialCampaignParam {
  infoForm: CampaignInfoForm;
  criteriaForm: CampaignCriteriaForm[];
}

export const transformPayloadUpdateSpecialCampaign = ({
  infoForm,
  criteriaForm,
}: TransformPayloadUpdateSpecialCampaignParam): PayloadUpdateCampaignType => ({
  campaignName: infoForm?.campaignName,
  campaignDesc: infoForm?.campaignDesc,
  conditionDetail: infoForm?.conditionDetail,
  campaignObjective: infoForm?.campaignObjective,
  campaignStartDate: infoForm?.campaignStartDate ? `${infoForm?.campaignStartDate}T00:00:00.000+00:00` : null,
  campaignEndDate: infoForm?.campaignEndDate ? `${infoForm?.campaignEndDate}T00:00:00.000+00:00` : null,
  campaignCost: infoForm?.campaignCost,
  campaignBudget: infoForm?.campaignBudget,
  targetSegment: infoForm?.targetSegment,
  campaignStatus: infoForm?.campaignStatus,
  spendingChannels: infoForm?.spendingChannels,
  campaignConditions: criteriaForm?.map((condition: any) => ({
    _id: condition?._id,
    campaignType: condition?.campaignType,
    isExtraCondition: condition?.isExtraCondition,
    conditionGroup: condition?.conditionGroup,
    spendingType: condition?.spendingType,
    building: condition?.buildingOther?.value
      ? [...condition?.building, condition?.buildingOther?.value]
      : condition?.building,
    brand: condition?.brand,
    customerQuota: {
      daily: condition?.customerQuota?.daily?.value,
      all: condition?.customerQuota?.all?.value,
    },
    spendingConditions: condition?.spendingConditions?.map((tier: CriteriaSpendingConditions) => ({
      _id: tier?._id,
      conditionDesc: tier?.conditionDesc,
      minSpendingAmount: tier?.minSpendingAmount,
      maxSpendingAmount: tier?.maxSpendingAmount,
      rewards: tier?.rewards?.reduce(
        (acc: RewardPayloadUpdateCampaignType[], cur: CriteriaSpendingConditionsReward) => {
          if (!cur?.isRewardSharing) {
            acc.push({
              _id: cur?._id || '',
              rewardType: cur?.rewardType,
              isRequiredReferenceCode: cur?.isRequiredReferenceCode,
              rewardName: cur?.rewardName,
              ruleId: cur?.ruleId,
              customTriggerId: cur?.customTriggerId,
              voucherRewardId: cur?.voucherRewardId,
              spendingXBath: cur?.spendingXBath,
              qtyPerRedemption: cur?.qtyPerRedemption,
              rewardValue: cur?.rewardValue,
              totalRewardQty: cur?.totalRewardQty,
              totalRewardValue: cur?.totalRewardValue,
              quotaPerReward: {
                daily: cur?.quotaPerReward?.daily?.value ? Number(cur?.quotaPerReward?.daily?.value) : null,
                weekly: {
                  weekType: cur?.quotaPerReward?.weekly?.weekType,
                  weekDays: transformPayloadWeeklyUpdateSpecial(cur?.quotaPerReward?.weekly),
                },
                monthly: cur?.quotaPerReward?.monthly?.value ? Number(cur?.quotaPerReward?.monthly?.value) : null,
              },
            });
          }
          return acc;
        },
        []
      ),
      sharedRewardIds: tier?.rewards?.reduce((acc: string[], cur: CriteriaSpendingConditionsReward) => {
        if (cur?.isRewardSharing && cur?.rewardName && cur?._id) {
          acc.push(cur?._id);
        }
        return acc;
      }, []),
    })),
  })),
  // updatedBy: userName,
  // userId: userId,
});

interface TransformPayloadCampaignInfoParam {
  campaignId?: string;
  infoForm: CampaignInfoForm;
}

export const transformPayloadCampaignInfo = ({ campaignId, infoForm }: TransformPayloadCampaignInfoParam) => ({
  ...(campaignId && { _id: campaignId }),
  campaignName: infoForm?.campaignName,
  campaignDesc: infoForm?.campaignDesc,
  conditionDetail: infoForm?.conditionDetail,
  campaignObjective: infoForm?.campaignObjective,
  campaignStartDate: infoForm?.campaignStartDate ? `${infoForm?.campaignStartDate}T00:00:00.000+00:00` : null,
  campaignEndDate: infoForm?.campaignEndDate ? `${infoForm?.campaignEndDate}T00:00:00.000+00:00` : null,
  campaignCost: infoForm?.campaignCost,
  campaignBudget: infoForm?.campaignBudget,
  targetSegment: infoForm?.targetSegment,
  campaignStatus: infoForm?.campaignStatus,
  spendingChannels: infoForm?.spendingChannels,
  // ...(campaignId ? { _id: campaignId, updatedBy: userName } : { createdBy: userName }),
  // userId: userId,
});

interface TransformPayloadCampaignCriteriaParam {
  campaignId: string;
  criteriaForm: CampaignCriteriaForm[];
}

export const transformPayloadCampaignCriteria = ({
  campaignId,
  criteriaForm,
}: TransformPayloadCampaignCriteriaParam) => ({
  _id: campaignId,
  campaignConditions: criteriaForm?.map((condition: CampaignCriteriaForm) => ({
    campaignType: condition?.campaignType,
    bankNames: condition?.bankNames,
    isExtraCondition: condition?.isExtraCondition,
    conditionGroup: condition?.conditionGroup,
    spendingType: condition?.spendingType,
    building: condition?.buildingOther?.value
      ? [...condition?.building, condition?.buildingOther?.value]
      : condition?.building,
    brand: condition?.brand,
    customerQuota: {
      daily: condition?.customerQuota?.daily?.value,
      all: condition?.customerQuota?.all?.value,
    },
    spendingConditions: condition?.spendingConditions?.map((tier: CriteriaSpendingConditions) => ({
      conditionDesc: tier?.conditionDesc,
      minSpendingAmount: tier?.minSpendingAmount,
      maxSpendingAmount: tier?.maxSpendingAmount,
      rewards: tier?.rewards?.reduce((acc: RewardPayloadCreateType[], cur: CriteriaSpendingConditionsReward) => {
        if (!cur?.isRewardSharing) {
          acc.push({
            rewardType: cur?.rewardType,
            isRequiredReferenceCode: cur?.isRequiredReferenceCode,
            rewardName: cur?.rewardName,
            ruleId: cur?.ruleId,
            customTriggerId: cur?.customTriggerId,
            voucherRewardId: cur?.voucherRewardId,
            spendingXBath: cur?.spendingXBath,
            qtyPerRedemption: cur?.qtyPerRedemption,
            rewardValue: cur?.rewardValue,
            totalRewardQty: cur?.totalRewardQty,
            totalRewardValue: cur?.totalRewardValue,
            quotaPerReward: {
              daily: cur?.quotaPerReward?.daily?.value ? Number(cur?.quotaPerReward?.daily?.value) : null,
              weekly: {
                weekType: cur?.quotaPerReward?.weekly?.weekType,
                weekDays: cur?.quotaPerReward?.weekly?.weekType
                  ? transformPayloadWeekly(cur?.quotaPerReward?.weekly)
                  : [],
              },
              monthly: cur?.quotaPerReward?.monthly?.value ? Number(cur?.quotaPerReward?.monthly?.value) : null,
            },
          });
        }
        return acc;
      }, []),
      sharedRewardIds: tier?.rewards?.reduce((acc: string[], cur: CriteriaSpendingConditionsReward) => {
        if (cur?.isRewardSharing && cur?.rewardName && cur?._id) {
          acc.push(cur?._id);
        }
        return acc;
      }, []),
    })),
  })),
  // updatedBy: userName,
  // userId: userId,
});

interface TransformPayloadCampaignParam {
  campaignId: string;
  infoForm: CampaignInfoForm;
  criteriaForm: CampaignCriteriaForm[];
}

export const transformPayloadSubmitCampaign = ({
  campaignId,
  infoForm,
  criteriaForm,
}: TransformPayloadCampaignParam) => {
  return {
    _id: campaignId,
    campaignName: infoForm?.campaignName,
    campaignDesc: infoForm?.campaignDesc,
    conditionDetail: infoForm?.conditionDetail,
    campaignObjective: infoForm?.campaignObjective,
    campaignStartDate: infoForm?.campaignStartDate ? `${infoForm?.campaignStartDate}T00:00:00.000+00:00` : null,
    campaignEndDate: infoForm?.campaignEndDate ? `${infoForm?.campaignEndDate}T00:00:00.000+00:00` : null,
    campaignCost: infoForm?.campaignCost,
    campaignBudget: infoForm?.campaignBudget,
    targetSegment: infoForm?.targetSegment,
    campaignStatus: infoForm?.campaignStatus,
    spendingChannels: infoForm?.spendingChannels,
    campaignConditions: criteriaForm?.map((condition: CampaignCriteriaForm) => ({
      campaignType: condition?.campaignType,
      bankNames: condition?.bankNames,
      isExtraCondition: condition?.isExtraCondition,
      conditionGroup: condition?.conditionGroup,
      spendingType: condition?.spendingType,
      building: condition?.buildingOther?.value
        ? [...condition?.building, condition?.buildingOther?.value]
        : condition?.building,
      brand: condition?.brand,
      customerQuota: {
        daily: condition?.customerQuota?.daily?.value,
        all: condition?.customerQuota?.all?.value,
      },
      spendingConditions: condition?.spendingConditions?.map((tier: CriteriaSpendingConditions) => ({
        conditionDesc: tier?.conditionDesc,
        minSpendingAmount: tier?.minSpendingAmount,
        maxSpendingAmount: tier?.maxSpendingAmount,
        rewards: tier?.rewards?.reduce((acc: RewardPayloadCreateType[], cur: CriteriaSpendingConditionsReward) => {
          if (!cur?.isRewardSharing) {
            acc.push({
              rewardType: cur?.rewardType,
              isRequiredReferenceCode: cur?.isRequiredReferenceCode,
              rewardName: cur?.rewardName,
              ruleId: cur?.ruleId,
              customTriggerId: cur?.customTriggerId,
              voucherRewardId: cur?.voucherRewardId,
              spendingXBath: cur?.spendingXBath,
              qtyPerRedemption: cur?.qtyPerRedemption,
              rewardValue: cur?.rewardValue,
              totalRewardQty: cur?.totalRewardQty,
              totalRewardValue: cur?.totalRewardValue,
              quotaPerReward: {
                daily: cur?.quotaPerReward?.daily?.value ? Number(cur?.quotaPerReward?.daily?.value) : null,
                weekly: {
                  weekType: cur?.quotaPerReward?.weekly?.weekType,
                  weekDays: cur?.quotaPerReward?.weekly?.weekType
                    ? transformPayloadWeekly(cur?.quotaPerReward?.weekly)
                    : [],
                },
                monthly: cur?.quotaPerReward?.monthly?.value ? Number(cur?.quotaPerReward?.monthly?.value) : null,
              },
            });
          }
          return acc;
        }, []),
        sharedRewardIds: tier?.rewards?.reduce((acc: string[], cur: CriteriaSpendingConditionsReward) => {
          if (cur?.isRewardSharing && cur?.rewardName && cur?._id) {
            acc.push(cur?._id);
          }
          return acc;
        }, []),
      })),
    })),
  };
};

interface TransformPayloadCampaignParamWithId {
  campaignId: string;
  infoForm: CampaignInfoForm;
  criteriaForm: CampaignCriteriaForm[];
}

export const transformPayloadSubmitCampaignWithId = ({
  campaignId,
  infoForm,
  criteriaForm,
}: TransformPayloadCampaignParamWithId) => {
  return {
    _id: campaignId,
    campaignName: infoForm?.campaignName,
    campaignDesc: infoForm?.campaignDesc,
    conditionDetail: infoForm?.conditionDetail,
    campaignObjective: infoForm?.campaignObjective,
    campaignStartDate: infoForm?.campaignStartDate ? `${infoForm?.campaignStartDate}T00:00:00.000+00:00` : null,
    campaignEndDate: infoForm?.campaignEndDate ? `${infoForm?.campaignEndDate}T00:00:00.000+00:00` : null,
    campaignCost: infoForm?.campaignCost,
    campaignBudget: infoForm?.campaignBudget,
    targetSegment: infoForm?.targetSegment,
    campaignStatus: infoForm?.campaignStatus,
    spendingChannels: infoForm?.spendingChannels,
    campaignConditions: criteriaForm?.map((condition: CampaignCriteriaForm) => ({
      ...(condition?._id && !uuidValidate(condition?._id) && { _id: condition?._id }),
      campaignType: condition?.campaignType,
      bankNames: condition?.bankNames,
      isExtraCondition: condition?.isExtraCondition,
      conditionGroup: condition?.conditionGroup,
      spendingType: condition?.spendingType,
      building: condition?.buildingOther?.value
        ? [...condition?.building, condition?.buildingOther?.value]
        : condition?.building,
      brand: condition?.brand,
      customerQuota: {
        daily: condition?.customerQuota?.daily?.value,
        all: condition?.customerQuota?.all?.value,
      },
      spendingConditions: condition?.spendingConditions?.map((tier: CriteriaSpendingConditions) => ({
        ...(tier?._id && !uuidValidate(tier?._id) && { _id: tier?._id }),
        conditionDesc: tier?.conditionDesc,
        minSpendingAmount: tier?.minSpendingAmount,
        maxSpendingAmount: tier?.maxSpendingAmount,
        rewards: tier?.rewards?.reduce(
          (acc: RewardPayloadCreateWithIdType[], cur: CriteriaSpendingConditionsReward) => {
            if (!cur?.isRewardSharing) {
              acc.push({
                ...(cur?._id && !uuidValidate(cur?._id) && { _id: cur?._id }),
                rewardType: cur?.rewardType,
                isRequiredReferenceCode: cur?.isRequiredReferenceCode,
                rewardName: cur?.rewardName,
                ruleId: cur?.ruleId,
                customTriggerId: cur?.customTriggerId,
                voucherRewardId: cur?.voucherRewardId,
                spendingXBath: cur?.spendingXBath,
                qtyPerRedemption: cur?.qtyPerRedemption,
                rewardValue: cur?.rewardValue,
                totalRewardQty: cur?.totalRewardQty,
                totalRewardValue: cur?.totalRewardValue,
                quotaPerReward: {
                  daily: cur?.quotaPerReward?.daily?.value ? Number(cur?.quotaPerReward?.daily?.value) : null,
                  weekly: {
                    weekType: cur?.quotaPerReward?.weekly?.weekType,
                    weekDays: cur?.quotaPerReward?.weekly?.weekType
                      ? transformPayloadWeeklyUpdateSpecial(cur?.quotaPerReward?.weekly)
                      : [],
                  },
                  monthly: cur?.quotaPerReward?.monthly?.value ? Number(cur?.quotaPerReward?.monthly?.value) : null,
                },
              });
            }
            return acc;
          },
          []
        ),
        sharedRewardIds: tier?.rewards?.reduce((acc: string[], cur: CriteriaSpendingConditionsReward) => {
          if (cur?.isRewardSharing && cur?.rewardName && cur?._id) {
            acc.push(cur?._id);
          }
          return acc;
        }, []),
      })),
    })),
  };
};
