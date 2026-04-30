import React, { useState, useEffect } from 'react';
import { ArrowRight, Menu, X, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isDarkPage = location.pathname.startsWith('/blogs') || location.pathname.startsWith('/cards') || location.pathname.startsWith('/security-protocol');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else if (window.scrollY < 30) {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header 
        className={`
            fixed left-0 right-0 
            flex justify-center
            z-[90]
            transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1)
            ${isScrolled ? 'top-6 md:top-8' : 'top-0'}
        `}
      >
        <div 
            className={`
                flex items-center justify-between
                transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1)
                ${isScrolled 
                    ? `w-[92%] md:w-[90%] lg:w-[85%] max-w-7xl px-5 md:px-8 py-3 bg-[#0a0a0a]/60 border border-white/10 rounded-full shadow-2xl shadow-black/40 backdrop-blur-2xl` 
                    : `w-full max-w-[1440px] bg-transparent border-b border-white/[0.03] px-6 md:px-12 py-6 md:py-8`
                }
            `}
        >
            {/* Logo Section */}
            <div className="flex flex-col relative z-10 group cursor-pointer">
                <div className="flex items-center gap-3">
                    <Link to="/" className="font-heading font-black tracking-tighter text-lg md:text-xl text-white leading-none hover:opacity-80 transition-opacity flex items-baseline uppercase">
                        Yureka<span className="text-[#34d399]">.</span>money
                    </Link>
                    {/* Neural Status Indicator */}
                    <div className="flex items-center gap-2 px-2.5 py-1 bg-white/[0.03] border border-white/[0.08] rounded-full backdrop-blur-md">
                        <motion.div 
                            animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                            className="w-1.5 h-1.5 bg-[#34d399] rounded-full shadow-[0_0_10px_rgba(52,211,153,0.4)]"
                        />
                        <span className="text-[8px] font-black text-[#34d399]/70 uppercase tracking-[0.25em] hidden md:block">System Active</span>
                    </div>
                </div>

                {!isScrolled && (
                      <motion.span 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="hidden md:block text-[9px] uppercase tracking-[0.4em] text-white/40 mt-1.5 font-bold"
                      >
                        AI-Driven Credit Card Intelligence
                      </motion.span>
                )}
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center relative z-10 shrink-0 gap-8">
                <div className="flex items-center gap-7">
                    {[
                        { name: 'Cards', path: '/cards' },
                        { name: 'Manifesto', path: '/manifesto' },
                        { name: 'Tools', path: '/free-tools' },
                        { name: 'Insights', path: '/blogs' }
                    ].map((item) => (
                        <Link 
                            key={item.name}
                            to={item.path} 
                            className={`
                                 relative text-[10px] font-black uppercase tracking-[0.2em] transition-all py-1
                                ${location.pathname === item.path 
                                    ? 'text-[#34d399] after:content-[""] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-px after:bg-[#34d399]' 
                                    : 'text-white/30 hover:text-white'}
                            `}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

                <div className="h-4 w-px bg-white/10" />

                <div className="flex items-center gap-6">
                      <Link to="/yureka-ai" className="text-white/60 hover:text-white font-bold text-[10px] transition-colors whitespace-nowrap uppercase tracking-[0.2em]">
                        AI Engine
                      </Link>
                    
                    <Link to="/join-waitlist" className="bg-[#34d399] text-[#0a0a0a] text-[10px] font-black uppercase tracking-[0.25em] px-8 py-3.5 flex items-center gap-2.5 group transition-all duration-500 rounded-full shrink-0 shadow-xl shadow-[#34d399]/10 hover:shadow-[#34d399]/20 hover:-translate-y-1">
                        <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
                        <span>Join Waitlist</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
                    </Link>
                </div>
            </div>

             {/* Mobile Toggle */}
             <div className="md:hidden flex items-center ml-auto gap-4">
                  <button 
                    className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all"
                    onClick={() => setIsMobileMenuOpen(true)}
                >
                    <Menu size={22} />
                </button>
            </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[110] pointer-events-auto">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#000]/80 backdrop-blur-xl" 
                onClick={() => setIsMobileMenuOpen(false)}
              />
              
              <motion.div 
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                className="absolute top-0 right-0 h-full w-[85%] max-w-[400px] bg-[#0a0a0a] border-l border-white/10 p-10 flex flex-col shadow-2xl"
              >
                  <div className="flex justify-between items-center mb-16">
                      <span className="font-heading text-2xl font-black text-white flex items-end uppercase tracking-tighter">
                        Menu<span className="text-[#34d399] ml-1">.</span>
                      </span>

                      <button onClick={() => setIsMobileMenuOpen(false)} className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center rounded-full text-white hover:bg-white hover:text-[#0a0a0a] transition-all">
                          <X size={24} />
                      </button>
                  </div>
                  
                  <nav className="flex flex-col gap-10">
                    {[
                        { name: 'Card Explorer', path: '/cards', desc: 'AI-matched credit card selection' },
                        { name: 'Manifesto', path: '/manifesto', desc: 'The future of credit rewards' },
                        { name: 'Free Tools', path: '/free-tools', desc: 'Institutional grade calculators' },
                        { name: 'Insights', path: '/blogs', desc: 'The elite credit journal' },
                        { name: 'Yureka AI', path: '/yureka-ai', desc: 'Access the AI Engine' }
                    ].map((item, idx) => (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.08 }}
                          key={item.name}
                        >
                            <Link 
                                to={item.path} 
                                onClick={() => setIsMobileMenuOpen(false)} 
                                className="group block"
                            >
                                <div className="text-2xl font-black text-white group-hover:text-[#34d399] transition-colors mb-1.5 uppercase tracking-tight">{item.name}</div>
                                <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/20 group-hover:text-white/40">{item.desc}</div>
                            </Link>
                        </motion.div>
                    ))}
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="mt-6"
                    >
                        <Link to="/join-waitlist" onClick={() => setIsMobileMenuOpen(false)} className="w-full h-16 bg-[#34d399] text-[#0a0a0a] font-black uppercase tracking-[0.25em] text-[11px] flex items-center justify-center gap-3 transition-all rounded-full shadow-2xl shadow-[#34d399]/10">
                            <Sparkles size={16} />
                            Join Waitlist Now
                        </Link>
                    </motion.div>
                  </nav>

                  <div className="mt-auto pt-10 border-t border-white/5">
                    <div className="flex justify-between items-center text-white/40 text-[9px] uppercase tracking-[0.3em] font-mono">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-[#34d399] rounded-full animate-pulse" />
                            <span>Service Online</span>
                        </div>
                        <span>© 2026 YUREKA</span>
                    </div>
                  </div>
              </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;