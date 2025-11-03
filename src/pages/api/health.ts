import type { NextApiRequest, NextApiResponse } from 'next';
import { ServiceStatus } from '@/types/service-status';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ServiceStatus>
) {
  if (req.method !== 'GET') {
    res.status(405).end(); // Method Not Allowed
    return;
  }

  // spec.md で定義されている形式でレスポンスを返す
  const status: ServiceStatus = {
    status: 'ok',
    uptime: process.uptime(),
    version: process.env.NEXT_PUBLIC_VERSION || '0.0.0'
  };

  res.status(200).json(status);
}