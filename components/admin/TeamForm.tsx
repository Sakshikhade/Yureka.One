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
  uploading?: boolean;
  error?: string | null;
}

export const TeamForm: React.FC<TeamFormProps> = ({
  form,
  setForm,
  onSubmit,
  saving,
  uploading,
  error
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="flex items-center gap-6 p-8 bg-white/5 rounded-[2rem] border border-white/5 mb-8 relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-clay/5 blur-[40px] rounded-full -mr-16 -mt-16" />
        <div className="w-14 h-14 bg-clay/10 rounded-2xl flex items-center justify-center text-clay border border-clay/20 shadow-[0_0_20px_rgba(0,147,59,0.1)]">
          <Users size={28} />
        </div>
        <div className="relative z-10">
          <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-clay mb-1">Access Provisioning</h4>
          <p className="text-[10px] text-white/30 uppercase tracking-widest font-black">Neural Network Permissions</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Transmission Endpoint (Email)</label>
          <input 
            type="email" required
            placeholder="identity@yureka.one"
            value={form.email}
            onChange={e => setForm({...form, email: e.target.value})}
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 focus:ring-clay outline-none transition-all text-white placeholder:text-white/10 font-bold"
          />
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Hierarchy Designation</label>
          <select 
            value={form.role}
            onChange={e => setForm({...form, role: e.target.value})}
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 focus:ring-clay outline-none transition-all text-white font-black uppercase tracking-widest text-[10px] appearance-none"
          >
            <option value="writer" className="bg-cream">Manuscript Author (Blogs)</option>
            <option value="editor" className="bg-cream">Neural Curator (Blogs & Cards)</option>
            <option value="admin" className="bg-cream">Architect Prime (Full Access)</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-10 border-t border-white/5 mt-10">
        <div className="flex-1 pr-6">
          {error && (
            <div className="p-4 bg-red-500/10 text-red-500 rounded-2xl flex items-start gap-3 text-[11px] font-black uppercase tracking-wider border border-red-500/20">
              <X size={16} className="mt-0.5 shrink-0" />
              <span className="leading-tight">{error}</span>
            </div>
          )}
        </div>
        <button 
          type="submit" 
          disabled={saving || uploading}
          className="bg-white text-cream px-16 py-5 rounded-[2rem] font-black hover:bg-clay hover:text-white transition-all shadow-2xl disabled:opacity-50 flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] shrink-0 active:scale-95"
        >
          {(saving || uploading) ? <Loader2 className="animate-spin" size={24} /> : <Check size={24} />}
          {saving ? 'TRANSMITTING...' : 'COMMIT ACCESS'}
        </button>
      </div>
    </form>
  );
};
