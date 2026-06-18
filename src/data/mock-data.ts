export const dashboardStats = [
  { label: "Logs Uploaded", value: "128", change: "+18.4%", tone: "sky" },
  { label: "Threats Detected", value: "34", change: "+9.2%", tone: "green" },
  { label: "Critical Alerts", value: "6", change: "-3.1%", tone: "critical" },
  { label: "Reports Generated", value: "12", change: "+4.8%", tone: "warning" }
];

export const stats = dashboardStats;

export const severityDistribution = [
  { name: "Critical", value: 6, color: "#DC2626" },
  { name: "High", value: 12, color: "#EF4444" },
  { name: "Medium", value: 19, color: "#F59E0B" },
  { name: "Low", value: 27, color: "#22C55E" }
];

export const threatTypeDistribution = [
  { name: "Auth Abuse", value: 31 },
  { name: "Malware", value: 14 },
  { name: "Recon", value: 22 },
  { name: "Data Access", value: 18 },
  { name: "Policy", value: 9 }
];

export const logsAnalyzedOverTime = [
  { time: "00:00", logs: 920 },
  { time: "04:00", logs: 1280 },
  { time: "08:00", logs: 2180 },
  { time: "12:00", logs: 3460 },
  { time: "16:00", logs: 2840 },
  { time: "20:00", logs: 4120 }
];

export const threatsOverTime = [
  { day: "Mon", critical: 1, high: 4, medium: 8 },
  { day: "Tue", critical: 2, high: 5, medium: 6 },
  { day: "Wed", critical: 0, high: 3, medium: 9 },
  { day: "Thu", critical: 3, high: 7, medium: 11 },
  { day: "Fri", critical: 4, high: 6, medium: 8 },
  { day: "Sat", critical: 1, high: 4, medium: 5 },
  { day: "Sun", critical: 2, high: 3, medium: 7 }
];

export const recentThreats = [
  {
    id: "THR-1048",
    name: "Repeated failed SSH login",
    severity: "critical",
    type: "Credential Attack",
    source: "203.0.113.42",
    target: "auth-gateway-01",
    confidence: 96,
    status: "Needs review",
    detectedAt: "2 min ago",
    evidence: "52 failed SSH login attempts for root, deploy, and backup users within 8 minutes.",
    aiPreview: "Likely brute-force activity against an exposed authentication service.",
    summary: "A concentrated authentication attack was detected against auth-gateway-01 from a single external source.",
    impact: "Successful access could expose administrative credentials, shell access, and downstream infrastructure paths.",
    attackerBehavior: "The actor is rotating common usernames and attempting repeated password guesses against SSH.",
    severityReasoning: "Critical severity is assigned because failed attempts were followed by one successful login pattern in the same window.",
    recommendedNextSteps: [
      "Block 203.0.113.42 at the edge firewall.",
      "Review successful SSH sessions on auth-gateway-01.",
      "Rotate credentials for targeted accounts and enforce MFA."
    ],
    analystNotes: "Correlate with VPN and endpoint logs to confirm whether the successful login created an interactive shell."
  },
  {
    id: "THR-1047",
    name: "Suspicious privilege escalation",
    severity: "high",
    type: "Privilege Abuse",
    source: "10.0.4.18",
    target: "linux-workload-07",
    confidence: 88,
    status: "Investigating",
    detectedAt: "12 min ago",
    evidence: "Unexpected sudo invocation occurred 46 seconds after a new shell session from an internal workstation.",
    aiPreview: "Privilege escalation behavior may indicate a compromised internal account.",
    summary: "An internal account initiated suspicious elevated commands shortly after interactive access began.",
    impact: "An attacker with elevated privileges may alter services, extract secrets, or disable monitoring.",
    attackerBehavior: "The sequence resembles post-compromise discovery followed by privilege escalation.",
    severityReasoning: "High severity is appropriate because behavior occurred internally but has not yet shown confirmed persistence.",
    recommendedNextSteps: [
      "Inspect shell history and process lineage on linux-workload-07.",
      "Validate whether the account owner initiated the session.",
      "Check for new binaries, cron entries, and modified service files."
    ],
    analystNotes: "The source is internal, so prioritize identity validation before containment."
  },
  {
    id: "THR-1046",
    name: "Unusual API token activity",
    severity: "medium",
    type: "Token Anomaly",
    source: "198.51.100.8",
    target: "api-edge",
    confidence: 74,
    status: "Queued",
    detectedAt: "34 min ago",
    evidence: "API token used from a new ASN with 4.3x the normal request volume and multiple 403 responses.",
    aiPreview: "Token misuse or automation drift is possible based on location and request pattern.",
    summary: "A normally low-volume token generated elevated API traffic from an unfamiliar network.",
    impact: "Misused API tokens can expose customer data, trigger rate limits, or enable unauthorized changes.",
    attackerBehavior: "The pattern suggests token replay, scripted enumeration, or a leaked credential being tested.",
    severityReasoning: "Medium severity is assigned because the token generated anomalies but no confirmed sensitive access.",
    recommendedNextSteps: [
      "Rotate the affected API token.",
      "Review endpoint paths accessed during the anomaly window.",
      "Add token usage alerting by ASN and request volume."
    ],
    analystNotes: "Compare with deployment logs in case a legitimate service moved networks."
  },
  {
    id: "THR-1045",
    name: "Directory traversal probe",
    severity: "medium",
    type: "Web Recon",
    source: "192.0.2.19",
    target: "web-front-03",
    confidence: 81,
    status: "Contained",
    detectedAt: "51 min ago",
    evidence: "Multiple requests included ../ traversal patterns targeting config and environment file paths.",
    aiPreview: "Web reconnaissance is probing for path traversal and exposed configuration files.",
    summary: "A web-facing service received repeated traversal probes against sensitive path patterns.",
    impact: "Successful traversal may expose environment variables, application secrets, or source configuration.",
    attackerBehavior: "The actor appears to be scanning common traversal payloads to identify vulnerable handlers.",
    severityReasoning: "Medium severity is assigned because probes were blocked and no successful file read is visible.",
    recommendedNextSteps: [
      "Confirm web-front-03 returned only blocked or sanitized responses.",
      "Add the source IP to temporary deny rules.",
      "Review application routing for unsafe path joins."
    ],
    analystNotes: "The request pattern is noisy but worth correlating with WAF logs for neighboring IPs."
  }
];

export const uploads = [
  { file: "auth-gateway.log", status: "Analyzed", size: "2.8 MB", events: "18,420", uploadedAt: "Today, 09:42" },
  { file: "vpn-access.csv", status: "Queued", size: "860 KB", events: "4,118", uploadedAt: "Today, 09:16" },
  { file: "nginx-errors.txt", status: "Ready", size: "1.4 MB", events: "7,902", uploadedAt: "Yesterday, 18:05" },
  { file: "cloudtrail-sample.log", status: "Analyzed", size: "3.2 MB", events: "22,805", uploadedAt: "Yesterday, 15:28" }
];

export const aiInsight = {
  title: "Brute-force activity is clustering around exposed SSH services",
  summary:
    "The last analysis window shows a spike in failed authentication from two external IP ranges, followed by one successful login against auth-gateway-01.",
  confidence: 94,
  recommendations: [
    "Review successful SSH sessions from the last 30 minutes.",
    "Temporarily block 203.0.113.42 and related source ranges.",
    "Rotate credentials for accounts with repeated failed login attempts."
  ]
};
