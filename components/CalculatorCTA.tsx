import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calculator, ArrowRight, TrendingUp, ShieldCheck } from 'lucide-react';

const CalculatorCTA: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [monthlySpend, setMonthlySpend] = useState(50000);
  const [category, setCategory] = useState<'travel' | 'dining' | 'shopping'>('travel');

  const calculateSavings = () => {
    const rate = category === 'travel' ? 0.08 : category === 'dining' ? 0.06 : 0.04;
    const standardRate = 0.015;
    const yurekaYearly = (monthlySpend * rate) * 12;
    const standardYearly = (monthlySpend * standardRate) * 12;
    return {
      yureka: Math.round(yurekaYearly).toLocaleString('en-IN'),
      standard: Math.round(standardYearly).toLocaleString('en-IN'),
      diff: Math.round(yurekaYearly - standardYearly).toLocaleString('en-IN')
    };
  };

  const results = calculateSavings();

  return (
    <section className="relative py-12 md:py-24 bg-[#F2EFE9] overflow-hidden">
      {/* Geometric Background Pattern */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" 
           style={{ 
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18l1.5-1.5 1.122 1.122L21.122 19H25v2h-3.878l1.5 1.5-1.122 1.122L20 22.122V24.5l-1.5 1.5-1.122-1.122L18.878 23H15v-2h3.878l-1.5-1.5 1.122-1.122L20 19.878V17.5l1.5-1.5 1.122 1.122L21.122 19z' fill='%23000' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
             backgroundSize: '40px 40px' 
           }} 
      />
      
      <div className="w-full relative z-10 px-4 md:px-0">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-cream border border-black/10 rounded-[2.5rem] p-6 md:px-12 md:py-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm hover:shadow-xl transition-all duration-700 group"
        >
          <div className="flex items-center gap-8">
            {/* Full-Fledged Animated Calculator Icon */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              onClick={() => setIsOpen(true)}
              className="w-20 h-20 bg-emerald-50 border border-emerald-100 rounded-[1.25rem] flex items-center justify-center shrink-0 shadow-inner group/icon cursor-pointer relative overflow-hidden"
            >
               <div className="relative z-10 w-12 h-14 flex flex-col gap-2">
                 {/* Calculator Screen */}
                 <div className="w-full h-4 bg-emerald-100/50 border border-emerald-500/20 rounded-[2px] flex items-center justify-end px-1 overflow-hidden">
                    <motion.div 
                      key={isOpen ? 'open' : 'closed'}
                      initial={{ x: 10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="text-[9px] font-mono text-emerald-600 font-bold"
                    >
                      {isOpen ? '8888.88' : results.diff}
                    </motion.div>
                 </div>
                 {/* Keypad Grid */}
                 <div className="grid grid-cols-3 gap-1.5">
                    {[1,2,3,4,5,6].map((i) => (
                      <motion.div 
                        key={i}
                        animate={{ 
                          backgroundColor: i % 2 === 0 ? "rgba(16,185,129,0.1)" : "rgba(16,185,129,0.3)",
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity, 
                          delay: i * 0.2 
                        }}
                        className="w-full h-2 rounded-[1px]"
                      />
                    ))}
                    <div className="col-span-2 h-2 bg-emerald-500/40 rounded-[1px]" />
                    <div className="h-2 bg-emerald-600 rounded-[1px]" />
                 </div>
               </div>
               {/* Scan Light */}
               <motion.div 
                 animate={{ top: ['-20%', '120%'] }}
                 transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-x-0 h-px bg-emerald-400/30 blur-sm z-20"
               />
               <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent pointer-events-none" />
            </motion.div>
            
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-4xl font-serif text-[#242424] font-bold tracking-tight mb-2">
                Yureka vs Standard
              </h3>
              <p className="text-[#242424]/60 text-base md:text-lg font-serif italic">
                "Stop leaving ₹{results.diff} on the table every year."
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsOpen(true)}
            className="bg-[#242424] text-cream px-12 py-5 rounded-full font-bold uppercase tracking-widest text-[13px] hover:scale-105 active:scale-95 transition-all shadow-2xl hover:shadow-emerald-500/10 flex items-center gap-3 group/btn"
          >
            Run Comparison
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Calculator size={18} className="text-emerald-400" />
            </motion.div>
          </button>
        </motion.div>
      </div>

      {/* FULL FLEDGED CALCULATOR MODAL/DRAWER */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl bg-[#242424]/40"
            onClick={() => setIsOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-paper border border-cream/20 w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
            >
              <div className="p-8 md:p-12">
                <div className="flex justify-between items-center mb-10">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                         <Calculator size={20} className="text-cream" />
                      </div>
                      <h4 className="text-2xl font-serif font-bold text-[#242424] uppercase tracking-tight">Savings Intelligence</h4>
                   </div>
                   <button 
                    onClick={() => setIsOpen(false)}
                    className="w-12 h-12 bg-cream border border-ink/5 flex items-center justify-center rounded-full hover:bg-[#242424] hover:text-cream transition-all shadow-sm"
                   >
                     <X size={20} />
                   </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   {/* Inputs */}
                   <div className="space-y-8">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#242424]/40 mb-3 block">Monthly Credit Spend</label>
                        <div className="flex items-baseline gap-2 mb-4">
                          <span className="text-3xl font-serif text-[#242424]">₹</span>
                          <span className="text-5xl md:text-6xl font-serif font-bold text-[#242424] tracking-tighter">
                            {monthlySpend.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <input 
                          type="range" 
                          min="10000" 
                          max="500000" 
                          step="5000" 
                          value={monthlySpend}
                          onChange={(e) => setMonthlySpend(parseInt(e.target.value))}
                          className="w-full accent-emerald-500 h-1.5 bg-[#242424]/10 rounded-full appearance-none cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#242424]/40 mb-4 block">Major Spend Category</label>
                        <div className="flex flex-wrap gap-2">
                           {(['travel', 'dining', 'shopping'] as const).map((cat) => (
                             <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${
                                  category === cat 
                                  ? 'bg-emerald-500 text-cream shadow-xl shadow-emerald-500/20' 
                                  : 'bg-cream border border-ink/10 text-[#242424]/60 hover:border-ink'
                                }`}
                             >
                               {cat}
                             </button>
                           ))}
                        </div>
                      </div>
                   </div>

                   {/* Results */}
                   <div className="bg-[#F2EFE9] rounded-[2rem] p-8 relative overflow-hidden flex flex-col justify-between">
                      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                         <TrendingUp size={120} />
                      </div>

                      <div className="relative z-10">
                        <div className="mb-8">
                           <p className="text-[10px] font-bold uppercase tracking-widest text-[#242424]/40 mb-1">Standard Bank Match</p>
                           <h5 className="text-2xl font-serif text-[#242424]/60">₹{results.standard}<span className="text-xs ml-1">/yr</span></h5>
                        </div>

                        <div className="mb-8">
                           <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-1">Yureka Optimized</p>
                           <h5 className="text-5xl font-serif font-bold text-[#242424] tracking-tight">₹{results.yureka}<span className="text-base ml-1">/yr</span></h5>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-ink/10 relative z-10">
                         <div className="flex items-center gap-2 mb-2">
                            <ShieldCheck size={14} className="text-emerald-500" />
                            <span className="text-[10px] uppercase font-bold tracking-widest text-[#242424]/50">Guaranteed delta</span>
                         </div>
                         <p className="text-2xl font-serif italic text-[#242424]">
                            Extra +₹{results.diff} savings
                         </p>
                      </div>
                   </div>
                </div>

                <div className="mt-12 pt-8 border-t border-ink/5 flex flex-col md:flex-row items-center justify-between gap-6">
                   <p className="text-[10px] text-[#242424]/40 font-mono flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      YUREKA ALG.v4 CLUSTER ANALYSIS ACTIVE
                   </p>
                   <Link to="/join-waitlist" className="flex items-center gap-3 text-sm font-bold text-[#242424] border-b-2 border-emerald-500 pb-1 hover:text-emerald-600 transition-colors">
                      Claim Your Optimization Report
                      <ArrowRight size={18} />
                   </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default CalculatorCTA;
