import dayjs from 'dayjs';
import floor from 'lodash/floor';
import { convertFileToBase64 } from './global';

export const numberWithCommas = (data: number) => {
  if (!data) return '0';

  const [num, decimal] = data.toString().split('.');
  if (decimal) {
    return `${num.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${decimal}`;
  }
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const numberWithCommasToFixed = (data: number, number: number) => {
  const [num, decimal] = floor(data, number).toFixed(number).toString().split('.');

  if (!number) return `${num.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;

  return `${num.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${decimal}`;
};

export const convertDateByFormat = (date: string | null | undefined, format: string) => {
  return dayjs(date).format(format);
};

export const resolveName = (path: any, obj: any) => {
  return path.split('.').reduce((prev: any, curr: any) => {
    return prev ? prev[curr] : null;
  }, obj || window.self);
};

export const checkDateBetween = (start: string, end: string) => {
  const newStartDate = new Date(start).toLocaleString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Asia/Bangkok',
  });

  const newEndDate = new Date(end).toLocaleString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Asia/Bangkok',
  });

  const startDate = Date.parse(newStartDate);
  const endDate = Date.parse(newEndDate);

  const newDate = new Date().toLocaleString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Asia/Bangkok',
  });

  const nowDate = Date.parse(newDate);

  return nowDate <= endDate && nowDate >= startDate;
};

export const markPhoneNumber = (phoneNumber: string | null) => {
  if (phoneNumber) {
    const start = phoneNumber.slice(0, 3);
    const end = phoneNumber.slice(-4);
    const mark = phoneNumber
      .slice(3, phoneNumber.length - 4)
      .split('')
      ?.map(() => {
        return 'X';
      })
      ?.join('');
    return `${start}${mark}${end}`;
  }

  return '-';
};

// 25 ก.ค. 23  DD MMM YY
export const formatDateThai = (date: string | Date) =>
  new Date(date).toLocaleDateString('th-TH', {
    year: '2-digit',
    month: 'short',
    day: 'numeric',
    timeZone: 'Asia/Bangkok',
  });

// 25 ก.ค. 23 17:00  DD MMM YY HH:mm
export const formatDateTimeThai = (date: string | Date) =>
  new Date(date).toLocaleDateString('th-TH', {
    year: '2-digit',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Bangkok',
  });

export const dateTimeBangkok = () => {
  const newDate = new Date().toLocaleString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    hour12: false,
    minute: '2-digit',
    timeZone: 'Asia/Bangkok',
  });
  return {
    month: newDate?.slice(0, 2),
    day: newDate?.slice(3, 5),
    year: newDate?.slice(6, 10),
    year2: newDate?.slice(8, 10),
  };
};

// name_YYMMDD
// name_230930
export const formatDateFileNameReport = (fileName: string) => {
  const { year2, month, day } = dateTimeBangkok();
  return `${fileName}_${year2}${month}${day}.xlsx`;
};

//DD-MMM-YY
//15-Aug-23
export const formatDateShotEng = (date: string | Date) => {
  const newDate = new Date(date).toLocaleString('en-ZA', {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
    timeZone: 'Asia/Bangkok',
  });

  return newDate?.replaceAll(' ', '-');
};

//DD/MMM/YYYY
//15/01/2023
export const formatDate = (date: string | Date) => {
  return dayjs(date).format('DD/MM/YYYY');
};

//DD/MMM/YYYY HH:mm
//15/01/2023 12:36
export const formatDateTime = (date: string | Date) => {
  return dayjs(date).format('DD/MM/YYYY HH:mm');
};

//DD-MMM-YY
//15-Aug-23
export const FormatDateTimeAndShotEng = (date: string | Date): string => {
  const dateFormat = new Date(date).toLocaleString('en-ZA', {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
    timeZone: 'Asia/Bangkok',
  });

  const timeSetFormat = new Date(date).toLocaleString('en-ZA', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Bangkok',
  });

  return `${dateFormat?.replaceAll(' ', '-')} ${timeSetFormat}`;
};

//DD-MM-YYYY
export const formatDateEng = (date: string | Date) => {
  return new Date(date).toLocaleString('nl-NL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Asia/Bangkok',
  });
};

export const checkEndDate = (end: string) => {
  const newEndDate = new Date(end).toLocaleString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Asia/Bangkok',
  });

  const endDate = Date.parse(newEndDate);

  const newDate = new Date().toLocaleString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Asia/Bangkok',
  });

  const nowDate = Date.parse(newDate);

  return nowDate > endDate;
};

export const formatBytes = (bytes: any, decimals = 2) => {
  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const formatFileBase64 = async (file: File) => {
  const base64 = await convertFileToBase64(file);
  const base64String = base64.split(',')[1];

  const fileData = {
    name: file.name,
    size: file.size,
    type: file.type,
    encodeUrl: base64String,
    // file: file,
  };
  return fileData;
};

export const transformMapMaster = (data: any[]): string => {
  return data?.length
    ? data?.reduce((acc, cur) => {
        return Object.assign(acc, { [cur?.value]: cur?.label });
      }, {})
    : {};
};
