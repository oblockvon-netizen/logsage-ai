import { Injectable } from "@nestjs/common";
import { threatDetectionRules } from "./rules";
import type { DetectedThreat } from "./types/detected-threat.type";
import { parseLogContent } from "./utils/log-parser";

@Injectable()
export class AnalysisService {
  analyzeRawContent(rawContent: string): DetectedThreat[] {
    const parsedLines = parseLogContent(rawContent);

    return threatDetectionRules
      .flatMap((rule) => rule(parsedLines))
      .sort((a, b) => b.score - a.score);
  }
}
