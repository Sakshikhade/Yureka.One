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
      case 'link':
        const url = window.prompt('Enter URL:', 'https://');
        if (!url) return;
        newText = `${before}[${selected || 'link text'}](${url})${after}`;
        break;
      case 'h2':
        newText = `${before}\n## ${selected || 'Heading 2'}\n${after}`;
        break;
      case 'bullet':
        newText = `${before}\n- ${selected || 'List item'}\n${after}`;
        break;
      case 'number':
        newText = `${before}\n1. ${selected || 'List item'}\n${after}`;
        break;
      case 'alpha':
        newText = `${before}\nA. ${selected || 'List item'}\n${after}`;
        break;
      case 'roman':
        newText = `${before}\nI. ${selected || 'List item'}\n${after}`;
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
        <button type="button" onClick={() => insertMarkdown(field, 'bold')} className="p-2 hover:bg-cream rounded-lg transition-colors text-black/60" title="Bold"><Bold size={14}/></button>
        <button type="button" onClick={() => insertMarkdown(field, 'italic')} className="p-2 hover:bg-cream rounded-lg transition-colors text-black/60" title="Italic"><Italic size={14}/></button>
        <div className="w-px h-4 bg-black/10 mx-1" />
        <button type="button" onClick={() => insertMarkdown(field, 'link')} className="p-2 hover:bg-cream rounded-lg transition-colors text-black/60" title="Add Link"><LinkIcon size={14}/></button>
        <button type="button" onClick={() => insertMarkdown(field, 'h2')} className="p-2 hover:bg-cream rounded-lg transition-colors text-black/60" title="Heading"><Type size={14}/></button>
        
        {/* Advanced List Dropdown */}
        <div className="relative group">
          <button type="button" className="p-2 hover:bg-cream rounded-lg transition-colors text-black/60" title="Lists"><List size={14}/></button>
          <div className="absolute top-full left-0 mt-1 hidden group-hover:flex flex-col bg-cream border border-black/5 shadow-xl rounded-xl p-1 z-50 min-w-[120px]">
            <button type="button" onClick={() => insertMarkdown(field, 'bullet')} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-lg text-xs font-bold text-black/60">
              <div className="w-1.5 h-1.5 rounded-full bg-black/40" /> Bullets
            </button>
            <button type="button" onClick={() => insertMarkdown(field, 'number')} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-lg text-xs font-bold text-black/60">
              <span className="w-4">1.</span> Numbered
            </button>
            <button type="button" onClick={() => insertMarkdown(field, 'alpha')} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-lg text-xs font-bold text-black/60">
              <span className="w-4">A.</span> Alpha
            </button>
            <button type="button" onClick={() => insertMarkdown(field, 'roman')} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-lg text-xs font-bold text-black/60">
              <span className="w-4">I.</span> Roman
            </button>
          </div>
        </div>
      </div>

      <button 
        type="button" 
        onClick={() => aiSmartFormat(field)}
        className="flex items-center gap-2 px-4 py-2 bg-teal/10 hover:bg-teal text-teal hover:text-cream rounded-xl transition-all font-bold text-[10px] uppercase tracking-widest border border-teal/20"
      >
        <Sparkles size={14} className="animate-pulse" />
        AI Smart Format
      </button>
    </div>
  );


  return (
    <form onSubmit={onSubmit} className="max-w-5xl mx-auto space-y-12 pb-20">
      {/* 1. THE EDITORIAL HEADER */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Cover Image - Sleek Portrait/Square aspect on side */}
          <div className="w-full md:w-1/3 aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-slate-50 border border-black/5 group relative cursor-pointer shadow-sm hover:shadow-xl transition-all" onClick={() => fileInputRef.current?.click()}>
            {form.image ? (
              <img src={form.image} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-black/20">
                <ImageIcon size={32} />
                <span className="text-[10px] font-bold uppercase tracking-widest mt-3">Add Imagery</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-cream">
              <Upload size={24} />
            </div>
          </div>

          {/* Primary Metadata */}
          <div className="flex-1 w-full space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-black/30 mb-2">Headline</label>
              <input 
                type="text" 
                required
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
                className="w-full bg-slate-50 border-none rounded-2xl p-6 focus:ring-2 focus:ring-teal outline-none transition-all font-serif text-3xl placeholder:text-black/10 shadow-inner"
                placeholder="Story Title..."
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-black/30 mb-2">Author</label>
                <input 
                  type="text" 
                  value={form.author}
                  onChange={e => setForm({...form, author: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-teal outline-none shadow-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-black/30 mb-2">Category</label>
                <select 
                  value={form.category}
                  onChange={e => setForm({...form, category: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-teal outline-none shadow-sm font-bold appearance-none bg-no-repeat bg-[right_1rem_center]"
                >
                  <option>Credit Cards</option>
                  <option>Finance</option>
                  <option>Lifestyle</option>
                  <option>Technology</option>
                  <option>Savings</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 2. LOGISTICS BAR */}
        <div className="flex flex-wrap gap-4 p-4 bg-slate-50/50 rounded-2xl border border-black/5">
           <div className="flex-1 min-w-[200px]">
              <label className="block text-[9px] font-black uppercase tracking-widest text-black/30 mb-1.5 ml-1">URL / Slug</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={form.slug}
                  onChange={e => setForm({...form, slug: e.target.value})}
                  className="flex-1 bg-cream border border-black/5 rounded-lg px-3 py-2 text-[11px] focus:ring-1 focus:ring-teal outline-none font-mono"
                  placeholder="auto-generated"
                />
                <button 
                  type="button"
                  onClick={() => setForm({...form, slug: form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')})}
                  className="p-2 bg-black text-cream rounded-lg hover:bg-teal transition-colors"
                >
                  <Settings size={14} />
                </button>
              </div>
           </div>
           <div className="w-full sm:w-auto min-w-[150px]">
              <label className="block text-[9px] font-black uppercase tracking-widest text-black/30 mb-1.5 ml-1">Distribution</label>
              <select 
                value={form.publishMode}
                onChange={e => setForm({...form, publishMode: e.target.value})}
                className="w-full bg-cream border border-black/5 rounded-lg px-3 py-2 text-[11px] focus:ring-1 focus:ring-teal outline-none font-bold"
              >
                <option value="now">Public Immediate</option>
                <option value="later">Scheduled Release</option>
              </select>
           </div>
        </div>
      </section>

      {/* 3. EDITORIAL ABSTRACT */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-black/5 pb-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-black/30">Editorial Abstract</label>
          <Toolbar field="excerpt" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <textarea 
            id="blog-excerpt"
            value={form.excerpt}
            onChange={e => setForm({...form, excerpt: e.target.value})}
            className="w-full bg-cream border border-black/5 rounded-2xl p-6 h-40 text-lg font-serif italic leading-relaxed focus:ring-0 outline-none resize-none shadow-sm"
            placeholder="Paste Gemini summary..."
          />
          <div className="bg-cream/20 rounded-2xl p-8 border border-clay/5 overflow-y-auto max-h-40">
             <div className="prose prose-sm prose-serif italic text-[#242424]/60 border-l-2 border-clay pl-4">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{form.excerpt || '*Awaiting draft...*'}</ReactMarkdown>
             </div>
          </div>
        </div>
      </section>

      {/* 4. MANUSCRIPT */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-black/5 pb-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-black/30">Master Manuscript</label>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[10px] text-teal font-bold uppercase tracking-widest animate-pulse">
               <Eye size={12} /> Live Render Active
            </div>
            <Toolbar field="content" />
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-0 border border-black/5 rounded-[2.5rem] overflow-hidden bg-cream shadow-2xl min-h-[60vh]">
          <div className="lg:w-1/2 p-8 bg-slate-50/50 border-r border-black/5">
            <textarea 
              id="blog-content"
              value={form.content}
              onChange={e => setForm({...form, content: e.target.value})}
              className="w-full h-full min-h-[40vh] bg-transparent border-none focus:ring-0 outline-none text-base font-mono leading-loose resize-none"
              placeholder="Start the journal story..."
            />
          </div>
          <div className="lg:w-1/2 p-8 md:p-12 overflow-y-auto max-h-[60vh] bg-cream custom-scrollbar">
            <article className="prose prose-ink prose-lg max-w-none prose-serif">
               <ReactMarkdown remarkPlugins={[remarkGfm]}>{form.content || '# The Journey Begins...'}</ReactMarkdown>
            </article>
          </div>
        </div>
      </section>

      {/* 5. COMMITMENT */}
      <div className="flex justify-between items-center pt-10 border-t border-black/5 mt-8">
        <div className="flex-1 pr-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-500 rounded-xl flex items-start gap-2 text-xs font-bold border border-red-100">
              <X size={14} className="mt-0.5 shrink-0" />
              <span className="leading-tight">{error}</span>
            </div>
          )}
        </div>
        <button 
          type="submit" 
          disabled={saving}
          className="bg-black text-cream px-16 py-5 rounded-full font-bold hover:bg-[#047857] transition-all shadow-2xl flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] shrink-0"
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Zap size={18} className="fill-clay" />}
          {saving ? 'Transmitting...' : 'Confirm Publication'}
        </button>
      </div>

      <input type="file" ref={fileInputRef} onChange={onFileUpload} className="hidden" accept="image/*" />
    </form>
  );
};
