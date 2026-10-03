"use client";

import { useEffect, useState } from "react";
import { ProblemCard, SeverityLevel } from '@/components/ProblemCard';
import { supabase } from "@/lib/supabase";
import { formatDistanceToNow } from 'date-fns';
import { useInView } from 'react-intersection-observer';
import { toast } from 'react-hot-toast';

import { useStrings } from '@/context/StringsContext';

function SubscribeBox() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");
  const S = useStrings().HOME;

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus("loading");
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      
      if (!res.ok) {
        setStatus("error");
        setMsg(data.error);
        toast.error(data.error);
      } else {
        setStatus("success");
        setMsg(data.message);
        setEmail("");
        toast.success(S.SUBSCRIBE_SUCCESS_TOAST);
      }
    } catch (err) {
      setStatus("error");
      setMsg(S.VOTE_FAIL);
    }
  };

  return (
    <div className="bg-[#111] border-4 border-pink-500 rounded-3xl p-6 md:p-8 mt-12 shadow-[8px_8px_0_0_#ec4899] text-center">
      <h3 className="text-2xl text-white font-black uppercase font-['var(--font-rubik)'] mb-2">{S.SUBSCRIBE_TITLE}</h3>
      <p className="text-zinc-400 font-bold mb-6">{S.SUBSCRIBE_SUBTITLE}</p>
      
      {status === 'success' ? (
        <div className="bg-green-400 text-black border-4 border-black p-4 rounded-xl font-black uppercase">
          {msg}
        </div>
      ) : (
        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={S.SUBSCRIBE_PLACEHOLDER}
            required
            className="flex-1 bg-[#222] border-4 border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-400 font-bold placeholder-zinc-500"
          />
          <button 
            type="submit"
            disabled={status === 'loading'}
            className="bg-cyan-400 border-4 border-black text-black px-6 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-yellow-400 active:scale-95 transition-colors shadow-[4px_4px_0_0_#000]"
          >
            {status === 'loading' ? S.SUBSCRIBE_WAIT : S.SUBSCRIBE_BTN}
          </button>
        </form>
      )}
      {status === 'error' && <p className="text-red-500 font-bold mt-4">{msg}</p>}
    </div>
  );
}

const PAGE_SIZE = 10;

export default function Home() {
  const S = useStrings().HOME;
  const COMMON = useStrings().COMMON;
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();
  
  const fetchProblems = async (currentPage: number) => {
    const { data, error } = await supabase
      .from('problems')
      .select('*')
      .order('created_at', { ascending: false })
      .range(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE - 1);
      
    if (error) {
      console.error("Error fetching problems:", error);
    } else if (data) {
      if (currentPage === 0) {
        setProblems(data);
      } else {
        setProblems(prev => {
          // avoid duplicates if realtime inserted while paginating
          const existingIds = new Set(prev.map(p => p.id));
          const newItems = data.filter(d => !existingIds.has(d.id));
          return [...prev, ...newItems];
        });
      }
      if (data.length < PAGE_SIZE) setHasMore(false);
    }
    setLoading(false);
  };

  // Load more when scrolled to bottom
  useEffect(() => {
    if (inView && hasMore && !loading) {
      setPage(p => p + 1);
    }
  }, [inView, hasMore, loading]);

  useEffect(() => {
    fetchProblems(page);
  }, [page]);

  useEffect(() => {
    // Subscribe to realtime inserts and updates
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'problems' },
        (payload) => {
          // Rather than refetching everything, we just re-fetch page 0 to get the newest stuff
          // Or simplest way for this app: just reset to page 0
          setPage(0);
          setHasMore(true);
          fetchProblems(0);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleVote = async (id: string, type: 'upvote' | 'downvote') => {
    const voted = JSON.parse(localStorage.getItem('voted_problems') || '{}');
    if (voted[id]) {
      toast.error(S.ALREADY_VOTED);
      return;
    }

    const problem = problems.find(p => p.id === id);
    if (!problem) return;

    setProblems(problems.map(p => {
      if (p.id === id) {
        return { ...p, [type === 'upvote' ? 'upvotes' : 'downvotes']: p[type === 'upvote' ? 'upvotes' : 'downvotes'] + 1 };
      }
      return p;
    }));

    voted[id] = type;
    localStorage.setItem('voted_problems', JSON.stringify(voted));

    const { error } = await supabase
      .from('problems')
      .update({ [type === 'upvote' ? 'upvotes' : 'downvotes']: problem[type === 'upvote' ? 'upvotes' : 'downvotes'] + 1 })
      .eq('id', id);
      
    if (error) {
      console.error("Vote failed", error);
      toast.error(S.VOTE_FAIL);
    }
  };

  return (
    <div className="py-4 space-y-6">
      <div className="grid gap-6">
        {loading && page === 0 ? (
          <div className="text-center py-20 text-xl text-yellow-400 font-black animate-pulse uppercase tracking-widest font-['var(--font-rubik)']">
            {COMMON.LOADING}
          </div>
        ) : problems.length === 0 ? (
          <div className="text-center bg-[#111] border-4 border-cyan-400 rounded-3xl p-10 shadow-[8px_8px_0_0_#06b6d4]">
            <h2 className="text-2xl text-slate-100 font-bold mb-2 uppercase font-['var(--font-rubik)']">Ek bhi chuddi nahi hai?</h2>
            <p className="text-zinc-400 font-bold">Apni problem add kar upar button daba ke!</p>
          </div>
        ) : (
          problems.map((problem, index) => (
            <ProblemCard 
              key={problem.id}
              index={index}
              content={problem.content}
              level={problem.level as SeverityLevel}
              upvotes={problem.upvotes}
              downvotes={problem.downvotes}
              createdAt={formatDistanceToNow(new Date(problem.created_at), { addSuffix: true })}
              onUpvote={() => handleVote(problem.id, 'upvote')}
              onDownvote={() => handleVote(problem.id, 'downvote')}
            />
          ))
        )}
        
        {hasMore && !loading && (
          <div ref={ref} className="h-10 w-full" />
        )}
        {loading && page > 0 && (
          <div className="text-center py-4 text-cyan-400 font-bold animate-pulse font-['var(--font-rubik)'] tracking-widest">
            {COMMON.LOADING_MORE}
          </div>
        )}
      </div>

      <SubscribeBox />
    </div>
  );
}
