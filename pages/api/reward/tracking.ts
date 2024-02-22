import { NextApiRequest, NextApiResponse } from 'next';

import CampaignService from '@/services/server/campaign.service';
import { HTTPDataType } from '@/types/global.type';
import { REWARD, VERSION_1, TRACKING } from '@/constants/bff-url';
import { transformRewardTracking } from '@/dto/reward';
import middleware from '../auth/middleware';
import { AuthorizedUserType } from '@/types/auth.type';
import permissionGuard from '../auth/permissionGuard';
import { Permission } from '@/constants/auth';

const reward = (req: NextApiRequest, res: NextApiResponse<any>, authorizedUser: AuthorizedUserType) => {
  //getRewardByCampaignId
  //page campaign   (reward tracking)
  if (req.method === 'GET') {
    const { campaignId } = req.query;
    const payload: HTTPDataType = {
      pathService: `/${VERSION_1}/${REWARD}/${TRACKING}/${campaignId}`,
    };
    permissionGuard([Permission.RWD_SEARCH], authorizedUser?.userPage, res);
    CampaignService.get({ ...payload })
      .then((response) => {
        const result = transformRewardTracking(response);
        res.status(200).json(result);
      })
      .catch((error) => {
        res.status(400).json(error);
      });
  }
};

export default middleware(reward);
