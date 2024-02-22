import { NextApiRequest, NextApiResponse } from 'next';
import uniq from 'lodash/uniq';

import { HTTPDataType } from '@/types/global.type';
import CampaignService from '@/services/server/campaign.service';
import { checkDateBetween, formatDateThai } from '@/utilities/format';
import { VERSION_1, CAMPAIGN, DRAFT_INFO, DRAFT_CRITERIA, SUBMIT } from '@/constants/bff-url';
import middleware from '../auth/middleware';
import permissionGuard from '../auth/permissionGuard';
import { Permission } from '@/constants/auth';
import { AuthorizedUserType } from '@/types/auth.type';
import { FormStatusEnum } from '@/constants/enum';
import { ResGetCampaignList } from '@/services/client/campaign.service';
import { buildingWithComma } from '@/dto/global.dto';

const campaign = async (req: NextApiRequest, res: NextApiResponse<any>, authorizedUser: AuthorizedUserType) => {
  //getCampaignList
  if (req.method === 'GET') {
    const payload: HTTPDataType = {
      pathService: `/${VERSION_1}/${CAMPAIGN}/search`,
      params: req.query?.params,
    };
    permissionGuard([Permission.CAMP_SEARCH], authorizedUser.userPage, res);
    CampaignService.get({ ...payload })
      .then((response) => {
        const result: ResGetCampaignList[] = response
          ?.sort((a: any, b: any) => new Date(b?.updatedAt)?.getTime() - new Date(a?.updatedAt)?.getTime())
          ?.map((i: any) => {
            const building = i?.campaignConditions?.reduce((acc: any, cur: any) => {
              acc.push(...cur?.building);
              return acc;
            }, []);
            const duplicate: string[] = uniq(building);
            const startDate = formatDateThai(i?.campaignStartDate);
            const endDate = formatDateThai(i?.campaignEndDate);

            return {
              _id: i?._id,
              isStarted:
                i?.formStatus === FormStatusEnum?.SUBMITTED
                  ? checkDateBetween(i?.campaignStartDate, i?.campaignEndDate)
                  : false,
              code: i?.campaignCode,
              name: i?.campaignName,
              period: `${startDate} - ${endDate}`,
              building: buildingWithComma(duplicate),
              cost: i?.campaignCost,
              status: i?.formStatus === FormStatusEnum?.SUBMITTED ? i?.campaignStatus : i?.formStatus,
              startDateTime: new Date(i?.campaignStartDate)?.getTime(),
            };
          });
        res.status(200).json(result);
      })
      .catch((error) => {
        res.status(400).json(error);
      });
  }

  //draftCampaignCriteria
  if (req.method === 'PUT') {
    const { _id, ...body } = req?.body;

    const payload: HTTPDataType = {
      pathService: `/${VERSION_1}/${CAMPAIGN}/${_id}/${DRAFT_CRITERIA}`,
      body: { ...body, userId: authorizedUser.id, updatedBy: authorizedUser.displayName },
    };
    permissionGuard([Permission.CAMP_CREATE], authorizedUser.userPage, res);
    CampaignService.patch({ ...payload })
      .then(async (response) => {
        res.status(200).json({
          success: true,
          id: response?._id,
          campaignConditions: response?.campaignConditions?.length ? response?.campaignConditions : [],
        });
      })
      .catch((error) => {
        res.status(400).json(error);
      });
  }

  // draftCampaignInfo  and create
  if (req.method === 'POST') {
    if (req?.body?._id) {
      //draftCampaignInfo
      const { _id, ...body } = req?.body;
      const payload: HTTPDataType = {
        pathService: `/${VERSION_1}/${CAMPAIGN}/${_id}/${DRAFT_INFO}`,
        body: { ...body, userId: authorizedUser.id, updatedBy: authorizedUser.displayName },
      };
      permissionGuard([Permission.CAMP_CREATE], authorizedUser.userPage, res);
      CampaignService.patch({ ...payload })
        .then(async (response) => {
          res.status(200).json({
            success: true,
            id: response?._id,
            campaignCode: response?.campaignCode,
            formStatus: response?.formStatus,
            campaignConditions: response?.campaignConditions?.length ? response?.campaignConditions : [],
          });
        })
        .catch((error) => {
          res.status(400).json(error);
        });
    } else {
      //create new campaign without id
      const payload: HTTPDataType = {
        pathService: `/${VERSION_1}/${CAMPAIGN}`,
        body: { ...req?.body, userId: authorizedUser.id, createdBy: authorizedUser.displayName },
      };
      permissionGuard([Permission.CAMP_CREATE], authorizedUser.userPage, res);
      CampaignService.post({ ...payload })
        .then((response) => {
          res.status(200).json({
            success: true,
            id: response?._id,
            campaignCode: response?.campaignCode,
            formStatus: response?.formStatus,
          });
        })
        .catch((error) => {
          res.status(400).json(error);
        });
    }
  }

  //createCampaign
  if (req.method === 'PATCH') {
    const { _id, ...body } = req?.body;
    const payload: HTTPDataType = {
      pathService: `/${VERSION_1}/${CAMPAIGN}/${_id}/${SUBMIT}`,
      body: { ...body, userId: authorizedUser.id, updatedBy: authorizedUser.displayName },
    };
    permissionGuard([Permission.CAMP_CREATE, Permission.CAMP_UPDATE], authorizedUser.userPage, res);

    CampaignService.put({ ...payload })
      .then((response) => {
        const payload: HTTPDataType = {
          pathService: `/${VERSION_1}/${CAMPAIGN}/${response?._id}`,
        };
        CampaignService.get({ ...payload })
          .then((resp) => {
            res.status(200).json({
              success: true,
              campaignCode: response?.campaignCode,
              campaignConditions: resp?.campaignConditions?.length ? resp?.campaignConditions : [],
            });
          })
          .catch((error) => {
            console.error(error);
            res.status(400).json(error);
          });
      })
      .catch((error) => {
        console.error(error);
        res.status(400).json(error);
      });
  }
};

export default middleware(campaign);
