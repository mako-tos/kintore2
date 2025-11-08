import type { NextApiRequest, NextApiResponse } from 'next';
import { TrainingRecord } from '@/types/training-record';
import { TrainingRecordRepository } from '@/repositories/training-record';
import { TrainingMenuRepository } from '@/repositories/training-menu';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    records: TrainingRecord[];
    total: number;
  } | { message: string }>
) {
  const repository = TrainingRecordRepository.getInstance();
  const menuRepository = TrainingMenuRepository.getInstance();

  try {
    switch (req.method) {
      case 'GET': {
        // クエリパラメータの処理
        const menuId = req.query.menuId as string | undefined;
        const fromDate = req.query.fromDate ? new Date(req.query.fromDate as string) : undefined;
        const toDate = req.query.toDate ? new Date(req.query.toDate as string) : undefined;
        const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;

        if (menuId) {
          const menu = await menuRepository.findById(menuId);
          if (!menu) {
            res.status(404).json({ message: 'Training menu not found' });
            return;
          }
        }

        const result = await repository.findAll({
          menuId,
          fromDate,
          toDate,
          page,
          limit
        });

        res.status(200).json(result);
        break;
      }
      case 'POST': {
        if (!req.body.trainingMenuId || !req.body.trainingAt || !req.body.count) {
          res.status(400).json({
            message: 'Invalid request: trainingMenuId, trainingAt, and count are required'
          });
          return;
        }

        const menu = await menuRepository.findById(req.body.trainingMenuId);
        if (!menu) {
          res.status(404).json({ message: 'Training menu not found' });
          return;
        }

        const newRecord = await repository.create({
          trainingMenuId: req.body.trainingMenuId,
          trainingAt: new Date(req.body.trainingAt),
          count: parseInt(req.body.count, 10)
        });

        res.status(201).json({ records: [newRecord], total: 1 });
        break;
      }
      default: {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({ message: `Method ${req.method} Not Allowed` });
      }
    }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error in training-records API:', error);
    res.status(500).json({ message: error.message });
  }
}