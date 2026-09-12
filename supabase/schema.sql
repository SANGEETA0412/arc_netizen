-- Supabase Schema for ARC Netizen Registry

-- Create table: netizens
CREATE TABLE IF NOT EXISTS public.netizens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    netizen_number BIGINT GENERATED ALWAYS AS IDENTITY,
    x_username TEXT NOT NULL UNIQUE,
    wallet_address TEXT NOT NULL UNIQUE,
    role_slug TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for ordering by netizen_number
CREATE INDEX IF NOT EXISTS netizens_netizen_number_idx ON public.netizens (netizen_number ASC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.netizens ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all netizens
CREATE POLICY "Allow public read access to netizens"
    ON public.netizens
    FOR SELECT
    TO public
    USING (true);

-- Allow public insert access for registration
CREATE POLICY "Allow public insert access to netizens"
    ON public.netizens
    FOR INSERT
    TO public
    WITH CHECK (true);
