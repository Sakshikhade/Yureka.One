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
                    ? 'w-[92%] md:w-[90%] lg:w-[80%] max-w-7xl pointer-events-auto px-4 md:px-6 py-2 bg-cream/40 rounded-full shadow-lg shadow-black/10 border border-white/50 backdrop-blur-xl' 
                    : 'w-full max-w-[1440px] bg-transparent border-b border-ink/10 px-4 md:px-6 py-5 md:py-6 rounded-none shadow-none border-x-0 border-t-0'
                }
            `}
        >
            {/* Logo Section - Masthead Style */}
            <div className={`
                flex flex-col relative z-10 group cursor-pointer
            `}>
                <div className="flex items-center gap-3">
                    <Link to="/" className="font-heading font-extrabold tracking-tighter text-base md:text-[17px] text-ink leading-none hover:opacity-75 transition-opacity flex items-baseline uppercase">
                        Yureka<span className="text-clay">.</span>money
                    </Link>
                    {/* Neural Status Indicator */}
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#047857]/5 border border-[#047857]/10 rounded-full">
                        <motion.div 
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-1.5 h-1.5 bg-clay rounded-full shadow-[0_0_8px_rgba(4,120,87,0.5)]"
                        />
                        <span className="text-[8px] font-extrabold text-clay uppercase tracking-widest hidden md:block">Neural Active</span>
                    </div>
                </div>

                {!isScrolled && (
                      <span className="hidden md:block text-[10px] uppercase tracking-[0.3em] text-ink/40 mt-1 font-sans font-bold">
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
                        { name: 'Secured', path: '/#secured' },
                        { name: 'Manifesto', path: '/manifesto' },
                        { name: 'Free Tools', path: '/free-tools' },
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

                <div className="h-4 w-px bg-[#242424]/20"></div>

                <div className="flex items-center gap-4 lg:gap-6">
                      <Link to="/yureka-ai" className={`
                        text-[#242424] font-sans font-medium text-[11px] hover:text-[#047857] transition-colors whitespace-nowrap uppercase tracking-widest
                      `}>
                        Yureka AI
                      </Link>

                    
                    <Link to="/coming-soon" className={`
                        bg-[#242424] text-cream text-[10px] font-medium uppercase tracking-widest px-5 lg:px-7 py-2.5 lg:py-3
                        flex items-center gap-2 group transition-all duration-500 rounded-full shrink-0 shadow-lg hover:shadow-clay/20 hover:-translate-y-0.5
                    `}>
                        <Sparkles size={14} className="text-[#047857]" />
                        <span>Intelligence Lab</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>

             {/* Mobile Toggle */}
             <div className="md:hidden flex items-center ml-auto gap-4">
                 <button 
                    className="p-1.5 text-[#242424] hover:text-[#047857] transition-colors"
                    onClick={() => setIsMobileMenuOpen(true)}
                >
                    <Menu size={20} strokeWidth={2} />
                </button>
            </div>

        </div>
      </header>

      {/* Mobile Menu Overlay - Paper Texture */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[110] pointer-events-auto">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#242424]/20 backdrop-blur-md" 
                onClick={() => setIsMobileMenuOpen(false)}
              />
              
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute top-0 right-0 h-full w-[85%] max-w-[400px] bg-cream/80 backdrop-blur-3xl border-l border-white/40 p-8 flex flex-col shadow-2xl"
              >
                  <div className="flex justify-between items-center mb-12 border-b border-ink/10 pb-6">
                      <span className="font-sans text-2xl font-medium text-[#242424] flex items-end uppercase">
                        Index<span className="text-[#047857] ml-1">.</span>
                      </span>

                      <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-[#242424]/5 rounded-full transition-all">
                          <X size={24} className="text-[#242424]" strokeWidth={1.5} />
                      </button>
                  </div>
                  
                  <nav className="flex flex-col gap-8">
                    {[
                        { name: 'Card Explorer', path: '/cards', desc: 'Curated Matches' },
                        { name: 'Secured', path: '/#secured', desc: 'Home Protection' },
                        { name: 'Manifesto', path: '/manifesto', desc: 'Our Mission' },
                        { name: 'Free Tools', path: '/free-tools', desc: 'Financial Engine' },
                        { name: 'Blogs', path: '/blogs', desc: 'Credit Insights' },
                        { name: 'Yureka AI', path: '/yureka-ai', desc: 'AI Matching' }
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
                                <div className="text-xl font-heading font-medium text-[#242424] group-hover:text-[#047857] transition-colors mb-1 uppercase">{item.name}</div>
                                <div className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#242424]/40 group-hover:text-[#242424]/60">{item.desc}</div>
                            </Link>

                        </motion.div>
                    ))}
                    
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 }}
                      className="mt-4"
                    >
                        <Link to="/coming-soon" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-4 bg-[#242424] text-cream font-medium uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all rounded-full shadow-lg">
                            <Sparkles size={16} className="text-[#047857]" />
                            Intelligence Lab
                        </Link>
                    </motion.div>
                  </nav>

                  <div className="mt-auto pt-8 border-t border-ink/10 text-center">
                    <div className="flex justify-between text-[#242424]/30 text-[10px] uppercase tracking-widest font-mono">
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