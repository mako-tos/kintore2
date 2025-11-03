import { TrainingRecord } from '@/types/training-record';
import { supabase } from '@/lib/supabase';

export class TrainingRecordRepository {
  private static instance: TrainingRecordRepository;

  private constructor() {}

  static getInstance(): TrainingRecordRepository {
    if (!TrainingRecordRepository.instance) {
      TrainingRecordRepository.instance = new TrainingRecordRepository();
    }
    return TrainingRecordRepository.instance;
  }

  async findAll(options: {
    menuId?: string;
    fromDate?: Date;
    toDate?: Date;
    page?: number;
    limit?: number;
  }): Promise<{ records: TrainingRecord[]; total: number }> {
    const {
      menuId,
      fromDate,
      toDate,
      page = 1,
      limit = 50
    } = options;

    let query = supabase
      .from('training_records')
      .select('*, training_menus(name)', { count: 'exact' });

    if (menuId) {
      query = query.eq('training_menu_id', menuId);
    }

    if (fromDate) {
      query = query.gte('training_at', fromDate.toISOString());
    }

    if (toDate) {
      query = query.lte('training_at', toDate.toISOString());
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query
      .order('training_at', { ascending: false })
      .range(from, to);

    if (error) {
      throw new Error(`Failed to fetch training records: ${error.message}`);
    }

    if (!count) {
      throw new Error('Failed to get total count');
    }

    return {
      records: data,
      total: count
    };
  }

  async create(record: {
    trainingMenuId: string;
    trainingAt: Date;
    count: number;
  }): Promise<TrainingRecord> {
    const { data, error } = await supabase
      .from('training_records')
      .insert([{
        training_menu_id: record.trainingMenuId,
        training_at: record.trainingAt.toISOString(),
        count: record.count
      }])
      .select('*, training_menus(name)')
      .single();

    if (error) {
      throw new Error(`Failed to create training record: ${error.message}`);
    }

    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('training_records')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete training record: ${error.message}`);
    }
  }
}