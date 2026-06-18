import { Injectable, NotFoundException } from "@nestjs/common";
import { AiService } from "../ai/ai.service";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService
  ) {}

  async generateForLogFile(userId: string, logFileId: string) {
    const logFile = await this.prisma.logFile.findFirst({
      where: { id: logFileId, userId },
      include: {
        threats: {
          where: { userId },
          orderBy: { score: "desc" }
        }
      }
    });

    if (!logFile) {
      throw new NotFoundException("Log file not found.");
    }

    const generated = await this.aiService.generateIncidentReport({
      filename: logFile.filename,
      rawContent: logFile.rawContent,
      threats: logFile.threats
    });

    const report = await this.prisma.report.create({
      data: {
        userId,
        logFileId,
        title: generated.title,
        summary: generated.executiveSummary,
        timeline: generated.timelineOfSuspiciousActivity,
        indicators: generated.keyIndicatorsOfCompromise,
        threatCategories: generated.threatCategories,
        affectedAssets: generated.affectedIpsOrPaths,
        severityBreakdown: generated.severityBreakdown,
        technicalFindings: generated.technicalFindings,
        recommendations: generated.recommendedRemediation,
        preventionTips: generated.preventionTips,
        finalConclusion: generated.finalAnalystConclusion
      }
    });

    return {
      report: formatReport(report)
    };
  }

  async findAllForUser(userId: string) {
    const reports = await this.prisma.report.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });

    return {
      reports: reports.map(formatReport)
    };
  }

  async findOneForUser(userId: string, id: string) {
    const report = await this.prisma.report.findFirst({
      where: { id, userId }
    });

    if (!report) {
      throw new NotFoundException("Report not found.");
    }

    return {
      report: formatReport(report)
    };
  }
}

function formatReport(report: {
  id: string;
  userId: string;
  logFileId: string;
  title: string;
  summary: string;
  timeline: unknown;
  indicators: string[];
  threatCategories: string[];
  affectedAssets: string[];
  severityBreakdown: unknown;
  technicalFindings: string[];
  recommendations: string[];
  preventionTips: string[];
  finalConclusion: string;
  createdAt: Date;
}) {
  return {
    id: report.id,
    userId: report.userId,
    logFileId: report.logFileId,
    title: report.title,
    executiveSummary: report.summary,
    timelineOfSuspiciousActivity: report.timeline,
    keyIndicatorsOfCompromise: report.indicators,
    threatCategories: report.threatCategories,
    affectedIpsOrPaths: report.affectedAssets,
    severityBreakdown: report.severityBreakdown,
    technicalFindings: report.technicalFindings,
    recommendedRemediation: report.recommendations,
    preventionTips: report.preventionTips,
    finalAnalystConclusion: report.finalConclusion,
    createdAt: report.createdAt
  };
}
