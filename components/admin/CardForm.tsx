import React, { useRef } from 'react';
import { 
  X, 
  Loader2, 
  Upload, 
  Image as ImageIcon,
  Check,
  Plus,
  Trash2,
  Zap,
  Sparkles
} from 'lucide-react';

interface CardFormProps {
  form: any;
  setForm: (form: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
  saving: boolean;
  banks: string[];
  categories: string[];
  generateSlug: (name: string, bank: string) => string;
}

export const CardForm: React.FC<CardFormProps> = ({
  form,
  setForm,
  onSubmit,
  onFileUpload,
  uploading,
  saving,
  banks,
  categories,
  generateSlug
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Card Name</label>
              <input 
                type="text" 
                required
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Bank</label>
              <select
                required
                value={form.bank}
                onChange={e => setForm({...form, bank: e.target.value, issuer: e.target.value})}
                className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all"
              >
                <option value="">— Select —</option>
                {banks.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2 flex items-center justify-between">
                  Slug 
                  <button type="button" onClick={() => setForm({...form, slug: generateSlug(form.name, form.bank)})} className="text-[9px] text-teal hover:underline">Auto-Generate</button>
              </label>
              <input 
                  type="text" 
                  value={form.slug || ''}
                  onChange={e => setForm({...form, slug: e.target.value})}
                  className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all"
              />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Issuer</label>
              <input 
                type="text" 
                required
                value={form.issuer}
                onChange={e => setForm({...form, issuer: e.target.value})}
                className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Rating</label>
              <input 
                type="number" step="0.1" min="0" max="5" required
                value={form.rating}
                onChange={e => setForm({...form, rating: parseFloat(e.target.value)})}
                className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-teal mb-2">Elite</label>
              <input 
                type="number" step="0.1" min="0" max="5" required
                value={form.elite_rating}
                onChange={e => setForm({...form, elite_rating: parseFloat(e.target.value)})}
                className="w-full bg-teal/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all text-teal font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Primary Category</label>
              <select
                required
                value={form.category}
                onChange={e => setForm({...form, category: e.target.value})}
                className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all"
              >
                <option value="">— Select —</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Rewards Rate</label>
                <input 
                    type="text" 
                    placeholder="e.g. 5% or 10X"
                    value={form.rewards_rate || ''}
                    onChange={e => setForm({...form, rewards_rate: e.target.value})}
                    className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all"
                />
            </div>
          </div>
        </div>


        <div className="space-y-6">
          <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Card Image</label>
          <div className="relative aspect-[1.6/1] rounded-xl overflow-hidden bg-black/5 border-2 border-dashed border-black/10 group">
            {form.image ? (
              <img src={form.image} alt="Preview" className="w-full h-full object-contain p-4" />
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Annual Fee</label>
          <input type="text" required value={form.annual_fee} onChange={e => setForm({...form, annual_fee: e.target.value})} className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Joining Fee</label>
          <input type="text" required value={form.joining_fee} onChange={e => setForm({...form, joining_fee: e.target.value})} className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-teal mb-2">Introductory Offer</label>
          <input 
            type="text" 
            placeholder="e.g. 50,000 Bonus Points"
            value={form.intro_offer || ''} 
            onChange={e => setForm({...form, intro_offer: e.target.value})} 
            className="w-full bg-teal/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all font-medium text-teal" 
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Est. Savings</label>
          <input type="text" placeholder="e.g. ₹15,000/yr" value={form.projected_savings} onChange={e => setForm({...form, projected_savings: e.target.value})} className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Best For (Use Case)</label>
            <input 
              type="text" 
              placeholder="e.g. Dining & Shopping"
              value={form.best_for || ''}
              onChange={e => setForm({...form, best_for: e.target.value})}
              className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all"
            />
        </div>
        <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Redirection Link (Apply Link)</label>
            <input 
              type="url" 
              placeholder="https://..."
              value={form.apply_link || ''}
              onChange={e => setForm({...form, apply_link: e.target.value})}
              className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all"
            />
        </div>
      </div>



      <div className="space-y-8 pt-8 border-t border-black/5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-4">Benefits Portfolio</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(form.benefit_items || []).map((benefit: any, idx: number) => (
                <div key={idx} className="flex items-start gap-4 bg-black/5 p-4 rounded-xl relative group/item">
                  <div className="flex-1 space-y-3">
                      <input 
                        type="text" placeholder="Heading" required
                        value={benefit?.heading || ''}
                        onChange={e => {
                            const newItems = [...(form.benefit_items || [])];
                            newItems[idx] = { ...newItems[idx], heading: e.target.value };
                            setForm({...form, benefit_items: newItems, benefits: newItems.map(i => i.heading || '')});
                        }}
                        className="w-full bg-white border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-teal outline-none"
                      />
                      <input 
                        type="text" placeholder="Subheading" required
                        value={benefit?.subheading || ''}
                        onChange={e => {
                            const newItems = [...(form.benefit_items || [])];
                            newItems[idx] = { ...newItems[idx], subheading: e.target.value };
                            setForm({...form, benefit_items: newItems});
                        }}
                        className="w-full bg-transparent border border-black/10 rounded-lg p-3 text-xs focus:ring-2 focus:ring-teal outline-none"
                      />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => {
                      const newItems = (form.benefit_items || []).filter((_: any, i: number) => i !== idx);
                      setForm({...form, benefit_items: newItems, benefits: newItems.map((i: any) => i.heading || '')});
                    }} 
                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button 
                type="button" 
                onClick={() => setForm({...form, benefit_items: [...(form.benefit_items || []), {heading: '', subheading: ''}]})} 
                className="flex flex-col items-center justify-center border-2 border-dashed border-black/10 rounded-xl p-6 hover:border-teal/50 transition-all group"
              >
                  <Plus className="text-black/20 group-hover:text-teal mb-2" />
                  <span className="text-teal font-bold text-[10px] uppercase tracking-widest">Add Benefit</span>
              </button>
          </div>
        </div>

        <div>
            <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-black/40">Editorial Verdict</label>
                <button 
                  type="button"
                  onClick={async () => {
                    const btn = document.getElementById('ai-verdict-btn');
                    if (btn) btn.classList.add('animate-pulse');
                    try {
                      const benefitsText = form.benefit_items.map((b: any) => `${b.heading}: ${b.subheading}`).join('\n');
                      const prompt = `Act as a senior financial analyst. Summarize this credit card into a sharp, 3-sentence editorial verdict. 
                      Card Name: ${form.name}
                      Bank: ${form.bank}
                      Category: ${form.category}
                      Fees: ${form.annual_fee} (Annual), ${form.joining_fee} (Joining)
                      Intro Offer: ${form.intro_offer}
                      Benefits:
                      ${benefitsText}
                      
                      Focus on value proposition and who should get it. Keep it premium and concise.`;

                      // Gemini API call logic
                      const API_KEY = (import.meta as any).env.VITE_GEMINI_API_KEY;
                      if (!API_KEY) throw new Error("VITE_GEMINI_API_KEY missing");
                      
                      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
                        method: 'POST',
                        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
                      });
                      const result = await response.json();
                      const summary = result.candidates[0].content.parts[0].text;
                      setForm({...form, verdict: summary.trim()});
                    } catch (err: any) {
                      alert(`AI Error: ${err.message}. Please ensure VITE_GEMINI_API_KEY is in your .env`);
                    } finally {
                      if (btn) btn.classList.remove('animate-pulse');
                    }
                  }}
                  id="ai-verdict-btn"
                  className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-teal bg-teal/5 px-3 py-1.5 rounded-full hover:bg-teal/10 transition-all border border-teal/10"
                >
                  <Zap size={10} fill="currentColor" />
                  Magic Summarize
                </button>
            </div>
            <textarea 
              value={form.verdict || ''}
              onChange={e => setForm({...form, verdict: e.target.value})}
              className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all h-32 text-sm leading-relaxed"
              placeholder="Generate with AI or type your professional verdict here..."
            />
        </div>
      </div>
      
      <div className="flex justify-end pt-8 border-t border-black/5">
        <button 
          type="submit" 
          disabled={uploading || saving}
          className="bg-teal text-white px-10 py-4 rounded-xl font-bold hover:bg-teal/90 transition-all shadow-lg disabled:opacity-50 flex items-center gap-2"
        >
          {(uploading || saving) ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
          Save Card
        </button>
      </div>
    </form>
  );
};
