import { NextResponse } from "next/server";
import { getAllDealRoomsWithTiger, createDealRoom, resetToSeedData } from "@/lib/db/store";
import { DealProfile, EngineAssumptions } from "@/lib/business-case/types";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    if (searchParams.get("reset") === "true") {
      const resetRooms = resetToSeedData();
      return NextResponse.json({ dealRooms: resetRooms });
    }
    const dealRooms = await getAllDealRoomsWithTiger();
    return NextResponse.json({ dealRooms, count: dealRooms.length });
  } catch (error) {
    console.error("GET /api/deal-rooms error:", error);
    return NextResponse.json({ error: "Failed to fetch deal rooms" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, profile, assumptions } = body as {
      title?: string;
      profile: DealProfile;
      assumptions?: Partial<EngineAssumptions>;
    };

    if (!profile || !profile.companyName) {
      return NextResponse.json({ error: "Company profile is required" }, { status: 400 });
    }

    const newDealRoom = createDealRoom(
      title || `${profile.companyName} Decision Room`,
      profile,
      assumptions
    );

    return NextResponse.json({ dealRoom: newDealRoom, success: true }, { status: 201 });
  } catch (error) {
    console.error("POST /api/deal-rooms error:", error);
    return NextResponse.json({ error: "Failed to create deal room" }, { status: 500 });
  }
}
