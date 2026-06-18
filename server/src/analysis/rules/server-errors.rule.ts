import { repeatedServerErrorsRule } from "./rule-config";
import { createThreat, groupBySourceIp } from "../utils/rule-helpers";
import type { ParsedLogLine, RuleResult } from "../types/detected-threat.type";

export function detectRepeatedServerErrors(lines: ParsedLogLine[]): RuleResult {
  const errorLines = lines.filter((line) => line.statusCode !== undefined && line.statusCode >= 500);
  const grouped = groupBySourceIp(errorLines);
  const sourceBasedThreats = Object.entries(grouped)
    .filter(([, group]) => group.length >= repeatedServerErrorsRule.threshold)
    .map(([sourceIp, group]) =>
      createThreat({
        ...repeatedServerErrorsRule,
        sourceIp,
        description: `${repeatedServerErrorsRule.description} ${group.length} server errors came from the same source.`,
        evidenceLines: group,
        score: repeatedServerErrorsRule.score + Math.min(10, group.length - repeatedServerErrorsRule.threshold)
      })
    );

  if (sourceBasedThreats.length > 0 || errorLines.length < repeatedServerErrorsRule.threshold) {
    return sourceBasedThreats;
  }

  return [
    createThreat({
      ...repeatedServerErrorsRule,
      description: `${repeatedServerErrorsRule.description} ${errorLines.length} server errors were detected across the uploaded log.`,
      evidenceLines: errorLines
    })
  ];
}
