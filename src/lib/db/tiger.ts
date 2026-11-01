import { Pool } from "pg";
import { DealRoom, AuditEvent } from "./types";

let pool: Pool | null = null;
let isInitialized = false;

export function getTigerPool(): Pool | null {
  const connectionString =
    process.env.TIGERDATA_DATABASE_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL;

  if (!connectionString || connectionString.trim() === "") {
    return null;
  }

  if (!pool) {
    try {
      pool = new Pool({
        connectionString: connectionString.trim(),
        ssl: {
          rejectUnauthorized: false,
        },
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      });

      pool.on("error", (err) => {
        console.warn("Tiger Data PostgreSQL pool background error:", err.message);
      });
    } catch (err) {
      console.warn("Failed to initialize Tiger Data PostgreSQL pool:", err);
      pool = null;
    }
  }

  return pool;
}

export async function isTigerConnected(): Promise<boolean> {
  const p = getTigerPool();
  if (!p) return false;
  try {
    const client = await p.connect();
    const res = await client.query("SELECT 1 as connected");
    client.release();
    return res.rows[0]?.connected === 1;
  } catch {
    return false;
  }
}

export async function initTigerTables(): Promise<boolean> {
  const p = getTigerPool();
  if (!p) return false;
  if (isInitialized) return true;

  try {
    const client = await p.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS deal_rooms (
          id TEXT PRIMARY KEY,
          workspace_id TEXT NOT NULL DEFAULT 'ws-demo',
          title TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'active',
          current_stage TEXT NOT NULL DEFAULT 'case',
          profile JSONB NOT NULL,
          assumptions JSONB NOT NULL,
          active_case JSONB NOT NULL,
          case_history JSONB NOT NULL DEFAULT '[]'::jsonb,
          memo JSONB NOT NULL,
          briefing_script JSONB NOT NULL,
          created_by TEXT NOT NULL DEFAULT 'user-demo',
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );

        CREATE TABLE IF NOT EXISTS audit_events (
          id TEXT PRIMARY KEY,
          deal_room_id TEXT NOT NULL,
          event_type TEXT NOT NULL,
          metadata JSONB,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
      `);
      isInitialized = true;
      return true;
    } finally {
      client.release();
    }
  } catch (err) {
    console.warn("Could not auto-migrate Tiger Data tables:", err);
    return false;
  }
}

export async function getAllDealRoomsFromTiger(): Promise<DealRoom[] | null> {
  const p = getTigerPool();
  if (!p) return null;

  try {
    await initTigerTables();
    const client = await p.connect();
    try {
      const res = await client.query(
        "SELECT * FROM deal_rooms ORDER BY updated_at DESC"
      );
      if (res.rows.length === 0) return null;

      return res.rows.map((row) => ({
        id: row.id,
        workspaceId: row.workspace_id,
        title: row.title,
        status: row.status,
        currentStage: row.current_stage,
        profile: row.profile,
        assumptions: row.assumptions,
        activeCase: row.active_case,
        caseHistory: row.case_history || [],
        memo: row.memo,
        briefingScript: row.briefing_script,
        createdBy: row.created_by,
        createdAt: row.created_at?.toISOString?.() || row.created_at,
        updatedAt: row.updated_at?.toISOString?.() || row.updated_at,
      }));
    } finally {
      client.release();
    }
  } catch (err) {
    console.warn("Failed to fetch deal rooms from Tiger Data:", err);
    return null;
  }
}

export async function getDealRoomByIdFromTiger(id: string): Promise<DealRoom | null> {
  const p = getTigerPool();
  if (!p) return null;

  try {
    await initTigerTables();
    const client = await p.connect();
    try {
      const res = await client.query("SELECT * FROM deal_rooms WHERE id = $1 LIMIT 1", [id]);
      if (res.rows.length === 0) return null;
      const row = res.rows[0];
      return {
        id: row.id,
        workspaceId: row.workspace_id,
        title: row.title,
        status: row.status,
        currentStage: row.current_stage,
        profile: row.profile,
        assumptions: row.assumptions,
        activeCase: row.active_case,
        caseHistory: row.case_history || [],
        memo: row.memo,
        briefingScript: row.briefing_script,
        createdBy: row.created_by,
        createdAt: row.created_at?.toISOString?.() || row.created_at,
        updatedAt: row.updated_at?.toISOString?.() || row.updated_at,
      };
    } finally {
      client.release();
    }
  } catch (err) {
    console.warn(`Failed to fetch deal room ${id} from Tiger Data:`, err);
    return null;
  }
}

export async function upsertDealRoomInTiger(dealRoom: DealRoom): Promise<boolean> {
  const p = getTigerPool();
  if (!p) return false;

  try {
    await initTigerTables();
    const client = await p.connect();
    try {
      await client.query(
        `INSERT INTO deal_rooms (
          id, workspace_id, title, status, current_stage, profile, assumptions,
          active_case, case_history, memo, briefing_script, created_by, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          status = EXCLUDED.status,
          current_stage = EXCLUDED.current_stage,
          profile = EXCLUDED.profile,
          assumptions = EXCLUDED.assumptions,
          active_case = EXCLUDED.active_case,
          case_history = EXCLUDED.case_history,
          memo = EXCLUDED.memo,
          briefing_script = EXCLUDED.briefing_script,
          updated_at = EXCLUDED.updated_at`,
        [
          dealRoom.id,
          dealRoom.workspaceId || "ws-demo",
          dealRoom.title,
          dealRoom.status,
          dealRoom.currentStage,
          JSON.stringify(dealRoom.profile),
          JSON.stringify(dealRoom.assumptions),
          JSON.stringify(dealRoom.activeCase),
          JSON.stringify(dealRoom.caseHistory),
          JSON.stringify(dealRoom.memo),
          JSON.stringify(dealRoom.briefingScript),
          dealRoom.createdBy,
          dealRoom.createdAt,
          dealRoom.updatedAt,
        ]
      );
      return true;
    } finally {
      client.release();
    }
  } catch (err) {
    console.warn("Failed to upsert deal room in Tiger Data:", err);
    return false;
  }
}

export async function recordAuditEventInTiger(event: AuditEvent): Promise<boolean> {
  const p = getTigerPool();
  if (!p) return false;

  try {
    await initTigerTables();
    const client = await p.connect();
    try {
      await client.query(
        "INSERT INTO audit_events (id, deal_room_id, event_type, metadata, created_at) VALUES ($1, $2, $3, $4, $5)",
        [
          event.id,
          event.dealRoomId,
          event.eventType,
          JSON.stringify(event.metadata || {}),
          event.createdAt,
        ]
      );
      return true;
    } finally {
      client.release();
    }
  } catch (err) {
    console.warn("Failed to write audit event to Tiger Data:", err);
    return false;
  }
}
