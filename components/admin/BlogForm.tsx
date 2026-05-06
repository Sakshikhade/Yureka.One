import React, { useRef } from 'react';
import { 
  X, 
  Loader2, 
  Upload, 
  Image as ImageIcon,
  Settings,
  Zap,
  Link as LinkIcon,
  Sparkles
} from 'lucide-react';

interface BlogFormProps {
  form: any;
  setForm: (form: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
  saving: boolean;
  error: string | null;
}

export const BlogForm: React.FC<BlogFormProps> = ({
  form,
  setForm,
  onSubmit,
  onFileUpload,
  uploading,
  saving,
  error
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const autoGenerateSlug = () => {
    const slug = form.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setForm({ ...form, slug });
  };

  return (
    <form onSubmit={onSubmit} className="max-w-5xl mx-auto space-y-12 pb-20">
      {/* 1. THE EDITORIAL HEADER */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Cover Image */}
          <div 
            className="w-full md:w-1/3 aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-white/5 border border-white/5 group relative cursor-pointer shadow-sm hover:shadow-xl transition-all" 
            onClick={() => fileInputRef.current?.click()}
          >
            {form.image ? (
              <img src={form.image} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20">
                <ImageIcon size={32} />
                <span className="text-[10px] font-bold uppercase tracking-widest mt-3">Add Preview Image</span>
              </div>
            )}
            {uploading ? (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <Loader2 className="animate-spin text-clay" size={32} />
              </div>
            ) : (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Upload size={24} />
              </div>
            )}
          </div>

          {/* Primary Metadata */}
          <div className="flex-1 w-full space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Blog Heading</label>
              <input 
                type="text" 
                required
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
                onBlur={autoGenerateSlug}
                className="w-full bg-white/5 border-none rounded-2xl p-6 focus:ring-2 focus:ring-clay outline-none transition-all font-serif text-3xl placeholder:text-white/10 shadow-inner text-white"
                placeholder="The Future of Credit..."
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Author / Source</label>
                <input 
                  type="text" 
                  value={form.author}
                  onChange={e => setForm({...form, author: e.target.value})}
                  placeholder="Yureka Editorial"
                  className="w-full bg-white/5 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-clay outline-none shadow-sm text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Category</label>
                <select 
                  value={form.category}
                  onChange={e => setForm({...form, category: e.target.value})}
                  className="w-full bg-white/5 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-clay outline-none shadow-sm font-bold appearance-none bg-no-repeat bg-[right_1rem_center] text-white"
                >
                  <option className="bg-cream">Credit Cards</option>
                  <option className="bg-cream">Finance</option>
                  <option className="bg-cream">Lifestyle</option>
                  <option className="bg-cream">Technology</option>
                  <option className="bg-cream">Savings</option>
                  <option className="bg-cream">AI</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 2. EXTERNAL CONTENT LINK */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Remote Connection</label>
            <div className="flex items-center gap-2 text-[10px] text-clay font-bold uppercase tracking-widest">
               <LinkIcon size={12} /> External Blog Sync
            </div>
          </div>
          <div className="bg-white/5 rounded-[2.5rem] p-8 border border-white/5 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-clay/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-focus-within:bg-clay/10 transition-colors" />
            
            <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-4 ml-1">Paste Shareable Link (Blogger, Medium, etc.)</label>
            <div className="relative">
              <input 
                type="url" 
                required
                value={form.external_link}
                onChange={e => setForm({...form, external_link: e.target.value})}
                className="w-full bg-cream border border-white/10 rounded-2xl p-6 text-lg focus:ring-2 focus:ring-clay outline-none transition-all font-mono text-white placeholder:text-white/10 shadow-2xl"
                placeholder="https://yurekablogs.bloggers.com/my-article"
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-clay transition-colors">
                <Sparkles size={20} />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-8">
              <div className="flex-1 min-w-[240px]">
                <label className="block text-[9px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">URL Slug</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={form.slug}
                    onChange={e => setForm({...form, slug: e.target.value})}
                    className="flex-1 bg-cream/50 border border-white/10 rounded-lg px-4 py-3 text-xs focus:ring-1 focus:ring-clay outline-none font-mono text-white/60"
                    placeholder="auto-generated-slug"
                  />
                  <button 
                    type="button"
                    onClick={autoGenerateSlug}
                    className="p-3 bg-white/10 text-white rounded-lg hover:bg-clay hover:text-black transition-all border border-white/5"
                    title="Refresh Slug"
                  >
                    <Settings size={16} />
                  </button>
                </div>
              </div>
              
              <div className="w-full sm:w-auto min-w-[200px]">
                <label className="block text-[9px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Short Preview Excerpt (Optional)</label>
                <textarea 
                  value={form.excerpt}
                  onChange={e => setForm({...form, excerpt: e.target.value})}
                  className="w-full bg-cream/50 border border-white/10 rounded-lg px-4 py-2.5 text-xs focus:ring-1 focus:ring-clay outline-none font-serif italic text-white/60 resize-none h-[46px]"
                  placeholder="Brief summary for cards..."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. COMMITMENT */}
      <div className="flex justify-between items-center pt-10 border-t border-white/10 mt-8">
        <div className="flex-1 pr-4">
          {error && (
            <div className="p-4 bg-red-900/20 text-red-400 rounded-2xl flex items-start gap-3 text-xs font-bold border border-red-900/50 animate-shake">
              <X size={16} className="mt-0.5 shrink-0" />
              <span className="leading-tight">{error}</span>
            </div>
          )}
        </div>
        <button 
          type="submit" 
          disabled={saving || uploading}
          className="bg-white text-black px-16 py-6 rounded-full font-bold hover:bg-clay transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-4 text-[11px] uppercase tracking-[0.2em] shrink-0 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} className="fill-clay group-hover:scale-110 transition-transform" />}
          {saving ? 'Transmitting Data...' : 'Confirm & Publish Blog'}
        </button>
      </div>

      <input type="file" ref={fileInputRef} onChange={onFileUpload} className="hidden" accept="image/*" />
    </form>
  );
};
