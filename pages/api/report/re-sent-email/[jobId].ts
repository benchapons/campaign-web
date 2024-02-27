import { NextApiRequest, NextApiResponse } from 'next';

import { VERSION_1 } from '@/constants/bff-url';
import ReportService from '@/services/server/report-service.service';
import { HTTPDataType } from '@/types/global.type';

import { AuthorizedUserType } from '@/types/auth.type';
import middleware from '../../auth/middleware';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
    responseLimit: '50mb',
  },
};

const reSendEmailById = (req: NextApiRequest, res: NextApiResponse, authorizedUser: AuthorizedUserType) => {
  if (req.method !== 'PATCH') return res.status(405).end();

  const { jobId } = req.query;

  const payload: HTTPDataType = {
    pathService: `/${VERSION_1}/generates/${jobId}/send-email`,
    body: {},
  };

  ReportService.patch({ ...payload })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      res.status(error?.response?.status || 500).json(error);
    });
};

export default middleware(reSendEmailById);
