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
  error?: string | null;
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
  generateSlug,
  error
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Card Designation</label>
              <input 
                type="text" 
                required
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-[#34d399] outline-none transition-all text-white placeholder:text-white/10"
                placeholder="Entity Name"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Financial Node</label>
              <select
                required
                value={form.bank}
                onChange={e => setForm({...form, bank: e.target.value, issuer: e.target.value})}
                className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-[#34d399] outline-none transition-all text-white appearance-none"
              >
                <option value="" className="bg-[#0a0a0a]">Select Issuer</option>
                {banks.map(b => (
                  <option key={b} value={b} className="bg-[#0a0a0a]">{b}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1 flex items-center justify-between">
                  Identification Slug 
                  <button type="button" onClick={() => setForm({...form, slug: generateSlug(form.name, form.bank)})} className="text-[9px] text-[#34d399] hover:underline uppercase font-black tracking-widest">Auto-Compute</button>
              </label>
              <input 
                  type="text" 
                  value={form.slug || ''}
                  onChange={e => setForm({...form, slug: e.target.value})}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-[#34d399] outline-none transition-all text-white font-mono text-xs"
                  placeholder="system-generated-slug"
              />
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Issuer Name</label>
              <input 
                type="text" 
                required
                value={form.issuer}
                onChange={e => setForm({...form, issuer: e.target.value})}
                className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-[#34d399] outline-none transition-all text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Standard Rating</label>
              <input 
                type="number" step="0.1" min="0" max="5"
                value={form.rating}
                onChange={e => setForm({...form, rating: parseFloat(e.target.value)})}
                className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-[#34d399] outline-none transition-all text-white font-bold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#34d399] mb-2 ml-1">Elite Alpha</label>
              <input 
                type="number" step="0.1" min="0" max="5"
                value={form.elite_rating}
                onChange={e => setForm({...form, elite_rating: parseFloat(e.target.value)})}
                className="w-full bg-[#34d399]/10 border border-[#34d399]/20 rounded-2xl p-4 focus:ring-2 focus:ring-[#34d399] outline-none transition-all text-[#34d399] font-black"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Core Classification</label>
              <select
                required
                value={form.category}
                onChange={e => setForm({...form, category: e.target.value})}
                className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-[#34d399] outline-none transition-all text-white appearance-none"
              >
                <option value="" className="bg-[#0a0a0a]">Select Sector</option>
                {categories.map(c => (
                  <option key={c} value={c} className="bg-[#0a0a0a]">{c}</option>
                ))}
              </select>
            </div>
            <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Yield Potential</label>
                <input 
                    type="text" 
                    placeholder="e.g. 5% Accelerator"
                    value={form.rewards_rate || ''}
                    onChange={e => setForm({...form, rewards_rate: e.target.value})}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-[#34d399] outline-none transition-all text-white"
                />
            </div>
          </div>
        </div>


        <div className="space-y-8">
          <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Visual Identity Asset</label>
          <div className="relative aspect-[1.6/1] rounded-[2rem] overflow-hidden bg-white/5 border-2 border-dashed border-white/10 group flex items-center justify-center">
            {form.image ? (
              <img src={form.image} alt="Preview" className="w-full h-full object-contain p-8 drop-shadow-2xl" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/10">
                <ImageIcon size={64} strokeWidth={1} />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] mt-4">Awaiting Asset Deployment</p>
              </div>
            )}
            <div className="absolute inset-0 bg-[#0a0a0a]/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-sm">
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-white text-[#0a0a0a] p-5 rounded-full hover:scale-110 transition-transform shadow-2xl active:scale-95"
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
          <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
            <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest leading-relaxed">Recommendation: Use high-fidelity PNG or SVG assets with transparent backgrounds for maximum elite aesthetic depth.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Annual Overhead</label>
          <input 
            type="text" 
            required 
            value={form.annual_fee} 
            onChange={e => setForm({...form, annual_fee: e.target.value.replace(/^₹/, '')})} 
            placeholder="Numerical value"
            className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-[#34d399] outline-none transition-all text-white font-bold" 
          />
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Onboarding Fee</label>
          <input 
            type="text" 
            required 
            value={form.joining_fee} 
            onChange={e => setForm({...form, joining_fee: e.target.value.replace(/^₹/, '')})} 
            placeholder="Numerical value"
            className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-[#34d399] outline-none transition-all text-white font-bold" 
          />
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-[#34d399] mb-2 ml-1">Intro Incentive</label>
          <input 
            type="text" 
            placeholder="Exclusive offer text"
            value={form.intro_offer || ''} 
            onChange={e => setForm({...form, intro_offer: e.target.value})} 
            className="w-full bg-[#34d399]/10 border border-[#34d399]/20 rounded-2xl p-4 focus:ring-2 focus:ring-[#34d399] outline-none transition-all font-black text-[#34d399] placeholder:text-[#34d399]/30" 
          />
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Alpha Savings</label>
          <input type="text" placeholder="Estimated ₹ yield" value={form.projected_savings} onChange={e => setForm({...form, projected_savings: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-[#34d399] outline-none transition-all text-white" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Optimal Utility Case</label>
            <input 
              type="text" 
              placeholder="e.g. High-Velocity Travel"
              value={form.best_for || ''}
              onChange={e => setForm({...form, best_for: e.target.value})}
              className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-[#34d399] outline-none transition-all text-white"
            />
        </div>
        <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Application Protocol Link</label>
            <input 
              type="text" 
              placeholder="https://external-node.com/..."
              value={form.apply_link || ''}
              onChange={e => setForm({...form, apply_link: e.target.value})}
              className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-[#34d399] outline-none transition-all text-white font-mono text-xs"
            />
        </div>
      </div>



      <div className="space-y-10 pt-10 border-t border-white/5">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-6 ml-1">Benefits Portfolio Architecture</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(form.benefit_items || []).map((benefit: any, idx: number) => (
                <div key={idx} className="flex items-start gap-4 bg-white/5 p-6 rounded-[2rem] relative group/item border border-white/5">
                  <div className="flex-1 space-y-4">
                      <input 
                        type="text" placeholder="Core Proposition"
                        value={benefit?.heading || ''}
                        onChange={e => {
                            const newItems = [...(form.benefit_items || [])];
                            newItems[idx] = { ...newItems[idx], heading: e.target.value };
                            setForm({...form, benefit_items: newItems, benefits: newItems.map(i => i.heading || '')});
                        }}
                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-3.5 text-sm font-black text-white focus:ring-2 focus:ring-[#34d399] outline-none placeholder:text-white/10"
                      />
                      <input 
                        type="text" placeholder="Technical Detail"
                        value={benefit?.subheading || ''}
                        onChange={e => {
                            const newItems = [...(form.benefit_items || [])];
                            newItems[idx] = { ...newItems[idx], subheading: e.target.value };
                            setForm({...form, benefit_items: newItems});
                        }}
                        className="w-full bg-transparent border border-white/5 rounded-xl p-3.5 text-xs text-white/50 focus:ring-2 focus:ring-[#34d399] outline-none placeholder:text-white/5"
                      />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => {
                      const newItems = (form.benefit_items || []).filter((_: any, i: number) => i !== idx);
                      setForm({...form, benefit_items: newItems, benefits: newItems.map((i: any) => i.heading || '')});
                    }} 
                    className="text-red-500 hover:bg-red-500/10 p-3 rounded-xl opacity-0 group-hover/item:opacity-100 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button 
                type="button" 
                onClick={() => setForm({...form, benefit_items: [...(form.benefit_items || []), {heading: '', subheading: ''}]})} 
                className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-[2rem] p-8 hover:border-[#34d399]/50 transition-all group hover:bg-[#34d399]/5"
              >
                  <Plus className="text-white/10 group-hover:text-[#34d399] mb-3 transition-colors" size={32} />
                  <span className="text-[#34d399] font-black text-[11px] uppercase tracking-[0.2em]">Deploy Benefit Node</span>
              </button>
          </div>
        </div>
      </div>

      {/* NEW: Review & Detailed Analysis Section */}
      <div className="space-y-10 pt-10 border-t border-white/5">
        <div className="bg-[#1a1a1a] p-10 rounded-[3rem] border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#34d399]/5 blur-[80px] rounded-full -mr-32 -mt-32" />
          
          <h3 className="text-sm font-black uppercase tracking-[0.3em] text-[#34d399] mb-10 flex items-center gap-3">
            <Sparkles size={20} className="animate-pulse" />
            Master Intelligence Analysis
          </h3>
          
          <div className="space-y-10 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Lead Analyst</label>
                <input 
                  type="text" 
                  value={form.author || ''}
                  onChange={e => setForm({...form, author: e.target.value})}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 text-sm text-white focus:ring-2 focus:ring-[#34d399] outline-none transition-all font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Asset Class Reward</label>
                <input 
                  type="text" 
                  value={form.reward_type || ''}
                  onChange={e => setForm({...form, reward_type: e.target.value})}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 text-sm text-white focus:ring-2 focus:ring-[#34d399] outline-none transition-all font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Executive Summary (Intel Core)</label>
              <textarea 
                value={form.description || ''}
                onChange={e => setForm({...form, description: e.target.value})}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 text-sm text-white/80 focus:ring-2 focus:ring-[#34d399] outline-none transition-all h-32 leading-relaxed font-serif italic"
                placeholder="Support Markdown formatting for high-fidelity technical reports..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Grid Benefits (Fixed 6) */}
              <div className="space-y-6">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#34d399] flex items-center gap-2">
                  <Check size={14} /> Yield Parameters
                </label>
                <div className="space-y-3">
                  {(form.grid_benefits || []).map((b: any, idx: number) => (
                    <div key={idx} className="flex gap-3">
                      <div className="w-1/3 bg-white/5 border border-white/5 rounded-xl p-3 text-[9px] font-black uppercase tracking-widest text-white/40 flex items-center">{b.title}</div>
                      <input 
                        type="text" 
                        value={b.value || ''} 
                        onChange={e => {
                          const next = [...form.grid_benefits];
                          next[idx].value = e.target.value;
                          setForm({...form, grid_benefits: next});
                        }}
                        className="w-2/3 bg-[#0a0a0a] border border-white/10 rounded-xl p-3 text-xs text-white font-bold focus:ring-1 focus:ring-[#34d399] outline-none" 
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Grid Fees (Fixed 6) */}
              <div className="space-y-6">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#34d399] flex items-center gap-2">
                  <Zap size={14} /> Protocol Fees
                </label>
                <div className="space-y-3">
                  {(form.grid_fees || []).map((f: any, idx: number) => (
                    <div key={idx} className="flex gap-3">
                      <div className="w-1/3 bg-white/5 border border-white/5 rounded-xl p-3 text-[9px] font-black uppercase tracking-widest text-white/40 flex items-center">{f.title}</div>
                      <input 
                        type="text" 
                        value={f.value || ''} 
                        onChange={e => {
                          const next = [...form.grid_fees];
                          next[idx].value = e.target.value;
                          setForm({...form, grid_fees: next});
                        }}
                        className="w-2/3 bg-[#0a0a0a] border border-white/10 rounded-xl p-3 text-xs text-white font-bold focus:ring-1 focus:ring-[#34d399] outline-none" 
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pros & Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#34d399]">Accelerator Assets (Pros)</label>
                  <button type="button" onClick={() => setForm({...form, pros: [...(form.pros || []), '']})} className="text-[#34d399] hover:scale-125 transition-transform"><Plus size={18} /></button>
                </div>
                <div className="space-y-3">
                  {(form.pros || []).map((p: string, i: number) => (
                    <div key={i} className="flex gap-3 group">
                      <input 
                        type="text" value={p} 
                        onChange={e => {
                          const next = [...form.pros];
                          next[i] = e.target.value;
                          setForm({...form, pros: next});
                        }}
                        className="flex-1 bg-[#0a0a0a] border border-[#34d399]/20 rounded-xl p-3.5 text-xs text-white" 
                      />
                      <button type="button" onClick={() => setForm({...form, pros: form.pros.filter((_:any, j:number) => i!==j)})} className="text-white/20 hover:text-red-500 transition-colors"><X size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-red-500">Inhibition Factors (Cons)</label>
                  <button type="button" onClick={() => setForm({...form, cons: [...(form.cons || []), '']})} className="text-red-500 hover:scale-125 transition-transform"><Plus size={18} /></button>
                </div>
                <div className="space-y-3">
                  {(form.cons || []).map((p: string, i: number) => (
                    <div key={i} className="flex gap-3 group">
                      <input 
                        type="text" value={p} 
                        onChange={e => {
                          const next = [...form.cons];
                          next[i] = e.target.value;
                          setForm({...form, cons: next});
                        }}
                        className="flex-1 bg-[#0a0a0a] border border-red-500/20 rounded-xl p-3.5 text-xs text-white" 
                      />
                      <button type="button" onClick={() => setForm({...form, cons: form.cons.filter((_:any, j:number) => i!==j)})} className="text-white/20 hover:text-red-500 transition-colors"><X size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Details (Bullets) */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#34d399]">Technical Specifications</label>
                <button type="button" onClick={() => setForm({...form, product_details: [...(form.product_details || []), '']})} className="text-[#34d399] hover:scale-125 transition-transform"><Plus size={18} /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(form.product_details || []).map((p: string, i: number) => (
                  <div key={i} className="flex gap-3 group">
                    <input 
                      type="text" value={p} 
                      onChange={e => {
                        const next = [...form.product_details];
                        next[i] = e.target.value;
                        setForm({...form, product_details: next});
                      }}
                      className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-xl p-3 text-xs text-white/80" 
                    />
                    <button type="button" onClick={() => setForm({...form, product_details: form.product_details.filter((_:any, j:number) => i!==j)})} className="text-white/20 hover:text-red-500 transition-colors"><X size={16} /></button>
                  </div>
                ))}
              </div>
            </div>

            {/* Redemption Table */}
            <div className="space-y-6">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#34d399]">Redemption Equilibrium Values</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(form.redemption_table || []).map((r: any, i: number) => (
                  <div key={i} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 space-y-2">
                    <div className="text-[9px] font-black uppercase tracking-widest text-white/30">{r.category}</div>
                    <input type="text" value={r.value} onChange={el => {
                      const next = [...form.redemption_table];
                      next[i].value = el.target.value;
                      setForm({...form, redemption_table: next});
                    }} className="w-full bg-transparent border-none p-0 text-sm text-white font-bold focus:ring-0 outline-none" />
                  </div>
                ))}
              </div>
            </div>

            {/* Latest News */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#34d399]">Signal Intelligence (Updates)</label>
                <button type="button" onClick={() => setForm({...form, latest_news: [...(form.latest_news || []), '']})} className="text-[#34d399] hover:scale-125 transition-transform"><Plus size={18} /></button>
              </div>
              <div className="space-y-3">
                {(form.latest_news || []).map((n: string, i: number) => (
                  <div key={i} className="flex gap-3 group">
                    <div className="w-2 h-2 rounded-full bg-[#34d399] mt-4 shrink-0" />
                    <input 
                      type="text" value={n} 
                      onChange={e => {
                        const next = [...form.latest_news];
                        next[i] = e.target.value;
                        setForm({...form, latest_news: next});
                      }}
                      className="flex-1 bg-transparent border-b border-white/10 py-2 text-sm text-white/60 focus:text-white focus:border-[#34d399] outline-none transition-all" 
                    />
                    <button type="button" onClick={() => setForm({...form, latest_news: form.latest_news.filter((_:any, j:number) => i!==j)})} className="text-white/20 hover:text-red-500 transition-colors"><X size={16} /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8 pt-10 border-t border-white/5">
          <div>
            <div className="flex items-center justify-between mb-4 ml-1">
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/30">Editorial Verdict (Neural Core)</label>
                <button 
                  type="button"
                  onClick={async () => {
                    const btn = document.getElementById('ai-verdict-btn');
                    if (btn) btn.classList.add('animate-pulse');
                    try {
                      const benefitsText = form.benefit_items.map((b: any) => `${b.heading}: ${b.subheading}`).join('\n');
                      const prompt = `Act as a senior financial analyst at Yureka Money. Summarize this credit card into a sharp, 3-sentence elite editorial verdict. 
                      Card Name: ${form.name}
                      Bank: ${form.bank}
                      Category: ${form.category}
                      Fees: ${form.annual_fee} (Annual), ${form.joining_fee} (Joining)
                      Intro Offer: ${form.intro_offer}
                      Benefits:
                      ${benefitsText}
                      
                      Focus on absolute value proposition and which persona should deploy this card. Keep it premium, direct, and elite.`;

                      // Gemini API call logic
                      const API_KEY = (import.meta as any).env.VITE_GEMINI_API_KEY;
                      if (!API_KEY) throw new Error("VITE_GEMINI_API_KEY missing");
                      
                      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
                        method: 'POST',
                        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
                      });
                      const result = await response.json();
                      const summary = result.candidates[0].content.parts[0].text;
                      setForm({...form, verdict: summary.trim(), final_verdict_text: summary.trim()});
                    } catch (err: any) {
                      alert(`Neural Link Error: ${err.message}. Please verify VITE_GEMINI_API_KEY.`);
                    } finally {
                      if (btn) btn.classList.remove('animate-pulse');
                    }
                  }}
                  id="ai-verdict-btn"
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#34d399] bg-[#34d399]/10 px-5 py-2 rounded-full hover:bg-[#34d399] hover:text-white transition-all border border-[#34d399]/20"
                >
                  <Zap size={12} fill="currentColor" />
                  Compute Synthesis
                </button>
            </div>
            <textarea 
              value={form.verdict || ''}
              onChange={e => setForm({...form, verdict: e.target.value})}
              className="w-full bg-white/5 border border-white/5 rounded-[2rem] p-8 focus:ring-2 focus:ring-[#34d399] outline-none transition-all h-40 text-[15px] leading-relaxed text-white placeholder:text-white/10 font-serif italic"
              placeholder="Deploy AI synthesis or craft manual executive verdict..."
            />
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
          {(uploading || saving) ? 'TRANSMITTING...' : 'COMMIT CHANGES'}
        </button>
      </div>
    </form>
  );
};
