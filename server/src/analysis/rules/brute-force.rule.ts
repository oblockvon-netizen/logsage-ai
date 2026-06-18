import { bruteForceRule } from "./rule-config";
import { createThreat, groupBySourceIp } from "../utils/rule-helpers";
import type { ParsedLogLine, RuleResult } from "../types/detected-threat.type";

const failedAuthPatterns = [/failed password/i, /authentication failed/i, /invalid user/i, /login failed/i, /failed login/i];

export function detectBruteForce(lines: ParsedLogLine[]): RuleResult {
  const failedLines = lines.filter((line) => failedAuthPatterns.some((pattern) => pattern.test(line.raw)));
  const grouped = groupBySourceIp(failedLines);

  return Object.entries(grouped)
    .filter(([, group]) => group.length >= bruteForceRule.threshold)
    .map(([sourceIp, group]) =>
      createThreat({
        ...bruteForceRule,
        sourceIp,
        description: `${bruteForceRule.description} ${group.length} failures were found in the ${bruteForceRule.windowLabel}.`,
        evidenceLines: group,
        score: bruteForceRule.score + Math.min(4, group.length - bruteForceRule.threshold)
      })
    );
}
