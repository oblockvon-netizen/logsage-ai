import type { ParsedLogLine } from "../types/detected-threat.type";

const ipRegex = /\b(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)\b/;
const statusRegex = /(?:\s|")([1-5]\d{2})(?:\s|$)/;

export function parseLogContent(rawContent: string): ParsedLogLine[] {
  return rawContent
    .split(/\r?\n/)
    .map((raw, index) => ({
      lineNumber: index + 1,
      raw,
      sourceIp: raw.match(ipRegex)?.[0],
      statusCode: parseStatusCode(raw)
    }))
    .filter((line) => line.raw.trim().length > 0);
}

function parseStatusCode(raw: string) {
  const match = raw.match(statusRegex);
  return match ? Number(match[1]) : undefined;
}
