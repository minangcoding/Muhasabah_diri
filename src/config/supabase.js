import { createClient } from '@supabase/supabase-js';

// Mengambil URL dan Key dari file .env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Mengecek apakah variabel environment terbaca dengan benar
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables. Cek file .env.local kamu!");
}

// Inisialisasi dan export client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);




