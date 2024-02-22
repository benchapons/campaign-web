import { NextApiRequest, NextApiResponse } from 'next';

import { HTTPDataType } from '@/types/global.type';
import ReportService from '@/services/server/report-service.service';
import { VERSION_1, REPORT, CAMPAIGN, SEARCH } from '@/constants/bff-url';
import middleware from '../auth/middleware';
import { AuthorizedUserType } from '@/types/auth.type';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
    responseLimit: '50mb',
  },
};

const campaign = (req: NextApiRequest, res: NextApiResponse<any>, authorizedUser: AuthorizedUserType) => {
  //getCampaignName
  if (req.method === 'GET') {
    const payload: HTTPDataType = {
      pathService: `/${VERSION_1}/${CAMPAIGN}/get-campaign-list-by-id`,
      params: req.query,
    };

    // permissionGuard([Permission.CAMP_SEARCH], authorizedUser.userPage, res);
    ReportService.get({ ...payload })
      .then((response) => {
        res.status(200).json({ success: true, data: response });
      })
      .catch((error) => {
        res.status(400).json(error);
      });
  }
};

export default middleware(campaign);
