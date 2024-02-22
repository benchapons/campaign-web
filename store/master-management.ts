import { MasterStatusTypeEnum } from '@/constants/enum';
import { OptionsDropdown } from '@/types/event.interface';
import { MasterFormType } from '@/types/master-management.type';
import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export const initMasterFormStore: MasterFormType = {
  _id: '',
  masterId: '',
  group: '',
  value: '',
  nameTH: '',
  nameEN: '',
  description: '',
  parentID: '',
  orderIndex: null,
  status: MasterStatusTypeEnum?.ACTIVE,
  attachment: null,
  existedFile: undefined,
  groupParent: '',
  parent: '',
};

export const masterStore = atom({
  key: 'masterForm',
  default: initMasterFormStore as MasterFormType,
  effects_UNSTABLE: [persistAtom],
});

export interface MasterListStateType {
  groupList: OptionsDropdown[];
  parentList: OptionsDropdown[];
}

export const masterListStore = atom({
  key: 'masterList',
  default: {
    groupList: [],
    parentList: [],
  } as MasterListStateType,
});
