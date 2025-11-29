export interface TrainingMenu {
  id: string;
  userId: string;
  name: string;
  status: 0 | 1;
  createdAt: string;
  [k: string]: unknown;
}
