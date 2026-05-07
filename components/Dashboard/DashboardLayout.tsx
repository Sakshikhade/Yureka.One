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
                <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                    <div className="w-20 h-20 bg-clay/5 rounded-full flex items-center justify-center border border-clay/10">
                        <Zap size={32} className="text-clay animate-pulse" />
                    </div>
                    <h2 className="text-3xl italic tracking-tighter text-white">Coming Soon</h2>
                    <p className="text-white/40 max-w-xs mx-auto">This module is currently being calibrated in the Yureka Lab.</p>
                </div>
            );
        }
    };

    return (
        <div className="min-h-screen bg-cream flex overflow-hidden font-sans pt-0">
            {/* Left Side Navigation */}
            <aside className={`bg-white/[0.02] border-r border-white/5 w-80 fixed md:relative left-0 h-full z-50 transition-all duration-500 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-24'}`}>
                <div className="h-full flex flex-col p-6">
                    {/* Brand */}
                    <div className="flex items-center gap-4 mb-12 px-2">
                        <div className="w-10 h-10 bg-clay rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-clay/20">
                            <Zap size={20} className="text-cream" />
                        </div>
                        {isSidebarOpen && (
                            <span className="text-sm font-black uppercase tracking-[0.3em] text-white italic">Yureka</span>
                        )}
                    </div>

                    {/* Nav Items */}
                    <nav className="flex-1 space-y-2">
                        {NAV_ITEMS.map((item) => (
                            <button 
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group relative overflow-hidden ${activeTab === item.id ? 'bg-clay text-cream shadow-xl shadow-clay/10' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                            >
                                <item.icon size={20} className={`${activeTab === item.id ? 'text-cream' : 'group-hover:scale-110 transition-transform'}`} />
                                {isSidebarOpen && (
                                    <div className="flex flex-col items-start">
                                        <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                                        {item.comingSoon && <span className="text-[8px] opacity-40 uppercase tracking-tighter">Planned</span>}
                                    </div>
                                )}
                                {activeTab === item.id && (
                                    <motion.div layoutId="nav-glow" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-glass-shine" />
                                )}
                            </button>
                        ))}
                    </nav>

                    {/* Footer / Logout */}
                    <div className="pt-6 border-t border-white/5 mt-auto">
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-red-400/60 hover:bg-red-500/10 hover:text-red-400 transition-all group"
                        >
                            <LogOut size={20} />
                            {isSidebarOpen && <span className="text-[10px] font-black uppercase tracking-widest">Terminate Session</span>}
                        </button>
                    </div>
                </div>

                {/* Mobile Toggle */}
                <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="md:hidden absolute -right-12 top-8 w-12 h-12 bg-cream border-y border-r border-white/5 rounded-r-2xl flex items-center justify-center text-white/40"
                >
                    <Menu size={20} />
                </button>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 relative overflow-y-auto no-scrollbar pb-20">
                <div className="p-8 md:p-12 max-w-6xl mx-auto">
                    {/* Header */}
                    <header className="flex items-center justify-between mb-12">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-2">Internal Portal</p>
                            <h1 className="text-4xl italic tracking-tighter text-white">
                                {NAV_ITEMS.find(i => i.id === activeTab)?.label}
                            </h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-all relative">
                                <Bell size={20} />
                                <div className="absolute top-3 right-3 w-2 h-2 bg-clay rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                            </button>
                            <div className="w-12 h-12 bg-clay text-cream rounded-full flex items-center justify-center font-bold text-lg shadow-2xl">
                                {user?.user_metadata?.full_name?.[0] || 'U'}
                            </div>
                        </div>
                    </header>

                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="min-h-[60vh]"
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
