import React, { useRef } from 'react';
import { 
  X, 
  Loader2, 
  Upload, 
  Image as ImageIcon,
  Settings,
  Clock,
  Zap,
  Check,
  Bold,
  Italic,
  Underline,
  Link as LinkIcon,
  Type
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

  const insertMarkdown = (field: 'content' | 'excerpt', type: string) => {
    const textarea = document.getElementById(`blog-${field}`) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const selected = text.substring(start, end);
    const after = text.substring(end);

    let newText = text;
    let cursorOffset = 0;

    switch (type) {
      case 'bold':
        newText = `${before}**${selected || 'bold text'}**${after}`;
        cursorOffset = selected ? 0 : 2;
        break;
      case 'italic':
        newText = `${before}_${selected || 'italic text'}_${after}`;
        cursorOffset = selected ? 0 : 1;
        break;
      case 'underline':
        newText = `${before}<u>${selected || 'underlined text'}</u>${after}`;
        cursorOffset = selected ? 0 : 3;
        break;
      case 'link':
        newText = `${before}[${selected || 'link text'}](https://example.com)${after}`;
        cursorOffset = selected ? 0 : 1;
        break;
      case 'h1':
        newText = `${before}\n# ${selected || 'Heading 1'}\n${after}`;
        break;
      case 'h2':
        newText = `${before}\n## ${selected || 'Heading 2'}\n${after}`;
        break;
    }

    setForm({ ...form, [field]: newText });
    
    // Focus back and set cursor
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + (selected ? newText.length - text.length : cursorOffset);
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const Toolbar = ({ field }: { field: 'content' | 'excerpt' }) => (
    <div className="flex items-center gap-1 mb-2 bg-black/5 p-1.5 rounded-lg border border-black/5 w-fit">
      <button type="button" onClick={() => insertMarkdown(field, 'bold')} className="p-1.5 hover:bg-white rounded transition-colors" title="Bold"><Bold size={14}/></button>
      <button type="button" onClick={() => insertMarkdown(field, 'italic')} className="p-1.5 hover:bg-white rounded transition-colors" title="Italic"><Italic size={14}/></button>
      <button type="button" onClick={() => insertMarkdown(field, 'underline')} className="p-1.5 hover:bg-white rounded transition-colors" title="Underline"><Underline size={14}/></button>
      <div className="w-px h-4 bg-black/10 mx-1" />
      <button type="button" onClick={() => insertMarkdown(field, 'link')} className="p-1.5 hover:bg-white rounded transition-colors" title="Add Link"><LinkIcon size={14}/></button>
      <button type="button" onClick={() => insertMarkdown(field, 'h1')} className="p-1.5 hover:bg-white rounded transition-colors" title="Heading 1"><Type size={14}/><span className="text-[8px] font-bold">1</span></button>
      <button type="button" onClick={() => insertMarkdown(field, 'h2')} className="p-1.5 hover:bg-white rounded transition-colors" title="Heading 2"><Type size={14}/><span className="text-[8px] font-bold">2</span></button>
    </div>
  );


  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Title</label>
            <input 
              type="text" 
              required
              value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
              className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Slug (URL Configuration)</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="auto-generated-from-title"
                value={form.slug}
                onChange={e => setForm({...form, slug: e.target.value})}
                className="flex-1 bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all"
              />
              <button 
                type="button"
                onClick={() => setForm({...form, slug: form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')})}
                className="px-4 bg-black/5 rounded-xl hover:bg-black/10 transition-colors"
                title="Regenerate slug"
              >
                <Settings size={18} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Author</label>
              <input 
                type="text" 
                required
                value={form.author}
                onChange={e => setForm({...form, author: e.target.value})}
                className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Category</label>
              <select 
                value={form.category}
                onChange={e => setForm({...form, category: e.target.value})}
                className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all"
              >
                <option>Credit Cards</option>
                <option>Finance</option>
                <option>Lifestyle</option>
                <option>Technology</option>
                <option>Savings</option>
                <option>Fintech</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Publishing Strategy</label>
            <div className="flex bg-black/5 rounded-xl p-1 mb-4">
              <button
                type="button"
                onClick={() => setForm({ ...form, publishMode: 'now' })}
                className={`flex-[1] py-3 text-sm font-bold rounded-lg transition-all ${form.publishMode === 'now' ? 'bg-white text-teal shadow-sm' : 'text-black/40 hover:text-black/60'}`}
              >
                Post Now
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, publishMode: 'later' })}
                className={`flex-[1] flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-lg transition-all ${form.publishMode === 'later' ? 'bg-white text-teal shadow-sm' : 'text-black/40 hover:text-black/60'}`}
              >
                <Clock size={16} /> Schedule
              </button>
            </div>
            
            {form.publishMode === 'later' && (
              <div className="animate-fade-in">
                <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Release Date & Time</label>
                <input 
                  type="datetime-local" 
                  value={form.scheduled_at}
                  onChange={e => setForm({...form, scheduled_at: e.target.value})}
                  className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all font-bold text-black"
                  required={form.publishMode === 'later'}
                />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Cover Image</label>
          <div className="relative aspect-video rounded-xl overflow-hidden bg-black/5 border-2 border-dashed border-black/10 group">
            {form.image ? (
              <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-black/20">
                <ImageIcon size={48} />
                <p className="text-xs font-bold uppercase tracking-widest mt-2">No Image Selected</p>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-white text-black p-3 rounded-full hover:scale-110 transition-transform"
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
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Excerpt</label>
        <Toolbar field="excerpt" />
        <textarea 
          id="blog-excerpt"
          required
          value={form.excerpt}
          onChange={e => setForm({...form, excerpt: e.target.value})}
          className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all h-24 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Content (Markdown)</label>
        <Toolbar field="content" />
        <textarea 
          id="blog-content"
          required
          value={form.content}
          onChange={e => setForm({...form, content: e.target.value})}
          className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all h-64 font-mono text-sm leading-relaxed"
        />
      </div>

      
      <div className="flex justify-end pt-4 border-t border-black/5">
        <button 
          type="submit" 
          disabled={uploading || saving}
          className="bg-teal text-white px-10 py-4 rounded-xl font-bold hover:bg-teal/90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {(uploading || saving) ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
          {saving ? 'Saving...' : 'Save Blog Post'}
        </button>
      </div>
    </form>
  );
};
