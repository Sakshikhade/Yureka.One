import React from 'react';
import { 
  FileText, 
  Users, 
  CreditCard, 
  Settings, 
  History, 
  LogOut 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminSidebarProps {
  user: any;
  userRole: string;
  activeTab: string;
  isSidebarOpen: boolean;
  onTabChange: (tab: any) => void;
  onLogout: () => void;
  onToggleSidebar: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  user,
  userRole,
  activeTab,
  isSidebarOpen,
  onTabChange,
  onLogout,
  onToggleSidebar
}) => {
  const navItems = [
    { id: 'blogs', label: 'Publication Archive', icon: FileText, roles: ['admin', 'editor', 'writer'] },
    { id: 'reviews', label: 'Social Proofing', icon: Users, roles: ['admin', 'editor'] },
    { id: 'cards', label: 'Financial Catalog', icon: CreditCard, roles: ['admin', 'editor'] },
    { id: 'waitlist', label: 'Waitlist Queue', icon: Users, roles: ['admin'] },
    { id: 'settings', label: 'Governance', icon: Settings, roles: ['admin'] },
    { id: 'logs', label: 'Audit Trail', icon: History, roles: ['admin'] }
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));

  return (
    <>
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={onToggleSidebar}
          />
        )}
      </AnimatePresence>

      <aside className={`
        w-72 bg-white border-r border-black/5 flex flex-col fixed lg:sticky top-0 h-screen z-50 transition-all duration-500 ease-in-out shadow-2xl shadow-black/[0.02]
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-8 border-b border-black/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center text-white font-serif font-black shadow-xl">Y</div>
            <div className="flex flex-col">
              <span className="font-serif font-black text-lg tracking-tight text-ink leading-tight uppercase">Yureka Admin</span>
              <span className="text-[9px] uppercase font-black text-black/20 tracking-[0.2em] mt-1">Management Console</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2 overflow-y-auto no-scrollbar">
          {filteredNavItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button 
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 relative group ${
                  isActive 
                    ? 'bg-ink text-white shadow-xl shadow-black/10' 
                    : 'text-black/40 hover:bg-black/5 hover:text-black'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-white' : 'text-black/20 group-hover:text-black transition-colors'} /> 
                <span className={`text-[11px] font-bold uppercase tracking-widest ${isActive ? 'text-white' : 'text-black/60'}`}>
                  {item.label}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="absolute left-1 w-1 h-6 bg-teal rounded-full"
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-6 border-t border-black/5 bg-slate-50/50">
          <div className="flex items-center gap-4 px-2 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-white border border-black/5 flex items-center justify-center text-black/40 text-xs font-black shadow-sm ring-4 ring-black/[0.02]">
              {user?.email?.[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-[11px] font-black text-ink truncate uppercase tracking-tighter">{user?.email?.split('@')[0] || 'Admin User'}</p>
              <p className="text-[9px] text-black/30 truncate font-bold">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-black text-[10px] uppercase tracking-widest border border-transparent hover:border-red-100 group shadow-sm bg-white"
          >
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            Sign Out Session
          </button>
        </div>
      </aside>
    </>
  );
};
