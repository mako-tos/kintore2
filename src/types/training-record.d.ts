export interface TrainingRecord {
  id: string;
  trainingMenuId: string;
  trainingAt: string;
  count: number;
  createdAt: string;
  [k: string]: unknown;
}
