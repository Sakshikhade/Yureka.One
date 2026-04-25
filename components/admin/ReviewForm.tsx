import React, { useRef } from 'react';
import { 
  Loader2, 
  Upload, 
  Image as ImageIcon,
  Check
} from 'lucide-react';

interface ReviewFormProps {
  form: any;
  setForm: (form: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
  saving: boolean;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  form,
  setForm,
  onSubmit,
  onFileUpload,
  uploading,
  saving
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">User Photo</label>
          <div className="relative aspect-square w-48 mx-auto bg-black/5 rounded-full overflow-hidden border-2 border-dashed border-black/10 group">
            {form.image ? (
              <img src={form.image} alt="Preview" className="w-full h-full object-cover grayscale" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-black/20">
                <ImageIcon size={32} />
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-cream text-black p-2 rounded-full hover:scale-110 transition-transform"
              >
                <Upload size={16} />
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
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Author Name</label>
            <input 
              type="text" required
              value={form.author}
              onChange={e => setForm({...form, author: e.target.value})}
              className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Role/Designation</label>
              <input 
                type="text" required
                value={form.role}
                onChange={e => setForm({...form, role: e.target.value})}
                className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Company</label>
              <input 
                type="text" required
                value={form.company}
                onChange={e => setForm({...form, company: e.target.value})}
                className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Company Logo URL</label>
            <div className="flex gap-2">
              <input 
                type="text"
                value={form.company_logo}
                onChange={e => setForm({...form, company_logo: e.target.value})}
                className="flex-1 bg-black/5 border-none rounded-xl p-4 text-xs focus:ring-2 focus:ring-teal outline-none transition-all"
                placeholder="https://example.com/logo.png"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Rating (1-5)</label>
              <input 
                type="number" min="1" max="5"
                value={form.rating || 5}
                onChange={e => setForm({...form, rating: parseInt(e.target.value)})}
                className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Source</label>
              <select 
                value={form.source || 'Direct'}
                onChange={e => setForm({...form, source: e.target.value})}
                className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all"
              >
                <option value="Direct">Direct</option>
                <option value="App Store">App Store</option>
                <option value="Google Play">Google Play</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4 py-4">
             <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-12 h-6 rounded-full p-1 transition-all ${form.featured ? 'bg-[#047857]' : 'bg-black/10'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full transition-all ${form.featured ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
                <input 
                    type="checkbox"
                    className="hidden"
                    checked={form.featured || false}
                    onChange={e => setForm({...form, featured: e.target.checked})}
                />
                <span className="text-xs font-bold uppercase tracking-widest text-black/40 group-hover:text-black transition-colors">Featured Hero Story</span>
             </label>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Quote / Content</label>
            <textarea 
              required
              value={form.quote}
              onChange={e => setForm({...form, quote: e.target.value})}
              className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all h-32"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end pt-8 border-t border-black/5">
        <button 
          type="submit" 
          disabled={uploading || saving}
          className="bg-[#047857] text-cream px-10 py-4 rounded-xl font-bold hover:bg-[#047857]/90 transition-all shadow-lg disabled:opacity-50 flex items-center gap-2"
        >
          {(uploading || saving) ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
          Save Review
        </button>
      </div>
    </form>
  );
};
