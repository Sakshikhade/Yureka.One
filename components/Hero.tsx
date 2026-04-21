import React from 'react';
import ImageWithLoader from './ImageWithLoader';
import { Link } from 'react-router-dom';
import { Globe, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import GroupChatAudit from './GroupChatAudit';

const Hero: React.FC = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8 }
  };

  return (
    <section id="hero" className="relative w-full min-h-screen flex flex-col items-center pt-4 md:pt-8 pb-12 bg-cream border-b border-ink/10 overflow-hidden text-ink scroll-mt-32">

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
                <div className="flex-1 text-center px-4 md:px-8 mb-4 md:mb-0 group overflow-hidden">
                    <div className="text-[10px] font-medium uppercase tracking-[0.5em] text-clay mb-3 opacity-0 group-hover:opacity-100 transition-all duration-700 -translate-y-2 group-hover:translate-y-0 text-clay">The Intelligence Edition</div>
                    <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-medium tracking-tight leading-[0.9] text-ink uppercase">
                        Yureka<span className="text-clay"> Times.</span>
                    </h1>
                </div>


                {/* Right Ear - Metadata */}
                <div className="hidden md:block w-72 text-right border-l border-ink/10 pl-8 h-full">
                     <div className="flex items-center justify-end gap-3 text-ink/70 mb-2">
                        <Globe size={14} className="animate-spin-slow text-clay" />
                        <span className="text-xs font-sans font-medium uppercase tracking-widest text-[9px]">Neural Network Stable</span>
                     </div>
                     <div className="flex justify-end gap-4 text-[10px] font-medium uppercase tracking-[0.3em] text-ink/30">
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
                className="w-full border-b border-ink/10 py-4 mb-12 md:mb-20 grid grid-cols-1 md:grid-cols-3 items-center px-4 gap-y-4 md:gap-y-0"
            >
                <div className="text-[10px] md:text-xs font-medium uppercase tracking-[0.1em] text-ink/40 flex gap-4 justify-center md:justify-start">
                    <span>Bengaluru Node</span>
                    <span className="text-clay">/</span>
                    <span className="text-clay">234,402 Cards Audited</span>
                </div>
                <div className="text-[10px] md:text-xs font-medium uppercase tracking-[0.2em] text-ink/60 text-center">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <div className="text-[10px] md:text-xs font-medium uppercase tracking-[0.2em] text-ink/40 text-center md:text-right">
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
                     <span className="text-ink font-medium text-[10px] md:text-xs uppercase tracking-[0.4em]">The Automation of Wealth</span>
                     <div className="h-[1px] bg-clay/20 w-12 md:w-24"></div>
                </div>
                <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.95] font-heading font-medium text-ink uppercase tracking-tight">
                    Stop Guessing. <br className="hidden md:block" /> Start Winning.
                </h2>
                <h3 className="text-base md:text-lg lg:text-xl font-sans font-medium text-ink/40 mt-10 md:mt-14 max-w-3xl mx-auto leading-relaxed tracking-tight uppercase">
                    We audit <span className="text-ink">200+ elite credit cards</span> through the RewardX Neural Engine <br className="hidden lg:block" /> to reveal your highest possible yield path.
                </h3>

                
                <div className="mt-14 md:mt-20 flex flex-col md:flex-row items-center justify-center gap-8">
                    <Link to="/yureka-ai" className="group relative px-14 py-6 bg-ink text-white overflow-hidden rounded-full w-full md:w-auto shadow-2xl transition-all hover:-translate-y-1">
                        <div className="absolute inset-0 w-full h-full bg-clay/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                        <span className="relative z-10 font-medium text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 text-white">
                            <Sparkles size={16} className="text-clay animate-pulse" /> Launch Neural Matcher
                        </span>
                    </Link>
                    <div className="flex flex-col items-center md:items-start">
                        <span className="text-[10px] font-medium text-ink/20 uppercase tracking-[0.4em]">Protocol Status</span>
                        <span className="text-[11px] font-medium text-clay uppercase italic tracking-widest flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-clay animate-ping" /> Synchronized
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* --- CONTENT COLUMNS --- */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-0 border-t-2 border-ink/10 bg-white/20 backdrop-blur-sm rounded-t-[3rem]">
                
                {/* Left Column: Story & SEO Context */}
                <motion.div 
                    initial={fadeInUp.initial}
                    whileInView={fadeInUp.whileInView}
                    viewport={{ once: true }}
                    transition={{ ...fadeInUp.transition, delay: 0.3 }}
                    className="md:col-span-1 lg:col-span-3 lg:border-r-2 border-ink/10 lg:pr-10 pt-12 hidden lg:block"
                >
                 <div className="flex items-center gap-4 mb-12">
                        <span className="text-7xl font-heading font-medium leading-none text-ink">E</span>
                        <h4 className="font-medium text-[11px] uppercase tracking-[0.3em] text-ink/20 pt-6">Editorial Dispatch</h4>
                     </div>

                     
                      <h5 className="font-heading font-medium text-4xl text-ink leading-[0.9] mb-8 uppercase tracking-tight">Financial <br />Absolute.</h5>

                     
                     <div className="flex justify-between items-center text-[10px] text-ink/20 font-medium uppercase tracking-[0.4em] mb-8 border-b border-ink/10 pb-4 text-ink/20">
                        <span>Dispatch 09.A</span>
                        <span>Neural Logic</span>
                     </div>
                     
                     <p className="text-justify font-sans text-ink/60 leading-relaxed text-sm mb-12 border-b border-ink/10 pb-12 italic">
                        The Indian credit landscape has reached peak entropy. With 200+ fragmented card products, manual selection is statistically impossible. Our engine audits the entire matrix.
                     </p>
                     
                     <div className="bg-clay/5 p-10 border border-clay/10 rounded-[3rem] shadow-sm group hover:bg-clay/10 transition-colors duration-500">
                         <h5 className="font-medium text-[11px] uppercase tracking-[0.4em] text-clay mb-8 font-medium">Yield Probability</h5>
                         <div className="flex justify-between text-xs font-medium text-ink/40 border-b border-ink/5 py-5 uppercase tracking-widest leading-loose">
                             <span>Avg Yield</span>
                             <span className="text-ink font-medium">₹15,400.00</span>
                         </div>
                         <div className="flex justify-between text-xs font-medium text-ink/40 py-5 uppercase tracking-widest leading-loose">
                             <span>Top Cluster</span>
                             <span className="text-ink font-medium">₹48,920.00</span>
                         </div>
                     </div>
                </motion.div>

                {/* Center: Mobile Group Chat Simulation */}
                <div className="md:col-span-1 lg:col-span-6 relative flex justify-center items-center pt-8 md:pt-12 pb-16 md:pb-20 lg:px-6 min-h-[550px] md:min-h-[750px] border-b md:border-b-0 lg:border-r-2 border-ink/10 overflow-visible">
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
                    className="md:col-span-2 lg:col-span-3 border-t lg:border-t-0 lg:border-l-2 border-ink/10 pl-0 lg:pl-12 pt-12 flex flex-col justify-between"
                >
                     <div>
                        <h4 className="font-medium text-[11px] uppercase tracking-[0.4em] mb-12 text-ink/20 border-b border-ink/5 pb-6 uppercase">In This Dispatch</h4>
                        <ul className="space-y-0 text-ink/20">
                            {[
                                { title: "Neural Matcher", page: "01", link: "/yureka-ai", desc: "Conversational Logic" },
                                { title: "Audit Engine", page: "05", link: "/free-tools", desc: "Mathematical Parity" },
                                { title: "Card Explorer", page: "09", link: "/cards", desc: "The Full Matrix" },
                                { title: "Manifesto", page: "14", link: "/manifesto", desc: "Internal Alpha" }
                            ].map((item, i) => (
                                <li key={i} className="border-b border-ink/5 last:border-0 font-sans group">
                                    <Link to={item.link} className="flex justify-between items-start py-6 md:py-8 cursor-pointer relative overflow-hidden px-6 -mx-6 transition-all duration-700">
                                        <div className="absolute inset-0 bg-ink/[0.02] -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                                        <div className="relative z-10">
                                            <span className="block font-heading font-medium text-xl md:text-2xl text-ink group-hover:text-clay transition-colors mb-2 uppercase tracking-tight">{item.title}</span>
                                            <span className="block text-[11px] font-medium uppercase tracking-[0.2em] text-ink/30 group-hover:text-ink/60">{item.desc}</span>
                                        </div>
                                        <span className="relative z-10 font-mono text-xs md:text-sm text-ink/10 font-medium group-hover:text-ink/30 transition-colors">.{item.page}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                     </div>

                     <div className="mt-16 mb-10 px-4 md:px-0">
                         <motion.div 
                            whileHover={{ y: -5 }}
                            className="border border-ink/10 p-8 md:p-10 text-center bg-white shadow-xl relative overflow-hidden rounded-[2.5rem]"
                         >
                             <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Sparkles size={40} className="text-ink" />
                             </div>
                             <h4 className="font-serif text-2xl italic mb-8 text-ink leading-relaxed">"The definitive way to <br /> audit credit cards."</h4>
                             <Link to="/join-waitlist" className="block w-full bg-clay hover:bg-ink text-white text-center py-5 rounded-2xl font-medium uppercase tracking-[0.25em] text-[10px] transition-all">
                                 Join Registry
                             </Link>
                             <p className="text-center text-[10px] text-ink/30 mt-6 uppercase tracking-[0.4em] font-medium">
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