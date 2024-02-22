import type { NextApiRequest, NextApiResponse } from 'next';

type LivenessType = {
  status: string;
  timeZone: string;
  memoryUsage: {
    rss: string;
    heapTotal: string;
    heapUsed: string;
    external: string;
    arrayBuffers: string;
  };
};

export default function handler(req: NextApiRequest, res: NextApiResponse<LivenessType>) {
  const memoryUsage = process.memoryUsage();
  const dateTimeZone = new Date().toISOString();
  res.status(200).json({
    status: 'ok',
    timeZone: dateTimeZone,
    memoryUsage: {
      rss: `${(memoryUsage.rss / 1000000).toFixed(2)} MB`,
      heapTotal: `${(memoryUsage.heapTotal / 1000000).toFixed(2)} MB`,
      heapUsed: `${(memoryUsage.heapUsed / 1000000).toFixed(2)} MB`,
      external: `${(memoryUsage.external / 1000000).toFixed(2)} MB`,
      arrayBuffers: `${(memoryUsage.arrayBuffers / 1000000).toFixed(2)} MB`,
    },
  });
}
