"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PAGE_STRINGS as DEFAULT_STRINGS } from '@/constants/strings';

type StringsType = typeof DEFAULT_STRINGS;

const StringsContext = createContext<{ S: StringsType, loading: boolean }>({ S: DEFAULT_STRINGS, loading: true });

export function StringsProvider({ children }: { children: React.ReactNode }) {
  const [S, setS] = useState<StringsType>(DEFAULT_STRINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStrings = async () => {
      const { data, error } = await supabase
        .from('site_config')
        .select('data')
        .eq('id', 'global_strings')
        .single();
        
      if (data && data.data) {
        // Safely merge DB config with defaults to prevent crashes if DB has old schema
        const merged = { ...DEFAULT_STRINGS };
        for (const key in data.data) {
          if (typeof data.data[key] === 'object' && merged[key as keyof StringsType]) {
            merged[key as keyof StringsType] = { ...merged[key as keyof StringsType], ...data.data[key] } as any;
          } else {
            merged[key as keyof StringsType] = data.data[key];
          }
        }
        setS(merged);
      } else {
        // If it doesn't exist yet, we can insert the defaults using an admin later, 
        // for now just use the local defaults.
      }
      setLoading(false);
    };

    fetchStrings();
  }, []);

  // Show nothing or a global loader while fetching initial strings?
  // We'll just provide the defaults while loading so it doesn't block rendering, 
  // but hydration might flicker.
  return (
    <StringsContext.Provider value={{ S, loading }}>
      {children}
    </StringsContext.Provider>
  );
}

export function useStrings() {
  return useContext(StringsContext).S;
}
