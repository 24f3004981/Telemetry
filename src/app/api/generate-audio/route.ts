import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { scriptText, voiceId, apiKey: clientApiKey } = (await req.json()) as {
      scriptText: string;
      voiceId?: string;
      apiKey?: string;
    };

    if (!scriptText || typeof scriptText !== "string") {
      return NextResponse.json({ error: "Script text is required" }, { status: 400 });
    }

    const apiKey = (clientApiKey && clientApiKey.trim() !== "") ? clientApiKey.trim() : process.env.ELEVENLABS_API_KEY;

    // If real ElevenLabs API key is configured, call ElevenLabs TTS API
    if (apiKey && apiKey.trim() !== "") {
      const voice = voiceId || process.env.ELEVENLABS_TTS_VOICE_ID || "nPczCjzI2devNBz1zQrb";
      const modelId = process.env.ELEVENLABS_TTS_MODEL || "eleven_turbo_v2_5";

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey.trim(),
        },
        body: JSON.stringify({
          text: scriptText,
          model_id: modelId,
          voice_settings: {
            stability: 0.75,
            similarity_boost: 0.85,
            style: 0.05,
            use_speaker_boost: true,
          },
        }),
      });

      if (response.ok) {
        const audioBuffer = await response.arrayBuffer();
        return new NextResponse(audioBuffer, {
          headers: {
            "Content-Type": "audio/mpeg",
            "Content-Length": audioBuffer.byteLength.toString(),
            "Cache-Control": "public, max-age=3600",
          },
        });
      }

      console.warn("ElevenLabs TTS non-200:", await response.text());
    }

    // Return synthesized audio signal metadata for browser execution
    return NextResponse.json({
      status: "ready",
      mode: "browser_synthesis",
      scriptText,
      voiceName: "Executive Calm (Daniel / Natural)",
      durationSeconds: Math.max(30, Math.ceil(scriptText.split(" ").length * 0.45)),
    });
  } catch (error) {
    console.error("Generate audio error:", error);
    return NextResponse.json({ error: "Failed to generate audio" }, { status: 500 });
  }
}
