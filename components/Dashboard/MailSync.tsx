import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
    Mail, Shield, RefreshCw, CheckCircle, 
    ArrowRight, AlertCircle, ShoppingBag, 
    CreditCard, Receipt, Loader2, Link as LinkIcon
} from 'lucide-react';
import { useSupabase } from '../SupabaseProvider';
import { gmailService, GMAIL_SCOPES } from '../../services/gmailService';

const MailSync: React.FC = () => {
    const { user, supabase } = useSupabase();
    const [isLinking, setIsLinking] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [scanStatus, setScanStatus] = useState('');
    const [results, setResults] = useState<{
        transactions: any[];
        bills: any[];
        orders: any[];
        ownedCards: any[];
        applications: any[];
    }>({ transactions: [], bills: [], orders: [], ownedCards: [], applications: [] });

    useEffect(() => {
        const fetchInitialData = async () => {
            const [txs, bills, orders, owned, apps] = await Promise.all([
                supabase.from('user_transactions').select('*').eq('user_id', user?.id).order('transaction_date', { ascending: false }).limit(10),
                supabase.from('user_bills').select('*').eq('user_id', user?.id).order('due_date', { ascending: false }),
                supabase.from('user_shopping_orders').select('*').eq('user_id', user?.id).order('order_date', { ascending: false }).limit(10),
                supabase.from('user_owned_cards').select('*').eq('user_id', user?.id),
                supabase.from('user_card_applications').select('*').eq('user_id', user?.id).order('application_date', { ascending: false })
            ]);

            setResults({
                transactions: txs.data || [],
                bills: bills.data || [],
                orders: orders.data || [],
                ownedCards: owned.data || [],
                applications: apps.data || []
            });
        };

        if (user) fetchInitialData();
    }, [user, supabase]);

    const handleLinkGmail = async () => {
        setIsLinking(true);
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                        scope: GMAIL_SCOPES.join(' ')
                    },
                    redirectTo: window.location.origin + '/dashboard'
                }
            });

            if (error) throw error;
        } catch (err) {
            console.error('Linking failed:', err);
        } finally {
            setIsLinking(false);
        }
    };

    const startScan = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.provider_token;

        if (!token) {
            alert("Please link your Gmail account with the required permissions first.");
            return;
        }

        // Calculate 6 months ago date
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const dateStr = `${sixMonthsAgo.getFullYear()}/${(sixMonthsAgo.getMonth() + 1).toString().padStart(2, '0')}/${sixMonthsAgo.getDate().toString().padStart(2, '0')}`;

        gmailService.setToken(token);
        setIsScanning(true);
        setScanProgress(5);
        setScanStatus('Initializing Deep Neural Scan...');

        try {
            // 1. Transactions (6 months)
            setScanStatus('Scanning 6 Months of Financial Traffic...');
            const messages = await gmailService.fetchMessages(`subject:(receipt OR order OR payment OR "paid to") after:${dateStr}`, 40);
            const fetchedTransactions: any[] = [];
            for (let i = 0; i < messages.length; i++) {
                const details = await gmailService.getMessageDetails(messages[i].id);
                const parsed = gmailService.parseTransaction(details);
                if (parsed) fetchedTransactions.push(parsed);
                setScanProgress(5 + Math.floor((i / messages.length) * 20));
            }

            // 2. Bills & Cards
            setScanStatus('Detecting Card Ecosystem & Statements...');
            const billMessages = await gmailService.fetchMessages(`subject:(statement OR bill OR due OR welcome OR card) after:${dateStr}`, 30);
            const fetchedBills: any[] = [];
            const fetchedOwnedCards: any[] = [];
            for (let i = 0; i < billMessages.length; i++) {
                const details = await gmailService.getMessageDetails(billMessages[i].id);
                const bill = gmailService.parseBill(details);
                const card = gmailService.parseOwnedCard(details);
                if (bill) fetchedBills.push(bill);
                if (card) fetchedOwnedCards.push(card);
                setScanProgress(25 + Math.floor((i / billMessages.length) * 25));
            }

            // 3. Applications
            setScanStatus('Analyzing Application History...');
            const appMessages = await gmailService.fetchMessages(`subject:(application OR status OR reference) after:${dateStr}`, 20);
            const fetchedApps: any[] = [];
            for (let i = 0; i < appMessages.length; i++) {
                const details = await gmailService.getMessageDetails(appMessages[i].id);
                const app = gmailService.parseCardApplication(details);
                if (app) fetchedApps.push(app);
                setScanProgress(50 + Math.floor((i / appMessages.length) * 20));
            }

            // 4. Shopping
            setScanStatus('Harvesting Shopping Details...');
            const shopMessages = await gmailService.fetchMessages(`subject:(order OR "delivery of") after:${dateStr}`, 30);
            const fetchedOrders: any[] = [];
            for (let i = 0; i < shopMessages.length; i++) {
                const details = await gmailService.getMessageDetails(shopMessages[i].id);
                const order = gmailService.parseShoppingOrder(details);
                if (order) fetchedOrders.push(order);
                setScanProgress(70 + Math.floor((i / shopMessages.length) * 20));
            }

            // 5. Save to Supabase (Batch)
            setScanStatus('Encrypting Neural Insights...');
            const savePromises = [];
            if (fetchedTransactions.length > 0) savePromises.push(supabase.from('user_transactions').upsert(fetchedTransactions.map(t => ({ ...t, user_id: user?.id }))));
            if (fetchedBills.length > 0) savePromises.push(supabase.from('user_bills').upsert(fetchedBills.map(b => ({ ...b, user_id: user?.id }))));
            if (fetchedOrders.length > 0) savePromises.push(supabase.from('user_shopping_orders').upsert(fetchedOrders.map(o => ({ ...o, user_id: user?.id }))));
            if (fetchedOwnedCards.length > 0) savePromises.push(supabase.from('user_owned_cards').upsert(fetchedOwnedCards.map(c => ({ ...c, user_id: user?.id }))));
            if (fetchedApps.length > 0) savePromises.push(supabase.from('user_card_applications').upsert(fetchedApps.map(a => ({ ...a, user_id: user?.id }))));
            
            await Promise.all(savePromises);

            setResults({
                transactions: fetchedTransactions.slice(0, 10),
                bills: fetchedBills,
                orders: fetchedOrders.slice(0, 10),
                ownedCards: fetchedOwnedCards,
                applications: fetchedApps
            });
            setScanProgress(100);
            setScanStatus('Intelligent Sync Complete');
        } catch (err) {
            console.error('Scan failed:', err);
            setScanStatus('Neural Link Interrupted');
        } finally {
            setTimeout(() => setIsScanning(false), 2000);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header / Sync Action */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h2 className="text-2xl italic tracking-tight text-white">Financial Intelligence</h2>
                    <p className="text-xs text-white/20 uppercase tracking-[0.3em]">6-Month deep scan active</p>
                </div>
                <button 
                    onClick={startScan}
                    disabled={isScanning}
                    className="flex items-center gap-3 px-6 py-3 bg-clay text-cream rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-clay/10 disabled:opacity-50"
                >
                    <RefreshCw size={14} className={isScanning ? 'animate-spin' : ''} />
                    {isScanning ? 'Synchronizing...' : 'Run Neural Scan (6M)'}
                </button>
            </div>

            {/* Owned Cards & Applications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <CreditCard className="text-clay" size={20} />
                        <h3 className="text-lg italic text-white">Your Card Ecosystem</h3>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {results.ownedCards.length > 0 ? results.ownedCards.map((c, i) => (
                            <div key={i} className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{c.bank_name}</span>
                                <span className="text-sm font-bold text-white">{c.card_name}</span>
                                <span className="text-[9px] font-mono text-clay mt-1">**** {c.last_four}</span>
                            </div>
                        )) : (
                            <p className="text-xs text-white/20 uppercase tracking-widest py-8">No owned cards detected</p>
                        )}
                    </div>
                </div>

                <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <ArrowRight className="text-clay" size={20} />
                        <h3 className="text-lg italic text-white">Application Tracker</h3>
                    </div>
                    <div className="space-y-3">
                        {results.applications.length > 0 ? results.applications.map((a, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                                <div>
                                    <div className="text-sm font-bold text-white">{a.bank_name} {a.card_name}</div>
                                    <div className="text-[9px] text-white/40 uppercase tracking-widest">{a.application_date} • {a.application_id}</div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter ${
                                    a.status === 'successful' ? 'bg-clay/20 text-clay' : 
                                    a.status === 'rejected' ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white/40'
                                }`}>
                                    {a.status}
                                </div>
                            </div>
                        )) : (
                            <p className="text-xs text-white/20 uppercase tracking-widest py-8">No application history</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Recent Transactions */}
                <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <Receipt className="text-clay" size={20} />
                            <h3 className="text-lg italic text-white">Transactions</h3>
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/20">{results.transactions.length}</span>
                    </div>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto no-scrollbar">
                        {results.transactions.map((t, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                                <div>
                                    <div className="text-sm font-bold text-white truncate max-w-[120px]">{t.merchant}</div>
                                    <div className="text-[9px] text-white/40 uppercase tracking-widest">{t.date}</div>
                                </div>
                                <div className="text-sm font-bold text-white">₹{t.amount}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bills */}
                <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <CreditCard className="text-clay" size={20} />
                            <h3 className="text-lg italic text-white">Card Bills</h3>
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/20">{results.bills.length}</span>
                    </div>
                    <div className="space-y-4">
                        {results.bills.map((b, i) => (
                            <div key={i} className="p-4 bg-white/5 rounded-2xl border-l-4 border-clay">
                                <div className="flex justify-between mb-2">
                                    <div className="text-sm font-bold text-white">{b.bank_name}</div>
                                    <div className="text-sm font-bold text-clay">₹{b.amount_due}</div>
                                </div>
                                <div className="text-[9px] text-white/40 uppercase tracking-widest">Due {b.due_date}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Orders */}
                <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <ShoppingBag className="text-clay" size={20} />
                            <h3 className="text-lg italic text-white">Shopping</h3>
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/20">{results.orders.length}</span>
                    </div>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto no-scrollbar">
                        {results.orders.map((o, i) => (
                            <div key={i} className="p-4 bg-white/5 rounded-2xl">
                                <div className="text-sm font-bold text-white truncate mb-1">{o.item_name}</div>
                                <div className="flex justify-between items-center">
                                    <div className="text-[9px] text-white/40 uppercase tracking-widest">{o.merchant} • {o.order_date}</div>
                                    <div className="text-xs font-bold text-white">₹{o.price}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Scanning Overlay */}
            <AnimatePresence>
                {isScanning && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-cream/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6"
                    >
                        <div className="max-w-md w-full text-center space-y-8">
                            <div className="relative w-32 h-32 mx-auto">
                                <motion.div 
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 border-2 border-clay/20 rounded-full border-t-clay"
                                />
                                <div className="absolute inset-4 bg-clay/10 rounded-full flex items-center justify-center">
                                    <RefreshCw size={40} className="text-clay animate-spin" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-2xl italic text-white">{scanStatus}</h3>
                                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${scanProgress}%` }}
                                        className="h-full bg-clay shadow-[0_0_15px_rgba(52,211,153,0.5)]"
                                    />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">{scanProgress}% Calibrated</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MailSync;
