export interface ServiceStatus {
  status: "ok" | "degraded" | "down";
  uptime: number;
  version: string;
  [k: string]: unknown;
}
