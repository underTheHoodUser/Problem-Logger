"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SeverityLevel } from "@/types/problem.type";
import { supabase } from "@/lib/supabase";
import { useStrings } from "@/context/StringsContext";
import { toast } from 'react-hot-toast';

export default function AddChuddi() {
  const router = useRouter();
  const S = useStrings().ADD_PAGE;
  const [selectedLevel, setSelectedLevel] = useState<SeverityLevel>('chuddi');
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const LEVELS = [
    { id: 'dhoom', text: S.LEVELS.DHOOM, color: 'bg-green-400', border: 'border-green-500', shadow: '#4ade80' },
    { id: 'chuddi', text: S.LEVELS.CHUDDI, color: 'bg-yellow-400', border: 'border-yellow-500', shadow: '#facc15' },
    { id: 'dhoom_chuddi', text: S.LEVELS.DHOOM_CHUDDI, color: 'bg-red-500', border: 'border-red-600', shadow: '#ef4444' },
  ] as const;

  const handleSubmit = async () => {
    if (!content.trim()) return toast.error("Bhai problem toh likh!");
    
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, level: selectedLevel })
      });

      const data = await res.json();
      
      if (!res.ok) {
        toast.error(data.error || "Error ho gaya bhai, server check kar.");
      } else {
        setIsSuccess(true);
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error ho gaya.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto py-4 md:py-8">
      <div className="mb-10 relative inline-block">
        <h2 className="text-4xl md:text-6xl text-white uppercase tracking-tight drop-shadow-[2px_2px_0_rgba(236,72,153,1)] md:drop-shadow-[4px_4px_0_rgba(236,72,153,1)] font-['var(--font-rubik)'] leading-tight text-center md:text-left">
          {S.TITLE}
        </h2>
        <div className="absolute -bottom-4 right-0 md:-right-6 bg-yellow-400 border-2 border-white px-2 py-0.5 md:px-3 md:py-1 rotate-12 font-black text-[10px] md:text-xs text-black">
          {S.SUB_TITLE}
        </div>
      </div>

      {isSuccess ? (
        <div className="bg-[#111] border-4 border-green-400 rounded-3xl p-8 md:p-12 shadow-[8px_8px_0_0_#4ade80] text-center space-y-6">
          <div className="text-6xl mb-4">🙌</div>
          <h2 className="text-3xl md:text-4xl text-white font-black uppercase font-['var(--font-rubik)']">
            TERI CHUDDI SUBMIT HO GAYI!
          </h2>
          <p className="text-zinc-400 text-lg md:text-xl font-bold">
            Admin ke approve karte hi public feed me dikhne lagegi. Spam se bachne ke liye approval zaroori hai!
          </p>
          <button 
            onClick={() => router.push('/')}
            className="w-full bg-cyan-400 border-4 border-black rounded-xl py-3 md:py-4 text-black text-xl md:text-2xl font-black uppercase tracking-widest hover:bg-yellow-400 transition-colors shadow-[4px_4px_0_0_#000] active:scale-95 cursor-pointer touch-manipulation mt-4"
          >
            FEED PE WAPAS JAA
          </button>
        </div>
      ) : (
        <div className="bg-[#111] border-4 border-cyan-400 rounded-3xl p-4 md:p-8 shadow-[4px_4px_0_0_#06b6d4] md:shadow-[8px_8px_0_0_#06b6d4] space-y-6 md:space-y-8">
        
        <div className="space-y-2 md:space-y-3">
          <label className="text-lg md:text-2xl text-slate-100 uppercase flex items-center gap-2 font-['var(--font-rubik)'] tracking-wide">
            <span className="w-1.5 md:w-2 h-5 md:h-6 bg-cyan-400 inline-block transform skew-x-12"></span>
            {S.THREAT_LABEL}
          </label>
          <div className="flex flex-row gap-2 md:gap-4 relative z-10">
            {LEVELS.map((lvl) => {
              const isSelected = selectedLevel === lvl.id;
              return (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setSelectedLevel(lvl.id as SeverityLevel)}
                  className={`flex-1 flex flex-col items-center justify-center text-center px-1 py-3 md:px-4 md:py-4 rounded-xl border-4 transition-all duration-200 cursor-pointer touch-manipulation select-none active:scale-95 ${
                    isSelected 
                      ? `${lvl.color} ${lvl.border} text-black transform -translate-y-1 md:-translate-y-2` 
                      : `bg-[#222] border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:bg-[#2a2a2a]`
                  } font-bold text-[10px] sm:text-xs md:text-sm lg:text-base uppercase tracking-wide leading-tight`}
                  style={isSelected ? { boxShadow: `4px 4px 0 0 ${lvl.shadow}` } : {}}
                >
                  <span className="text-base md:text-xl mb-1">{lvl.text.split(' ')[0]}</span>
                  <span>{lvl.text.split(' ').slice(1).join(' ')}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2 md:space-y-3">
          <label className="text-lg md:text-2xl text-slate-100 uppercase flex items-center gap-2 font-['var(--font-rubik)'] tracking-wide">
            <span className="w-1.5 md:w-2 h-5 md:h-6 bg-pink-500 inline-block transform skew-x-12"></span>
            {S.PROBLEM_LABEL}
          </label>
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            className="w-full bg-[#222] border-4 border-zinc-700 rounded-xl p-4 md:p-5 text-base md:text-lg text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 transition-colors resize-none shadow-[inset_0_4px_0_0_rgba(0,0,0,0.5)]"
            placeholder={S.PLACEHOLDER}
          />
        </div>

        <button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-full bg-pink-500 border-4 border-pink-400 rounded-xl py-3 md:py-4 text-white text-xl md:text-3xl uppercase tracking-widest transition-colors shadow-[4px_4px_0_0_#f43f5e] md:shadow-[6px_6px_0_0_#f43f5e] font-['var(--font-rubik)'] active:scale-95 cursor-pointer touch-manipulation ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-cyan-400 hover:text-black hover:border-cyan-300 hover:translate-y-1 hover:shadow-[2px_2px_0_0_#06b6d4]'
          }`}
        >
          {isSubmitting ? 'SUBMITTING...' : S.SUBMIT_BTN}
        </button>
      </div>
      )}
    </div>
  );
}
