import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";
import type { DetectedThreat } from "../analysis/types/detected-threat.type";
import type { AiIncidentReport } from "./types/ai-incident-report.type";
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

  async generateIncidentReport(input: {
    filename: string;
    rawContent: string;
    threats: Array<{
      threatType: string;
      severity: string;
      sourceIp: string | null;
      description: string;
      aiExplanation: string;
      evidence: string;
      score: number;
      confidence: number;
      createdAt: Date;
    }>;
  }): Promise<AiIncidentReport> {
    if (!this.isOpenAiConfigured()) {
      return createFallbackIncidentReport(input);
    }

    try {
      return await this.createOpenAiIncidentReport(input);
    } catch {
      return createFallbackIncidentReport(input);
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

  private async createOpenAiIncidentReport(input: Parameters<AiService["generateIncidentReport"]>[0]): Promise<AiIncidentReport> {
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
            "You are a SOC incident report writer. Return compact JSON only with keys: title, executiveSummary, timelineOfSuspiciousActivity, keyIndicatorsOfCompromise, threatCategories, affectedIpsOrPaths, severityBreakdown, technicalFindings, recommendedRemediation, preventionTips, finalAnalystConclusion. timelineOfSuspiciousActivity must be an array of {time,event}. severityBreakdown must contain critical, high, medium, low numbers."
        },
        {
          role: "user",
          content: JSON.stringify({
            filename: input.filename,
            threats: input.threats,
            logExcerpt: input.rawContent.slice(0, 8000)
          })
        }
      ]
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return createFallbackIncidentReport(input);
    }

    return normalizeIncidentReport(JSON.parse(content), input);
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

function normalizeIncidentReport(value: Partial<AiIncidentReport>, input: Parameters<AiService["generateIncidentReport"]>[0]): AiIncidentReport {
  const fallback = createFallbackIncidentReport(input);
  return {
    title: value.title ?? fallback.title,
    executiveSummary: value.executiveSummary ?? fallback.executiveSummary,
    timelineOfSuspiciousActivity: Array.isArray(value.timelineOfSuspiciousActivity)
      ? value.timelineOfSuspiciousActivity
      : fallback.timelineOfSuspiciousActivity,
    keyIndicatorsOfCompromise: Array.isArray(value.keyIndicatorsOfCompromise)
      ? value.keyIndicatorsOfCompromise
      : fallback.keyIndicatorsOfCompromise,
    threatCategories: Array.isArray(value.threatCategories) ? value.threatCategories : fallback.threatCategories,
    affectedIpsOrPaths: Array.isArray(value.affectedIpsOrPaths) ? value.affectedIpsOrPaths : fallback.affectedIpsOrPaths,
    severityBreakdown: value.severityBreakdown ?? fallback.severityBreakdown,
    technicalFindings: Array.isArray(value.technicalFindings) ? value.technicalFindings : fallback.technicalFindings,
    recommendedRemediation: Array.isArray(value.recommendedRemediation) ? value.recommendedRemediation : fallback.recommendedRemediation,
    preventionTips: Array.isArray(value.preventionTips) ? value.preventionTips : fallback.preventionTips,
    finalAnalystConclusion: value.finalAnalystConclusion ?? fallback.finalAnalystConclusion
  };
}

function createFallbackIncidentReport(input: Parameters<AiService["generateIncidentReport"]>[0]): AiIncidentReport {
  const severityBreakdown = input.threats.reduce(
    (counts, threat) => {
      const severity = threat.severity.toLowerCase();
      if (severity in counts) {
        counts[severity as keyof typeof counts] += 1;
      }
      return counts;
    },
    { critical: 0, high: 0, medium: 0, low: 0 }
  );
  const threatCategories = unique(input.threats.map((threat) => threat.threatType));
  const affectedIpsOrPaths = unique([...input.threats.flatMap((threat) => (threat.sourceIp ? [threat.sourceIp] : [])), input.filename]);
  const indicators = unique(
    input.threats.flatMap((threat) => [
      threat.threatType,
      threat.sourceIp ?? "",
      ...(threat.evidence.match(/\b(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)\b/g) ?? [])
    ])
  ).filter(Boolean);

  return {
    title: `Incident Report for ${input.filename}`,
    executiveSummary:
      input.threats.length > 0
        ? `${input.threats.length} threat(s) were detected in ${input.filename}. The highest severity observed was ${highestSeverity(input.threats)}.`
        : `No rule-based threats were detected in ${input.filename}.`,
    timelineOfSuspiciousActivity: input.threats.map((threat) => ({
      time: threat.createdAt.toISOString(),
      event: `${threat.severity.toUpperCase()} ${threat.threatType}: ${threat.description}`
    })),
    keyIndicatorsOfCompromise: indicators,
    threatCategories,
    affectedIpsOrPaths,
    severityBreakdown,
    technicalFindings: input.threats.map((threat) => `${threat.threatType}: ${threat.evidence}`),
    recommendedRemediation: unique(
      input.threats.flatMap((threat) =>
        buildRecommendedSteps({
          threatType: threat.threatType,
          severity: threat.severity as DetectedThreat["severity"],
          score: threat.score,
          sourceIp: threat.sourceIp ?? undefined,
          description: threat.description,
          evidence: threat.evidence,
          confidence: threat.confidence
        })
      )
    ),
    preventionTips: [
      "Enable alerting for repeated authentication failures and suspicious request patterns.",
      "Restrict administrative paths and remote access to trusted networks.",
      "Review exposed services regularly and patch vulnerable applications.",
      "Preserve logs centrally for correlation across authentication, web, and infrastructure systems."
    ],
    finalAnalystConclusion:
      input.threats.length > 0
        ? "Fallback report generation indicates suspicious activity that should be reviewed by an analyst before closure."
        : "No suspicious activity was identified by the current rule set, but continued monitoring is recommended."
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

function unique(values: string[]) {
  return Array.from(new Set(values.filter((value) => value.trim().length > 0)));
}

function highestSeverity(threats: Array<{ severity: string }>) {
  const order = ["critical", "high", "medium", "low"];
  return order.find((severity) => threats.some((threat) => threat.severity.toLowerCase() === severity)) ?? "low";
}
