import { LoggerService } from '@/services/server/logger.service';
import { DownstreamPayloadDto, LogRequest } from '@cx/spw-logger';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { v4 as uuidv4 } from 'uuid';

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
    return error?.message || 'error-unknow';
  }
};

const errorLog = (error: any, processTime: string) => {
  const payloadDownstream: DownstreamPayloadDto = new DownstreamPayloadDto();
  try {
    payloadDownstream.endpoint = `${error?.response?.config?.baseURL} ${error?.response?.config?.url}`;
    payloadDownstream.method = error?.response?.config?.method;
    payloadDownstream.processTime = processTime;
    payloadDownstream.id = '';
    if (error?.response) {
      payloadDownstream.response = error?.response?.data;
    }
    payloadDownstream.request = {
      headers: error?.response?.config?.headers || '',
      body: error?.response?.config?.data || {},
    };
    return payloadDownstream;
  } catch (error: any) {
    return error?.message || 'error-unknow';
  }
};

const timeout = process.env.TIME_OUT_SERVICE ? Number(process.env.TIME_OUT_SERVICE) : 60000;

const source = axios.CancelToken.source();
const headers = {
  'Content-Type': 'application/json',
  'X-Apig-AppCode': process.env.SPW_PORTAL_API_KEY,
};

const instance = axios.create({
  baseURL: process.env.SPW_PORTAL_ENDPOINT,
  headers,
  timeout: timeout,
  timeoutErrorMessage: 'Error Timeout',
  cancelToken: source.token,
});

instance.interceptors.request.use(
  (config: any) => {
    const uuid = uuidv4();
    config.headers.transid = uuid;
    config.headers.transchannel = 'Campaign Management';
    config.headers.transtimestamp = new Date().toISOString();
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
      logger.downstream(responseLog(response, `${durationTime} ms.`));
    } catch (error) {}
    return response;
  },
  (error: any) => {
    try {
      const arraySender = [
        error?.response?.config?.headers?.transchannel,
        error?.response?.config?.headers?.transid,
        error?.response?.config?.headers?.transtimestamp,
      ];
      const endDate: any = new Date();
      const durationTime = endDate - error?.response?.config?.headers?.metadata?.startDate;
      const logger = new LoggerService(arraySender.join(','));
      logger.error(errorLog(error, `${durationTime} ms.`), error?.message);
    } catch (error) {}
    return Promise.reject(error);
  }
);

export default instance;
