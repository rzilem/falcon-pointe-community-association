// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ufhcicqixojqpyykjljw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmaGNpY3FpeG9qcXB5eWtqbGp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0MjM2MTUsImV4cCI6MjA2MDk5OTYxNX0.osTYV-QJhl_IbM3fdlrUX6qJp8zUb0YZ0rO0F1Wr-R8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);