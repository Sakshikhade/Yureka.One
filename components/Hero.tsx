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
    <section id="hero" className="relative w-full min-h-screen flex flex-col items-center pt-4 md:pt-8 pb-12 bg-[#0a0a0a] border-b border-white/10 overflow-hidden text-[#F2EFE9] scroll-mt-32">

        {/* Background Grid/Lines - Flowing within the 3-column Core */}
        <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-full border-x border-white/5 relative opacity-30">
                 <div className="absolute top-0 left-[33%] bottom-0 w-px bg-white/5 hidden lg:block"></div>
                 <div className="absolute top-0 right-[33%] bottom-0 w-px bg-white/5 hidden lg:block"></div>
            </div>
        </div>

        <div className="relative z-10 w-full px-6 flex flex-col items-center">
            
            {/* --- MAIN HEADLINE SECTION (H1 for SEO) --- */}
            <motion.div 
                initial={fadeInUp.initial}
                whileInView={fadeInUp.whileInView}
                viewport={fadeInUp.viewport}
                transition={{ ...fadeInUp.transition, delay: 0.2 }}
                className="w-full text-center mb-10 md:mb-16 px-6 pt-10"
            >
                <div className="flex justify-center items-center gap-6 mb-4 md:md-6">
                     <div className="h-[1px] bg-white/10 w-12 md:w-24"></div>
                     <span className="text-[#34d399] font-bold text-xs uppercase tracking-[0.4em]">The Automation of Wealth</span>
                     <div className="h-[1px] bg-white/10 w-12 md:w-24"></div>
                </div>
                <h1 className="text-3xl sm:text-6xl md:text-7xl lg:text-[clamp(2.5rem,6vw,6.5rem)] leading-[0.9] font-heading font-extrabold text-white uppercase tracking-tight">
                    Stop Guessing. <br className="hidden md:block" /> Start Winning.
                </h1>
                <h3 className="text-xs sm:text-base xl:text-lg font-sans font-semibold text-white/40 mt-4 md:mt-6 max-w-3xl mx-auto leading-relaxed tracking-tight uppercase px-4 sm:px-0">
                    We audit <span className="text-white">200+ elite credit cards</span> through the RewardX Neural Engine <br className="hidden lg:block" /> to reveal your highest possible yield path.
                </h3>

                
                <div className="mt-10 md:mt-14 mb-16 md:mb-20 flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 px-4">
                    <Link to="/yureka-ai" className="group relative px-8 py-5 md:px-12 md:py-6 bg-white text-[#0a0a0a] overflow-hidden rounded-full w-full sm:w-auto shadow-[0_8px_40px_-12px_rgba(0,0,0,0.8)] transition-all hover:-translate-y-1 hover:shadow-2xl text-center border border-transparent">
                        <div className="absolute inset-0 w-full h-full bg-[#34d399]/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                        <span className="relative z-10 font-bold text-[10px] md:text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-3">
                            <Sparkles size={16} className="text-[#34d399] animate-pulse" /> Launch Neural Matcher
                        </span>
                    </Link>
                    
                    <Link to="/join-waitlist" className="group px-8 py-5 md:px-12 md:py-6 bg-white/5 text-[#F2EFE9] rounded-full w-full sm:w-auto border-2 border-white/10 hover:border-white/30 hover:bg-white/10 transition-all hover:-translate-y-1 text-center backdrop-blur-sm">
                        <span className="font-bold text-[10px] md:text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-3">
                            Join The VIP Waitlist
                        </span>
                    </Link>
                </div>
            </motion.div>

            {/* --- CONTENT COLUMNS --- */}
            <div className="w-full grid grid-cols-1 md:grid-cols-1 xl:grid-cols-12 gap-12 xl:gap-0 border-t-2 border-white/10 bg-white/[0.02] backdrop-blur-md rounded-t-[3rem] shadow-2xl">
                
                {/* Left Column: Story & SEO Context */}
                <motion.div 
                    initial={fadeInUp.initial}
                    whileInView={fadeInUp.whileInView}
                    viewport={{ once: true }}
                    transition={{ ...fadeInUp.transition, delay: 0.3 }}
                    className="xl:col-span-3 border-white/10 xl:pr-10 pt-16 hidden xl:block pl-10"
                >
                  <div className="flex items-center gap-5 mb-14">
                        <span className="text-7xl xl:text-8xl font-black leading-none text-white tracking-tighter">E</span>
                        <h4 className="font-black text-[10px] uppercase tracking-[0.5em] text-white/20 pt-8">Dispatch Core</h4>
                     </div>
 
                     <h5 className="font-heading font-black text-3xl xl:text-4xl text-white leading-[0.85] mb-8 uppercase tracking-tighter">Financial <br />Absolute.</h5>
 
                     <div className="flex justify-between items-center text-[10px] text-white/40 font-black uppercase tracking-[0.4em] mb-10 border-b border-white/5 pb-5">
                        <span>Dispatch 09.A</span>
                        <span>Neural Core</span>
                     </div>
                     
                     <p className="text-justify font-sans text-white/40 leading-relaxed text-[15px] mb-14 border-b border-white/5 pb-14 italic font-medium">
                        The Indian credit landscape has reached peak entropy. Fragmented products make manual selection mathematically impossible. Our engine audits the matrix to render certainty.
                     </p>
                     
                      <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl shadow-black/40 group hover:bg-white/10 transition-all duration-700 p-8 overflow-hidden">
                         <h5 className="font-black text-[10px] uppercase tracking-[0.3em] text-[#34d399] mb-8">Yield Probability</h5>
                         <div className="flex flex-wrap justify-between items-center text-[10px] font-black text-white/40 border-b border-white/5 py-5 uppercase tracking-[0.1em] gap-2">
                             <span>Avg Yield</span>
                              <span className="text-[#34d399] font-black whitespace-nowrap text-base">₹15,400.00</span>
                         </div>
                         <div className="flex flex-wrap justify-between items-center text-[10px] font-black text-white/20 py-5 uppercase tracking-[0.1em] gap-2">
                             <span>Top Cluster</span>
                              <span className="text-white font-black whitespace-nowrap text-base">₹48,920.00</span>
                         </div>
                      </div>
                </motion.div>

                {/* Center: Mobile Group Chat Simulation */}
                <div className="md:col-span-1 xl:col-span-6 relative flex justify-center items-center pt-12 md:pt-16 pb-20 md:pb-28 xl:px-4 min-h-[550px] md:min-h-[850px] border-l xl:border-l-2 xl:border-r-2 border-white/10 overflow-visible bg-white/[0.01]">
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
                    className="md:col-span-1 xl:col-span-3 border-t xl:border-t-0 pl-0 xl:pl-12 pt-16 flex flex-col justify-between pr-10"
                >
                     <div>
                        <h4 className="font-black text-[10px] uppercase tracking-[0.5em] mb-14 text-white/30 border-b border-white/5 pb-6">Protocol Index</h4>
                        <ul className="space-y-0">
                            {[
                                { title: "Neural", page: "01", link: "/yureka-ai", desc: "Logic Core" },
                                { title: "Audit", page: "05", link: "/free-tools", desc: "Yield Parity" },
                                { title: "Explorer", page: "09", link: "/cards", desc: "Selection Matrix" },
                                { title: "Manifesto", page: "14", link: "/manifesto", desc: "Strategy Alpha" }
                            ].map((item, i) => (
                                <li key={i} className="border-b border-white/5 last:border-0 group">
                                    <Link to={item.link} className="flex justify-between items-start py-8 md:py-10 cursor-pointer relative overflow-hidden px-6 -mx-6 transition-all duration-1000">
                                        <div className="absolute inset-0 bg-[#34d399]/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-1000" />
                                        <div className="relative z-10">
                                            <span className="block font-heading font-black text-xl md:text-2xl text-white group-hover:text-[#34d399] transition-colors mb-2 uppercase tracking-tighter">{item.title}</span>
                                            <span className="block text-[10px] font-black uppercase tracking-[0.25em] text-white/30 group-hover:text-white/50">{item.desc}</span>
                                        </div>
                                        <span className="relative z-10 font-mono text-xs md:text-sm text-white/10 font-black group-hover:text-[#34d399]/40 transition-colors">.{item.page}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                     </div>

                     <div className="mt-20 mb-12 px-4 md:px-0">
                         <motion.div 
                            whileHover={{ y: -8, scale: 1.02 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="border border-white/10 p-10 text-center bg-white/[0.03] backdrop-blur-3xl rounded-[2.5rem] shadow-2xl relative overflow-hidden group"
                         >
                             <div className="absolute top-0 right-0 p-6 opacity-[0.08] group-hover:rotate-12 transition-transform duration-700">
                                <Sparkles size={40} className="text-[#34d399]" />
                             </div>
                             <h4 className="font-serif text-lg xl:text-xl italic mb-8 text-white/90 leading-snug">"The definitive way to <br /> audit credit cards."</h4>
                             <Link to="/join-waitlist" className="block w-full bg-[#34d399] text-[#0a0a0a] text-center py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] transition-all duration-500 hover:shadow-xl hover:shadow-[#34d399]/20">
                                Join Registry
                             </Link>
                             <div className="mt-6 flex items-center justify-center gap-2">
                                <div className="w-1.5 h-1.5 bg-[#34d399] rounded-full animate-pulse" />
                                <p className="text-[9px] text-white/20 uppercase tracking-[0.4em] font-black">
                                    Q2 2026 DEPLOYMENT
                                </p>
                             </div>
                         </motion.div>
                     </div>
                </motion.div>
            </div>
        </div>
    </section>
  );
};

export default Hero;