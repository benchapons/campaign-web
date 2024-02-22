import { NextApiRequest, NextApiResponse } from 'next';

import { HTTPDataType, UserAuthPayloadType } from '@/types/global.type';
import CampaignService from '@/services/server/campaign.service';
import { MASTER, VERSION_1 } from '@/constants/bff-url';
import middleware from '../auth/middleware';
import permissionGuard from '../auth/permissionGuard';
import { Permission } from '@/constants/auth';
import { AuthorizedUserType } from '@/types/auth.type';
import { MasterStatusTypeEnum } from '@/constants/enum';

const rewardId = (req: NextApiRequest, res: NextApiResponse<any>, authorizedUser: AuthorizedUserType) => {
  //getMasterById
  // page reward/:masterId
  if (req.method === 'GET') {
    const { masterId } = req.query;
    const payload: HTTPDataType = {
      pathService: `/${VERSION_1}/${MASTER}/${masterId}`,
    };
    permissionGuard([Permission.MASTER_UPDATE, Permission.MASTER_SEARCH], authorizedUser.userPage, res);
    CampaignService.get({ ...payload })
      .then((response) => {
        res.status(200).json({
          success: true,
          data: {
            ...response,
            status: response?.active ? MasterStatusTypeEnum.ACTIVE : MasterStatusTypeEnum.INACTIVE,
            attachment: null,
            existedFile: response?.attachment,
          },
        });
      })
      .catch((error) => {
        res.status(400).json(error);
      });
  }

  // updateMaster
  if (req.method === 'PUT') {
    const { masterId } = req.query;
    const payload: HTTPDataType = {
      pathService: `/${VERSION_1}/${MASTER}/${masterId}`,
      body: { ...req?.body, updatedBy: authorizedUser?.displayName },
    };
    permissionGuard([Permission.MASTER_UPDATE], authorizedUser.userPage, res);
    CampaignService.put({ ...payload })
      .then((response) => {
        res.status(200).json({ success: true, data: response });
      })
      .catch((error) => {
        res.status(400).json(error);
      });
  }

  //deleteMaster
  if (req.method === 'DELETE') {
    const { masterId } = req.query;
    const deletedBy: UserAuthPayloadType = { userId: authorizedUser.id, displayName: authorizedUser.displayName };

    const payload: HTTPDataType = {
      pathService: `/${VERSION_1}/${MASTER}/${masterId}/inactive`,
      body: { ...deletedBy },
    };
    permissionGuard([Permission.MASTER_DELETE], authorizedUser.userPage, res);
    CampaignService.put({ ...payload })
      .then((response) => {
        res.status(200).json({ success: true });
      })
      .catch((error) => {
        res.status(400).json(error);
      });
  }
};

export default middleware(rewardId);
