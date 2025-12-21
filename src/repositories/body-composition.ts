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
    const { data: result, error } = await supabaseServer
      .from("body_compositions")
      .insert({
        user_id: userId,
        date: data.date,
        weight: data.weight,
        body_fat_mass: data.body_fat_mass,
        lean_body_mass: data.lean_body_mass,
        muscle_mass: data.muscle_mass,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create body composition: ${error.message}`);
    }

    return result;
  }
}
