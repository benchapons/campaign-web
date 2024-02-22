import { NextApiRequest, NextApiResponse } from 'next';
import { HTTPDataType } from '@/types/global.type';
import CampaignService from '@/services/server/campaign.service';
import { VERSION_1, MASTER } from '@/constants/bff-url';
import middleware from '../auth/middleware';
import { AuthorizedUserType } from '@/types/auth.type';
import permissionGuard from '../auth/permissionGuard';
import { Permission } from '@/constants/auth';
import { StatusMasterData } from '@/constants/enum';

const masterManagement = (req: NextApiRequest, res: NextApiResponse<any>, authorizedUser: AuthorizedUserType) => {
  //getMasterList
  if (req.method === 'GET') {
    const payload: HTTPDataType = {
      pathService: `/${VERSION_1}/${MASTER}`,
      params: req.query,
    };
    permissionGuard([Permission.MASTER_SEARCH], authorizedUser.userPage, res);
    CampaignService.get({ ...payload })
      .then((response) => {
        const result = response
          ?.filter((_master: any) => !_master?.isSystemMaster)
          ?.sort((a: any, b: any) => new Date(b?.updatedAt)?.getTime() - new Date(a?.updatedAt)?.getTime())
          ?.map((i: any) => ({
            _id: i?._id,
            group: i?.group,
            masterId: i?.masterId,
            value: i?.value,
            nameTh: i?.nameTH,
            nameEn: i?.nameEN,
            desc: i?.description,
            parentId: i?.parentID,
            orderIndex: i?.orderIndex,
            status: i?.active ? StatusMasterData?.ACTIVE : StatusMasterData?.INACTIVE,
            // modifyName: i?.updatedBy ? i?.updatedBy : i?.createdBy,
            // modifyDate: formatDateTimeThai(i?.updatedAt),
          }));
        res.status(200).json(result);
      })
      .catch((error) => {
        res.status(400).json(error);
      });
  }

  //createMaster
  if (req.method === 'POST') {
    const payload: HTTPDataType = {
      pathService: `/${VERSION_1}/${MASTER}`,
      body: { ...req.body, createdBy: authorizedUser?.displayName },
    };

    permissionGuard([Permission.MASTER_CREATE], authorizedUser.userPage, res);
    CampaignService.post({ ...payload })
      .then((response) => {
        res.status(200).json(response);
      })
      .catch((error) => {
        res.status(400).json(error);
      });
  }
};

export default middleware(masterManagement);
