-- Migration to create the financial_ledger table and set up permissions
CREATE TABLE IF NOT EXISTS public.financial_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email VARCHAR NOT NULL,
    brand_name VARCHAR NOT NULL,
    amount VARCHAR NOT NULL,
    description VARCHAR NOT NULL,
    date VARCHAR NOT NULL,
    sender VARCHAR NOT NULL,
    type VARCHAR NOT NULL, -- 'Credit Card Bill', 'Invoice', 'Bill', 'Transaction'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.financial_ledger ENABLE ROW LEVEL SECURITY;

-- Allow public access policies for localhost sandbox environment
DROP POLICY IF EXISTS "Allow public select from financial_ledger" ON public.financial_ledger;
CREATE POLICY "Allow public select from financial_ledger"
ON public.financial_ledger FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Allow public insert into financial_ledger" ON public.financial_ledger;
CREATE POLICY "Allow public insert into financial_ledger"
ON public.financial_ledger FOR INSERT
TO public
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update of financial_ledger" ON public.financial_ledger;
CREATE POLICY "Allow public update of financial_ledger"
ON public.financial_ledger FOR UPDATE
TO public
USING (true);

DROP POLICY IF EXISTS "Allow public delete of financial_ledger" ON public.financial_ledger;
CREATE POLICY "Allow public delete of financial_ledger"
ON public.financial_ledger FOR DELETE
TO public
USING (true);
