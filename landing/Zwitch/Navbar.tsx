import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();

  // Scroll transforms for glassmorphism interpolation
  const bgOpacity = useTransform(scrollY, [0, 50], [0.02, 0.08]);
  const blurValue = useTransform(scrollY, [0, 50], [8, 24]);
  const borderOpacity = useTransform(scrollY, [0, 50], [0.05, 0.15]);

  const navItems = ['Work', 'Agency'];

  const handleNavClick = (id: string) => {
    setIsOpen(false);
    const targetElement = document.getElementById(id.toLowerCase());
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      <motion.nav
        style={{
          backgroundColor: useTransform(bgOpacity, (v) => `rgba(255, 255, 255, ${v})`),
          backdropFilter: useTransform(blurValue, (v) => `blur(${v}px)`),
          borderColor: useTransform(borderOpacity, (v) => `rgba(255, 255, 255, ${v})`),
        }}
        className={`w-full max-w-5xl border flex flex-col md:flex-row items-center justify-between py-4 px-6 md:px-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] transition-all duration-300 ${
          isOpen ? 'rounded-3xl' : 'rounded-full'
        }`}
      >
        <div className="w-full md:w-auto flex items-center justify-between">
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-2xl font-black tracking-tighter cursor-pointer flex items-center gap-2 select-none"
          >
            <span className="bg-gradient-to-r from-[#00f0ff] to-[#b026ff] bg-clip-text text-transparent">ZWITCH</span>
            <span className="w-2 h-2 rounded-full bg-[#00f0ff]" />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white hover:text-[#00f0ff] transition-colors p-1"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => handleNavClick(item)}
              className="relative text-sm font-medium tracking-wide text-gray-300 hover:text-white transition-colors py-2 group cursor-pointer border-none bg-transparent"
            >
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#00f0ff] transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </div>

        {/* Mobile Menu Links */}
        {isOpen && (
          <div className="w-full flex flex-col items-center gap-4 mt-6 pt-6 border-t border-white/5 md:hidden">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => handleNavClick(item)}
                className="text-base font-medium text-gray-300 hover:text-white transition-colors py-2 border-none bg-transparent"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </motion.nav>
    </header>
  );
};

export default Navbar;
