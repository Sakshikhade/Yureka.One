import React from 'react';
import { 
  History, 
  Clock, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Menu,
  LogOut
} from 'lucide-react';
import { useSupabase } from '../SupabaseProvider';

interface AdminHeaderProps {
  user: any;
  onLogout: () => void;
  onToggleSidebar: () => void;
  activeTab: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ 
  user, 
  onLogout, 
  onToggleSidebar,
  activeTab 
}) => {
  const { syncStatus, refreshAll, isLoading } = useSupabase();

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-20 bg-white/80 backdrop-blur-xl border-b border-black/5 z-40 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleSidebar}
          className="lg:hidden p-2 hover:bg-black/5 rounded-xl transition-colors"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-lg font-serif font-bold capitalize">{activeTab}</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
              syncStatus === 'connected' ? 'bg-green-500' : syncStatus === 'reconnecting' ? 'bg-amber-500' : 'bg-red-500'
            }`} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-black/40">
              {syncStatus === 'connected' ? 'Cloud Sync Active' : syncStatus === 'reconnecting' ? 'Reconnecting...' : 'Sync Interrupted'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <button 
          onClick={() => refreshAll()}
          title="Force Cloud Sync"
          className={`p-2.5 rounded-xl border border-black/5 hover:bg-black/5 transition-all group ${isLoading ? 'animate-spin opacity-50' : ''}`}
        >
          <RefreshCw size={18} className="text-black/40 group-hover:text-black transition-colors" />
        </button>

        <div className="hidden md:flex items-center gap-3 pl-6 border-l border-black/5">
          <div className="text-right">
            <p className="text-xs font-bold leading-none">{user?.email?.split('@')[0] || 'Administrator'}</p>
            <p className="text-[10px] text-black/40 mt-1 uppercase tracking-tighter">System Access: Full</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center text-teal font-serif font-black shadow-sm">
            {user?.email?.[0].toUpperCase() || 'A'}
          </div>
        </div>

        <button 
          onClick={onLogout}
          className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
          title="Security Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};
