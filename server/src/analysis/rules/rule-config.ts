import type { ThreatSeverity } from "../types/detected-threat.type";

export type ThresholdRuleConfig = {
  threatType: string;
  severity: ThreatSeverity;
  score: number;
  confidence: number;
  threshold: number;
  windowLabel: string;
  description: string;
};

export type PatternRuleConfig = {
  threatType: string;
  severity: ThreatSeverity;
  score: number;
  confidence: number;
  patterns: RegExp[];
  description: string;
};

export const bruteForceRule: ThresholdRuleConfig = {
  threatType: "Brute Force Attempt",
  severity: "critical",
  score: 96,
  confidence: 0.94,
  threshold: 5,
  windowLabel: "single uploaded log",
  description: "Repeated failed authentication attempts were detected from the same source IP."
};

export const sqlInjectionRule: PatternRuleConfig = {
  threatType: "SQL Injection Attempt",
  severity: "high",
  score: 88,
  confidence: 0.87,
  patterns: [
    /(\%27)|(')|(--)|(\%23)|(#)/i,
    /\b(or|and)\b\s+\d+\s*=\s*\d+/i,
    /\bunion\b\s+\bselect\b/i,
    /\binformation_schema\b/i,
    /\bsleep\s*\(/i
  ],
  description: "Request payloads contain common SQL injection syntax or database probing indicators."
};

export const directoryScanningRule: ThresholdRuleConfig & { patterns: RegExp[] } = {
  threatType: "Directory Scanning",
  severity: "medium",
  score: 72,
  confidence: 0.78,
  threshold: 6,
  windowLabel: "single uploaded log",
  patterns: [
    /GET\s+\/(?:admin|login|wp-admin|phpmyadmin|backup|config|\.git|\.env|server-status)\b/i,
    /(?:404|403).*(?:\/admin|\/login|\/wp-admin|\/phpmyadmin|\/backup|\/config|\/\.git|\/\.env)/i
  ],
  description: "Multiple sensitive or common administrative paths were requested by the same source IP."
};

export const suspiciousPathAccessRule: PatternRuleConfig = {
  threatType: "Suspicious Path Access",
  severity: "high",
  score: 84,
  confidence: 0.82,
  patterns: [
    /\.\.\//,
    /%2e%2e%2f/i,
    /\/etc\/passwd/i,
    /\/proc\/self\/environ/i,
    /\.env\b/i,
    /\.git\//i,
    /\/WEB-INF\//i
  ],
  description: "Request paths include traversal patterns or sensitive file locations."
};

export const repeatedServerErrorsRule: ThresholdRuleConfig = {
  threatType: "Repeated Server Errors",
  severity: "medium",
  score: 68,
  confidence: 0.72,
  threshold: 5,
  windowLabel: "single uploaded log",
  description: "Repeated 5xx server errors were observed from the same source IP or across the log."
};
