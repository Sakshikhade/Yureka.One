import React from 'react';
import { 
  RefreshCw, 
  Menu,
  LogOut,
  Plus
} from 'lucide-react';
import { useSupabase } from '../SupabaseProvider';

interface AdminHeaderProps {
  user: any;
  onLogout: () => void;
  onToggleSidebar: () => void;
  activeTab: string;
  onAdd?: () => void;
  addLabel?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ 
  user, 
  onLogout, 
  onToggleSidebar,
  activeTab,
  onAdd,
  addLabel
}) => {
  const { syncStatus, refreshAll, isLoading } = useSupabase();

  const getTabTitle = (tab: string) => {
    const titles: Record<string, string> = {
      blogs: 'Blogs Registry',
      cards: 'Card Market',
      reviews: 'User Reviews',
      waitlist: 'VIP Waitlist',
      settings: 'Team & Security',
      logs: 'Platform Audit Logs'
    };
    return titles[tab] || tab;
  };

  return (
    <header className="sticky top-0 right-0 left-0 h-24 bg-white/80 backdrop-blur-xl border-b border-black/5 z-40 px-4 md:px-10 flex items-center justify-between transition-all duration-300">
      <div className="flex items-center gap-6">
        <button 
          onClick={onToggleSidebar}
          className="lg:hidden p-2.5 hover:bg-black/5 rounded-2xl transition-colors border border-black/5 shadow-sm bg-white"
        >
          <Menu size={20} />
        </button>
        
        <div className="flex flex-col">
          <h1 className="text-2xl md:text-3xl font-heading font-black tracking-tight text-ink uppercase leading-none">
            {getTabTitle(activeTab)}
          </h1>

          <div className="flex items-center gap-2 mt-1.5">
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
              syncStatus === 'connected' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 
              syncStatus === 'reconnecting' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 
              'bg-red-500 shadow-[0_0_8px_rgba(239,44,44,0.5)]'
            }`} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-black/30">
              {syncStatus === 'connected' ? 'Cloud Sync Active' : syncStatus === 'reconnecting' ? 'Reconnecting...' : 'Sync Interrupted'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        {onAdd && (
          <button 
            onClick={onAdd}
            className="hidden md:flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-2xl font-bold text-[11px] uppercase tracking-wider hover:bg-teal transition-all shadow-lg active:scale-95"
          >
            <Plus size={16} />
            {addLabel || `Add New`}
          </button>
        )}

        <div className="flex items-center gap-3 pr-2 md:pr-4 border-r border-black/5 mr-1 md:mr-2">
          <button 
            onClick={() => refreshAll()}
            title="Force Cloud Sync"
            className={`p-2.5 rounded-2xl border border-black/5 hover:bg-black/5 transition-all group overflow-hidden relative ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <RefreshCw size={18} className={`text-black/40 group-hover:text-black transition-colors ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          
          <button 
            onClick={onLogout}
            className="p-2.5 rounded-2xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors border border-red-100/50 group"
            title="Security Logout"
          >
            <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-black text-ink leading-none">{user?.email?.split('@')[0] || 'Administrator'}</p>
            <p className="text-[10px] text-black/40 mt-1 uppercase font-bold tracking-tighter">Access: Active</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-teal/10 flex items-center justify-center text-teal font-serif font-black shadow-inner border border-teal/5 relative">
            {user?.email?.[0].toUpperCase() || 'A'}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm" />
          </div>
        </div>
      </div>
    </header>
  );
};
