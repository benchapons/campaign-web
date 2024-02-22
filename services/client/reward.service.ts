import axios, { CancelToken } from 'axios';

import http from '@/configurations/http.api';
import { REWARD, TRACKING } from '@/constants/bff-url';
import { RewardGroupTypeEnum } from '@/constants/enum';

export async function getRewardList(params: any = {}, cancelToken?: CancelToken): Promise<any> {
  return new Promise(async (resolve, reject) => {
    http
      .get(REWARD, {
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

interface GetRewardByIdParam {
  isAdjustment: boolean;
  rewardGroupType: RewardGroupTypeEnum;
}

export async function getRewardById(
  rewardId: string,
  params: GetRewardByIdParam,
  cancelToken?: CancelToken
): Promise<any> {
  return new Promise(async (resolve, reject) => {
    http
      .get(`${REWARD}/${rewardId}`, {
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

export async function createReward(payload: any, cancelToken?: CancelToken): Promise<any> {
  return new Promise(async (resolve, reject) => {
    http
      .post(REWARD, {
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

export async function updateReward(rewardId: string, payload: any, cancelToken?: CancelToken): Promise<any> {
  return new Promise(async (resolve, reject) => {
    http
      .put(`${REWARD}/${rewardId}`, {
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

export async function updateSpecialReward(rewardId: string, payload: any, cancelToken?: CancelToken): Promise<any> {
  return new Promise(async (resolve, reject) => {
    http
      .patch(`${REWARD}/${rewardId}`, {
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

export async function deleteReward(rewardId: string, cancelToken?: CancelToken): Promise<any> {
  return new Promise(async (resolve, reject) => {
    http
      .delete(`${REWARD}/${rewardId}`, {
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

export async function getRewardByCampaignId(campaignId: string, cancelToken?: CancelToken): Promise<any> {
  return new Promise(async (resolve, reject) => {
    http
      .get(`${REWARD}/${TRACKING}`, {
        params: { campaignId },
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

export async function adjustmentReward(rewardId: string, payload: any, cancelToken?: CancelToken): Promise<any> {
  return new Promise(async (resolve, reject) => {
    http
      .post(`${REWARD}/${rewardId}`, {
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
