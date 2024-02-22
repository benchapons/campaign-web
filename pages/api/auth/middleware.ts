import { getToken } from 'next-auth/jwt';
import { ERROR_CODE_AUTH } from '@/constants/error-code';
import { NextApiRequest, NextApiResponse } from 'next';

const secret = process.env.JWT_SECRET;

const middleware = (handler: any) => {
  return async (req: NextApiRequest, res: NextApiResponse<any>) => {
    const userToken: any = await getToken({ req, secret });
    if (!userToken) {
      return res.status(401).json(ERROR_CODE_AUTH['CAM-AU-04']);
    }

    return handler(req, res, userToken['data']);
  };
};

export default middleware;
