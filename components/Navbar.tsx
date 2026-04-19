import React, { useState, useEffect } from 'react';
import { ArrowRight, Menu, X, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

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
            transition-all duration-700 cubic-bezier(0.25, 0.8, 0.25, 1)
            ${isScrolled ? 'top-10' : 'top-10'}
        `}

      >
        <div 
            className={`
                flex items-center justify-between
                transition-all duration-700 cubic-bezier(0.25, 0.8, 0.25, 1)
                ${isScrolled 
                    ? 'w-[96%] md:w-[90%] lg:w-[80%] max-w-7xl pointer-events-auto px-4 md:px-8 py-2 md:py-2.5 bg-paper/80 md:bg-ink/0 glass-panel md:glass-panel rounded-full shadow-2xl border border-ink/10 filter backdrop-blur-md' 
                    : 'w-full max-w-[1440px] bg-transparent border-b border-ink/10 px-6 py-4 md:py-6 rounded-none shadow-none border-x-0 border-t-0'
                }
            `}
        >
            {/* Logo Section - Masthead Style */}
            <div className={`
                flex flex-col relative z-10 group cursor-pointer mr-8
            `}>
                <Link to="/" className="font-heading font-black tracking-tighter text-xl md:text-2xl text-ink leading-none hover:opacity-80 transition-opacity flex items-baseline uppercase">
                    Yureka<span className="text-clay">.</span>money
                </Link>

                {!isScrolled && (
                     <span className="hidden md:block text-[9px] uppercase tracking-[0.3em] text-ink/40 mt-1 font-sans">
                        AI-Driven Intelligence • Est. 2026
                     </span>
                )}
            </div>

            {/* Desktop Menu - Editorial Tabs */}
            <div className={`
                hidden md:flex items-center relative z-10 shrink-0 gap-8
            `}>
                <div className="flex items-center gap-6">
                    {[
                        { name: 'Cards', path: '/cards' },
                        { name: 'Manifesto', path: '/manifesto' },
                        { name: 'Yureka OS', path: '/yureka-os' },
                        { name: 'Blogs', path: '/blogs' }
                    ].map((item) => (
                        <Link 
                            key={item.name}
                            to={item.path} 
                            className={`
                                relative text-[11px] font-bold uppercase tracking-widest transition-all py-1
                                ${location.pathname === item.path ? 'text-ink border-b-2 border-clay' : 'text-ink/50 hover:text-ink'}
                            `}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

                <div className="h-4 w-px bg-ink/20"></div>

                <div className="flex items-center gap-4 lg:gap-6">
                      <Link to="/ai-magic" className={`
                        text-ink font-sans font-bold text-sm lg:text-base hover:text-clay transition-colors whitespace-nowrap uppercase tracking-widest
                      `}>
                        Yureka AI Magic
                      </Link>

                    
                    <Link to="/join-waitlist" className={`
                        bg-ink text-white text-[10px] lg:text-xs font-bold uppercase tracking-widest px-6 lg:px-8 py-3 lg:py-3.5
                        flex items-center gap-2 group transition-all duration-500 rounded-full shrink-0 shadow-xl hover:shadow-clay/20 hover:-translate-y-0.5
                    `}>
                        <Sparkles size={14} className="text-clay" />
                        <span>Join VIP Waitlist</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>

             {/* Mobile Toggle */}
             <div className="md:hidden ml-auto">
                 <button 
                    className={`
                        p-2 text-ink hover:text-clay transition-colors
                    `}
                    onClick={() => setIsMobileMenuOpen(true)}
                >
                    <Menu size={24} strokeWidth={1.5} />
                </button>
            </div>

        </div>
      </header>

      {/* Mobile Menu Overlay - Paper Texture */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[100] pointer-events-auto">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-ink/20 backdrop-blur-md" 
                onClick={() => setIsMobileMenuOpen(false)}
              />
              
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute top-0 right-0 h-full w-[85%] max-w-[400px] bg-paper border-l border-ink/10 p-8 flex flex-col shadow-2xl"
              >
                  <div className="flex justify-between items-center mb-12 border-b border-ink/10 pb-6">
                      <span className="font-sans text-3xl font-black text-ink flex items-end uppercase">
                        Index<span className="text-clay ml-1">.</span>
                      </span>

                      <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-ink/5 rounded-full transition-all">
                          <X size={24} className="text-ink" strokeWidth={1.5} />
                      </button>
                  </div>
                  
                  <nav className="flex flex-col gap-8">
                    {[
                        { name: 'Card Explorer', path: '/cards', desc: 'Curated Matches' },
                        { name: 'Manifesto', path: '/manifesto', desc: 'Our Mission' },
                        { name: 'Yureka OS', path: '/yureka-os', desc: 'Financial Engine' },
                        { name: 'Blogs', path: '/blogs', desc: 'Credit Insights' },
                        { name: 'Yureka AI', path: '/ai-magic', desc: 'AI Matching' }
                    ].map((item, idx) => (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          key={item.name}
                        >
                            <Link 
                                to={item.path} 
                                onClick={() => setIsMobileMenuOpen(false)} 
                                className="group block"
                            >
                                <div className="text-2xl font-heading font-black text-ink group-hover:text-clay transition-colors mb-1 uppercase">{item.name}</div>
                                <div className="text-[10px] font-sans uppercase tracking-[0.2em] text-ink/40 group-hover:text-ink/60">{item.desc}</div>
                            </Link>

                        </motion.div>
                    ))}
                    
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 }}
                      className="mt-4"
                    >
                        <Link to="/join-waitlist" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-4 bg-ink text-white font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all rounded-full shadow-lg">
                            <Sparkles size={16} className="text-clay" />
                            Join VIP Waitlist
                        </Link>
                    </motion.div>
                  </nav>

                  <div className="mt-auto pt-8 border-t border-ink/10 text-center">
                    <div className="flex justify-between text-ink/30 text-[10px] uppercase tracking-widest font-mono">
                        <span>Pan-India • Digital Ed.</span>
                        <span>© 2026</span>
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