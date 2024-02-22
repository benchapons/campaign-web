import axios, { CancelToken } from 'axios';

import http from '@/configurations/http.api';
import { CAMPAIGN, CONSTANTS, MASTER_DATA } from '@/constants/bff-url';

export interface ResGetCampaignList {
  _id: string;
  isStarted: boolean;
  building: string;
  code: string;
  cost: string;
  name: string;
  period: string;
  status: string;
}

export async function getCampaignList(params: any = {}, cancelToken?: CancelToken): Promise<ResGetCampaignList[]> {
  return new Promise(async (resolve, reject) => {
    http
      .get(CAMPAIGN, {
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

export async function getCampaignById(campaignId: string, cancelToken?: CancelToken): Promise<any> {
  return new Promise(async (resolve, reject) => {
    http
      .get(`${CAMPAIGN}/${campaignId}`, {
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

export async function draftCampaignInfo(payload: any, cancelToken?: CancelToken): Promise<any> {
  return new Promise(async (resolve, reject) => {
    http
      .post(`${CAMPAIGN}`, {
        ...payload,
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

export async function draftCampaignCriteria(payload: any, cancelToken?: CancelToken): Promise<any> {
  return new Promise(async (resolve, reject) => {
    http
      .put(`${CAMPAIGN}`, {
        ...payload,
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

export async function duplicateCampaign(campaignId: string, cancelToken?: CancelToken): Promise<any> {
  return new Promise(async (resolve, reject) => {
    http
      .post(`${CAMPAIGN}/${campaignId}`, {
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

export async function updateSpecialCampaign(campaignId: string, payload: any, cancelToken?: CancelToken): Promise<any> {
  return new Promise(async (resolve, reject) => {
    http
      .put(`${CAMPAIGN}/${campaignId}`, {
        ...payload,
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

export async function createCampaign(payload: any, cancelToken?: CancelToken): Promise<any> {
  return new Promise(async (resolve, reject) => {
    http
      .patch(`${CAMPAIGN}`, {
        ...payload,
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

export async function deleteCampaign(campaignId: string, cancelToken?: CancelToken): Promise<any> {
  return new Promise(async (resolve, reject) => {
    http
      .delete(`${CAMPAIGN}/${campaignId}`, {
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
