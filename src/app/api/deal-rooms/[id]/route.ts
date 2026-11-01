import { NextResponse } from "next/server";
import { getDealRoomByIdWithTiger, updateDealRoomAssumptions } from "@/lib/db/store";
import { EngineAssumptions, DealProfile } from "@/lib/business-case/types";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const room = await getDealRoomByIdWithTiger(id);
    if (!room) {
      return NextResponse.json({ error: "Deal room not found" }, { status: 404 });
    }
    return NextResponse.json({ dealRoom: room });
  } catch (error) {
    console.error("GET /api/deal-rooms/[id] error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { assumptions, profile } = body as {
      assumptions?: Partial<EngineAssumptions>;
      profile?: Partial<DealProfile>;
    };

    const updated = updateDealRoomAssumptions(id, assumptions || {}, profile);
    if (!updated) {
      return NextResponse.json({ error: "Deal room not found" }, { status: 404 });
    }

    return NextResponse.json({ dealRoom: updated, success: true });
  } catch (error) {
    console.error("PATCH /api/deal-rooms/[id] error:", error);
    return NextResponse.json({ error: "Failed to update assumptions" }, { status: 500 });
  }
}
