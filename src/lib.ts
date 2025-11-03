export function getServiceStatus(version = "0.0.0") {
  const uptime = Math.floor(process.uptime());
  return {
    status: "ok",
    uptime,
    version
  } as const;
}
