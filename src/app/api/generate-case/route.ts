import { NextResponse } from "next/server";
import { calculateBusinessCase } from "@/lib/business-case/engine";
import { DealProfile, EngineAssumptions } from "@/lib/business-case/types";

export async function POST(req: Request) {
  try {
    const { profile, assumptions, version = 1 } = await req.json() as {
      profile: DealProfile;
      assumptions?: Partial<EngineAssumptions>;
      version?: number;
    };

    if (!profile) {
      return NextResponse.json({ error: "Profile is required" }, { status: 400 });
    }

    const caseOutput = calculateBusinessCase(profile, assumptions || {}, version);
    return NextResponse.json({ caseOutput });
  } catch (error) {
    console.error("Generate case error:", error);
    return NextResponse.json({ error: "Failed to generate business case" }, { status: 500 });
  }
}
