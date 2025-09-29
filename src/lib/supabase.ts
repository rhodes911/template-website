import { createClient } from '@supabase/supabase-js'

// Environment variables with fallbacks for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Debug logging
console.log('🔧 Supabase Client Configuration:', {
  url: supabaseUrl,
  hasRealUrl: !supabaseUrl.includes('placeholder'),
  hasRealKey: !supabaseAnonKey.includes('placeholder'),
  env: process.env.NODE_ENV
})

// Check if we're in production and missing required env vars
if (process.env.NODE_ENV === 'production' && (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
  console.warn('⚠️ Supabase environment variables are missing in production!')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Lead = {
  id: number
  name: string | null
  email: string
  message: string | null
  created_at: string
  updated_at?: string
}
