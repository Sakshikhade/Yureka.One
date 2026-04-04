import React from 'react';
import { 
  FileText, 
  Users, 
  CreditCard, 
  Settings, 
  History, 
  LogOut 
} from 'lucide-react';

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
    { id: 'waitlist', label: 'Waitlist', icon: Users, roles: ['admin'] },
    { id: 'settings', label: 'Team Settings', icon: Settings, roles: ['admin'] },
    { id: 'logs', label: 'Activity Log', icon: History, roles: ['admin'] }
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));

  return (
    <>
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-64 bg-white border-r border-black/5 flex flex-col fixed lg:sticky top-0 h-screen z-50 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-black/5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-teal rounded-lg flex items-center justify-center text-white font-bold">Y</div>
            <span className="font-bold text-xl tracking-tight">Yureka Admin</span>
          </div>
          <p className="text-[10px] uppercase font-bold text-black/40 tracking-widest">Management Console</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {filteredNavItems.map(item => {
            const Icon = item.icon;
            return (
              <button 
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === item.id 
                    ? 'bg-teal/10 text-teal font-bold shadow-sm' 
                    : 'text-black/60 hover:bg-black/5 hover:text-black'
                }`}
              >
                <Icon size={20} className={activeTab === item.id ? 'text-teal' : 'text-black/40'} /> 
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-black/5 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-black/40 text-xs font-bold ring-2 ring-black/5">
              {user?.email?.[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate">{user?.email?.split('@')[0] || 'Admin User'}</p>
              <p className="text-[10px] text-black/40 truncate">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-bold text-sm group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};
