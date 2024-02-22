import { NextApiRequest, NextApiResponse } from 'next';

import { HTTPDataType } from '@/types/global.type';
import { VERSION_1, API_REPORT_SEARCH_CAMPAIGN } from '@/constants/bff-url';
import middleware from '../auth/middleware';
import { AuthorizedUserType } from '@/types/auth.type';
import ReportService from '@/services/server/report-service.service';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
    responseLimit: '50mb',
  },
};

// todo: re naming to search/campaign
const campaign = (req: NextApiRequest, res: NextApiResponse<any>, authorizedUser: AuthorizedUserType) => {
  if (req.method === 'GET') {
    const options: HTTPDataType = {
      pathService: `/${VERSION_1}/${API_REPORT_SEARCH_CAMPAIGN}`,
      params: req.query,
    };
    ReportService.get({ ...options })
      .then((response) => {
        res.status(200).json({ success: true, data: response });
      })
      .catch((error) => {
        res.status(400).json(error);
      });
  }
};

export default middleware(campaign);
