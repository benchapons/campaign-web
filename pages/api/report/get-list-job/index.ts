import { NextApiRequest, NextApiResponse } from 'next';

import {
  API_REPORT_RECEIPT_TRANSACTION_REPORT_PAGINATION, VERSION_1
} from '@/constants/bff-url';
import ReportService from '@/services/server/report-service.service';
import { AuthorizedUserType } from '@/types/auth.type';
import { HTTPDataType } from '@/types/global.type';
import middleware from '../../auth/middleware';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
    responseLimit: '50mb',
  },
};

const getListReportByParams = (req: NextApiRequest, res: NextApiResponse, authorizedUser: AuthorizedUserType) => {
  if (req.method !== 'GET') return res.status(405).end();

  const payload: HTTPDataType = {
    pathService: `/${VERSION_1}/${API_REPORT_RECEIPT_TRANSACTION_REPORT_PAGINATION}`,
    params: req.query,
  };

  ReportService.get({ ...payload })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      res.status(error?.response?.status || 500).json(error);
    });
};

export default middleware(getListReportByParams);
