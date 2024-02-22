import { NextApiRequest, NextApiResponse } from 'next';

import { HTTPDataType } from '@/types/global.type';
import { VERSION_1, API_REPORT_CAMPAIGN_LIST } from '@/constants/bff-url';
import middleware from '../auth/middleware';
import { AuthorizedUserType } from '@/types/auth.type';
import ReportService from '@/services/server/report-service.service';
import { ResGetCampaignList } from '@/services/client/campaign.service';
import { uniq } from 'lodash';
import { checkDateBetween, formatDateThai } from '@/utilities/format';
import { FormStatusEnum } from '@/constants/enum';
import { buildingWithComma } from '@/dto/global.dto';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
    responseLimit: '50mb',
  },
};

const campaignList = (req: NextApiRequest, res: NextApiResponse<any>, authorizedUser: AuthorizedUserType) => {
  if (req.method === 'GET') {
    const payload: HTTPDataType = {
      pathService: `/${VERSION_1}/${API_REPORT_CAMPAIGN_LIST}`,
      params: req.query?.params,
    };

    //permissionGuard([Permission.CAMP_SEARCH], authorizedUser.userPage, res);
    ReportService.get({ ...payload })
      .then((response) => {
        // const result: ResGetCampaignList[] = response
        //   ?.sort((a: any, b: any) => new Date(b?.updatedAt)?.getTime() - new Date(a?.updatedAt)?.getTime())
        //   ?.map((i: any) => {
        //     const building = i?.campaignConditions?.reduce((acc: any, cur: any) => {
        //       acc.push(...cur?.building);
        //       return acc;
        //     }, []);
        //     const duplicate: string[] = uniq(building);
        //     const startDate = formatDateThai(i?.campaignStartDate);
        //     const endDate = formatDateThai(i?.campaignEndDate);
        //     return {
        //       _id: i?._id,
        //       isStarted:
        //         i?.formStatus === FormStatusEnum?.SUBMITTED
        //           ? checkDateBetween(i?.campaignStartDate, i?.campaignEndDate)
        //           : false,
        //       code: i?.campaignCode,
        //       name: i?.campaignName,
        //       period: `${startDate} - ${endDate}`,
        //       building: buildingWithComma(duplicate),
        //       cost: i?.campaignCost,
        //       status: i?.formStatus === FormStatusEnum?.SUBMITTED ? i?.campaignStatus : i?.formStatus,
        //       startDateTime: new Date(i?.campaignStartDate)?.getTime(),
        //     };
        //   });
        // res.status(200).json(result);
      })
      .catch((error) => {
        res.status(400).json(error);
      });
  }
};

export default middleware(campaignList);
