import { describe, expect, test, beforeEach } from '@jest/globals';
import { TrainingRecordRepository } from '@/repositories/training-record';

const mockSupabaseResponse = {
  data: [
    {
      id: '123e4567-e89b-12d3-a456-426614174001',
      training_menu_id: '123e4567-e89b-12d3-a456-426614174000',
      training_at: '2025-11-03T00:00:00Z',
      count: 10,
      created_at: '2025-11-03T00:00:00Z',
      training_menus: {
        name: 'スクワット'
      }
    }
  ],
  error: null,
  count: 1
};

// Supabaseクライアントのモック
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => ({
            range: () => Promise.resolve(mockSupabaseResponse)
          })
        }),
        gte: () => ({
          lte: () => ({
            order: () => ({
              range: () => Promise.resolve(mockSupabaseResponse)
            })
          })
        })
      }),
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: mockSupabaseResponse.data[0], error: null })
        })
      }),
      delete: () => ({
        eq: () => Promise.resolve({ error: null })
      })
    })
  }
}));

describe('TrainingRecordRepository', () => {
  let repository: TrainingRecordRepository;

  beforeEach(() => {
    repository = TrainingRecordRepository.getInstance();
  });

  describe('findAll', () => {
    test('returns training records with pagination', async () => {
      const result = await repository.findAll({});
      expect(result.records).toEqual(mockSupabaseResponse.data);
      expect(result.total).toBe(mockSupabaseResponse.count);
    });

    test('returns filtered training records', async () => {
      const result = await repository.findAll({
        menuId: '123e4567-e89b-12d3-a456-426614174000',
        fromDate: new Date('2025-11-01'),
        toDate: new Date('2025-11-30'),
        page: 1,
        limit: 50
      });
      expect(result.records).toEqual(mockSupabaseResponse.data);
      expect(result.total).toBe(mockSupabaseResponse.count);
    });
  });

  describe('create', () => {
    test('creates a new training record', async () => {
      const record = await repository.create({
        trainingMenuId: '123e4567-e89b-12d3-a456-426614174000',
        trainingAt: new Date('2025-11-03T00:00:00Z'),
        count: 10
      });
      expect(record).toEqual(mockSupabaseResponse.data[0]);
    });
  });

  describe('delete', () => {
    test('deletes a training record', async () => {
      await expect(repository.delete('123e4567-e89b-12d3-a456-426614174001')).resolves.not.toThrow();
    });
  });
});