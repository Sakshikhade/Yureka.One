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
import { motion, AnimatePresence } from 'motion/react';

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

  // Treat any status not explicitly in [accepted, on_hold, rejected] as 'pending'
  const normalizeStatus = (s?: string | null) => {
    if (s === 'accepted' || s === 'on_hold' || s === 'rejected') return s;
    return 'pending';
  };

  const filteredWaitlist = waitlist.filter(entry => filter === 'all' || normalizeStatus(entry.status) === filter);

  const statusTabs = [
    { id: 'pending', label: 'New Applicants', icon: Clock, color: 'text-amber-500' },
    { id: 'accepted', label: 'Accepted', icon: CheckCircle, color: 'text-[#00933b]' },
    { id: 'on_hold', label: 'On Hold', icon: PauseCircle, color: 'text-blue-500' },
    { id: 'rejected', label: 'Rejected', icon: XCircle, color: 'text-red-500' },
    { id: 'all', label: 'All Entries', icon: Filter, color: 'text-[#242424]' }
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Tab Selectors */}
      <div className="px-8 pt-8 pb-4 border-b border-white/5 bg-white/5/50">
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-2xl w-fit border border-white/5">
          {statusTabs.map((tab) => {
            const Icon = tab.icon;
            const count = tab.id === 'all' 
              ? waitlist.length 
              : waitlist.filter(e => normalizeStatus(e.status) === tab.id).length;
              
            return (
              <button
                key={tab.id}
                onClick={() => onFilterChange(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  filter === tab.id 
                    ? 'bg-white text-cream shadow-sm' 
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={14} className={filter === tab.id ? '' : 'text-white/20'} />
                {tab.label}
                <span className={`ml-1 px-2 py-0.5 rounded-md text-[9px] ${
                  filter === tab.id ? 'bg-cream/10 text-cream' : 'bg-white/5 text-white/40'
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
          <thead className="sticky top-0 z-20 shadow-sm">
            <tr className="bg-white/5 border-b border-white/5">
              <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-white/40 bg-white/5">Applicant Identity</th>
              <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-white/40 bg-white/5">Spend & Cards</th>
              <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-white/40 bg-white/5">Registration Context</th>
              <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-white/40 bg-white/5">Status</th>
              <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-white/40 text-right bg-white/5">Administrative Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <AnimatePresence mode="popLayout">
              {filteredWaitlist.map((entry, idx) => (
                <motion.tr 
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={entry.id} 
                  className="group hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center font-serif font-black text-white/20 group-hover:bg-clay/10 group-hover:text-clay transition-colors">
                        {entry.name ? entry.name[0].toUpperCase() : '?'}
                      </div>
                      <div>
                        <div className="font-bold text-white leading-tight">{entry.name}</div>
                        <div className="text-[11px] text-white/40 mt-0.5 lowercase">{entry.email}</div>
                        {entry.mobile_number && <div className="text-[9px] text-white/20 mt-0.5">{entry.mobile_number}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <div className="text-[11px] font-bold text-white">{entry.monthly_spend || '₹0'}</div>
                      <div className="text-[9px] font-black uppercase tracking-widest text-white/20">{entry.credit_cards_count || 0} Cards</div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-[11px] font-bold text-white/60 uppercase tracking-tight">
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-2"><Filter size={12} className="text-white/20" /> {entry.most_used_for || 'N/A'}</span>
                        <span className="text-[9px] text-white/20 uppercase tracking-widest">Via {entry.source_channel || 'Direct'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        entry.status === 'accepted' ? 'bg-clay' : 
                        entry.status === 'on_hold' ? 'bg-blue-500' : 
                        entry.status === 'rejected' ? 'bg-red-500' : 
                        'bg-amber-500'
                      }`} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white">
                        {entry.status || 'pending'}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onUpdateStatus(entry.id!, 'accepted')}
                        disabled={entry.status === 'accepted'}
                        className={`p-2.5 rounded-xl transition-all ${entry.status === 'accepted' ? 'text-clay bg-clay/10' : 'text-white/20 hover:text-clay hover:bg-clay/10 border border-transparent hover:border-clay/20 shadow-sm'}`}
                        title="Accept Application"
                      >
                        <CheckCircle size={18} />
                      </button>
                      <button 
                        onClick={() => onUpdateStatus(entry.id!, 'on_hold')}
                        disabled={entry.status === 'on_hold'}
                        className={`p-2.5 rounded-xl transition-all ${entry.status === 'on_hold' ? 'text-blue-400 bg-blue-500/10' : 'text-white/20 hover:text-blue-400 hover:bg-blue-500/10 border border-transparent hover:border-blue-500/20 shadow-sm'}`}
                        title="Hold Application"
                      >
                        <PauseCircle size={18} />
                      </button>
                      <button 
                        onClick={() => onUpdateStatus(entry.id!, 'rejected')}
                        disabled={entry.status === 'rejected'}
                        className={`p-2.5 rounded-xl transition-all ${entry.status === 'rejected' ? 'text-red-500 bg-red-500/10' : 'text-white/20 hover:text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 shadow-sm'}`}
                        title="Reject Application"
                      >
                        <XCircle size={18} />
                      </button>
                      <div className="w-px h-6 bg-white/5 mx-1" />
                      <button 
                        onClick={() => onDelete('waitlist', entry.id!)}
                        className="p-2.5 text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20 shadow-sm"
                        title="Delete Record"
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
                  <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white/20">
                    <Filter size={32} />
                  </div>
                  <p className="text-white font-serif font-bold text-xl italic">No entries found.</p>
                  <p className="text-white/40 text-xs mt-2 uppercase tracking-widest font-black">Adjust your filters or wait for new applications.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
