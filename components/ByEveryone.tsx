import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  CreditCard, 
  MapPin, 
  BarChart3, 
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
  Scale,
  Users,
  Search,
  Lock,
  Globe
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
            <span className="text-clay font-bold text-[10px] uppercase tracking-[0.4em] mb-6 block">Intelligence Protocol: YR-COM-01</span>
            <h1 className="text-5xl md:text-8xl font-heading font-black mb-6 tracking-tighter leading-none">
              BY EVERYONE. <br /> <span className="text-clay inline-block relative italic">
                FOR EVERYONE.
                <motion.div 
                  className="absolute -bottom-2 left-0 w-full h-1 bg-clay/30"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </span>
            </h1>
            <h2 className="text-2xl md:text-4xl font-serif text-white/80 mb-8 font-light italic">
              The Collective Power of Elite Spenders
            </h2>
            <p className="text-white/40 text-sm md:text-base max-w-2xl mx-auto leading-relaxed mb-12 font-serif italic">
              Credit data is fragmented. Banks benefit from your lack of information. Yureka Secured is the community's response—a transparent, real-time ledger of reward hacks, exclusions, and strategic optimizations.
            </p>

            <div className="flex flex-col items-center gap-4">
              <Link 
                to="/join-waitlist"
                className="bg-white text-black px-12 py-5 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-clay hover:text-white transition-all duration-500 shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:shadow-clay/20 group"
              >
                Join the Intelligence Network
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

      {/* The Problem: Data Asymmetry */}
      <section className="relative py-32 px-6 border-y border-white/5 bg-white/[0.01]">
         <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
               <span className="text-clay font-bold text-[10px] uppercase tracking-[0.3em]">The Data Gap</span>
               <h3 className="text-4xl md:text-6xl font-heading font-black tracking-tighter text-white uppercase leading-none">
                  Knowledge is <br /> <span className="text-clay italic">gatekept.</span>
               </h3>
               <div className="space-y-6 font-serif italic text-white/40 text-lg leading-relaxed">
                  <p>
                     Most credit card "benefits" are buried in PDFs or obscured by complex T&Cs. The best hacks for utility payments, insurance, and international spends are hidden by design.
                  </p>
                  <p>
                     When we share data, we eliminate the house edge. Collective intelligence is the ultimate arbitrage.
                  </p>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               {[
                 { label: 'Network Points', val: '500M+', sub: 'Analyzed Monthly' },
                 { label: 'Hidden Hacks', val: '2,400+', sub: 'Community Verified' },
                 { label: 'Real-time Yield', val: '8.4%', sub: 'Average Optimized ROI' },
                 { label: 'Data Friction', val: '0%', sub: 'Pure Community Insight' }
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

      {/* The Map: Global Reward Optimization */}
      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto text-center mb-20">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-heading font-black tracking-tighter text-white/90 mb-4 uppercase"
          >
            INR <span className="text-clay">20 crores+</span> in rewards optimized by the community
          </motion.h3>
          <p className="text-white/40 font-serif italic text-lg">
            Real-time data flow from high-net-worth spenders across global hubs
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
             { x: '15%', y: '30%', label: 'HSR' },
             { x: '35%', y: '60%', label: 'Indiranagar' },
             { x: '55%', y: '40%', label: 'Gurgaon' },
             { x: '75%', y: '70%', label: 'BKC' },
             { x: '85%', y: '20%', label: 'Manhattan' },
             { x: '25%', y: '80%', label: 'Canary Wharf' },
             { x: '45%', y: '15%', label: 'Dubai Marina' },
             { x: '65%', y: '85%', label: 'Singapore' },
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
               <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 text-center mb-8">Audit Your Contribution Power</h4>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                 <div className="space-y-2">
                   <label className="text-[9px] font-bold uppercase tracking-widest text-white/20 ml-2">Primary Card</label>
                   <div className="relative">
                     <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                     <input 
                       type="text" 
                       placeholder="Infinia, Magnus, etc..." 
                       className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-clay/50 transition-all text-sm"
                     />
                   </div>
                 </div>
                 <div className="space-y-2">
                   <label className="text-[9px] font-bold uppercase tracking-widest text-white/20 ml-2">Spending Tier</label>
                   <select className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 outline-none focus:border-clay/50 transition-all text-sm appearance-none">
                     <option>Growth Tier (&lt;5L)</option>
                     <option selected>Elite Tier (5L-20L)</option>
                     <option>Private Tier (20L-50L)</option>
                     <option>Centurion Tier (50L+)</option>
                   </select>
                 </div>
                 <div className="space-y-2">
                   <label className="text-[9px] font-bold uppercase tracking-widest text-white/20 ml-2">Monthly Optimization</label>
                   <div className="relative">
                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-sm">₹</span>
                     <input 
                       type="text" 
                       defaultValue="1,50,000"
                       className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-10 pr-4 outline-none focus:border-clay/50 transition-all text-sm"
                     />
                   </div>
                 </div>
               </div>

               <button className="w-full bg-white text-black py-5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-clay hover:text-white transition-all duration-500 mb-8">
                 Analyze My Impact
               </button>

               <div className="text-center">
                 <p className="text-[8px] uppercase tracking-widest text-white/10 font-bold flex items-center justify-center gap-2">
                   <div className="w-1 h-1 bg-clay rounded-full" />
                   Your data is anonymized and encrypted via Yureka-SEC protocols.
                 </p>
               </div>
             </div>
          </motion.div>

          <div className="text-center mt-20 max-w-2xl mx-auto space-y-6">
            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Collective leverage is the future.</h5>
            <h4 className="text-4xl md:text-5xl font-heading font-black tracking-tighter leading-[1.1]">
               Stop fighting <span className="text-clay italic">the system</span> alone.
            </h4>
            <p className="text-white/40 font-serif italic text-base leading-relaxed">
              Yureka.Money is the infrastructure for a more transparent financial world. We use community data to negotiate better, spend smarter, and win together.
            </p>
          </div>
        </div>
      </section>

      {/* The Intelligence Matrix - Comparison */}
      <section className="relative py-32 px-6 bg-white/[0.01]">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-heading font-black tracking-tighter text-white mb-6 uppercase">Individual vs Collective</h2>
          <p className="text-white/40 font-serif italic text-lg max-w-2xl mx-auto">
            Traditional research is limited by your own experience. Yureka Intelligence is powered by the combined experience of 50,000+ elite users.
          </p>
        </div>

        <div className="max-w-6xl mx-auto mb-32">
           {/* Comparison Matrix */}
           <div className="bg-white/[0.02] border border-white/10 rounded-[3rem] overflow-hidden backdrop-blur-xl">
              <div className="grid grid-cols-3 border-b border-white/10 p-8">
                 <div className="text-[11px] font-black uppercase tracking-widest text-white/20">Metric</div>
                 <div className="text-center text-[11px] font-black uppercase tracking-widest text-clay">Yureka Intelligence</div>
                 <div className="text-center text-[11px] font-black uppercase tracking-widest text-white/20">Solo Research</div>
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
                   <div className="bg-white/[0.02] px-8 py-3 text-[9px] font-black uppercase tracking-widest text-white/10">{section.cat}</div>
                   {section.items.map((item, i) => (
                     <div key={i} className={`grid grid-cols-3 p-8 items-center ${item.highlight ? 'bg-clay/5' : ''}`}>
                        <div className="space-y-1">
                           <div className="text-sm font-bold text-white/80">{item.label}</div>
                           {item.sub && <div className="text-[10px] text-white/20 italic">{item.sub}</div>}
                        </div>
                        <div className="text-center">
                           <div className={`text-sm font-black ${item.yureka.includes('Verified') || item.yureka.includes('Comprehensive') || item.yureka.includes('Optimized') ? 'text-emerald-500' : 'text-white'}`}>{item.yureka}</div>
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
                    <div className="text-xl font-black text-white uppercase tracking-tighter">Yield Delta</div>
                    <div className="text-[10px] font-bold text-white/60">Performance Gap</div>
                 </div>
                 <div className="text-center text-3xl font-black text-white tracking-tighter">~4.5x More Value</div>
                 <div className="text-center text-3xl font-black text-white/40 tracking-tighter">Baseline Value</div>
              </div>
           </div>
        </div>
      </section>

      {/* Featured Portfolios - The Wall of Intelligence */}
      <section className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
           <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tighter text-white uppercase">Elite <span className="text-clay italic">Card Portfolios</span></h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'Travel Titan Portfolio', img: '/premium_apartment_interiors_1_1778480716810.png', tag: 'Airlines / Hotels', price: '12.5% ROI' },
                { name: 'Cashback Alpha Portfolio', img: '/premium_apartment_interiors_2_1778480767298.png', tag: 'Pure Savings', price: '8.4% ROI' },
                { name: 'Luxury Lifestyle Portfolio', img: '/premium_apartment_interiors_3_1778480897500.png', tag: 'Perks / Concierge', price: '6.2% ROI' }
              ].map((prop, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] overflow-hidden group hover:border-clay/50 transition-all duration-700 shadow-2xl">
                   <div className="relative aspect-[4/3] overflow-hidden">
                      <img src={prop.img} alt={prop.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-50" />
                      <div className="absolute top-6 left-6 bg-clay/90 backdrop-blur-md text-white text-[8px] font-black uppercase px-4 py-2 rounded-full tracking-widest">
                         {prop.tag}
                      </div>
                   </div>
                   <div className="p-8">
                      <h4 className="text-3xl font-heading font-black text-white mb-6 tracking-tighter uppercase">{prop.name}</h4>
                      <div className="grid grid-cols-2 gap-4 mb-8">
                         <div className="flex items-center gap-2">
                            <Users size={14} className="text-clay" />
                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">12k+ Adopters</span>
                         </div>
                         <div className="flex items-center gap-2 text-white/40">
                            <TrendingUp size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Top Perfomer</span>
                         </div>
                      </div>
                      <div className="pt-8 border-t border-white/5 flex items-end justify-between">
                         <div>
                            <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">Target Yield</div>
                            <div className="text-3xl font-black text-white">{prop.price}</div>
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

      {/* Closing Section */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
           <div className="relative aspect-video rounded-[3rem] overflow-hidden group shadow-2xl border border-white/5">
              <img 
                src="/roman_renting_illustration_1778480248693.png" 
                alt="Elite Intelligence" 
                className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
           </div>

           <div className="mt-20 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="max-w-xl">
                 <h2 className="text-4xl md:text-6xl font-heading font-black tracking-tighter leading-none mb-4 uppercase">
                   POWER TO THE <br /> <span className="text-clay italic">SPENDER.</span>
                 </h2>
                 <p className="text-white/30 font-serif italic">Join the high-performance spenders who treat credit as an asset.</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                 <Link 
                   to="/join-waitlist"
                   className="bg-clay text-white px-12 py-5 rounded-full font-bold uppercase tracking-widest text-[11px] hover:bg-white hover:text-black transition-all shadow-2xl shadow-clay/20"
                 >
                   Access Network
                 </Link>
                 <Link 
                   to="/contribute"
                   className="bg-white/5 border border-white/10 text-white px-12 py-5 rounded-full font-bold uppercase tracking-widest text-[11px] hover:bg-white hover:text-black transition-all"
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
