import React from 'react';
import { 
  CheckCircle, 
  PauseCircle, 
  XCircle, 
  RotateCcw, 
  Trash2, 
  Filter,
  Clock
} from 'lucide-react';
import { WaitlistEntry } from '../../types';
import { useSupabase } from '../SupabaseProvider';
import { SkeletonTable } from '../SkeletonLoaders';

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
    { id: 'pending', label: 'New Applicants', icon: Clock },
    { id: 'accepted', label: 'Accepted', icon: CheckCircle },
    { id: 'on_hold', label: 'On Hold', icon: PauseCircle },
    { id: 'rejected', label: 'Rejected', icon: XCircle },
    { id: 'all', label: 'All', icon: Filter }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-1 bg-black/5 p-1 rounded-2xl w-fit overflow-x-auto max-w-full no-scrollbar">
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
                  ? 'bg-white text-teal shadow-sm' 
                  : 'text-black/40 hover:text-black hover:bg-white/50'
              }`}
            >
              <Icon size={14} />
              {tab.label}
              <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[8px] ${
                filter === tab.id ? 'bg-teal/10 text-teal' : 'bg-black/5 text-black/40'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-2 min-w-[900px]">
          <thead className="bg-black/5 text-[10px] uppercase font-bold tracking-widest text-black/40">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Details</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {filteredWaitlist.map(entry => (
              <tr key={entry.id} className="bg-white hover:bg-black/[0.01] transition-colors rounded-xl overflow-hidden">
                <td className="px-6 py-4">
                  <div className="font-bold text-sm text-black">{entry.name}</div>
                </td>
                <td className="px-6 py-4 text-sm text-black/60">{entry.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${entry.role === 'user' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                    {entry.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-black/60 max-w-[200px] truncate">
                  {entry.role === 'user' ? `Category: ${entry.category}` : `Company: ${entry.company}`}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button 
                      onClick={() => onUpdateStatus(entry.id!, 'accepted')}
                      disabled={entry.status === 'accepted'}
                      title="Accept User"
                      className={`p-2 rounded-lg transition-all ${entry.status === 'accepted' ? 'text-green-600 bg-green-50' : 'text-black/20 hover:text-green-600 hover:bg-green-50'}`}
                    >
                      <CheckCircle size={18} />
                    </button>
                    <button 
                      onClick={() => onUpdateStatus(entry.id!, 'on_hold')}
                      disabled={entry.status === 'on_hold'}
                      title="Put on Hold"
                      className={`p-2 rounded-lg transition-all ${entry.status === 'on_hold' ? 'text-amber-600 bg-amber-50' : 'text-black/20 hover:text-amber-600 hover:bg-amber-50'}`}
                    >
                      <PauseCircle size={18} />
                    </button>
                    <button 
                      onClick={() => onUpdateStatus(entry.id!, 'rejected')}
                      disabled={entry.status === 'rejected'}
                      title="Reject User"
                      className={`p-2 rounded-lg transition-all ${entry.status === 'rejected' ? 'text-red-600 bg-red-50' : 'text-black/20 hover:text-red-600 hover:bg-red-50'}`}
                    >
                      <XCircle size={18} />
                    </button>
                    <button 
                      onClick={() => onUpdateStatus(entry.id!, 'pending')}
                      disabled={!entry.status || entry.status === 'pending'}
                      title="Reset to Pending"
                      className="p-2 text-black/20 hover:text-black hover:bg-black/5 rounded-lg transition-all"
                    >
                      <RotateCcw size={16} />
                    </button>
                    <button 
                      onClick={() => onDelete('waitlist', entry.id!)}
                      title="Delete Entry"
                      className="p-2 text-black/20 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
