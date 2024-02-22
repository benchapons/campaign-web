import { AxiosError } from 'axios';
import campaignServiceAPI from '@/configurations/service.api';
import masterAPI from '@/configurations/master.api';

import { LivenessHealthCheckType, SystemConnectType, VlcHealthCheckType } from '@/types/readiness.type';
import ReportServiceClient from '@/configurations/report-service.api';

export const healthCheckCampaignService = (): Promise<LivenessHealthCheckType<AxiosError>> => {
  return new Promise(async (resolve, reject) => {
    campaignServiceAPI
      .get<LivenessHealthCheckType<AxiosError>>('/v1/healthcheck/liveness')
      .then((response) => {
        resolve({ ...response.data, program: SystemConnectType.CAMPAIGN_SERVICE });
      })
      .catch((error) => {
        reject({
          status: 'error',
          program: SystemConnectType.CAMPAIGN_SERVICE,
          msg: error?.message,
        });
      });
  });
};

export const healthCheckReceiptTank = (): Promise<LivenessHealthCheckType<AxiosError>> => {
  return new Promise(async (resolve, reject) => {
    ReportServiceClient.get<LivenessHealthCheckType<AxiosError>>('/v1/healthcheck/liveness')
      .then((response) => {
        resolve({ ...response.data, program: SystemConnectType.RECEIPT_TANK });
      })
      .catch((error) => {
        reject({
          status: 'error',
          program: SystemConnectType.RECEIPT_TANK,
          msg: error?.message,
        });
      });
  });
};

export const masterVlcGet = (): Promise<VlcHealthCheckType<AxiosError>> => {
  return new Promise(async (resolve, reject) => {
    masterAPI
      .get<VlcHealthCheckType<AxiosError>[]>('/paramtype/get')
      .then(() => {
        resolve({
          status: 'ok',
          program: SystemConnectType.MASTER_VLC,
        });
      })
      .catch((error) => {
        reject({
          status: 'error',
          program: SystemConnectType.MASTER_VLC,
          msg: error,
        });
      });
  });
};
