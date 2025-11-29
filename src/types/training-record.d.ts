export interface TrainingRecord {
  id: string;
  userId: string;
  trainingMenuId: string;
  trainingAt: string;
  set: number;
  createdAt: string;
  [k: string]: unknown;
}
