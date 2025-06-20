// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Use environment variables for Supabase credentials when available
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fallback credentials for local development
const FALLBACK_URL = "https://ufhcicqixojqpyykjljw.supabase.co";
const FALLBACK_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmaGNpY3FpeG9qcXB5eWtqbGp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0MjM2MTUsImV4cCI6MjA2MDk5OTYxNX0.osTYV-QJhl_IbM3fdlrUX6qJp8zUb0YZ0rO0F1Wr-R8";

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.error('Missing Supabase environment variables');
  console.error('SUPABASE_URL:', SUPABASE_URL ? 'Set' : 'Missing');
  console.error('SUPABASE_PUBLISHABLE_KEY:', SUPABASE_PUBLISHABLE_KEY ? 'Set' : 'Missing');
}

const supabaseUrl = SUPABASE_URL || FALLBACK_URL;
const supabaseKey = SUPABASE_PUBLISHABLE_KEY || FALLBACK_KEY;

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
