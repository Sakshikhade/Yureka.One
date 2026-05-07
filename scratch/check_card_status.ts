import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkCardStatus() {
    const { data, error } = await supabase.from('cards').select('name, bank, status');
    if (error) {
        console.error(error);
        return;
    }
    const statusCounts = data.reduce((acc: any, c: any) => {
        acc[c.status] = (acc[c.status] || 0) + 1;
        return acc;
    }, {});
    console.log('Card Status Counts:', statusCounts);
    console.log('Sample cards with null or draft status:', data.filter((c: any) => c.status !== 'published').slice(0, 5));
}

checkCardStatus();
