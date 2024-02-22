import axios, { CancelToken } from 'axios';

import http from '@/configurations/http.api';
import { AUDIT_LOG } from '@/constants/bff-url';

export async function getSearchAuditlog(params: any, cancelToken?: CancelToken): Promise<any> {
  return new Promise(async (resolve, reject) => {
    http
      .get(AUDIT_LOG, {
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
