import React from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2 
} from 'lucide-react';
import { useSupabase } from '../SupabaseProvider';
import { SkeletonTable } from '../SkeletonLoaders';

interface AdminSettingsTabProps {
  onAddMember: () => void;
  onEditMember: (member: any) => void;
  onDeleteMember: (collection: string, id: string) => void;
}

export const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({ 
  onAddMember, 
  onEditMember, 
  onDeleteMember 
}) => {
  const { team, isLoading } = useSupabase();

  if (isLoading && team.length === 0) {
    return <SkeletonTable />;
  }

  return (
  return (
    <div className="p-4 md:p-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h3 className="text-2xl font-serif font-black text-white mb-1 uppercase tracking-tight">Access Control</h3>
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Platform permissions & administrative nodes.</p>
        </div>
        <button 
          onClick={onAddMember}
          className="w-full md:w-auto bg-white text-[#0a0a0a] px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#34d399] hover:text-white transition-all shadow-lg active:scale-95"
        >
          <Plus size={16} /> Deploy New Node
        </button>
      </div>

      <div className="overflow-x-auto rounded-[2rem] border border-white/5 bg-[#1a1a1a]/30">
        <table className="w-full text-left min-w-[700px]">
          <thead className="bg-white/5 text-[10px] uppercase font-black tracking-widest text-white/40 border-b border-white/5">
            <tr>
              <th className="px-8 py-5">Node Identity</th>
              <th className="px-8 py-5">Communication</th>
              <th className="px-8 py-5">Authorization</th>
              <th className="px-8 py-5 text-right">Management</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {team.map(member => (
              <tr key={member.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-8 py-6 font-bold text-sm text-white">{member.full_name || 'N/A'}</td>
                <td className="px-6 py-4 text-sm text-white/60 font-mono tracking-tighter">{member.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.1em] border ${
                    member.role === 'admin' 
                      ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                      : member.role === 'editor' 
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                        : 'bg-[#34d399]/10 text-[#34d399] border-[#34d399]/20'
                  }`}>
                    {member.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-1">
                  <button 
                    onClick={() => onEditMember(member)}
                    className="p-3 text-[#34d399] hover:bg-[#34d399]/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    title="Edit Node"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => onDeleteMember('users', member.id)}
                    className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    title="Terminate Access"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
