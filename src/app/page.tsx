"use client";

import { useEffect, useState } from "react";
import { ProblemCard } from "@/components/ProblemCard";
import { SeverityLevel } from "@/types/problem.type";
import { supabase } from "@/lib/supabase";
import { formatDistanceToNow } from 'date-fns';
import { useInView } from 'react-intersection-observer';
import { toast } from 'react-hot-toast';
import { Problem } from '@/types/problem.type';

import { useStrings } from '@/context/StringsContext';

const PAGE_SIZE = 10;

export default function Home() {
  const S = useStrings().HOME;
  const COMMON = useStrings().COMMON;
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState<'all' | SeverityLevel>('all');
  const [sort, setSort] = useState<'new' | 'top'>('new');
  
  const { ref, inView } = useInView();
  
  const fetchProblems = async (currentPage: number, currentFilter: 'all' | SeverityLevel, currentSort: 'new' | 'top') => {
    let query = supabase
      .from('problems')
      .select('*')
      .eq('is_approved', true);

    if (currentFilter !== 'all') {
      query = query.eq('level', currentFilter);
    }

    if (currentSort === 'new') {
      query = query.order('created_at', { ascending: false });
    } else {
      query = query.order('upvotes', { ascending: false }).order('created_at', { ascending: false });
    }
      
    const { data, error } = await query.range(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE - 1);
      
    if (error) {
      console.error("Error fetching problems:", error);
    } else if (data) {
      if (currentPage === 0) {
        setProblems(data);
      } else {
        setProblems(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const newItems = data.filter(d => !existingIds.has(d.id));
          return [...prev, ...newItems];
        });
      }
      if (data.length < PAGE_SIZE) setHasMore(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (inView && hasMore && !loading) {
      setPage(p => p + 1);
    }
  }, [inView, hasMore, loading]);

  useEffect(() => {
    setLoading(true);
    fetchProblems(page, filter, sort);
  }, [page, filter, sort]);

  // When filter or sort changes, reset page to 0
  const handleFilterChange = (newFilter: 'all' | SeverityLevel) => {
    if (filter === newFilter) return;
    setFilter(newFilter);
    setPage(0);
    setHasMore(true);
  };

  const handleSortChange = (newSort: 'new' | 'top') => {
    if (sort === newSort) return;
    setSort(newSort);
    setPage(0);
    setHasMore(true);
  };

  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'problems' },
        (payload) => {
          setPage(0);
          setHasMore(true);
          fetchProblems(0, filter, sort);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filter, sort]);

  const handleVote = async (id: string, type: 'upvote' | 'downvote') => {
    const voted = JSON.parse(localStorage.getItem('voted_problems') || '{}');
    if (voted[id]) {
      toast.error(S.ALREADY_VOTED || "Bhai ek hi baar vote kar sakta hai!");
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
      toast.error(S.VOTE_FAIL || "Network error, vote fail ho gaya!");
    }
  };

  return (
    <div className="py-4 space-y-6">
      
      {/* Filters & Sorting Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-[#111] border-4 border-cyan-400 rounded-xl p-3 md:p-4 gap-4 shadow-[4px_4px_0_0_#06b6d4]">
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start w-full sm:w-auto">
          <button onClick={() => handleFilterChange('all')} className={`px-4 py-1.5 rounded-lg font-black uppercase text-xs md:text-sm border-2 ${filter === 'all' ? 'bg-cyan-400 border-black text-black' : 'bg-transparent border-zinc-700 text-zinc-400 hover:border-cyan-400'}`}>ALL</button>
          <button onClick={() => handleFilterChange('dhoom')} className={`px-4 py-1.5 rounded-lg font-black uppercase text-xs md:text-sm border-2 ${filter === 'dhoom' ? 'bg-green-400 border-black text-black' : 'bg-transparent border-zinc-700 text-zinc-400 hover:border-green-400'}`}>DHOOM</button>
          <button onClick={() => handleFilterChange('chuddi')} className={`px-4 py-1.5 rounded-lg font-black uppercase text-xs md:text-sm border-2 ${filter === 'chuddi' ? 'bg-yellow-400 border-black text-black' : 'bg-transparent border-zinc-700 text-zinc-400 hover:border-yellow-400'}`}>CHUDDI</button>
          <button onClick={() => handleFilterChange('dhoom_chuddi')} className={`px-4 py-1.5 rounded-lg font-black uppercase text-xs md:text-sm border-2 ${filter === 'dhoom_chuddi' ? 'bg-red-500 border-black text-white' : 'bg-transparent border-zinc-700 text-zinc-400 hover:border-red-500'}`}>DHOOM CHUDDI</button>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto shrink-0 justify-center sm:justify-end">
          <button onClick={() => handleSortChange('new')} className={`px-4 py-1.5 rounded-lg font-black uppercase text-xs md:text-sm border-2 ${sort === 'new' ? 'bg-pink-500 border-black text-black' : 'bg-transparent border-zinc-700 text-zinc-400 hover:border-pink-500'}`}>NEWEST</button>
          <button onClick={() => handleSortChange('top')} className={`px-4 py-1.5 rounded-lg font-black uppercase text-xs md:text-sm border-2 ${sort === 'top' ? 'bg-pink-500 border-black text-black' : 'bg-transparent border-zinc-700 text-zinc-400 hover:border-pink-500'}`}>TOP VOTED</button>
        </div>
      </div>

      <div className="grid gap-6">
        {loading && page === 0 ? (
          <div className="text-center py-20 text-xl text-yellow-400 font-black animate-pulse uppercase tracking-widest font-['var(--font-rubik)']">
            {COMMON.LOADING}
          </div>
        ) : problems.length === 0 ? (
          <div className="text-center bg-[#111] border-4 border-pink-500 rounded-3xl p-10 shadow-[8px_8px_0_0_#ec4899]">
            <h2 className="text-2xl text-slate-100 font-bold mb-2 uppercase font-['var(--font-rubik)']">Ek bhi chuddi nahi hai?</h2>
            <p className="text-zinc-400 font-bold">Apni problem add kar upar button daba ke!</p>
          </div>
        ) : (
          problems.map((problem, index) => (
            <ProblemCard 
              key={problem.id}
              id={problem.id}
              index={index}
              content={problem.content}
              level={problem.level as SeverityLevel}
              upvotes={problem.upvotes}
              downvotes={problem.downvotes}
              authorName={problem.author_name}
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
    </div>
  );
}
