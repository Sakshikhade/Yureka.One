-- Create table for user's owned cards
CREATE TABLE IF NOT EXISTS user_owned_cards (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    card_id uuid REFERENCES cards(id) ON DELETE SET NULL,
    bank_name text NOT NULL,
    card_name text NOT NULL,
    card_image text,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_owned_cards ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own cards" 
ON user_owned_cards FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cards" 
ON user_owned_cards FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cards" 
ON user_owned_cards FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own cards"
ON user_owned_cards FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);
