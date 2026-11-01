import fs from "fs";
import path from "path";
import { DealRoom, AuditEvent } from "./types";
import { SEED_DEAL_ROOMS } from "./seed";
import { DealProfile, EngineAssumptions } from "../business-case/types";
import { calculateBusinessCase } from "../business-case/engine";
import { DEFAULT_ASSUMPTIONS } from "../business-case/constants";
import {
  getAllDealRoomsFromTiger,
  getDealRoomByIdFromTiger,
  upsertDealRoomInTiger,
  recordAuditEventInTiger,
} from "./tiger";

const DATA_DIR = path.join(process.cwd(), ".data");
const STORE_FILE = path.join(DATA_DIR, "store.json");

interface StoreData {
  dealRooms: DealRoom[];
  auditEvents: AuditEvent[];
}

function initializeStore(): StoreData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed.dealRooms && Array.isArray(parsed.dealRooms) && parsed.dealRooms.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Failed to read persistent store, initializing with seed data:", err);
  }

  const initialData: StoreData = {
    dealRooms: [...SEED_DEAL_ROOMS],
    auditEvents: [
      {
        id: "evt-init-01",
        dealRoomId: "deal-nordbank-ag",
        eventType: "DEAL_ROOM_INITIALIZED",
        metadata: { title: "NordBank AG initial seed loaded" },
        createdAt: new Date().toISOString(),
      },
    ],
  };

  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(initialData, null, 2), "utf-8");
  } catch (err) {
    console.warn("Failed to write initial store file:", err);
  }

  return initialData;
}

let store: StoreData = initializeStore();

function persistStore() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving store to disk:", err);
  }
}

export function getAllDealRooms(): DealRoom[] {
  return store.dealRooms;
}

export async function getAllDealRoomsWithTiger(): Promise<DealRoom[]> {
  try {
    const tigerRooms = await getAllDealRoomsFromTiger();
    if (tigerRooms && tigerRooms.length > 0) {
      // Merge with memory store
      const map = new Map<string, DealRoom>();
      tigerRooms.forEach((r) => map.set(r.id, r));
      store.dealRooms.forEach((r) => {
        if (!map.has(r.id)) map.set(r.id, r);
      });
      store.dealRooms = Array.from(map.values());
      persistStore();
      return store.dealRooms;
    }
  } catch {
    // Fall back to local store
  }
  return store.dealRooms;
}

export function getDealRoomById(id: string): DealRoom | undefined {
  return store.dealRooms.find((d) => d.id === id);
}

export async function getDealRoomByIdWithTiger(id: string): Promise<DealRoom | undefined> {
  const local = store.dealRooms.find((d) => d.id === id);
  if (local) return local;

  try {
    const tigerRoom = await getDealRoomByIdFromTiger(id);
    if (tigerRoom) {
      store.dealRooms.unshift(tigerRoom);
      persistStore();
      return tigerRoom;
    }
  } catch {
    // Fallback to local
  }
  return undefined;
}

export function createDealRoom(
  title: string,
  profile: DealProfile,
  assumptions: Partial<EngineAssumptions> = {}
): DealRoom {
  const mergedAssumptions: EngineAssumptions = {
    ...DEFAULT_ASSUMPTIONS,
    ...assumptions,
  };
  const activeCase = calculateBusinessCase(profile, mergedAssumptions, 1);
  const id = `deal-${profile.companyName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now().toString(36)}`;
  const now = new Date().toISOString();

  const formattedSavings = activeCase.projectedThreeYearSavings
    ? `$${activeCase.projectedThreeYearSavings.toLocaleString()}`
    : "baseline spend confirmation";

  const newRoom: DealRoom = {
    id,
    workspaceId: "ws-demo",
    title: title || `${profile.companyName} — Decision Room`,
    status: "active",
    currentStage: "case",
    createdBy: "user-demo",
    createdAt: now,
    updatedAt: now,
    profile,
    assumptions: mergedAssumptions,
    activeCase,
    caseHistory: [activeCase],
    memo: {
      id: `memo-${id}`,
      generatedCaseId: `case-${id}-v1`,
      version: 1,
      title: `Executive Approval Memo: IOMETE Deployment Evaluation for ${profile.companyName}`,
      executiveSummary: `${profile.companyName} is assessing its data-platform architecture across ${profile.dataVolumeTb} TB of critical workloads in the ${profile.region} jurisdiction. Telemetry recommends transitioning to a ${activeCase.recommendedDeployment} with IOMETE ${activeCase.recommendedPlan}, eliminating multi-tenant cloud storage markups and asserting full data sovereignty within customer infrastructure.`,
      recommendation: `Approve a 90-day technical evaluation of IOMETE ${activeCase.recommendedPlan} to benchmark high-priority queries and validate the estimated $${activeCase.threeYearTotalCost.toLocaleString()} three-year total cost of ownership.`,
      financialSummary: `Year 1 projected expenditure is $${activeCase.yearOneCost.toLocaleString()} ($${activeCase.yearOneIometeLicense.toLocaleString()} platform license + $${activeCase.yearOneInfraCost.toLocaleString()} underlying compute). Three-year projected cumulative cost is $${activeCase.threeYearTotalCost.toLocaleString()}${activeCase.projectedThreeYearSavings ? `, projecting cumulative savings of ${formattedSavings} against current run-rate with an estimated payback within ${activeCase.paybackMonths || 4} months.` : '. Current annual spend baseline required for comparative ROI.'}`,
      sovereigntyPosition: `Sovereignty Score: ${activeCase.sovereigntyScore}/100. ${activeCase.sovereigntyRationale}`,
      risksAndUnknowns: activeCase.risksAndUnknowns,
      nextSteps: [
        `Deploy IOMETE Helm chart in ${profile.companyName}'s test Kubernetes environment.`,
        `Execute 30-day benchmarking run across primary workloads: ${profile.primaryWorkloads.slice(0, 3).join(", ")}.`,
        `Finalize shared security responsibility matrix with the CISO team.`,
      ],
      createdAt: now,
    },
    briefingScript: {
      id: `script-${id}`,
      generatedCaseId: `case-${id}-v1`,
      scriptText: `For ${profile.companyName}, Telemetry recommends a ${activeCase.recommendedDeployment} of IOMETE. The platform runs inside customer-controlled infrastructure across ${profile.dataVolumeTb} terabytes of analytics workloads. The business case estimates a three-year total cost of $${activeCase.threeYearTotalCost.toLocaleString()}${activeCase.projectedThreeYearSavings ? `, projecting cumulative savings of ${formattedSavings} with payback in ${activeCase.paybackMonths || 4} months` : ''}. Primary decision drivers are complete data sovereignty, granular auditability, and predictable platform licensing. The recommended next step is a ninety-day evaluation with IOMETE to validate query sizing.`,
      estimatedDurationSeconds: 55,
      createdAt: now,
    },
  };

  store.dealRooms.unshift(newRoom);
  const auditEvent: AuditEvent = {
    id: `evt-${Date.now().toString(36)}`,
    dealRoomId: id,
    eventType: "DEAL_ROOM_CREATED",
    metadata: { companyName: profile.companyName, totalCost: activeCase.threeYearTotalCost },
    createdAt: now,
  };
  store.auditEvents.push(auditEvent);

  persistStore();

  // Async push to Tiger Data PostgreSQL
  upsertDealRoomInTiger(newRoom).catch((err) =>
    console.warn("Async Tiger Data push warning:", err.message)
  );
  recordAuditEventInTiger(auditEvent).catch(() => {});

  return newRoom;
}

export function updateDealRoomAssumptions(
  id: string,
  updatedAssumptions: Partial<EngineAssumptions>,
  updatedProfile?: Partial<DealProfile>
): DealRoom | null {
  const roomIndex = store.dealRooms.findIndex((d) => d.id === id);
  if (roomIndex === -1) return null;

  const currentRoom = store.dealRooms[roomIndex];
  const newProfile: DealProfile = updatedProfile
    ? { ...currentRoom.profile, ...updatedProfile }
    : currentRoom.profile;

  const newAssumptions: EngineAssumptions = {
    ...currentRoom.assumptions,
    ...updatedAssumptions,
  };

  const nextVersion = (currentRoom.activeCase?.version || 1) + 1;
  const newCase = calculateBusinessCase(newProfile, newAssumptions, nextVersion);
  const now = new Date().toISOString();

  const formattedSavings = newCase.projectedThreeYearSavings
    ? `$${newCase.projectedThreeYearSavings.toLocaleString()}`
    : "pending confirmation";

  const updatedRoom: DealRoom = {
    ...currentRoom,
    profile: newProfile,
    assumptions: newAssumptions,
    activeCase: newCase,
    caseHistory: [newCase, ...currentRoom.caseHistory],
    updatedAt: now,
    memo: {
      ...currentRoom.memo,
      version: nextVersion,
      financialSummary: `Year 1 projected expenditure is $${newCase.yearOneCost.toLocaleString()}. Three-year projected cumulative cost is $${newCase.threeYearTotalCost.toLocaleString()}${newCase.projectedThreeYearSavings ? `, projecting cumulative savings of ${formattedSavings} with payback in ${newCase.paybackMonths || 4} months.` : ''}`,
      sovereigntyPosition: `Sovereignty Score: ${newCase.sovereigntyScore}/100. ${newCase.sovereigntyRationale}`,
      risksAndUnknowns: newCase.risksAndUnknowns,
    },
    briefingScript: {
      ...currentRoom.briefingScript,
      scriptText: `For ${newProfile.companyName}, Telemetry recommends a ${newCase.recommendedDeployment} of IOMETE. Sized for ${newProfile.dataVolumeTb} terabytes, estimated three-year cumulative cost is $${newCase.threeYearTotalCost.toLocaleString()}${newCase.projectedThreeYearSavings ? `, generating ${formattedSavings} in projected savings` : ''}. Sovereignty score is rated ${newCase.sovereigntyScore} out of 100 with customer-controlled encryption keys. Recommended next step is a ninety-day evaluation with IOMETE.`,
    },
  };

  store.dealRooms[roomIndex] = updatedRoom;
  const auditEvent: AuditEvent = {
    id: `evt-${Date.now().toString(36)}`,
    dealRoomId: id,
    eventType: "ASSUMPTIONS_UPDATED",
    metadata: {
      version: nextVersion,
      changes: updatedAssumptions,
      newSavings: newCase.projectedThreeYearSavings,
    },
    createdAt: now,
  };
  store.auditEvents.push(auditEvent);

  persistStore();

  // Async push to Tiger Data PostgreSQL
  upsertDealRoomInTiger(updatedRoom).catch((err) =>
    console.warn("Async Tiger Data push warning:", err.message)
  );
  recordAuditEventInTiger(auditEvent).catch(() => {});

  return updatedRoom;
}

export function resetToSeedData(): DealRoom[] {
  store = {
    dealRooms: [...SEED_DEAL_ROOMS],
    auditEvents: [],
  };
  persistStore();
  // Also push seed data to Tiger Data
  SEED_DEAL_ROOMS.forEach((room) => {
    upsertDealRoomInTiger(room).catch(() => {});
  });
  return store.dealRooms;
}
