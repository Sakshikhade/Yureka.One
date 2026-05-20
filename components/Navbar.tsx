import React, { useState, useEffect } from 'react';
import { ArrowRight, Menu, X, Sparkles, ChevronDown, LayoutGrid, Calculator, ArrowRightLeft, LogOut, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useSupabase } from './SupabaseProvider';

const Navbar: React.FC = () => {
  const { supabase, user, currentUserStatus } = useSupabase();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const EXPLORE_ITEMS = [
    { name: 'Categories', path: '/categories', icon: LayoutGrid, desc: 'Find cards by lifestyle' },
    { name: 'Tools', path: '/free-tools', icon: Calculator, desc: 'Institutional calculators' },
    { name: 'Compare', path: '/compare', icon: ArrowRightLeft, desc: 'Side-by-side analysis' }
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
                        YUREKA<span className="text-clay">.</span>MONEY
                    </div>
                </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center relative z-10 shrink-0 gap-6 lg:gap-10">
                <nav className="flex items-center gap-6 lg:gap-8">
                    <Link 
                        to="/cards" 
                        className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all py-1 ${location.pathname === '/cards' ? 'text-clay' : 'text-white/40 hover:text-white'}`}
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
                            className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all py-1 ${isExploreOpen ? 'text-clay' : 'text-white/40 hover:text-white'}`}
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
                                    <div className="bg-[#0f0f0f] border border-white/15 rounded-[2rem] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                                        <div className="flex flex-col gap-1">
                                            {EXPLORE_ITEMS.map((item) => (
                                                <Link
                                                    key={item.name}
                                                    to={item.path}
                                                    className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-all group/item"
                                                >
                                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover/item:bg-clay/10 transition-colors">
                                                        <item.icon size={18} className="text-white/70 group-hover/item:text-clay" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[11px] font-black text-white uppercase tracking-wider">{item.name}</span>
                                                        <span className="text-[9px] font-bold text-white/60 uppercase tracking-widest mt-0.5">{item.desc}</span>
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
                        className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all py-1 ${location.pathname === '/blogs' ? 'text-clay' : 'text-white/40 hover:text-white'}`}
                    >
                        Blogs
                    </Link>
                </nav>

                <div className="h-4 w-px bg-white/10" />

                <div className="flex items-center gap-6 lg:gap-8">
                      <Link to="/yureka-ai" className="text-white/40 hover:text-white font-bold text-[10px] transition-colors whitespace-nowrap uppercase tracking-[0.2em]">
                        YurekaAi
                      </Link>
                </div>
                    
                <div className="flex items-center gap-3 shrink-0">
                    {!user ? (
                        <>
                            <Link 
                                to="/login" 
                                className="bg-[#34d399] text-black text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2.5 transition-all duration-500 rounded-full shadow-[0_10px_30px_-10px_rgba(52,211,153,0.5)] hover:scale-105 whitespace-nowrap"
                            >
                                Login
                            </Link>
                            <Link 
                                to="/join-waitlist" 
                                className="bg-[#34d399] text-black text-[10px] font-black uppercase tracking-[0.2em] px-8 py-2.5 transition-all duration-500 rounded-full shadow-[0_10px_30px_-10px_rgba(52,211,153,0.5)] hover:scale-105 whitespace-nowrap"
                            >
                                Join Waitlist
                            </Link>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            {currentUserStatus === 'admin' ? (
                                <Link 
                                    to="/admin" 
                                    className="bg-clay text-cream text-[10px] font-black uppercase tracking-[0.2em] px-8 py-2.5 transition-all duration-500 rounded-full shadow-lg hover:shadow-clay/20 whitespace-nowrap"
                                >
                                    Admin Panel
                                </Link>
                            ) : currentUserStatus === 'accepted' ? (
                                <Link 
                                    to="/dashboard" 
                                    className="bg-clay text-cream text-[10px] font-black uppercase tracking-[0.2em] px-8 py-2.5 transition-all duration-500 rounded-full shadow-lg hover:shadow-clay/20 whitespace-nowrap"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <Link 
                                    to="/waiting" 
                                    className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white px-4 whitespace-nowrap"
                                >
                                    My Status
                                </Link>
                            )}
                            <button 
                                onClick={handleLogout}
                                className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white px-4"
                            >
                                Logout
                            </button>
                        </div>
                    )}
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
                className="absolute top-0 right-0 h-full w-[85%] max-w-[400px] bg-cream border-l border-white/10 p-10 flex flex-col shadow-2xl"
              >
                  <div className="flex justify-between items-center mb-16">
                      <span className="font-heading text-2xl font-black text-white flex items-end uppercase tracking-tighter">
                        Menu<span className="text-clay ml-1">.</span>
                      </span>

                      <button onClick={() => setIsMobileMenuOpen(false)} className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center rounded-full text-white hover:bg-white hover:text-cream transition-all">
                          <X size={24} />
                      </button>
                  </div>
                  
                  <nav className="flex flex-col gap-10">
                    {[
                        { name: 'Card Explorer', path: '/cards', desc: 'Expert audited credit selection' },
                        { name: 'Categories', path: '/categories', desc: 'Browse by lifestyle & perks' },
                        { name: 'Compare', path: '/compare', desc: 'Side-by-side strategic comparison' },
                        { name: 'Explore', path: '/manifesto', desc: 'The decentralization of yield' },
                        { name: 'Free Tools', path: '/free-tools', desc: 'Institutional grade calculators' },
                        { name: 'Blogs', path: '/blogs', desc: 'The elite credit journal' },
                        { name: 'Yureka AI', path: '/yureka-ai', desc: 'Access the intelligence hub' }
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
                                <div className="text-2xl font-black text-white group-hover:text-clay transition-colors mb-1.5 uppercase tracking-tight">{item.name}</div>
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
                        <div className="flex flex-col gap-4 mt-6">
                            {!user ? (
                                <>
                                    <Link 
                                        to="/login" 
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="w-full h-14 bg-[#34d399] text-black font-black uppercase tracking-[0.25em] text-[10px] flex items-center justify-center rounded-full shadow-xl"
                                    >
                                        Login
                                    </Link>
                                    <Link 
                                        to="/join-waitlist" 
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="w-full h-14 bg-[#34d399] text-black font-black uppercase tracking-[0.25em] text-[10px] flex items-center justify-center rounded-full shadow-xl"
                                    >
                                        Join Waitlist
                                    </Link>
                                </>
                            ) : (
                                <>
                                    {currentUserStatus === 'admin' && (
                                        <Link 
                                            to="/admin" 
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="w-full h-14 bg-clay text-cream font-black uppercase tracking-[0.25em] text-[10px] flex items-center justify-center rounded-full shadow-xl"
                                        >
                                            Admin Panel
                                        </Link>
                                    )}
                                    {currentUserStatus === 'accepted' && (
                                        <Link 
                                            to="/dashboard" 
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="w-full h-14 bg-clay text-cream font-black uppercase tracking-[0.25em] text-[10px] flex items-center justify-center rounded-full shadow-xl"
                                        >
                                            Dashboard
                                        </Link>
                                    )}
                                    {(currentUserStatus === 'pending' || currentUserStatus === 'on-hold' || currentUserStatus === 'rejected') && (
                                        <Link 
                                            to="/waiting" 
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="w-full h-14 bg-white/5 border border-white/10 text-white font-black uppercase tracking-[0.25em] text-[10px] flex items-center justify-center rounded-full"
                                        >
                                            My Status
                                        </Link>
                                    )}
                                    <button 
                                        onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                                        className="w-full h-14 bg-white/5 border border-white/10 text-white font-black uppercase tracking-[0.25em] text-[10px] flex items-center justify-center rounded-full mb-2"
                                    >
                                        Logout
                                    </button>
                                </>
                            )}
                        </div>
                    </motion.div>
                  </nav>

                  <div className="mt-auto pt-10 border-t border-white/5">
                    <div className="flex justify-between items-center text-white/20 text-[9px] uppercase tracking-[0.3em] font-mono">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-clay rounded-full animate-pulse" />
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