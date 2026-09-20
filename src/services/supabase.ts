import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database.types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

export function getAuthRedirectUrl(): string {
  const configuredRedirectUrl =
    import.meta.env.VITE_SUPABASE_AUTH_REDIRECT_URL?.trim();
  if (configuredRedirectUrl) return configuredRedirectUrl;
  if (typeof window !== "undefined") return `${window.location.origin}/login`;
  return "http://localhost:5173/login";
}

export const supabase = hasSupabaseConfig
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
