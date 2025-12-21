import { randomUUID } from "crypto";
import { BodyComposition } from "@/types/body-composition";
import { supabaseServer } from "@/lib/supabase-server";

export class BodyCompositionRepository {
  private static instance: BodyCompositionRepository;

  private constructor() {}

  static getInstance(): BodyCompositionRepository {
    if (!BodyCompositionRepository.instance) {
      BodyCompositionRepository.instance = new BodyCompositionRepository();
    }
    return BodyCompositionRepository.instance;
  }

  async create(
    userId: string,
    data: Omit<BodyComposition, "id" | "user_id" | "created_at">
  ): Promise<BodyComposition> {
    const supabase = supabaseServer;
    const id = randomUUID();
    const now = new Date().toISOString();

    const newRecord: BodyComposition = {
      id,
      user_id: userId,
      created_at: now,
      date: data.date,
      weight: data.weight,
      body_fat_mass: data.body_fat_mass,
      lean_body_mass: data.lean_body_mass,
      muscle_mass: data.muscle_mass,
    };

    const { error } = await supabase
      .from("body_compositions")
      .insert(newRecord);

    if (error) {
      throw new Error(`Failed to create body composition: ${error.message}`);
    }

    return newRecord;
  }

  async findByUserId(userId: string): Promise<BodyComposition[]> {
    const supabase = supabaseServer;
    const { data, error } = await supabase
      .from("body_compositions")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch body compositions: ${error.message}`);
    }

    return data || [];
  }
}
