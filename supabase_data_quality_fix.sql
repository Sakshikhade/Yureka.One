-- ======================================================
-- YUREKA.MONEY: DATA QUALITY FIX
-- ======================================================
-- Run this in the Supabase SQL Editor (rvqtlvgaqlgylipsaktm).
-- Safe to run multiple times — all statements are idempotent.
-- ======================================================

-- 1. FIX elite_rating = 0
--    If rating > 0, use that as the elite_rating baseline.
--    Otherwise default to 4.5.
UPDATE public.cards
SET elite_rating = rating
WHERE (elite_rating IS NULL OR elite_rating = 0)
  AND rating > 0;

UPDATE public.cards
SET elite_rating = 4.5
WHERE (elite_rating IS NULL OR elite_rating = 0);

-- 2. FIX rating = 0 or null
--    Cards without a rating get the default 4.5.
UPDATE public.cards
SET rating = 4.5
WHERE rating IS NULL OR rating = 0;

-- 3. FIX annual_fee = null
--    Null fees → '₹0' (free / waiver cards).
UPDATE public.cards
SET annual_fee = '₹0'
WHERE annual_fee IS NULL OR annual_fee = '';

-- 4. FIX projected_savings garbage text
--    Clear out placeholder strings — the UI displays '—' for null,
--    which is cleaner than "Not specified" or "N/A".
UPDATE public.cards
SET projected_savings = NULL
WHERE projected_savings IN (
  'Not specified', 'N/A', 'n/a', 'NA', '-', '—', 'TBD', 'Varies'
)
   OR projected_savings = '';

-- 5. NORMALIZE annual_fee format — strip leading ₹ so the UI
--    can add it back consistently without duplication.
--    (Covers both Unicode ₹ and ASCII 'Rs.' prefix variants)
UPDATE public.cards
SET annual_fee = REGEXP_REPLACE(annual_fee, '^[₹\s]+', '', 'g')
WHERE annual_fee LIKE '₹%';

-- Also normalize 'Rs. ' prefix → bare number + suffix
UPDATE public.cards
SET annual_fee = REGEXP_REPLACE(annual_fee, '^Rs\.\s*', '', 'gi')
WHERE annual_fee ~* '^Rs\.';

-- 6. Remove trailing ? marks from data entry errors (e.g. "₹2,999 + GST?")
UPDATE public.cards
SET annual_fee = REPLACE(annual_fee, '?', '')
WHERE annual_fee LIKE '%?';

UPDATE public.cards
SET projected_savings = REPLACE(projected_savings, '?', '')
WHERE projected_savings LIKE '%?';

-- 7. Force schema reload
NOTIFY pgrst, 'reload schema';

-- VERIFICATION QUERIES — run these after to confirm the fix:
-- SELECT COUNT(*) FROM public.cards WHERE status = 'published' AND (elite_rating IS NULL OR elite_rating = 0);  -- should be 0
-- SELECT COUNT(*) FROM public.cards WHERE status = 'published' AND (rating IS NULL OR rating = 0);               -- should be 0
-- SELECT COUNT(*) FROM public.cards WHERE status = 'published' AND (annual_fee IS NULL OR annual_fee = '');      -- should be 0
-- SELECT name, annual_fee, rating, elite_rating, projected_savings FROM public.cards WHERE status = 'published' LIMIT 20;
