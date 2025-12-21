export interface BodyComposition {
  id: string;
  user_id: string;
  date: string; // ISO8601 string
  weight: number;
  body_fat_mass: number;
  lean_body_mass: number;
  muscle_mass: number;
  created_at: string;
}
