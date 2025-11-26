import { TrainingRecord } from "@/types/training-record";
import { supabase } from "@/lib/supabase";
import { supabaseServer } from "@/lib/supabase-server";

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
    const { menuId, fromDate, toDate, page = 1, limit = 50 } = options;

    let query = supabase
      .from("training_records")
      .select("*, training_menus(name)", { count: "exact" });

    if (menuId) {
      query = query.eq("training_menu_id", menuId);
    }

    if (fromDate) {
      query = query.gte("training_at", fromDate.toISOString());
    }

    if (toDate) {
      query = query.lte("training_at", toDate.toISOString());
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query
      .order("training_at", { ascending: false })
      .range(from, to);

    if (error) {
      throw new Error(`Failed to fetch training records: ${error.message}`);
    }
    // count が null/undefined の場合は別クエリで再取得（リレーション含む select で count が返らないケースがある）
    let totalCount = count ?? null;
    if (totalCount === null) {
      let countQuery = supabase
        .from("training_records")
        .select("id", { count: "exact", head: true });

      if (menuId) {
        countQuery = countQuery.eq("training_menu_id", menuId);
      }
      if (fromDate) {
        countQuery = countQuery.gte("training_at", fromDate.toISOString());
      }
      if (toDate) {
        countQuery = countQuery.lte("training_at", toDate.toISOString());
      }

      const { count: fallbackCount, error: countError } = await countQuery;
      if (countError) {
        // 失敗時は 0 件として扱う（致命的ではないためログのみ）
        console.warn("Fallback count query failed:", countError.message);
        totalCount = 0;
      } else {
        totalCount = fallbackCount ?? 0;
      }
    }

    if (totalCount === null) {
      totalCount = 0;
    }
    return {
      records: data,
      total: totalCount,
    };
  }

  async create(record: {
    trainingMenuId: string;
    trainingAt: Date;
    set: number;
  }): Promise<TrainingRecord> {
    // 書き込みはサービスロールクライアントで RLS を回避
    const { data, error } = await supabaseServer
      .from("training_records")
      .insert([
        {
          training_menu_id: record.trainingMenuId,
          training_at: record.trainingAt.toISOString(),
          set: record.set,
        },
      ])
      .select("*, training_menus(name)")
      .single();

    if (error) {
      throw new Error(`Failed to create training record: ${error.message}`);
    }

    return data;
  }

  async delete(id: string): Promise<void> {
    // 削除もサービスロールで実施
    const { error } = await supabaseServer
      .from("training_records")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to delete training record: ${error.message}`);
    }
  }
}
