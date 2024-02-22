import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';
import { v4 as uuidv4 } from 'uuid';

import {
  CampaignCriteriaForm,
  CampaignInfoForm,
  CriteriaSpendingConditions,
  CriteriaSpendingConditionsReward,
} from '@/types/campaign.type';
import { initRewardFormStore } from './reward';
import { SpendingTypeEnum } from '@/constants/enum';

const { persistAtom } = recoilPersist();

export const initCampaignInfoForm: CampaignInfoForm = {
  _id: '',
  campaignCode: '',
  campaignName: '',
  campaignDesc: '',
  conditionDetail: '',
  campaignObjective: '',
  campaignStartDate: null,
  campaignEndDate: null,
  campaignCost: null,
  campaignBudget: null,
  targetSegment: '',
  spendingChannels: ['Offline'],
  campaignStatus: '',
};

export const initRewardCriteriaForm: CriteriaSpendingConditionsReward = {
  ...initRewardFormStore,
  _id: uuidv4(),
  isRewardSharing: false,
  isExpand: true,
  rewardList: [],
  quotaPerReward: {
    ...initRewardFormStore?.quotaPerReward,
    redeemed: 0,
  },
};

export const initSpendingCondition: CriteriaSpendingConditions = {
  _id: uuidv4(),
  isExpand: true,
  conditionDesc: [],
  minSpendingAmount: null,
  maxSpendingAmount: null,
  rewards: [initRewardCriteriaForm],
  sharedRewardIds: [],
};

export const initCampaignCriteriaForm: CampaignCriteriaForm = {
  _id: uuidv4(),
  isExpand: true,
  campaignType: '',
  bankNames: [],
  isExtraCondition: false,
  conditionGroup: '',
  spendingType: SpendingTypeEnum?.NORMAL,
  building: [],
  brand: '',
  buildingOther: {
    isChecked: false,
    value: null,
  },
  customerQuota: {
    daily: {
      isChecked: false,
      value: null,
    },
    all: {
      isChecked: false,
      value: null,
    },
  },
  spendingConditions: [initSpendingCondition],
};

export const initCampaignStore = {
  step: 1,
};

export interface CampaignDetailState {
  step: number;
}

export const campaignDetailState = atom({
  key: 'campaignDetail',
  default: initCampaignStore as CampaignDetailState,
  effects_UNSTABLE: [persistAtom],
});

export const campaignInfoState = atom({
  key: 'campaignInfo',
  default: initCampaignInfoForm as CampaignInfoForm,
  effects_UNSTABLE: [persistAtom],
});

export const campaignCriteriaState = atom({
  key: 'campaignCriteria',
  default: [initCampaignCriteriaForm] as CampaignCriteriaForm[],
  effects_UNSTABLE: [persistAtom],
});
