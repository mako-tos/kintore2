import { describe, expect, test, beforeEach } from '@jest/globals';
import { TrainingMenuRepository } from '@/repositories/training-menu';

const mockSupabaseResponse = {
  data: [
    {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'スクワット',
      status: 0,
      created_at: '2025-11-03T00:00:00Z'
    }
  ],
  error: null
};

// Supabaseクライアントのモック
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve(mockSupabaseResponse)
        }),
        single: () => Promise.resolve(mockSupabaseResponse)
      }),
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve(mockSupabaseResponse)
        })
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () => Promise.resolve(mockSupabaseResponse)
          })
        })
      })
    })
  }
}));

describe('TrainingMenuRepository', () => {
  let repository: TrainingMenuRepository;

  beforeEach(() => {
    repository = TrainingMenuRepository.getInstance();
  });

  describe('findAll', () => {
    test('returns all active training menus', async () => {
      const menus = await repository.findAll();
      expect(menus).toEqual(mockSupabaseResponse.data);
    });
  });

  describe('findById', () => {
    test('returns a training menu by id', async () => {
      const menu = await repository.findById('123e4567-e89b-12d3-a456-426614174000');
      expect(menu).toEqual(mockSupabaseResponse.data[0]);
    });
  });

  describe('create', () => {
    test('creates a new training menu', async () => {
      const menu = await repository.create('スクワット');
      expect(menu).toEqual(mockSupabaseResponse.data[0]);
    });
  });

  describe('update', () => {
    test('updates a training menu', async () => {
      const menu = await repository.update('123e4567-e89b-12d3-a456-426614174000', 'スクワット');
      expect(menu).toEqual(mockSupabaseResponse.data[0]);
    });
  });
});