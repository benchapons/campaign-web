import { OptionsDropdown } from '@/types/event.interface';

export const building: any = {
  '3001': 'Siam Paragon',
  '1001': 'Siam Center',
  '1002': 'Siam Discovery',
  '5001': 'ICONSIAM',
  '5031': 'ICS',
  '6001': 'Siam Premium Outlets',
};

export const days: any = {
  monday: 'จ',
  tuesday: 'อ',
  wednesday: 'พ',
  thursday: 'พฤ',
  friday: 'ศ',
  saturday: 'ส',
  sunday: 'อ',
};

//REWARD_TYPE
export const rewardType: any = {
  VIZ_COINS: 'ONESIAM Coins',
  E_VOUCHER: 'E-Voucher',
  BANK_PARTNER: 'Bank Partner',
  PARTNER_CODE: 'Partner Code',
  VOUCHER_CODE: 'Physical/Voucher Code',
  PHYSICAL_GIFT_CARD: 'Physical Gift Card',
  PHYSICAL_GIFT: 'Physical Gift',
  TOP_SPENDER: 'Ended Campaign - Top Spender',
  LUCKY_DRAW: 'Ended Campaign - Lucky draw',
};

export const RedemptionStatusList: OptionsDropdown[] = [
  { label: 'Create', value: 'CREATED' },
  { label: 'Redeemed', value: 'REDEEMED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

export const paymentMethod: any = {
  CASH: 'Cash',
  CREDIT_CARD_VISA: 'Credit Card - Visa',
  CREDIT_CARD_JCB: 'Credit Card - JCB',
  CREDIT_CARD_UNION_PAY: 'Credit Card - Union Pay',
  CREDIT_CARD_AMEX: 'Credit Card - Amex',
  QR_CODE: 'QR Code',
  CREDIT_CARD_MASTER_CARD: 'Credit Card - Master Card',
  ALIPAY: 'Alipay',
  WE_CHAT: 'We Chat',
};

export const regexFormat = {
  colorCode: /^#(?:[0-9a-fA-F]{3}){1,2}$/,
};

export const AllOptionValue = 'ALL';

export const AllBuildOption: OptionsDropdown = {
  label: 'All',
  value: AllOptionValue,
};

export const PULLING_TIME = 5;
