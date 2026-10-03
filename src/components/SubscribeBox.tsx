"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useStrings } from "@/context/StringsContext";

export function SubscribeBox() {
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
    } catch (err: unknown) {
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
