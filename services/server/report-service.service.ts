import { AxiosError, AxiosResponse } from 'axios';
import ReportServiceClient from '@/configurations/report-service.api';
import { transformError } from '@/dto/error.dto';
import { HTTPDataType } from '@/types/global.type';

type ReportServiceType = {
  get: <T>(params: HTTPDataType) => Promise<T>;
  post: <T>(params: HTTPDataType) => Promise<T>;
  delete: <T>(params: HTTPDataType) => Promise<T>;
  patch: <T>(params: HTTPDataType) => Promise<T>;
};

const ReportService: ReportServiceType = {
  get: <T>({ pathService, params, headers }: HTTPDataType): Promise<T> => {
    return new Promise((resolve, reject) => {
      ReportServiceClient.get<T, AxiosResponse<T>>(`${pathService}`, {
        params: { ...params },
        headers: { ...headers },
      })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error: AxiosError) => {
          reject(error);
        });
    });
  },
  post: <T>({ pathService, body, headers }: HTTPDataType): Promise<T> => {
    return new Promise((resolve, reject) => {
      ReportServiceClient.post<T, AxiosResponse<T>>(`${pathService}`, { ...body }, { headers })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error: AxiosError) => {
          reject(error);
        });
    });
  },
  delete: <T>({ pathService, headers, body }: HTTPDataType): Promise<T> => {
    return new Promise((resolve, reject) => {
      ReportServiceClient
        .delete<T, AxiosResponse<T>>(`${pathService}`, {
          data: body,
          headers: { ...headers },
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error: AxiosError) => {
          reject(error);
        });
    });
  },
  patch: <T>({ pathService, body, headers }: HTTPDataType): Promise<T> => {
    return new Promise((resolve, reject) => {
      ReportServiceClient
        .patch<T, AxiosResponse<T>>(`${pathService}`, { ...body }, { headers })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error: AxiosError) => {
          reject(error);
        });
    });
  },
};

export default ReportService;
