import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Toaster from "@/components/Toaster";
import { StringsProvider } from "@/context/StringsContext";

export const metadata: Metadata = {
  title: "Dhoooooom",
  description: "Share your Chuddi.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <head>
        <style dangerouslySetInnerHTML={{ __html: `@import url('https://fonts.googleapis.com/css2?family=Rubik+Dirt&family=Syne+Mono&display=swap');` }} />
      </head>
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-slate-100 font-sans">
        <StringsProvider>
          {/* Dark Anime Halftone Background */}
          <div className="fixed inset-0 z-[-1] pointer-events-none">
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: "radial-gradient(rgba(255,255,255,0.2) 2px, transparent 2px)",
              backgroundSize: "16px 16px"
            }}></div>
          </div>

          {/* Diagonal stripe accent */}
          <div className="fixed top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 via-yellow-400 to-cyan-500 z-50"></div>

          <Header />
          <Toaster />

          <main className="flex-1 max-w-3xl w-full mx-auto p-4 md:p-8 relative">
            {children}
          </main>
        </StringsProvider>
      </body>
    </html>
  );
}
