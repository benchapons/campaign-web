import { DownstreamPayloadDto, LogRequest } from '@cx/spw-logger';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { v4 as uuidv4 } from 'uuid';

import { transformError } from '@/dto/error.dto';
import { LoggerService } from '@/services/server/logger.service';

const timeout = 30000; //process.env.TIME_OUT_SERVICE ? Number(process.env.TIME_OUT_SERVICE) : 60000;

const responseLog = (responseData: AxiosResponse, processTime: string) => {
  const payloadDownstream: DownstreamPayloadDto = new DownstreamPayloadDto();
  const requestSpwLog: LogRequest = new LogRequest();
  try {
    payloadDownstream.endpoint = `${responseData?.config?.baseURL}${responseData?.config?.url}`;
    payloadDownstream.method = responseData?.config?.method;
    payloadDownstream.id = '';
    payloadDownstream.processTime = processTime;
    requestSpwLog.headers = responseData?.config?.headers || '';
    requestSpwLog.body = responseData?.config?.data;
    payloadDownstream.request = requestSpwLog;
    payloadDownstream.response = {
      headers: responseData?.headers || '',
      data: responseData?.data,
    };
    return payloadDownstream;
  } catch (error: any) {
    return error?.message || 'error-unknown';
  }
};

let source = axios.CancelToken.source();
const instance = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: timeout,
  timeoutErrorMessage: 'Error Timeout',
  cancelToken: source.token,
});

instance.interceptors.request.use(
  async (config: any) => {
    const time = new Date().toISOString();
    const uuid = uuidv4();
    config.headers.transID = uuid;
    config.headers.transChannel = 'Campaign Management';
    config.headers.metadata = { startDate: time };
    config.headers.transtimestamp = time;
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response: any) => {
    try {
      const arraySender = [
        response?.config?.headers?.transchannel,
        response?.config?.headers?.transid,
        response?.config?.headers?.transtimestamp,
      ];

      const endDate: any = new Date();
      const durationTime = endDate - response?.config?.headers?.metadata?.startDate;
      const logger = new LoggerService(arraySender.join(','));
      // logger.downstream(responseLog(response, `${durationTime} ms.`));
    } catch (error) {}
    return response;
  },
  (error: any) => {
    if (axios.isCancel(error)) return Promise.reject(error);
    return Promise.reject(transformError(error));
  }
);

export default instance;
