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
  X as XIcon
} from 'lucide-react';
import SEO from './SEO';

const ByEveryone: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden selection:bg-clay selection:text-black">
      <SEO 
        title="By Everyone, For Everyone | Yureka Rent Rewards" 
        description="Earn 1% back on every timely rent payment. Because habits like yours should be rewarded, not overlooked."
      />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_center,rgba(230,126,34,0.05)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="max-w-4xl mx-auto text-center relative z-10 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-8xl font-heading font-black mb-6 tracking-tighter leading-none">
              Earn <span className="text-clay inline-block relative">
                1% back
                <motion.div 
                  className="absolute -bottom-2 left-0 w-full h-1 bg-clay/30"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </span>
            </h1>
            <h2 className="text-2xl md:text-4xl font-serif text-white/80 mb-8 font-light italic">
              On every timely rent payment
            </h2>
            <p className="text-white/40 text-sm md:text-base max-w-lg mx-auto leading-relaxed mb-12 font-serif italic">
              Because habits like yours should be rewarded, not overlooked.
            </p>

            <div className="flex flex-col items-center gap-4">
              <Link 
                to="/join-waitlist"
                className="bg-white text-black px-12 py-5 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-clay hover:text-white transition-all duration-500 shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:shadow-clay/20 group"
              >
                Join the Waitlist
                <motion.span 
                  className="inline-block ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ArrowRight size={18} />
                </motion.span>
              </Link>
              <div className="w-12 h-px bg-white/20 mt-4" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Map / Stats Section */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto text-center relative z-10 mb-20">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-heading font-black tracking-tighter text-white/90 mb-4 uppercase"
          >
            INR <span className="text-clay">20 crores+</span> worth of rent processed so far
          </motion.h3>
          <p className="text-white/40 font-serif italic text-lg">
            Across most sought-after neighbourhoods of Bengaluru
          </p>
        </div>

        {/* Map Visualization */}
        <div className="relative w-full aspect-[21/9] md:aspect-[21/7] max-w-7xl mx-auto opacity-40">
           {/* Map Background Placeholder (Abstract SVG Map) */}
           <svg viewBox="0 0 1000 400" className="w-full h-full text-white/5 fill-current">
             <path d="M100,50 Q150,20 200,80 T300,100 T450,50 T600,120 T800,80 T950,150" fill="none" stroke="currentColor" strokeWidth="0.5" />
             <path d="M50,150 Q100,120 180,180 T350,150 T550,220 T750,180 T900,250" fill="none" stroke="currentColor" strokeWidth="0.5" />
             <path d="M150,250 Q250,220 380,280 T550,250 T750,320 T950,280" fill="none" stroke="currentColor" strokeWidth="0.5" />
           </svg>
           
           {/* Glowing Pulse Markers */}
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

      {/* Eligibility Form Section */}
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
               <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 text-center mb-8">Check if you're eligible for Yureka Secured</h4>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                 <div className="space-y-2">
                   <label className="text-[9px] font-bold uppercase tracking-widest text-white/20 ml-2">Area</label>
                   <div className="relative">
                     <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                     <input 
                       type="text" 
                       placeholder="Your society name..." 
                       className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-clay/50 transition-all text-sm"
                     />
                   </div>
                 </div>
                 <div className="space-y-2">
                   <label className="text-[9px] font-bold uppercase tracking-widest text-white/20 ml-2">Configuration</label>
                   <select className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 outline-none focus:border-clay/50 transition-all text-sm appearance-none">
                     <option>1 BHK</option>
                     <option selected>2 BHK</option>
                     <option>3 BHK</option>
                     <option>4 BHK+</option>
                   </select>
                 </div>
                 <div className="space-y-2">
                   <label className="text-[9px] font-bold uppercase tracking-widest text-white/20 ml-2">Monthly Rent</label>
                   <div className="relative">
                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-sm">₹</span>
                     <input 
                       type="text" 
                       defaultValue="25,000"
                       className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-10 pr-4 outline-none focus:border-clay/50 transition-all text-sm"
                     />
                   </div>
                 </div>
               </div>

               <button className="w-full bg-white/5 border border-white/10 py-5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all duration-500 mb-8">
                 Check eligibility
               </button>

               <div className="text-center">
                 <p className="text-[8px] uppercase tracking-widest text-white/10 font-bold flex items-center justify-center gap-2">
                   <div className="w-1 h-1 bg-clay rounded-full" />
                   You consent to share your rental data
                 </p>
               </div>
             </div>
          </motion.div>

          <div className="text-center mt-20 max-w-2xl mx-auto space-y-6">
            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Rent is your biggest monthly commitment.</h5>
            <h4 className="text-4xl md:text-5xl font-heading font-black tracking-tighter leading-[1.1]">
              You've <span className="text-clay italic">handled it responsibly,</span> <br /> but it's never really led to anything
            </h4>
            <p className="text-white/40 font-serif italic text-base leading-relaxed">
              Secured changes that with a simple cashback today, and ultimately opens doors to renting benefits that you truly deserve.
            </p>
          </div>
        </div>
      </section>

      {/* The True Cost of Renting - Comparison Section */}
      <section className="relative py-32 px-6 bg-white/[0.01]">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-heading font-black tracking-tighter text-white mb-6 uppercase">The True Cost of Renting</h2>
          <p className="text-white/40 font-serif italic text-lg max-w-2xl mx-auto">
            Rent is never just rent. Add deposits, brokerage, furnishing, maintenance – the picture changes. Let's compare honestly.
          </p>

          <div className="mt-12 flex flex-col items-center gap-6">
            <div className="bg-white/5 p-1 rounded-full border border-white/10 flex items-center">
               <button className="px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest bg-clay text-white shadow-xl">Shared Living</button>
               <button className="px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">Solo Living</button>
            </div>
            <div className="relative group w-64">
               <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 flex items-center justify-between cursor-pointer group-hover:border-white/30 transition-all">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">HSR Layout</span>
                  <ChevronDown size={16} className="text-white/40" />
               </div>
            </div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-white/20">Traditional rental defaults use average market rates from multiple sources.</p>
          </div>
        </div>

        {/* Comparison Dashboard */}
        <div className="max-w-6xl mx-auto mb-32">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-clay p-8 rounded-[2rem] text-white shadow-2xl shadow-clay/20 transform hover:-translate-y-2 transition-transform duration-500">
                 <h4 className="text-4xl font-black mb-2 tracking-tighter">₹83,225</h4>
                 <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 leading-relaxed">Saved on day 1 of moving into a Yureka home</p>
              </div>
              <div className="bg-[#3D2B1F] p-8 rounded-[2rem] text-white/90 border border-white/5 transform hover:-translate-y-2 transition-transform duration-500">
                 <h4 className="text-4xl font-black mb-2 tracking-tighter">₹48,095</h4>
                 <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 leading-relaxed">Saved over 11 months due to additional costs</p>
              </div>
              <div className="bg-[#8B0000]/40 p-8 rounded-[2rem] text-white/90 border border-white/5 transform hover:-translate-y-2 transition-transform duration-500">
                 <h4 className="text-4xl font-black mb-2 tracking-tighter">0</h4>
                 <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 leading-relaxed">Brokerage calls, landlord visits, flatmate interviews & painting...</p>
              </div>
           </div>

           {/* Comparison Table */}
           <div className="bg-white/[0.02] border border-white/10 rounded-[3rem] overflow-hidden backdrop-blur-xl">
              <div className="grid grid-cols-3 border-b border-white/10 p-8">
                 <div className="text-[11px] font-black uppercase tracking-widest text-white/20">Costs</div>
                 <div className="text-center text-[11px] font-black uppercase tracking-widest text-clay">Yureka</div>
                 <div className="text-center text-[11px] font-black uppercase tracking-widest text-white/20">Traditional Renting</div>
              </div>

              {[
                { cat: 'Monthly Costs', items: [
                  { label: 'Rent', yureka: '₹ 35,000', trad: '₹ 24,500' },
                  { label: 'Maintenance', yureka: 'Inclusive', trad: '₹ 1,225' },
                  { label: 'Furnishing', yureka: '200+ items included', trad: '₹ 6,000/mo', sub: '8 items via Furlenco/Rentomojo' }
                ]},
                { cat: 'Effective Monthly', items: [
                  { label: 'Total Monthly', yureka: '₹ 35,000 /mo', trad: '₹ 31,725 /mo', highlight: true }
                ]},
                { cat: 'One-time & Hidden Costs', items: [
                  { label: 'Security Deposit', yureka: '₹ 1,05,000', trad: '₹ 1,47,000', sub: '3 months vs 6 months typical' },
                  { label: 'Brokerage', yureka: 'Zero, always!', trad: '₹ 24,500', sub: '1 month rent typical' },
                  { label: 'Essentials', yureka: 'Included', trad: '₹ 20,000', sub: 'Kitchenware, curtains, bedding' },
                  { label: 'Exit / Painting', yureka: '₹ 5,000', trad: '₹ 30,000', sub: 'Fixed exit fee vs surprise deductions' },
                  { label: 'Flatmate Vacancy', yureka: 'We match flatmates', trad: '₹ 10,000', sub: 'Returns lost @ 12% p.a.' }
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
                           <div className={`text-sm font-black ${item.yureka === 'Inclusive' || item.yureka === 'Included' || item.yureka === 'Zero, always!' ? 'text-emerald-500' : 'text-white'}`}>{item.yureka}</div>
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
                    <div className="text-xl font-black text-white uppercase tracking-tighter">Grand Total</div>
                    <div className="text-[10px] font-bold text-white/60">11 Months</div>
                 </div>
                 <div className="text-center text-3xl font-black text-white tracking-tighter">₹ 4,01,550</div>
                 <div className="text-center text-3xl font-black text-white/40 tracking-tighter">₹ 4,49,645</div>
              </div>
           </div>

           {/* Share CTA */}
           <div className="mt-12 flex flex-col md:flex-row items-center justify-between bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
              <div className="flex items-center gap-6 mb-6 md:mb-0">
                 <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white/20">
                    <Share2 size={32} />
                 </div>
                 <div>
                    <h5 className="text-lg font-black text-white uppercase tracking-tighter">Share this calculation</h5>
                    <p className="text-[11px] text-white/40 italic font-serif">Friend wants to know how Yureka is better? Share this with them!</p>
                 </div>
              </div>
              <button className="bg-white text-black px-10 py-4 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-clay hover:text-white transition-all shadow-xl">
                Share Calculation
              </button>
           </div>
        </div>
      </section>

      {/* A Complete Home vs Just the Basics */}
      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 mb-32">
           <div className="lg:col-span-4">
              <h3 className="text-4xl font-heading font-black tracking-tighter text-white mb-6 uppercase leading-none">A complete home vs <br /> Just the basics</h3>
              <p className="text-white/40 font-serif italic text-lg leading-relaxed mb-8">
                 Going home feels effortless because everything you need is already there. Yureka brings that same feeling to renting.
              </p>
              <button className="flex items-center gap-3 bg-white/5 border border-white/10 px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all">
                Chat with us
              </button>
           </div>

           <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl group hover:border-clay/30 transition-colors">
                 <div className="text-clay text-4xl font-black mb-4">200+</div>
                 <h5 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-8">Items included with Yureka</h5>
                 <div className="space-y-6">
                    <div>
                       <div className="text-xs font-bold text-white mb-2 uppercase tracking-widest">Furniture</div>
                       <p className="text-[11px] text-white/40 font-serif italic">Bed, mattress, wardrobe, desk, chair, sofa, 4-seater dining</p>
                    </div>
                    <div>
                       <div className="text-xs font-bold text-white mb-2 uppercase tracking-widest">Appliances</div>
                       <p className="text-[11px] text-white/40 font-serif italic">AC, washing machine, microwave, grinder, water purifier</p>
                    </div>
                    <div>
                       <div className="text-xs font-bold text-white mb-2 uppercase tracking-widest">Kitchen</div>
                       <p className="text-[11px] text-white/40 font-serif italic">Cookware, cutlery, crockery, full utensil set</p>
                    </div>
                 </div>
              </div>
              <div className="bg-white/[0.01] border border-white/5 rounded-[2.5rem] p-10 text-white/30">
                 <div className="text-4xl font-black mb-4">8</div>
                 <h5 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-8">Items typically rented</h5>
                 <p className="text-[11px] font-serif italic mb-6">Bed, mattress, wardrobe, desk, chair, sofa, dining table, washing machine.</p>
                 <p className="text-[11px] font-serif italic">No kitchenware, curtains, bedsheets, or appliances.</p>
              </div>
           </div>
        </div>

        {/* Comparison Checklist */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-32">
           <div className="bg-white/[0.02] border border-white/10 rounded-[3rem] overflow-hidden backdrop-blur-xl grid grid-cols-2 divide-x divide-white/10">
              <div className="p-10 space-y-4">
                 <h5 className="text-[10px] font-black uppercase tracking-widest text-clay mb-6">With Yureka</h5>
                 {[
                   'Move in tomorrow', 'Zero brokerage, always', 'No landlord interaction', 
                   '3 months deposit', 'Maintenance handled by Yureka', 'Designer home, ready to live',
                   '₹5,000 exit fee – that\'s it', 'Wi-Fi & water purifier included', 'Flatmate matching by Yureka'
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
                 <h5 className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-6">Traditional Renting</h5>
                 {[
                   '2-4 weeks of house hunting', '1 month rent to a broker', 'Monthly landlord visits & opinions',
                   '6-10 months deposit locked up', 'You call the plumber yourself', 'Empty flat, start from zero',
                   '₹30k+ painting & surprise deductions', 'Arrange and install yourself', 'Weeks of interviews & guessing'
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
              <h3 className="text-4xl md:text-6xl font-heading font-black tracking-tighter text-white uppercase leading-none">Traditional renting comes with baggage.</h3>
              <h4 className="text-4xl font-serif italic text-clay">Yureka doesn't.</h4>
              <p className="text-white/40 font-serif italic text-lg leading-relaxed max-w-md">
                 From move-in to maintenance, Yureka removes the hassles you'd usually inherit, because home should start with comfort, not with brokers, surprises, and endless admin.
              </p>
              <button className="bg-white text-black px-10 py-5 rounded-full font-bold uppercase tracking-widest text-[11px] hover:bg-clay hover:text-white transition-all shadow-xl">
                 Chat with us
              </button>
           </div>
        </div>

        {/* Featured Properties Section */}
        <div className="max-w-7xl mx-auto">
           <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tighter text-white uppercase">Homes in <span className="text-clay italic">HSR Layout</span></h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'Belmont', img: '/premium_apartment_interiors_1_1778480716810.png', tag: 'Female Only', price: '₹35,000' },
                { name: 'Caesar', img: '/premium_apartment_interiors_2_1778480767298.png', tag: 'Available Now', price: '₹28,000' },
                { name: 'Fairmont', img: '/premium_apartment_interiors_3_1778480897500.png', tag: 'Available Now', price: '₹36,000' }
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
                            <span className="text-[10px] font-bold uppercase tracking-widest">3 BHK</span>
                         </div>
                      </div>
                      <div className="pt-8 border-t border-white/5 flex items-end justify-between">
                         <div>
                            <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">Starting From</div>
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

           <div className="text-center mt-16">
              <button className="bg-white/5 border border-white/10 text-white px-12 py-5 rounded-full font-bold uppercase tracking-widest text-[11px] hover:bg-white hover:text-black transition-all">
                 View more in HSR Layout
              </button>
           </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="relative py-32 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-0 border border-white/5 divide-y md:divide-y-0 md:divide-x divide-white/5">
          
          {/* Card 1 */}
          <div className="p-10 md:p-16 flex flex-col items-center text-center group hover:bg-white/[0.01] transition-colors duration-700">
             <div className="mb-8 relative">
               <div className="absolute top-0 right-0 bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase px-2 py-1 rounded-full flex items-center gap-1">
                 <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                 Live Now
               </div>
               <div className="w-40 h-40 rounded-full border-2 border-white/5 flex items-center justify-center relative">
                 <motion.div 
                   className="absolute inset-0 rounded-full border-2 border-clay border-t-transparent"
                   animate={{ rotate: 360 }}
                   transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                 />
                 <div className="text-center">
                    <span className="block text-4xl font-black text-clay">1%</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">Back</span>
                 </div>
               </div>
             </div>
             <div className="bg-clay/5 border border-clay/10 rounded-full px-4 py-2 mb-8 flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-clay rounded-full" />
               <span className="text-[10px] font-bold text-clay">+₹250 earned</span>
             </div>
             <p className="text-white/40 font-serif italic text-base">
               <span className="text-white font-bold not-italic">1% cashback</span> on timely rental payment
             </p>
          </div>

          {/* Card 2 */}
          <div className="p-10 md:p-16 flex flex-col items-center text-center group hover:bg-white/[0.01] transition-colors duration-700">
             <div className="mb-8 relative">
               <div className="absolute top-0 right-0 bg-white/5 text-white/40 text-[8px] font-black uppercase px-2 py-1 rounded-full">
                 Coming Soon
               </div>
               <div className="w-40 h-40 flex items-center justify-center">
                 <div className="w-24 h-24 bg-clay/5 rounded-2xl border border-clay/10 flex items-center justify-center rotate-45 group-hover:rotate-[135deg] transition-all duration-1000">
                    <ShieldCheck size={40} className="text-clay -rotate-45 group-hover:-rotate-[135deg] transition-all duration-1000" />
                 </div>
               </div>
             </div>
             <div className="mb-8 flex items-center gap-4">
                <span className="text-2xl font-serif text-white/20 line-through">₹75,000</span>
                <ArrowRight className="text-white/20" size={20} />
                <span className="text-4xl font-black text-white">₹0</span>
             </div>
             <p className="text-white/40 font-serif italic text-base">
               <span className="text-white font-bold not-italic">Zero</span> security deposits
             </p>
          </div>

          {/* Card 3 */}
          <div className="p-10 md:p-16 flex flex-col items-center text-center group hover:bg-white/[0.01] transition-colors duration-700">
             <div className="mb-8 relative">
               <div className="absolute top-0 right-0 bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase px-2 py-1 rounded-full flex items-center gap-1">
                 <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                 Live Now
               </div>
               <div className="w-40 h-40 flex items-center justify-center">
                 <div className="text-center">
                    <span className="block text-4xl font-black text-clay">₹15,000</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">Move-out bonus</span>
                 </div>
               </div>
             </div>
             <div className="mb-8 flex items-center justify-center gap-4">
                <div className="w-8 h-8 rounded-full border border-clay/30 flex items-center justify-center"><CheckCircle2 size={16} className="text-clay" /></div>
                <div className="w-10 h-px bg-white/10" />
                <div className="w-8 h-8 rounded-full border border-clay/30 flex items-center justify-center"><CheckCircle2 size={16} className="text-clay" /></div>
                <div className="w-10 h-px bg-white/10" />
                <div className="w-8 h-8 rounded-full border border-clay/30 flex items-center justify-center relative">
                   <div className="w-2 h-2 bg-clay rounded-full" />
                </div>
             </div>
             <p className="text-white/40 font-serif italic text-base">
               Get <span className="text-white font-bold not-italic">₹15,000 cash</span> when you move out
             </p>
          </div>

        </div>
      </section>

      {/* Pay Rent with Credit Card Features */}
      <section className="relative py-32 px-6 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto text-center mb-20">
          <h3 className="text-3xl md:text-5xl font-heading font-black tracking-tighter text-white mb-4 uppercase">
            Yes, you can pay rent <br /> <span className="text-clay italic">using your credit card here</span>
          </h3>
          <p className="text-white/40 font-serif italic text-lg uppercase tracking-widest text-[10px] font-bold">
            And yes, you still earn 1% back
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-0 border border-white/5 divide-y md:divide-y-0 md:divide-x divide-white/5">
          {[
            { 
              val: '2 min', 
              label: 'setup', 
              desc: 'One-time setup, lightning fast payments',
              icon: <Zap size={40} className="text-clay" />
            },
            { 
              val: 'Collect points', 
              label: '', 
              desc: 'Collect points on every rent payment',
              icon: <Coins size={40} className="text-clay" />
            },
            { 
              val: '45', 
              label: 'DAYS', 
              desc: 'Interest-free window. Get upto 45 days of interest free breathing room',
              icon: <Calendar size={40} className="text-clay" />
            },
            { 
              val: 'Save 70%', 
              label: '', 
              desc: 'Industry low net effective convenience fee',
              icon: <BadgePercent size={40} className="text-clay" />
            }
          ].map((feat, i) => (
            <div key={i} className="p-10 flex flex-col items-center text-center group hover:bg-white/[0.02] transition-colors">
               <div className="w-32 h-32 rounded-full border-2 border-white/5 flex items-center justify-center mb-8 group-hover:border-clay/20 transition-all">
                  {feat.icon}
               </div>
               <div className="mb-4">
                  <span className="block text-3xl font-black text-clay uppercase">{feat.val}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">{feat.label}</span>
               </div>
               <p className="text-white/40 font-serif italic text-sm leading-relaxed max-w-[200px]">
                 {feat.desc}
               </p>
            </div>
          ))}
        </div>
      </section>

      {/* Invite Tenant Section */}
      <section className="relative py-32 px-6 overflow-hidden">
        {/* Cityscape Silhouette Background */}
        <div className="absolute bottom-0 left-0 w-full h-[300px] opacity-[0.05] pointer-events-none select-none flex items-end justify-center">
           <div className="flex gap-4">
              {[80, 120, 200, 150, 180, 250, 140, 160].map((h, i) => (
                <div key={i} className="w-12 bg-clay" style={{ height: `${h}px` }} />
              ))}
           </div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white/20 block mb-6">GET STARTED</span>
          <h3 className="text-4xl md:text-6xl font-heading font-black tracking-tighter text-white mb-8">
            Invite your <span className="text-clay italic">tenant</span>
          </h3>
          <p className="text-white/40 font-serif italic text-lg max-w-lg mx-auto mb-12">
            Send them an invite to join Secured and activate your free rental cover.
          </p>

          <div className="max-w-md mx-auto bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-xl">
             <div className="text-left mb-6">
                <label className="text-[9px] font-bold uppercase tracking-widest text-white/20 ml-2 mb-2 block">Tenant's phone number</label>
                <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl p-2 focus-within:border-clay/50 transition-all">
                   <div className="flex items-center gap-2 px-4 border-r border-white/10">
                      <span className="text-lg">🇮🇳</span>
                      <span className="text-sm font-bold text-white/40">+91</span>
                   </div>
                   <input 
                     type="tel" 
                     placeholder="98765 43210" 
                     className="bg-transparent border-none outline-none py-4 px-4 w-full text-white font-medium"
                   />
                </div>
             </div>
             <button className="w-full bg-clay text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all duration-500 shadow-xl shadow-clay/10">
               Send Invite
             </button>
          </div>
        </div>
      </section>

      {/* Property Gallery / Grid Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
           {[...Array(12)].map((_, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.05 }}
               className="aspect-square bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden group relative"
             >
                <div className="absolute inset-0 bg-clay/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_100%)] flex items-center justify-center">
                   <Home size={32} className="text-white/5 group-hover:text-white/20 transition-colors" />
                </div>
             </motion.div>
           ))}
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
              <div className="absolute inset-0 border-[10px] border-black/20 pointer-events-none" />
           </div>

           <div className="mt-20 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="max-w-xl">
                 <h2 className="text-4xl md:text-6xl font-heading font-black tracking-tighter leading-none mb-4">
                   Welcome to the <br /> <span className="text-clay italic">right side of renting</span>
                 </h2>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                 <Link 
                   to="/cards"
                   className="bg-white/5 border border-white/10 text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest text-[11px] hover:bg-white hover:text-black transition-all"
                 >
                   Explore Yureka
                 </Link>
                 <Link 
                   to="/contribute"
                   className="bg-white/5 border border-white/10 text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest text-[11px] hover:bg-white hover:text-black transition-all"
                 >
                   Contact Us
                 </Link>
              </div>
           </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto text-center">
          <Sparkles className="text-clay mx-auto mb-8 animate-pulse" size={48} />
          <h2 className="text-4xl md:text-6xl font-heading font-black tracking-tighter mb-8 uppercase">Ready to reclaim your rent?</h2>
          <Link 
            to="/join-waitlist"
            className="inline-flex items-center gap-4 bg-clay text-white px-16 py-6 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-all duration-500 shadow-2xl shadow-clay/20"
          >
            Join the waitlist
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ByEveryone;
