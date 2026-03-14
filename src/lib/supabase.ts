import { createClient } from '@supabase/supabase-js';

// Credentials from .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // In development, this helps catch missing config
  console.warn('Branchy: Supabase credentials not found in env.');
}

export const supabase = createClient(
  supabaseUrl || '', 
  supabaseAnonKey || ''
);
