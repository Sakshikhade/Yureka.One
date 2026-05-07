-- Migration for User Cards and Card Applications detection

CREATE TABLE IF NOT EXISTS user_owned_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    bank_name TEXT,
    card_name TEXT,
    last_four TEXT,
    source_mail_id TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS user_card_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    bank_name TEXT,
    card_name TEXT,
    status TEXT, -- 'successful', 'rejected', 'pending'
    application_id TEXT,
    application_date DATE,
    source_mail_id TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS
ALTER TABLE user_owned_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_card_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own owned cards" ON user_owned_cards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own applications" ON user_card_applications FOR SELECT USING (auth.uid() = user_id);
