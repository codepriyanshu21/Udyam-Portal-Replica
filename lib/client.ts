import { createClient } from "@supabase/supabase-js"

// Check if Supabase environment variables are available
export const isSupabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0

// Create Supabase client
export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

// Database types
export interface UdyamRegistration {
  id?: string
  aadhaar_number: string
  mobile_number: string
  pan_number: string
  name: string
  email?: string
  date_of_birth?: string
  gender?: string
  address?: string
  pincode?: string
  state?: string
  district?: string
  status?: string
  created_at?: string
  updated_at?: string
}

export interface OtpVerification {
  id?: string
  mobile_number: string
  otp_code: string
  is_verified?: boolean
  expires_at: string
  created_at?: string
}
