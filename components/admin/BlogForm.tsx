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
    // 1. Fix spacing between paragraphs
    text = text.replace(/\n{3,}/g, '\n\n');
    
    // 2. Identify potential headings (short lines without period at end)
    const lines = text.split('\n');
    const formattedLines = lines.map((line: string) => {
      const trimmed = line.trim();
      if (trimmed.length > 5 && trimmed.length < 50 && !trimmed.endsWith('.') && !trimmed.startsWith('#') && !trimmed.startsWith('-')) {
        return `## ${trimmed}`;
      }
      return line;
    });

    // 3. Auto-bold financial terms
    let result = formattedLines.join('\n');
    const terms = ['Credit Card', 'Rewards', 'Cashback', 'Annual Fee', 'Yureka', 'Interest Rate', 'APR'];
    terms.forEach(term => {
      const reg = new RegExp(`\\b${term}\\b`, 'gi');
      result = result.replace(reg, `**${term}**`);
    });

    setForm({ ...form, [field]: result });
  };

  const Toolbar = ({ field, mode, setMode }: { field: 'content' | 'excerpt', mode: string, setMode: (m: any) => void }) => (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-1 bg-black/5 p-1 rounded-xl border border-black/5">
        <button 
          type="button" 
          onClick={() => setMode('edit')}
          className={`p-2 flex items-center gap-2 rounded-lg transition-all ${mode === 'edit' ? 'bg-white text-teal shadow-sm' : 'text-black/40 hover:text-black'}`}
        >
          <Edit3 size={14}/>
          <span className="text-[10px] font-bold uppercase tracking-widest">Write</span>
        </button>
        <button 
          type="button" 
          onClick={() => setMode('preview')}
          className={`p-2 flex items-center gap-2 rounded-lg transition-all ${mode === 'preview' ? 'bg-white text-teal shadow-sm' : 'text-black/40 hover:text-black'}`}
        >
          <Eye size={14}/>
          <span className="text-[10px] font-bold uppercase tracking-widest">Preview</span>
        </button>
      </div>

      {mode === 'edit' && (
        <div className="flex items-center gap-1 bg-black/5 p-1 rounded-xl border border-black/5">
          <button type="button" onClick={() => insertMarkdown(field, 'bold')} className="p-2 hover:bg-white rounded-lg transition-colors text-black/60" title="Bold"><Bold size={14}/></button>
          <button type="button" onClick={() => insertMarkdown(field, 'italic')} className="p-2 hover:bg-white rounded-lg transition-colors text-black/60" title="Italic"><Italic size={14}/></button>
          <div className="w-px h-4 bg-black/10 mx-1" />
          <button type="button" onClick={() => insertMarkdown(field, 'link')} className="p-2 hover:bg-white rounded-lg transition-colors text-black/60" title="Add Link"><LinkIcon size={14}/></button>
          <button type="button" onClick={() => insertMarkdown(field, 'h2')} className="p-2 hover:bg-white rounded-lg transition-colors text-black/60" title="Heading"><Type size={14}/></button>
          <button type="button" onClick={() => insertMarkdown(field, 'bullet')} className="p-2 hover:bg-white rounded-lg transition-colors text-black/60" title="List"><List size={14}/></button>
          <div className="w-px h-4 bg-black/10 mx-1" />
          <button 
            type="button" 
            onClick={() => aiSmartFormat(field)}
            className="p-2 hover:bg-teal hover:text-white rounded-lg transition-all text-teal animate-pulse" 
            title="AI Smart Format"
          >
            <Sparkles size={14}/>
          </button>
        </div>
      )}
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
              className="w-full bg-black/5 border-none rounded-2xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all font-serif text-lg"
              placeholder="The future of credit..."
            />
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
                className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all appearance-none"
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">URL Identifier (Slug)</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={form.slug}
                  onChange={e => setForm({...form, slug: e.target.value})}
                  className="flex-1 bg-black/5 border-none rounded-xl px-4 py-2 text-xs focus:ring-1 focus:ring-teal outline-none"
                  placeholder="auto-slug"
                />
                 <button 
                  type="button"
                  onClick={() => setForm({...form, slug: form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')})}
                  className="p-2 bg-black/5 rounded-lg hover:bg-black/10 transition-colors"
                >
                  <Settings size={14} />
                </button>
              </div>
            </div>
             <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Release</label>
              <select 
                value={form.publishMode}
                onChange={e => setForm({...form, publishMode: e.target.value})}
                className="w-full bg-black/5 border-none rounded-xl px-4 py-2 text-xs focus:ring-1 focus:ring-teal outline-none"
              >
                <option value="now">Immediate</option>
                <option value="later">Scheduled</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Cover Image</label>
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-black/5 border-2 border-dashed border-black/10 group">
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
                className="bg-white text-black p-4 rounded-full hover:scale-110 transition-transform shadow-xl"
              >
                <Upload size={24} />
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

      <div className="border-t border-black/5 pt-6">
        <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-3">Excerpt (Editorial Summary)</label>
        <Toolbar field="excerpt" mode={excerptMode} setMode={setExcerptMode} />
        {excerptMode === 'edit' ? (
          <textarea 
            id="blog-excerpt"
            required
            value={form.excerpt}
            onChange={e => setForm({...form, excerpt: e.target.value})}
            className="w-full bg-black/5 border-none rounded-2xl p-6 focus:ring-2 focus:ring-teal outline-none transition-all h-32 text-base leading-relaxed"
            placeholder="Write a compelling summary..."
          />
        ) : (
          <div className="w-full bg-slate-50 rounded-2xl p-8 min-h-[8rem] prose prose-sm prose-teal max-w-none border border-black/5 italic text-black/60">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{form.excerpt || '*No excerpt provided*'}</ReactMarkdown>
          </div>
        )}
      </div>

      <div className="border-t border-black/5 pt-6">
        <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-3">Story Content (Markdown)</label>
        <Toolbar field="content" mode={viewMode} setMode={setViewMode} />
        {viewMode === 'edit' ? (
          <textarea 
            id="blog-content"
            required
            value={form.content}
            onChange={e => setForm({...form, content: e.target.value})}
            className="w-full bg-black/5 border-none rounded-2xl p-8 focus:ring-2 focus:ring-teal outline-none transition-all h-[50vh] font-mono text-sm leading-loose"
            placeholder="Paste your Gemini content here and click the Sparkles button..."
          />
        ) : (
          <div className="w-full bg-white rounded-2xl p-10 min-h-[50vh] prose prose-teal max-w-none border-2 border-black/5 shadow-inner overflow-y-auto">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{form.content || '# Start Writing Your Masterpiece'}</ReactMarkdown>
          </div>
        )}
      </div>

      <div className="flex justify-end pt-8 border-t border-black/5 gap-4">
        <button 
          type="submit" 
          disabled={uploading || saving}
          className="bg-black text-white px-12 py-5 rounded-2xl font-bold hover:bg-teal transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 active:scale-95"
        >
          {(uploading || saving) ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} className="fill-current" />}
          {saving ? 'Transmitting...' : 'Publish to Journal'}
        </button>
      </div>
    </form>
  );
};

