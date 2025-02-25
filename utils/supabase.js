import { createClient } from "@supabase/supabase-js";

const SUPABASE_PROJECT_URL = process.env.SUPABASE_PROJECT_URL
 const SUPABASE_KEY_ANON_KEY = process.env.SUPABASE_KEY_ANON_KEY

 export const supabase = createClient(SUPABASE_PROJECT_URL, SUPABASE_KEY_ANON_KEY)
