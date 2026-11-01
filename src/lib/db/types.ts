import { DealProfile, CaseOutput, EngineAssumptions } from "../business-case/types";

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  createdAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
}

export interface DealRoom {
  id: string;
  workspaceId: string;
  title: string;
  status: "draft" | "active" | "approved" | "archived";
  currentStage: "intake" | "profile" | "case" | "memo" | "briefing";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  profile: DealProfile;
  assumptions: EngineAssumptions;
  activeCase: CaseOutput;
  caseHistory: CaseOutput[];
  memo: MemoVersion;
  briefingScript: BriefingScript;
}

export interface MemoVersion {
  id: string;
  generatedCaseId: string;
  version: number;
  title: string;
  executiveSummary: string;
  recommendation: string;
  financialSummary: string;
  sovereigntyPosition: string;
  risksAndUnknowns: string[];
  nextSteps: string[];
  createdAt: string;
}

export interface BriefingScript {
  id: string;
  generatedCaseId: string;
  scriptText: string;
  estimatedDurationSeconds: number;
  audioUrl?: string;
  createdAt: string;
}

export interface AuditEvent {
  id: string;
  dealRoomId: string;
  eventType: string;
  actorId?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}
