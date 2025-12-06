export interface TrainingMenu {
  id: string;
  user_id: string;
  name: string;
  status: 0 | 1;
  sort_order: number;
  created_at: string;
  [k: string]: unknown;
}
