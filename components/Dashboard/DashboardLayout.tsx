import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
    CreditCard, Mail, Receipt, Wallet, Store, 
    Gift, Zap, Sparkles, Users, User, 
    LogOut, ChevronLeft, Menu, Bell, ChevronDown,
    LayoutGrid, Calculator, ArrowRightLeft, Compass
} from 'lucide-react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useSupabase } from '../SupabaseProvider';

// Sub-components (to be built)
import MyCards from './MyCards';
import ReferralDashboard from './ReferralDashboard';
import AccountSettings from './AccountSettings';
import Expenses from './Expenses';
import Bills from './Bills';
import CategoriesPage from '../CategoriesPage';
import CategoryDetailPage from '../CategoryDetailPage';
import YurekaOsPage from '../YurekaOsPage';
import ComparePage from '../ComparePage';
import ComparisonDetail from '../ComparisonDetail';
import RewardsTransferCalculator from '../RewardsTransferCalculator';
import CardDetail from '../CardDetail';
import CardExplorer from '../CardExplorer';
import YurekaAIPage from '../YurekaAIPage';
import WaitlistPage from '../WaitlistPage';

import { fetchPlatformNotifications, fetchUserInteractions, logNotificationInteraction } from '../../services/supabaseService';

const EXPLORE_ITEMS = [
    { id: 'categories', label: 'Categories', icon: LayoutGrid, path: '/dashboard/categories' },
    { id: 'tools', label: 'Free Tools', icon: Calculator, path: '/dashboard/rewards-calculator' },
    { id: 'compare', label: 'Compare', icon: ArrowRightLeft, path: '/dashboard/compare' },
    { id: 'card-explorer', label: 'Card Explorer', icon: Compass, path: '/dashboard/card-explorer' },
];

const NAV_ITEMS = [
    { id: 'cards', label: 'Saved Cards', icon: CreditCard, path: '/dashboard/cards' },
    { id: 'explore', label: 'Explore', icon: Sparkles, subItems: EXPLORE_ITEMS },
    { id: 'expenses', label: 'Expenses', icon: Receipt, path: '/dashboard/expenses' },
    { id: 'bills', label: 'Bills', icon: Wallet, path: '/dashboard/bills' },
    { id: 'extension', label: 'Extension', icon: Zap, comingSoon: true, path: '/dashboard/extension' },
    { id: 'store', label: 'Store', icon: Store, comingSoon: true, path: '/dashboard/store' },
    { id: 'giftcards', label: 'GiftCards', icon: Gift, comingSoon: true, path: '/dashboard/giftcards' },
    { id: 'redemption', label: 'Redemption', icon: Sparkles, comingSoon: true, path: '/dashboard/redemption' },
    { id: 'referrals', label: 'Referral Dashboard', icon: Users, path: '/dashboard/referrals' },
    { id: 'profile', label: 'Profile', icon: User, path: '/dashboard/profile' },
];

const NotificationBell = () => {
    const { user, ledgerTransactions, myCards, supabase } = useSupabase();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user?.email) return;
        const load = async () => {
            const [notifs, inters] = await Promise.all([
                fetchPlatformNotifications(),
                fetchUserInteractions(user.email!)
            ]);
            
            // Filter out clicked (cleared) notifications
            const clickedIds = new Set(inters?.filter(i => i.action === 'clicked').map(i => i.notification_id) || []);
            const readIds = new Set(inters?.filter(i => i.action === 'read').map(i => i.notification_id) || []);
            
            const activeNotifs = (notifs || []).filter(n => !clickedIds.has(n.id));
            setNotifications(activeNotifs);
            
            // Unread are active ones that haven't been 'read'
            const unread = activeNotifs.filter(n => !readIds.has(n.id)).length;
            setUnreadCount(unread);
        };
        load();
        
        // Setup real-time listener for new notifications
        const sub = supabase
            .channel('public:platform_notifications')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'platform_notifications' }, () => {
                load();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(sub);
        };
    }, [user?.email]);

    const handleOpen = async () => {
        setIsOpen(!isOpen);
        if (!isOpen && unreadCount > 0) {
            // Mark all as read when opening
            setUnreadCount(0);
            for (const n of notifications) {
                await logNotificationInteraction(n.id, user.email!, user.user_metadata?.full_name || '', 'read');
            }
        }
    };

    const handleDismiss = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setNotifications(prev => prev.filter(n => n.id !== id));
        await logNotificationInteraction(id, user.email!, user.user_metadata?.full_name || '', 'clicked');
    };

    const resolveVariables = (msg: string) => {
        if (!msg) return msg;
        let text = msg;
        const userName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Explorer';
        const cardName = myCards?.[0]?.name || 'your primary card';
        
        let totalExpenses = 0;
        let totalBills = 0;
        (ledgerTransactions || []).forEach(tx => {
            const type = (tx.type || '').toLowerCase();
            const amtStr = (tx.amount || '').replace(/[₹$,\s]/g, '');
            const parsed = parseFloat(amtStr);
            if (!isNaN(parsed)) {
                if (type === 'transaction') totalExpenses += parsed;
                else totalBills += parsed;
            }
        });

        text = text.replace(/\{\{user_name\}\}/g, userName);
        text = text.replace(/\{\{card_name\}\}/g, cardName);
        text = text.replace(/\{\{total_expenses\}\}/g, `₹ ${totalExpenses.toLocaleString('en-IN')}`);
        text = text.replace(/\{\{total_bills\}\}/g, `₹ ${totalBills.toLocaleString('en-IN')}`);
        return text;
    };

    return (
        <div className="relative z-[100]">
            <button 
                onClick={handleOpen}
                className="w-14 h-14 glass-dark rounded-2xl flex items-center justify-center text-white/30 hover:text-white hover:border-white/20 transition-all relative group"
            >
                <Bell size={24} className={`transition-transform ${isOpen ? 'text-clay' : 'group-hover:rotate-12'}`} />
                {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-clay rounded-full shadow-[0_0_15px_rgba(52,211,153,1)] flex items-center justify-center text-[9px] text-black font-black">
                        {unreadCount}
                    </div>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-40"
                        />
                        <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                            animate={{ opacity: 1, y: 0, scale: 1 }} 
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute top-[120%] right-0 w-80 sm:w-96 bg-black/90 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl z-50 overflow-hidden"
                        >
                            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                <h3 className="font-bold text-white text-sm tracking-widest uppercase">Intel Updates</h3>
                                <span className="text-[10px] text-clay font-mono">{notifications.length} Active</span>
                            </div>
                            
                            <div className="max-h-[60vh] overflow-y-auto dashboard-scroll p-2">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-white/30 text-xs font-bold uppercase tracking-widest">
                                        No new intel available
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        {notifications.map(n => (
                                            <div 
                                                key={n.id} 
                                                onClick={(e) => handleDismiss(e, n.id)}
                                                className="p-4 rounded-2xl hover:bg-white/[0.03] transition-colors cursor-pointer group flex flex-col gap-3"
                                            >
                                                <div className="flex gap-4">
                                                    <div className="w-2 h-2 rounded-full bg-clay mt-2 shrink-0 shadow-[0_0_8px_#21deb3]" />
                                                    <div className="flex-1">
                                                        <h4 className="text-white text-sm font-bold mb-1">{resolveVariables(n.title)}</h4>
                                                        <p className="text-white/60 text-xs leading-relaxed">{resolveVariables(n.message)}</p>
                                                    </div>
                                                </div>
                                                {n.image_url && (
                                                    <div className="w-full h-32 rounded-xl overflow-hidden mt-1 border border-white/5 relative ml-6">
                                                        <img src={n.image_url} alt="Notification visual" className="w-full h-full object-cover" />
                                                    </div>
                                                )}
                                                <div className="pl-6">
                                                    <p className="text-[9px] uppercase tracking-widest text-white/20 font-mono">
                                                        {new Date(n.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

const DashboardLayout: React.FC = () => {
    const { user, supabase } = useSupabase();
    const navigate = useNavigate();
    const location = useLocation();
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isExploreExpanded, setIsExploreExpanded] = useState(false);

    const activeTab = NAV_ITEMS.find(i => i.path && (location.pathname === i.path || location.pathname.startsWith(i.path + '/')))?.id || 
                      EXPLORE_ITEMS.find(i => i.path && (location.pathname === i.path || location.pathname.startsWith(i.path + '/')))?.id || 'cards';

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    const renderEmpty = () => (
        <div className="flex flex-col items-center justify-center h-full text-center py-20">
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-24 h-24 bg-clay/10 rounded-[2rem] flex items-center justify-center border border-clay/20 mb-8"
            >
                <Zap size={40} className="text-clay animate-pulse" />
            </motion.div>
            <h2 className="text-4xl italic tracking-tighter text-white mb-4">Under Construction</h2>
            <p className="text-white/40 max-w-sm mx-auto font-serif italic text-lg">
                Our intelligence engine is currently calibrating this module for elite performance.
            </p>
        </div>
    );

    return (
        <div className="min-h-screen bg-mesh flex overflow-hidden font-sans pt-0 selection:bg-clay selection:text-black">
            {/* Left Side Navigation */}
            <aside className={`glass-dark border-r border-white/5 w-80 fixed md:relative left-0 h-full z-50 transition-all duration-700 ease-[cubic-bezier(0.16, 1, 0.3, 1)] ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-28'}`}>
                <div className="h-full flex flex-col p-8">
                    {/* Brand */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-5 mb-16 px-2"
                    >
                        <div className="w-12 h-12 bg-clay rounded-2xl flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(52,211,153,0.3)]">
                            <Zap size={24} className="text-black" />
                        </div>
                        {isSidebarOpen && (
                            <div className="flex flex-col">
                                <span className="text-lg font-black uppercase tracking-[0.3em] text-white italic leading-none">Yureka</span>
                                <span className="text-[8px] font-black uppercase tracking-[0.5em] text-clay/60 mt-1">Intelligence Lab</span>
                            </div>
                        )}
                    </motion.div>

                    {/* Nav Items */}
                    <nav className="flex-1 space-y-3 dashboard-scroll overflow-y-auto pr-2">
                        {NAV_ITEMS.map((item, idx) => (
                            <div key={item.id}>
                                {item.subItems ? (
                                    <motion.button 
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        onClick={() => setIsExploreExpanded(!isExploreExpanded)}
                                        className={`w-full flex items-center gap-5 px-5 py-5 rounded-[1.5rem] transition-all group relative overflow-hidden ${activeTab === item.id ? 'bg-white text-black shadow-2xl shadow-white/5' : 'text-white/30 hover:bg-white/5 hover:text-white'}`}
                                    >
                                        <item.icon size={22} className={`${activeTab === item.id ? 'text-black' : 'group-hover:scale-110 transition-transform duration-500'}`} />
                                        {isSidebarOpen && (
                                            <div className="flex flex-1 items-center justify-between">
                                                <div className="flex flex-col items-start text-left">
                                                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">{item.label}</span>
                                                    {item.comingSoon && <span className="text-[7px] opacity-40 uppercase tracking-[0.3em] mt-0.5">Development</span>}
                                                </div>
                                                <ChevronDown 
                                                    size={14} 
                                                    className={`transition-transform duration-500 ${isExploreExpanded ? 'rotate-180' : ''}`} 
                                                />
                                            </div>
                                        )}
                                        {activeTab === item.id && (
                                            <motion.div layoutId="nav-glow" className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent animate-glass-shine" />
                                        )}
                                    </motion.button>
                                ) : (
                                    <Link to={item.path!}>
                                        <motion.div 
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className={`w-full flex items-center gap-5 px-5 py-5 rounded-[1.5rem] transition-all group relative overflow-hidden ${activeTab === item.id ? 'bg-white text-black shadow-2xl shadow-white/5' : 'text-white/30 hover:bg-white/5 hover:text-white'}`}
                                        >
                                            <item.icon size={22} className={`${activeTab === item.id ? 'text-black' : 'group-hover:scale-110 transition-transform duration-500'}`} />
                                            {isSidebarOpen && (
                                                <div className="flex flex-col items-start text-left">
                                                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">{item.label}</span>
                                                    {item.comingSoon && <span className="text-[7px] opacity-40 uppercase tracking-[0.3em] mt-0.5">Development</span>}
                                                </div>
                                            )}
                                            {activeTab === item.id && (
                                                <motion.div layoutId="nav-glow" className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent animate-glass-shine" />
                                            )}
                                        </motion.div>
                                    </Link>
                                )}

                                {/* Sub Items */}
                                <AnimatePresence>
                                    {item.subItems && isExploreExpanded && isSidebarOpen && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden mt-2 ml-6 space-y-1"
                                        >
                                            {item.subItems.map((sub) => (
                                                <Link
                                                    key={sub.id}
                                                    to={sub.path}
                                                    className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-white/30 hover:bg-white/5 hover:text-clay transition-all group/sub"
                                                >
                                                    <sub.icon size={16} className="group-hover/sub:scale-110 transition-transform" />
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{sub.label}</span>
                                                </Link>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </nav>

                    {/* Footer / Logout */}
                    <div className="pt-8 border-t border-white/5 mt-auto">
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-5 px-5 py-5 rounded-[1.5rem] text-red-400/40 hover:bg-red-500/10 hover:text-red-400 transition-all group"
                        >
                            <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
                            {isSidebarOpen && <span className="text-[10px] font-black uppercase tracking-[0.4em]">Terminate</span>}
                        </button>
                    </div>
                </div>

                {/* Mobile Toggle */}
                <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="md:hidden absolute -right-14 top-10 w-14 h-14 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center text-white/40 hover:text-white transition-all shadow-2xl"
                >
                    <Menu size={24} />
                </button>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 relative overflow-y-auto dashboard-scroll pb-20">
                <div className="p-10 md:p-16 max-w-7xl mx-auto">
                    {/* Header */}
                    <header className="flex items-end justify-between mb-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-1.5 h-1.5 bg-clay rounded-full animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                                <p className="text-[10px] font-black uppercase tracking-[0.6em] text-white/30">System Status: Optimal</p>
                            </div>
                            <h1 className="text-6xl italic tracking-tighter text-white font-black leading-none uppercase">
                                {NAV_ITEMS.find(i => i.id === activeTab)?.label || 
                                 EXPLORE_ITEMS.find(i => i.id === activeTab)?.label}
                            </h1>
                        </motion.div>
                        
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-6"
                        >
                            <NotificationBell />
                            <div className="flex items-center gap-4 pl-4 border-l border-white/5">
                                <div className="text-right hidden sm:block">
                                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Authorized User</p>
                                    <p className="text-xs font-bold text-white mt-0.5">{user?.user_metadata?.full_name || 'Guest Explorer'}</p>
                                </div>
                                <div className="w-14 h-14 bg-clay text-black rounded-2xl flex items-center justify-center font-black text-xl shadow-[0_0_30px_rgba(52,211,153,0.2)] hover:scale-105 transition-transform cursor-pointer">
                                    {user?.user_metadata?.full_name?.[0] || 'U'}
                                </div>
                            </div>
                        </motion.div>
                    </header>

                    <AnimatePresence mode="wait">
                            <Routes>
                                <Route index element={<MyCards />} />
                                <Route path="cards" element={<MyCards />} />
                                <Route path="categories" element={<CategoriesPage />} />
                                <Route path="categories/:slug" element={<CategoryDetailPage />} />
                                <Route path="tools" element={<RewardsTransferCalculator />} />
                                <Route path="rewards-calculator" element={<RewardsTransferCalculator />} />
                                <Route path="compare" element={<ComparePage />} />
                                <Route path="compare/:slug" element={<ComparisonDetail />} />
                                <Route path="card-explorer" element={<CardExplorer />} />
                                <Route path="cards/:slug" element={<CardDetail />} />
                                <Route path="yureka-ai" element={<YurekaAIPage />} />
                                <Route path="join-waitlist" element={<WaitlistPage />} />
                                <Route path="referrals" element={<ReferralDashboard />} />
                                <Route path="profile" element={<AccountSettings />} />
                                <Route path="expenses" element={<Expenses />} />
                                <Route path="bills" element={<Bills />} />
                                <Route path="*" element={renderEmpty()} />
                            </Routes>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
