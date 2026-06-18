import { sqlInjectionRule } from "./rule-config";
import { createThreat } from "../utils/rule-helpers";
import type { ParsedLogLine, RuleResult } from "../types/detected-threat.type";

export function detectSqlInjection(lines: ParsedLogLine[]): RuleResult {
  const matches = lines.filter((line) => sqlInjectionRule.patterns.some((pattern) => pattern.test(line.raw)));

  if (matches.length === 0) {
    return [];
  }

  return [
    createThreat({
      ...sqlInjectionRule,
      sourceIp: matches.find((line) => line.sourceIp)?.sourceIp,
      description: `${sqlInjectionRule.description} ${matches.length} suspicious request line(s) matched SQL injection rules.`,
      evidenceLines: matches,
      score: sqlInjectionRule.score + Math.min(6, matches.length)
    })
  ];
}
