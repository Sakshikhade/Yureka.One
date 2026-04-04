import React from 'react';
import { 
  CheckCircle, 
  PauseCircle, 
  XCircle, 
  Trash2, 
  Filter,
  Clock,
  Users
} from 'lucide-react';
import { WaitlistEntry } from '../../types';
import { useSupabase } from '../SupabaseProvider';
import { SkeletonTable } from '../SkeletonLoaders';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminWaitlistTabProps {
  filter: 'pending' | 'accepted' | 'rejected' | 'on_hold' | 'all';
  onFilterChange: (filter: 'pending' | 'accepted' | 'rejected' | 'on_hold' | 'all') => void;
  onUpdateStatus: (id: string, status: 'accepted' | 'rejected' | 'on_hold' | 'pending') => void;
  onDelete: (collection: string, id: string) => void;
}

export const AdminWaitlistTab: React.FC<AdminWaitlistTabProps> = ({ 
  filter, 
  onFilterChange, 
  onUpdateStatus, 
  onDelete 
}) => {
  const { waitlist, isLoading } = useSupabase();

  if (isLoading && waitlist.length === 0) {
    return <SkeletonTable />;
  }

  const filteredWaitlist = waitlist.filter(entry => filter === 'all' || (entry.status || 'pending') === filter);

  const statusTabs = [
    { id: 'pending', label: 'New Applicants', icon: Clock, color: 'text-amber-500' },
    { id: 'accepted', label: 'Accepted', icon: CheckCircle, color: 'text-green-500' },
    { id: 'on_hold', label: 'On Hold', icon: PauseCircle, color: 'text-blue-500' },
    { id: 'rejected', label: 'Rejected', icon: XCircle, color: 'text-red-500' },
    { id: 'all', label: 'All Entries', icon: Filter, color: 'text-ink' }
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Tab Selectors */}
      <div className="px-8 pt-8 pb-4 border-b border-black/5 bg-slate-50/50">
        <div className="flex items-center gap-1 bg-black/5 p-1 rounded-2xl w-fit">
          {statusTabs.map((tab) => {
            const Icon = tab.icon;
            const count = tab.id === 'all' 
              ? waitlist.length 
              : waitlist.filter(e => (e.status || 'pending') === tab.id).length;
              
            return (
              <button
                key={tab.id}
                onClick={() => onFilterChange(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  filter === tab.id 
                    ? 'bg-white text-ink shadow-sm' 
                    : 'text-black/40 hover:text-black hover:bg-white/50'
                }`}
              >
                <Icon size={14} className={filter === tab.id ? tab.color : 'text-black/20'} />
                {tab.label}
                <span className={`ml-1 px-2 py-0.5 rounded-md text-[9px] ${
                  filter === tab.id ? 'bg-black/5 text-ink' : 'bg-black/5 text-black/40'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-slate-50/50 border-b border-black/5">
              <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-black/40">Applicant Identity</th>
              <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-black/40">Classification</th>
              <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-black/40">Registration Context</th>
              <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-black/40">Status</th>
              <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-black/40 text-right">Administrative Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            <AnimatePresence mode="popLayout">
              {filteredWaitlist.map((entry, idx) => (
                <motion.tr 
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={entry.id} 
                  className="group hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-black/5 flex items-center justify-center font-serif font-black text-black/40 group-hover:bg-teal/10 group-hover:text-teal transition-colors">
                        {entry.name[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-ink leading-tight">{entry.name}</div>
                        <div className="text-[11px] text-black/40 mt-0.5 lowercase">{entry.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                      entry.role === 'user' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                    }`}>
                      {entry.role}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-[11px] font-bold text-ink/60 uppercase tracking-tight">
                      {entry.role === 'user' ? (
                        <span className="flex items-center gap-2"><Filter size={12} className="text-black/20" /> {entry.category} Preference</span>
                      ) : (
                        <span className="flex items-center gap-2"><Users size={12} className="text-black/20" /> {entry.company} Network</span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        entry.status === 'accepted' ? 'bg-green-500' : 
                        entry.status === 'on_hold' ? 'bg-blue-500' : 
                        entry.status === 'rejected' ? 'bg-red-500' : 
                        'bg-amber-500'
                      }`} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-ink">
                        {entry.status || 'pending'}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onUpdateStatus(entry.id!, 'accepted')}
                        disabled={entry.status === 'accepted'}
                        className={`p-2.5 rounded-xl transition-all ${entry.status === 'accepted' ? 'text-green-600 bg-green-50' : 'text-black/20 hover:text-green-600 hover:bg-green-50 border border-transparent hover:border-green-100 shadow-sm'}`}
                        title="Authorize Entry"
                      >
                        <CheckCircle size={18} />
                      </button>
                      <button 
                        onClick={() => onUpdateStatus(entry.id!, 'on_hold')}
                        disabled={entry.status === 'on_hold'}
                        className={`p-2.5 rounded-xl transition-all ${entry.status === 'on_hold' ? 'text-blue-600 bg-blue-50' : 'text-black/20 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 shadow-sm'}`}
                        title="Place on Hold"
                      >
                        <PauseCircle size={18} />
                      </button>
                      <button 
                        onClick={() => onUpdateStatus(entry.id!, 'rejected')}
                        disabled={entry.status === 'rejected'}
                        className={`p-2.5 rounded-xl transition-all ${entry.status === 'rejected' ? 'text-red-600 bg-red-50' : 'text-black/20 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 shadow-sm'}`}
                        title="Reject Application"
                      >
                        <XCircle size={18} />
                      </button>
                      <div className="w-px h-6 bg-black/5 mx-1" />
                      <button 
                        onClick={() => onDelete('waitlist', entry.id!)}
                        className="p-2.5 text-black/20 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100 shadow-sm"
                        title="Purge Record"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
            {filteredWaitlist.length === 0 && (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center">
                  <div className="bg-black/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-black/20">
                    <Filter size={32} />
                  </div>
                  <p className="text-ink font-serif font-bold text-xl italic">No entries found.</p>
                  <p className="text-black/40 text-xs mt-2 uppercase tracking-widest font-black">Adjust your filters or wait for new applications.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
