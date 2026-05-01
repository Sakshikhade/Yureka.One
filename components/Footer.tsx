import React from 'react';
import { Instagram, Linkedin, Twitter, Facebook, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-cream text-white/80 border-t border-white/10 relative z-10 pt-12 pb-10">
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Background Branding (Glassy & Floating) */}
        <div className="absolute inset-x-0 bottom-20 flex items-center justify-center pointer-events-none overflow-hidden h-64 z-[-1]">
            <motion.div
                initial={{ y: 0 }}
                animate={{ y: [-15, 15, -15] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="text-[6rem] md:text-[12rem] lg:text-[22rem] font-heading font-extrabold tracking-tighter text-white/[0.03] select-none blur-[1px] backdrop-blur-[1px] whitespace-nowrap leading-none"
            >


                YUREKA
            </motion.div>
        </div>

        {/* Top Section: Branding & Slogan */}

        {/* Top Section: Impact Stats Block (Image 2 Redesign) */}
        <div className="max-w-[1440px] mx-auto px-6 mb-10 md:mb-12">
           <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] w-full p-6 md:p-10 lg:p-10 flex flex-col lg:flex-row gap-8 lg:gap-8 justify-between text-white shadow-2xl relative overflow-hidden group">
               
               {/* Orbital Background Accent */}
               <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-10">
                   <div className="absolute -top-[50%] -right-[10%] w-[800px] h-[800px] rounded-full border border-white/20"></div>
                   <div className="absolute -top-[45%] -right-[5%] w-[700px] h-[700px] rounded-full border border-white/20"></div>
               </div>

               {/* Left Column: Brand & Tagline */}
               <div className="flex flex-col justify-center max-w-xs relative z-10">
                    <div className="flex items-center gap-2 mb-8">
                        <span className="text-xl md:text-2xl font-sans font-semibold tracking-wide text-white/80">Built with</span>
                        <span className="text-2xl animate-pulse">🧡</span>
                        <span className="text-xl md:text-2xl font-sans font-semibold tracking-wide text-white/80">by</span>
                        <span className="text-2xl md:text-3xl font-serif font-bold italic tracking-tighter ml-1">YUREKA.</span>
                    </div>
                   <p className="text-white/60 text-sm md:text-base font-sans leading-relaxed tracking-wide">
                       Curating India's Top 1% Credit Portfolios
                   </p>
               </div>

               {/* Middle Column: Stats */}
               <div className="flex flex-col justify-center space-y-10 lg:pl-16 lg:pr-8 relative z-10 lg:min-w-[280px]">
                   <div>
                       <div className="flex items-baseline gap-1 mb-1">
                           <span className="text-3xl md:text-4xl font-sans tracking-tight text-white/90">200</span>
                           <span className="text-2xl md:text-3xl font-sans text-clay font-light">+</span>
                       </div>
                       <p className="text-[11px] md:text-xs text-white/40 font-sans tracking-wider uppercase">Premium Cards Scanned</p>
                   </div>
                   
                   <div>
                       <div className="flex items-baseline gap-1 mb-1">
                           <span className="text-3xl md:text-4xl font-sans tracking-tight text-white/90">15<span className="text-2xl md:text-3xl font-sans text-clay font-light">%</span></span>
                           <span className="text-xl md:text-2xl font-sans text-white/60 font-light">/yr</span>
                       </div>
                       <p className="text-[11px] md:text-xs text-white/40 font-sans tracking-wider uppercase">Avg. Yield Increase</p>
                   </div>

                   <div>
                       <div className="flex items-baseline gap-2 mb-1">
                           <span className="text-xl md:text-2xl font-sans text-clay font-light">INR</span>
                           <span className="text-3xl md:text-4xl font-sans tracking-tight text-white/90">45K</span>
                       </div>
                       <p className="text-[11px] md:text-xs text-white/40 font-sans tracking-wider uppercase">Avg. Savings per User</p>
                   </div>
               </div>

               {/* Right Column: Imagery Grid - removed broken image */}
           </div>
        </div>

        {/* Middle Section: Links Grid (Newspaper Columns) */}
        <div className="max-w-[1440px] mx-auto px-6 mb-8 md:mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 border-l border-white/10">
                
                {/* Column 1 - Core Pages */}
                <div className="pl-6 md:pl-8 border-r border-white/10 min-h-[150px] md:min-h-[200px]">
                    <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-4 md:mb-8 text-white/20">Explore</h4>
                    <ul className="space-y-3 md:space-y-4">
                        <li><Link to="/cards" className="hover:text-clay font-serif text-xs md:text-sm transition-colors">Card Explorer</Link></li>
                        <li><Link to="/yureka-ai" className="hover:text-clay font-serif text-xs md:text-sm transition-colors">Yureka AI</Link></li>
                        <li><Link to="/free-tools" className="hover:text-clay font-serif text-xs md:text-sm transition-colors">Free Tools</Link></li>
                        <li><Link to="/manifesto" className="hover:text-clay font-serif text-xs md:text-sm transition-colors">Our Manifesto</Link></li>
                    </ul>
                </div>

                {/* Column 2 - Resources */}
                <div className="pl-6 md:pl-8 border-r border-white/10 min-h-[150px] md:min-h-[200px]">
                    <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-4 md:mb-8 text-white/20">Resources</h4>
                    <ul className="space-y-3 md:space-y-4">
                        <li><Link to="/blogs" className="hover:text-clay font-serif text-xs md:text-sm transition-colors">Blogs</Link></li>
                        <li><Link to="/jobs" className="hover:text-clay font-serif text-xs md:text-sm transition-colors">Careers at Yureka</Link></li>
                        <li><a href="#" className="hover:text-clay font-serif text-xs md:text-sm transition-colors">Press & Media</a></li>
                        <li><Link to="/join-waitlist" className="hover:text-clay font-serif text-xs md:text-sm transition-colors">Join the Waitlist</Link></li>
                        <li><Link to="/admin" className="hover:text-clay font-serif text-xs md:text-sm transition-colors opacity-30 hover:opacity-100">Admin Dashboard</Link></li>
                    </ul>
                </div>

                {/* Column 3 - Legal */}
                <div className="pl-6 md:pl-8 border-r border-white/10 min-h-[150px] md:min-h-[200px]">
                    <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-4 md:mb-8 text-white/20">Legal & Privacy</h4>
                    <ul className="space-y-3 md:space-y-4">
                        <li><Link to="/terms-of-service" className="hover:text-clay font-serif text-xs md:text-sm transition-colors">Terms of Service</Link></li>
                        <li><Link to="/privacy-policy" className="hover:text-clay font-serif text-xs md:text-sm transition-colors">Privacy Policy</Link></li>
                        <li><Link to="/security-protocol" className="hover:text-clay font-serif text-xs md:text-sm transition-colors">Security Policy</Link></li>
                        <li><Link to="/community-guidelines" className="hover:text-clay font-serif text-xs md:text-sm transition-colors">Community Guidelines</Link></li>
                    </ul>
                </div>

                {/* Column 4 - Contact */}
                <div className="pl-6 md:pl-8 border-r border-white/10 min-h-[150px] md:min-h-[200px] col-span-1 sm:col-span-2 md:col-span-1 lg:col-span-2">
                    <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-4 md:mb-8 text-white/20">Contact Support</h4>
                    <div className="mb-6 md:mb-8">
                        <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">User Support (Pan-India)</p>
                        <a href="mailto:support@yureka.money" className="text-base md:text-lg font-serif hover:text-clay transition-colors group">
                           <span className="border-b border-transparent group-hover:border-clay">support@yureka.money</span>
                        </a>
                    </div>
                    <div className="mb-5 md:mb-6">
                        <p className="text-[10px] uppercase tracking-wider text-white/20 mb-1">Partnerships</p>
                        <a href="mailto:partners@yureka.money" className="text-base md:text-lg font-serif hover:text-clay transition-colors group">
                            <span className="border-b border-transparent group-hover:border-clay">partners@yureka.money</span>
                        </a>
                    </div>
                    <div className="flex gap-3 md:gap-4">
                          {[
                            { Icon: Instagram, label: "Instagram" },
                            { Icon: Linkedin, label: "LinkedIn" },
                            { Icon: Twitter, label: "Twitter" },
                            { Icon: Facebook, label: "Facebook" }
                          ].map(({ Icon, label }, i) => (
                               <a key={i} href="#" aria-label={label} className="w-8 h-8 md:w-10 md:h-10 border border-white/10 flex items-center justify-center text-white/60 hover:bg-clay hover:text-white transition-all shadow-sm hover:shadow-lg">
                                  <Icon size={16} strokeWidth={1.5} />
                               </a>
                          ))}
                    </div>
                </div>

            </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-[1440px] mx-auto px-6 mb-12">
            <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-white/20 text-[10px] md:text-xs font-mono uppercase tracking-widest text-center md:text-left">
                <p>© 2026 Yureka Technologies Pvt Ltd. All Rights Reserved.</p>
                <p className="mt-4 md:mt-0">Made with Pride in India</p>
            </div>
        </div>

        {/* IMAGE 2: THE "RIGHT SIDE" SUB-FOOTER */}
        <div className="w-full glass-dark glass-shine-container min-h-[400px] md:min-h-[600px] flex flex-col items-center justify-center relative overflow-hidden py-16 md:py-24 px-6 border-t border-white/5">
            {/* Dotted Starfield Background */}
            <div className="absolute inset-0 opacity-[0.15]" 
                 style={{ 
                    backgroundImage: 'radial-gradient(circle, #fff 0.5px, transparent 0.5px)', 
                    backgroundSize: '30px 30px' 
                 }}>
            </div>
            
            {/* Logo */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="relative z-10 mb-10"
            >
                <span className="text-5xl md:text-6xl text-white font-serif font-bold italic tracking-tighter">Y.</span>
            </motion.div>

            {/* Quick Links */}
            <div className="relative z-10 flex flex-col gap-3 w-full max-w-[400px] mb-12">
                 <Link to="/free-tools" className="w-full h-14 bg-white/5 border border-white/10 text-white/40 rounded-2xl text-sm font-light tracking-widest hover:bg-white/10 hover:text-white transition-all uppercase flex items-center justify-center">
                    Checkout Free Tools
                 </Link>
                 <Link to="/cards" className="w-full h-14 bg-white/5 border border-white/10 text-white/40 rounded-2xl text-sm font-light tracking-widest hover:bg-white/10 hover:text-white transition-all uppercase flex items-center justify-center">
                    Cards
                 </Link>
            </div>

            {/* Vertical Line and Diamond */}
            <div className="relative z-10 flex flex-col items-center mb-10">
                 <div className="w-px h-24 bg-gradient-to-b from-transparent to-clay" />
                 <div className="w-2.5 h-2.5 bg-clay rotate-45 border border-clay shadow-[0_0_15px_#34d399]" />
            </div>

            {/* Pixel Headline */}
            <div className="relative z-10 text-center mb-4">
                <h2 className="text-2xl md:text-4xl text-white/20 font-mono tracking-tight mb-2">Welcome to the</h2>
                <h2 className="text-2xl sm:text-4xl md:text-7xl font-mono text-clay/90 tracking-tighter uppercase relative">
                   <span className="relative z-10 break-words text-center leading-tight">right side of earning</span>
                   {/* Pixel-like Glow effect */}
                   <div className="absolute inset-0 blur-[25px] bg-clay/10 -z-10" />
                </h2>
            </div>
            
            <p className="relative z-10 text-[10px] md:text-xs font-mono tracking-[0.4em] text-white/20 uppercase mb-12">
               © 2026 YUREKA. MONEY. ALL RIGHTS RESERVED.
            </p>

            {/* User Switcher (Tenant/Landlord replacement) */}
            <div className="relative z-10 flex bg-white/5 p-1 rounded-full border border-white/10">
                 <Link to="/join-waitlist" className="px-6 md:px-8 py-3 text-[10px] md:text-xs font-bold text-white/60 hover:text-white uppercase tracking-widest transition-colors">
                    Join Waitlist
                 </Link>
                 <Link to="/yureka-ai" className="px-6 md:px-8 py-3 text-[10px] md:text-xs font-bold text-cream bg-clay rounded-full uppercase tracking-widest shadow-xl hover:bg-white transition-colors">
                    Yureka AI
                 </Link>
            </div>

        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
