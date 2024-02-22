import { NextApiRequest, NextApiResponse } from 'next';

import { HTTPDataType, UserAuthPayloadType, UserAuthUpdatePayloadType } from '@/types/global.type';
import CampaignService from '@/services/server/campaign.service';
import { CAMPAIGN, DUPLICATE, UPDATE_SPECIAL, VERSION_1 } from '@/constants/bff-url';
import middleware from '../auth/middleware';
import { transformResToCampaignInfoForm } from '@/dto/campaign';
import { FormStatusEnum } from '@/constants/enum';
import permissionGuard from '../auth/permissionGuard';
import { Permission } from '@/constants/auth';
import { AuthorizedUserType } from '@/types/auth.type';
import { checkDateBetween, checkEndDate } from '@/utilities/format';

const campaignCode = (req: NextApiRequest, res: NextApiResponse<any>, authorizedUser: AuthorizedUserType) => {
  //getCampaignById
  // page => /campaign/:campaignId
  if (req.method === 'GET') {
    const { campaignId } = req.query;
    const payload: HTTPDataType = {
      pathService: `/${VERSION_1}/${CAMPAIGN}/${campaignId}`,
    };
    permissionGuard([Permission.CAMP_UPDATE, Permission.CAMP_SEARCH], authorizedUser.userPage, res);
    CampaignService.get({ ...payload })
      .then(async (response) => {
        const campaignForm = await transformResToCampaignInfoForm(response);
        res.status(200).json({
          success: true,
          data: {
            ...campaignForm,
            campaignConditions: response?.campaignConditions?.length ? response?.campaignConditions : [],
            formStatus: response?.formStatus,
            isStarted:
              response?.formStatus === FormStatusEnum?.SUBMITTED
                ? checkDateBetween(response?.campaignStartDate, response?.campaignEndDate)
                : false,
            isEnded:
              response?.formStatus === FormStatusEnum?.SUBMITTED ? checkEndDate(response?.campaignEndDate) : false,
          },
        });
      })
      .catch((error) => {
        res.status(400).json(error);
      });
  }

  // duplicateCampaign
  // page => /campaign  (campaignList)
  if (req.method === 'POST') {
    const { campaignId } = req.query;
    const duplicatedBy: UserAuthPayloadType = { userId: authorizedUser.id, displayName: authorizedUser.displayName };

    const payload: HTTPDataType = {
      pathService: `/${VERSION_1}/${CAMPAIGN}/${campaignId}/${DUPLICATE}`,
      body: { ...duplicatedBy },
    };
    permissionGuard([Permission.CAMP_CREATE], authorizedUser.userPage, res);
    CampaignService.post({ ...payload })
      .then((response) => {
        res.status(200).json({
          success: true,
          _id: response?._id,
        });
      })
      .catch((error) => {
        res.status(400).json(error);
      });
  }

  //updateSpecialCampaign service
  // page => /edit/:campaignId
  if (req.method === 'PUT') {
    const { campaignId } = req.query;
    const updateBy: UserAuthUpdatePayloadType = { userId: authorizedUser.id, updatedBy: authorizedUser.displayName };

    const payload: HTTPDataType = {
      pathService: `/${VERSION_1}/${CAMPAIGN}/${campaignId}/${UPDATE_SPECIAL}`,
      body: { ...req?.body, ...updateBy },
    };

    permissionGuard([Permission.CAMP_UPDATE], authorizedUser.userPage, res);
    CampaignService.put({ ...payload })
      .then((response) => {
        res.status(200).json({
          success: true,
          campaignCode: response?.campaignCode,
          campaignConditions: response?.campaignConditions?.length ? response?.campaignConditions : [],
        });
      })
      .catch((error) => {
        res.status(400).json(error);
      });
  }

  //deleteCampaign
  if (req.method === 'DELETE') {
    const { campaignId } = req.query;
    const deletedBy: UserAuthPayloadType = { userId: authorizedUser.id, displayName: authorizedUser.displayName };

    const payload: HTTPDataType = {
      pathService: `/${VERSION_1}/${CAMPAIGN}/${campaignId}`,
      body: { ...deletedBy },
    };
    permissionGuard([Permission.CAMP_DELETE], authorizedUser.userPage, res);
    CampaignService.delete({ ...payload })
      .then((response) => {
        res.status(200).json(response?.deletedCount ? { success: true } : { success: false });
      })
      .catch((error) => {
        res.status(400).json(error);
      });
  }
};

export default middleware(campaignCode);
