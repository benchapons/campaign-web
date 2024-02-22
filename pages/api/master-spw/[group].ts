import { NextApiRequest, NextApiResponse } from 'next';

import { HTTPDataType } from '@/types/global.type';
import Service from '@/services/server/master.service';
import { CS_PORTAL, MASTER_SPW } from '@/constants/bff-url';
import middleware from '../auth/middleware';
import permissionGuard from '../auth/permissionGuard';
import { AuthorizedUserType, UserPageTransformType } from '@/types/auth.type';
import { Permission } from '@/constants/auth';

const master = (req: NextApiRequest, res: NextApiResponse<any>, authorizedUser: AuthorizedUserType) => {
  //getMasterDataCS
  if (req.method === 'GET') {
    const payload: HTTPDataType = {
      pathService: `/${CS_PORTAL}/${req?.query?.group}`,
    };
    Service.get({ ...payload })
      .then((response) => {
        const result = response?.data?.map((i: any) => ({
          id: i?.id,
          value: i?.value,
          label: i?.nameTH,
          desc: i?.description,
        }));
        res.status(200).json(result);
      })
      .catch((error) => {
        res.status(400).json(error);
      });
  }
};

export default middleware(master);
