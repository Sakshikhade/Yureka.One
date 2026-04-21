-- DATA CLEANUP: Remove leading ₹ symbols from cards table
-- This ensures the data is clean and doesn't cause duplication in the UI

UPDATE cards 
SET annual_fee = LTRIM(annual_fee, '₹') 
WHERE annual_fee LIKE '₹%';

UPDATE cards 
SET joining_fee = LTRIM(joining_fee, '₹') 
WHERE joining_fee LIKE '₹%';
