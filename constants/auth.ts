import { PagePermissionType } from '@/types/auth.type';

export enum Permission {
  CAMP_SEARCH = 'CAMP_SEARCH',
  CAMP_CREATE = 'CAMP_CREATE',
  CAMP_UPDATE = 'CAMP_UPDATE',
  CAMP_DELETE = 'CAMP_DELETE',
  CAMP_AFGL_UPDATE = 'CAMP_AFGL_UPDATE',
  CAMP_PERX_UPDATE = 'CAMP_PERX_UPDATE',
  RWD_SEARCH = 'RWD_SEARCH',
  RWD_CREATE = 'RWD_CREATE',
  RWD_UPDATE = 'RWD_UPDATE',
  RWD_AFGL_UPDATE = 'RWD_AFGL_UPDATE',
  RWD_SENS_UPDATE = 'RWD_SENS_UPDATE',
  RWD_DELETE = 'RWD_DELETE',
  RWD_PERX_UPDATE = 'RWD_PERX_UPDATE',
  RPT_REDEMP_01 = 'RPT_REDEMP_01',
  RPT_REDEMP_02 = 'RPT_REDEMP_02',
  RPT_REDEMP_03 = 'RPT_REDEMP_03',
  RPT_REDEMP_04 = 'RPT_REDEMP_04',
  RPT_REDEMP_05 = 'RPT_REDEMP_05',
  RPT_REDEMP_06 = 'RPT_REDEMP_06',
  RPT_REDEMP_07 = 'RPT_REDEMP_07',
  VW_AUDIT_LOG = 'VW_AUDIT_LOG',
  VW_MAST_AUDIT_LOG = 'VW_MAST_AUDIT_LOG',
  MASTER_MENU = 'MASTER_MENU',
  MASTER_SEARCH = 'MASTER_SEARCH',
  MASTER_CREATE = 'MASTER_CREATE',
  MASTER_UPDATE = 'MASTER_UPDATE',
  MASTER_DELETE = 'MASTER_DELETE',
}

export const PagePermission: PagePermissionType = {
  home: {
    title: 'Home',
    permission: [],
  },
  campaignSearch: {
    title: 'Campaign',
    permission: [Permission.CAMP_SEARCH],
  },
  campaignCreate: {
    title: 'Create Campaign',
    permission: [Permission.CAMP_CREATE],
  },
  campaignUpdate: {
    title: 'Edit Campaign',
    permission: [Permission.CAMP_UPDATE],
  },
  rewardSearch: {
    title: 'Reward',
    permission: [Permission.RWD_SEARCH],
  },
  rewardCreate: {
    title: 'Create Reward',
    permission: [Permission.RWD_CREATE],
  },
  rewardUpdate: {
    title: 'Edit Reward',
    permission: [Permission.RWD_UPDATE],
  },
  auditLog: {
    title: 'Audit Log',
    permission: [Permission.VW_AUDIT_LOG, Permission.VW_MAST_AUDIT_LOG],
  },
  report_01: {
    title: 'Redemption transaction by condition',
    permission: [Permission.RPT_REDEMP_01],
  },
  report_02: {
    title: 'Redemption transaction by receipt',
    permission: [Permission.RPT_REDEMP_02],
  },
  report_03: {
    title: 'Bank promotion',
    permission: [Permission.RPT_REDEMP_03],
  },
  report_04: {
    title: 'Summary redemption report',
    permission: [Permission.RPT_REDEMP_04],
  },
  report_05: {
    title: 'Receipt transaction report',
    permission: [Permission.RPT_REDEMP_05],
  },
  masterSearch: {
    title: 'Master Management',
    permission: [Permission.MASTER_SEARCH],
  },
  masterCreate: {
    title: 'Create Master Management',
    permission: [Permission.MASTER_CREATE],
  },
  masterUpdate: {
    title: 'Edit Master Management',
    permission: [Permission.MASTER_UPDATE],
  },
};
