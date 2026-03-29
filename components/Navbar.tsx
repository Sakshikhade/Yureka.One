import React, { useState, useEffect } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

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
            ${isScrolled ? 'top-6 pointer-events-none' : 'top-10'}
        `}
      >
        <div 
            className={`
                flex items-center justify-between
                transition-all duration-700 cubic-bezier(0.25, 0.8, 0.25, 1)
                ${isScrolled 
                    ? 'w-[92%] md:w-[85%] lg:w-[75%] max-w-6xl pointer-events-auto px-6 py-3 glass-panel rounded-full shadow-xl border border-ink/5' 
                    : 'w-[96%] max-w-[1440px] bg-transparent border-b border-ink/10 px-0 py-6 rounded-none shadow-none border-x-0 border-t-0'
                }
            `}
        >
            {/* Logo Section - Masthead Style */}
            <div className={`
                flex flex-col relative z-10 group cursor-pointer mr-8
            `}>
                <Link to="/" className="font-serif font-black tracking-tighter text-lg md:text-xl text-ink leading-none hover:opacity-80 transition-opacity flex items-baseline">
                    Jupyter<span className="text-teal">.</span>credit
                </Link>
                {!isScrolled && (
                     <span className="hidden md:block text-[10px] uppercase tracking-[0.3em] text-ink/40 mt-1 font-sans">
                        AI-Driven Credit • Vol. 1
                     </span>
                )}
            </div>

            {/* Desktop Menu - Editorial Tabs */}
            <div className={`
                hidden md:flex items-center relative z-10 shrink-0 gap-8
            `}>
                <div className="flex items-center gap-6">
                    {[
                        { name: 'Cards', path: '/explorer' },
                        { name: 'Manifesto', path: '/story' },
                        { name: 'Rewards', path: '/matrix' },
                        { name: 'Blogs', path: '/blogs' }
                    ].map((item) => (
                        <Link 
                            key={item.name}
                            to={item.path} 
                            className={`
                                relative text-xs font-bold uppercase tracking-widest transition-all py-1
                                ${location.pathname === item.path ? 'text-ink border-b border-ink' : 'text-ink/50 hover:text-ink'}
                            `}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

                <div className="h-4 w-px bg-ink/20"></div>

                <div className="flex items-center gap-4">
                     <Link to="/ai" className={`
                        text-ink font-serif italic text-lg hover:text-clay transition-colors
                     `}>
                        Jupyter AI Magic
                     </Link>
                    
                    <Link to="/vip" className={`
                        bg-clay hover:bg-teal text-white text-xs font-bold uppercase tracking-widest px-6 py-3
                        flex items-center gap-2 group transition-all duration-500 rounded-full
                    `}>
                        <span>Join VIP Waitlist</span>
                        <ArrowRight size={14} className="text-white group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>
            </div>

             {/* Mobile Toggle */}
             <div className="md:hidden ml-auto">
                 <button 
                    className={`
                        p-2 text-ink hover:text-ink/70 transition-colors
                    `}
                    onClick={() => setIsMobileMenuOpen(true)}
                >
                    <Menu size={24} strokeWidth={1.5} />
                </button>
            </div>

        </div>
      </header>

      {/* Mobile Menu Overlay - Paper Texture */}
      <div className={`fixed inset-0 z-[100] transition-all duration-500 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-500 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsMobileMenuOpen(false)}></div>
          
          <div className={`
                absolute top-0 right-0 h-full w-[85%] max-w-[400px]
                glass-panel border-l border-ink/10
                p-8 flex flex-col
                shadow-2xl
                transform transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)
                ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          `}>
             <div className="flex justify-between items-center mb-12 border-b border-ink/10 pb-6">
                  <span className="font-serif text-3xl font-bold text-ink">Index</span>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-ink/5 rounded-full transition-all">
                      <X size={24} className="text-ink" strokeWidth={1} />
                  </button>
              </div>
              
              <nav className="flex flex-col gap-6">
                {[
                    { name: 'Card Explorer', path: '/explorer', desc: 'Curated Matches' },
                    { name: 'Manifesto', path: '/story', desc: 'Our Mission' },
                    { name: 'Rewards', path: '/matrix', desc: 'Voucher Savings' },
                    { name: 'Blogs', path: '/blogs', desc: 'Credit Insights' },
                    { name: 'Jupyter AI', path: '/ai', desc: 'AI Matching' }
                ].map((item) => (
                    <Link 
                        key={item.name}
                        to={item.path} 
                        onClick={() => setIsMobileMenuOpen(false)} 
                        className="group"
                    >
                        <div className="text-2xl font-serif text-ink group-hover:text-teal transition-colors mb-1">{item.name}</div>
                        <div className="text-xs font-sans uppercase tracking-widest text-ink/40 group-hover:text-ink/60">{item.desc}</div>
                    </Link>
                ))}
                
                <div className="h-px bg-ink/10 my-6 w-full"></div>
                
                <Link to="/vip" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-4 border border-ink text-ink hover:bg-ink hover:text-white font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all rounded-lg">
                    Join VIP Waitlist
                </Link>
              </nav>

              <div className="mt-auto pt-8 border-t border-ink/10">
                <div className="flex justify-between text-ink/30 text-xs uppercase tracking-widest">
                    <span>Bengaluru</span>
                    <span>© 2026</span>
                </div>
              </div>
          </div>
      </div>
    </>
  );
};

export default Navbar;