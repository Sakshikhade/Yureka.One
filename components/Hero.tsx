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
    <section className="relative w-full min-h-screen flex flex-col items-center pt-4 md:pt-8 pb-20 bg-cream border-b border-ink/10 overflow-hidden text-ink">
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
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40 mb-2">Est. 2026 • India</p>
                    <p className="text-sm font-serif italic text-ink/70 leading-tight">
                        "The easiest way to find the right credit card."
                    </p>
                </div>
                
                {/* Masthead - Brand Name */}
                <div className="flex-1 text-center px-2 md:px-4 mb-4 md:mb-0">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-serif font-black tracking-tighter leading-none text-ink">
                        Yureka Times
                    </h1>
                </div>

                {/* Right Ear - Metadata */}
                <div className="hidden md:block w-64 text-right border-l border-ink/10 pl-6 h-full">
                     <div className="flex items-center justify-end gap-3 text-ink/70 mb-2">
                        <Globe size={16} />
                        <span className="text-sm font-serif">Pan-India Access</span>
                     </div>
                     <div className="flex justify-end gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40">
                        <span>Digital Edition</span>
                        <span>Vol. I</span>
                     </div>
                </div>
            </motion.div>

            {/* Date Line & Key Value Props */}
            <motion.div 
                initial={fadeInUp.initial}
                whileInView={fadeInUp.whileInView}
                viewport={fadeInUp.viewport}
                transition={{ ...fadeInUp.transition, delay: 0.1 }}
                className="w-full border-b border-ink/10 py-2 mb-8 md:mb-16 grid grid-cols-1 md:grid-cols-3 items-center px-2 gap-y-2 md:gap-y-0"
            >
                <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-ink/60 flex gap-4 justify-center md:justify-start">
                    <span>Bengaluru, India</span>
                    <span className="hidden lg:inline">|</span>
                    <span className="hidden lg:inline">200+ Cards Scanned</span>
                </div>
                <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-ink/60 text-center">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-ink/60 text-center md:text-right">
                    <span className="md:hidden">₹15K+ Rewards • Free</span>
                    <span className="hidden md:inline">₹15K+ Projected Rewards • Free Forever</span>
                </div>
            </motion.div>

            {/* --- MAIN HEADLINE SECTION (H2 for SEO) --- */}
            <motion.div 
                initial={fadeInUp.initial}
                whileInView={fadeInUp.whileInView}
                viewport={fadeInUp.viewport}
                transition={{ ...fadeInUp.transition, delay: 0.2 }}
                className="w-full text-center mb-8 md:mb-12 px-4"
            >
                <div className="flex justify-center items-center gap-4 mb-4 md:mb-6">
                     <div className="h-px bg-clay w-6 md:w-16"></div>
                     <span className="text-clay font-mono font-bold text-[10px] md:text-xs uppercase tracking-[0.3em]">Smart Card Finder</span>
                     <div className="h-px bg-clay w-6 md:w-16"></div>
                </div>
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.95] md:leading-[0.9] font-serif font-medium text-ink uppercase tracking-tighter transform scale-y-100 md:scale-y-105">
                    Stop Guessing. <br className="hidden md:block" /> <span className="italic font-light">Start Saving.</span>
                </h2>
                <h3 className="text-lg md:text-2xl lg:text-3xl font-sans font-light text-ink/60 mt-4 md:mt-8 max-w-2xl mx-auto leading-relaxed">
                    We check <span className="font-bold text-ink">200+ credit cards</span> to find the one that saves you the most money.
                </h3>
                
                <div className="mt-8 md:mt-10 flex flex-col md:flex-row items-center justify-center gap-4">
                    <Link to="/ai-magic" className="group relative px-10 py-4 bg-ink text-white overflow-hidden rounded-full w-full md:w-auto shadow-xl">
                        <div className="absolute inset-0 w-full h-full bg-clay/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                        <span className="relative z-10 font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 text-white">
                            <Sparkles size={14} className="text-white" /> Find My Card
                        </span>
                    </Link>
                    <span className="text-[10px] md:text-xs font-mono text-ink/40 uppercase tracking-widest uppercase">
                        Takes 30 seconds
                    </span>
                </div>
            </motion.div>

            {/* --- CONTENT COLUMNS --- */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-0 border-t border-ink/10">
                
                {/* Left Column: Story & SEO Context */}
                <motion.div 
                    initial={fadeInUp.initial}
                    whileInView={fadeInUp.whileInView}
                    viewport={fadeInUp.viewport}
                    transition={{ ...fadeInUp.transition, delay: 0.3 }}
                    className="md:col-span-1 lg:col-span-3 lg:border-r border-ink/10 lg:pr-6 pt-8 hidden md:block"
                >
                     <div className="flex items-center gap-2 mb-6">
                        <span className="text-4xl font-serif leading-none text-ink">J</span>
                        <h4 className="font-bold text-xs uppercase tracking-widest text-ink/40 pt-2">The Lead Story</h4>
                     </div>
                     
                     <h5 className="font-serif text-3xl text-ink leading-tight mb-3">Get Better Rewards</h5>
                     
                     <div className="flex justify-between items-center text-xs text-ink/40 font-mono uppercase tracking-widest mb-4 border-b border-ink/10 pb-2">
                        <span>Editorial</span>
                        <span>Market Analysis</span>
                     </div>
                     
                     <p className="text-justify font-serif text-ink/80 leading-relaxed text-base mb-6 border-b border-ink/10 pb-6">
                        There are too many credit cards in India. It's confusing. We scan them all to find the best one for you. No ads. No bias.
                     </p>
                     <p className="text-justify font-serif text-ink/80 leading-relaxed text-base">
                        Whether you order food or fly often, we find a card that fits your spending.
                     </p>
                     
                     <div className="mt-12 bg-ink/5 p-6 border border-ink/10">
                         <h5 className="font-bold text-xs uppercase tracking-widest text-clay mb-4">Your Potential Savings</h5>
                         <div className="flex justify-between text-sm text-ink/70 border-b border-ink/10 py-3">
                             <span>Average Savings</span>
                             <span className="text-clay font-bold">₹15k/yr</span>
                         </div>
                         <div className="flex justify-between text-sm text-ink/70 py-3">
                             <span>Top Savings</span>
                             <span className="text-clay font-bold">₹45k/yr</span>
                         </div>
                     </div>
                </motion.div>

                {/* Center: Hero Images (The "Photo") */}
                <div className="md:col-span-1 lg:col-span-6 relative flex justify-center items-center pt-2 md:pt-6 pb-6 md:pb-10 lg:px-10 min-h-[350px] md:min-h-[500px] border-b md:border-b-0 lg:border-r border-ink/10 overflow-hidden">
                     <div className="relative w-[90%] max-w-[280px] sm:max-w-md aspect-[4/5] md:aspect-auto md:h-[90%]">
                        {/* Image 1 */}
                        <motion.div 
                            initial={fadeInUp.initial}
                            whileInView={fadeInUp.whileInView}
                            viewport={fadeInUp.viewport}
                            transition={{ ...fadeInUp.transition, delay: 0.4 }}
                            className="absolute top-0 left-0 w-[85%] z-20"
                        >
                           <div className="bg-paper p-2 md:p-3 pb-6 md:pb-10 shadow-xl rotate-[-2deg] transition-all duration-700 hover:rotate-0 hover:z-30 hover:scale-105 border border-ink/10">
                                <div className="aspect-[4/5] bg-gray-200 transition-all duration-500 overflow-hidden border border-ink/5">
                                     <ImageWithLoader 
                                        src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=800" 
                                        className="w-full h-full object-cover" 
                                        alt="Modern credit card payment experience"
                                     />
                                </div>
                                <div className="mt-2 md:mt-4 flex justify-between items-end px-1">
                                    <p className="text-ink font-serif italic text-[10px] md:text-sm">Fig A. Simple Rewards</p>
                                    <span className="text-[8px] md:text-[10px] font-bold text-ink/40 uppercase tracking-widest">Pg 1</span>
                                </div>
                           </div>
                        </motion.div>

                        {/* Image 2 */}
                        <motion.div 
                            initial={fadeInUp.initial}
                            whileInView={fadeInUp.whileInView}
                            viewport={fadeInUp.viewport}
                            transition={{ ...fadeInUp.transition, delay: 0.5 }}
                            className="absolute top-[20%] right-0 w-[65%] z-10"
                        >
                           <div className="bg-[#EAE8E0] p-3 pb-8 shadow-lg rotate-[3deg] transition-all duration-700 hover:rotate-0 hover:z-30 hover:scale-105 border border-ink/10">
                                <div className="aspect-square bg-gray-200 transition-all duration-500 overflow-hidden border border-ink/5">
                                     <ImageWithLoader 
                                        src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800" 
                                        className="w-full h-full object-cover" 
                                        alt="AI matching visualization"
                                     />
                                </div>
                                <div className="mt-3 text-center">
                                    <p className="text-ink font-serif italic text-xs">Fig B. Smart Matching</p>
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
                    className="md:col-span-2 lg:col-span-3 border-t lg:border-t-0 lg:border-l border-ink/10 pl-0 lg:pl-6 pt-8 flex flex-col justify-between"
                >
                     <div>
                        <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-4 md:mb-8 text-ink/40 border-b border-ink/10 pb-2">In This Issue</h4>
                        <ul className="space-y-0">
                            {[
                                { title: "AI Magic", page: "03", link: "/ai-magic", desc: "Conversational Matching" },
                                { title: "Yureka OS", page: "05", link: "/yureka-os", desc: "Financial Engine" },
                                { title: "Card Explorer", page: "08", link: "/cards", desc: "Top Market Picks" },
                                { title: "Manifesto", page: "12", link: "/manifesto", desc: "Our Vision" }
                            ].map((item, i) => (
                                <li key={i} className="border-b border-ink/10 last:border-0 font-sans">
                                    <Link to={item.link} className="flex justify-between items-start py-3 md:py-4 group cursor-pointer hover:bg-ink/5 px-2 -mx-2 transition-colors">
                                        <div>
                                            <span className="block font-serif text-lg md:text-xl text-ink group-hover:text-clay transition-colors mb-1">{item.title}</span>
                                            <span className="block text-[9px] md:text-[10px] uppercase tracking-wider text-ink/50">{item.desc}</span>
                                        </div>
                                        <span className="font-mono text-xs md:text-sm text-ink/30 font-bold">Pg.{item.page}</span>
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