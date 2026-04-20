-- YUREKA.MONEY: REVIEWS DATA MIGRATION (v12.4)
-- This script moves the "fallback" social proof data into the database so it appears in the Admin Panel.

INSERT INTO public.reviews (author, role, company, company_logo, image, quote, rotation, status)
VALUES 
(
    'Paras', 
    'Tech Lead', 
    'Swiggy', 
    'https://upload.wikimedia.org/wikipedia/en/1/12/Swiggy_logo.svg', 
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
    'I thought I knew credit cards, but Yureka found a hidden gem that saves me ₹20k/year on flights.', 
    -2, 
    'published'
),
(
    'Deepankar', 
    'Founder', 
    'D2C Brand', 
    'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', 
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
    'Finally, a platform that doesn''t spam me. The AI chat felt like talking to a financial expert.', 
    1.5, 
    'published'
),
(
    'Riya', 
    'Freelance Designer', 
    'Self', 
    'https://upload.wikimedia.org/wikipedia/en/7/7c/Cred_club_logo.png', 
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
    'The Chrome extension is a game changer. It automatically applies the best card for every transaction.', 
    -1, 
    'published'
),
(
    'Karan', 
    'Marketing VP', 
    'Zepto', 
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Zepto_Logo.jpg/800px-Zepto_Logo.jpg', 
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
    'I used the Voucher Hub to stack rewards on my new laptop. 18% savings total. Insane.', 
    2, 
    'published'
)
ON CONFLICT DO NOTHING;

-- Ensure schema cache is updated
NOTIFY pgrst, 'reload schema';
