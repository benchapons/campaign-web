import axios, { CancelToken } from 'axios';

import http from '@/configurations/http.api';
import { CONSTANTS, MASTER_DATA, MASTER_SPW } from '@/constants/bff-url';

export async function getMasterData(group: string, cancelToken?: CancelToken): Promise<any> {
  return new Promise(async (resolve, reject) => {
    http
      .get(`${MASTER_DATA}/${group}`, {
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

export async function getMasterDataCS(group: string, cancelToken?: CancelToken): Promise<any> {
  return new Promise(async (resolve, reject) => {
    http
      .get(`${MASTER_SPW}/${group}`, {
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

export async function getMasterConstant(group: string, cancelToken?: CancelToken): Promise<any> {
  return new Promise(async (resolve, reject) => {
    http
      .get(`${MASTER_DATA}/${CONSTANTS}/${group}`, {
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
