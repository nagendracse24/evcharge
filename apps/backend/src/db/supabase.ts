import { createClient } from '@supabase/supabase-js';
import { config } from '../config';

// Create Supabase client with anon key (for user-level operations)
export const supabase = createClient(
  config.SUPABASE_URL,
  config.SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: false,
    },
  }
);

// Create admin client with service role key (for backend operations)
export const supabaseAdmin = config.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(
      config.SUPABASE_URL,
      config.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )
  : supabase;

