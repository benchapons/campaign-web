import { NextApiRequest, NextApiResponse } from 'next';

import { HTTPDataType } from '@/types/global.type';
import CampaignService from '@/services/server/campaign.service';
import { VERSION_1, CONSTANTS } from '@/constants/bff-url';
import { AuthorizedUserType } from '@/types/auth.type';
import middleware from '../../auth/middleware';

const master = (req: NextApiRequest, res: NextApiResponse<any>, authorizedUser: AuthorizedUserType) => {
  //getMasterConstant
  if (req.method === 'GET') {
    const payload: HTTPDataType = {
      pathService: `/${VERSION_1}/${CONSTANTS}/${req.query.group}`,
    };
    CampaignService.get({ ...payload })
      .then((response) => {
        const result = Object.entries(response).map(([key, value]) => ({ label: key, value: value }));
        res.status(200).json(result);
      })
      .catch((error) => {
        res.status(400).json(error);
      });
  }
};

export default middleware(master);
