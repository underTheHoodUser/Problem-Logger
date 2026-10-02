import { ArrowUp, ArrowDown, Clock } from "lucide-react";
import { ProblemCardProps } from "./types";
import { SEVERITY_CONFIG, CARD_ROTATIONS } from "./ProblemCard.config";
import { CrackEffect } from "./CrackEffect";

export function ProblemCard({
  content,
  level,
  upvotes,
  downvotes,
  createdAt,
  index,
  onUpvote,
  onDownvote,
}: ProblemCardProps) {
  const {
    color: chipColor,
    text: chipText,
    border,
    shadow,
    bg,
  } = SEVERITY_CONFIG[level] || SEVERITY_CONFIG.chuddi;
  const rotation = CARD_ROTATIONS[index % CARD_ROTATIONS.length];

  return (
    <div
      className={`relative ${bg} border-4 ${border} rounded-2xl p-5 md:p-7 ${shadow} hover:-translate-y-1 transition-transform ${rotation} overflow-hidden`}
    >
      {/* Background Crack Effect */}
      <CrackEffect level={level} />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 transform -skew-x-12">
          <span
            className={`inline-block px-4 py-1 text-sm md:text-base uppercase font-bold font-['var(--font-rubik)'] tracking-widest ${chipColor}`}
          >
            {chipText}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-black text-xs font-bold bg-white/50 px-3 py-1 rounded-full border-2 border-black">
          <Clock className="w-3.5 h-3.5" />
          <span>{createdAt}</span>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 bg-white border-[3px] border-black rounded-xl p-4 md:p-5 mb-6 shadow-[4px_4px_0_0_rgba(0,0,0,1)] transform -rotate-1 hover:rotate-0 transition-transform">
        <p className="text-black text-lg md:text-xl leading-relaxed">
          "{content}"
        </p>
      </div>

      {/* Actions */}
      <div className="relative z-10 flex items-center gap-4">
        <button 
          onClick={onUpvote}
          className="flex items-center gap-1.5 bg-white border-2 border-black rounded-full px-4 py-1.5 text-sm font-black text-black hover:bg-cyan-400 transition-colors shadow-[2px_2px_0_0_#000] hover:shadow-[2px_2px_0_0_#06b6d4] active:scale-95 cursor-pointer touch-manipulation"
        >
          <ArrowUp className="w-4 h-4 stroke-[3px]" />
          <span>{upvotes}</span>
        </button>
        <button 
          onClick={onDownvote}
          className="flex items-center gap-1.5 bg-white border-2 border-black rounded-full px-4 py-1.5 text-sm font-black text-black hover:bg-pink-400 hover:text-white transition-colors shadow-[2px_2px_0_0_#000] hover:shadow-[2px_2px_0_0_#ec4899] active:scale-95 cursor-pointer touch-manipulation"
        >
          <ArrowDown className="w-4 h-4 stroke-[3px]" />
          <span>{downvotes}</span>
        </button>
      </div>
    </div>
  );
}
