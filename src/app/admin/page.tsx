"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Trash2, ShieldAlert } from "lucide-react";
import { PAGE_STRINGS } from "@/constants/strings";
import { useInView } from "react-intersection-observer";
import { toast } from 'react-hot-toast';
import { useStrings } from "@/context/StringsContext";

const PAGE_SIZE = 10;

export default function AdminPage() {
  const COMMON = useStrings().COMMON;
  const S = useStrings().ADMIN;
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState<any>(null);
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState("");
  
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();

  const [activeTab, setActiveTab] = useState<"problems" | "settings">("problems");
  const [configJson, setConfigJson] = useState("");
  const [configSaving, setConfigSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchConfig();
    }
  }, [session]);

  const fetchProblems = async (currentPage: number) => {
    const { data, error } = await supabase
      .from('problems')
      .select('*')
      .order('created_at', { ascending: false })
      .range(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE - 1);
      
    if (data) {
      if (currentPage === 0) setProblems(data);
      else {
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
    if (session) {
      fetchProblems(page);
    }
  }, [page, session]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      setPage(p => p + 1);
    }
  }, [inView, hasMore, loading]);

  const fetchConfig = async () => {
    const { data } = await supabase.from('site_config').select('data').eq('id', 'global_strings').single();
    if (data) {
      const merged = { ...PAGE_STRINGS };
      for (const key in data.data) {
        if (typeof data.data[key] === 'object' && merged[key as keyof typeof PAGE_STRINGS]) {
          merged[key as keyof typeof PAGE_STRINGS] = { ...merged[key as keyof typeof PAGE_STRINGS], ...data.data[key] } as any;
        } else {
          merged[key as keyof typeof PAGE_STRINGS] = data.data[key];
        }
      }
      setConfigJson(JSON.stringify(merged, null, 2));
    } else {
      setConfigJson(JSON.stringify(PAGE_STRINGS, null, 2));
    }
  };

  const handleResetToDefault = () => {
    if (confirm(S.SETTINGS_RESET_CONFIRM)) {
      setConfigJson(JSON.stringify(PAGE_STRINGS, null, 2));
    }
  };

  const handleSaveConfig = async () => {
    try {
      setConfigSaving(true);
      const parsed = JSON.parse(configJson);
      
      const { error } = await supabase
        .from('site_config')
        .upsert({ id: 'global_strings', data: parsed });
        
      if (error) throw error;
      toast.success(S.SETTINGS_SAVE_SUCCESS);
    } catch (e: any) {
      toast.error(S.SETTINGS_SAVE_ERROR + e.message);
    } finally {
      setConfigSaving(false);
    }
  };



  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoginError(error.message);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setProblems([]);
  };

  const handleApprove = async (id: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const res = await fetch('/api/admin/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ id })
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(S.ERROR_APPROVE + errorData.error);
      } else {
        setProblems(problems.map(p => p.id === id ? { ...p, is_approved: true } : p));
      }
    } catch (err: any) {
      toast.error(S.ERROR_NETWORK + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(S.DELETE_CONFIRM)) return;
    
    const { error } = await supabase.from('problems').delete().eq('id', id);
    
    if (error) {
      toast.error(S.ERROR_DELETE + error.message);
    } else {
      setProblems(problems.filter(p => p.id !== id));
    }
  };

  if (loading && !session) {
    return <div className="text-center py-20 text-yellow-400 font-bold animate-pulse font-['var(--font-rubik)'] text-2xl tracking-widest">{COMMON.LOADING}</div>;
  }

  if (!session) {
    return (
      <div className="max-w-md mx-auto py-20 px-4">
        <div className="bg-[#111] border-4 border-pink-500 rounded-3xl p-8 shadow-[8px_8px_0_0_#ec4899] text-center">
          <ShieldAlert className="w-16 h-16 text-pink-500 mx-auto mb-4" />
          <h1 className="text-3xl text-white font-black mb-6 font-['var(--font-rubik)']">{S.LOGIN_TITLE}</h1>
          
          {loginError && (
            <div className="bg-red-500/20 text-red-500 border-2 border-red-500 rounded-lg p-3 mb-4 font-bold text-sm">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={S.LOGIN_EMAIL}
              required
              className="w-full bg-[#222] border-4 border-zinc-700 rounded-xl p-4 text-center text-lg text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 font-bold"
            />
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={S.LOGIN_PASS}
              required
              className="w-full bg-[#222] border-4 border-zinc-700 rounded-xl p-4 text-center text-lg text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 font-bold"
            />
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-400 border-4 border-black rounded-xl py-4 text-black text-xl font-black uppercase tracking-widest hover:bg-yellow-400 transition-colors shadow-[4px_4px_0_0_#000] active:scale-95 disabled:opacity-50"
            >
              {loading ? S.LOGIN_WAIT : S.LOGIN_BTN}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl md:text-4xl text-white font-black font-['var(--font-rubik)'] drop-shadow-[2px_2px_0_#ec4899] text-center sm:text-left">
          {S.DASHBOARD_TITLE}
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-400 font-bold hidden md:block">{S.LOGGED_IN_AS} {session.user.email}</span>
          <button 
            onClick={handleLogout}
            className="bg-[#222] border-2 border-zinc-700 text-zinc-300 px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-500 hover:text-white hover:border-red-600 transition-colors"
          >
            {S.LOGOUT_BTN}
          </button>
        </div>
      </div>

      {loading && page === 0 ? (
        <div className="text-center text-yellow-400 font-bold animate-pulse font-['var(--font-rubik)'] text-2xl tracking-widest">{COMMON.LOADING}</div>
      ) : (
        <>
          <div className="flex gap-4 mb-6">
            <button 
              onClick={() => setActiveTab("problems")}
              className={`px-6 py-2 rounded-xl font-black uppercase tracking-widest border-4 ${activeTab === 'problems' ? 'bg-cyan-400 border-black text-black shadow-[4px_4px_0_0_#000]' : 'bg-[#111] border-zinc-700 text-zinc-400 hover:border-cyan-400'}`}
            >
              {S.TAB_PROBLEMS}
            </button>
            <button 
              onClick={() => setActiveTab("settings")}
              className={`px-6 py-2 rounded-xl font-black uppercase tracking-widest border-4 ${activeTab === 'settings' ? 'bg-pink-500 border-black text-black shadow-[4px_4px_0_0_#000]' : 'bg-[#111] border-zinc-700 text-zinc-400 hover:border-pink-500'}`}
            >
              {S.TAB_SETTINGS}
            </button>
          </div>

          {activeTab === 'problems' ? (
            <div className="space-y-4">
              {problems.map((prob) => (
                <div key={prob.id} className={`bg-[#111] border-2 ${prob.is_approved ? 'border-zinc-700' : 'border-yellow-400 shadow-[4px_4px_0_0_#facc15]'} rounded-xl p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between transition-colors group`}>
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {!prob.is_approved ? (
                        <span className="bg-yellow-400 text-black px-2 py-1 rounded text-xs font-black uppercase tracking-widest animate-pulse">
                          {S.NEEDS_APPROVAL}
                        </span>
                      ) : (
                        <span className="bg-green-400 text-black px-2 py-1 rounded text-xs font-black uppercase tracking-widest">
                          {S.APPROVED}
                        </span>
                      )}
                      <span className="bg-[#222] px-2 py-1 rounded text-xs font-bold text-zinc-400 uppercase border border-zinc-700">
                        {prob.level}
                      </span>
                      <span className="bg-[#222] px-2 py-1 rounded text-xs font-bold text-cyan-400 border border-zinc-700">
                        👍 {prob.upvotes}
                      </span>
                      <span className="bg-[#222] px-2 py-1 rounded text-xs font-bold text-pink-400 border border-zinc-700">
                        👎 {prob.downvotes}
                      </span>
                    </div>
                    <p className="text-white font-medium leading-relaxed">{prob.content}</p>
                  </div>
                  <div className="shrink-0 flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                    {!prob.is_approved && (
                      <button 
                        onClick={() => handleApprove(prob.id)}
                        className="flex-1 md:flex-none bg-green-400 border-2 border-green-500 text-black font-black hover:bg-green-300 px-4 py-3 rounded-lg transition-colors active:scale-95 shadow-[2px_2px_0_0_#22c55e]"
                      >
                        {S.BTN_APPROVE}
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(prob.id)}
                      className="flex-none bg-red-500/10 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white p-3 rounded-lg transition-colors active:scale-95 shadow-[2px_2px_0_0_#ef4444]"
                      title="Delete Problem"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
              {problems.length === 0 && (
                <div className="text-center text-zinc-500 py-10 font-bold">{S.NO_PROBLEMS}</div>
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
          ) : (
            <div className="bg-[#111] border-4 border-pink-500 rounded-3xl p-6 shadow-[8px_8px_0_0_#ec4899]">
              <h2 className="text-2xl text-white font-black mb-4 font-['var(--font-rubik)']">{S.SETTINGS_TITLE}</h2>
              <p className="text-zinc-400 mb-6 font-bold">{S.SETTINGS_WARNING}</p>
              
              <textarea 
                value={configJson}
                onChange={e => setConfigJson(e.target.value)}
                className="w-full h-[500px] bg-[#222] border-4 border-zinc-700 rounded-xl p-4 text-sm text-cyan-300 font-mono focus:outline-none focus:border-cyan-400"
              />
              
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button 
                  onClick={handleResetToDefault}
                  className="flex-1 bg-[#222] border-4 border-zinc-700 text-zinc-300 px-6 py-4 rounded-xl font-black uppercase tracking-widest hover:border-red-500 hover:text-red-500 active:scale-95 transition-colors"
                >
                  RESET DEFAULTS
                </button>
                <button 
                  onClick={handleSaveConfig}
                  disabled={configSaving}
                  className="flex-[2] bg-pink-500 border-4 border-black text-black px-6 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-yellow-400 active:scale-95 transition-colors shadow-[4px_4px_0_0_#000]"
                >
                  {configSaving ? S.SETTINGS_SAVING : S.SETTINGS_SAVE}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
