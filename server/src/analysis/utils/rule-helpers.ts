import type { DetectedThreat, ParsedLogLine, ThreatSeverity } from "../types/detected-threat.type";

export function groupBySourceIp(lines: ParsedLogLine[]) {
  return lines.reduce<Record<string, ParsedLogLine[]>>((groups, line) => {
    const key = line.sourceIp ?? "unknown";
    groups[key] = groups[key] ?? [];
    groups[key].push(line);
    return groups;
  }, {});
}

export function formatEvidence(lines: ParsedLogLine[], maxLines = 4) {
  return lines
    .slice(0, maxLines)
    .map((line) => `Line ${line.lineNumber}: ${line.raw}`)
    .join("\n");
}

export function createThreat(input: {
  threatType: string;
  severity: ThreatSeverity;
  score: number;
  sourceIp?: string;
  description: string;
  evidenceLines: ParsedLogLine[];
  confidence: number;
}): DetectedThreat {
  return {
    threatType: input.threatType,
    severity: input.severity,
    score: clampScore(input.score),
    sourceIp: input.sourceIp === "unknown" ? undefined : input.sourceIp,
    description: input.description,
    evidence: formatEvidence(input.evidenceLines),
    confidence: clampConfidence(input.confidence)
  };
}

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function clampConfidence(confidence: number) {
  return Math.max(0, Math.min(1, Number(confidence.toFixed(2))));
}
