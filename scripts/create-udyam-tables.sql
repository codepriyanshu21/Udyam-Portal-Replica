-- Create table for storing Udyam registration form submissions
CREATE TABLE IF NOT EXISTS udyam_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  aadhaar_number VARCHAR(12) NOT NULL,
  mobile_number VARCHAR(10) NOT NULL,
  pan_number VARCHAR(10) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  date_of_birth DATE,
  gender VARCHAR(10),
  address TEXT,
  pincode VARCHAR(6),
  state VARCHAR(100),
  district VARCHAR(100),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for OTP verification tracking
CREATE TABLE IF NOT EXISTS otp_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mobile_number VARCHAR(10) NOT NULL,
  otp_code VARCHAR(6) NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_udyam_aadhaar ON udyam_registrations(aadhaar_number);
CREATE INDEX IF NOT EXISTS idx_udyam_pan ON udyam_registrations(pan_number);
CREATE INDEX IF NOT EXISTS idx_udyam_mobile ON udyam_registrations(mobile_number);
CREATE INDEX IF NOT EXISTS idx_otp_mobile ON otp_verifications(mobile_number);
CREATE INDEX IF NOT EXISTS idx_otp_expires ON otp_verifications(expires_at);

-- Add RLS policies for security
ALTER TABLE udyam_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_verifications ENABLE ROW LEVEL SECURITY;

-- Allow public access for now (in production, you'd want more restrictive policies)
CREATE POLICY "Allow public access to udyam_registrations" ON udyam_registrations FOR ALL USING (true);
CREATE POLICY "Allow public access to otp_verifications" ON otp_verifications FOR ALL USING (true);
