import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  CreditCard, 
  MapPin, 
  Home, 
  Coins, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Clock,
  Sparkles,
  Zap,
  Calendar,
  BadgePercent,
  UserPlus,
  Phone,
  Minus,
  Plus,
  Share2,
  Info,
  ChevronDown,
  X as XIcon,
  TrendingUp,
  BarChart3,
  Scale
} from 'lucide-react';
import SEO from './SEO';

const ByEveryone: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden selection:bg-clay selection:text-black">
      <SEO 
        title="Secured | Strategic Rental Yield & Optimization" 
        description="Turn your largest monthly liability into a high-performance asset. Optimize liquidity and earn systematic yield on every rental deployment."
      />

      {/* Hero Section - The Strategic Shift */}
      <section className="relative pt-20 pb-32 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_center,rgba(230,126,34,0.05)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="max-w-5xl mx-auto text-center relative z-10 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-clay font-bold text-[10px] uppercase tracking-[0.4em] mb-6 block">Analysis Report: YR-SEC-04</span>
            <h1 className="text-5xl md:text-8xl font-heading font-black mb-6 tracking-tighter leading-none">
              RECLAIM <span className="text-clay inline-block relative italic">
                YOUR YIELD.
                <motion.div 
                  className="absolute -bottom-2 left-0 w-full h-1 bg-clay/30"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </span>
            </h1>
            <h2 className="text-2xl md:text-4xl font-serif text-white/80 mb-8 font-light italic">
              Strategic Rental Deployment & Optimization
            </h2>
            <p className="text-white/40 text-sm md:text-base max-w-2xl mx-auto leading-relaxed mb-12 font-serif italic">
              Rent is your largest monthly commitment. In legacy systems, it's a dead liability. Yureka Secured treats it as a capital deployment, optimized for yield, liquidity, and credit growth.
            </p>

            <div className="flex flex-col items-center gap-4">
              <Link 
                to="/join-waitlist"
                className="bg-white text-black px-12 py-5 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-clay hover:text-white transition-all duration-500 shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:shadow-clay/20 group"
              >
                Access Early Optimization
                <motion.span 
                  className="inline-block ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ArrowRight size={18} />
                </motion.span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Problem: Dead Capital */}
      <section className="relative py-32 px-6 border-y border-white/5 bg-white/[0.01]">
         <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
               <span className="text-clay font-bold text-[10px] uppercase tracking-[0.3em]">The Market Inefficiency</span>
               <h3 className="text-4xl md:text-6xl font-heading font-black tracking-tighter text-white uppercase leading-none">
                  Your rent is <br /> <span className="text-clay italic">dead capital.</span>
               </h3>
               <div className="space-y-6 font-serif italic text-white/40 text-lg leading-relaxed">
                  <p>
                     For decades, the rental market has operated on friction. High security deposits lock up your liquidity. Zero rewards on high-value transactions lead to missed arbitrage opportunities.
                  </p>
                  <p>
                     Legacy renting is an expense. High-performance finance requires it to be an asset.
                  </p>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               {[
                 { label: 'Locked Liquidity', val: '6-10 Months', sub: 'Traditional Deposit' },
                 { label: 'Opportunity Cost', val: '12% p.a.', sub: 'Lost on Dead Capital' },
                 { label: 'Reward Yield', val: '0.00%', sub: 'On Legacy Payments' },
                 { label: 'Market Friction', val: '₹24,500+', sub: 'Average Brokerage Waste' }
               ].map((stat, i) => (
                 <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center">
                    <div className="text-[10px] font-bold text-white/20 uppercase mb-4 tracking-widest">{stat.label}</div>
                    <div className="text-2xl font-black text-white mb-1">{stat.val}</div>
                    <div className="text-[10px] font-serif text-clay italic">{stat.sub}</div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* The Solution: Yureka Secured */}
      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto text-center mb-20">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-heading font-black tracking-tighter text-white/90 mb-4 uppercase"
          >
            INR <span className="text-clay">20 crores+</span> optimized for high-net spenders
          </motion.h3>
          <p className="text-white/40 font-serif italic text-lg">
            Systematically capturing value across Bengaluru's premium residential clusters
          </p>
        </div>

        {/* Map Visualization */}
        <div className="relative w-full aspect-[21/9] md:aspect-[21/7] max-w-7xl mx-auto opacity-40">
           <svg viewBox="0 0 1000 400" className="w-full h-full text-white/5 fill-current">
             <path d="M100,50 Q150,20 200,80 T300,100 T450,50 T600,120 T800,80 T950,150" fill="none" stroke="currentColor" strokeWidth="0.5" />
             <path d="M50,150 Q100,120 180,180 T350,150 T550,220 T750,180 T900,250" fill="none" stroke="currentColor" strokeWidth="0.5" />
             <path d="M150,250 Q250,220 380,280 T550,250 T750,320 T950,280" fill="none" stroke="currentColor" strokeWidth="0.5" />
           </svg>
           
           {[
             { x: '15%', y: '30%', label: '₹1,00,000' },
             { x: '35%', y: '60%', label: '₹58,000' },
             { x: '55%', y: '40%', label: '₹1,20,000' },
             { x: '75%', y: '70%', label: '₹45,000' },
             { x: '85%', y: '20%', label: '₹90,000' },
             { x: '25%', y: '80%', label: '₹75,000' },
             { x: '45%', y: '15%', label: '₹2,50,000' },
             { x: '65%', y: '85%', label: '₹64,000' },
           ].map((marker, i) => (
             <motion.div
               key={i}
               initial={{ opacity: 0, scale: 0 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
               className="absolute flex flex-col items-center group cursor-default"
               style={{ left: marker.x, top: marker.y }}
             >
                <div className="w-3 h-3 bg-clay rounded-full relative">
                  <div className="absolute inset-0 bg-clay rounded-full animate-ping opacity-75" />
                </div>
                <div className="mt-2 bg-black/80 backdrop-blur-md border border-white/10 px-2 py-1 rounded text-[8px] font-mono text-white/60 opacity-0 group-hover:opacity-100 transition-opacity">
                  {marker.label}
                </div>
             </motion.div>
           ))}
        </div>
      </section>

      {/* Audit Form Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/[0.02] border border-white/10 rounded-[3rem] p-10 md:p-16 backdrop-blur-2xl shadow-2xl relative overflow-hidden group"
          >
             <div className="absolute inset-0 bg-gradient-to-br from-clay/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
             
             <div className="relative z-10">
               <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 text-center mb-8">Audit Your Eligibility for Yureka Secured</h4>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                 <div className="space-y-2">
                   <label className="text-[9px] font-bold uppercase tracking-widest text-white/20 ml-2">Primary Cluster</label>
                   <div className="relative">
                     <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                     <input 
                       type="text" 
                       placeholder="HSR, Indiranagar, etc..." 
                       className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-clay/50 transition-all text-sm"
                     />
                   </div>
                 </div>
                 <div className="space-y-2">
                   <label className="text-[9px] font-bold uppercase tracking-widest text-white/20 ml-2">Portfolio Type</label>
                   <select className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 outline-none focus:border-clay/50 transition-all text-sm appearance-none">
                     <option>Shared Living</option>
                     <option selected>Solo Deployment</option>
                     <option>Premium Suite</option>
                     <option>Villas & Beyond</option>
                   </select>
                 </div>
                 <div className="space-y-2">
                   <label className="text-[9px] font-bold uppercase tracking-widest text-white/20 ml-2">Monthly Commitment</label>
                   <div className="relative">
                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-sm">₹</span>
                     <input 
                       type="text" 
                       defaultValue="50,000"
                       className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-10 pr-4 outline-none focus:border-clay/50 transition-all text-sm"
                     />
                   </div>
                 </div>
               </div>

               <button className="w-full bg-white text-black py-5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-clay hover:text-white transition-all duration-500 mb-8">
                 Run Eligibility Audit
               </button>

               <div className="text-center">
                 <p className="text-[8px] uppercase tracking-widest text-white/10 font-bold flex items-center justify-center gap-2">
                   <div className="w-1 h-1 bg-clay rounded-full" />
                   Data analyzed in real-time across premium clusters
                 </p>
               </div>
             </div>
          </motion.div>

          <div className="text-center mt-20 max-w-2xl mx-auto space-y-6">
            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Yield is the only metric that matters.</h5>
            <h4 className="text-4xl md:text-5xl font-heading font-black tracking-tighter leading-[1.1]">
               Stop accepting <span className="text-clay italic">zero return</span> <br /> on your largest monthly expense.
            </h4>
            <p className="text-white/40 font-serif italic text-base leading-relaxed">
              Yureka Secured converts your rent from a passive cost into an active tool for liquidity management and wealth architecture.
            </p>
          </div>
        </div>
      </section>

      {/* The Projected Saving Dashboard */}
      <section className="relative py-32 px-6 bg-white/[0.01]">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-heading font-black tracking-tighter text-white mb-6 uppercase">The Portfolio Comparison</h2>
          <p className="text-white/40 font-serif italic text-lg max-w-2xl mx-auto">
            Traditional renting is a series of leakages. Yureka Secured is a closed-loop optimization framework.
          </p>

          <div className="mt-12 flex flex-col items-center gap-6">
            <div className="bg-white/5 p-1 rounded-full border border-white/10 flex items-center">
               <button className="px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest bg-clay text-white shadow-xl">Shared Portfolio</button>
               <button className="px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">Solo Portfolio</button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mb-32">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-clay p-8 rounded-[2rem] text-white shadow-2xl shadow-clay/20 transform hover:-translate-y-2 transition-transform duration-500">
                 <h4 className="text-4xl font-black mb-2 tracking-tighter">₹83,225</h4>
                 <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 leading-relaxed">Day 1 Liquidity Recaptured</p>
              </div>
              <div className="bg-[#3D2B1F] p-8 rounded-[2rem] text-white/90 border border-white/5 transform hover:-translate-y-2 transition-transform duration-500">
                 <h4 className="text-4xl font-black mb-2 tracking-tighter">₹48,095</h4>
                 <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 leading-relaxed">11-Month Yield Optimization</p>
              </div>
              <div className="bg-white/5 p-8 rounded-[2rem] text-white/90 border border-white/5 transform hover:-translate-y-2 transition-transform duration-500">
                 <h4 className="text-4xl font-black mb-2 tracking-tighter">0</h4>
                 <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 leading-relaxed">Market Friction Points (Brokerage/Admin)</p>
              </div>
           </div>

           {/* Comparison Matrix */}
           <div className="bg-white/[0.02] border border-white/10 rounded-[3rem] overflow-hidden backdrop-blur-xl">
              <div className="grid grid-cols-3 border-b border-white/10 p-8">
                 <div className="text-[11px] font-black uppercase tracking-widest text-white/20">Metric</div>
                 <div className="text-center text-[11px] font-black uppercase tracking-widest text-clay">Yureka Framework</div>
                 <div className="text-center text-[11px] font-black uppercase tracking-widest text-white/20">Legacy Renting</div>
              </div>

              {[
                { cat: 'Liquidity Optimization', items: [
                  { label: 'Security Deposit', yureka: '₹ 1,05,000', trad: '₹ 1,47,000', sub: 'Optimized 3mo vs Legacy 6mo+' },
                  { label: 'Brokerage Friction', yureka: 'Zero (Non-negotiable)', trad: '₹ 24,500', sub: 'Wasted Capital' },
                  { label: 'Asset Activation', yureka: 'Included', trad: '₹ 20,000', sub: 'Essentials & Infrastructure' }
                ]},
                { cat: 'Systematic Yield', items: [
                  { label: 'Rental Cashback', yureka: 'Systematic 1%', trad: '0.00%', sub: 'Yield on Deployment' },
                  { label: 'Maintenance Yield', yureka: 'Inclusive', trad: '₹ 1,225/mo', sub: 'Hidden Monthly Leakage' },
                  { label: 'Furnishing yield', yureka: '200+ Assets Included', trad: '₹ 6,000/mo', sub: 'High-Depreciation Costs' }
                ]},
                { cat: 'Strategic Performance', items: [
                  { label: 'Effective Monthly', yureka: '₹ 35,000 /mo', trad: '₹ 31,725 /mo', highlight: true },
                  { label: 'Exit / Settlement', yureka: 'Fixed ₹ 5,000', trad: '₹ 30,000+', sub: 'Settlement Risk Protection' }
                ]}
              ].map((section, idx) => (
                <div key={idx} className="border-b border-white/5">
                   <div className="bg-white/[0.02] px-8 py-3 text-[9px] font-black uppercase tracking-widest text-white/10">{section.cat}</div>
                   {section.items.map((item, i) => (
                     <div key={i} className={`grid grid-cols-3 p-8 items-center ${item.highlight ? 'bg-clay/5' : ''}`}>
                        <div className="space-y-1">
                           <div className="text-sm font-bold text-white/80">{item.label}</div>
                           {item.sub && <div className="text-[10px] text-white/20 italic">{item.sub}</div>}
                        </div>
                        <div className="text-center">
                           <div className={`text-sm font-black ${item.yureka.includes('Included') || item.yureka.includes('Zero') || item.yureka.includes('Inclusive') ? 'text-emerald-500' : 'text-white'}`}>{item.yureka}</div>
                        </div>
                        <div className="text-center">
                           <div className="text-sm font-bold text-white/40">{item.trad}</div>
                        </div>
                     </div>
                   ))}
                </div>
              ))}

              <div className="bg-clay p-10 grid grid-cols-3 items-center">
                 <div className="space-y-1">
                    <div className="text-xl font-black text-white uppercase tracking-tighter">Net Exposure</div>
                    <div className="text-[10px] font-bold text-white/60">11-Month Deployment</div>
                 </div>
                 <div className="text-center text-3xl font-black text-white tracking-tighter">₹ 4,01,550</div>
                 <div className="text-center text-3xl font-black text-white/40 tracking-tighter">₹ 4,49,645</div>
              </div>
           </div>
        </div>
      </section>

      {/* Checklist: Performance vs Friction */}
      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-32">
           <div className="bg-white/[0.02] border border-white/10 rounded-[3rem] overflow-hidden backdrop-blur-xl grid grid-cols-2 divide-x divide-white/10">
              <div className="p-10 space-y-4">
                 <h5 className="text-[10px] font-black uppercase tracking-widest text-clay mb-6">Yureka Performance</h5>
                 {[
                   'T+24h Asset Activation', 'Zero Brokerage Policy', 'Institutional Interaction Only', 
                   'Optimized 3mo Deposit', 'Institutional Maintenance', 'Designer Infrastructure',
                   'Fixed Settlement Fee', 'Utility & Infrastructure Included', 'Strategic Peer Matching'
                 ].map((check, i) => (
                   <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                         <CheckCircle2 size={12} className="text-emerald-500" />
                      </div>
                      <span className="text-[11px] text-white/60 font-serif italic">{check}</span>
                   </div>
                 ))}
              </div>
              <div className="p-10 space-y-4 bg-black/40">
                 <h5 className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-6">Legacy Friction</h5>
                 {[
                   '2-4 Weeks Sourcing Cycle', '1mo Rent Sunk Cost', 'Interpersonal Friction',
                   'Locked-up 6-10mo Liquidity', 'Manual Maintenance Sourcing', 'Zero Infrastructure',
                   'Settlement Risk & Deductions', 'Manual Utility Onboarding', 'High-Risk Peer Selection'
                 ].map((item, i) => (
                   <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                         <XIcon size={12} className="text-white/20" />
                      </div>
                      <span className="text-[11px] text-white/20 font-serif italic">{item}</span>
                   </div>
                 ))}
              </div>
           </div>
           <div className="space-y-8">
              <h3 className="text-4xl md:text-6xl font-heading font-black tracking-tighter text-white uppercase leading-none">High-Performance Living. <br /> Institutional Support.</h3>
              <h4 className="text-4xl font-serif italic text-clay">Zero Friction.</h4>
              <p className="text-white/40 font-serif italic text-lg leading-relaxed max-w-md">
                 We remove the "baggage" of legacy renting. No brokers, no surprises, no wasted capital. Home should be an asset, not an admin task.
              </p>
           </div>
        </div>
      </section>

      {/* Credit Arbitrage: The USP */}
      <section className="relative py-32 px-6 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto text-center mb-20">
          <h3 className="text-3xl md:text-5xl font-heading font-black tracking-tighter text-white mb-4 uppercase">
            Credit Arbitrage: <br /> <span className="text-clay italic">The Ultimate Rental Hack</span>
          </h3>
          <p className="text-white/40 font-serif italic text-lg uppercase tracking-widest text-[10px] font-bold">
            Optimize Liquidity with 45-Day Interest-Free Windows
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-0 border border-white/5 divide-y md:divide-y-0 md:divide-x divide-white/5">
          {[
            { 
              val: '45 Days', 
              label: 'Arbitrage', 
              desc: 'Deploy rental capital interest-free for 45 days. Maximize your liquid cash flow.',
              icon: <Clock size={40} className="text-clay" />
            },
            { 
              val: '1% Yield', 
              label: 'Systematic', 
              desc: 'Earn guaranteed 1% cashback on every rental deployment. No caps, no exclusions.',
              icon: <TrendingUp size={40} className="text-clay" />
            },
            { 
              val: 'Zero Deposit', 
              label: 'Optimization', 
              desc: 'Unlock your dead capital. Redirect security deposits into higher-yield investments.',
              icon: <Scale size={40} className="text-clay" />
            },
            { 
              val: '70% Savings', 
              label: 'Fee Friction', 
              desc: 'Industry-low net effective fees. We prioritize your delta, not bank profit.',
              icon: <BadgePercent size={40} className="text-clay" />
            }
          ].map((feat, i) => (
            <div key={i} className="p-10 flex flex-col items-center text-center group hover:bg-white/[0.02] transition-colors">
               <div className="w-32 h-32 rounded-full border-2 border-white/5 flex items-center justify-center mb-8 group-hover:border-clay/20 transition-all">
                  {feat.icon}
               </div>
               <div className="mb-4">
                  <span className="block text-2xl font-black text-clay uppercase">{feat.val}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">{feat.label}</span>
               </div>
               <p className="text-white/40 font-serif italic text-sm leading-relaxed max-w-[200px]">
                 {feat.desc}
               </p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Portfolios */}
      <section className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
           <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tighter text-white uppercase">High-Yield <span className="text-clay italic">Residential Clusters</span></h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'Belmont Portfolio', img: '/premium_apartment_interiors_1_1778480716810.png', tag: 'Alpha Yield', price: '₹35,000' },
                { name: 'Caesar Portfolio', img: '/premium_apartment_interiors_2_1778480767298.png', tag: 'Optimal Choice', price: '₹28,000' },
                { name: 'Fairmont Portfolio', img: '/premium_apartment_interiors_3_1778480897500.png', tag: 'High-Net Elite', price: '₹36,000' }
              ].map((prop, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] overflow-hidden group hover:border-clay/50 transition-all duration-700 shadow-2xl">
                   <div className="relative aspect-[4/3] overflow-hidden">
                      <img src={prop.img} alt={prop.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                      <div className="absolute top-6 left-6 bg-clay/90 backdrop-blur-md text-white text-[8px] font-black uppercase px-4 py-2 rounded-full tracking-widest">
                         {prop.tag}
                      </div>
                   </div>
                   <div className="p-8">
                      <h4 className="text-3xl font-heading font-black text-white mb-6 tracking-tighter uppercase">{prop.name}</h4>
                      <div className="grid grid-cols-2 gap-4 mb-8">
                         <div className="flex items-center gap-2">
                            <Clock size={14} className="text-clay" />
                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Available Now</span>
                         </div>
                         <div className="flex items-center gap-2 text-white/40">
                            <MapPin size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">3 BHK Suite</span>
                         </div>
                      </div>
                      <div className="pt-8 border-t border-white/5 flex items-end justify-between">
                         <div>
                            <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">Deployment From</div>
                            <div className="text-3xl font-black text-white">{prop.price}<span className="text-xs font-normal text-white/40 ml-1">/mo</span></div>
                         </div>
                         <button className="w-12 h-12 bg-clay text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                            <ArrowRight size={20} />
                         </button>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Closing Illustration Section */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
           <div className="relative aspect-video rounded-[3rem] overflow-hidden group shadow-2xl border border-white/5">
              <img 
                src="/roman_renting_illustration_1778480248693.png" 
                alt="Elite Renting" 
                className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
           </div>

           <div className="mt-20 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="max-w-xl">
                 <h2 className="text-4xl md:text-6xl font-heading font-black tracking-tighter leading-none mb-4">
                   WELCOME TO THE <br /> <span className="text-clay italic">RIGHT SIDE OF RENTING.</span>
                 </h2>
                 <p className="text-white/30 font-serif italic">Join the high-performance spenders who treat rent as an asset.</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                 <Link 
                   to="/join-waitlist"
                   className="bg-clay text-white px-12 py-5 rounded-full font-bold uppercase tracking-widest text-[11px] hover:bg-white hover:text-black transition-all shadow-2xl shadow-clay/20"
                 >
                   Join the Waitlist
                 </Link>
                 <Link 
                   to="/contribute"
                   className="bg-white/5 border border-white/10 text-white px-12 py-5 rounded-full font-bold uppercase tracking-widest text-[11px] hover:bg-white hover:text-black transition-all"
                 >
                   Strategic Audit
                 </Link>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default ByEveryone;
