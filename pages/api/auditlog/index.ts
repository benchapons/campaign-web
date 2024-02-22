import { NextApiRequest, NextApiResponse } from 'next';

import { HTTPDataType } from '@/types/global.type';
import CampaignService from '@/services/server/campaign.service';
import { VERSION_1, AUDIT_LOG } from '@/constants/bff-url';
import middleware from '../auth/middleware';
import permissionGuard from '../auth/permissionGuard';
import { AuthorizedUserType } from '@/types/auth.type';
import { Permission } from '@/constants/auth';

const auditlog = (req: NextApiRequest, res: NextApiResponse<any>, authorizedUser: AuthorizedUserType) => {
  if (req.method === 'GET') {
    permissionGuard([Permission.VW_AUDIT_LOG], authorizedUser.userPage, res);
    const payload: HTTPDataType = {
      pathService: `/${VERSION_1}/${AUDIT_LOG}/search`,
      params: req.query,
    };
    CampaignService.get({ ...payload })
      .then((response) => {
        res.status(200).json(response);
      })
      .catch((error) => {
        res.status(400).json(error);
      });
  }
};

export default middleware(auditlog);
