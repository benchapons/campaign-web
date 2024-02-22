import { OptionsDropdown } from '@/types/event.interface';
import { atom } from 'recoil';

export interface CampaignMasterState {
  campaignTypeList: OptionsDropdown[];
  buildingList: OptionsDropdown[];
  spendingChannelList: OptionsDropdown[];
  statusList: OptionsDropdown[];
  targetSegmentList: OptionsDropdown[];
  campaignObjectiveList: OptionsDropdown[];
  redemptionStatusList: OptionsDropdown[];
  rewardTypeList: OptionsDropdown[];
  conditionJoinerList: OptionsDropdown[];
  bankList: OptionsDropdown[];
  receiptBuildingList: OptionsDropdown[];
  receiptStatus: OptionsDropdown[];
}

export const campaignMasterState = atom({
  key: 'campaignMaster',
  default: {
    campaignTypeList: [],
    buildingList: [],
    spendingChannelList: [],
    statusList: [],
    targetSegmentList: [],
    campaignObjectiveList: [],
    redemptionStatusList: [],
    rewardTypeList: [],
    conditionJoinerList: [],
    bankList: [],
    receiptBuildingList: [],
    receiptStatus: [],
  } as CampaignMasterState,
});
