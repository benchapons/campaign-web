import { NextApiRequest, NextApiResponse } from 'next';
import { HTTPDataType } from '@/types/global.type';
import CampaignService from '@/services/server/campaign.service';
import { formatDateTimeThai } from '@/utilities/format';
import { REWARD, SEARCH, VERSION_1, CREATE } from '@/constants/bff-url';
import { transformResponseToRewardForm } from '@/dto/reward';
import middleware from '../auth/middleware';
import { AuthorizedUserType } from '@/types/auth.type';
import permissionGuard from '../auth/permissionGuard';
import { Permission } from '@/constants/auth';
import { convertRewardType } from '@/utilities/global';

const reward = (req: NextApiRequest, res: NextApiResponse<any>, authorizedUser: AuthorizedUserType) => {
  //getRewardList
  //page reward
  if (req.method === 'GET') {
    const { rewardType } = req.query;
    const payload: HTTPDataType = {
      pathService: `/${VERSION_1}/${REWARD}/${SEARCH}`,
      params: req.query,
    };
    permissionGuard([Permission.RWD_SEARCH], authorizedUser.userPage, res);
    CampaignService.get({ ...payload })
      .then((response) => {
        let result = [];
        if (rewardType) {
          result = response?.map((i: any) => ({
            ...i,
            value: i?._id,
            label: i?.rewardName,
          }));
        } else {
          result = response
            ?.sort((a: any, b: any) => new Date(b?.updatedAt)?.getTime() - new Date(a?.updatedAt)?.getTime())
            ?.map((i: any) => ({
              _id: i?._id,
              type: i?.rewardType,
              name: i?.rewardName,
              quantity: i?.totalRewardQty,
              value: i?.rewardValue,
              modifyName: i?.updatedBy ? i?.updatedBy : i?.createdBy,
              modifyDate: formatDateTimeThai(i?.updatedAt),
              modifyDateTime: new Date(i?.updatedAt)?.getTime(),
            }));
        }
        res.status(200).json(result);
      })
      .catch((error) => {
        res.status(400).json(error);
      });
  }

  //createReward
  if (req.method === 'POST') {
    const { isCampaign, ...body } = req.body;
    const payload: HTTPDataType = {
      pathService: `/${VERSION_1}/${REWARD}/${CREATE}`,
      body: { ...body, userId: authorizedUser?.id, createdBy: authorizedUser?.displayName },
    };
    permissionGuard([Permission.RWD_CREATE], authorizedUser.userPage, res);
    CampaignService.post({ ...payload })
      .then((response) => {
        if (isCampaign) {
          const result = transformResponseToRewardForm(response);
          res.status(200).json({ ...result, success: true });
        } else {
          res.status(200).json({ success: true, _id: response?._id });
        }
      })
      .catch((error) => {
        res.status(400).json(error);
      });
  }
};

export default middleware(reward);
