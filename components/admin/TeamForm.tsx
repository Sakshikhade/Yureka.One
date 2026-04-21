import React from 'react';
import { 
  X, 
  Loader2, 
  Check, 
  Users 
} from 'lucide-react';

interface TeamFormProps {
  form: any;
  setForm: (form: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  saving: boolean;
}

export const TeamForm: React.FC<TeamFormProps> = ({
  form,
  setForm,
  onSubmit,
  saving
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex items-center gap-4 p-6 bg-teal/5 rounded-2xl border border-teal/10 mb-6">
        <div className="w-12 h-12 bg-teal/10 rounded-xl flex items-center justify-center text-teal">
          <Users size={24} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-teal">Invite Team Member</h4>
          <p className="text-[10px] text-teal/60 uppercase tracking-widest font-bold">Access Control Management</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Email Address</label>
          <input 
            type="email" required
            placeholder="colleague@yureka.money"
            value={form.email}
            onChange={e => setForm({...form, email: e.target.value})}
            className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Administrative Role</label>
          <select 
            value={form.role}
            onChange={e => setForm({...form, role: e.target.value})}
            className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all font-bold"
          >
            <option value="writer">Content Writer (Blogs only)</option>
            <option value="editor">Editor (Blogs & Cards)</option>
            <option value="admin">System Admin (Full Access)</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-end pt-8 border-t border-black/5">
        <button 
          type="submit" 
          disabled={saving}
          className="bg-teal text-cream px-10 py-4 rounded-xl font-bold hover:bg-teal/90 transition-all shadow-lg disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? <Loader2 className="animate-spin text-cream" size={20} /> : <Check size={20} />}
          {saving ? 'Inviting...' : 'Invite to Platform'}
        </button>
      </div>
    </form>
  );
};
