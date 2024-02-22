import { NextApiRequest, NextApiResponse } from 'next';

import { HTTPDataType } from '@/types/global.type';
import CampaignService from '@/services/server/campaign.service';
import { VERSION_1, MASTER } from '@/constants/bff-url';
import middleware from '../auth/middleware';
import { AuthorizedUserType } from '@/types/auth.type';

const master = (req: NextApiRequest, res: NextApiResponse<any>, authorizedUser: AuthorizedUserType) => {
  //getMasterData,
  if (req.method === 'GET') {
    const payload: HTTPDataType = {
      pathService: `/${VERSION_1}/${MASTER}`,
      params: { ...req.query },
    };
    //isSystemMaster : true = ไม่แสดงที่หน้าจอเลย, false = แสดงให้แก้ได้
    CampaignService.get({ ...payload })
      .then((response) => {
        const result = response
          ?.filter((_master: any) => !_master?.isSystemMaster)
          ?.map((i: any) => ({
            id: i?._id,
            value: i?.value,
            label: i?.nameTH,
            masterId: i?.masterId,
            prefix: i?.prefix,
            desc: i?.description,
            isDisabled: !i?.active,
          }));
        res.status(200).json(result);
      })
      .catch((error) => {
        res.status(400).json(error);
      });
  }
};

export default middleware(master);
