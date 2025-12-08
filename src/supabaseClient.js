import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tusupabase.supabase.co'
const supabaseAnonKey = 'tu-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)