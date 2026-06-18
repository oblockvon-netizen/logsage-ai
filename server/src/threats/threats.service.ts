import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ThreatsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllForUser(userId: string) {
    const threats = await this.prisma.threat.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });

    return { threats: threats.map(formatThreat) };
  }

  async findOneForUser(userId: string, id: string) {
    const threat = await this.prisma.threat.findFirst({
      where: { id, userId }
    });

    if (!threat) {
      throw new NotFoundException("Threat not found.");
    }

    return { threat: formatThreat(threat) };
  }
}

function formatThreat(threat: {
  id: string;
  userId: string;
  logFileId: string;
  threatType: string;
  severity: string;
  sourceIp: string | null;
  description: string;
  aiExplanation: string;
  evidence: string;
  score: number;
  confidence: number;
  createdAt: Date;
}) {
  return {
    ...threat,
    aiExplanation: parseExplanation(threat.aiExplanation)
  };
}

function parseExplanation(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return { simpleSummary: value };
  }
}
