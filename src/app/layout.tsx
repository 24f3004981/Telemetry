import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { ShieldCheck, Plus, Sparkles, BarChart3 } from "lucide-react";

export const metadata: Metadata = {
  title: "Telemetry · Turn data-platform decisions into board-ready business cases",
  description:
    "Telemetry is an enterprise decision workspace that turns prospective customer requirements into an IOMETE deployment fit, 3-year TCO model, sovereignty audit, and executive briefing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-dvh flex flex-col bg-bg text-ink antialiased selection:bg-teal-soft selection:text-teal">
        {/* Munshi-Styled Header */}
        <header className="sticky top-0 z-30 bg-bg/85 backdrop-blur border-b border-line/70 no-print">
          <div className="mx-auto max-w-[1180px] px-4 sm:px-6 h-16 flex items-center gap-4 justify-between">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <span className="relative grid place-items-center w-8 h-8 rounded-full bg-teal text-white shadow-sm transition-transform group-hover:scale-105">
                <svg width="20" height="20" viewBox="0 0 40 40" aria-hidden="true">
                  <path
                    d="M21 4.5c8.6 0 15 6 15 13.7S29.6 32 21 32c-2.2 0-4.3-.4-6.2-1.1L5.5 36l2.9-8.6C6.3 25 5.5 22 5.5 18.2 5.5 10.5 12.4 4.5 21 4.5Z"
                    fill="currentColor"
                  />
                  <path
                    d="M8.6 33.2 17.4 22.6"
                    stroke="#FBF8F3"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                  <circle cx="19.3" cy="20.4" r="2.8" fill="#FBF8F3" />
                  <path
                    d="M24.5 13.2h6.2M24.5 17.6h4.2M24.5 22h5.4"
                    stroke="#E8833A"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span className="font-display text-[24px] leading-none tracking-tight text-ink">
                Telemetry
              </span>
            </Link>

            {/* Navigation links & Mode switcher */}
            <nav className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/deal-rooms"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[13px] font-medium text-ink-2 hover:text-ink transition-colors"
              >
                <BarChart3 className="w-4 h-4 text-ink-3" />
                <span>Deal Rooms</span>
              </Link>

              <Link
                href="/deal-rooms/deal-nordbank-01"
                className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-medium bg-ink text-white shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-saffron" />
                <span>NordBank Demo</span>
              </Link>

              {/* Primary CTA Button */}
              <Link href="/deal-rooms/new" className="btn btn-primary text-[12.5px] sm:text-[13.5px] px-3.5 py-1.5">
                <Plus className="w-4 h-4" />
                <span>New Room</span>
              </Link>
            </nav>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
