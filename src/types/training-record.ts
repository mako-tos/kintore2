export interface TrainingRecord {
  id: string;
  training_menu_id: string;
  training_at: string;
  count: number;
  created_at: string;
  training_menus?: {
    name: string;
  };
}