import { startCase } from 'lodash';

import { building, rewardType, paymentMethod } from '@/constants/global';
import { CampaignCriteriaForm } from '@/types/campaign.type';
import { CheckedWeekDaysType } from '@/types/global.type';
import { decodeBase64 } from './encrypt';
import { OptionsDropdown } from '@/types/event.interface';

const XlsxPopulate = require('xlsx-populate');

export const convertBuilding = (data: string) => {
  return building?.[data] ? building?.[data] : data;
};

export const convertRewardType = (data: string) => {
  return rewardType?.[data] ? rewardType?.[data] : data;
};

export const convertPaymentMethod = (data: string) => {
  return paymentMethod?.[data] ? paymentMethod?.[data] : data;
};

export const onCheckedWeekFull = (reward: CheckedWeekDaysType) => {
  const { monday, tuesday, wednesday, thursday, friday, saturday, sunday } = reward;
  return monday && tuesday && wednesday && thursday && friday && saturday && sunday;
};
interface ParamFindCriteria {
  criteriaForm: CampaignCriteriaForm[];
  conditionId: string;
  tierId: string;
  rewardId: string;
}
export const onFindCriteria = ({ criteriaForm, conditionId, tierId, rewardId }: ParamFindCriteria) => {
  const condition = criteriaForm?.find((i: any) => i?._id === conditionId);
  const tier = condition?.spendingConditions?.find((i: any) => i?._id === tierId);
  const reward = tier?.rewards?.find((m: any) => m?._id === rewardId);
  return { condition, tier, reward };
};

interface CreateXLSXFileWithPasswordParam {
  data: any[];
  header: string[];
  fileName: string;
  password: string;
}

export const createXLSXFileWithPassword = async ({
  data,
  header,
  fileName,
  password,
}: CreateXLSXFileWithPasswordParam) => {
  const workbook = await XlsxPopulate.fromBlankAsync();
  let dataSheets = [header];

  if (data?.length) {
    const headerKey = Object.keys(data[0]);
    dataSheets = [...dataSheets, ...data.map((row) => headerKey.map((key) => row[key]))];
    dataSheets.unshift(headerKey?.map((i) => startCase(i)));
    dataSheets.shift();
  }
  workbook.sheet(0).cell('A1').value(dataSheets);

  // Protect the sheet with a password
  // Save the workbook to a buffer
  const buffer = await workbook.outputAsync({ password: decodeBase64(password) });

  // Create a Blob from the buffer
  const file = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

  // Create a download link for the XLSX file
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
};
export const convertBase64ToFile = (base64String: string, fileName: string) => {
  const buff = Buffer.from(base64String, 'base64');
  return new File([buff], fileName);
};

export const convertFileToBase64 = (file: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject;
  });

export const mapKeyLabelMaster = (masterList: OptionsDropdown[]) => {
  return Object.fromEntries(masterList.map((item, index) => [item.value, item.label]));
};

export const CheckValueArrayInArrayOfObjects = (results: string[], arrayOfObjects: any[]) => {
  for (let i = 0; i < arrayOfObjects.length; i++) {
    let obj = arrayOfObjects[i];
    for (let key in obj) {
      if (results.includes(obj[key])) {
        return true;
      }
    }
  }

  return false;
};
