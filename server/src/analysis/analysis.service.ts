import { Injectable, NotFoundException } from "@nestjs/common";
import { AiService } from "../ai/ai.service";
import { PrismaService } from "../prisma/prisma.service";
import { threatDetectionRules } from "./rules";
import type { DetectedThreat } from "./types/detected-threat.type";
import { parseLogContent } from "./utils/log-parser";

@Injectable()
export class AnalysisService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService
  ) {}

  analyzeRawContent(rawContent: string): DetectedThreat[] {
    const parsedLines = parseLogContent(rawContent);

    return threatDetectionRules
      .flatMap((rule) => rule(parsedLines))
      .sort((a, b) => b.score - a.score);
  }

  async analyzeLogFile(userId: string, logFileId: string) {
    const logFile = await this.prisma.logFile.findFirst({
      where: { id: logFileId, userId }
    });

    if (!logFile) {
      throw new NotFoundException("Log file not found.");
    }

    const detections = this.analyzeRawContent(logFile.rawContent);

    await this.prisma.threat.deleteMany({
      where: { userId, logFileId }
    });

    if (detections.length === 0) {
      return {
        logFileId,
        threats: [],
        message: "No threats detected by the current rule set."
      };
    }

    const storedThreats = [];

    for (const detection of detections) {
      const explanation = await this.aiService.explainThreat(detection, logFile.rawContent);
      const storedThreat = await this.prisma.threat.create({
        data: {
          userId,
          logFileId,
          threatType: detection.threatType,
          severity: detection.severity,
          sourceIp: detection.sourceIp,
          description: detection.description,
          aiExplanation: JSON.stringify(explanation),
          evidence: detection.evidence,
          score: detection.score,
          confidence: explanation.confidenceScore
        }
      });

      storedThreats.push({
        ...storedThreat,
        aiExplanation: explanation
      });
    }

    return {
      logFileId,
      threats: storedThreats,
      message: `${storedThreats.length} threat(s) detected and stored.`
    };
  }
}
