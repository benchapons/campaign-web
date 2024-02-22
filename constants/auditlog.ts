export const AUDIT_LOG_PAGE = {
  CAMPAIGN: 'campaign',
  REWARD: 'reward',
  MASTER: 'master',
  REPORT_01: 'report_01',
  REPORT_02: 'report_02',
  REPORT_03: 'report_03',
  REPORT_04: 'report_04',
  REPORT_05: 'report_05',
};

export const OWNER_ID_REPORT = {
  REPORT_01: 'rpt-redemption-01',
  REPORT_02: 'rpt-redemption-02',
  REPORT_03: 'rpt-redemption-03',
  REPORT_04: 'rpt-redemption-04',
  REPORT_05: 'rpt-redemption-05',
};

export const AUDIT_LOG_OPTIONS = [
  { value: 'CMP_CREATE', label: 'Campaign Create', page: [AUDIT_LOG_PAGE.CAMPAIGN] },
  { value: 'CMP_UPDATE', label: 'Campaign Update', page: [AUDIT_LOG_PAGE.CAMPAIGN] },
  { value: 'CMP_DELETE', label: 'Campaign Delete', page: [] },
  { value: 'RWD_CREATE', label: 'Reward Create', page: [AUDIT_LOG_PAGE.REWARD] },
  { value: 'RWD_UPDATE', label: 'Reward Update', page: [AUDIT_LOG_PAGE.REWARD] },
  { value: 'RWD_DELETE', label: 'Reward Delete', page: [] },
  { value: 'MST_CREATE', label: 'Master Create', page: [AUDIT_LOG_PAGE.MASTER] },
  { value: 'MST_UPDATE', label: 'Master Update', page: [AUDIT_LOG_PAGE.MASTER] },
  { value: 'MST_DISABLE', label: 'Master Disable', page: [AUDIT_LOG_PAGE.MASTER] },
  { value: 'RWD_ADJUST', label: 'Reward Adjust', page: [AUDIT_LOG_PAGE.REWARD, AUDIT_LOG_PAGE.CAMPAIGN] },
  {
    value: 'RPT_EXTRACT_01',
    label: 'Report Extraction: Redemption Transaction by Condition',
    page: [AUDIT_LOG_PAGE.REPORT_01],
  },
  {
    value: 'RPT_EXTRACT_02',
    label: 'Report Extraction: Redemption Transaction by receipt',
    page: [AUDIT_LOG_PAGE.REPORT_02],
  },
  {
    value: 'RPT_EXTRACT_03',
    label: 'Report Extraction: Bank Promotion',
    page: [AUDIT_LOG_PAGE.REPORT_03],
  },
  {
    value: 'RPT_EXTRACT_04',
    label: 'Report Extraction: Summary Redemption Reward',
    page: [AUDIT_LOG_PAGE.REPORT_04],
  },
  {
    value: 'RPT_EXTRACT_05',
    label: 'Report Extraction: Receipt Transaction Report',
    page: [AUDIT_LOG_PAGE.REPORT_05],
  },
];

export const AUDIT_LOG_EVENTS = {
  CMP_CREATE: 'CMP_CREATE',
  CMP_UPDATE: 'CMP_UPDATE',
  CMP_DELETE: 'CMP_DELETE',
  RWD_CREATE: 'RWD_CREATE',
  RWD_UPDATE: 'RWD_UPDATE',
  RWD_DELETE: 'RWD_DELETE',
  RWD_ADJUST: 'RWD_ADJUST',
  MST_UPDATE: 'MST_UPDATE',
  MST_CREATE: 'MST_CREATE',
  MST_DISABLE: 'MST_DISABLE',
  RPT_EXTRACT_01: 'RPT_EXTRACT_01',
  RPT_EXTRACT_02: 'RPT_EXTRACT_02',
  RPT_EXTRACT_03: 'RPT_EXTRACT_03',
  RPT_EXTRACT_04: 'RPT_EXTRACT_04',
  RPT_EXTRACT_05: 'RPT_EXTRACT_05',
};
