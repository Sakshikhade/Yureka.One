-- Create tables for Gmail Sync feature

-- 1. Transactions extracted from emails (Receipts, UPI, Small payments)
CREATE TABLE IF NOT EXISTS user_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2),
    currency TEXT DEFAULT 'INR',
    merchant TEXT,
    transaction_date DATE,
    category TEXT,
    source_mail_id TEXT UNIQUE,
    mail_subject TEXT,
    mail_snippet TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Credit Card Bills and Statements
CREATE TABLE IF NOT EXISTS user_bills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    bank_name TEXT,
    card_last_four TEXT,
    amount_due DECIMAL(12, 2),
    minimum_due DECIMAL(12, 2),
    due_date DATE,
    statement_date DATE,
    status TEXT DEFAULT 'pending', -- pending, paid, overdue
    source_mail_id TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Shopping / Order Details
CREATE TABLE IF NOT EXISTS user_shopping_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    item_name TEXT,
    merchant TEXT, -- Amazon, Flipkart, etc.
    price DECIMAL(12, 2),
    order_date DATE,
    delivery_status TEXT,
    order_id TEXT,
    source_mail_id TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE user_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_shopping_orders ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own transactions" ON user_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own bills" ON user_bills FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own shopping orders" ON user_shopping_orders FOR SELECT USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_transactions_user_id ON user_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_bills_user_id ON user_bills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_shopping_orders_user_id ON user_shopping_orders(user_id);
