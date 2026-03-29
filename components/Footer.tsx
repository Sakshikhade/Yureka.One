import React from 'react';
import { Instagram, Linkedin, Twitter, Facebook, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-cream text-black border-t border-black/10 relative z-10 pt-20 pb-10">
      
      {/* Top Section: Branding & Slogan */}
      <div className="max-w-[1440px] mx-auto px-6 mb-20 border-b border-black/10 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8">
                  <span className="block text-teal text-xs font-bold uppercase tracking-[0.3em] mb-6">Jupyter.credit • AI-Driven Credit Card Platform</span>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-[0.9] tracking-tighter mb-6">
                      Jupyter<span className="text-teal">.</span>
                  </h2>
                  <p className="text-lg md:text-xl font-serif italic text-black/60 max-w-2xl leading-relaxed">
                      "Why settle for a card when you can optimize your wealth? AI-matched rewards, zero fees, and financial freedom."
                  </p>
              </div>
              <div className="lg:col-span-4 flex flex-col justify-end items-start lg:items-end">
                  <div className="border border-black/20 p-8 w-full max-w-sm hover:bg-clay hover:text-white transition-colors group cursor-pointer bg-white">
                      <h3 className="text-xl font-serif mb-2">Fintech Founders</h3>
                      <p className="text-base opacity-60 mb-6 group-hover:opacity-100">Partner with us to reach 200M+ credit-ready users in India. Launching Q2 2026.</p>
                      <div className="flex justify-between items-center border-t border-current pt-4">
                          <span className="text-xs font-bold uppercase tracking-widest">Partner With Us</span>
                          <ArrowUpRight size={16} />
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* Middle Section: Links Grid (Newspaper Columns) */}
      <div className="max-w-[1440px] mx-auto px-6 mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 border-l border-black/10">
              
              {/* Column 1 - Core Pages */}
              <div className="pl-8 border-r border-black/10 min-h-[200px]">
                  <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-8 text-black/40">Explore</h4>
                  <ul className="space-y-4">
                      <li><Link to="/explorer" className="hover:text-teal font-serif text-base transition-colors">Card Explorer</Link></li>
                      <li><Link to="/ai" className="hover:text-teal font-serif text-base transition-colors">Jupyter AI Magic</Link></li>
                      <li><Link to="/matrix" className="hover:text-teal font-serif text-base transition-colors">Reward Matrix</Link></li>
                      <li><Link to="/story" className="hover:text-teal font-serif text-base transition-colors">Our Manifesto</Link></li>
                  </ul>
              </div>

              {/* Column 2 - Resources */}
              <div className="pl-8 border-r border-black/10 min-h-[200px]">
                  <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-8 text-black/40">Resources</h4>
                  <ul className="space-y-4">
                      <li><Link to="/blogs" className="hover:text-teal font-serif text-base transition-colors">Blogs</Link></li>
                      <li><Link to="/jobs" className="hover:text-teal font-serif text-base transition-colors">Careers at Jupyter</Link></li>
                      <li><a href="#" className="hover:text-teal font-serif text-base transition-colors">Press & Media</a></li>
                      <li><Link to="/vip" className="hover:text-teal font-serif text-base transition-colors">Apply for VIP Access</Link></li>
                      <li><Link to="/admin" className="hover:text-teal font-serif text-base transition-colors opacity-30 hover:opacity-100">Admin Dashboard</Link></li>
                  </ul>
              </div>

              {/* Column 3 - Legal */}
              <div className="pl-8 border-r border-black/10 min-h-[200px]">
                  <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-8 text-black/40">Legal & Privacy</h4>
                  <ul className="space-y-4">
                      <li><a href="#" className="hover:text-teal font-serif text-base transition-colors">Terms of Service</a></li>
                      <li><a href="#" className="hover:text-teal font-serif text-base transition-colors">Privacy Policy</a></li>
                      <li><a href="#" className="hover:text-teal font-serif text-base transition-colors">Security Protocol</a></li>
                      <li><a href="#" className="hover:text-teal font-serif text-base transition-colors">Community Guidelines</a></li>
                  </ul>
              </div>

              {/* Column 4 - Contact */}
              <div className="pl-8 border-r border-black/10 min-h-[200px] col-span-2 md:col-span-1 lg:col-span-2">
                  <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-8 text-black/40">Contact Bureau</h4>
                  <div className="mb-8">
                      <p className="text-xs uppercase tracking-wider text-black/50 mb-1">User Support (Pan-India)</p>
                      <a href="mailto:support@jupyter.credit" className="text-xl font-serif hover:text-teal transition-colors">support@jupyter.credit</a>
                  </div>
                  <div className="mb-8">
                      <p className="text-xs uppercase tracking-wider text-black/50 mb-1">Partnerships</p>
                      <a href="mailto:partners@jupyter.credit" className="text-xl font-serif hover:text-teal transition-colors">partners@jupyter.credit</a>
                  </div>
                  <div className="flex gap-4">
                        {[Instagram, Linkedin, Twitter, Facebook].map((Icon, i) => (
                             <a key={i} href="#" aria-label="Social Link" className="w-10 h-10 border border-black/20 flex items-center justify-center text-black hover:bg-clay hover:text-white transition-all">
                                <Icon size={18} strokeWidth={1.5} />
                             </a>
                        ))}
                  </div>
              </div>

          </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-[1440px] mx-auto px-6">
          <div className="border-t border-black/10 pt-8 flex flex-col md:flex-row justify-between items-center text-black/30 text-xs font-mono uppercase tracking-widest">
              <p>© 2026 Jupyter Technologies Pvt Ltd. All Rights Reserved.</p>
              <p className="mt-2 md:mt-0">Made in India</p>
          </div>
      </div>
    </footer>
  );
};

export default Footer;