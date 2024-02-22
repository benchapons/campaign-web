export type HTTPDataType = {
  pathService?: string | string[];
  params?: any;
  body?: any;
  headers?: any;
};

export type UserAuthPayloadType = {
  userId: string;
  displayName: string;
};

export type UserAuthUpdatePayloadType = {
  userId: string;
  updatedBy: string;
};

export type Character =
  | 'Number'
  | 'Phone'
  | 'Thai'
  | 'Eng'
  | 'ThaiNumber'
  | 'EngNumber'
  | 'ThaiEng'
  | 'ThaiEngNumber'
  | 'Email'
  | null;

export interface CheckedWeekDaysType {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}
