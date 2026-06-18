export type ReportTimelineItem = {
  time: string;
  event: string;
};

export type SeverityBreakdown = {
  critical: number;
  high: number;
  medium: number;
  low: number;
};

export type AiIncidentReport = {
  title: string;
  executiveSummary: string;
  timelineOfSuspiciousActivity: ReportTimelineItem[];
  keyIndicatorsOfCompromise: string[];
  threatCategories: string[];
  affectedIpsOrPaths: string[];
  severityBreakdown: SeverityBreakdown;
  technicalFindings: string[];
  recommendedRemediation: string[];
  preventionTips: string[];
  finalAnalystConclusion: string;
};
