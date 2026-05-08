
-- Table for parsed transactions
CREATE TABLE IF NOT EXISTS user_transactions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    amount decimal(12,2) NOT NULL,
    currency text DEFAULT 'INR',
    merchant text NOT NULL,
    transaction_date date NOT NULL,
    category text DEFAULT 'Uncategorized',
    source_mail_id text UNIQUE NOT NULL,
    mail_subject text,
    mail_snippet text,
    created_at timestamptz DEFAULT now()
);

-- Table for parsed bills/statements
CREATE TABLE IF NOT EXISTS user_bills (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    bank_name text NOT NULL,
    amount_due decimal(12,2) NOT NULL,
    minimum_due decimal(12,2),
    due_date date,
    statement_date date,
    source_mail_id text UNIQUE NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Table for parsed orders/shopping
CREATE TABLE IF NOT EXISTS user_orders (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    merchant text NOT NULL,
    item_name text,
    price decimal(12,2),
    order_date date,
    order_id text,
    source_mail_id text UNIQUE NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Table for card applications
CREATE TABLE IF NOT EXISTS user_applications (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    bank_name text NOT NULL,
    card_name text,
    status text, -- approved, rejected, pending
    application_date date,
    application_id text,
    source_mail_id text UNIQUE NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Add missing columns to existing user_owned_cards
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_owned_cards' AND column_name='last_four') THEN
        ALTER TABLE user_owned_cards ADD COLUMN last_four text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_owned_cards' AND column_name='source_mail_id') THEN
        ALTER TABLE user_owned_cards ADD COLUMN source_mail_id text UNIQUE;
    END IF;
END $$;

-- Enable RLS for all tables
ALTER TABLE user_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_applications ENABLE ROW LEVEL SECURITY;

-- Policies for user_transactions
DROP POLICY IF EXISTS "Users can view their own transactions" ON user_transactions;
CREATE POLICY "Users can view their own transactions" ON user_transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own transactions" ON user_transactions;
CREATE POLICY "Users can insert their own transactions" ON user_transactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own transactions" ON user_transactions;
CREATE POLICY "Users can update their own transactions" ON user_transactions FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Policies for user_bills
DROP POLICY IF EXISTS "Users can view their own bills" ON user_bills;
CREATE POLICY "Users can view their own bills" ON user_bills FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own bills" ON user_bills;
CREATE POLICY "Users can insert their own bills" ON user_bills FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own bills" ON user_bills;
CREATE POLICY "Users can update their own bills" ON user_bills FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Policies for user_orders
DROP POLICY IF EXISTS "Users can view their own orders" ON user_orders;
CREATE POLICY "Users can view their own orders" ON user_orders FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own orders" ON user_orders;
CREATE POLICY "Users can insert their own orders" ON user_orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own orders" ON user_orders;
CREATE POLICY "Users can update their own orders" ON user_orders FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Policies for user_applications
DROP POLICY IF EXISTS "Users can view their own applications" ON user_applications;
CREATE POLICY "Users can view their own applications" ON user_applications FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own applications" ON user_applications;
CREATE POLICY "Users can insert their own applications" ON user_applications FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own applications" ON user_applications;
CREATE POLICY "Users can update their own applications" ON user_applications FOR UPDATE TO authenticated USING (auth.uid() = user_id);
