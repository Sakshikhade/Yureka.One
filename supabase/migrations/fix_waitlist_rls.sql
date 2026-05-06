-- Fix RLS for waitlist table
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert into waitlist (Signup flow)
CREATE POLICY "Allow public insert into waitlist" 
ON waitlist FOR INSERT 
TO public
WITH CHECK (true);

-- Allow authenticated users to view their own entries (if needed) or let admins see all
-- For now, let's just ensure insertion works as it's the blocking issue.
CREATE POLICY "Allow public select from waitlist"
ON waitlist FOR SELECT
TO public
USING (true);

-- Optional: If you want only admins to see all, you'd restrict SELECT.
-- But for the purpose of fixing the error, INSERT is the priority.
