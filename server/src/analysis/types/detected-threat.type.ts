export type ThreatSeverity = "low" | "medium" | "high" | "critical";

export type ParsedLogLine = {
  lineNumber: number;
  raw: string;
  sourceIp?: string;
  statusCode?: number;
};

export type DetectedThreat = {
  threatType: string;
  severity: ThreatSeverity;
  score: number;
  sourceIp?: string;
  description: string;
  evidence: string;
  confidence: number;
};

export type RuleResult = DetectedThreat[];
