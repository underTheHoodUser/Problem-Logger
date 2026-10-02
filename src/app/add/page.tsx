import { PAGE_STRINGS } from "@/constants/strings";

export default function AddChuddi() {
  const S = PAGE_STRINGS.ADD_PAGE;
  
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

      <div className="bg-[#111] border-4 border-cyan-400 rounded-3xl p-4 md:p-8 shadow-[4px_4px_0_0_#06b6d4] md:shadow-[8px_8px_0_0_#06b6d4] space-y-6 md:space-y-8">
        
        <div className="space-y-2 md:space-y-3">
          <label className="text-lg md:text-2xl text-slate-100 uppercase flex items-center gap-2 font-['var(--font-rubik)'] tracking-wide">
            <span className="w-1.5 md:w-2 h-5 md:h-6 bg-cyan-400 inline-block transform skew-x-12"></span>
            {S.THREAT_LABEL}
          </label>
          <div className="relative">
            <select className="w-full appearance-none bg-[#222] border-4 border-zinc-700 rounded-xl px-4 py-3 md:px-5 md:py-4 text-base md:text-lg font-bold text-white focus:outline-none focus:border-cyan-400 transition-colors cursor-pointer shadow-[inset_0_4px_0_0_rgba(0,0,0,0.5)]">
              <option value="dhoom">{S.LEVELS.DHOOM}</option>
              <option value="chuddi">{S.LEVELS.CHUDDI}</option>
              <option value="dhoom_chuddi">{S.LEVELS.DHOOM_CHUDDI}</option>
            </select>
          </div>
        </div>

        <div className="space-y-2 md:space-y-3">
          <label className="text-lg md:text-2xl text-slate-100 uppercase flex items-center gap-2 font-['var(--font-rubik)'] tracking-wide">
            <span className="w-1.5 md:w-2 h-5 md:h-6 bg-pink-500 inline-block transform skew-x-12"></span>
            {S.PROBLEM_LABEL}
          </label>
          <textarea 
            rows={5}
            className="w-full bg-[#222] border-4 border-zinc-700 rounded-xl p-4 md:p-5 text-base md:text-lg text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 transition-colors resize-none shadow-[inset_0_4px_0_0_rgba(0,0,0,0.5)]"
            placeholder={S.PLACEHOLDER}
          />
        </div>

        <button className="w-full bg-pink-500 border-4 border-pink-400 rounded-xl py-3 md:py-4 text-white text-xl md:text-3xl uppercase tracking-widest hover:bg-cyan-400 hover:text-black hover:border-cyan-300 transition-colors shadow-[4px_4px_0_0_#f43f5e] md:shadow-[6px_6px_0_0_#f43f5e] hover:translate-y-1 hover:shadow-[2px_2px_0_0_#06b6d4] font-['var(--font-rubik)']">
          {S.SUBMIT_BTN}
        </button>
      </div>
    </div>
  );
}
