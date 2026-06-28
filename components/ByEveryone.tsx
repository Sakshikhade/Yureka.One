import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  CreditCard, 
  ArrowRight, 
  TrendingUp,
  Users
} from 'lucide-react';
import SEO from './SEO';

const ByEveryone: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden selection:bg-clay selection:text-black">
      <SEO 
        title="Community Intelligence | Yureka.Money" 
        description="The world's most advanced community-driven credit intelligence engine. Join thousands of elite spenders sharing real-world rewards data and hidden hacks."
      />

      {/* Hero Section - The Collective Intelligence */}
      <section className="relative pt-20 pb-32 px-6 font-sans">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_center,rgba(0,147,59,0.04)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="max-w-5xl mx-auto text-center relative z-10 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-xl mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-clay animate-pulse" />
            <span className="text-[10px] font-black text-white/90 uppercase tracking-[0.30em] font-mono">Consensus-Driven Ledger</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-7xl font-heading font-black text-white tracking-tighter leading-none uppercase mb-8"
          >
             POWERED BY EVERYONE. <br />
             <span className="text-clay italic">GUIDED BY DATA.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white/80 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-12 font-sans"
          >
             Say goodbye to outdated spreadsheets, biased affiliate portals, and hidden terms. Access live, verified credit metrics crowdsourced directly from elite card holders.
          </motion.p>
        </div>
      </section>

      {/* Global Network Map Visualization */}
      <section className="relative py-12 px-6">
         <div className="max-w-5xl mx-auto relative h-[380px] bg-gradient-to-b from-white/[0.02] to-transparent border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl backdrop-blur-md flex items-center justify-center">
            {/* Interactive global visual nodes */}
            <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
            
            <svg className="w-full h-full absolute inset-0 text-white/5 pointer-events-none" viewBox="0 0 800 380">
              <path d="M 150 190 Q 250 80 400 190 T 650 190" fill="none" stroke="rgba(0,147,59,0.15)" strokeWidth="2" strokeDasharray="6 6" />
              <path d="M 150 190 Q 280 280 400 190 T 650 190" fill="none" stroke="rgba(0,147,59,0.15)" strokeWidth="1.5" />
              <path d="M 250 120 Q 400 20 550 120" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              
              {/* Nodes */}
              <circle cx="150" cy="190" r="6" fill="#00933b" className="animate-pulse" />
              <circle cx="400" cy="190" r="12" fill="#000" stroke="#00933b" strokeWidth="3" />
              <circle cx="400" cy="190" r="4" fill="#00933b" />
              <circle cx="650" cy="190" r="6" fill="#00933b" className="animate-pulse" />
              
              <circle cx="270" cy="110" r="4" fill="#fff" opacity="0.3" />
              <circle cx="530" cy="110" r="4" fill="#fff" opacity="0.3" />
              <circle cx="340" cy="245" r="4" fill="#fff" opacity="0.3" />
              <circle cx="460" cy="245" r="4" fill="#fff" opacity="0.3" />
            </svg>

            <div className="relative z-10 text-center space-y-4 max-w-md px-6">
              <span className="text-[10px] font-black text-clay uppercase tracking-[0.3em] font-mono">Consensus Network Map</span>
              <h3 className="text-2xl md:text-4xl font-heading font-black text-white uppercase tracking-tighter leading-none">GLOBAL LEDGER SYNC</h3>
              <p className="text-white/80 text-xs md:text-sm max-w-xs mx-auto leading-relaxed">
                 Aggregating card metadata, transaction classifications, and reward yields across 12,000+ consensus nodes.
              </p>
            </div>
         </div>
      </section>

      {/* Audit Form Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-b from-white/[0.03] to-transparent border border-white/10 rounded-[3rem] p-10 md:p-16 backdrop-blur-2xl shadow-2xl relative overflow-hidden group font-sans"
          >
             <div className="absolute inset-0 bg-gradient-to-br from-clay/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
             
             <div className="relative z-10">
                <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/60 text-center mb-8 font-mono">Audit Your Contribution Power</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-white/60 ml-2 font-mono">Primary Card</label>
                    <div className="relative">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={16} />
                      <input 
                        type="text" 
                        placeholder="Infinia, Magnus, etc..." 
                        className="w-full bg-[#111] border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-clay/50 transition-all text-sm text-white placeholder-white/30 font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-white/60 ml-2 font-mono">Spending Tier</label>
                    <div className="relative">
                      <select className="w-full bg-[#111] border border-white/10 rounded-2xl py-4 px-4 outline-none focus:border-clay/50 transition-all text-sm text-white font-medium appearance-none">
                        <option>Growth Tier (&lt;5L)</option>
                        <option selected>Elite Tier (5L-20L)</option>
                        <option>Private Tier (20L-50L)</option>
                        <option>Centurion Tier (50L+)</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-white/60 ml-2 font-mono">Monthly Spend</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-sm font-medium">₹</span>
                      <input 
                        type="text" 
                        defaultValue="1,50,000"
                        className="w-full bg-[#111] border border-white/10 rounded-2xl py-4 pl-10 pr-4 outline-none focus:border-clay/50 transition-all text-sm text-white font-medium font-mono"
                      />
                    </div>
                  </div>
                </div>

                <button className="w-full bg-white text-black py-5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-clay hover:text-black transition-all duration-500 mb-8 shadow-2xl font-mono">
                  Analyze My Impact
                </button>

                <div className="text-center">
                  <p className="text-[9px] uppercase tracking-widest text-white/55 font-bold flex items-center justify-center gap-2 font-mono">
                    <span className="w-1.5 h-1.5 bg-clay rounded-full" />
                    Your data is anonymized and encrypted via Yureka-SEC protocols.
                  </p>
                </div>
             </div>
          </motion.div>

          <div className="text-center mt-20 max-w-2xl mx-auto space-y-6 relative font-sans">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,147,59,0.04)_0%,transparent_70%)] pointer-events-none -z-10" />
            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/55 font-mono">Collective leverage is the future.</h5>
            <h4 className="text-4xl md:text-5xl font-heading font-black tracking-tighter leading-[1.1]">
               Stop fighting <span className="bg-gradient-to-r from-clay to-[#00933b] bg-clip-text text-transparent font-extrabold italic uppercase tracking-tighter">the system</span> alone.
            </h4>
            <p className="text-white/80 font-sans text-sm md:text-base leading-relaxed tracking-normal">
              Yureka.Money is the infrastructure for a more transparent financial world. We use community data to negotiate better, spend smarter, and win together.
            </p>
          </div>
        </div>
      </section>

      {/* The Intelligence Matrix - Comparison */}
      <section className="relative py-32 px-6 bg-white/[0.01] font-sans">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-heading font-black tracking-tighter text-white mb-6 uppercase">Individual vs Collective</h2>
          <p className="text-white/80 font-sans text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Traditional research is limited by your own experience. Yureka Intelligence is powered by the combined experience of 50,000+ elite users.
          </p>
        </div>

        <div className="max-w-5xl mx-auto mb-32">
           {/* Comparison Matrix */}
           <div className="bg-gradient-to-b from-white/[0.02] to-transparent border border-white/10 rounded-[3rem] overflow-hidden backdrop-blur-xl shadow-3xl">
              <div className="grid grid-cols-3 border-b border-white/10 p-8 bg-white/[0.02]">
                 <div className="text-[11px] font-black uppercase tracking-widest text-white/50 font-mono">Metric</div>
                 <div className="text-center text-[11px] font-black uppercase tracking-widest text-clay font-mono flex items-center justify-center gap-1.5">
                   <span className="w-1.5 h-1.5 rounded-full bg-clay animate-pulse" /> Yureka Intelligence
                 </div>
                 <div className="text-center text-[11px] font-black uppercase tracking-widest text-white/50 font-mono">Solo Research</div>
              </div>

              {[
                { cat: 'Data Fidelity', items: [
                  { label: 'Real-world DP', yureka: 'Verified by 1,000+ users', trad: 'Marketing PDF data only', sub: 'Actual vs Advertised Rewards' },
                  { label: 'Exclusion Tracking', yureka: 'Live Alerts', trad: 'Found after swipe', sub: 'Save thousands in lost points' },
                  { label: 'MCC Mapping', yureka: 'Comprehensive Index', trad: 'Manual guessing', sub: 'Merchant Category Code Accuracy' }
                ]},
                { cat: 'Strategic Yield', items: [
                  { label: 'Reward Maximization', yureka: 'Optimized via Matrix', trad: 'Basic 1-2% earning', sub: 'Unlock 10-33% real value' },
                  { label: 'Transfer Strategies', yureka: 'Elite Mile Mapping', trad: 'Direct Redemption (Low value)', sub: 'Airlines & Hotel Arbitrage' },
                  { label: 'Merchant Specifics', yureka: 'Dynamic Rankings', trad: 'Generic advice', sub: 'Amazon, Flipkart, Apple, etc.' }
                ]},
                { cat: 'Community Leverage', items: [
                  { label: 'Feature Access', yureka: 'Community Verified', trad: 'Official T&C only', highlight: true },
                  { label: 'Wait times / Support', yureka: 'Live User Reports', trad: 'Trial and error', sub: 'Concierge & Service Quality' }
                ]}
              ].map((section, idx) => (
                <div key={idx} className="border-b border-white/5">
                   <div className="bg-white/[0.02] px-8 py-3.5 text-[10px] font-black uppercase tracking-widest text-white/60 border-b border-white/5 font-mono">{section.cat}</div>
                   {section.items.map((item, i) => (
                     <div key={i} className={`grid grid-cols-3 p-8 items-center ${item.highlight ? 'bg-clay/5' : ''} border-b border-white/5 last:border-b-0`}>
                        <div className="space-y-1">
                           <div className="text-sm font-bold text-white/95">{item.label}</div>
                           {item.sub && <div className="text-[11px] text-white/60 font-medium italic">{item.sub}</div>}
                        </div>
                        <div className="text-center px-4 py-2 bg-[#00933b]/[0.02] border-x border-[#00933b]/10">
                           <div className={`text-sm font-black ${item.yureka.includes('Verified') || item.yureka.includes('Comprehensive') || item.yureka.includes('Optimized') || item.yureka.includes('Live') || item.yureka.includes('Elite') ? 'text-[#00933b] font-bold' : 'text-white'}`}>{item.yureka}</div>
                        </div>
                        <div className="text-center opacity-60">
                           <div className="text-sm font-medium text-white/80">{item.trad}</div>
                        </div>
                     </div>
                   ))}
                </div>
              ))}

              <div className="bg-gradient-to-r from-clay to-[#00933b] p-10 grid grid-cols-3 items-center rounded-b-[3rem] shadow-[0_10px_40px_rgba(0,147,59,0.15)]">
                 <div className="space-y-1">
                    <div className="text-xl font-black text-black uppercase tracking-tighter leading-none">Yield Delta</div>
                    <div className="text-[10px] font-bold text-black/80 font-mono uppercase tracking-wider">Performance Gap</div>
                  </div>
                  <div className="text-center text-3xl font-black text-black tracking-tighter drop-shadow-[0_2px_10px_rgba(0,0,0,0.1)]">~4.5x More Value</div>
                  <div className="text-center text-3xl font-black text-black/50 tracking-tighter">Baseline Value</div>
              </div>
           </div>
        </div>
      </section>

      {/* Featured Portfolios - The Wall of Intelligence */}
      <section className="relative py-32 px-6 font-sans">
        <div className="max-w-7xl mx-auto">
           <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tighter text-white uppercase">Elite <span className="text-clay italic">Card Portfolios</span></h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'Travel Titan Portfolio', tag: 'Airlines / Hotels', price: '12.5% ROI' },
                { name: 'Cashback Alpha Portfolio', tag: 'Pure Savings', price: '8.4% ROI' },
                { name: 'Luxury Lifestyle Portfolio', tag: 'Perks / Concierge', price: '6.2% ROI' }
              ].map((prop, i) => (
                <div key={i} className="bg-gradient-to-b from-white/[0.02] to-transparent border border-white/10 rounded-[2.5rem] overflow-hidden group hover:border-clay/50 transition-all duration-700 shadow-2xl">
                   <div className="relative aspect-[4/3] overflow-hidden">
                      {/* Interactive CSS Graphic replaces broken image */}
                      {i === 0 && (
                        <div className="w-full h-full bg-gradient-to-br from-[#0c162f] via-[#050505] to-[#122245] relative flex items-center justify-center overflow-hidden">
                           <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
                           <div className="absolute -top-16 -left-16 w-36 h-36 bg-blue-500/10 blur-[40px] rounded-full pointer-events-none" />
                           <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-clay/10 blur-[40px] rounded-full pointer-events-none" />
                           <div className="relative w-44 h-28 rounded-xl bg-gradient-to-tr from-[#1b2a47] to-[#0f172a] border border-white/15 p-4 flex flex-col justify-between shadow-2xl group-hover:rotate-6 group-hover:scale-105 transition-all duration-500">
                              <div className="flex justify-between items-start">
                                 <span className="text-[7px] font-mono tracking-widest text-white/50 font-black">TITAN TRAVEL</span>
                                 <div className="w-6 h-4 bg-yellow-600/30 border border-yellow-600/50 rounded" />
                              </div>
                              <div>
                                 <div className="text-[9px] font-mono text-white/80 font-bold mb-1">AXIS ATLAS + INFINIA</div>
                                 <div className="text-[7px] font-mono text-white/40 font-black">12.5% REALIZED VALUE</div>
                              </div>
                           </div>
                        </div>
                      )}
                      {i === 1 && (
                        <div className="w-full h-full bg-gradient-to-br from-[#0a251b] via-[#050505] to-[#113a29] relative flex items-center justify-center overflow-hidden">
                           <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
                           <div className="absolute -top-16 -left-16 w-36 h-36 bg-clay/10 blur-[40px] rounded-full pointer-events-none" />
                           <div className="relative w-44 h-28 rounded-xl bg-gradient-to-tr from-[#111] to-[#070f0b] border border-clay/20 p-4 flex flex-col justify-between shadow-2xl group-hover:-rotate-6 group-hover:scale-105 transition-all duration-500">
                              <div className="flex justify-between items-start">
                                 <span className="text-[7px] font-mono tracking-widest text-clay font-black">ALPHA CASHBACK</span>
                                 <div className="w-6 h-4 bg-clay/20 border border-clay/40 rounded" />
                              </div>
                              <div>
                                 <div className="text-[9px] font-mono text-white/80 font-bold mb-1">SBI CASHBACK + AIRTEL</div>
                                 <div className="text-[7px] font-mono text-white/40 font-black">8.4% NET REWARDS</div>
                              </div>
                           </div>
                        </div>
                      )}
                      {i === 2 && (
                        <div className="w-full h-full bg-gradient-to-br from-[#27102e] via-[#050505] to-[#3a1a45] relative flex items-center justify-center overflow-hidden">
                           <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
                           <div className="absolute -top-16 -left-16 w-36 h-36 bg-purple-500/10 blur-[40px] rounded-full pointer-events-none" />
                           <div className="relative w-44 h-28 rounded-xl bg-gradient-to-tr from-[#2d1b33] to-[#120a14] border border-white/15 p-4 flex flex-col justify-between shadow-2xl group-hover:translate-y-[-4px] group-hover:scale-105 transition-all duration-500">
                              <div className="flex justify-between items-start">
                                 <span className="text-[7px] font-mono tracking-widest text-purple-400 font-black">LUXURY LIFESTYLE</span>
                                 <div className="w-6 h-4 bg-purple-600/30 border border-purple-500/40 rounded" />
                              </div>
                              <div>
                                 <div className="text-[9px] font-mono text-white/80 font-bold mb-1">AMEX PLATINUM + EMERALDE</div>
                                 <div className="text-[7px] font-mono text-white/40 font-black">6.2% ROI PERKS</div>
                              </div>
                           </div>
                        </div>
                      )}
                      
                      <div className="absolute top-6 left-6 bg-clay/90 backdrop-blur-md text-black text-[8px] font-black uppercase px-4 py-2 rounded-full tracking-widest font-mono">
                         {prop.tag}
                      </div>
                   </div>
                   <div className="p-8">
                      <h4 className="text-2xl font-heading font-black text-white mb-6 tracking-tighter uppercase">{prop.name}</h4>
                      <div className="grid grid-cols-2 gap-4 mb-8">
                         <div className="flex items-center gap-2">
                            <Users size={14} className="text-clay" />
                            <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest font-mono">12k+ Adopters</span>
                         </div>
                         <div className="flex items-center gap-2 text-white/60">
                            <TrendingUp size={14} className="text-clay/80" />
                            <span className="text-[10px] font-bold uppercase tracking-widest font-mono">Top Performer</span>
                         </div>
                      </div>
                      <div className="pt-8 border-t border-white/5 flex items-end justify-between">
                         <div>
                            <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1 font-mono">Target Yield</div>
                            <div className="text-3xl font-black text-white">{prop.price}</div>
                         </div>
                         <button className="w-12 h-12 bg-clay text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
                            <ArrowRight size={20} className="text-black" />
                         </button>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Closing Section */}
      <section className="relative py-32 px-6 overflow-hidden font-sans">
        <div className="max-w-7xl mx-auto">
           <div className="relative aspect-video rounded-[3rem] overflow-hidden group shadow-2xl border border-white/10 bg-[#0d0d0d] flex items-center justify-center">
              {/* Dynamic neural backdrop */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,147,59,0.06)_0%,transparent_65%)] pointer-events-none" />
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
              
              {/* Glowing vector circles/lines connecting */}
              <svg className="w-full h-full absolute inset-0 text-white/5 pointer-events-none" viewBox="0 0 800 450">
                 <defs>
                    <radialGradient id="netGlow" cx="50%" cy="50%" r="50%">
                       <stop offset="0%" stopColor="#00933b" stopOpacity="0.25" />
                       <stop offset="100%" stopColor="#00933b" stopOpacity="0" />
                    </radialGradient>
                 </defs>
                 <circle cx="400" cy="225" r="160" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" className="animate-[spin_100s_linear_infinite]" />
                 <circle cx="400" cy="225" r="100" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" className="animate-[spin_60s_linear_infinite_reverse]" />
                 <circle cx="400" cy="225" r="40" fill="url(#netGlow)" />
                 
                 {/* Central node connection paths */}
                 <path d="M 240 225 L 560 225" stroke="currentColor" strokeWidth="1" />
                 <path d="M 400 100 L 400 350" stroke="currentColor" strokeWidth="1" />
                 
                 {/* Interactive glowing dots */}
                 <circle cx="240" cy="225" r="5" fill="#00933b" className="animate-ping" />
                 <circle cx="560" cy="225" r="5" fill="#00933b" className="animate-ping" style={{ animationDelay: '1s' }} />
                 <circle cx="400" cy="100" r="5" fill="#00933b" className="animate-ping" style={{ animationDelay: '0.5s' }} />
                 <circle cx="400" cy="350" r="5" fill="#00933b" className="animate-ping" style={{ animationDelay: '1.5s' }} />
              </svg>
              
              <div className="relative z-10 text-center space-y-4 max-w-lg px-6">
                 <span className="text-[10px] font-black text-clay uppercase tracking-[0.3em] font-mono">Institutional Ledger Engine</span>
                 <h3 className="text-3xl md:text-5xl font-heading font-black text-white uppercase tracking-tighter">YUREKA CORE NETWORK</h3>
                 <p className="text-white/70 text-xs md:text-sm font-sans max-w-sm mx-auto leading-relaxed">
                    Decentralized spender consensus mapping over 14.8M API datapoints. Updated real-time.
                 </p>
              </div>
           </div>

           <div className="mt-20 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="max-w-xl text-center md:text-left">
                 <h2 className="text-4xl md:text-6xl font-heading font-black tracking-tighter leading-none mb-4 uppercase">
                   POWER TO THE <br /> <span className="text-clay italic">SPENDER.</span>
                 </h2>
                 <p className="text-white/80 font-sans text-sm md:text-base leading-relaxed">Join the high-performance spenders who treat credit as an asset.</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto">
                 <Link 
                   to="/join-waitlist"
                   className="bg-clay text-black px-12 py-5 rounded-full font-bold uppercase tracking-widest text-[11px] hover:bg-white hover:text-black transition-all shadow-2xl shadow-clay/20 w-full sm:w-auto text-center font-mono"
                 >
                   Access Network
                 </Link>
                 <Link 
                   to="/contribute"
                   className="bg-white/5 border border-white/10 text-white px-12 py-5 rounded-full font-bold uppercase tracking-widest text-[11px] hover:bg-white hover:text-black transition-all w-full sm:w-auto text-center font-mono"
                 >
                   Contribute Data
                 </Link>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default ByEveryone;
