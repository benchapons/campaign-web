import { AxiosError } from 'axios';
import { ERROR_CODE_API } from '@/constants/error-code';

export type ErrorPayloadType = {
  errorCode: string;
  errorMessageTh: string;
  errorMessage: string | string[];
  errorDebugMessage: string | string[];
};

export const transformError = (error: any): ErrorPayloadType => {
  let ERROR_MSG: ErrorPayloadType = {
    errorCode: 'CAM-TE-00',
    errorMessageTh: ERROR_CODE_API['CAM-TE-00'],
    errorMessage: 'Intenal server error.',
    errorDebugMessage: '',
  }; //500

  if (error?.code === 'ETIMEDOUT' || error?.code === 'ECONNABORTED') {
    ERROR_MSG.errorCode = 'CAM-TE-03';
    ERROR_MSG.errorMessageTh = ERROR_CODE_API['CAM-TE-03'];
    ERROR_MSG.errorMessage = 'Server timeout.';
  } // timeout

  // service code
  if (error?.response?.data?.errorCode && ERROR_CODE_API[error?.response?.data?.errorCode]) {
    ERROR_MSG.errorCode = error?.response?.data?.errorCode;
    ERROR_MSG.errorMessageTh = ERROR_CODE_API[error?.response?.data?.errorCode];
    ERROR_MSG.errorMessage = error?.response?.data?.errorMessage;
  } else if (error?.response?.data?.errorCode) {
    ERROR_MSG.errorCode = 'CAM-CM-00';
    ERROR_MSG.errorMessageTh = ERROR_CODE_API['CAM-CM-00'];
    ERROR_MSG.errorMessage = error?.response?.data?.errorMessage;
  }

  ERROR_MSG.errorDebugMessage = error?.response?.data?.errorDebugMessage;

  return ERROR_MSG;
};

export const transformBffError = (error: any): ErrorPayloadType => {
  let ERROR_MSG: ErrorPayloadType = {
    errorCode: 'CAM-BF-00',
    errorMessageTh: ERROR_CODE_API['CAM-BF-00'],
    errorMessage: 'Intenal server error.',
    errorDebugMessage: '',
  }; //500

  if (error?.code === 'ETIMEDOUT' || error?.code === 'ECONNABORTED') {
    ERROR_MSG.errorCode = 'CAM-BF-02';
    ERROR_MSG.errorMessageTh = ERROR_CODE_API['CAM-BF-02'];
    ERROR_MSG.errorMessage = 'Server timeout.';
  } // timeout

  // service code
  if (error?.response?.data?.errorCode && ERROR_CODE_API[error?.response?.data?.errorCode]) {
    ERROR_MSG.errorCode = error?.response?.data?.errorCode;
    ERROR_MSG.errorMessageTh = ERROR_CODE_API[error?.response?.data?.errorCode];
    ERROR_MSG.errorMessage = error?.response?.data?.errorMessage;
  } else if (error?.response?.data?.errorCode) {
    ERROR_MSG.errorCode = 'CAM-CM-00';
    ERROR_MSG.errorMessageTh = ERROR_CODE_API['CAM-CM-00'];
    ERROR_MSG.errorMessage = error?.response?.data?.errorMessage;
  }
  ERROR_MSG.errorDebugMessage = error?.response?.data?.errorDebugMessage;

  return ERROR_MSG;
};
