"use client";

import { useEffect, useState } from "react";
import { ProblemCard, SeverityLevel } from '@/components/ProblemCard';
import { supabase } from "@/lib/supabase";
import { formatDistanceToNow } from 'date-fns';

export default function Home() {
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchProblems = async () => {
    const { data, error } = await supabase
      .from('problems')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching problems:", error);
    } else {
      setProblems(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProblems();

    // Subscribe to realtime inserts and updates
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'problems' },
        (payload) => {
          fetchProblems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleVote = async (id: string, type: 'upvote' | 'downvote') => {
    // Basic LocalStorage vote limiting
    const voted = JSON.parse(localStorage.getItem('voted_problems') || '{}');
    if (voted[id]) {
      alert("Bhai ek hi baar vote kar sakta hai ek problem pe!");
      return;
    }

    const problem = problems.find(p => p.id === id);
    if (!problem) return;

    // Optimistic UI update
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
      alert("Network error, vote fail ho gaya!");
    }
  };

  return (
    <div className="py-4 space-y-6">
      <div className="grid gap-6">
        {loading ? (
          <div className="text-center py-20 text-xl text-yellow-400 font-black animate-pulse uppercase tracking-widest font-['var(--font-rubik)']">
            Loading Chuddis...
          </div>
        ) : problems.length === 0 ? (
          <div className="text-center bg-[#111] border-4 border-cyan-400 rounded-3xl p-10 shadow-[8px_8px_0_0_#06b6d4]">
            <h2 className="text-2xl text-slate-100 font-bold mb-2 uppercase font-['var(--font-rubik)']">Ek bhi chuddi nahi hai?</h2>
            <p className="text-zinc-400 font-bold">Database abhi setup nahi hua, ya sabki life set hai. Apni problem add kar upar button daba ke!</p>
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
      </div>
    </div>
  );
}
