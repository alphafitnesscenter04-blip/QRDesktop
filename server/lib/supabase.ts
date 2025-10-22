import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

if (!supabaseUrl) {
  console.warn("NEXT_PUBLIC_SUPABASE_URL is not set. Supabase features will be disabled.");
}
if (!serviceRoleKey) {
  console.warn("SUPABASE_SERVICE_ROLE_KEY is not set. Server Supabase features will be limited.");
}

export const supabaseAdmin = supabaseUrl && serviceRoleKey
  ? createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } })
  : null;
