import React, { useRef } from 'react';
import { 
  Loader2, 
  Upload, 
  Image as ImageIcon,
  Check,
  X
} from 'lucide-react';

interface ReviewFormProps {
  form: any;
  setForm: (form: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
  saving: boolean;
  error?: string | null;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  form,
  setForm,
  onSubmit,
  onFileUpload,
  uploading,
  saving,
  error
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Asset Node (Identity Photo)</label>
          <div className="relative aspect-square w-56 mx-auto bg-white/5 rounded-[2.5rem] overflow-hidden border-2 border-dashed border-white/10 group shadow-2xl">
            {form.image ? (
              <img src={form.image} alt="Preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/10">
                <ImageIcon size={48} strokeWidth={1} />
                <p className="text-[9px] font-black uppercase tracking-widest mt-4">Awaiting Signal</p>
              </div>
            )}
            <div className="absolute inset-0 bg-[#0a0a0a]/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-sm">
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-white text-[#0a0a0a] p-4 rounded-full hover:scale-110 transition-transform shadow-2xl active:scale-95"
              >
                <Upload size={20} />
              </button>
            </div>
          </div>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={onFileUpload}
            className="hidden" 
            accept="image/*"
          />
          <div className="p-5 rounded-2xl bg-[#34d399]/5 border border-[#34d399]/10">
            <p className="text-[9px] text-[#34d399] font-black uppercase tracking-widest leading-relaxed text-center">Neural Optimization: Portrait imagery enhances social proof credibility nodes.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Identity Designation</label>
            <input 
              type="text" required
              value={form.author}
              onChange={e => setForm({...form, author: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 focus:ring-[#34d399] outline-none transition-all text-white placeholder:text-white/10"
              placeholder="Full Name"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Protocol Role</label>
              <input 
                type="text" required
                value={form.role}
                onChange={e => setForm({...form, role: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 focus:ring-[#34d399] outline-none transition-all text-white"
                placeholder="e.g. CTO"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Node Affiliation</label>
              <input 
                type="text" required
                value={form.company}
                onChange={e => setForm({...form, company: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 focus:ring-[#34d399] outline-none transition-all text-white"
                placeholder="Company"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Organization Asset (Logo URL)</label>
            <input 
              type="text"
              value={form.company_logo}
              onChange={e => setForm({...form, company_logo: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs focus:ring-2 focus:ring-[#34d399] outline-none transition-all text-white font-mono"
              placeholder="https://asset-node.com/logo.svg"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Satisfaction Matrix (1-5)</label>
              <input 
                type="number" min="1" max="5"
                value={form.rating || 5}
                onChange={e => setForm({...form, rating: parseInt(e.target.value)})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 focus:ring-[#34d399] outline-none transition-all text-white font-bold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Origin Node</label>
              <select 
                value={form.source || 'Direct'}
                onChange={e => setForm({...form, source: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 focus:ring-[#34d399] outline-none transition-all text-white appearance-none"
              >
                <option value="Direct" className="bg-[#0a0a0a]">Direct Transmission</option>
                <option value="App Store" className="bg-[#0a0a0a]">Apple Ecosystem</option>
                <option value="Google Play" className="bg-[#0a0a0a]">Android Network</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4 py-4">
             <label className="flex items-center gap-4 cursor-pointer group">
                <div className={`w-14 h-7 rounded-full p-1 transition-all duration-500 ${form.featured ? 'bg-[#34d399]' : 'bg-white/10 border border-white/10'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-500 transform ${form.featured ? 'translate-x-7' : 'translate-x-0'}`} />
                </div>
                <input 
                    type="checkbox"
                    className="hidden"
                    checked={form.featured || false}
                    onChange={e => setForm({...form, featured: e.target.checked})}
                />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 group-hover:text-[#34d399] transition-colors">Elite Hero Highlight</span>
             </label>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Testimonial Manuscript</label>
            <textarea 
              value={form.quote}
              onChange={e => setForm({...form, quote: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 focus:ring-2 focus:ring-[#34d399] outline-none transition-all h-40 text-white leading-relaxed font-serif italic"
              placeholder="Deploy the user narrative..."
            />
          </div>
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
          disabled={uploading || saving}
          className="bg-white text-[#0a0a0a] px-16 py-5 rounded-[2rem] font-black hover:bg-[#34d399] hover:text-white transition-all shadow-2xl disabled:opacity-50 flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] shrink-0 active:scale-95"
        >
          {(uploading || saving) ? <Loader2 className="animate-spin" size={24} /> : <Zap size={22} className="fill-current" />}
          {(uploading || saving) ? 'TRANSMITTING...' : 'COMMIT REVIEW'}
        </button>
      </div>
    </form>
  );
};
