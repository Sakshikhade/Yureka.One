import React from 'react';
import { Instagram, Linkedin, Twitter, Facebook, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-cream text-ink border-t border-black/10 relative z-10 pt-20 pb-10">
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
                className="text-[8rem] md:text-[15rem] lg:text-[22rem] font-heading font-black tracking-tighter text-ink/[0.08] select-none blur-[1px] backdrop-blur-[1px] whitespace-nowrap leading-none"
            >


                YUREKA
            </motion.div>
        </div>

        {/* Top Section: Branding & Slogan */}

        <div className="max-w-[1440px] mx-auto px-6 mb-12 md:mb-20 border-b border-black/10 pb-12 md:pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                <div className="lg:col-span-8">
                    <span className="block text-clay text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-4 md:mb-6">Yureka.money • AI-Driven Credit Card Platform</span>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif leading-[0.9] tracking-tighter mb-4 md:mb-6 uppercase">
                        Yureka<span className="text-clay">.</span>
                    </h2>
                    <p className="text-base md:text-xl font-serif italic text-ink/60 max-w-2xl leading-relaxed">
                        "Why settle for a card when you can optimize your wealth? AI-matched rewards, zero fees, and financial freedom."
                    </p>
                </div>
                <div className="lg:col-span-4 flex flex-col justify-end items-start lg:items-end">
                    <div className="border border-clay/20 p-6 md:p-8 w-full max-w-sm hover:bg-clay hover:text-white transition-all group cursor-pointer bg-white shadow-sm hover:shadow-xl">
                        <h3 className="text-lg md:text-xl font-serif mb-2">Fintech Founders</h3>
                        <p className="text-sm md:text-base opacity-60 mb-4 md:mb-6 group-hover:opacity-100">Partner with us to reach 200M+ credit-ready users in India. Launching Q2 2026.</p>
                        <div className="flex justify-between items-center border-t border-current pt-4">
                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">Partner With Us</span>
                            <ArrowUpRight size={16} />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Middle Section: Links Grid (Newspaper Columns) */}
        <div className="max-w-[1440px] mx-auto px-6 mb-12 md:mb-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 border-l border-black/10">
                
                {/* Column 1 - Core Pages */}
                <div className="pl-6 md:pl-8 border-r border-black/10 min-h-[150px] md:min-h-[200px]">
                    <h4 className="font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] mb-4 md:mb-8 text-black/40">Explore</h4>
                    <ul className="space-y-3 md:space-y-4">
                        <li><Link to="/cards" className="hover:text-clay font-serif text-sm md:text-base transition-colors">Card Explorer</Link></li>
                        <li><Link to="/yureka-ai" className="hover:text-clay font-serif text-sm md:text-base transition-colors">Yureka AI</Link></li>
                        <li><Link to="/free-tools" className="hover:text-clay font-serif text-sm md:text-base transition-colors">Free Tools</Link></li>
                        <li><Link to="/manifesto" className="hover:text-clay font-serif text-sm md:text-base transition-colors">Our Manifesto</Link></li>
                    </ul>
                </div>

                {/* Column 2 - Resources */}
                <div className="pl-6 md:pl-8 border-r border-black/10 min-h-[150px] md:min-h-[200px]">
                    <h4 className="font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] mb-4 md:mb-8 text-black/40">Resources</h4>
                    <ul className="space-y-3 md:space-y-4">
                        <li><Link to="/blogs" className="hover:text-clay font-serif text-sm md:text-base transition-colors">Blogs</Link></li>
                        <li><Link to="/jobs" className="hover:text-clay font-serif text-sm md:text-base transition-colors">Careers at Yureka</Link></li>
                        <li><a href="#" className="hover:text-clay font-serif text-sm md:text-base transition-colors">Press & Media</a></li>
                        <li><Link to="/join-waitlist" className="hover:text-clay font-serif text-sm md:text-base transition-colors">Apply for VIP Access</Link></li>
                        <li><Link to="/admin" className="hover:text-clay font-serif text-sm md:text-base transition-colors opacity-30 hover:opacity-100">Admin Dashboard</Link></li>
                    </ul>
                </div>

                {/* Column 3 - Legal */}
                <div className="pl-6 md:pl-8 border-r border-black/10 min-h-[150px] md:min-h-[200px]">
                    <h4 className="font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] mb-4 md:mb-8 text-black/40">Legal & Privacy</h4>
                    <ul className="space-y-3 md:space-y-4">
                        <li><Link to="/terms-of-service" className="hover:text-clay font-serif text-sm md:text-base transition-colors">Terms of Service</Link></li>
                        <li><Link to="/privacy-policy" className="hover:text-clay font-serif text-sm md:text-base transition-colors">Privacy Policy</Link></li>
                        <li><Link to="/security-protocol" className="hover:text-clay font-serif text-sm md:text-base transition-colors">Security Protocol</Link></li>
                        <li><Link to="/community-guidelines" className="hover:text-clay font-serif text-sm md:text-base transition-colors">Community Guidelines</Link></li>
                    </ul>
                </div>

                {/* Column 4 - Contact */}
                <div className="pl-6 md:pl-8 border-r border-black/10 min-h-[150px] md:min-h-[200px] col-span-1 sm:col-span-2 md:col-span-1 lg:col-span-2">
                    <h4 className="font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] mb-4 md:mb-8 text-black/60">Contact Bureau</h4>
                    <div className="mb-6 md:mb-8">
                        <p className="text-[10px] uppercase tracking-wider text-ink/70 mb-1">User Support (Pan-India)</p>
                        <a href="mailto:support@yureka.money" className="text-lg md:text-xl font-serif hover:text-clay transition-colors group">
                           <span className="border-b border-transparent group-hover:border-clay">support@yureka.money</span>
                        </a>
                    </div>
                    <div className="mb-6 md:mb-8">
                        <p className="text-[10px] uppercase tracking-wider text-ink/50 mb-1">Partnerships</p>
                        <a href="mailto:partners@yureka.money" className="text-lg md:text-xl font-serif hover:text-clay transition-colors group">
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
                               <a key={i} href="#" aria-label={label} className="w-8 h-8 md:w-10 md:h-10 border border-black/20 flex items-center justify-center text-ink hover:bg-clay hover:text-white transition-all shadow-sm hover:shadow-lg">
                                  <Icon size={16} strokeWidth={1.5} />
                               </a>
                          ))}
                    </div>
                </div>

            </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-[1440px] mx-auto px-6">
            <div className="border-t border-black/10 pt-8 flex flex-col md:flex-row justify-between items-center text-ink/60 text-[10px] md:text-xs font-mono uppercase tracking-widest text-center md:text-left">
                <p>© 2026 Yureka Technologies Pvt Ltd. All Rights Reserved.</p>
                <p className="mt-4 md:mt-0">Made with Pride in India</p>
            </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
