import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
    CreditCard, Mail, Receipt, Wallet, Store, 
    Gift, Zap, Sparkles, Users, User, 
    LogOut, ChevronLeft, Menu, Bell
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSupabase } from '../SupabaseProvider';

// Sub-components (to be built)
import MyCards from './MyCards';
import ReferralDashboard from './ReferralDashboard';
import AccountSettings from './AccountSettings';
import MailSync from './MailSync';

const NAV_ITEMS = [
    { id: 'cards', label: 'Saved Cards', icon: CreditCard },
    { id: 'sync', label: 'Mail Sync', icon: Mail },
    { id: 'expenses', label: 'Expenses', icon: Receipt, comingSoon: true },
    { id: 'bills', label: 'Bills', icon: Wallet, comingSoon: true },
    { id: 'extension', label: 'Extension', icon: Zap, comingSoon: true },
    { id: 'store', label: 'Store', icon: Store, comingSoon: true },
    { id: 'giftcards', label: 'GiftCards', icon: Gift, comingSoon: true },
    { id: 'redemption', label: 'Redemption', icon: Sparkles, comingSoon: true },
    { id: 'referrals', label: 'Referral Dashboard', icon: Users },
    { id: 'profile', label: 'Profile', icon: User },
];

const DashboardLayout: React.FC = () => {
    const { user, supabase } = useSupabase();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('cards');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'cards': return <MyCards />;
            case 'sync': return <MailSync />;
            case 'referrals': return <ReferralDashboard />;
            case 'profile': return <AccountSettings />;
            default: return (
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
        }
    };

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
                    <nav className="flex-1 space-y-3">
                        {NAV_ITEMS.map((item, idx) => (
                            <motion.button 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-5 px-5 py-5 rounded-[1.5rem] transition-all group relative overflow-hidden ${activeTab === item.id ? 'bg-white text-black shadow-2xl shadow-white/5' : 'text-white/30 hover:bg-white/5 hover:text-white'}`}
                            >
                                <item.icon size={22} className={`${activeTab === item.id ? 'text-black' : 'group-hover:scale-110 transition-transform duration-500'}`} />
                                {isSidebarOpen && (
                                    <div className="flex flex-col items-start">
                                        <span className="text-[11px] font-black uppercase tracking-[0.2em]">{item.label}</span>
                                        {item.comingSoon && <span className="text-[7px] opacity-40 uppercase tracking-[0.3em] mt-0.5">Development</span>}
                                    </div>
                                )}
                                {activeTab === item.id && (
                                    <motion.div layoutId="nav-glow" className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent animate-glass-shine" />
                                )}
                            </motion.button>
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
                            <h1 className="text-6xl italic tracking-tighter text-white font-black leading-none">
                                {NAV_ITEMS.find(i => i.id === activeTab)?.label}
                            </h1>
                        </motion.div>
                        
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-6"
                        >
                            <button className="w-14 h-14 glass-dark rounded-2xl flex items-center justify-center text-white/30 hover:text-white hover:border-white/20 transition-all relative group">
                                <Bell size={24} className="group-hover:rotate-12 transition-transform" />
                                <div className="absolute top-4 right-4 w-2 h-2 bg-clay rounded-full shadow-[0_0_15px_rgba(52,211,153,1)]" />
                            </button>
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
                        <motion.div 
                            key={activeTab}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -40 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        >
                            {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
