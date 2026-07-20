import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Env vars are injected by Vite at build/dev start. If the dev server started
// before .env was populated, import.meta.env will be undefined — so we fall
// back to the values from .env directly. The anon key is public by design
// (it ships in the client bundle regardless).
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://0ec90b57d6e95fcbda19832f.supabase.co';
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw';

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
