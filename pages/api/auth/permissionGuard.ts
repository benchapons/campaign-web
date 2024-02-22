import { ERROR_CODE_AUTH } from '@/constants/error-code';
import { UserPageTransformType } from '@/types/auth.type';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

const permissionGuard = (permission: string[], userpage: UserPageTransformType, res: NextApiResponse<any>) => {
  if (!permission.some((item) => userpage[item])) {
    return res.status(403).json(ERROR_CODE_AUTH['CAM-AU-03']);
  }

  return NextResponse.next();
};
export default permissionGuard;
