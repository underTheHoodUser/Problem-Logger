import type { Metadata } from "next";
import Link from "next/link";
import { Flame, Sparkles } from "lucide-react";
import { PAGE_STRINGS } from "@/constants/strings";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chuddi.store | Anime Style",
  description: "Share your problems (Chuddi).",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <head>
        <style dangerouslySetInnerHTML={{ __html: `@import url('https://fonts.googleapis.com/css2?family=Rubik+Dirt&family=Syne+Mono&display=swap');` }} />
      </head>
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-slate-100 font-sans">
        
        {/* Dark Anime Halftone Background */}
        <div className="fixed inset-0 z-[-1] pointer-events-none">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.2) 2px, transparent 2px)",
            backgroundSize: "16px 16px"
          }}></div>
        </div>

        {/* Diagonal stripe accent */}
        <div className="fixed top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 via-yellow-400 to-cyan-500 z-50"></div>

        <header className="sticky top-0 z-40 w-full bg-pink-500 border-b-4 md:border-b-8 border-black">
          <div className="max-w-4xl mx-auto px-3 md:px-6 h-16 md:h-24 flex items-center justify-between gap-2">
            <Link href="/" className="flex items-center gap-2 md:gap-3 group shrink-0">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-yellow-400 border-2 md:border-4 border-black rounded-lg flex items-center justify-center transform -rotate-6 group-hover:rotate-6 transition-transform shadow-[2px_2px_0_0_#000] md:shadow-[4px_4px_0_0_#000]">
                <Flame className="w-4 h-4 md:w-7 md:h-7 text-black" fill="currentColor" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-5xl text-white tracking-tight mt-1 font-['var(--font-rubik)'] drop-shadow-[2px_2px_0_#000] truncate">
                {PAGE_STRINGS.COMMON.APP_NAME}<span className="text-cyan-300 font-['var(--font-rubik)']">{PAGE_STRINGS.COMMON.APP_DOMAIN}</span>
              </h1>
            </Link>
            
            <nav className="flex items-center shrink-0">
              <Link 
                href="/add" 
                className="group relative inline-flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-6 py-2 md:py-3 bg-yellow-400 border-2 md:border-4 border-black rounded-xl text-black text-[11px] sm:text-xs md:text-xl font-bold tracking-widest transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000] shadow-[3px_3px_0_0_#000] font-['var(--font-rubik)']"
              >
                <Sparkles className="w-3 h-3 md:w-5 md:h-5 hidden sm:block" />
                <span>{PAGE_STRINGS.COMMON.ADD_BUTTON}</span>
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1 max-w-3xl w-full mx-auto p-4 md:p-8 relative">
          {children}
        </main>
      </body>
    </html>
  );
}
