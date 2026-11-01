import { NextResponse } from "next/server";
import { isTigerConnected } from "@/lib/db/tiger";

export async function GET() {
  try {
    const tigerActive = await isTigerConnected();
    const elevenLabsConfigured = Boolean(process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_API_KEY.trim() !== "");
    const openaiConfigured = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim() !== "");

    return NextResponse.json({
      status: "operational",
      version: "1.0.0",
      services: {
        engine: {
          status: "healthy",
          type: "Deterministic Business-Case v1.0",
        },
        database: {
          provider: "Tiger Data PostgreSQL",
          status: tigerActive ? "connected" : "ready (local cache active)",
          connected: tigerActive,
        },
        voice: {
          provider: "ElevenLabs AI (STT Scribe + TTS Turbo v2.5)",
          configured: elevenLabsConfigured,
          status: elevenLabsConfigured ? "live" : "ready",
        },
        llm: {
          provider: openaiConfigured ? "OpenAI GPT-4.1" : "Deterministic Executive Engine",
          configured: openaiConfigured,
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { status: "degraded", error: (error as Error).message },
      { status: 500 }
    );
  }
}
