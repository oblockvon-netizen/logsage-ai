export const stats = [
  { label: "Logs Uploaded", value: "128", tone: "sky" },
  { label: "Threats Detected", value: "34", tone: "green" },
  { label: "Critical Alerts", value: "6", tone: "critical" },
  { label: "Reports Generated", value: "12", tone: "warning" }
];

export const recentThreats = [
  { name: "Repeated failed SSH login", severity: "critical", source: "203.0.113.42" },
  { name: "Suspicious privilege escalation", severity: "high", source: "10.0.4.18" },
  { name: "Unusual API token activity", severity: "medium", source: "198.51.100.8" }
];

export const uploads = [
  { file: "auth-gateway.log", status: "Analyzed", size: "2.8 MB" },
  { file: "vpn-access.csv", status: "Queued", size: "860 KB" },
  { file: "nginx-errors.txt", status: "Ready", size: "1.4 MB" }
];
