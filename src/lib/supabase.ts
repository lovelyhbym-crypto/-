import { createBrowserClient } from '@supabase/ssr'
import { getSupabaseEnvVars } from './env'

const { url, anonKey } = getSupabaseEnvVars()

export const supabase = createBrowserClient(url, anonKey);
