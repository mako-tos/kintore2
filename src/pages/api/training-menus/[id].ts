import type { NextApiRequest, NextApiResponse } from 'next';
import { TrainingMenuRepository } from '@/repositories/training-menu';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  
  if (typeof id !== 'string') {
    res.status(400).json({ message: 'Invalid menu ID' });
    return;
  }

  const repository = TrainingMenuRepository.getInstance();

  try {
    switch (req.method) {
      case 'GET':
        const menu = await repository.findById(id);
        if (!menu) {
          res.status(404).json({ message: 'Training menu not found' });
          return;
        }
        res.status(200).json(menu);
        break;

      case 'PUT':
        if (!req.body.name || typeof req.body.name !== 'string') {
          res.status(400).json({ message: 'Invalid request: name is required' });
          return;
        }
        const updatedMenu = await repository.update(id, req.body.name);
        res.status(200).json(updatedMenu);
        break;

      case 'DELETE':
        await repository.delete(id);
        res.status(204).end();
        break;

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (error: any) {
    console.error('Error in training-menu API:', error);
    res.status(500).json({ message: error.message });
  }
}