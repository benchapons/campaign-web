import { SwalCustom } from '@/configurations/alert';
import { LIMIT_IMG_UPLOAD_SIZE } from '@/constants/file';

export const validateFileSizeType = (fileSize: number, fileType: string): boolean => {
  if (fileSize > LIMIT_IMG_UPLOAD_SIZE) {
    SwalCustom.fire('ตรวจสอบ', `ขนาดไฟล์ต้องไม่เกิน ${LIMIT_IMG_UPLOAD_SIZE / 1024 / 1024} MB`, 'warning');
    return false;
  } else if (!['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/bmp'].includes(fileType)) {
    SwalCustom.fire('ตรวจสอบ', `ต้องเป็นไฟล์สกุล JPEG, JPG, PNG, GIF, BMP เท่านั้น`, 'warning');
    return false;
  }
  return true;
};
