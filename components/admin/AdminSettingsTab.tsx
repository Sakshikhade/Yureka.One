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
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h3 className="text-xl font-serif font-bold mb-1">Team Management</h3>
          <p className="text-black/40 text-xs">Manage administrative access and contributing writers.</p>
        </div>
        <button 
          onClick={onAddMember}
          className="w-full md:w-auto bg-black text-cream px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Add Member
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[700px]">
          <thead className="bg-black/5 text-[10px] uppercase font-bold tracking-widest text-black/40">
            <tr>
              <th className="px-6 py-4">Full Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {team.map(member => (
              <tr key={member.id} className="hover:bg-black/[0.01] transition-colors">
                <td className="px-6 py-4 font-bold text-sm">{member.full_name || 'N/A'}</td>
                <td className="px-6 py-4 text-sm text-black/60">{member.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${member.role === 'admin' ? 'bg-red-100 text-red-600' : member.role === 'editor' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                    {member.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button 
                    onClick={() => onEditMember(member)}
                    className="p-2 text-teal hover:bg-teal/10 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => onDeleteMember('users', member.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
