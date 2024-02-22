export type ChangeEventBaseType<T = string> = {
  /**
   * Event name
   */
  name: string;
  /**
   * Event value
   */
  value: T;
  checked?: boolean;
  id?: T | number;
  data?: any;
  masterId?: string;
};

export type ChangeEventBaseNumberType<T = string | number> = {
  /**
   * Event name
   */
  name: string;
  /**
   * Event value
   */
  value: T;
  checked?: boolean;
  data?: any;
};

export type ChangeEventMultiBaseType<T = string> = {
  /**
   * Event name
   */
  name: T;
  /**
   * Event value
   */
  value: T[];
  data?: any;
  desc?: string;
  checked?: boolean;
};

export type ChangeEventFileType<T = File> = {
  /**
   * Event name
   */
  name: string;
  /**
   * Event value
   */
  value: T;
};

export type OptionsDropdown = {
  label: string;
  value: string;
  id?: string | number;
  data?: any;
  masterId?: string;
  prefix?: string;
  desc?: string;
  color?: string;
  isDisabled?: boolean;
};
