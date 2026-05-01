import React, { useState, useEffect } from 'react';
import { ArrowRight, Menu, X, Sparkles, ChevronDown, LayoutGrid, Calculator, ArrowRightLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const EXPLORE_ITEMS = [
    { name: 'Categories', path: '/categories', icon: LayoutGrid, desc: 'Find cards by lifestyle' },
    { name: 'Tools', path: '/free-tools', icon: Calculator, desc: 'Institutional calculators' },
    { name: 'Compare', path: '/cards', icon: ArrowRightLeft, desc: 'Side-by-side analysis' }
  ];

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
            <div className="flex items-center relative z-10 group cursor-pointer shrink-0">
                <Link to="/" className="flex items-center gap-4 group">
                    <div className="font-heading font-black tracking-tighter text-lg md:text-xl text-white leading-none hover:opacity-80 transition-opacity flex items-baseline uppercase">
                        YUREKA<span className="text-[#34d399]">.</span>MONEY
                    </div>
                </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center relative z-10 shrink-0 gap-6 lg:gap-10">
                <nav className="flex items-center gap-6 lg:gap-8">
                    <Link 
                        to="/cards" 
                        className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all py-1 ${location.pathname === '/cards' ? 'text-[#34d399]' : 'text-white/40 hover:text-white'}`}
                    >
                        Cards
                    </Link>

                    {/* Explore Dropdown */}
                    <div 
                        className="relative"
                        onMouseEnter={() => setIsExploreOpen(true)}
                        onMouseLeave={() => setIsExploreOpen(false)}
                    >
                        <button 
                            className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all py-1 ${isExploreOpen ? 'text-[#34d399]' : 'text-white/40 hover:text-white'}`}
                        >
                            Explore <ChevronDown size={10} className={`transition-transform duration-500 ${isExploreOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isExploreOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                    className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-64 pointer-events-auto"
                                >
                                    <div className="bg-[#0d0d0d]/90 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-4 shadow-2xl">
                                        <div className="flex flex-col gap-1">
                                            {EXPLORE_ITEMS.map((item) => (
                                                <Link
                                                    key={item.name}
                                                    to={item.path}
                                                    className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-all group/item"
                                                >
                                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover/item:bg-[#34d399]/10 transition-colors">
                                                        <item.icon size={18} className="text-white/40 group-hover/item:text-[#34d399]" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[11px] font-black text-white uppercase tracking-wider">{item.name}</span>
                                                        <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{item.desc}</span>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <Link 
                        to="/blogs" 
                        className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all py-1 ${location.pathname === '/blogs' ? 'text-[#34d399]' : 'text-white/40 hover:text-white'}`}
                    >
                        Blogs
                    </Link>
                </nav>

                <div className="h-4 w-px bg-white/10" />

                <div className="flex items-center gap-6 lg:gap-8">
                      <Link to="/yureka-ai" className="text-white/40 hover:text-white font-bold text-[10px] transition-colors whitespace-nowrap uppercase tracking-[0.2em]">
                        YurekaAi
                      </Link>
                    
                    <Link to="/join-waitlist" className="bg-[#34d399] text-[#0a0a0a] text-[10px] font-black uppercase tracking-[0.25em] px-6 lg:px-8 py-2.5 lg:py-3 flex items-center gap-2.5 group transition-all duration-500 rounded-full shrink-0 shadow-[0_10px_20px_rgba(52,211,153,0.15)] hover:shadow-[0_10px_25px_rgba(52,211,153,0.25)] hover:-translate-y-0.5 active:scale-95">
                        <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
                        <span className="whitespace-nowrap">Join Waitlist</span>
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