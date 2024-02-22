import { AxiosError, AxiosResponse } from 'axios';
import http from '@/configurations/service.api';
import { transformError } from '@/dto/error.dto';
import { HTTPDataType } from '@/types/global.type';

type ServiceType = {
  get: (params: HTTPDataType) => Promise<any | null>;
  put: (body: HTTPDataType) => Promise<any | null>;
  post: (body: HTTPDataType) => Promise<any | null>;
  delete: (params: HTTPDataType) => Promise<any | null>;
  patch: (params: HTTPDataType) => Promise<any | null>;
};

const CampaignService: ServiceType = {
  get: ({ pathService, params, headers }: HTTPDataType) => {
    return new Promise((resolve, reject) => {
      http
        .get<any, AxiosResponse<any>>(`${pathService}`, {
          params: { ...params },
          headers: { ...headers },
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error: AxiosError) => {
          reject(transformError(error));
        });
    });
  },
  put: ({ pathService, body, headers }: HTTPDataType) => {
    return new Promise((resolve, reject) => {
      http
        .put<any, AxiosResponse<any>>(`${pathService}`, { ...body }, { headers })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error: AxiosError) => {
          reject(transformError(error));
        });
    });
  },
  post: ({ pathService, body, headers }: HTTPDataType) => {
    return new Promise((resolve, reject) => {
      http
        .post<any, AxiosResponse<any>>(`${pathService}`, { ...body }, { headers })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error: AxiosError) => {
          reject(transformError(error));
        });
    });
  },
  delete: ({ pathService, params, headers, body }: HTTPDataType) => {
    return new Promise((resolve, reject) => {
      http
        .delete<any, AxiosResponse<any>>(`${pathService}`, {
          data: body,
          headers: { ...headers },
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error: AxiosError) => {
          reject(transformError(error));
        });
    });
  },
  patch: ({ pathService, body, headers }: HTTPDataType) => {
    return new Promise((resolve, reject) => {
      http
        .patch<any, AxiosResponse<any>>(`${pathService}`, { ...body }, { headers })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error: AxiosError) => {
          reject(transformError(error));
        });
    });
  },
};

export default CampaignService;
