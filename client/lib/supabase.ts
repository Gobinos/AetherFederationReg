import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials are missing from environment. Using hardcoded fallback.");
  console.log("VITE_SUPABASE_URL is set:", !!supabaseUrl);
  console.log("VITE_SUPABASE_ANON_KEY is set:", !!supabaseAnonKey);
}

export const supabase = createClient(
  supabaseUrl || "https://obaxejjgylchjygwjjea.supabase.co",
  supabaseAnonKey || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iYXhlampneWxjaGp5Z3dqamVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5MDcxMTYsImV4cCI6MjA4ODQ4MzExNn0.RPq8xkkgCDKVqaP9golkDFpvakrkNhnxiSi2Y0eqmK4"
);
