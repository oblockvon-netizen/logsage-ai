import { suspiciousPathAccessRule } from "./rule-config";
import { createThreat } from "../utils/rule-helpers";
import type { ParsedLogLine, RuleResult } from "../types/detected-threat.type";

export function detectSuspiciousPathAccess(lines: ParsedLogLine[]): RuleResult {
  const matches = lines.filter((line) => suspiciousPathAccessRule.patterns.some((pattern) => pattern.test(line.raw)));

  if (matches.length === 0) {
    return [];
  }

  return [
    createThreat({
      ...suspiciousPathAccessRule,
      sourceIp: matches.find((line) => line.sourceIp)?.sourceIp,
      description: `${suspiciousPathAccessRule.description} ${matches.length} suspicious path access attempt(s) were detected.`,
      evidenceLines: matches,
      score: suspiciousPathAccessRule.score + Math.min(8, matches.length)
    })
  ];
}
