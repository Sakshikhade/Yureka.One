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
        className="fixed inset-x-0 top-10 md:top-12 flex justify-center z-[100] pointer-events-none"
      >
        <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`
                pointer-events-auto
                flex items-center justify-between
                transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1)
                w-[94%] md:w-[92%] lg:w-[88%] max-w-6xl 
                px-6 md:px-10 py-3 md:py-4
                bg-black/60 border border-white/10 rounded-full shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] backdrop-blur-xl
                ${isScrolled ? 'scale-[0.98] py-2 md:py-3 border-white/20 shadow-black/60' : 'scale-100'}
            `}
        >
            {/* Logo Section */}
            <div className="flex items-center gap-4 relative z-10 group cursor-pointer">
                <Link to="/" className="flex items-center gap-4 group">
                    <div className="font-heading font-black tracking-tighter text-lg md:text-xl text-white leading-none hover:opacity-80 transition-opacity flex items-baseline uppercase">
                        YUREKA<span className="text-[#34d399]">.</span>MONEY
                    </div>
                    {/* Neural Status Indicator */}
                    <div className="flex items-center gap-2 px-3 py-1 bg-[#34d399]/5 border border-[#34d399]/20 rounded-full backdrop-blur-md shadow-[0_0_15px_rgba(52,211,153,0.05)]">
                        <motion.div 
                            animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.3, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="w-1.5 h-1.5 bg-[#34d399] rounded-full shadow-[0_0_8px_rgba(52,211,153,0.6)]"
                        />
                        <span className="text-[8px] font-black text-[#34d399] uppercase tracking-[0.3em] hidden md:block">System Active</span>
                    </div>
                </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center relative z-10 shrink-0 gap-10">
                <nav className="flex items-center gap-8">
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
                                    ? 'text-[#34d399]' 
                                    : 'text-white/40 hover:text-white'}
                            `}
                        >
                            {item.name}
                            {location.pathname === item.path && (
                                <motion.div 
                                    layoutId="nav-active"
                                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#34d399] rounded-full shadow-[0_0_8px_rgba(52,211,153,0.4)]"
                                />
                            )}
                        </Link>
                    ))}
                </nav>

                <div className="h-4 w-px bg-white/10" />

                <div className="flex items-center gap-8">
                      <Link to="/yureka-ai" className="text-white/40 hover:text-white font-bold text-[10px] transition-colors whitespace-nowrap uppercase tracking-[0.2em]">
                        Neural Engine
                      </Link>
                    
                    <Link to="/join-waitlist" className="bg-[#34d399] text-[#0a0a0a] text-[10px] font-black uppercase tracking-[0.25em] px-8 py-3 flex items-center gap-2.5 group transition-all duration-500 rounded-full shrink-0 shadow-[0_10px_20px_rgba(52,211,153,0.15)] hover:shadow-[0_10px_25px_rgba(52,211,153,0.25)] hover:-translate-y-0.5 active:scale-95">
                        <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
                        <span>Join Registry</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>

             {/* Mobile Toggle */}
             <div className="md:hidden flex items-center ml-auto gap-4">
                  <button 
                    className="p-2.5 bg-white/5 border border-white/10 rounded-full text-white hover:bg-white/10 transition-all shadow-lg"
                    onClick={() => setIsMobileMenuOpen(true)}
                >
                    <Menu size={20} />
                </button>
            </div>
        </motion.div>
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
                        { name: 'Card Explorer', path: '/cards', desc: 'Neural matched credit selection' },
                        { name: 'Manifesto', path: '/manifesto', desc: 'The decentralization of yield' },
                        { name: 'Free Tools', path: '/free-tools', desc: 'Institutional grade calculators' },
                        { name: 'Insights', path: '/blogs', desc: 'The elite credit journal' },
                        { name: 'Yureka AI', path: '/yureka-ai', desc: 'Access the neural core' }
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
                            Join Registry Now
                        </Link>
                    </motion.div>
                  </nav>

                  <div className="mt-auto pt-10 border-t border-white/5">
                    <div className="flex justify-between items-center text-white/20 text-[9px] uppercase tracking-[0.3em] font-mono">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-[#34d399] rounded-full animate-pulse" />
                            <span>System Online</span>
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