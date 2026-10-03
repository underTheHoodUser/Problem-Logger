import { supabase } from './supabase';
import { PAGE_STRINGS } from '@/constants/strings';

export async function getSiteConfig() {
  try {
    const { data } = await supabase
      .from('site_config')
      .select('data')
      .eq('id', 'global_strings')
      .single();
      
    if (data && data.data) {
      const merged = { ...PAGE_STRINGS };
      for (const key in data.data) {
        if (typeof data.data[key] === 'object' && merged[key as keyof typeof PAGE_STRINGS]) {
          merged[key as keyof typeof PAGE_STRINGS] = { ...merged[key as keyof typeof PAGE_STRINGS], ...data.data[key] };
        } else {
          merged[key as keyof typeof PAGE_STRINGS] = data.data[key];
        }
      }
      return merged;
    }
  } catch (error) {
    console.error("Failed to fetch site config", error);
  }
  return PAGE_STRINGS;
}
