import React from 'react';
import ImageWithLoader from './ImageWithLoader';
import { Link } from 'react-router-dom';
import { Globe, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

const Hero: React.FC = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8 }
  };

  return (
    <section id="hero" className="relative w-full min-h-screen flex flex-col items-center pt-4 md:pt-8 pb-20 bg-cream border-b border-ink/10 overflow-hidden text-ink scroll-mt-32">

        {/* Background Grid/Lines */}
        <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-full max-w-[1440px] mx-auto border-x border-ink/5 relative">
                 <div className="absolute top-0 left-[20%] bottom-0 w-px bg-ink/5 hidden lg:block"></div>
                 <div className="absolute top-0 right-[20%] bottom-0 w-px bg-ink/5 hidden lg:block"></div>
            </div>
        </div>

        <div className="relative z-10 w-full max-w-[1440px] px-6 flex flex-col items-center">
            
            {/* --- NEWSPAPER HEADER SECTION --- */}
            
            {/* Ear Pieces (Top corners) & Masthead */}
            <motion.div 
                initial={fadeInUp.initial}
                whileInView={fadeInUp.whileInView}
                viewport={fadeInUp.viewport}
                transition={fadeInUp.transition}
                className="w-full flex flex-col md:flex-row justify-between items-end border-b-4 border-double border-ink/20 pb-6 mb-2"
            >
                {/* Left Ear - Keyword Rich Context */}
                <div className="hidden md:block w-64 text-left border-r border-ink/10 pr-6 h-full">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-ink/40 mb-2">Est. 2026 • Alpha V.1</p>
                    <p className="text-sm font-serif italic text-ink/60 leading-tight">
                        "The automation of financial superiority."
                    </p>
                </div>

                
                {/* Masthead - Brand Name */}
                <div className="flex-1 text-center px-2 md:px-4 mb-4 md:mb-0 group">
                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-clay mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700">The Intelligence Edition</div>
                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-heading font-black tracking-[-0.06em] leading-[0.85] text-ink uppercase">
                        Yureka<span className="text-clay"> Times.</span>
                    </h1>
                </div>


                {/* Right Ear - Metadata */}
                <div className="hidden md:block w-64 text-right border-l border-ink/10 pl-6 h-full">
                     <div className="flex items-center justify-end gap-3 text-ink/70 mb-2">
                        <Globe size={16} className="animate-spin-slow" />
                        <span className="text-sm font-sans font-bold uppercase tracking-widest text-[10px]">Neural Network Stable</span>
                     </div>
                     <div className="flex justify-end gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-ink/40">
                        <span>Digital Ed.</span>
                        <span>Vol. 09</span>
                     </div>
                </div>
            </motion.div>

            {/* Date Line & Key Value Props */}
            <motion.div 
                initial={fadeInUp.initial}
                whileInView={fadeInUp.whileInView}
                viewport={fadeInUp.viewport}
                transition={{ ...fadeInUp.transition, delay: 0.1 }}
                className="w-full border-b border-ink/10 py-3 mb-8 md:mb-16 grid grid-cols-1 md:grid-cols-3 items-center px-2 gap-y-2 md:gap-y-0"
            >
                <div className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-ink/40 flex gap-4 justify-center md:justify-start">
                    <span>Bengaluru Node</span>
                    <span className="hidden lg:inline">|</span>
                    <span className="hidden lg:inline text-clay">234,402 Cards Audited</span>
                </div>
                <div className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-ink/80 text-center">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <div className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-ink/40 text-center md:text-right">
                    <span className="md:hidden">Elite Standards • Open Access</span>
                    <span className="hidden md:inline">Institutional Grade • Alpha Protocol</span>
                </div>
            </motion.div>

            {/* --- MAIN HEADLINE SECTION (H2 for SEO) --- */}
            <motion.div 
                initial={fadeInUp.initial}
                whileInView={fadeInUp.whileInView}
                viewport={fadeInUp.viewport}
                transition={{ ...fadeInUp.transition, delay: 0.2 }}
                className="w-full text-center mb-12 md:mb-20 px-4"
            >
                <div className="flex justify-center items-center gap-4 mb-6 md:mb-10">
                     <div className="h-[1px] bg-ink/10 w-8 md:w-20"></div>
                     <span className="text-ink font-black text-[10px] md:text-xs uppercase tracking-[0.5em]">The Automation of Wealth</span>
                     <div className="h-[1px] bg-ink/10 w-8 md:w-20"></div>
                </div>
                <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.8] font-heading font-black text-ink uppercase tracking-[-0.07em]">
                    Stop Guessing. <br className="hidden md:block" /> Start Winning.
                </h2>
                <h3 className="text-lg md:text-2xl lg:text-3xl font-sans font-medium text-ink/40 mt-8 md:mt-12 max-w-3xl mx-auto leading-tight tracking-tight uppercase">
                    We audit <span className="font-black text-ink">200+ elite credit cards</span> to reveal your highest possible yield path.
                </h3>

                
                <div className="mt-12 md:mt-16 flex flex-col md:flex-row items-center justify-center gap-6">
                    <Link to="/yureka-ai" className="group relative px-12 py-5 bg-ink text-white overflow-hidden rounded-full w-full md:w-auto shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] transition-all hover:-translate-y-1">
                        <div className="absolute inset-0 w-full h-full bg-clay/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        <span className="relative z-10 font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 text-white">
                            <Sparkles size={14} className="text-clay animate-pulse" /> Launch Neural Matcher
                        </span>
                    </Link>
                    <span className="text-[9px] md:text-[10px] font-black text-ink/20 uppercase tracking-[0.4em]">
                        Handshake: 30ms
                    </span>
                </div>
            </motion.div>

            {/* --- CONTENT COLUMNS --- */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-0 border-t-2 border-ink/10">
                
                {/* Left Column: Story & SEO Context */}
                <motion.div 
                    initial={fadeInUp.initial}
                    whileInView={fadeInUp.whileInView}
                    viewport={fadeInUp.viewport}
                    transition={{ ...fadeInUp.transition, delay: 0.3 }}
                    className="md:col-span-1 lg:col-span-3 lg:border-r-2 border-ink/10 lg:pr-8 pt-10 hidden md:block"
                >
                 <div className="flex items-center gap-3 mb-10">
                        <span className="text-6xl font-heading font-black leading-none text-ink">E</span>
                        <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-ink/20 pt-4">Editorial Dispatch</h4>
                     </div>

                     
                      <h5 className="font-heading font-black text-4xl text-ink leading-[0.85] mb-6 uppercase tracking-tighter">Financial <br />Absolute.</h5>

                     
                     <div className="flex justify-between items-center text-[9px] text-ink/20 font-black uppercase tracking-[0.4em] mb-6 border-b border-ink/10 pb-3">
                        <span>Report 01</span>
                        <span>Neural Logic</span>
                     </div>
                     
                     <p className="text-justify font-sans text-ink/60 leading-relaxed text-sm mb-10 border-b border-ink/10 pb-10">
                        The Indian credit landscape has reached peak entropy. With 200+ fragmented card products, manual selection is statistically impossible for the average consumer. Our engine audits the entire matrix.
                     </p>
                     
                     <div className="bg-ink/[0.02] p-8 border border-ink/5 rounded-[2rem] shadow-sm">
                         <h5 className="font-black text-[10px] uppercase tracking-[0.4em] text-clay mb-6">Yield Probability</h5>
                         <div className="flex justify-between text-xs font-bold text-ink/40 border-b border-ink/5 py-4 uppercase">
                             <span>Avg Yield</span>
                             <span className="text-ink font-black">₹15,400.00</span>
                         </div>
                         <div className="flex justify-between text-xs font-bold text-ink/40 py-4 uppercase">
                             <span>Top Cluster</span>
                             <span className="text-ink font-black">₹48,920.00</span>
                         </div>
                     </div>
                </motion.div>

                {/* Center: Hero Images (The "Photo") */}
                <div className="md:col-span-1 lg:col-span-6 relative flex justify-center items-center pt-6 md:pt-10 pb-10 md:pb-16 lg:px-12 min-h-[400px] md:min-h-[550px] border-b md:border-b-0 lg:border-r-2 border-ink/10 overflow-hidden bg-white/40 backdrop-blur-sm">
                     <div className="relative w-[90%] max-w-[320px] sm:max-w-md aspect-[4/5] md:aspect-auto md:h-[95%]">
                        {/* Image 1 */}
                        <motion.div 
                            initial={fadeInUp.initial}
                            whileInView={fadeInUp.whileInView}
                            viewport={fadeInUp.viewport}
                            transition={{ ...fadeInUp.transition, delay: 0.4 }}
                            className="absolute top-0 left-0 w-[90%] z-20 group"
                        >
                           <div className="bg-paper p-3 md:p-4 pb-10 md:pb-16 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)] rotate-[-3deg] transition-all duration-1000 group-hover:rotate-0 group-hover:scale-105 border border-ink/10 rounded-sm">
                                <div className="aspect-[4/5] bg-slate-100 transition-all duration-500 overflow-hidden border border-ink/5 rounded-sm grayscale group-hover:grayscale-0 transition-all duration-1000">
                                     <ImageWithLoader 
                                        src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=800" 
                                        className="w-full h-full object-cover" 
                                        alt="Modern credit card payment experience"
                                        priority={true}
                                     />
                                </div>
                                <div className="mt-4 md:mt-8 flex justify-between items-end px-2">
                                    <p className="text-ink font-serif italic text-xs md:text-sm">Fig 01. The Optimal Path</p>
                                    <span className="text-[10px] font-black text-ink/20 uppercase tracking-widest">Index // Alpha</span>
                                </div>
                           </div>
                        </motion.div>

                        {/* Image 2 */}
                        <motion.div 
                            initial={fadeInUp.initial}
                            whileInView={fadeInUp.whileInView}
                            viewport={fadeInUp.viewport}
                            transition={{ ...fadeInUp.transition, delay: 0.5 }}
                            className="absolute top-[30%] right-0 w-[70%] z-10 group"
                        >
                           <div className="bg-stone-50 p-4 pb-10 shadow-2xl rotate-[5deg] transition-all duration-1000 group-hover:rotate-0 group-hover:z-30 group-hover:scale-105 border border-ink/10 rounded-sm">
                                <div className="aspect-square bg-slate-50 transition-all duration-500 overflow-hidden border border-ink/5 rounded-sm">
                                     <ImageWithLoader 
                                        src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800" 
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100" 
                                        alt="AI matching visualization"
                                        priority={true}
                                     />
                                </div>
                                <div className="mt-6 text-center">
                                    <p className="text-ink font-serif italic text-sm">Fig 02. Neural Logic Check</p>
                                </div>
                           </div>
                        </motion.div>
                     </div>
                </div>

                {/* Right Column: CTAs / Index */}
                <motion.div 
                    initial={fadeInUp.initial}
                    whileInView={fadeInUp.whileInView}
                    viewport={fadeInUp.viewport}
                    transition={{ ...fadeInUp.transition, delay: 0.6 }}
                    className="md:col-span-2 lg:col-span-3 border-t lg:border-t-0 lg:border-l-2 border-ink/10 pl-0 lg:pl-10 pt-10 flex flex-col justify-between"
                >
                     <div>
                        <h4 className="font-black text-[10px] uppercase tracking-[0.5em] mb-10 text-ink/20 border-b border-ink/5 pb-4 uppercase">In This Dispatch</h4>
                        <ul className="space-y-0">
                            {[
                                { title: "Neural Matcher", page: "03", link: "/yureka-ai", desc: "Conversational Logic" },
                                { title: "Free Tools", page: "05", link: "/free-tools", desc: "Audit Engine" },
                                { title: "Card Explorer", page: "08", link: "/cards", desc: "The Full Matrix" },
                                { title: "Our Manifesto", page: "12", link: "/manifesto", desc: "Internal Alpha" }
                            ].map((item, i) => (
                                <li key={i} className="border-b border-ink/5 last:border-0 font-sans">
                                    <Link to={item.link} className="flex justify-between items-start py-5 md:py-6 group cursor-pointer hover:bg-ink/[0.02] px-4 -mx-4 transition-all">
                                        <div>
                                            <span className="block font-heading font-black text-xl md:text-2xl text-ink group-hover:text-clay transition-colors mb-1 uppercase tracking-tight">{item.title}</span>
                                            <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-ink/30 group-hover:text-ink/60">{item.desc}</span>
                                        </div>
                                        <span className="font-mono text-xs md:text-sm text-ink/10 font-black">.{item.page}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                     </div>

                     <div className="mt-12 mb-6">
                         <div className="border border-ink/20 p-6 text-center bg-paper shadow-lg relative">
                             <div className="absolute inset-0 bg-ink/5 pointer-events-none"></div>
                             <h4 className="font-serif text-xl italic mb-4 text-ink relative z-10">"The smart way to use credit cards."</h4>
                             <Link to="/join-waitlist" className="block w-full bg-clay hover:bg-teal text-white text-center py-4 font-bold uppercase tracking-widest text-xs transition-all shadow-[4px_4px_0px_0px_rgba(36,36,36,0.15)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] relative z-10">
                                 Join VIP Waitlist
                             </Link>
                             <p className="text-center text-[10px] text-ink/40 mt-3 uppercase tracking-widest relative z-10">
                                 Launching Q2 2026 • 1K+ Fans
                             </p>
                         </div>
                     </div>
                </motion.div>

            </div>

        </div>
    </section>
  );
};

export default Hero;