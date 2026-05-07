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
    }>({ transactions: [], bills: [], orders: [] });

    const handleLinkGmail = async () => {
        setIsLinking(true);
        try {
            // In a real production app, we'd use Supabase's linkIdentity or a dedicated OAuth flow.
            // For this implementation, we use the Supabase Google Auth session if available, 
            // or trigger a fresh OAuth flow to get the access token with the required scopes.
            
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
        // Assume token is available in session for this demo
        // In reality, we'd fetch the fresh token from Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.provider_token;

        if (!token) {
            alert("Please link your Gmail account with the required permissions first.");
            return;
        }

        gmailService.setToken(token);
        setIsScanning(true);
        setScanProgress(5);
        setScanStatus('Initializing Neural Scan...');

        try {
            // 1. Fetch Transactions (last 90 days)
            setScanStatus('Scanning Primary Inbox for Receipts...');
            const messages = await gmailService.fetchMessages('subject:(receipt OR order OR payment OR "paid to") after:2024/02/01', 20);
            setScanProgress(30);

            const fetchedTransactions: any[] = [];
            for (let i = 0; i < messages.length; i++) {
                const details = await gmailService.getMessageDetails(messages[i].id);
                const parsed = gmailService.parseTransaction(details);
                if (parsed) fetchedTransactions.push(parsed);
                setScanProgress(30 + Math.floor((i / messages.length) * 30));
            }

            // 2. Fetch Bills
            setScanStatus('Extracting Credit Card Statements...');
            const billMessages = await gmailService.fetchMessages('subject:(statement OR bill OR due) after:2024/02/01', 10);
            const fetchedBills: any[] = [];
            for (const m of billMessages) {
                const details = await gmailService.getMessageDetails(m.id);
                const parsed = gmailService.parseBill(details);
                if (parsed) fetchedBills.push(parsed);
            }
            setScanProgress(90);

            // 3. Fetch Shopping Orders
            setScanStatus('Aggregating Shopping Portfolio...');
            const shopMessages = await gmailService.fetchMessages('subject:(order OR "delivery of") after:2024/02/01', 10);
            const fetchedOrders: any[] = [];
            for (const m of shopMessages) {
                const details = await gmailService.getMessageDetails(m.id);
                const parsed = gmailService.parseShoppingOrder(details);
                if (parsed) fetchedOrders.push(parsed);
            }
            setScanProgress(95);

            // 4. Save to Supabase (Batch)
            setScanStatus('Syncing with Yureka Intelligence...');
            if (fetchedTransactions.length > 0) {
                await supabase.from('user_transactions').upsert(
                    fetchedTransactions.map(t => ({ ...t, user_id: user?.id }))
                );
            }
            if (fetchedBills.length > 0) {
                await supabase.from('user_bills').upsert(
                    fetchedBills.map(b => ({ ...b, user_id: user?.id }))
                );
            }
            if (fetchedOrders.length > 0) {
                await supabase.from('user_shopping_orders').upsert(
                    fetchedOrders.map(o => ({ ...o, user_id: user?.id }))
                );
            }

            setResults({
                transactions: fetchedTransactions,
                bills: fetchedBills,
                orders: fetchedOrders
            });
            setScanProgress(100);
            setScanStatus('Sync Complete');
        } catch (err) {
            console.error('Scan failed:', err);
            setScanStatus('Neural Link Interrupted');
        } finally {
            setTimeout(() => setIsScanning(false), 2000);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header Card */}
            <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Mail size={120} className="text-clay" />
                </div>

                <div className="relative z-10 max-w-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-clay/10 rounded-xl flex items-center justify-center text-clay">
                            <Shield size={20} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Secure Mail Sync</span>
                    </div>

                    <h2 className="text-4xl italic tracking-tighter text-white mb-6">Automate your financial intelligence.</h2>
                    <p className="text-white/40 text-lg mb-10 leading-relaxed font-serif italic">
                        Link your Gmail to allow Yureka to scan for statements, receipts, and order history. 
                        We only access financial keywords and keep your data encrypted at the neural level.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <button 
                            onClick={handleLinkGmail}
                            disabled={isLinking}
                            className="bg-white text-cream px-8 py-5 rounded-2xl flex items-center gap-4 hover:bg-clay transition-all group active:scale-95 disabled:opacity-50"
                        >
                            {isLinking ? <Loader2 className="animate-spin" size={18} /> : <LinkIcon size={18} className="text-black" />}
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black">Link Primary Gmail</span>
                        </button>

                        <button 
                            onClick={startScan}
                            disabled={isScanning}
                            className="bg-white/5 border border-white/10 text-white px-8 py-5 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {isScanning ? <RefreshCw className="animate-spin" size={18} /> : <RefreshCw size={18} />}
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Start Neural Scan</span>
                        </button>
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
        </div>
    );
};

export default MailSync;
