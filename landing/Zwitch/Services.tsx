import React from 'react';
import { motion } from 'framer-motion';
import { Layout, Paintbrush, Target, TrendingUp } from 'lucide-react';

const services = [
  {
    title: 'UI/UX Design',
    description: 'We craft immersive digital experiences that blend aesthetic elegance with intuitive functionality. Our research-driven design process ensures user engagement and loyalty.',
    icon: Layout,
    color: 'from-blue-500/20 to-cyan-500/20',
    accent: '#00f0ff',
  },
  {
    title: 'Visual Graphic',
    description: 'Stunning brand identities and creative digital art that tells your stories. We combine typography, color, and illustration to define your unique market presence.',
    icon: Paintbrush,
    color: 'from-purple-500/20 to-pink-500/20',
    accent: '#b026ff',
  },
  {
    title: 'Brand Strategy',
    description: 'Strategic planning, market positioning, and voice definition to align your product with audience desires. Build a future-proof foundation for long-term growth.',
    icon: Target,
    color: 'from-emerald-500/20 to-teal-500/20',
    accent: '#10b981',
  },
  {
    title: 'Business Growth',
    description: 'Scale your user base and revenue through data-backed funnel optimizations, performance marketing strategies, and conversion-focused customer journeys.',
    icon: TrendingUp,
    color: 'from-orange-500/20 to-red-500/20',
    accent: '#f97316',
  },
];

const Services: React.FC = () => {
  return (
    <section id="services" className="bg-[#000000] py-32 relative overflow-hidden w-full">
      
      {/* Background Decorative Blur */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center md:text-left mb-20 max-w-2xl"
        >
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#00f0ff] mb-4 inline-block">
            Our Offerings
          </span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.1] text-white">
            Services Built Specifically for your Business.
          </h2>
        </motion.div>

        {/* 2x2 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="relative bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 overflow-hidden backdrop-blur-md flex flex-col justify-between min-h-[350px] group transition-all duration-300 shadow-[0_8px_32px_0_rgba(0,0,0,0.2)]"
              >
                
                {/* Content */}
                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-white mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-400 font-light leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Corner Quarter Circle Icon Layout */}
                <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden rounded-tr-3xl">
                  {/* The quarter circle */}
                  <div className={`absolute -top-12 -right-12 w-24 h-24 rounded-full bg-gradient-to-br ${service.color} border border-white/10 flex items-end justify-start p-4 group-hover:scale-110 transition-transform duration-300`} />
                  {/* The Icon inside the circle */}
                  <div className="absolute top-4 right-4 text-white/80 group-hover:text-white transition-colors duration-300">
                    <Icon size={24} style={{ color: service.accent }} />
                  </div>
                </div>

                {/* Visual accent hover line at the bottom */}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-[2px] transition-all duration-300 scale-x-0 group-hover:scale-x-100 origin-left"
                  style={{ backgroundColor: service.accent }}
                />

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Services;
