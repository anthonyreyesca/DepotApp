import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (process.env.EXPO_PUBLIC_SUPABASE_URL as string) || '';
const supabaseAnonKey = (process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string) || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Let op! Check de .env bestand, iets is leeg");
}
console.log("Supabase URL:", process.env.EXPO_PUBLIC_SUPABASE_URL ? "Loaded ✅" : "Failed ❌");

export const supabase = createClient(supabaseUrl, supabaseAnonKey);