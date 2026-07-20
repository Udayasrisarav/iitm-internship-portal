import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

function logMissingEnv(): void {
  // Surface a clear, one-time warning in the console without throwing.
  console.warn(
    '[supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. ' +
      'Add them to .env and restart the dev server.',
  );
}

// Build the client when env vars are present; otherwise provide a no-op stub
// so the rest of the app renders and can show a helpful message.
export const supabase: SupabaseClient =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      })
    : (() => {
        logMissingEnv();
        // A minimal stub that rejects any auth call so the UI can degrade
        // gracefully instead of crashing on import.
        const reject = () => Promise.reject(new Error('Supabase is not configured.'));
        return {
          auth: {
            getSession: reject,
            signInWithOAuth: reject,
            signOut: reject,
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
          },
        } as unknown as SupabaseClient;
      })();
