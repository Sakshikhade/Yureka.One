import React from 'react';
import ImageWithLoader from './ImageWithLoader';
import { Link } from 'react-router-dom';
import { Globe, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import GroupChatAudit from './GroupChatAudit';

const Hero: React.FC = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 0 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8 }
  };

  return (
    <section id="hero" className="relative w-full min-h-screen flex flex-col items-center pt-4 md:pt-8 pb-12 bg-cream border-b border-ink/10 overflow-hidden text-[#242424] scroll-mt-32">

        {/* Background Grid/Lines - Flowing within the 3-column Core */}
        <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-full border-x border-ink/5 relative opacity-30">
                 <div className="absolute top-0 left-[33%] bottom-0 w-px bg-[#242424]/5 hidden lg:block"></div>
                 <div className="absolute top-0 right-[33%] bottom-0 w-px bg-[#242424]/5 hidden lg:block"></div>
            </div>
        </div>

        <div className="relative z-10 w-full px-6 flex flex-col items-center">
            
            {/* --- NEWSPAPER HEADER SECTION --- */}
            
            {/* Ear Pieces (Top corners) & Masthead */}
            <motion.div 
                initial={fadeInUp.initial}
                whileInView={fadeInUp.whileInView}
                viewport={fadeInUp.viewport}
                transition={fadeInUp.transition}
                className="w-full flex flex-col lg:flex-row justify-between items-center lg:items-end border-b-4 border-double border-ink/20 pb-8 px-4 gap-8 lg:gap-0"
            >
                {/* Left Ear - Keyword Rich Context */}
                <div className="hidden lg:block w-64 text-left border-r border-ink/10 pr-6 h-full">
                    <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-ink/70 mb-2">Est. 2026 • Alpha V.1</p>
                    <p className="text-sm lg:text-base font-serif italic text-ink/80 leading-tight">
                        "The automation of financial superiority."
                    </p>
                </div>

                {/* Masthead - Brand Name */}
                <div className="flex-1 text-center px-2 md:px-4 group overflow-visible">
                    <div className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.5em] text-clay mb-2 md:mb-3 opacity-0 group-hover:opacity-100 transition-all duration-700 -translate-y-2 group-hover:translate-y-0">The Intelligence Edition</div>
                    <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[clamp(2.5rem,4.5vw,5.5rem)] font-heading font-extrabold tracking-tight leading-[0.85] text-ink uppercase whitespace-nowrap">
                        Yureka<span className="text-clay"> Times.</span>
                    </h1>
                </div>


                {/* Right Ear - Metadata */}
                <div className="hidden lg:block w-72 text-right border-l border-ink/10 pl-8 h-full">
                     <div className="flex items-center justify-end gap-3 text-ink/70 mb-2">
                        <Globe size={14} className="animate-spin-slow text-clay" />
                        <span className="text-xs font-sans font-medium uppercase tracking-widest text-[9px]">Neural Network Stable</span>
                     </div>
                      <div className="flex justify-end gap-4 text-[11px] font-bold uppercase tracking-[0.3em] text-ink/60">
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
                className="w-full border-b border-ink/10 py-4 mb-12 md:mb-20 grid grid-cols-1 md:grid-cols-12 items-center px-4 gap-y-4 md:gap-y-0"
            >
                <div className="md:col-span-4 text-xs font-bold uppercase tracking-[0.1em] text-ink/40 flex gap-2 lg:gap-4 justify-center md:justify-start">
                    <span>Bengaluru Node</span>
                    <span className="text-clay">/</span>
                    <span className="text-clay">234,402 Cards Audited</span>
                </div>
                <div className="md:col-span-4 text-xs font-bold uppercase tracking-[0.2em] text-ink/60 text-center">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <div className="md:col-span-4 text-xs font-bold uppercase tracking-[0.2em] text-ink/40 text-center md:text-right">
                    <span className="md:hidden">Elite Standard • Alpha</span>
                    <span className="hidden md:inline">Institutional Grade • Alpha Protocol v0.9.4</span>
                </div>
            </motion.div>

            {/* --- MAIN HEADLINE SECTION (H2 for SEO) --- */}
            <motion.div 
                initial={fadeInUp.initial}
                whileInView={fadeInUp.whileInView}
                viewport={fadeInUp.viewport}
                transition={{ ...fadeInUp.transition, delay: 0.2 }}
                className="w-full text-center mb-16 md:mb-24 px-6"
            >
                <div className="flex justify-center items-center gap-6 mb-8 md:mb-12">
                     <div className="h-[1px] bg-clay/20 w-12 md:w-24"></div>
                     <span className="text-ink font-bold text-xs uppercase tracking-[0.4em]">The Automation of Wealth</span>
                     <div className="h-[1px] bg-clay/20 w-12 md:w-24"></div>
                </div>
                <h2 className="text-3xl sm:text-6xl md:text-7xl lg:text-[clamp(2.5rem,7vw,8rem)] leading-[0.9] font-heading font-extrabold text-ink uppercase tracking-tight">
                    Stop Guessing. <br className="hidden md:block" /> Start Winning.
                </h2>
                <h3 className="text-xs sm:text-base xl:text-lg font-sans font-semibold text-ink/60 mt-6 md:mt-10 max-w-3xl mx-auto leading-relaxed tracking-tight uppercase px-4 sm:px-0">
                    We audit <span className="text-ink">200+ elite credit cards</span> through the RewardX Neural Engine <br className="hidden lg:block" /> to reveal your highest possible yield path.
                </h3>

                
                <div className="mt-14 md:mt-20 flex flex-col md:flex-row items-center justify-center gap-8">
                    <Link to="/yureka-ai" className="group relative px-14 py-6 bg-[#242424] text-cream overflow-hidden rounded-full w-full md:w-auto shadow-2xl transition-all hover:-translate-y-1 text-center">
                        <div className="absolute inset-0 w-full h-full bg-[#047857]/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                        <span className="relative z-10 font-medium text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 text-cream">
                            <Sparkles size={16} className="text-[#047857] animate-pulse" /> Launch Neural Matcher
                        </span>
                    </Link>
                    <div className="flex flex-col items-center md:items-start">
                        <span className="text-[10px] font-medium text-[#242424]/20 uppercase tracking-[0.4em]">Protocol Status</span>
                        <span className="text-[11px] font-medium text-[#047857] uppercase italic tracking-widest flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-[#047857] animate-ping" /> Synchronized
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* --- CONTENT COLUMNS --- */}
            <div className="w-full grid grid-cols-1 md:grid-cols-1 xl:grid-cols-12 gap-12 xl:gap-0 border-t-2 border-ink/10 bg-cream/20 backdrop-blur-sm rounded-t-[3rem]">
                
                {/* Left Column: Story & SEO Context */}
                <motion.div 
                    initial={fadeInUp.initial}
                    whileInView={fadeInUp.whileInView}
                    viewport={{ once: true }}
                    transition={{ ...fadeInUp.transition, delay: 0.3 }}
                    className="xl:col-span-3 border-ink/10 xl:pr-8 pt-12 hidden xl:block"
                >
                  <div className="flex items-center gap-4 mb-12">
                        <span className="text-6xl xl:text-7xl font-heading font-medium leading-none text-[#242424]">E</span>
                        <h4 className="font-medium text-[11px] uppercase tracking-[0.3em] text-[#242424]/20 pt-6">Editorial Dispatch</h4>
                     </div>

                     
                      <h5 className="font-heading font-bold text-2xl xl:text-3xl text-ink leading-[0.88] mb-6 uppercase tracking-tight">Financial <br />Absolute.</h5>

                     
                     <div className="flex justify-between items-center text-[11px] text-ink/40 font-bold uppercase tracking-[0.4em] mb-8 border-b border-ink/10 pb-4 text-ink/20">
                        <span>Dispatch 09.A</span>
                        <span>Neural Logic</span>
                     </div>
                     
                     <p className="text-justify font-sans text-ink/60 leading-relaxed text-base mb-12 border-b border-ink/10 pb-12 italic font-medium">
                        The Indian credit landscape has reached entropy. Fragmented products make manual selection impossible. Our engine audits the matrix.
                     </p>
                     
                     <div className="bg-cream/60 backdrop-blur-3xl border border-white/60 rounded-[3rem] shadow-xl shadow-black/5 group hover:bg-cream/80 hover:shadow-2xl transition-all duration-500 p-6 xl:p-8 overflow-hidden">
                         <h5 className="font-medium text-[11px] uppercase tracking-[0.2em] text-[#047857] mb-6">Yield Probability</h5>
                         <div className="flex flex-wrap justify-between items-center text-[11px] font-medium text-[#242424]/50 border-b border-ink/5 py-4 uppercase tracking-[0.1em] gap-2">
                             <span>Avg Yield</span>
                              <span className="text-ink font-bold whitespace-nowrap text-sm">₹15,400.00</span>
                         </div>
                         <div className="flex flex-wrap justify-between items-center text-[11px] font-medium text-[#242424]/50 py-4 uppercase tracking-[0.1em] gap-2">
                             <span>Top Cluster</span>
                              <span className="text-ink font-bold whitespace-nowrap text-sm">₹48,920.00</span>
                         </div>
                     </div>
                </motion.div>

                {/* Center: Mobile Group Chat Simulation */}
                <div className="md:col-span-1 xl:col-span-6 relative flex justify-center items-center pt-8 md:pt-12 pb-16 md:pb-20 xl:px-4 min-h-[550px] md:min-h-[750px] border-l xl:border-l-2 xl:border-r-2 border-ink/10 overflow-visible">
                     <div className="relative w-full h-full flex items-center justify-center">
                         <GroupChatAudit />
                     </div>
                </div>

                {/* Right Column: CTAs / Index */}
                <motion.div 
                    initial={fadeInUp.initial}
                    whileInView={fadeInUp.whileInView}
                    viewport={{ once: true }}
                    transition={{ ...fadeInUp.transition, delay: 0.7 }}
                    className="md:col-span-1 xl:col-span-3 border-t xl:border-t-0 pl-0 xl:pl-10 pt-12 flex flex-col justify-between"
                >
                     <div>
                        <h4 className="font-bold text-[11px] uppercase tracking-[0.4em] mb-12 text-ink/40 border-b border-ink/5 pb-6 uppercase">In This Dispatch</h4>
                        <ul className="space-y-0 text-[#242424]/20">
                            {[
                                { title: "Neural", page: "01", link: "/yureka-ai", desc: "Logic" },
                                { title: "Audit", page: "05", link: "/free-tools", desc: "Parity" },
                                { title: "Explorer", page: "09", link: "/cards", desc: "Matrix" },
                                { title: "Manifesto", page: "14", link: "/manifesto", desc: "Alpha" }
                            ].map((item, i) => (
                                <li key={i} className="border-b border-ink/5 last:border-0 font-sans group">
                                    <Link to={item.link} className="flex justify-between items-start py-6 md:py-8 cursor-pointer relative overflow-hidden px-4 lg:px-6 -mx-4 lg:-mx-6 transition-all duration-700">
                                        <div className="absolute inset-0 bg-[#242424]/[0.02] -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                                        <div className="relative z-10">
                                            <span className="block font-heading font-bold text-lg md:text-xl text-ink group-hover:text-clay transition-colors mb-1 uppercase tracking-tight">{item.title}</span>
                                            <span className="block text-[11px] font-bold uppercase tracking-[0.2em] text-ink/30">{item.desc}</span>
                                        </div>
                                        <span className="relative z-10 font-mono text-xs md:text-sm text-[#242424]/10 font-medium group-hover:text-[#242424]/30 transition-colors">.{item.page}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                     </div>

                     <div className="mt-16 mb-10 px-4 md:px-0">
                         <motion.div 
                            whileHover={{ y: -6, boxShadow: '0 32px 64px -12px rgba(0,0,0,0.14)' }}
                            transition={{ duration: 0.4, ease: [0.25, 0.8, 0.25, 1] }}
                            className="border border-ink/8 p-6 xl:p-8 text-center bg-cream shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)] relative overflow-hidden rounded-[2rem]"
                         >
                             <div className="absolute top-0 right-0 p-4 opacity-[0.06]">
                                <Sparkles size={32} className="text-[#242424]" />
                             </div>
                             <h4 className="font-serif text-base xl:text-lg italic mb-6 text-[#242424] leading-snug">"The definitive way to <br /> audit credit cards."</h4>
                             <Link to="/join-waitlist" className="block w-full bg-[#047857] hover:bg-[#242424] text-cream text-center py-4 rounded-xl font-medium uppercase tracking-[0.25em] text-[10px] transition-all duration-300">
                                 Join Registry
                             </Link>
                             <p className="text-center text-[10px] text-[#242424]/30 mt-5 uppercase tracking-[0.4em] font-medium">
                                 Launching Q2 2026
                             </p>
                         </motion.div>
                     </div>
                </motion.div>

            </div>

        </div>
    </section>
  );
};

export default Hero;