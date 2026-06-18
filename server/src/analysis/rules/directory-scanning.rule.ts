import { directoryScanningRule } from "./rule-config";
import { createThreat, groupBySourceIp } from "../utils/rule-helpers";
import type { ParsedLogLine, RuleResult } from "../types/detected-threat.type";

export function detectDirectoryScanning(lines: ParsedLogLine[]): RuleResult {
  const matches = lines.filter((line) => directoryScanningRule.patterns.some((pattern) => pattern.test(line.raw)));
  const grouped = groupBySourceIp(matches);

  return Object.entries(grouped)
    .filter(([, group]) => group.length >= directoryScanningRule.threshold)
    .map(([sourceIp, group]) =>
      createThreat({
        ...directoryScanningRule,
        sourceIp,
        description: `${directoryScanningRule.description} ${group.length} path probes were found in the ${directoryScanningRule.windowLabel}.`,
        evidenceLines: group,
        score: directoryScanningRule.score + Math.min(10, group.length - directoryScanningRule.threshold)
      })
    );
}
