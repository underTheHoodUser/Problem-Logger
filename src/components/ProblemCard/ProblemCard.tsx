"use client";

import { useRef, useState, useEffect } from "react";
import { ArrowUp, ArrowDown, Clock, Share2, MessageCircle } from "lucide-react";
import { SeverityLevel, Comment } from "@/types/problem.type";
import { SEVERITY_CONFIG, CARD_ROTATIONS } from "./ProblemCard.config";
import { CrackEffect } from "./CrackEffect";
import { toPng } from 'html-to-image';
import download from 'downloadjs';
import { toast } from "react-hot-toast";
import { useAvatar } from "@/lib/useAvatar";
import { formatDistanceToNow } from "date-fns";

export interface ProblemCardProps {
  id?: string | number;
  content: string;
  level: SeverityLevel;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  authorName?: string;
  index: number;
  onUpvote?: () => void;
  onDownvote?: () => void;
}

export function ProblemCard({
  id,
  content,
  level,
  upvotes,
  downvotes,
  createdAt,
  authorName = "Anonymous",
  index,
  onUpvote,
  onDownvote,
}: ProblemCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const myAvatar = useAvatar();
  
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    color: chipColor,
    text: chipText,
    border,
    shadow,
    bg,
  } = SEVERITY_CONFIG[level] || SEVERITY_CONFIG.chuddi;
  const rotation = CARD_ROTATIONS[index % CARD_ROTATIONS.length];

  const handleShare = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#0a0a0a' // dark background
      });
      download(dataUrl, `chuddi-${id || index}.png`);
      toast.success("Meme Downloaded! Share it anywhere!");
    } catch (err) {
      toast.error("Failed to generate meme!");
    }
  };

  const fetchComments = async () => {
    if (!id) return;
    setLoadingComments(true);
    try {
      const res = await fetch(`/api/comments?problem_id=${id}`);
      const data = await res.json();
      if (res.ok) {
        setComments(data);
      }
    } catch (e) {
      console.error(e);
    }
    setLoadingComments(false);
  };

  const toggleComments = () => {
    if (!showComments) {
      fetchComments();
    }
    setShowComments(!showComments);
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !id) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem_id: id, content: newComment, author_name: myAvatar })
      });
      if (res.ok) {
        setNewComment("");
        fetchComments(); // refresh
      } else {
        toast.error("Comment fail ho gaya!");
      }
    } catch (err) {
      toast.error("Network error");
    }
    setIsSubmitting(false);
  };

  return (
    <div
      className={`relative ${bg} border-4 ${border} rounded-2xl p-5 md:p-7 ${shadow} transition-all ${!showComments && rotation} overflow-hidden`}
    >
      <div ref={cardRef} className="bg-transparent">
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
        <div className="relative z-10 bg-white border-[3px] border-black rounded-xl p-4 md:p-5 mb-3 shadow-[4px_4px_0_0_rgba(0,0,0,1)] transform -rotate-1 hover:rotate-0 transition-transform">
          <p className="text-black text-lg md:text-xl leading-relaxed">
            "{content}"
          </p>
        </div>

        {/* Author */}
        <div className="relative z-10 text-right mb-4">
          <span className="inline-block bg-black text-white px-3 py-1 rounded-full text-xs font-bold font-['var(--font-rubik)'] tracking-wider transform skew-x-12">
            By: {authorName}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="relative z-10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={onUpvote}
            className="flex items-center gap-1.5 bg-white border-2 border-black rounded-full px-3 md:px-4 py-1.5 text-xs md:text-sm font-black text-black hover:bg-cyan-400 transition-colors shadow-[2px_2px_0_0_#000] hover:shadow-[2px_2px_0_0_#06b6d4] active:scale-95 cursor-pointer"
          >
            <ArrowUp className="w-4 h-4 stroke-[3px]" />
            <span>{upvotes}</span>
          </button>
          <button 
            onClick={onDownvote}
            className="flex items-center gap-1.5 bg-white border-2 border-black rounded-full px-3 md:px-4 py-1.5 text-xs md:text-sm font-black text-black hover:bg-pink-400 hover:text-white transition-colors shadow-[2px_2px_0_0_#000] hover:shadow-[2px_2px_0_0_#ec4899] active:scale-95 cursor-pointer"
          >
            <ArrowDown className="w-4 h-4 stroke-[3px]" />
            <span>{downvotes}</span>
          </button>
          <button 
            onClick={toggleComments}
            className={`flex items-center gap-1.5 border-2 border-black rounded-full px-3 py-1.5 text-xs md:text-sm font-black transition-colors shadow-[2px_2px_0_0_#000] active:scale-95 cursor-pointer ${showComments ? 'bg-black text-white hover:bg-zinc-800 hover:shadow-[2px_2px_0_0_#000]' : 'bg-white text-black hover:bg-yellow-400 hover:shadow-[2px_2px_0_0_#facc15]'}`}
          >
            <MessageCircle className="w-4 h-4 stroke-[3px]" />
          </button>
        </div>
        
        <button 
          onClick={handleShare}
          title="Download as Meme"
          className="flex items-center gap-2 bg-yellow-400 border-2 border-black rounded-full px-4 py-1.5 text-xs md:text-sm font-black text-black hover:bg-white transition-colors shadow-[2px_2px_0_0_#000] hover:shadow-[2px_2px_0_0_#fff] active:scale-95 cursor-pointer"
        >
          <Share2 className="w-4 h-4 stroke-[3px]" />
          <span className="hidden sm:inline">SHARE</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="relative z-10 mt-6 pt-6 border-t-4 border-black/10">
          <h4 className="text-black font-black uppercase font-['var(--font-rubik)'] mb-4">Sarcastic Advice ({comments.length})</h4>
          
          <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {loadingComments ? (
              <p className="text-black/60 font-bold text-sm animate-pulse">Loading advice...</p>
            ) : comments.length === 0 ? (
              <p className="text-black/60 font-bold text-sm">Koi advice nahi. Sab tere jaise nalle hain.</p>
            ) : (
              comments.map(c => (
                <div key={c.id} className="bg-white border-2 border-black rounded-xl p-3 shadow-[2px_2px_0_0_#000]">
                  <p className="text-black font-bold text-sm mb-1">{c.content}</p>
                  <div className="flex justify-between items-center text-[10px] text-zinc-500 font-bold uppercase">
                    <span className="text-pink-500">@{c.author_name}</span>
                    <span>{formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={submitComment} className="flex gap-2">
            <input 
              type="text" 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Bhai ko advice de..."
              maxLength={100}
              className="flex-1 bg-white border-2 border-black rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:border-cyan-500 focus:ring-0 shadow-[inset_0_2px_0_0_rgba(0,0,0,0.1)]"
            />
            <button 
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="bg-black text-white border-2 border-black rounded-xl px-4 py-2 text-xs font-black uppercase hover:bg-pink-500 hover:text-black transition-colors disabled:opacity-50"
            >
              POST
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
