import { getAccessToken } from "@/lib/token-storage";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export type ApiUser = {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type ApiLogFile = {
  id: string;
  userId: string;
  filename: string;
  fileType: string;
  rawContent?: string;
  uploadedAt: string;
};

export type ApiThreatExplanation = {
  simpleSummary?: string;
  trigger?: string;
  evidenceFound?: string;
  possibleAttackerBehavior?: string;
  businessImpact?: string;
  severityReasoning?: string;
  recommendedNextSteps?: string[];
  confidenceScore?: number;
  analystNotes?: string;
};

export type ApiThreat = {
  id: string;
  userId: string;
  logFileId: string;
  threatType: string;
  severity: string;
  sourceIp: string | null;
  description: string;
  aiExplanation: ApiThreatExplanation;
  evidence: string;
  score: number;
  confidence: number;
  createdAt: string;
};

export type ApiReport = {
  id: string;
  userId: string;
  logFileId: string;
  title: string;
  executiveSummary: string;
  timelineOfSuspiciousActivity: unknown;
  keyIndicatorsOfCompromise: string[];
  threatCategories: string[];
  affectedIpsOrPaths: string[];
  severityBreakdown: unknown;
  technicalFindings: string[];
  recommendedRemediation: string[];
  preventionTips: string[];
  finalAnalystConclusion: string;
  createdAt: string;
};

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAccessToken();
  const headers = new Headers(options.headers);

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(Array.isArray(error.message) ? error.message.join(", ") : error.message ?? "Request failed");
  }

  return response.json() as Promise<T>;
}

export const api = {
  register: (body: { fullName: string; email: string; password: string }) =>
    apiRequest<{ accessToken: string; user: ApiUser }>("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body: { email: string; password: string }) =>
    apiRequest<{ accessToken: string; user: ApiUser }>("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: () => apiRequest<{ user: ApiUser }>("/auth/me"),
  uploadLog: (file: File) => {
    const body = new FormData();
    body.append("file", file);
    return apiRequest<{ logFile: ApiLogFile }>("/logs/upload", { method: "POST", body });
  },
  getLogs: () => apiRequest<{ logFiles: ApiLogFile[] }>("/logs"),
  analyzeLog: (logFileId: string) =>
    apiRequest<{ logFileId: string; threats: ApiThreat[]; message: string }>(`/analysis/analyze/${logFileId}`, { method: "POST" }),
  getThreats: () => apiRequest<{ threats: ApiThreat[] }>("/threats"),
  getReports: () => apiRequest<{ reports: ApiReport[] }>("/reports"),
  generateReport: (logFileId: string) =>
    apiRequest<{ report: ApiReport }>(`/reports/generate/${logFileId}`, { method: "POST" })
};
