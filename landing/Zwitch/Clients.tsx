import React from 'react';
import { motion } from 'framer-motion';
import { Camera, ShoppingBag, Hexagon, Tv, Globe2, CreditCard } from 'lucide-react';

const clientsData = [
  { icon: Camera, name: 'Instagram' },
  { icon: ShoppingBag, name: 'Shopify' },
  { icon: Hexagon, name: 'HubSpot' },
  { icon: Tv, name: 'CNBC' },
  { icon: Globe2, name: 'BUSINESS INSIDER' },
  { icon: CreditCard, name: 'stripe' },
];

const Clients: React.FC = () => {
  // Duplicate list to achieve infinite seamless loop
  const tickerItems = [...clientsData, ...clientsData, ...clientsData, ...clientsData];

  return (
    <section className="bg-[#000000] py-16 overflow-hidden relative w-full border-t border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 md:px-8 mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-widest text-[#00f0ff] uppercase select-none">
            Interested
          </span>
          <h3 className="text-sm font-medium text-gray-400">
            Trusted by 300+ businesses worldwide
          </h3>
        </div>
      </div>

      {/* Infinite Ticker Container */}
      <div className="relative w-full flex items-center overflow-hidden">
        
        {/* Left Fade Gradient Mask */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-[#000000] to-transparent z-10 pointer-events-none" />
        
        {/* Right Fade Gradient Mask */}
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-[#000000] to-transparent z-10 pointer-events-none" />

        {/* Marquee Runner */}
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: 40,
            ease: 'linear',
            repeat: Infinity,
          }}
          className="flex gap-16 md:gap-24 whitespace-nowrap"
        >
          {tickerItems.map((client, idx) => {
            const IconComponent = client.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3 text-gray-500 hover:text-white transition-colors duration-300 select-none group"
              >
                <IconComponent size={24} className="group-hover:text-[#00f0ff] transition-colors" />
                <span className="text-lg font-bold tracking-tight">{client.name}</span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Clients;
