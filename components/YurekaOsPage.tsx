import React from 'react';
import { Gift, Zap, ShieldCheck, ArrowRight, Star, Percent, Utensils, ShoppingBag, Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useSupabase } from './SupabaseProvider';

const YurekaOsPage: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const { supabase } = useSupabase();

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      // Store in waitlist or users table
      const { error } = await supabase.from('waitlist').insert([{ email, source: 'yureka-os-hero' }]);
      if (error && error.code !== '23505') { // Ignore duplicate emails
        console.error('Error saving email:', error);
      }
      
      // Grant access locally
      localStorage.setItem('yureka_points_access', email);
      navigate('/rewards-calculator');
    } catch (err) {
      console.error('Calculation flow error:', err);
      localStorage.setItem('yureka_points_access', email); // Still grant access
      navigate('/rewards-calculator'); 
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-cream pt-4 md:pt-8 pb-20">
      <div className="max-w-[1440px] mx-auto px-6">
        
        {/* New Premium Hero Pattern */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-32 min-h-[600px] mt-8">
          {/* Visual Side */}
          <div className="relative h-[600px] rounded-[2.5rem] overflow-hidden group shadow-2xl">
            <img 
              src="/brain/68ca9173-7e43-410f-bbc2-49d1ddffa54f/eiffel_tower_points_wonder_1776360719835.png" 
              alt="Unlock Wonders" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-10 md:p-14">
              <div className="flex gap-2 mb-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <Zap size={14} className="text-white" />
                  </div>
                ))}
                <span className="text-white/70 text-[10px] uppercase tracking-widest flex items-center ml-2 border-l border-white/20 pl-4">Search across 10+ programs</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-sans font-bold text-white leading-[0.9] tracking-tighter">
                Your Card can <br /> unlock wonders
              </h2>
              <p className="text-white/60 mt-4 text-xs tracking-widest uppercase font-bold">Join 5,000+ travelers maximizing their points</p>
            </div>
          </div>

          {/* Form Side */}
          <div className="flex flex-col justify-center max-w-lg mx-auto lg:mx-0 w-full lg:pl-12 text-left">
            <div className="mb-16">
               <span className="font-serif font-black tracking-tighter text-2xl text-ink">
                  Yureka<span className="text-clay">.</span>money
               </span>
            </div>

            <div className="space-y-1">
              <h1 className="text-[42px] font-sans font-extrabold tracking-tight text-ink leading-tight">Calculate your Transfers for Free</h1>
              <p className="text-ink/40 font-sans text-lg">Enter your email to get started</p>
            </div>

            <form onSubmit={handleCalculate} className="mt-10 space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" 
                  required
                  className="flex-1 px-6 py-4 rounded-xl border border-black/10 focus:ring-4 focus:ring-clay/10 outline-none transition-all text-lg font-sans bg-white/50"
                />
                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-ink text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-clay transition-all group shadow-xl hover:shadow-clay/20 shrink-0 min-w-[200px]"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : 'Calculate for Free'}
                  {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                </button>
              </div>

              {/* Fake Cloudflare */}
              <div className="p-4 border border-black/5 rounded-xl flex items-center justify-between bg-white/30 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <div className="w-5 h-5 border-2 border-black/10 rounded pointer-events-none"></div>
                  <span className="text-xs text-ink/60 font-sans">Verify you are human</span>
                </div>
                <div className="flex flex-col items-end opacity-40 grayscale group-hover:grayscale-0 transition-all">
                  <div className="text-[8px] font-bold uppercase tracking-tighter leading-none">Powered by</div>
                  <div className="text-[10px] font-black tracking-tighter italic">Cloudflare</div>
                </div>
              </div>

              <p className="text-[10px] text-ink/30 font-sans leading-relaxed text-center lg:text-left">
                By signing up you agree to our <Link to="/terms-of-service" className="underline hover:text-ink/60">Terms</Link> and <Link to="/privacy-policy" className="underline hover:text-ink/60">Privacy Policy</Link>
              </p>
            </form>
          </div>
        </section>

        {/* Hero Section */}
        <section className="text-center mb-24 pt-16 border-t border-black/5">
          <div className="inline-block px-4 py-1 border border-black/10 rounded-full mb-6 bg-white/50 backdrop-blur-sm shadow-sm">
            <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-teal">Maximize Every Rupee</p>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif tracking-tighter mb-8 text-black leading-none">
            Yureka <span className="italic font-light text-black/40">OS</span>
          </h1>
          <p className="text-xl md:text-2xl text-black/60 font-serif italic max-w-2xl mx-auto leading-relaxed">
            Stop settling for generic points. Yureka OS is the central operational layer for your credit portfolio, aligning your cards with your lifestyle to unlock up to 15% in actual value.
          </p>
        </section>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
          <div className="glass-panel p-10 border border-black/5 hover:border-teal/30 transition-all group">
            <div className="w-14 h-14 bg-teal/10 rounded-2xl flex items-center justify-center text-teal mb-8 group-hover:scale-110 transition-transform">
              <Zap size={28} />
            </div>
            <h3 className="text-2xl font-serif mb-4">Real-time Matching</h3>
            <p className="text-black/60 leading-relaxed mb-6">Our AI scans 200+ cards instantly to find the ones that give you the highest rewards for Swiggy, Zomato, Amazon, and more.</p>
            <div className="h-px bg-black/5 w-full mb-6"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-teal">Average Profit: ₹15,000/yr</span>
          </div>

          <div className="glass-panel p-10 border border-black/5 hover:border-clay/30 transition-all group">
            <div className="w-14 h-14 bg-clay/10 rounded-2xl flex items-center justify-center text-clay mb-8 group-hover:scale-110 transition-transform">
              <Star size={28} />
            </div>
            <h3 className="text-2xl font-serif mb-4">The Voucher Hub</h3>
            <p className="text-black/60 leading-relaxed mb-6">Stack rewards by buying discounted gift cards. Get an extra 2-10% off on 500+ top brands like Myntra, Nykaa, and Uber.</p>
            <div className="h-px bg-black/5 w-full mb-6"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-clay">Savings: 5-15% Extra</span>
          </div>

          <div className="glass-panel p-10 border border-black/5 hover:border-black/20 transition-all group lg:col-span-1 md:col-span-2">
            <div className="w-14 h-14 bg-black/5 rounded-2xl flex items-center justify-center text-black mb-8 group-hover:scale-110 transition-transform">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-2xl font-serif mb-4">Zero Bias Guarantee</h3>
            <p className="text-black/60 leading-relaxed mb-6">We don't take money to show you specific cards. Our algorithm is purely mathematical, focused on your spend categories.</p>
            <div className="h-px bg-black/5 w-full mb-6"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-black/40">100% Unbiased Advice</span>
          </div>
        </div>

        {/* Reward Categories */}
        <section className="mb-32">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-black/10 pb-8">
            <h2 className="text-3xl md:text-4xl font-serif text-black leading-none">Where you save most.</h2>
            <p className="text-black/40 text-sm font-serif italic mt-4 md:mt-0">Tracking 50+ spend categories.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Dining', icon: Utensils, reward: '10%+', color: 'bg-orange-50 text-orange-600' },
              { name: 'Shopping', icon: ShoppingBag, reward: '5-10%', color: 'bg-pink-50 text-pink-600' },
              { name: 'Travel', icon: Zap, reward: 'Unlimited', color: 'bg-blue-50 text-blue-600' },
              { name: 'Vouchers', icon: Gift, reward: 'Varies', color: 'bg-purple-50 text-purple-600' }
            ].map((cat) => (
              <div key={cat.name} className="p-8 border border-black/5 rounded-2xl hover:shadow-lg transition-all text-center">
                <div className={`w-12 h-12 ${cat.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <cat.icon size={20} />
                </div>
                <h4 className="text-lg font-serif mb-2">{cat.name}</h4>
                <div className="text-[10px] font-bold uppercase tracking-widest text-black/40">Up to {cat.reward}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-ink rounded-[2.5rem] p-12 md:p-24 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-serif mb-8 leading-tight">Start winning the <br /><span className="italic text-clay">rewards game.</span></h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/join-waitlist" className="bg-clay hover:bg-teal text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2">
                Join VIP Waitlist <ArrowRight size={16} />
              </Link>
              <Link to="/cards" className="border border-white/20 hover:border-white/40 text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center">
                Explore Cards
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default YurekaOsPage;
