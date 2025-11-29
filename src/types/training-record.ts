export interface TrainingRecord {
  id: string;
  user_id: string;
  training_menu_id: string;
  training_at: string;
  set: number;
  created_at: string;
  training_menus?: {
    name: string;
  };
}
