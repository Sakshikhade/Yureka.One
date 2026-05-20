import React from 'react';
import { motion } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Plane, ShoppingBag, Wallet, Fuel, Tag, Bike, Utensils, Users, 
  ShoppingBasket, Star, Hotel, Briefcase, Sofa, GraduationCap, 
  Music, Zap, Film, Heart, Home, Shield, Smartphone, School,
  ArrowRight, Sparkles, X
} from 'lucide-react';
import SEO from './SEO';

const CATEGORIES = [
  { id: 'travel', name: 'Travel', icon: Plane, image: '/images/categories/travel.png', color: 'from-blue-500 to-indigo-600', slug: 'travel', desc: 'Flights, Hotels & Stays' },
  { id: 'shopping', name: 'Shopping', icon: ShoppingBag, image: '/images/categories/shopping.png', color: 'from-pink-500 to-rose-600', slug: 'shopping', desc: 'Online & Retail Therapy' },
  { id: 'cashback', name: 'Cashback', icon: Wallet, image: '/images/categories/cashback.png', color: 'from-emerald-500 to-teal-600', slug: 'cashback', desc: 'Direct Savings on Every Spend' },
  { id: 'fuel', name: 'Fuel', icon: Fuel, image: '/images/categories/fuel.png', color: 'from-amber-500 to-orange-600', slug: 'fuel', desc: 'Surcharge Waivers & Points' },
  { id: 'lifetime-free', name: 'Lifetime Free', icon: Tag, image: '/images/categories/lifetime-free.png', color: 'from-purple-500 to-violet-600', slug: 'lifetime-free', desc: 'Zero Annual Fees Forever' },
  { id: 'entry-level', name: 'Entry Level', icon: Bike, image: '/images/categories/entry-level.png', color: 'from-cyan-500 to-blue-600', slug: 'entry-level', desc: 'Perfect First Credit Cards' },
  { id: 'dining', name: 'Dining', icon: Utensils, image: '/images/categories/dining.png', color: 'from-orange-500 to-red-600', slug: 'dining', desc: 'Gourmet Rewards & Discounts' },
  { id: 'co-branded', name: 'Co-Branded', icon: Users, image: '/images/categories/co-branded.png', color: 'from-indigo-500 to-purple-600', slug: 'co-branded', desc: 'Partner Specific Benefits' },
  { id: 'grocery', name: 'Grocery', icon: ShoppingBasket, image: '/images/categories/grocery.png', color: 'from-green-500 to-emerald-600', slug: 'grocery', desc: 'Daily Essentials Savings' },
  { id: 'premium', name: 'Premium', icon: Star, image: '/images/categories/premium.png', color: 'from-yellow-400 to-amber-600', slug: 'premium', desc: 'Elite Perks & Concierge' },
  { id: 'hotel', name: 'Hotel', icon: Hotel, image: '/images/categories/hotel.png', color: 'from-blue-400 to-indigo-500', slug: 'hotel', desc: 'Stays & Luxury Hospitality' },
  { id: 'business', name: 'Business', icon: Briefcase, image: '/images/categories/business.png', color: 'from-slate-600 to-slate-800', slug: 'business', desc: 'Corporate Spends & Rewards' },
  { id: 'lounge', name: 'Lounge Access', icon: Sofa, image: '/images/categories/lounge-access.png', color: 'from-violet-400 to-purple-600', slug: 'lounge-access', desc: 'Airport Luxury Comfort' },
  { id: 'student', name: 'Student', icon: GraduationCap, image: '/images/categories/student.png', color: 'from-sky-400 to-blue-500', slug: 'student', desc: 'Start Your Credit Journey' },
  { id: 'entertainment', name: 'Entertainment', icon: Music, image: '/images/categories/entertainment.png', color: 'from-fuchsia-500 to-pink-600', slug: 'entertainment', desc: 'Events, Concerts & More' },
  { id: 'utility', name: 'Utility Bill', icon: Zap, image: '/images/categories/utility-bill.png', color: 'from-yellow-500 to-orange-500', slug: 'utility-bill', desc: 'Electricity, Water & Gas' },
  { id: 'movie', name: 'Movie', icon: Film, image: '/images/categories/movie.png', color: 'from-red-500 to-rose-600', slug: 'movie', desc: 'Cinema & Streaming Perks' },
  { id: 'airlines', name: 'Airlines', icon: Plane, image: '/images/categories/airlines.png', color: 'from-indigo-400 to-blue-500', slug: 'airlines', desc: 'Aviation & Flight Miles' },
  { id: 'health', name: 'Health', icon: Heart, image: '/images/categories/health.png', color: 'from-rose-400 to-red-500', slug: 'health', desc: 'Wellness & Medical Rewards' },
  { id: 'rent', name: 'Rent', icon: Home, image: '/images/categories/rent.png', color: 'from-indigo-400 to-blue-600', slug: 'rent', desc: 'Earn on Monthly Rentals' },
  { id: 'insurance', name: 'Insurance', icon: Shield, image: '/images/categories/insurance.png', color: 'from-teal-400 to-emerald-500', slug: 'insurance', desc: 'Premium Payments & Protection' },
  { id: 'upi', name: 'UPI', icon: Smartphone, image: '/images/categories/upi.png', color: 'from-purple-500 to-indigo-600', slug: 'upi', desc: 'Credit on UPI Transactions' },
  { id: 'education', name: 'Education', icon: School, image: '/images/categories/education.png', color: 'from-blue-600 to-cyan-500', slug: 'education', desc: 'Fees & Academic Spends' }
];

const CategoriesPage: React.FC = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');
  const basePath = isDashboard ? '/dashboard' : '';

  return (
    <div className="min-h-screen bg-cream pb-20">
      <SEO 
        title="Card Categories | Browse by Lifestyle" 
        description="Find the perfect credit card tailored to your spending habits. Explore 20+ specialized categories."
      />

      {/* Hero Section */}
      <section className="relative pt-20 pb-12 overflow-hidden px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-clay/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-6">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-xl"
           >
             <Sparkles size={14} className="text-clay" />
             <span className="text-[11px] font-black text-white/85 uppercase tracking-[0.3em]">Neural Classification</span>
           </motion.div>

           <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="text-4xl md:text-6xl font-heading font-black text-white tracking-tighter uppercase"
           >
             Your Path to <span className="text-clay">Smarter</span> Spends
           </motion.h1>

           <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="max-w-2xl mx-auto text-white/85 text-base md:text-lg leading-relaxed font-medium"
           >
             Unlock the power of strategic spending with our curated selection. Find cards that <span className="text-white font-extrabold underline decoration-clay decoration-2 underline-offset-4">transform everyday purchases</span> into meaningful rewards.
           </motion.p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-6 mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {CATEGORIES.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
            >
              <Link 
                to={`${basePath}/categories/${category.slug}`}
                className="group relative block bg-white/5 border border-white/5 rounded-[2rem] p-6 hover:border-clay/40 transition-all duration-500 overflow-hidden h-full"
              >
                {/* Background Glow */}
                <div className={`absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity`} />
                
                <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                  <div className="relative group-hover:scale-110 transition-transform duration-500">
                    <div className="w-24 h-24 relative z-10 flex items-center justify-center transform group-hover:rotate-6 transition-all duration-500">
                      {category.image ? (
                        <img src={category.image} alt="" className="w-20 h-20 object-contain drop-shadow-2xl" />
                      ) : (
                        <category.icon className="text-clay drop-shadow-lg" size={56} />
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-[13px] font-black text-white uppercase tracking-tight group-hover:text-clay transition-colors">{category.name}</h3>
                    <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest line-clamp-1">{category.desc}</p>
                  </div>

                  <div className="pt-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <span className="text-[8px] font-black text-clay uppercase tracking-widest">Explore</span>
                    <ArrowRight size={10} className="text-clay" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-7xl mx-auto px-6 mt-20">
        <div className="bg-gradient-to-r from-clay/10 to-transparent border border-white/5 rounded-[3rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-heading font-black text-white uppercase">Still Unsure?</h2>
            <p className="text-white/80 text-base max-w-md">Let our Intelligence Engine match you with the perfect card based on your unique credit profile.</p>
          </div>
          <Link to={`${basePath}/yureka-ai`} className="bg-clay text-black px-10 py-4 rounded-full font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-transform shrink-0">
             Consult Yureka AI <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default CategoriesPage;
