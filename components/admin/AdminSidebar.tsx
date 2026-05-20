import React from 'react';
import { 
  FileText, 
  Users, 
  CreditCard, 
  Settings, 
  History, 
  LogOut,
  Bell,
  Megaphone,
  Trash2
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
    { id: 'blogs', label: 'Blogs', icon: FileText, roles: ['admin', 'editor', 'writer'] },
    { id: 'reviews', label: 'Reviews', icon: Users, roles: ['admin', 'editor'] },
    { id: 'cards', label: 'Cards', icon: CreditCard, roles: ['admin', 'editor'] },
    { id: 'updates', label: 'Updates', icon: Bell, roles: ['admin', 'editor'] },
    { id: 'notifications', label: 'Notifications', icon: Megaphone, roles: ['admin'] },
    { id: 'waitlist', label: 'Waitlist', icon: Users, roles: ['admin'] },
    { id: 'settings', label: 'Admin Controls', icon: Settings, roles: ['admin'] },
    { id: 'logs', label: 'Audit Trail', icon: History, roles: ['admin'] },
    { id: 'trash', label: 'Trash', icon: Trash2, roles: ['admin'] }
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
        w-72 bg-cream border-r border-white/5 flex flex-col fixed lg:sticky top-0 h-screen z-50 transition-all duration-500 ease-in-out shadow-2xl
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-cream font-serif font-black shadow-xl">Y</div>
            <div className="flex flex-col">
              <span className="font-serif font-black text-lg tracking-tight text-white leading-tight uppercase">Yureka Admin</span>
              <span className="text-[9px] uppercase font-black text-white/20 tracking-[0.2em] mt-1">Management Console</span>
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
                    ? 'bg-white/5 text-white shadow-xl border border-white/5' 
                    : 'text-white/40 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-clay' : 'text-white/20 group-hover:text-white transition-colors'} /> 
                <span className={`text-[11px] font-bold uppercase tracking-widest ${isActive ? 'text-white' : 'text-white/40'}`}>
                  {item.label}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="active-indicator"
                    initial={{ opacity: 0.5, scaleY: 0.8 }}
                    animate={{ 
                      opacity: [0.5, 1, 0.5],
                      scaleY: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute left-1 w-1.5 h-8 bg-clay rounded-full shadow-[0_0_15px_rgba(52,211,153,0.5)]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-4 px-2 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 text-xs font-black shadow-sm">
              {user?.email?.[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-[11px] font-black text-white truncate uppercase tracking-tighter">{user?.email?.split('@')[0] || 'Admin User'}</p>
              <p className="text-[9px] text-white/30 truncate font-bold">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all font-black text-[10px] uppercase tracking-widest border border-red-500/10 group shadow-sm bg-cream"
          >
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            Sign Out Session
          </button>
        </div>
      </aside>
    </>
  );
};
