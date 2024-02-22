import { LoggerService } from '@/services/server/logger.service';
import { DownstreamPayloadDto, LogRequest } from '@cx/spw-logger';
import axios, { AxiosResponse } from 'axios';

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
    return error?.message || 'error-unknown';
  }
};

const timeout = process.env.TIME_OUT_SERVICE ? Number(process.env.TIME_OUT_SERVICE) : 60000;

const instance = axios.create({
  baseURL: process.env.MASTER_DATA_CS_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Apig-AppCode': process.env.MASTER_DATA_CS_KEY,
  },
  timeout: timeout,
  timeoutErrorMessage: 'Error Timeout',
  maxContentLength: 20000000,
});

instance.interceptors.response.use(
  (response: any) => {
    try {
      const metaDataObj = JSON.parse(response?.config?.headers?.metadata);
      const endDate: any = new Date();
      const startDate: any = new Date(metaDataObj.startDate);
      const durationTime = endDate - startDate;
      const arraySender = [
        response?.config?.headers?.transchannel,
        response?.config?.headers?.transid,
        response?.config?.headers?.transtimestamp,
      ];
      const logger = new LoggerService(arraySender.join(','));
      logger.downstream(responseLog(response, `${durationTime} ms.`));
    } catch (error) {}
    return response;
  },
  (error: any) => {
    if (axios.isCancel(error)) return Promise.reject(error);
    try {
      const metaDataObj = JSON.parse(error?.response?.config?.headers?.metadata);
      const endDate: any = new Date();
      const startDate: any = new Date(metaDataObj.startDate);
      const durationTime = endDate - startDate || 0;
      const arraySender = [
        error?.response?.config?.headers?.transchannel,
        error?.response?.config?.headers?.transid,
        error?.response?.config?.headers?.transtimestamp,
      ];
      const logger = new LoggerService(arraySender.join(','));
      logger.error(errorLog(error, `${durationTime} ms.`), error?.message);
    } catch (error) {}
    return Promise.reject(error);
  }
);

export default instance;
