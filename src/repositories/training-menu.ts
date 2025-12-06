import { TrainingMenu } from "@/types/training-menu";
import { supabaseServer } from "@/lib/supabase-server";

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
      this.cache.size > 0 && Date.now() - this.lastCacheUpdate < this.CACHE_TTL
    );
  }

  async findAll(userId: string, status?: number): Promise<TrainingMenu[]> {
    // RLS で user_id フィルタリングされるため、キャッシュはユーザー別に管理すべきだが
    // 簡易実装としてキャッシュを無効化（または userId 別キャッシュに拡張可能）
    let query = supabaseServer
      .from("training_menus")
      .select("*")
      .eq("user_id", userId);

    if (status !== undefined) {
      query = query.eq("status", status);
    }

    const { data, error } = await query
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch training menus: ${error.message}`);
    }

    return data;
  }

  async findById(id: string, userId: string): Promise<TrainingMenu | null> {
    const { data, error } = await supabaseServer
      .from("training_menus")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .eq("status", 0)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw new Error(`Failed to fetch training menu: ${error.message}`);
    }

    return data;
  }

  async create(name: string, userId: string): Promise<TrainingMenu> {
    // サービスロールでも user_id を明示的に設定
    const { data, error } = await supabaseServer
      .from("training_menus")
      .insert([{ name, status: 0, user_id: userId }])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create training menu: ${error.message}`);
    }

    return data;
  }

  async update(
    id: string,
    name: string,
    userId: string
  ): Promise<TrainingMenu> {
    // RLS で自分のレコードのみ更新可能だが、念のため user_id も条件に含める
    const { data, error } = await supabaseServer
      .from("training_menus")
      .update({ name, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update training menu: ${error.message}`);
    }

    return data;
  }

  async delete(id: string, userId: string): Promise<void> {
    const { error } = await supabaseServer
      .from("training_menus")
      .update({ status: 1, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      throw new Error(`Failed to delete training menu: ${error.message}`);
    }
  }

  async updateStatus(
    id: string,
    status: number,
    userId: string
  ): Promise<TrainingMenu> {
    const { data, error } = await supabaseServer
      .from("training_menus")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      throw new Error(
        `Failed to update training menu status: ${error.message}`
      );
    }

    return data;
  }

  async updateOrder(
    items: { id: string; sortOrder: number }[],
    userId: string
  ): Promise<void> {
    const updates = items.map((item) =>
      supabaseServer
        .from("training_menus")
        .update({
          sort_order: item.sortOrder,
          updated_at: new Date().toISOString(),
        })
        .eq("id", item.id)
        .eq("user_id", userId)
    );

    const results = await Promise.all(updates);

    const error = results.find((r) => r.error);
    if (error) {
      throw new Error(`Failed to update order: ${error.error?.message}`);
    }
  }
}
