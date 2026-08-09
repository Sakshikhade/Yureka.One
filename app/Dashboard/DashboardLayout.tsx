import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    CreditCard, Receipt, Wallet, Store,
    Gift, Zap, Sparkles, Users, User,
    LogOut, Menu, Bell, Coins
} from 'lucide-react';
import { useNavigate, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { useSupabase } from '@shared/SupabaseProvider';
import { signOutGmail } from '@shared/auth';
import WelcomeBanner from './WelcomeBanner';

// Sub-components (to be built)
import MyCards from './MyCards';
import ReferralDashboard from './ReferralDashboard';
import AccountSettings from './AccountSettings';
import Expenses from './Expenses';
import Bills from './Bills';
import YurekaAIPage from '@landing/YurekaAIPage';
import WaitlistPage from '@app/WaitlistPage';
import GoldbackHome from './GoldbackHome';
import OffersPage from './OffersPage';
import GiftCardsPage from './GiftCardsPage';
import GiftCardOrderPage from './GiftCardOrderPage';

import { api, isApiError } from '@backend/lib/api/client';

type NavItem = {
    id: string
    label: string
    icon: typeof Coins
    path: string
    comingSoon?: boolean
}

const PRIMARY_NAV: NavItem[] = [
    { id: 'home', label: 'Goldback', icon: Coins, path: '/dashboard/home' },
    { id: 'offers', label: 'Offers', icon: Store, path: '/dashboard/offers' },
    { id: 'giftcards', label: 'Gift cards', icon: Gift, path: '/dashboard/giftcards' },
];

const SECONDARY_NAV: NavItem[] = [
    { id: 'cards', label: 'Cards', icon: CreditCard, path: '/dashboard/cards' },
    { id: 'expenses', label: 'Expenses', icon: Receipt, path: '/dashboard/expenses' },
    { id: 'bills', label: 'Bills', icon: Wallet, path: '/dashboard/bills' },
    { id: 'referrals', label: 'Referrals', icon: Users, path: '/dashboard/referrals' },
    { id: 'profile', label: 'Profile', icon: User, path: '/dashboard/profile' },
];

const SOON_NAV: NavItem[] = [
    { id: 'extension', label: 'Extension', icon: Zap, comingSoon: true, path: '/dashboard/extension' },
    { id: 'redemption', label: 'Redeem', icon: Sparkles, comingSoon: true, path: '/dashboard/redemption' },
];

const NAV_ITEMS = [...PRIMARY_NAV, ...SECONDARY_NAV, ...SOON_NAV];

const NotificationBell = () => {
    const { user, ledgerTransactions } = useSupabase();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user?.email) return;
        const load = async () => {
            const [notifsRes, intersRes] = await Promise.all([
                api.get<any[]>('/api/v1/notifications', { skipAuth: true }),
                api.get<any[]>(`/api/v1/notifications/interactions?email=${encodeURIComponent(user.email!)}`)
            ]);

            const notifs = !isApiError(notifsRes) ? (notifsRes.data ?? []) : [];
            const inters = !isApiError(intersRes) ? (intersRes.data ?? []) : [];

            const clickedIds = new Set(inters.filter(i => i.action === 'clicked').map(i => i.notificationId));
            const readIds = new Set(inters.filter(i => i.action === 'read').map(i => i.notificationId));

            const activeNotifs = notifs.filter(n => !clickedIds.has(n.id));
            setNotifications(activeNotifs);
            setUnreadCount(activeNotifs.filter(n => !readIds.has(n.id)).length);
        };
        load();

        // Poll every 30s (no realtime needed)
        const interval = setInterval(load, 30000);
        return () => clearInterval(interval);
    }, [user?.email]);

    const handleOpen = async () => {
        setIsOpen(!isOpen);
        if (!isOpen && unreadCount > 0) {
            // Mark all as read when opening
            setUnreadCount(0);
            for (const n of notifications) {
                await api.post(`/api/v1/notifications/${n.id}/interact`, {
                    user_email: user.email!,
                    username: user.user_metadata?.full_name || '',
                    action: 'read',
                });
            }
        }
    };

    const handleDismiss = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setNotifications(prev => prev.filter(n => n.id !== id));
        await api.post(`/api/v1/notifications/${id}/interact`, {
            user_email: user.email!,
            username: user.user_metadata?.full_name || '',
            action: 'clicked',
        });
    };

    const resolveVariables = (msg: string) => {
        if (!msg) return msg;
        let text = msg;
        const userName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Explorer';
        const cardName = 'your primary card';
        
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
                className="w-11 h-11 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-center text-white/35 hover:text-white hover:border-white/20 transition-all relative group"
            >
                <Bell size={18} className={`transition-transform ${isOpen ? 'text-clay' : 'group-hover:rotate-12'}`} />
                {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-4.5 h-4.5 min-w-[1.1rem] min-h-[1.1rem] px-1 bg-clay rounded-full shadow-[0_0_12px_rgba(52,211,153,0.8)] flex items-center justify-center text-[8px] text-black font-black">
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
                                                    <div className="w-2 h-2 rounded-full bg-clay mt-2 shrink-0 shadow-[0_0_8px_#00933b]" />
                                                    <div className="flex-1">
                                                        <h4 className="text-white text-sm font-bold mb-1">{resolveVariables(n.title)}</h4>
                                                        <p className="text-white/60 text-xs leading-relaxed">{resolveVariables(n.message)}</p>
                                                    </div>
                                                </div>
                                                {n.imageUrl && (
                                                    <div className="w-full h-32 rounded-xl overflow-hidden mt-1 border border-white/5 relative ml-6">
                                                        <img src={n.imageUrl} alt="Notification visual" className="w-full h-full object-cover" />
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
    const { user } = useSupabase();
    const navigate = useNavigate();
    const location = useLocation();
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(
        () => typeof window === 'undefined' || window.innerWidth >= 768
    );

    const activeTab = NAV_ITEMS.find(i => i.path && (location.pathname === i.path || location.pathname.startsWith(i.path + '/')))?.id
        || (location.pathname === '/dashboard' || location.pathname === '/dashboard/' ? 'home' : 'home');

    const handleLogout = async () => {
        await signOutGmail();
        navigate('/');
    };

    const renderEmpty = () => (
        <div className="flex flex-col items-center justify-center h-full text-center py-20">
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-20 h-20 bg-clay/10 rounded-[1.75rem] flex items-center justify-center border border-clay/20 mb-6"
            >
                <Sparkles size={32} className="text-clay" />
            </motion.div>
            <h2 className="text-3xl font-black tracking-tight text-white mb-3">Coming soon</h2>
            <p className="text-white/40 max-w-sm mx-auto text-[15px] leading-relaxed">
                This piece of Yureka is still baking. Goldback and Offers are live today.
            </p>
            <Link
                to="/dashboard/offers"
                className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-clay text-black px-6 py-3.5 text-[11px] font-black uppercase tracking-[0.2em] hover:brightness-110 transition"
            >
                Browse offers
            </Link>
        </div>
    );

    const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Member';
    const isCoreTab = activeTab === 'home' || activeTab === 'offers' || activeTab === 'giftcards';
    const activeLabel = NAV_ITEMS.find(i => i.id === activeTab)?.label || 'Goldback';

    const NavLink = ({ item, idx }: { item: NavItem; idx: number }) => (
        <Link to={item.path!} onClick={() => { if (window.innerWidth < 768) setIsSidebarOpen(false); }}>
            <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group relative ${
                    activeTab === item.id
                        ? 'bg-white text-black shadow-lg shadow-white/5'
                        : 'text-white/35 hover:bg-white/[0.04] hover:text-white'
                }`}
            >
                <item.icon size={18} className={activeTab === item.id ? 'text-black' : 'group-hover:scale-110 transition-transform'} />
                {isSidebarOpen && (
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-[11px] font-black uppercase tracking-[0.15em] truncate">{item.label}</span>
                        {item.comingSoon && (
                            <span className={`text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded-md shrink-0 ${
                                activeTab === item.id ? 'bg-black/10 text-black/50' : 'bg-white/5 text-white/30'
                            }`}>Soon</span>
                        )}
                    </div>
                )}
            </motion.div>
        </Link>
    );

    return (
        <div className="min-h-screen bg-[#070707] flex overflow-hidden font-sans selection:bg-clay selection:text-black">
            {isSidebarOpen && (
                <button
                    type="button"
                    aria-label="Close menu"
                    onClick={() => setIsSidebarOpen(false)}
                    className="md:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
                />
            )}

            <aside className={`fixed md:relative z-50 h-full border-r border-white/[0.07] bg-[#0a0a0a] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isSidebarOpen ? 'translate-x-0 w-[17.5rem]' : '-translate-x-full md:translate-x-0 md:w-[4.75rem]'
            }`}>
                <div className="h-full flex flex-col p-5">
                    <div className="flex items-center gap-3 mb-10 px-2">
                        <div className="w-11 h-11 bg-clay rounded-2xl flex items-center justify-center shrink-0 shadow-[0_0_28px_rgba(52,211,153,0.35)]">
                            <Coins size={20} className="text-black" />
                        </div>
                        {isSidebarOpen && (
                            <div className="flex flex-col min-w-0">
                                <span className="text-base font-black tracking-tight text-white leading-none">Yureka</span>
                                <span className="text-[9px] font-black uppercase tracking-[0.35em] text-clay/70 mt-1.5">Goldback</span>
                            </div>
                        )}
                    </div>

                    <nav className="flex-1 space-y-5 dashboard-scroll overflow-y-auto pr-1">
                        <div className="space-y-1">
                            {isSidebarOpen && (
                                <p className="px-4 pb-1 text-[9px] font-black uppercase tracking-[0.3em] text-white/25">Earn</p>
                            )}
                            {PRIMARY_NAV.map((item, idx) => (
                                <NavLink key={item.id} item={item} idx={idx} />
                            ))}
                        </div>
                        <div className="space-y-1">
                            {isSidebarOpen && (
                                <p className="px-4 pb-1 text-[9px] font-black uppercase tracking-[0.3em] text-white/25">Account</p>
                            )}
                            {SECONDARY_NAV.map((item, idx) => (
                                <NavLink key={item.id} item={item} idx={idx + 2} />
                            ))}
                        </div>
                        <div className="space-y-1">
                            {isSidebarOpen && (
                                <p className="px-4 pb-1 text-[9px] font-black uppercase tracking-[0.3em] text-white/25">Next</p>
                            )}
                            {SOON_NAV.map((item, idx) => (
                                <NavLink key={item.id} item={item} idx={idx + 7} />
                            ))}
                        </div>
                    </nav>

                    <div className="pt-5 border-t border-white/[0.07] mt-auto space-y-1">
                        <button
                            type="button"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="hidden md:flex w-full items-center gap-4 px-4 py-3 rounded-2xl text-white/25 hover:text-white/60 hover:bg-white/[0.03] transition text-[10px] font-black uppercase tracking-[0.2em]"
                        >
                            <Menu size={18} />
                            {isSidebarOpen && <span>Collapse</span>}
                        </button>
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-white/30 hover:bg-red-500/10 hover:text-red-300 transition-all group"
                        >
                            <LogOut size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                            {isSidebarOpen && <span className="text-[10px] font-black uppercase tracking-[0.25em]">Sign out</span>}
                        </button>
                    </div>
                </div>
            </aside>

            <main className="flex-1 relative overflow-y-auto dashboard-scroll pb-16 min-w-0">
                <div className="sticky top-0 z-30 flex items-center justify-between gap-4 px-5 md:px-10 py-4 bg-[#070707]/85 backdrop-blur-xl border-b border-white/[0.05]">
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            type="button"
                            onClick={() => setIsSidebarOpen(true)}
                            className="md:hidden w-11 h-11 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-center text-white/50 hover:text-white"
                        >
                            <Menu size={20} />
                        </button>
                        {!isCoreTab && (
                            <h1 className="text-lg md:text-xl font-black tracking-tight text-white truncate">{activeLabel}</h1>
                        )}
                        {isCoreTab && (
                            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/30 hidden sm:block">
                                Discount → Goldback → redeem
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-3 sm:gap-5 shrink-0">
                        <NotificationBell />
                        <div className="flex items-center gap-3 pl-3 border-l border-white/10">
                            <div className="text-right hidden sm:block">
                                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/25">Member</p>
                                <p className="text-xs font-bold text-white mt-0.5 truncate max-w-[9rem]">{displayName}</p>
                            </div>
                            <div className="w-11 h-11 bg-clay text-black rounded-2xl flex items-center justify-center font-black text-base shadow-[0_0_24px_rgba(52,211,153,0.25)]">
                                {displayName[0]?.toUpperCase() || 'U'}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-5 md:p-10 max-w-6xl mx-auto">
                    <WelcomeBanner />
                    <AnimatePresence mode="wait">
                            <Routes>
                                <Route index element={<Navigate to="home" replace />} />
                                <Route path="home" element={<GoldbackHome />} />
                                <Route path="offers" element={<OffersPage />} />
                                <Route path="giftcards/orders/:orderId" element={<GiftCardOrderPage />} />
                                <Route path="giftcards" element={<GiftCardsPage />} />
                                <Route path="cards" element={<MyCards />} />
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
