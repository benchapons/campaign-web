import { MasterStatusTypeEnum } from '@/constants/enum';

export const transformResponseToMasterForm = (res: any) => ({
  _id: res?._id,
  group: res?.group,
  masterId: res?.masterId,
  value: res?.value,
  nameTH: res?.nameTH,
  nameEN: res?.nameEN,
  status: res?.active ? MasterStatusTypeEnum?.ACTIVE : MasterStatusTypeEnum?.INACTIVE,
  description: res?.description,
  parentID: res?.parentID,
  orderIndex: res?.orderIndex,
  existedFile: res?.existedFile,
  attachment: res?.attachment,
  groupParent: '',
  parent: '',
});
