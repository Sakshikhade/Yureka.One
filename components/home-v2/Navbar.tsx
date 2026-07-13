import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSupabase } from '../SupabaseProvider';
import YurekaLogo from './YurekaLogo';
import SquashHamburger from './SquashHamburger';
import ScrambleText from './ScrambleText';

interface NavbarProps {
  // Optional homepage flourish: gates the initial fade-in on font readiness
  // instead of firing immediately on mount. Every other route just wants
  // the plain mount fade, so this defaults to true.
  entranceComplete?: boolean;
}

const NAV_LINKS = [
  { name: 'Card Explorer', path: '/cards', desc: 'Expert audited credit selection' },
  { name: 'Categories', path: '/categories', desc: 'Browse by lifestyle & perks' },
  { name: 'Brands', path: '/brands', desc: 'Top reward partner brands' },
  { name: 'Compare', path: '/compare', desc: 'Side-by-side strategic comparison' },
  { name: 'Free Tools', path: '/free-tools', desc: 'Institutional grade calculators' },
  { name: 'Yureka AI', path: '/yureka-ai', desc: 'Access the intelligence hub' },
  { name: 'For Brands', path: '/for-brands', desc: 'Partner, smart checkout & credit data' },
];

export default function Navbar({ entranceComplete = true }: NavbarProps) {
  const navigate = useNavigate();
  const { user, currentUserStatus, supabase } = useSupabase();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredCta, setHoveredCta] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    closeMenu();
    navigate('/');
  };

  const cta = !user
    ? { label: 'Join Waitlist', onClick: () => navigate('/join-waitlist') }
    : currentUserStatus === 'admin'
      ? { label: 'Admin Panel', onClick: () => navigate('/admin') }
      : currentUserStatus === 'accepted'
        ? { label: 'Dashboard', onClick: () => navigate('/dashboard') }
        : { label: 'My Status', onClick: () => navigate('/waiting') };

  return (
    <>
      <motion.nav
        className="yureka-one-home fixed top-0 left-0 right-0 z-50 h-20 w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: entranceComplete ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Desktop */}
        <div className="hidden md:flex items-center justify-between h-full px-6 md:mx-auto md:max-w-[60vw] md:px-0">
          <div className="flex items-center gap-2">
            <Link to="/">
              <motion.div
                className="flex h-12 px-5 items-center gap-2 bg-white/15 backdrop-blur-md rounded-[14px]"
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.22)' }}
                whileTap={{ scale: 0.98 }}
              >
                <YurekaLogo className="w-[18px] h-[18px] text-white" />
                <span className="text-white text-[16px] font-medium tracking-tight">Yureka</span>
              </motion.div>
            </Link>

            <button
              onClick={() => setMenuOpen(true)}
              className="flex h-12 w-12 items-center justify-center shrink-0 rounded-[14px] bg-white/15 backdrop-blur-md transition-colors hover:bg-white/20"
            >
              <SquashHamburger isOpen={menuOpen} variant="desktop" />
            </button>
          </div>

          <motion.button
            className="h-12 px-6 bg-white rounded-full flex items-center gap-2 text-black"
            onMouseEnter={() => setHoveredCta(true)}
            onMouseLeave={() => setHoveredCta(false)}
            onClick={cta.onClick}
            whileHover={{ scale: 1.03, backgroundColor: '#e2e2e6' }}
            whileTap={{ scale: 0.97 }}
          >
            {!user && <i className="bi bi-apple text-[16px]" />}
            <ScrambleText text={cta.label} isHovered={hoveredCta} className="text-[16px]" />
          </motion.button>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center justify-between h-full px-4 gap-2">
          <Link to="/" className="shrink-0">
            <div className="h-9 flex items-center gap-1.5 bg-white/15 backdrop-blur-md rounded-[10px] px-3.5">
              <YurekaLogo className="w-[14px] h-[14px] text-white shrink-0" />
              <span className="text-white text-[13px] font-medium tracking-tight whitespace-nowrap">
                Yureka
              </span>
            </div>
          </Link>

          <button
            onClick={() => setMenuOpen(true)}
            className="flex h-9 w-9 items-center justify-center shrink-0 rounded-[10px] bg-white/15 backdrop-blur-md ml-auto mr-2"
          >
            <SquashHamburger isOpen={menuOpen} variant="mobile" />
          </button>

          <motion.button
            className="h-9 px-3.5 bg-white rounded-full flex items-center gap-1.5 text-black shrink-0"
            onClick={cta.onClick}
            whileHover={{ scale: 1.03, backgroundColor: '#e2e2e6' }}
            whileTap={{ scale: 0.97 }}
          >
            {!user && <i className="bi bi-apple text-[13px]" />}
            <span className="text-[13px]">{cta.label}</span>
          </motion.button>
        </div>
      </motion.nav>

      {/* Slide-out menu -- shared between mobile and desktop so the site's
          full nav (more entries than the compact pill can hold) lives in
          one place instead of duplicating a desktop dropdown and a
          separate mobile drawer. */}
      <AnimatePresence>
        {menuOpen && (
          <div className="yureka-one-home fixed inset-0 z-[110]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
              onClick={closeMenu}
            />

            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="absolute top-0 right-0 h-full w-[85%] max-w-[400px] bg-black border-l border-white/10 p-8 sm:p-10 flex flex-col shadow-2xl"
            >
              <div className="flex justify-between items-center mb-12 sm:mb-16">
                <div className="flex items-center gap-2">
                  <YurekaLogo className="w-[18px] h-[18px] text-white" />
                  <span className="text-white text-[16px] font-medium tracking-tight">Yureka</span>
                </div>
                <button
                  onClick={closeMenu}
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-white/5 border border-white/10 flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-all"
                >
                  <i className="bi bi-x-lg text-[16px]" />
                </button>
              </div>

              <nav className="flex-1 min-h-0 flex flex-col gap-8 sm:gap-10 overflow-y-auto">
                {NAV_LINKS.map((item, idx) => (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    key={item.name}
                  >
                    <Link to={item.path} onClick={closeMenu} className="group block">
                      <div className="text-[20px] sm:text-[22px] font-normal text-white group-hover:text-[#5fae52] transition-colors">
                        {item.name}
                      </div>
                      <div
                        style={{ fontFamily: 'Inter, sans-serif' }}
                        className="text-[11px] uppercase tracking-[0.2em] text-white/30 group-hover:text-white/50 mt-1"
                      >
                        {item.desc}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Pinned outside the scrollable link list -- with 7 links the
                  panel can run taller than the viewport, and this is the
                  one button on the page that must never require a scroll
                  to reach. */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="shrink-0 pt-6 flex flex-col gap-3"
              >
                <button
                  onClick={() => {
                    closeMenu();
                    cta.onClick();
                  }}
                  className="w-full h-14 bg-white text-black rounded-full flex items-center justify-center gap-2 text-[14px] font-medium"
                >
                  {!user && <i className="bi bi-apple text-[14px]" />}
                  {cta.label}
                </button>

                {user && (
                  <button
                    onClick={handleLogout}
                    className="w-full h-14 bg-white/5 border border-white/10 text-white rounded-full text-[14px] font-medium"
                  >
                    Logout
                  </button>
                )}
              </motion.div>

              <div className="shrink-0 mt-6 pt-8 sm:pt-10 border-t border-white/5">
                <div
                  style={{ fontFamily: 'Inter, sans-serif' }}
                  className="flex justify-between items-center text-white/25 text-[10px] uppercase tracking-[0.2em]"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#5fae52] rounded-full animate-pulse" />
                    <span>System Online</span>
                  </div>
                  <span>&copy; 2026 YUREKA</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
