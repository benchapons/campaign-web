export const ERROR_CODE_API: any = {
  'CAM-BF-00': 'เซิฟเวอร์ไม่สามารถทำงานได้ กรุณาติดต่อเจ้าหน้าที่',
  'CAM-BF-01': 'ไม่เจอ Path Service นี้',
  'CAM-BF-02': 'ไม่สามารถเชื่อมต่อเซิฟเวอร์ได้ กรุณาติดต่อเจ้าหน้าที่',
  'CAM-TE-00': 'เซิฟเวอร์ไม่สามารถทำงานได้ กรุณาติดต่อเจ้าหน้าที่',
  'CAM-TE-01': 'ไม่เจอ Path Service นี้',
  'CAM-TE-02': 'กรุณาใส่ข้อมูลที่จำเป็นให้ครบ หรือ กรุณาติดต่อเจ้าหน้าที่',
  'CAM-TE-03': 'Server time out.',
  'CAM-CM-00': 'ไม่สามารถทำรายการได้',
  'CMP-CP-01': 'ไม่พบ Campaign ในระบบ',
  'CMP-CP-02': 'ไม่พบ Reward Master ในระบบ',
  'CMP-RW-01': 'ไม่พบ Reward ในระบบ',
  'CMP-RW-02': 'ไม่สามารถลบ Reward ได้ เนื่องจาก Reward นี้ถูกนำไปใช้กับ Campaign แล้ว',
};

export const ERROR_CODE_AUTH = {
  'CAM-AU-00': 'Bff Error: User not found',
  'CAM-AU-01': 'Bff Error: Invalid access token',
  'CAM-AU-02': 'Bff Error: Session expired',
  'CAM-AU-03': 'Bff Error: No permission allowed',
  'CAM-AU-04': 'Bff Error: Unauthorized',
};
