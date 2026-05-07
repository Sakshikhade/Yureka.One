import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkBanks() {
    const { data, error } = await supabase.from('cards').select('bank, issuer').limit(100);
    if (error) {
        console.error(error);
        return;
    }
    const banks = [...new Set(data.map(c => c.bank))];
    const issuers = [...new Set(data.map(c => c.issuer))];
    console.log('Banks in DB:', banks);
    console.log('Issuers in DB:', issuers);
}

checkBanks();
