import { MasterStatusTypeEnum } from '@/constants/enum';

export interface MasterFormType {
  _id: string;
  masterId: string;
  group: string;
  value: string;
  nameTH: string;
  nameEN: string;
  description: string;
  parentID: string;
  orderIndex: number | null;
  status: MasterStatusTypeEnum;
  attachment: File | null;
  existedFile?: string | null;
  groupParent?: string;
  parent?: string;
}

// =-=-=-=-=-=-=-== Payload =-=-=-=-=-=-=-==

export interface PayloadCreateMasterType {
  group: string;
  value: string;
  nameTH: string;
  nameEN: string;
  description?: string;
  parentID?: string;
  orderIndex?: number | null;
  active: boolean;
  file?: any | null;
}

export interface PayloadUpdateMasterType {
  group: string;
  value: string;
  nameTH: string;
  nameEN: string;
  description?: string;
  parentID?: string;
  orderIndex?: number | null;
  active: boolean;
  file?: any | null;
  attachment?: string | null;
}
