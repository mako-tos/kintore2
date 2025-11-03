import { TrainingMenu } from '@/types/training-menu';
import { supabase } from '@/lib/supabase';

export class TrainingMenuRepository {
  private static instance: TrainingMenuRepository;
  private cache: Map<string, TrainingMenu> = new Map();
  private lastCacheUpdate: number = 0;
  private readonly CACHE_TTL = 30 * 60 * 1000; // 30分

  private constructor() {}

  static getInstance(): TrainingMenuRepository {
    if (!TrainingMenuRepository.instance) {
      TrainingMenuRepository.instance = new TrainingMenuRepository();
    }
    return TrainingMenuRepository.instance;
  }

  private isCacheValid(): boolean {
    return (
      this.cache.size > 0 &&
      Date.now() - this.lastCacheUpdate < this.CACHE_TTL
    );
  }

  async findAll(): Promise<TrainingMenu[]> {
    if (this.isCacheValid()) {
      return Array.from(this.cache.values());
    }

    const { data, error } = await supabase
      .from('training_menus')
      .select('*')
      .eq('status', 0)
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch training menus: ${error.message}`);
    }

    this.cache.clear();
    data.forEach((menu: TrainingMenu) => {
      this.cache.set(menu.id, menu);
    });
    this.lastCacheUpdate = Date.now();

    return data;
  }

  async findById(id: string): Promise<TrainingMenu | null> {
    if (this.isCacheValid()) {
      const cached = this.cache.get(id);
      if (cached && cached.status === 0) {
        return cached;
      }
    }

    const { data, error } = await supabase
      .from('training_menus')
      .select('*')
      .eq('id', id)
      .eq('status', 0)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch training menu: ${error.message}`);
    }

    if (data) {
      this.cache.set(data.id, data);
    }

    return data;
  }

  async create(name: string): Promise<TrainingMenu> {
    const { data, error } = await supabase
      .from('training_menus')
      .insert([{ name, status: 0 }])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create training menu: ${error.message}`);
    }

    this.cache.set(data.id, data);
    return data;
  }

  async update(id: string, name: string): Promise<TrainingMenu> {
    const { data, error } = await supabase
      .from('training_menus')
      .update({ name, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update training menu: ${error.message}`);
    }

    this.cache.set(data.id, data);
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('training_menus')
      .update({ status: 1, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete training menu: ${error.message}`);
    }

    this.cache.delete(id);
  }
}