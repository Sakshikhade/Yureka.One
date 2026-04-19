import React, { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
  Type,
  Eye,
  Edit3,
  List,
  Sparkles,
  AlignLeft
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
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [excerptMode, setExcerptMode] = useState<'edit' | 'preview'>('edit');

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
        const url = window.prompt('Enter URL:', 'https://');
        if (!url) return;
        newText = `${before}[${selected || 'link text'}](${url})${after}`;
        break;
      case 'h1':
        newText = `${before}\n# ${selected || 'Heading 1'}\n${after}`;
        break;
      case 'h2':
        newText = `${before}\n## ${selected || 'Heading 2'}\n${after}`;
        break;
      case 'bullet':
        newText = `${before}\n- ${selected || 'List item'}\n${after}`;
        break;
    }

    setForm({ ...form, [field]: newText });
    
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + (selected ? newText.length - text.length : cursorOffset);
      if (textarea.setSelectionRange) textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const aiSmartFormat = (field: 'content' | 'excerpt') => {
    let text = form[field];
    if (!text) return;

    // AI Heuristic Formatting logic
    // 1. Fix "Squashed Text" (missing spaces after punctuation)
    text = text.replace(/([.!?])([A-Z])/g, '$1 $2'); // Space after terminal punctuation
    text = text.replace(/([:])([a-zA-Z])/g, '$1 $2'); // Space after colons
    
    // 2. Fix paragraph spacing
    text = text.replace(/\n{3,}/g, '\n\n');
    
    // 3. Identify potential headings
    const lines = text.split('\n');
    const formattedLines = lines.map((line: string) => {
      const trimmed = line.trim();
      if (trimmed.length > 5 && trimmed.length < 60 && !trimmed.endsWith('.') && !trimmed.startsWith('#') && !trimmed.startsWith('-') && !trimmed.startsWith('**')) {
        return `## ${trimmed}`;
      }
      return line;
    });

    let result = formattedLines.join('\n');
    setForm({ ...form, [field]: result });
  };

  const Toolbar = ({ field }: { field: 'content' | 'excerpt' }) => (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
      <div className="flex items-center gap-1 bg-black/5 p-1 rounded-xl border border-black/5">
        <button type="button" onClick={() => insertMarkdown(field, 'bold')} className="p-2 hover:bg-white rounded-lg transition-colors text-black/60" title="Bold"><Bold size={14}/></button>
        <button type="button" onClick={() => insertMarkdown(field, 'italic')} className="p-2 hover:bg-white rounded-lg transition-colors text-black/60" title="Italic"><Italic size={14}/></button>
        <div className="w-px h-4 bg-black/10 mx-1" />
        <button type="button" onClick={() => insertMarkdown(field, 'link')} className="p-2 hover:bg-white rounded-lg transition-colors text-black/60" title="Add Link"><LinkIcon size={14}/></button>
        <button type="button" onClick={() => insertMarkdown(field, 'h2')} className="p-2 hover:bg-white rounded-lg transition-colors text-black/60" title="Heading"><Type size={14}/></button>
        <button type="button" onClick={() => insertMarkdown(field, 'bullet')} className="p-2 hover:bg-white rounded-lg transition-colors text-black/60" title="List"><List size={14}/></button>
      </div>

      <button 
        type="button" 
        onClick={() => aiSmartFormat(field)}
        className="flex items-center gap-2 px-4 py-2 bg-teal/10 hover:bg-teal text-teal hover:text-white rounded-xl transition-all font-bold text-[10px] uppercase tracking-widest border border-teal/20"
      >
        <Sparkles size={14} className="animate-pulse" />
        AI Smart Format
      </button>
    </div>
  );


  return (
    <form onSubmit={onSubmit} className="max-w-[1400px] mx-auto">
      {/* Header Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-black/30 mb-2">Primary Title</label>
            <input 
              type="text" 
              required
              value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
              className="w-full bg-slate-50 border border-black/5 rounded-2xl p-6 focus:ring-2 focus:ring-teal outline-none transition-all font-serif text-2xl placeholder:text-black/10"
              placeholder="The Hidden Currency..."
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-black/30 mb-2">Byline/Author</label>
            <input 
              type="text" 
              required
              value={form.author}
              onChange={e => setForm({...form, author: e.target.value})}
              className="w-full bg-slate-50 border border-black/5 rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-black/30 mb-2">Category Taxonomy</label>
            <select 
              value={form.category}
              onChange={e => setForm({...form, category: e.target.value})}
              className="w-full bg-slate-50 border border-black/5 rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none appearance-none font-bold"
            >
              <option>Credit Cards</option>
              <option>Finance</option>
              <option>Lifestyle</option>
              <option>Technology</option>
              <option>Savings</option>
              <option>Fintech</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-black/30 mb-2">Permalinks (Slug)</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={form.slug}
                onChange={e => setForm({...form, slug: e.target.value})}
                className="flex-1 bg-slate-50 border border-black/5 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-teal outline-none"
                placeholder="auto-slug"
              />
              <button 
                type="button"
                onClick={() => setForm({...form, slug: form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')})}
                className="p-3 bg-black text-white rounded-xl hover:bg-teal transition-colors shadow-sm"
              >
                <Settings size={18} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-black/30 mb-2">Visibility</label>
            <select 
              value={form.publishMode}
              onChange={e => setForm({...form, publishMode: e.target.value})}
              className="w-full bg-slate-50 border border-black/5 rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none font-bold"
            >
              <option value="now">Immediate Publish</option>
              <option value="later">Scheduled Release</option>
            </select>
          </div>
        </div>

        <div className="lg:col-span-4">
          <label className="block text-[10px] font-black uppercase tracking-widest text-black/30 mb-2">Visual Heritage (Hero)</label>
          <div className="relative aspect-video rounded-[2rem] overflow-hidden bg-slate-50 border-2 border-dashed border-black/5 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            {form.image ? (
              <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-black/10">
                <ImageIcon size={48} />
                <p className="text-[10px] font-bold uppercase tracking-widest mt-2">Upload Journal Cover</p>
              </div>
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
              <Upload size={32} className="mb-2" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Replace Imagery</span>
            </div>
          </div>
          <input type="file" ref={fileInputRef} onChange={onFileUpload} className="hidden" accept="image/*" />
        </div>
      </div>

      {/* Side-by-Side Excerpt Editor */}
      <div className="mb-12">
        <label className="block text-[10px] font-black uppercase tracking-widest text-black/30 mb-4">Editorial Abstract</label>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-fit">
          <div className="space-y-4">
            <Toolbar field="excerpt" />
            <textarea 
              id="blog-excerpt"
              required
              value={form.excerpt}
              onChange={e => setForm({...form, excerpt: e.target.value})}
              className="w-full bg-slate-50 border border-black/5 rounded-3xl p-8 focus:ring-2 focus:ring-teal outline-none transition-all h-48 text-lg font-serif italic leading-relaxed"
              placeholder="Paste your Gemini excerpt here..."
            />
          </div>
          <div className="hidden xl:block bg-cream/30 border border-clay/10 rounded-3xl p-10 overflow-y-auto max-h-48 shadow-inner">
             <div className="text-xl italic text-ink/60 border-l-4 border-clay pl-6 prose prose-ink max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{form.excerpt || '*Drafting abstract...*'}</ReactMarkdown>
             </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Content Editor (The Hub) */}
      <div className="mb-12">
        <label className="block text-[10px] font-black uppercase tracking-widest text-black/30 mb-4">Manuscript Body</label>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-0 border border-black/5 rounded-[3rem] overflow-hidden shadow-2xl bg-white min-h-[70vh]">
          {/* Editor Pane */}
          <div className="p-8 md:p-12 border-b xl:border-b-0 xl:border-r border-black/5 bg-slate-50/30">
            <Toolbar field="content" />
            <textarea 
              id="blog-content"
              required
              value={form.content}
              onChange={e => setForm({...form, content: e.target.value})}
              className="w-full h-[calc(100%-4rem)] bg-transparent border-none focus:ring-0 outline-none text-base font-mono leading-loose placeholder:text-black/5 resize-none"
              placeholder="Start the journal story..."
            />
          </div>
          
          {/* Live Preview Pane */}
          <div className="p-8 md:p-12 overflow-y-auto max-h-[70vh] custom-scrollbar bg-white">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-black/5">
              <Eye size={16} className="text-teal" />
              <span className="text-[10px] font-black uppercase tracking-widest text-teal">Live Editorial Preview</span>
            </div>
            <article className="prose prose-ink prose-lg max-w-none prose-serif">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{form.content || '# The Canvas is Ready\nStart writing in the left pane to see your story come alive.'}</ReactMarkdown>
            </article>
          </div>
        </div>
      </div>

      <div className="flex justify-center md:justify-end pb-20">
        <button 
          type="submit" 
          disabled={uploading || saving}
          className="w-full md:w-auto bg-ink text-white px-20 py-6 rounded-full font-bold hover:bg-clay transition-all shadow-2xl disabled:opacity-50 flex items-center justify-center gap-4 active:scale-95 text-[10px] uppercase tracking-[0.3em]"
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} className="fill-clay" />}
          {saving ? 'Transmitting...' : 'Commit to Journal'}
        </button>
      </div>
    </form>
  );
};
