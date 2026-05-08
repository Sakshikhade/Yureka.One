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
    const [error, setError] = useState<string | null>(null);
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

        if (user) {
            fetchInitialData();
            // Silent background scan on mount
            const triggerSync = async () => {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.provider_token) {
                    startScan(true); // Silent mode
                }
            };
            triggerSync();
        }
    }, [user, supabase]);

    const handleLinkGmail = async () => {
        setIsLinking(true);
        setError(null);
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
            setError('Authorization Failed');
        } finally {
            setIsLinking(false);
        }
    };

    const startScan = async (isSilent = false) => {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.provider_token;

        if (!token) {
            if (!isSilent) setError('GMAIL_NOT_LINKED');
            return;
        }

        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const dateStr = `${sixMonthsAgo.getFullYear()}/${(sixMonthsAgo.getMonth() + 1).toString().padStart(2, '0')}/${sixMonthsAgo.getDate().toString().padStart(2, '0')}`;

        gmailService.setToken(token);
        setIsScanning(true);
        setError(null);
        setScanProgress(5);
        setScanStatus('Initializing Neural Link...');

        try {
            setScanStatus('Analyzing 6M Financial Traffic...');
            const messages = await gmailService.fetchMessages(`subject:(receipt OR order OR payment OR "paid to" OR invoice OR shipping OR tracking) after:${dateStr}`, 50);
            const fetchedTransactions: any[] = [];
            for (let i = 0; i < messages.length; i++) {
                const details = await gmailService.getMessageDetails(messages[i].id);
                const parsed = gmailService.parseTransaction(details);
                if (parsed) fetchedTransactions.push(parsed);
                setScanProgress(5 + Math.floor((i / messages.length) * 20));
            }

            setScanStatus('Detecting Card Ecosystem...');
            const billMessages = await gmailService.fetchMessages(`subject:(statement OR bill OR due OR welcome OR card OR outstanding OR "minimum due") after:${dateStr}`, 40);
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

            setScanStatus('Scanning Applications...');
            const appMessages = await gmailService.fetchMessages(`subject:(application OR status OR reference OR rejection OR accepted OR rejected) after:${dateStr}`, 20);
            const fetchedApps: any[] = [];
            for (let i = 0; i < appMessages.length; i++) {
                const details = await gmailService.getMessageDetails(appMessages[i].id);
                const app = gmailService.parseCardApplication(details);
                if (app) fetchedApps.push(app);
                setScanProgress(50 + Math.floor((i / appMessages.length) * 20));
            }

            setScanStatus('Harvesting Shopping Data...');
            const shopMessages = await gmailService.fetchMessages(`subject:(order OR "delivery of" OR shipment OR tracking OR invoice) after:${dateStr}`, 40);
            const fetchedOrders: any[] = [];
            for (let i = 0; i < shopMessages.length; i++) {
                const details = await gmailService.getMessageDetails(shopMessages[i].id);
                const order = gmailService.parseShoppingOrder(details);
                if (order) fetchedOrders.push(order);
                setScanProgress(70 + Math.floor((i / shopMessages.length) * 20));
            }

            setScanStatus('Encrypting Insights...');
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
            setScanStatus('Neural Sync Complete');
        } catch (err: any) {
            console.error('Scan failed:', err);
            if (err.message === 'OAUTH_EXPIRED') {
                setError('LINK_EXPIRED');
            } else {
                setError('SCAN_ERROR');
            }
        } finally {
            setTimeout(() => {
                setIsScanning(false);
                setScanStatus('');
            }, 3000);
        }
    };

    return (
        <div className="space-y-16">
            {/* Action Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 glass-card p-10 rounded-[2.5rem] relative overflow-hidden">
                {isScanning && (
                    <motion.div 
                        initial={{ width: 0 }} animate={{ width: `${scanProgress}%` }}
                        className="absolute bottom-0 left-0 h-1 bg-clay shadow-[0_0_15px_rgba(52,211,153,0.8)] transition-all duration-500"
                    />
                )}
                
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`w-1.5 h-1.5 bg-clay rounded-full ${isScanning ? 'animate-ping' : 'animate-pulse'} shadow-[0_0_10px_rgba(52,211,153,0.8)]`} />
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-clay">
                            {isScanning ? `System Sync: ${scanStatus}` : error ? 'System Alert' : 'Intelligence Hub'}
                        </p>
                    </div>
                    <h2 className="text-4xl italic tracking-tighter text-white font-black leading-none mb-3">Neural Synchronization</h2>
                    <p className="text-white/30 text-sm font-serif italic">
                        {error === 'GMAIL_NOT_LINKED' ? 'Authorize your financial node to begin deep-scanning.' : 
                         error === 'LINK_EXPIRED' ? 'Your neural link has expired. Re-authorization required.' :
                         'Deep-scanning 6 months of financial footprints across your ecosystem.'}
                    </p>
                </div>

                <div className="relative z-10 flex gap-4">
                    {error === 'GMAIL_NOT_LINKED' || error === 'LINK_EXPIRED' ? (
                        <button 
                            onClick={handleLinkGmail}
                            disabled={isLinking}
                            className="flex items-center gap-4 px-8 py-5 bg-clay text-black rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl group"
                        >
                            <LinkIcon size={18} className={isLinking ? 'animate-spin' : ''} />
                            {isLinking ? 'Linking...' : 'Authorize Link'}
                        </button>
                    ) : (
                        <button 
                            onClick={() => startScan(false)}
                            disabled={isScanning}
                            className="flex items-center gap-4 px-8 py-5 bg-white text-black rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl disabled:opacity-30 group"
                        >
                            <RefreshCw size={18} className={`${isScanning ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'}`} />
                            {isScanning ? `${scanProgress}%` : 'Initiate Deep Scan'}
                        </button>
                    )}
                </div>
            </div>

            {/* Intelligence Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    className="glass-card rounded-[2.5rem] p-10"
                >
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-clay/10 rounded-xl flex items-center justify-center border border-clay/20">
                                <CreditCard className="text-clay" size={24} />
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Financial Layout</p>
                                <h3 className="text-xl italic text-white font-black">Owned Ecosystem</h3>
                            </div>
                        </div>
                        <span className="glass-card px-4 py-1.5 rounded-full text-[10px] font-black text-clay">{results.ownedCards.length} Assets</span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {results.ownedCards.length > 0 ? results.ownedCards.map((c, i) => (
                            <motion.div 
                                key={i} whileHover={{ y: -5 }}
                                className="p-6 bg-white/5 border border-white/5 rounded-2xl flex flex-col relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 w-16 h-16 bg-clay/5 blur-2xl rounded-full" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-clay mb-2">{c.bank_name}</span>
                                <span className="text-sm font-bold text-white tracking-tight">{c.card_name}</span>
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-[10px] font-mono text-white/20 tracking-tighter">**** {c.last_four}</span>
                                    <div className="w-6 h-6 bg-white rounded-md p-1 group-hover:scale-110 transition-transform">
                                        <img src={`/assets/banks/${c.bank_name?.toLowerCase().split(' ')[0]}.png`} className="w-full h-full object-contain" alt="" />
                                    </div>
                                </div>
                            </motion.div>
                        )) : (
                            <div className="col-span-2 py-10 flex flex-col items-center justify-center text-center">
                                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                    <AlertCircle className="text-white/10" size={24} />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Zero Assets Detected</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    className="glass-card rounded-[2.5rem] p-10"
                >
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-clay/10 rounded-xl flex items-center justify-center border border-clay/20">
                                <RefreshCw className="text-clay" size={24} />
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Acquisition Log</p>
                                <h3 className="text-xl italic text-white font-black">Application Tracker</h3>
                            </div>
                        </div>
                        <span className="glass-card px-4 py-1.5 rounded-full text-[10px] font-black text-white/40">{results.applications.length} History</span>
                    </div>

                    <div className="space-y-3 max-h-[340px] overflow-y-auto dashboard-scroll pr-2">
                        {results.applications.length > 0 ? results.applications.map((a, i) => (
                            <div key={i} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 group hover:border-white/10 transition-all">
                                <div className="flex gap-4 items-center">
                                    <div className={`w-2 h-2 rounded-full ${
                                        a.status === 'successful' ? 'bg-clay shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 
                                        a.status === 'rejected' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-white/20'
                                    }`} />
                                    <div>
                                        <div className="text-sm font-bold text-white tracking-tight uppercase">{a.bank_name} {a.card_name}</div>
                                        <div className="text-[9px] text-white/30 uppercase tracking-[0.2em] mt-1">{a.application_date} • ID: {a.application_id}</div>
                                    </div>
                                </div>
                                <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                                    a.status === 'successful' ? 'bg-clay/10 text-clay' : 
                                    a.status === 'rejected' ? 'bg-red-500/10 text-red-400' : 'bg-white/5 text-white/30'
                                }`}>
                                    {a.status}
                                </div>
                            </div>
                        )) : (
                            <div className="py-20 flex flex-col items-center justify-center text-center">
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Empty Acquisition History</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Neural Data Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                <div className="glass-card rounded-[2.5rem] p-10">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                            <Receipt className="text-clay" size={24} />
                            <h3 className="text-xl italic text-white font-black">Financial Flow</h3>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-black text-white/20">{results.transactions.length}</div>
                    </div>
                    <div className="space-y-4">
                        {results.transactions.map((t, i) => (
                            <div key={i} className="flex items-center justify-between p-5 glass-card rounded-2xl hover:scale-[1.02]">
                                <div>
                                    <div className="text-sm font-black text-white truncate max-w-[120px] tracking-tight">{t.merchant}</div>
                                    <div className="text-[9px] text-white/30 uppercase tracking-widest mt-1">{t.date}</div>
                                </div>
                                <div className="text-sm font-black text-white italic">₹{t.amount}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-card rounded-[2.5rem] p-10 border-clay/10">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                            <Shield className="text-clay" size={24} />
                            <h3 className="text-xl italic text-white font-black">Card Liability</h3>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-clay/10 flex items-center justify-center text-[10px] font-black text-clay">{results.bills.length}</div>
                    </div>
                    <div className="space-y-4">
                        {results.bills.map((b, i) => (
                            <div key={i} className="p-6 glass-dark rounded-2xl border-l-4 border-clay hover:translate-x-2 transition-transform">
                                <div className="flex justify-between mb-3">
                                    <div className="text-sm font-black text-white uppercase tracking-tight">{b.bank_name}</div>
                                    <div className="text-lg font-black text-clay italic">₹{b.amount_due}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-red-500 rounded-full animate-ping" />
                                    <div className="text-[9px] text-white/40 uppercase tracking-[0.3em]">Maturity: {b.due_date}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-card rounded-[2.5rem] p-10">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                            <ShoppingBag className="text-clay" size={24} />
                            <h3 className="text-xl italic text-white font-black">Shopping Insights</h3>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-black text-white/20">{results.orders.length}</div>
                    </div>
                    <div className="space-y-4">
                        {results.orders.map((o, i) => (
                            <div key={i} className="p-5 glass-card rounded-2xl hover:bg-white/[0.05]">
                                <div className="text-sm font-black text-white truncate mb-2 tracking-tight">{o.item_name}</div>
                                <div className="flex justify-between items-center border-t border-white/5 pt-3">
                                    <div className="text-[9px] text-white/30 uppercase tracking-[0.2em]">{o.merchant} • {o.order_date}</div>
                                    <div className="text-xs font-black text-white italic">₹{o.price}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default MailSync;
