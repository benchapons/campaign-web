import { NextApiRequest, NextApiResponse } from 'next';

import { HTTPDataType, UserAuthPayloadType } from '@/types/global.type';
import CampaignService from '@/services/server/campaign.service';
import { CAMPAIGN, REWARD, UPDATE_AFTER_GO_LIVE, VERSION_1 } from '@/constants/bff-url';
import { transformCampaignList, transformResponseToRewardFormStore } from '@/dto/reward';
import { RewardFormType } from '@/types/reward.type';
import middleware from '../auth/middleware';
import permissionGuard from '../auth/permissionGuard';
import { Permission } from '@/constants/auth';
import { AuthorizedUserType } from '@/types/auth.type';

const rewardId = (req: NextApiRequest, res: NextApiResponse<any>, authorizedUser: AuthorizedUserType) => {
  //getRewardById
  // page reward/:rewardId
  // page campaign/:campaignId (adjust reward)
  if (req.method === 'GET') {
    const { rewardId, isAdjustment, rewardGroupType } = req.query;
    const payloadReward: HTTPDataType = {
      pathService: `/${VERSION_1}/${REWARD}/${rewardId}`,
      params: { rewardGroupType },
    };

    const payloadCampaign: HTTPDataType = {
      pathService: `/${VERSION_1}/${CAMPAIGN}/search`,
      params: { rewardId },
    };
    permissionGuard([Permission.RWD_UPDATE, Permission.CAMP_SEARCH], authorizedUser.userPage, res);

    if (isAdjustment === 'true') {
      //adjustment
      CampaignService.get({ ...payloadReward })
        .then((response) => {
          res.status(200).json({
            success: true,
            _id: response?._id,
            isRewardSharing: response?.isRewardSharing,
            rewardType: response?.rewardType,
            rewardName: response?.rewardName,
            rewardValue: response?.rewardValue,
            totalRewardValue: response?.totalRewardValue,
            totalRewardQty: response?.totalRewardQty,
            totalRedeemed: response?.totalRedeemed,
          });
        })
        .catch((error) => {
          res.status(400).json(error);
        });
    } else {
      Promise.all([CampaignService.get({ ...payloadReward }), CampaignService.get({ ...payloadCampaign })])
        .then(([reward, campaignList]) => {
          const newReward: RewardFormType = transformResponseToRewardFormStore(reward);

          const newCampaignList = transformCampaignList(campaignList);
          const result = {
            ...newReward,
            isCampaignStarted: newCampaignList.length ? newCampaignList?.some((i) => i?.isStarted) : false,
            campaigns: transformCampaignList(campaignList),
          };
          res.status(200).json(result);
        })
        .catch((error) => {
          res.status(400).json(error);
        });
    }
  }

  // updateReward
  if (req.method === 'PUT') {
    const { rewardId } = req.query;
    const payload: HTTPDataType = {
      pathService: `/${VERSION_1}/${REWARD}/${rewardId}`,
      body: { ...req?.body, userId: authorizedUser?.id, updatedBy: authorizedUser?.displayName },
    };
    permissionGuard([Permission.RWD_UPDATE], authorizedUser.userPage, res);
    CampaignService.put({ ...payload })
      .then((response) => {
        res.status(200).json({ success: true, _id: response?._id });
      })
      .catch((error) => {
        res.status(400).json(error);
      });
  }

  //updateSpecialReward
  if (req.method === 'PATCH') {
    const { rewardId } = req.query;
    const payload: HTTPDataType = {
      pathService: `/${VERSION_1}/${REWARD}/${rewardId}/${UPDATE_AFTER_GO_LIVE}`,
      body: { ...req?.body, userId: authorizedUser.id, updatedBy: authorizedUser.displayName },
    };
    permissionGuard([Permission.RWD_UPDATE], authorizedUser.userPage, res);
    CampaignService.patch({ ...payload })
      .then((response) => {
        res.status(200).json({ success: true, _id: response?._id });
      })
      .catch((error) => {
        res.status(400).json(error);
      });
  }

  // adjustmentReward
  // page campaign/:campaignId (submit adjust reward)
  if (req.method === 'POST') {
    const { rewardId } = req.query;
    const payload: HTTPDataType = {
      pathService: `/${VERSION_1}/${REWARD}/${rewardId}/adjustment`,
      body: { ...req?.body, userId: authorizedUser.id, createdBy: authorizedUser.displayName },
    };
    permissionGuard([Permission.RWD_UPDATE], authorizedUser.userPage, res);
    CampaignService.put({ ...payload })
      .then(() => {
        res.status(200).json({
          success: true,
        });
      })
      .catch((error) => {
        res.status(400).json(error);
      });
  }

  //deleteReward
  if (req.method === 'DELETE') {
    const { rewardId } = req.query;
    const deletedBy: UserAuthPayloadType = { userId: authorizedUser.id, displayName: authorizedUser.displayName };

    const payload: HTTPDataType = {
      pathService: `/${VERSION_1}/${REWARD}/${rewardId}`,
      body: { ...deletedBy },
    };
    permissionGuard([Permission.RWD_DELETE], authorizedUser.userPage, res);
    CampaignService.delete({ ...payload })
      .then((response) => {
        res.status(200).json(response?.deletedCount ? { success: true } : { success: false });
      })
      .catch((error) => {
        res.status(400).json(error);
      });
  }
};

export default middleware(rewardId);
