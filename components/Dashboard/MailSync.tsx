import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
    Mail, ShieldCheck, RefreshCw, CheckCircle, 
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

    // Watchdog to prevent permanent hang
    useEffect(() => {
        let timeout: any;
        if (isScanning) {
            timeout = setTimeout(() => {
                if (isScanning) {
                    setIsScanning(false);
                    setScanStatus('Sync Timeout');
                    setError('SCAN_TIMEOUT');
                }
            }, 90000); // 90s total watchdog for broad scan
        }
        return () => clearTimeout(timeout);
    }, [isScanning]);

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
            const triggerSync = async () => {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.provider_token) {
                    startScan(true); 
                } else {
                    setError('GMAIL_NOT_LINKED');
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
            setError('GMAIL_NOT_LINKED');
            return;
        }

        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const startScan = async (isSilent = false) => {
        if (!isSilent) setIsScanning(true);
        setError(null);
        setScanProgress(5);
        setScanStatus('Initializing Neural Uplink...');

        try {
            const dateStr = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0].replace(/-/g, '/');
            let totalItemsFound = 0;

            // Phase 1: Transactions & Shopping (Deep Scan across categories)
            setScanStatus('Scanning Financial Core...');
            const coreQueries = [
                `(₹ OR INR OR Rs OR "debited" OR "spent") after:${dateStr} category:primary`,
                `category:purchases after:${dateStr}`,
                `"order confirmation" OR "shipped" OR "invoice" after:${dateStr} category:promotions`,
                `"payment" OR "transaction" after:${dateStr} category:social`
            ];
            
            let allMessages: any[] = [];
            for (const q of coreQueries) {
                const msgs = await gmailService.fetchMessages(q, 40);
                allMessages = [...allMessages, ...msgs];
            }
            
            const uniqueMessageIds = Array.from(new Set(allMessages.map(m => m.id)));
            const messageDetails = await Promise.all(
                uniqueMessageIds.slice(0, 100).map(id => gmailService.getMessageDetails(id).catch(() => null))
            );

            const fetchedTransactions: MailTransaction[] = [];
            const fetchedOrders: MailShoppingOrder[] = [];

            messageDetails.forEach(msg => {
                if (!msg) return;
                const tx = gmailService.parseTransaction(msg);
                if (tx) { fetchedTransactions.push(tx); totalItemsFound++; }
                
                const order = gmailService.parseShoppingOrder(msg);
                if (order) { fetchedOrders.push(order); totalItemsFound++; }
            });
            setScanProgress(40);

            // Phase 2: Ecosystem (Cards & Applications)
            setScanStatus('Analyzing Credit Ecosystem...');
            const ecoQueries = [
                `"welcome to" OR "your card" OR "statement" after:${dateStr}`,
                `"application" OR "rejection" OR "approved" after:${dateStr}`
            ];
            
            let ecoMessages: any[] = [];
            for (const q of ecoQueries) {
                const msgs = await gmailService.fetchMessages(q, 30);
                ecoMessages = [...ecoMessages, ...msgs];
            }

            const uniqueEcoIds = Array.from(new Set(ecoMessages.map(m => m.id)));
            const ecoDetails = await Promise.all(
                uniqueEcoIds.slice(0, 50).map(id => gmailService.getMessageDetails(id).catch(() => null))
            );

            const rawCards: MailOwnedCard[] = [];
            const rawApps: MailCardApplication[] = [];

            ecoDetails.forEach(msg => {
                if (!msg) return;
                const card = gmailService.parseOwnedCard(msg);
                if (card) rawCards.push(card);
                
                const app = gmailService.parseCardApplication(msg);
                if (app) rawApps.push(app);
            });

            // Deduplicate Cards by Bank + Last Four
            const fetchedCards = rawCards.filter((card, index, self) =>
                index === self.findIndex((c) => (
                    c.bank_name === card.bank_name && c.last_four === card.last_four
                ))
            );
            totalItemsFound += fetchedCards.length;

            // Deduplicate Applications by Bank + ID
            const fetchedApps = rawApps.filter((app, index, self) =>
                index === self.findIndex((a) => (
                    a.bank_name === app.bank_name && a.application_id === app.application_id
                ))
            );
            totalItemsFound += fetchedApps.length;
            setScanProgress(70);

            // Phase 3: Bills & Statements
            setScanStatus('Scanning Statements...');
            const billMsgs = await gmailService.fetchMessages(`"statement" OR "amount due" OR "due date" after:${dateStr}`, 30);
            const billDetails = await Promise.all(
                billMsgs.slice(0, 30).map((m: any) => gmailService.getMessageDetails(m.id).catch(() => null))
            );
            
            const fetchedBills: MailBill[] = [];
            billDetails.forEach(msg => {
                if (!msg) return;
                const bill = gmailService.parseBill(msg);
                if (bill) { fetchedBills.push(bill); totalItemsFound++; }
            });
            setScanProgress(90);

            setScanStatus('Syncing Neural Data...');
            const savePromises = [];
            if (fetchedTransactions.length > 0) savePromises.push(supabase.from('user_transactions').upsert(fetchedTransactions.map(t => ({ ...t, user_id: user?.id })), { onConflict: 'source_mail_id' }));
            if (fetchedBills.length > 0) savePromises.push(supabase.from('user_bills').upsert(fetchedBills.map(b => ({ ...b, user_id: user?.id })), { onConflict: 'source_mail_id' }));
            if (fetchedOrders.length > 0) savePromises.push(supabase.from('user_orders').upsert(fetchedOrders.map(o => ({ ...o, user_id: user?.id })), { onConflict: 'source_mail_id' }));
            if (fetchedCards.length > 0) savePromises.push(supabase.from('user_owned_cards').upsert(fetchedCards.map(c => ({ ...c, user_id: user?.id })), { onConflict: 'source_mail_id' }));
            if (fetchedApps.length > 0) savePromises.push(supabase.from('user_applications').upsert(fetchedApps.map(a => ({ ...a, user_id: user?.id })), { onConflict: 'source_mail_id' }));
            
            await Promise.all(savePromises);

            setResults(prev => ({
                transactions: [...fetchedTransactions.slice(0, 10), ...prev.transactions.filter(t => !fetchedTransactions.find(ft => ft.source_mail_id === t.source_mail_id))].slice(0, 10),
                bills: [...fetchedBills, ...prev.bills.filter(b => !fetchedBills.find(fb => fb.source_mail_id === b.source_mail_id))],
                orders: [...fetchedOrders.slice(0, 10), ...prev.orders.filter(o => !fetchedOrders.find(fo => fo.source_mail_id === o.source_mail_id))].slice(0, 10),
                ownedCards: [...fetchedCards, ...prev.ownedCards.filter(c => !fetchedCards.find(fc => fc.source_mail_id === c.source_mail_id))],
                applications: [...fetchedApps, ...prev.applications.filter(a => !fetchedApps.find(fa => fa.source_mail_id === a.source_mail_id))]
            }));
            setScanProgress(100);
            setScanStatus(`Sync Complete: ${totalItemsFound} items found`);
            if (totalItemsFound === 0 && !isSilent) {
                setError('NO_DATA_FOUND');
            }
        } catch (err: any) {
            console.error('Scan failed:', err);
            if (err.name === 'AbortError') {
                setScanStatus('Connection Timeout');
                setError('SCAN_TIMEOUT');
            } else if (err.message === 'OAUTH_EXPIRED') {
                setError('LINK_EXPIRED');
            } else {
                setError('SCAN_ERROR');
            }
        } finally {
            setTimeout(() => {
                setIsScanning(false);
                setScanStatus('');
            }, 4000);
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
                    <div className="mb-8 p-6 glass-dark rounded-2xl border border-white/5">
                        <div className="flex items-end gap-2 mb-4">
                            <div className="flex-1 h-20 bg-white/5 rounded-lg relative overflow-hidden">
                                <motion.div initial={{ height: 0 }} animate={{ height: '60%' }} className="absolute bottom-0 left-0 right-0 bg-clay/20" />
                            </div>
                            <div className="flex-1 h-32 bg-white/5 rounded-lg relative overflow-hidden">
                                <motion.div initial={{ height: 0 }} animate={{ height: '85%' }} className="absolute bottom-0 left-0 right-0 bg-clay/40" />
                            </div>
                            <div className="flex-1 h-24 bg-white/5 rounded-lg relative overflow-hidden">
                                <motion.div initial={{ height: 0 }} animate={{ height: '40%' }} className="absolute bottom-0 left-0 right-0 bg-clay/10" />
                            </div>
                            <div className="flex-1 h-40 bg-white/5 rounded-lg relative overflow-hidden">
                                <motion.div initial={{ height: 0 }} animate={{ height: '100%' }} className="absolute bottom-0 left-0 right-0 bg-clay" />
                            </div>
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 text-center">Neural Distribution Analysis</p>
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
                            <ShieldCheck className="text-clay" size={24} />
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
