import { MasterStatusTypeEnum } from '@/constants/enum';
import { MasterFormType, PayloadCreateMasterType, PayloadUpdateMasterType } from '@/types/master-management.type';
import { formatFileBase64 } from '@/utilities/format';

export const transformPayloadCreateMaster = async (master: MasterFormType): Promise<PayloadCreateMasterType> => {
  const file = master?.attachment ? await formatFileBase64(master?.attachment) : null;
  return {
    group: master?.group,
    value: master?.value,
    nameTH: master?.nameTH,
    nameEN: master?.nameEN,
    description: master?.description,
    parentID: master?.parentID,
    orderIndex: master?.orderIndex,
    active: master?.status === MasterStatusTypeEnum?.ACTIVE ? true : false,
    file: file,
  };
};

export const transformPayloadUpdateMaster = async (master: MasterFormType): Promise<PayloadUpdateMasterType> => {
  const file = master?.attachment ? await formatFileBase64(master?.attachment) : null;
  return {
    group: master?.group,
    value: master?.value,
    nameTH: master?.nameTH,
    nameEN: master?.nameEN,
    description: master?.description || '',
    parentID: master?.parentID || '',
    orderIndex: master?.orderIndex || null,
    active: master?.status === MasterStatusTypeEnum?.ACTIVE ? true : false,
    file: file,
    attachment: master?.existedFile,
  };
};
