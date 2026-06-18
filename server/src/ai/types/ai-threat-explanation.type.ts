export type AiThreatExplanation = {
  simpleSummary: string;
  trigger: string;
  evidenceFound: string;
  possibleAttackerBehavior: string;
  businessImpact: string;
  severityReasoning: string;
  recommendedNextSteps: string[];
  confidenceScore: number;
  analystNotes: string;
};
