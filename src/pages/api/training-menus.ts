import type { NextApiRequest, NextApiResponse } from 'next';
import { TrainingMenu } from '@/types/training-menu';
import { TrainingMenuRepository } from '@/repositories/training-menu';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TrainingMenu[] | { message: string }>
) {
  const repository = TrainingMenuRepository.getInstance();

  try {
    switch (req.method) {
      case 'GET':
        const menus = await repository.findAll();
        res.status(200).json(menus);
        break;

      case 'POST':
        if (!req.body.name || typeof req.body.name !== 'string') {
          res.status(400).json({ message: 'Invalid request: name is required' });
          return;
        }
        const newMenu = await repository.create(req.body.name);
        res.status(201).json([newMenu]);
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (error: any) {
    console.error('Error in training-menus API:', error);
    res.status(500).json({ message: error.message });
  }
}