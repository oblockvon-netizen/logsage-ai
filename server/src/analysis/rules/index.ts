import { detectBruteForce } from "./brute-force.rule";
import { detectDirectoryScanning } from "./directory-scanning.rule";
import { detectRepeatedServerErrors } from "./server-errors.rule";
import { detectSqlInjection } from "./sql-injection.rule";
import { detectSuspiciousPathAccess } from "./suspicious-path.rule";
import type { ParsedLogLine, RuleResult } from "../types/detected-threat.type";

export type ThreatDetectionRule = (lines: ParsedLogLine[]) => RuleResult;

export const threatDetectionRules: ThreatDetectionRule[] = [
  detectBruteForce,
  detectSqlInjection,
  detectDirectoryScanning,
  detectSuspiciousPathAccess,
  detectRepeatedServerErrors
];
