import { atom } from 'recoil';
import { OptionsDropdown } from '@/types/event.interface';

export interface RewardMasterStateType {
  rewardTypeList: OptionsDropdown[];
  rewardAdjustmentTypeList: OptionsDropdown[];
}

export const rewardMasterState = atom({
  key: 'rewardMaster',
  default: {
    rewardTypeList: [],
    rewardAdjustmentTypeList: [],
  } as RewardMasterStateType,
});
