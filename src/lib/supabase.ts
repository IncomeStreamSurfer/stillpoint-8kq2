import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Surface a clear error at boot if env is missing
  console.warn('[stillpoint] Missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase: SupabaseClient = createClient(
  supabaseUrl ?? '',
  supabaseAnonKey ?? '',
  {
    auth: { persistSession: false },
  }
);

export type WaitlistEntry = {
  id: string;
  email: string;
  source: string | null;
  created_at: string;
};

export type ContentArticle = {
  id: string;
  title: string;
  slug: string;
  body: string | null;
  published_at: string | null;
  seo_description: string | null;
  created_at: string;
};
