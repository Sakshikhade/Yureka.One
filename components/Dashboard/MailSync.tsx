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

        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const dateStr = `${sixMonthsAgo.getFullYear()}/${(sixMonthsAgo.getMonth() + 1).toString().padStart(2, '0')}/${sixMonthsAgo.getDate().toString().padStart(2, '0')}`;

        gmailService.setToken(token);
        setIsScanning(true);
        setScanProgress(5);
        setScanStatus('Initializing Neural Link...');

        try {
            setScanStatus('Analyzing 6M Financial Traffic...');
            const messages = await gmailService.fetchMessages(`subject:(receipt OR order OR payment OR "paid to") after:${dateStr}`, 40);
            const fetchedTransactions: any[] = [];
            for (let i = 0; i < messages.length; i++) {
                const details = await gmailService.getMessageDetails(messages[i].id);
                const parsed = gmailService.parseTransaction(details);
                if (parsed) fetchedTransactions.push(parsed);
                setScanProgress(5 + Math.floor((i / messages.length) * 20));
            }

            setScanStatus('Detecting Card Ecosystem...');
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

            setScanStatus('Scanning Applications...');
            const appMessages = await gmailService.fetchMessages(`subject:(application OR status OR reference) after:${dateStr}`, 20);
            const fetchedApps: any[] = [];
            for (let i = 0; i < appMessages.length; i++) {
                const details = await gmailService.getMessageDetails(appMessages[i].id);
                const app = gmailService.parseCardApplication(details);
                if (app) fetchedApps.push(app);
                setScanProgress(50 + Math.floor((i / appMessages.length) * 20));
            }

            setScanStatus('Harvesting Shopping Data...');
            const shopMessages = await gmailService.fetchMessages(`subject:(order OR "delivery of") after:${dateStr}`, 30);
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
        } catch (err) {
            console.error('Scan failed:', err);
            setScanStatus('Link Error Occurred');
        } finally {
            setTimeout(() => setIsScanning(false), 2000);
        }
    };

    return (
        <div className="space-y-16">
            {/* Action Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 glass-card p-10 rounded-[2.5rem]">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-1.5 h-1.5 bg-clay rounded-full animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-clay">Intelligence Hub</p>
                    </div>
                    <h2 className="text-4xl italic tracking-tighter text-white font-black leading-none mb-3">Neural Synchronization</h2>
                    <p className="text-white/30 text-sm font-serif italic">Deep-scanning 6 months of financial footprints across your ecosystem.</p>
                </div>
                <button 
                    onClick={startScan}
                    disabled={isScanning}
                    className="flex items-center gap-4 px-8 py-5 bg-white text-black rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl disabled:opacity-30 group"
                >
                    <RefreshCw size={18} className={`${isScanning ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'}`} />
                    {isScanning ? 'Processing...' : 'Initiate Deep Scan'}
                </button>
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

            {/* Neural Scanning Holograph */}
            <AnimatePresence>
                {isScanning && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 backdrop-blur-3xl z-[100] flex items-center justify-center p-10"
                    >
                        <div className="max-w-xl w-full text-center space-y-12">
                            <div className="relative w-48 h-48 mx-auto">
                                <motion.div 
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 border-t-2 border-clay rounded-full shadow-[0_0_30px_rgba(52,211,153,0.3)]"
                                />
                                <motion.div 
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-4 border-b-2 border-white/20 rounded-full"
                                />
                                <div className="absolute inset-8 bg-clay/10 rounded-full flex items-center justify-center border border-clay/20 shadow-inner">
                                    <RefreshCw size={56} className="text-clay animate-spin" />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex flex-col items-center">
                                    <span className="text-[10px] font-black uppercase tracking-[0.8em] text-clay mb-2">Neural Synchronization</span>
                                    <h3 className="text-4xl italic text-white font-black tracking-tighter">{scanStatus}</h3>
                                </div>
                                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5 shadow-inner">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${scanProgress}%` }}
                                        className="h-full bg-gradient-to-r from-clay/40 via-clay to-clay/40 shadow-[0_0_30px_rgba(52,211,153,0.8)]"
                                    />
                                </div>
                                <div className="flex justify-between items-center px-2">
                                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">{scanProgress}% Calibrated</p>
                                    <div className="flex gap-1">
                                        {[1,2,3].map(i => (
                                            <motion.div key={i} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ delay: i * 0.2, repeat: Infinity }} className="w-1 h-1 bg-clay rounded-full" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MailSync;
