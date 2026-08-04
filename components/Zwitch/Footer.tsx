import React from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Instagram, Linkedin, ArrowUpRight } from 'lucide-react';

const Footer: React.FC = () => {
  const handleStartProject = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="contact" className="bg-[#000000] pt-32 pb-16 relative overflow-hidden w-full border-t border-white/5">
      
      {/* Background Decorative glow */}
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none z-0" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Massive CTA Section */}
        <div className="flex flex-col items-center text-center pb-24 border-b border-white/10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#00f0ff] mb-6 inline-block">
              Let's Talk
            </span>
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-[1.05] text-white mb-10">
              Let's create something epic.
            </h2>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0, 240, 255, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartProject}
            className="flex items-center gap-2 bg-[#00f0ff] text-black font-black text-base md:text-lg px-8 md:px-10 py-4 md:py-5 rounded-full select-none cursor-pointer border-none"
          >
            Start a Project
            <ArrowUpRight size={20} />
          </motion.button>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 py-16">
          
          {/* Brand Info */}
          <div className="flex flex-col items-start gap-4">
            <div className="text-2xl font-black tracking-tighter text-white select-none">
              ZWITCH<span className="w-1.5 h-1.5 rounded-full bg-[#b026ff] inline-block ml-1" />
            </div>
            <p className="text-sm font-light text-gray-400 leading-relaxed">
              We design and develop premium digital experiences that define the future.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Navigation</span>
            <ul className="space-y-2">
              {['Services', 'Work', 'Agency'].map((item) => (
                <li key={item}>
                  <a 
                    href={`#${item.toLowerCase()}`}
                    className="text-sm font-light text-gray-400 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div className="flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Connect</span>
            <div className="flex items-center gap-4">
              {[
                { icon: Twitter, href: 'https://twitter.com' },
                { icon: Instagram, href: 'https://instagram.com' },
                { icon: Linkedin, href: 'https://linkedin.com' },
                { icon: Github, href: 'https://github.com' },
              ].map((social, idx) => {
                const Icon = social.icon;
                return (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Office Address */}
          <div className="flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Office</span>
            <p className="text-sm font-light text-gray-400 leading-relaxed">
              100 Creative Avenue,<br />
              Suite 400, Silicon Valley<br />
              California, USA
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between border-t border-white/10 pt-8 gap-4 text-center md:text-left">
          <p className="text-xs font-light text-gray-500">
            &copy; {new Date().getFullYear()} ZWITCH. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="/privacy-policy" className="text-xs font-light text-gray-500 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="/terms-of-service" className="text-xs font-light text-gray-500 hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
