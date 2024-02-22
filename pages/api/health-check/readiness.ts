import {
  healthCheckCampaignService,
  masterVlcGet,
  // healthCheckReceiptTank,
} from '@/services/readiness/health-check.service';
import { LivenessHealthCheckType, SystemConnectType, VlcHealthCheckType } from '@/types/readiness.type';
import { AxiosError } from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

type ReadinessType = {
  status: string;
  azureAd: VlcHealthCheckType<AxiosError>;
  masterVlc?: VlcHealthCheckType<AxiosError>;
  campaignService?: LivenessHealthCheckType<AxiosError>;
  // receiptTank?: LivenessHealthCheckType<AxiosError>;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ReadinessType>) {
  let masterVlcResponse: any, campaignServiceResponse: any, receiptTankResponse: any;
  await masterVlcGet()
    .then((response) => {
      masterVlcResponse = response;
    })
    .catch((error) => {
      masterVlcResponse = error;
    });

  await healthCheckCampaignService()
    .then((response) => {
      campaignServiceResponse = response;
    })
    .catch((error) => {
      campaignServiceResponse = error;
    });

  // await healthCheckReceiptTank()
  //   .then((response) => {
  //     receiptTankResponse = response;
  //   })
  //   .catch((error) => {
  //     receiptTankResponse = error;
  //   });

  res.status(200).json({
    status:
      masterVlcResponse?.status && campaignServiceResponse?.status === 'ok'
        ? 'Service all ready.'
        : 'Some services have problems.',
    azureAd: {
      status: 'ok',
      program: SystemConnectType.AZURE_AD,
    },
    masterVlc: masterVlcResponse,
    campaignService: campaignServiceResponse,
    // receiptTank: receiptTankResponse,
  });
}
