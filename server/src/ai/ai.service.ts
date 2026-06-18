import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";
import type { DetectedThreat } from "../analysis/types/detected-threat.type";
import type { AiThreatExplanation } from "./types/ai-threat-explanation.type";

@Injectable()
export class AiService {
  constructor(private readonly configService: ConfigService) {}

  isOpenAiConfigured() {
    return Boolean(this.configService.get<string>("OPENAI_API_KEY"));
  }

  async explainThreat(threat: DetectedThreat, logContext: string): Promise<AiThreatExplanation> {
    if (!this.isOpenAiConfigured()) {
      return this.createFallbackExplanation(threat);
    }

    try {
      return await this.createOpenAiExplanation(threat, logContext);
    } catch {
      return this.createFallbackExplanation(threat);
    }
  }

  createFallbackExplanation(threat: DetectedThreat): AiThreatExplanation {
    return {
      simpleSummary: `${threat.threatType} was detected with ${threat.severity} severity.`,
      trigger: threat.description,
      evidenceFound: threat.evidence,
      possibleAttackerBehavior: buildAttackerBehavior(threat.threatType),
      businessImpact: buildBusinessImpact(threat.severity),
      severityReasoning: `The detection is rated ${threat.severity} because the rule produced a score of ${threat.score}/100 with ${Math.round(
        threat.confidence * 100
      )}% confidence.`,
      recommendedNextSteps: buildRecommendedSteps(threat),
      confidenceScore: threat.confidence,
      analystNotes:
        "Fallback rule-based explanation generated because OpenAI is not configured or the AI request failed. Validate the evidence against adjacent logs before containment."
    };
  }

  private async createOpenAiExplanation(threat: DetectedThreat, logContext: string): Promise<AiThreatExplanation> {
    const client = new OpenAI({
      apiKey: this.configService.getOrThrow<string>("OPENAI_API_KEY")
    });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a SOC analyst. Return compact JSON only with keys: simpleSummary, trigger, evidenceFound, possibleAttackerBehavior, businessImpact, severityReasoning, recommendedNextSteps, confidenceScore, analystNotes. recommendedNextSteps must be an array of strings. confidenceScore must be a number from 0 to 1."
        },
        {
          role: "user",
          content: JSON.stringify({
            detectedThreat: threat,
            relevantLogContext: logContext.slice(0, 6000)
          })
        }
      ]
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return this.createFallbackExplanation(threat);
    }

    return normalizeExplanation(JSON.parse(content), threat);
  }
}

function normalizeExplanation(value: Partial<AiThreatExplanation>, threat: DetectedThreat): AiThreatExplanation {
  const fallback = {
    simpleSummary: `${threat.threatType} detected.`,
    trigger: threat.description,
    evidenceFound: threat.evidence,
    possibleAttackerBehavior: buildAttackerBehavior(threat.threatType),
    businessImpact: buildBusinessImpact(threat.severity),
    severityReasoning: `Rule score ${threat.score}/100 with ${Math.round(threat.confidence * 100)}% confidence.`,
    recommendedNextSteps: buildRecommendedSteps(threat),
    confidenceScore: threat.confidence,
    analystNotes: "AI-generated explanation normalized by LogSage AI."
  };

  return {
    simpleSummary: value.simpleSummary ?? fallback.simpleSummary,
    trigger: value.trigger ?? fallback.trigger,
    evidenceFound: value.evidenceFound ?? fallback.evidenceFound,
    possibleAttackerBehavior: value.possibleAttackerBehavior ?? fallback.possibleAttackerBehavior,
    businessImpact: value.businessImpact ?? fallback.businessImpact,
    severityReasoning: value.severityReasoning ?? fallback.severityReasoning,
    recommendedNextSteps: Array.isArray(value.recommendedNextSteps) ? value.recommendedNextSteps : fallback.recommendedNextSteps,
    confidenceScore: typeof value.confidenceScore === "number" ? value.confidenceScore : fallback.confidenceScore,
    analystNotes: value.analystNotes ?? fallback.analystNotes
  };
}

function buildAttackerBehavior(threatType: string) {
  const lowerType = threatType.toLowerCase();
  if (lowerType.includes("brute")) {
    return "The actor may be attempting credential guessing or validating leaked credentials against exposed authentication services.";
  }
  if (lowerType.includes("sql")) {
    return "The actor may be probing application inputs for injectable database queries or attempting data extraction.";
  }
  if (lowerType.includes("directory")) {
    return "The actor may be mapping exposed paths, admin panels, or backup locations before attempting exploitation.";
  }
  if (lowerType.includes("path")) {
    return "The actor may be attempting traversal or direct access to sensitive configuration and system files.";
  }
  return "The actor may be stressing the application, triggering errors, or probing unstable endpoints for exploitation opportunities.";
}

function buildBusinessImpact(severity: string) {
  if (severity === "critical") {
    return "This may lead to account compromise, unauthorized access, service disruption, or exposure of sensitive operational data.";
  }
  if (severity === "high") {
    return "This may expose sensitive systems or increase the likelihood of compromise if not investigated quickly.";
  }
  return "This may indicate reconnaissance or instability that should be reviewed before it develops into a larger incident.";
}

function buildRecommendedSteps(threat: DetectedThreat) {
  return [
    threat.sourceIp ? `Review and consider temporarily blocking source IP ${threat.sourceIp}.` : "Review the related source activity and affected endpoints.",
    "Correlate the evidence with authentication, web, and infrastructure logs from the same time window.",
    "Preserve the uploaded log evidence and document analyst findings.",
    "Escalate if additional suspicious activity is found around the same source, user, or endpoint."
  ];
}
