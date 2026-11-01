"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  FileText,
  Key,
  Check,
  X,
  Sparkles,
} from "lucide-react";

interface AudioBriefingPlayerProps {
  scriptText: string;
  durationSeconds?: number;
  companyName: string;
}

export function AudioBriefingPlayer({
  scriptText,
  durationSeconds = 60,
  companyName,
}: AudioBriefingPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showScript, setShowScript] = useState(true);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [elevenLabsKey, setElevenLabsKey] = useState("");
  const [activeVoiceProvider, setActiveVoiceProvider] = useState<"ElevenLabs AI" | "Executive Speech">("Executive Speech");
  const [keySaved, setKeySaved] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load saved ElevenLabs API key from localStorage if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedKey = localStorage.getItem("elevenlabs_api_key");
      if (savedKey) {
        setElevenLabsKey(savedKey);
        setActiveVoiceProvider("ElevenLabs AI");
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Reset when scriptText changes
  useEffect(() => {
    stopAllAudio();
    setCurrentTime(0);
  }, [scriptText]);

  const stopAllAudio = () => {
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      stopAllAudio();
      return;
    }

    // 1. Check if ElevenLabs key is present
    const key = elevenLabsKey || (typeof window !== "undefined" ? localStorage.getItem("elevenlabs_api_key") : null);

    if (key && key.trim() !== "") {
      // Call ElevenLabs TTS via API route
      playElevenLabsTTS(key.trim());
    } else {
      // Play immediately and synchronously via Executive Web Speech API
      // Calling this synchronously on click guarantees NO autoplay blocking on any device!
      playNativeSpeech();
    }
  };

  const playNativeSpeech = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Speech synthesis is not supported on this browser.");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(scriptText);
    utterance.rate = playbackRate;
    utterance.pitch = 0.95;

    // Pick a natural corporate voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) =>
        (v.name.includes("Natural") ||
          v.name.includes("Daniel") ||
          v.name.includes("Guy") ||
          v.name.includes("David") ||
          v.lang.startsWith("en-GB") ||
          v.lang.startsWith("en-US")) &&
        !v.name.includes("Zira")
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentTime(durationSeconds);
      if (timerRef.current) clearInterval(timerRef.current);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      if (timerRef.current) clearInterval(timerRef.current);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setActiveVoiceProvider("Executive Speech");
    startTimer();
  };

  const playElevenLabsTTS = async (apiKey: string) => {
    // Prime speech synthesis as instant backup so user hears immediate voice with no lag
    playNativeSpeech();

    try {
      const res = await fetch("/api/generate-audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scriptText, apiKey }),
      });

      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("audio")) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        if (audioRef.current) {
          // Stop native speech and switch to ElevenLabs neural audio
          if (typeof window !== "undefined" && "speechSynthesis" in window) {
            window.speechSynthesis.cancel();
          }
          audioRef.current.src = url;
          audioRef.current.playbackRate = playbackRate;
          audioRef.current.play().then(() => {
            setActiveVoiceProvider("ElevenLabs AI");
          }).catch(() => {
            // If autoplay was blocked, fallback remains active
          });
        }
      }
    } catch {
      // Fallback native speech continues uninterrupted
    }
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= durationSeconds) {
          setIsPlaying(false);
          if (timerRef.current) clearInterval(timerRef.current);
          return durationSeconds;
        }
        return prev + 1;
      });
    }, 1000 / playbackRate);
  };

  const handleRestart = () => {
    stopAllAudio();
    setCurrentTime(0);
    // Restart on click
    handlePlayPause();
  };

  const handleSpeedChange = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
    if (isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      startTimer();
    }
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseInt(e.target.value, 10);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleSaveElevenLabsKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      if (elevenLabsKey.trim()) {
        localStorage.setItem("elevenlabs_api_key", elevenLabsKey.trim());
        setActiveVoiceProvider("ElevenLabs AI");
        setKeySaved(true);
        setTimeout(() => {
          setKeySaved(false);
          setShowKeyModal(false);
        }, 1200);
      } else {
        localStorage.removeItem("elevenlabs_api_key");
        setActiveVoiceProvider("Executive Speech");
        setShowKeyModal(false);
      }
    }
  };

  const formatSecs = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="rounded-2xl border border-line bg-surface p-4 sm:p-5 shadow-sm space-y-4">
      {/* Hidden audio element for streaming ElevenLabs MP3 */}
      <audio
        ref={audioRef}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(durationSeconds);
          if (timerRef.current) clearInterval(timerRef.current);
        }}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(Math.floor(audioRef.current.currentTime));
          }
        }}
      />

      {/* Header bar */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="grid place-items-center w-8 h-8 rounded-full bg-saffron-soft text-saffron shrink-0">
            <Volume2 className="w-4 h-4" />
          </span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[14px] font-semibold text-ink">
                60-Second Executive Board Briefing
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-teal-soft text-teal border border-teal/20">
                {activeVoiceProvider}
              </span>
            </div>
            <p className="text-[11px] text-ink-3">
              Synthesized for {companyName} boardroom stakeholders
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowKeyModal(true)}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-ink-2 hover:text-ink px-2.5 py-1 rounded-md border border-line hover:bg-sunk transition-colors"
            title="Configure ElevenLabs API Key"
          >
            <Key className="w-3 h-3 text-saffron" />
            <span className="hidden sm:inline">ElevenLabs Key</span>
          </button>

          <button
            type="button"
            onClick={() => setShowScript(!showScript)}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-ink-2 hover:text-ink px-2.5 py-1 rounded-md border border-line hover:bg-sunk transition-colors"
          >
            <FileText className="w-3 h-3" />
            <span>{showScript ? "Hide" : "Script"}</span>
          </button>
        </div>
      </div>

      {/* ElevenLabs API Key Modal */}
      {showKeyModal && (
        <div className="p-4 rounded-xl border border-teal/30 bg-teal-soft/20 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-teal">
              <Sparkles className="w-3.5 h-3.5 text-saffron" />
              <span>Connect ElevenLabs Voice API</span>
            </div>
            <button
              type="button"
              onClick={() => setShowKeyModal(false)}
              className="text-ink-3 hover:text-ink"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-ink-2 leading-relaxed">
            Enter your ElevenLabs API Key to generate ultra-realistic AI voice briefings using Turbo v2.5. If empty, high-fidelity Executive Speech is used automatically.
          </p>

          <form onSubmit={handleSaveElevenLabsKey} className="flex gap-2">
            <input
              type="password"
              value={elevenLabsKey}
              onChange={(e) => setElevenLabsKey(e.target.value)}
              placeholder="xi-api-key (sk_...)"
              className="flex-1 px-3 py-1.5 rounded-lg border border-line bg-surface text-xs font-mono text-ink focus:outline-none focus:border-teal"
            />
            <button
              type="submit"
              className="btn btn-primary text-xs px-4 py-1.5 shrink-0"
            >
              {keySaved ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1" />
                  Saved
                </>
              ) : (
                "Save Key"
              )}
            </button>
          </form>
        </div>
      )}

      {/* Main player controls & waveform */}
      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 bg-sunk/60 rounded-xl p-3 sm:p-4 border border-line">
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handlePlayPause}
            className="w-12 h-12 rounded-full bg-teal hover:bg-teal-2 text-white grid place-items-center shadow-md transition-all active:scale-95 cursor-pointer touch-manipulation"
            title={isPlaying ? "Pause Briefing" : "Play Briefing"}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={handleRestart}
            className="w-9 h-9 rounded-full bg-surface hover:bg-line/40 text-ink-2 grid place-items-center border border-line transition-colors active:scale-95 cursor-pointer touch-manipulation"
            title="Restart from beginning"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Timeline Scrubber & Waveform */}
        <div className="flex-1 w-full space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-ink-3">
            <span>{formatSecs(currentTime)}</span>
            <span className="font-sans font-medium text-ink-2">
              {isPlaying ? "Speaking Board Briefing..." : "Tap Play to Listen"}
            </span>
            <span>{formatSecs(durationSeconds)}</span>
          </div>

          <div className="relative">
            <input
              type="range"
              min={0}
              max={durationSeconds}
              value={currentTime}
              onChange={handleScrub}
              className="w-full h-2 bg-line rounded-lg appearance-none cursor-pointer accent-teal"
            />
          </div>

          {/* Animated Waveform Bars */}
          <div className="flex items-end justify-between h-4 px-1 gap-1 pt-1 opacity-75">
            {[4, 8, 14, 10, 6, 12, 16, 10, 8, 14, 18, 12, 6, 10, 16, 14, 8, 12, 10, 6, 14, 18, 12, 8, 10].map(
              (height, i) => {
                const isActive = (currentTime / durationSeconds) * 25 >= i;
                const dynamicHeight = isPlaying ? Math.max(4, height * (1 + (i % 3) * 0.25)) : height;
                return (
                  <div
                    key={i}
                    style={{ height: `${dynamicHeight}px` }}
                    className={`w-full rounded-full transition-all duration-150 ${
                      isActive ? "bg-teal" : "bg-line-2"
                    }`}
                  />
                );
              }
            )}
          </div>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-1 shrink-0 border border-line rounded-lg p-1 bg-surface">
          {[1, 1.25, 1.5].map((rate) => (
            <button
              key={rate}
              type="button"
              onClick={() => handleSpeedChange(rate)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium transition-colors cursor-pointer touch-manipulation ${
                playbackRate === rate
                  ? "bg-teal text-white shadow-xs"
                  : "text-ink-2 hover:text-ink"
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>

      {/* Script Text Collapsible */}
      {showScript && (
        <div className="rounded-xl border border-line bg-surface p-3.5 sm:p-4 text-[13px] leading-relaxed text-ink-2 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-ink-3">
            <span>Executive Spoken Transcript</span>
            <span>~{scriptText.split(" ").length} words</span>
          </div>
          <p className="font-serif text-[13.5px] text-ink leading-relaxed">
            "{scriptText}"
          </p>
        </div>
      )}
    </div>
  );
}
