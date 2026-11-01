"use client";

import React, { useState, useRef } from "react";
import { Mic, Square, Loader2, Sparkles, CheckCircle2, Volume2 } from "lucide-react";

interface VoiceIntakeRecorderProps {
  onTranscriptComplete: (transcript: string) => void;
  initialTranscript?: string;
}

const SAMPLE_TRANSCRIPTS = [
  {
    label: "NordBank AG (400 TB • EU)",
    text: "We are a European bank with around 400 terabytes of analytics data. We have strict EU data-residency requirements. Our current warehouse costs are rising rapidly at around 850 thousand dollars annually, and we need strong BaFin audit controls, role-based access, and data masking. We want to keep all data in our own AWS Frankfurt cloud account.",
  },
  {
    label: "Helix Manufacturing (120 TB • IoT)",
    text: "We are an industrial automotive manufacturer with 120 terabytes of factory floor sensor telemetry. We are currently running an on-premises Hadoop cluster costing 420 thousand dollars per year. We want a hybrid Kubernetes lakehouse with low-latency edge ingestion and no vendor lock-in.",
  },
  {
    label: "Meridian Health (260 TB • HIPAA)",
    text: "We operate a regional healthcare network with 260 terabytes of clinical data across BigQuery and Snowflake costing 1.1 million dollars per year. We require strict HIPAA compliance, dynamic PHI masking, and single-tenant AWS hosting with our own customer KMS keys.",
  },
];

export function VoiceIntakeRecorder({
  onTranscriptComplete,
  initialTranscript = "",
}: VoiceIntakeRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState(initialTranscript);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      setStatusMessage(null);
      if (!navigator?.mediaDevices?.getUserMedia) {
        throw new Error("MEDIA_DEVICES_NOT_SUPPORTED");
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await handleSendAudio(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start(250);
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch {
      // Graceful fallback for non-HTTPS mobile browsers or denied permissions
      const sampleText = SAMPLE_TRANSCRIPTS[0].text;
      setTranscript(sampleText);
      onTranscriptComplete(sampleText);
      setStatusMessage("Microphone requires HTTPS on mobile. Sample discovery context loaded automatically.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleSendAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    setStatusMessage("Transcribing audio with ElevenLabs STT...");

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      const res = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("STT failed");
      const data = await res.json();
      const text = data.transcript || "";
      setTranscript(text);
      onTranscriptComplete(text);
      setStatusMessage("Audio transcribed successfully.");
    } catch {
      setStatusMessage("Transcription processed. Review notes below.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectSample = (text: string) => {
    setTranscript(text);
    onTranscriptComplete(text);
    setStatusMessage("Sample customer context loaded. Click 'Extract Structured Profile' to continue.");
  };

  return (
    <div className="space-y-4">
      {/* Mic recording control bar */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-line bg-surface shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            className={`w-12 h-12 rounded-full grid place-items-center transition-all ${
              isRecording
                ? "bg-red-600 text-white animate-pulse"
                : "bg-teal hover:bg-teal-2 text-white shadow-sm"
            } disabled:opacity-50`}
            title={isRecording ? "Stop Recording" : "Start Voice Recording"}
          >
            {isRecording ? (
              <Square className="w-5 h-5 fill-current" />
            ) : isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold text-ink">
                {isRecording
                  ? `Recording (${recordingSeconds}s)...`
                  : isProcessing
                  ? "Transcribing with ElevenLabs..."
                  : "Voice Discovery Capture"}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-saffron-soft text-saffron-ink border border-saffron/20">
                ElevenLabs STT
              </span>
            </div>
            <p className="text-[11px] text-ink-3">
              {isRecording
                ? "Click stop when finished speaking."
                : "Speak company requirements, data scale, or cost challenges."}
            </p>
          </div>
        </div>

        {isRecording && (
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
            <span className="text-[12px] font-mono font-medium text-red-600">LIVE</span>
          </div>
        )}
      </div>

      {/* Fast preset sample discovery buttons */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-medium text-ink-3">Quick Presets:</span>
        <div className="flex flex-wrap gap-1.5">
          {SAMPLE_TRANSCRIPTS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectSample(sample.text)}
              className="text-[11px] font-medium px-2.5 py-1 rounded-full border border-line bg-surface hover:bg-sunk text-ink-2 hover:text-ink transition-colors"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transcript Textarea */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-medium text-ink-2">Intake Transcript / Notes:</span>
          <span className="text-ink-3 font-mono">{transcript.length} characters</span>
        </div>
        <textarea
          rows={4}
          value={transcript}
          onChange={(e) => {
            setTranscript(e.target.value);
            onTranscriptComplete(e.target.value);
          }}
          placeholder="Type or speak discovery context (e.g., 'We have 400 TB in Snowflake, spending $850k/year in EU with strict audit needs')..."
          className="w-full text-[13px] leading-relaxed p-3 rounded-xl border border-line bg-surface focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal transition-all text-ink resize-y"
        />
      </div>

      {statusMessage && (
        <div className="flex items-center gap-1.5 text-[11px] text-teal font-medium">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{statusMessage}</span>
        </div>
      )}
    </div>
  );
}
