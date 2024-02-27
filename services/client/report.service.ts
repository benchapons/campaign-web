import axios, { AxiosResponse, CancelToken } from 'axios';

import http from '@/configurations/http.api';

import {
  CAMPAIGN,
  CLIENT_API_PATH,
  RECEIPT_TRANSACTION_REPORT, REPORT
} from '@/constants/bff-url';
import {
  GetReportRequestType,
  ReportTypeEnum,
  ResponseGetListReport,
  ResponsePostRequestReport
} from '@/types/report.type';
import { ResGetCampaignList } from './campaign.service';

// add filter by receiptDate
export async function getReceiptsByCampaignId(
  campaignId: string,
  filter?: {},
  cancelToken?: CancelToken
): Promise<any> {
  return new Promise(async (resolve, reject) => {
    http
      .get(`${REPORT}/receipts-of-campaign`, {
        params: { campaignId, ...filter },
        cancelToken: cancelToken,
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        if (!axios.isCancel(error)) {
          reject(error);
        }
      });
  });
}

export async function getCampaignName(params: any, cancelToken?: CancelToken): Promise<any> {
  return new Promise(async (resolve, reject) => {
    http
      .get(`${REPORT}/${CAMPAIGN}`, {
        params,
        cancelToken: cancelToken,
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        if (!axios.isCancel(error)) {
          reject(error);
        }
      });
  });
}

export async function getReceiptTransactionReport(params: any, cancelToken?: CancelToken): Promise<any> {
  return new Promise(async (resolve, reject) => {
    http
      .get(`${REPORT}/${RECEIPT_TRANSACTION_REPORT}`, {
        params,
        cancelToken: cancelToken,
      })
      .then((res) => {
        resolve(res?.data);
      })
      .catch((error) => {
        if (!axios.isCancel(error)) {
          reject(error);
        }
      });
  });
}

export async function getCampaignList(params: any = {}, cancelToken?: CancelToken): Promise<ResGetCampaignList[]> {
  return new Promise(async (resolve, reject) => {
    http
      .get(`${REPORT}/campaign-list`, {
        params,
        cancelToken: cancelToken,
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        if (!axios.isCancel(error)) {
          reject(error);
        }
      });
  });
}

// get more detail
export async function getCampaignListById(campaignId: string[], cancelToken?: CancelToken): Promise<any> {
  return new Promise(async (resolve, reject) => {
    http
      .get(`${REPORT}/get-campaign-list-by-id`, {
        params: { campaignCodeList: campaignId },
        cancelToken: cancelToken,
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        if (!axios.isCancel(error)) {
          reject(error);
        }
      });
  });
}

export async function getReportByParam<T>(
  params: GetReportRequestType,
  cancelToken?: CancelToken
): Promise<ResponseGetListReport<T>> {
  return new Promise(async (resolve, reject) => {
    http
      .get<ResponseGetListReport<T>, AxiosResponse<ResponseGetListReport<T>>>(`${REPORT}/${CLIENT_API_PATH.REPORT.GET_LIST_JOB}`, {
        params,
        cancelToken: cancelToken,
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        if (!axios.isCancel(error)) {
          reject(error);
        }
      });
  });
}

export async function deleteReportByRequestId(requestId: string): Promise<undefined> {
  return new Promise(async (resolve, reject) => {
    http
      .delete(`${REPORT}/${CLIENT_API_PATH.REPORT.DELETE_JOB}/${requestId}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export async function reSendEmailByRequestId(requestId: string): Promise<undefined> {
  return new Promise(async (resolve, reject) => {
    http
      .patch(`${REPORT}/${CLIENT_API_PATH.REPORT.RE_SENT_EMAIL}/${requestId}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export async function postRequestReport<T>(
  params: T,
  reportType: ReportTypeEnum
): Promise<ResponsePostRequestReport<T>> {
  return new Promise(async (resolve, reject) => {
    http
      .post(`${REPORT}/${CLIENT_API_PATH.REPORT.POST_REQUEST_JOB}/${reportType}`, {
        ...params,
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);

      });
  });
}
