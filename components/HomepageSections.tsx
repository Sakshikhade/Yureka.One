import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, ShieldCheck, CreditCard, ArrowRight, Bot, 
  Layers, ShoppingBag, Landmark, ArrowUpRight, Check,
  Cpu, Smartphone, Terminal, HelpCircle, CheckCircle2, ChevronRight, Zap, Play, Eye
} from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

// ─── 3. WAITLIST SECTION ───
export const WaitlistSection: React.FC = () => {
  return (
    <section id="waitlist" className="relative py-16 md:py-24 border-b border-white/10 bg-cream overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-black to-[#0a0a0a]" />
      <div className="max-w-6xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-clay text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">
            Waitlist
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-black text-white uppercase tracking-tighter mb-6 leading-none">
            Get early access to smarter rewards.
          </h2>
          <p className="text-white/80 text-sm md:text-base leading-relaxed mb-8">
            Join the Yureka waitlist using your Gmail ID and let our system analyze only your shopping and transaction emails to understand your spending behavior, rewards potential, and optimization opportunities.
          </p>
        </div>
        <div className="bg-[#0f0f0f] border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-clay to-transparent" />
          <h3 className="text-xl font-heading font-bold text-white uppercase tracking-wider mb-2">
            Join the waitlist
          </h3>
          <p className="text-white/60 text-xs mb-8">
            Use Google to get your Reward IQ and early access eligibility.
          </p>
          <Link 
            to="/join-waitlist"
            className="w-full bg-white text-black py-4.5 rounded-2xl flex items-center justify-center gap-3.5 group hover:bg-clay hover:text-black transition-all duration-500 shadow-2xl hover:scale-[1.02]"
          >
            <svg className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.247-3.125C18.232 1.637 15.522 1 12.24 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.985 0-.737-.08-1.3-.176-1.782h-10.62Z"/>
            </svg>
            <span className="text-xs font-black uppercase tracking-[0.2em] font-mono">Continue with Google</span>
          </Link>
          <p className="mt-6 text-[9px] leading-relaxed font-bold uppercase tracking-widest text-white/40 text-center">
            We only analyze relevant shopping and transaction emails. <br/>No unrelated inbox data, no CVV, no full card number.
          </p>
        </div>
      </div>
    </section>
  );
};

// ─── 4. REWARD IQ SECTION ───
export const RewardIQSection: React.FC = () => {
  return (
    <section id="rewards" className="relative py-16 md:py-24 border-b border-white/10 bg-cream overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-clay text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">
            Reward IQ
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-black text-white uppercase tracking-tighter mb-6 leading-none">
            Know how well you really use your cards.
          </h2>
          <p className="text-white/80 text-sm md:text-base leading-relaxed mb-8">
            Yureka calculates your Reward IQ from 0 to 100 based on how efficiently you use cards, offers, and reward opportunities, so you can see the value you may be missing today.
          </p>
          <div className="space-y-4 mb-8">
            {[
              "Measure how optimized your card usage is.",
              "Spot hidden value in the cards you already own.",
              "See missed savings and wasted reward potential.",
              "Understand your best next action."
            ].map((bullet, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-clay shrink-0" />
                <span className="text-xs font-semibold text-white/90">{bullet}</span>
              </div>
            ))}
          </div>
          <Link 
            to="/join-waitlist"
            className="inline-flex items-center gap-2 bg-clay text-cream text-[10px] font-black uppercase tracking-[0.2em] px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-transform"
          >
            Get My Reward IQ <ArrowRight size={14} />
          </Link>
        </div>

        {/* Dashboard Visualizer */}
        <div className="bg-[#0f0f0f] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden flex flex-col gap-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Reward IQ Dashboard</span>
            <div className="w-2.5 h-2.5 rounded-full bg-clay animate-pulse" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col justify-center items-center relative overflow-hidden group">
              <span className="text-[9px] uppercase tracking-wider text-white/40 font-mono mb-2">Reward IQ</span>
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="56" cy="56" r="48" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                  <circle cx="56" cy="56" r="48" fill="transparent" stroke="#34d399" strokeWidth="6" strokeDasharray="301.6" strokeDashoffset="48" className="transition-all duration-1000" />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-heading font-black text-white">84</span>
                  <span className="text-[8px] text-white/40 uppercase tracking-widest">Optimal</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col">
                <span className="text-[8px] uppercase tracking-wider text-white/40 font-mono">Missed Savings</span>
                <span className="text-2xl font-heading font-black text-red-400 mt-1">₹18,700</span>
                <span className="text-[8px] text-white/20 uppercase tracking-wider mt-1">Last 12 Months</span>
              </div>
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col">
                <span className="text-[8px] uppercase tracking-wider text-white/40 font-mono">Unused Potential</span>
                <span className="text-2xl font-heading font-black text-clay mt-1">₹12,400</span>
                <span className="text-[8px] text-white/20 uppercase tracking-wider mt-1">Staged Arbitrage</span>
              </div>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col">
            <span className="text-[8px] uppercase tracking-wider text-white/40 font-mono">Best Next Move</span>
            <span className="text-[11px] font-bold text-white mt-1 uppercase tracking-wide">
              Activate APay Gift Card Route on Infinia (Increases reward rate from 3.3% to 15%)
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── 6. CHROME EXTENSION SECTION ───
export const ChromeExtensionSection: React.FC = () => {
  return (
    <section id="extension" className="relative py-16 md:py-24 border-b border-white/10 bg-cream overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Mock browser popup on left */}
        <div className="order-2 lg:order-1 bg-[#0d0d0d] border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-4">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <div className="bg-white/5 text-[9px] px-4 py-1 rounded-full text-white/40 flex-1 ml-4 select-none">
              amazon.in/gp/cart/view.html
            </div>
          </div>

          <div className="flex justify-between items-center py-2">
            <div>
              <p className="text-white text-xs font-bold">Shopping Cart</p>
              <p className="text-white/40 text-[9px] uppercase tracking-wider mt-0.5">1 Item (Apple iPad Air)</p>
            </div>
            <p className="text-white font-bold text-sm">₹54,900</p>
          </div>

          {/* Extension Panel slides in */}
          <div className="bg-[#141414] border border-clay/35 rounded-2xl p-4 shadow-[0_0_20px_rgba(52,211,153,0.08)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-clay text-black text-[7px] font-black uppercase tracking-widest px-2.5 py-1 rounded-bl-xl font-mono">
              Yureka+
            </div>
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-clay/10 border border-clay/20 flex items-center justify-center">
                <Zap className="text-clay animate-pulse" size={20} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] font-black text-clay">Optimal Pay Route</p>
                <h4 className="text-xs font-black text-white uppercase tracking-tight mt-0.5">Use Infinia Gift Card Stacking</h4>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center">
              <span className="text-[9px] text-white/50 uppercase tracking-widest">Potential Saving Yield</span>
              <span className="text-xs font-black text-clay">₹8,235 (15%)</span>
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <span className="text-clay text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">
            Chrome Extension
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-black text-white uppercase tracking-tighter mb-6 leading-none">
            The smartest card recommendation, right when you shop.
          </h2>
          <p className="text-white/80 text-sm md:text-base leading-relaxed mb-8">
            When you shop on Amazon, Flipkart, Myntra, Ajio, and other platforms, the Yureka Chrome Extension checks your saved cards, merchant offers, and alternate paths like gift cards to help you pay in the smartest way possible.
          </p>
          <div className="space-y-4 mb-8">
            {[
              "Checks card eligibility against live merchant offers.",
              "Recommends the best card for the transaction.",
              "Suggests better gift-card routes when value is higher.",
              "Helps you stack offers and rewards at checkout."
            ].map((bullet, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-clay shrink-0" />
                <span className="text-xs font-semibold text-white/90">{bullet}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link 
              to="/join-waitlist" 
              className="inline-flex items-center gap-2 bg-clay text-cream text-[10px] font-black uppercase tracking-[0.2em] px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-transform"
            >
              Add to Chrome <ArrowUpRight size={14} />
            </Link>
            <Link 
              to="/categories" 
              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] px-8 py-4 rounded-full hover:bg-white/10 transition-colors"
            >
              See Supported Stores
            </Link>
          </div>
          <p className="mt-4 text-[9px] uppercase tracking-widest text-white/40 font-bold">
            No guesswork. No spreadsheets. No manual hacks.
          </p>
        </div>
      </div>
    </section>
  );
};

// ─── 7. YUREKA AI SECTION ───
export const YurekaAISection: React.FC = () => {
  const chips = [
    "Which card should I use?",
    "Is this redemption worth it?",
    "Best card for travel?",
    "How do I maximize my points?"
  ];

  return (
    <section id="yureka-ai" className="relative py-16 md:py-24 border-b border-white/10 bg-cream overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-clay text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">
            Yureka AI
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-black text-white uppercase tracking-tighter mb-6 leading-none">
            Your 24/7 AI copilot for cards, points, and redemptions.
          </h2>
          <p className="text-white/80 text-sm md:text-base leading-relaxed mb-8">
            Yureka AI helps you decide which card to use, whether a redemption is worth it, which card fits your lifestyle best, and how to maximize the value of the cards you already have.
          </p>

          <div className="flex flex-wrap gap-2.5 mb-8">
            {chips.map((chip, idx) => (
              <span 
                key={idx} 
                className="px-4 py-2 bg-white/5 border border-white/5 rounded-full text-xs font-semibold text-white/80 cursor-pointer hover:border-clay/35 hover:text-clay transition-all"
              >
                {chip}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link 
              to="/yureka-ai" 
              className="inline-flex items-center gap-2 bg-clay text-cream text-[10px] font-black uppercase tracking-[0.2em] px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-transform"
            >
              Meet Yureka AI <ArrowRight size={14} />
            </Link>
            <Link 
              to="/yureka-ai" 
              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] px-8 py-4 rounded-full hover:bg-white/10 transition-colors"
            >
              Try Sample Questions
            </Link>
          </div>
          <p className="mt-4 text-[9px] uppercase tracking-widest text-white/40 font-bold">
            Like having a points hacker in your pocket.
          </p>
        </div>

        {/* AI Chatbox Widget */}
        <div className="bg-[#0f0f0f] border border-white/10 rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-4">
            <Bot className="text-clay" size={16} />
            <span className="text-[10px] font-black uppercase tracking-wider text-white">Yureka AI Agent</span>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex gap-2 items-start justify-end">
              <div className="bg-white/5 text-white text-xs px-4 py-2.5 rounded-2xl rounded-tr-none max-w-[80%] font-medium">
                Should I use Magnus or Atlas for ₹2L flight ticket booking?
              </div>
            </div>
            <div className="flex gap-2 items-start">
              <div className="w-6 h-6 rounded-full bg-clay/20 flex items-center justify-center shrink-0 mt-1">
                <Bot size={12} className="text-clay" />
              </div>
              <div className="bg-clay/5 border border-clay/20 text-white text-xs px-4 py-3 rounded-2xl rounded-tl-none max-w-[85%] font-medium space-y-2">
                <p>Use Atlas. Axis devalued Magnus milestone rewards, yielding just 1.2% base on flight bookings.</p>
                <p className="text-clay font-bold">Atlas grants 5 Edge Miles/100 spend, translating to 10% yield if transferred to Marriott/Accor.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── 8. REWARDX SECTION ───
export const RewardXSection: React.FC = () => {
  return (
    <section id="rewardx" className="relative py-16 md:py-24 border-b border-white/10 bg-cream overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Discount cards grid */}
        <div className="order-2 lg:order-1 grid grid-cols-2 gap-4">
          {[
            { brand: 'Swiggy', disc: '7.5% Off', color: 'from-orange-500/20' },
            { brand: 'MakeMyTrip', disc: '10% Off', color: 'from-blue-600/20' },
            { brand: 'Myntra', disc: '8.0% Off', color: 'from-rose-500/20' },
            { brand: 'Uber', disc: '5.5% Off', color: 'from-neutral-600/20' }
          ].map((item, idx) => (
            <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex flex-col justify-between h-32 relative overflow-hidden group hover:border-clay/25 transition-all">
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} to-transparent opacity-30`} />
              <span className="text-[10px] font-black uppercase tracking-wider text-white/50">{item.brand}</span>
              <div className="relative z-10">
                <span className="text-2xl font-heading font-black text-clay block">{item.disc}</span>
                <span className="text-[8px] text-white/30 uppercase tracking-widest mt-1 block">Upfront Saving</span>
              </div>
            </div>
          ))}
        </div>

        <div className="order-1 lg:order-2">
          <span className="text-clay text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">
            RewardX
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-black text-white uppercase tracking-tighter mb-6 leading-none">
            Buy discounted gift cards and stack more value into every spend.
          </h2>
          <p className="text-white/80 text-sm md:text-base leading-relaxed mb-8">
            RewardX lets you buy discounted gift cards from partner brands so you can combine upfront savings with card rewards and turn a normal purchase into a higher-value transaction.
          </p>
          <div className="space-y-4 mb-8">
            {[
              "Access discounted gift cards across leading brands.",
              "Save instantly before you pay.",
              "Stack card rewards and gift-card savings together.",
              "Turn regular shopping into better total value."
            ].map((bullet, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-clay shrink-0" />
                <span className="text-xs font-semibold text-white/90">{bullet}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link 
              to="/join-waitlist" 
              className="inline-flex items-center gap-2 bg-clay text-cream text-[10px] font-black uppercase tracking-[0.2em] px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-transform"
            >
              Explore RewardX <ArrowRight size={14} />
            </Link>
            <Link 
              to="/categories" 
              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] px-8 py-4 rounded-full hover:bg-white/10 transition-colors"
            >
              View Partner Brands
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── 9. STORE SECTION ───
export const StoreSection: React.FC = () => {
  return (
    <section id="store" className="relative py-16 md:py-24 border-b border-white/10 bg-cream overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-clay text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">
            Store
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-black text-white uppercase tracking-tighter mb-6 leading-none">
            Shop from leading brands and earn rewards beyond your card.
          </h2>
          <p className="text-white/80 text-sm md:text-base leading-relaxed mb-8">
            The Yureka Store lets you shop across D2C brands and quick-commerce platforms while earning additional Yureka rewards. Use the right card and you can stack card points, merchant offers, and store rewards in one journey.
          </p>
          <div className="space-y-4 mb-8">
            {[
              "Earn rewards on top of your normal payment method.",
              "Stack card rewards and store rewards together.",
              "Shop across partner D2C and commerce brands.",
              "Generate rewardable links even for non-partner products."
            ].map((bullet, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-clay shrink-0" />
                <span className="text-xs font-semibold text-white/90">{bullet}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link 
              to="/join-waitlist" 
              className="inline-flex items-center gap-2 bg-clay text-cream text-[10px] font-black uppercase tracking-[0.2em] px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-transform"
            >
              Shop with Yureka <ArrowRight size={14} />
            </Link>
            <Link 
              to="/categories" 
              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] px-8 py-4 rounded-full hover:bg-white/10 transition-colors"
            >
              Browse Brands
            </Link>
          </div>
          <p className="mt-4 text-[9px] uppercase tracking-widest text-white/40 font-bold">
            One purchase. Multiple layers of value.
          </p>
        </div>

        {/* Visual stack card representing multiple rewards */}
        <div className="bg-[#0f0f0f] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden flex flex-col gap-5 justify-center items-center">
          <div className="w-full flex justify-between items-center mb-2 border-b border-white/5 pb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Reward Stacking Engine</span>
            <div className="px-2 py-1 bg-clay/10 border border-clay/20 text-clay text-[8px] font-mono rounded">ACTIVE</div>
          </div>

          <div className="w-full space-y-3">
            {[
              { label: 'Layer 1: Base Card Rewards', value: '+3.3% (HDFC Infinia)', icon: CreditCard, color: 'text-blue-400' },
              { label: 'Layer 2: Merchant Instant Discount', value: '+10.0% Off', icon: TagIcon, color: 'text-amber-400' },
              { label: 'Layer 3: Yureka Store Extra Rewards', value: '+5.0% Yureka Credits', icon: ShoppingBag, color: 'text-clay' }
            ].map((layer, idx) => (
              <div key={idx} className="flex justify-between items-center p-3.5 bg-white/[0.02] border border-white/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <layer.icon size={16} className={layer.color} />
                  <span className="text-xs font-semibold text-white/80">{layer.label}</span>
                </div>
                <span className={`text-xs font-bold ${layer.color}`}>{layer.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Simple TagIcon wrapper helper
const TagIcon = (props: any) => (
  <svg viewBox="0 0 24 24" width={props.size || 16} height={props.size || 16} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

// ─── 10. REDEMPTION SECTION ───
export const RedemptionSection: React.FC = () => {
  return (
    <section id="redemption" className="relative py-16 md:py-24 border-b border-white/10 bg-cream overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Comparison of conversion on left */}
        <div className="order-2 lg:order-1 bg-[#0f0f0f] border border-white/10 rounded-[2.5rem] p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col gap-6">
          <span className="text-[10px] font-black uppercase tracking-widest text-white/50 border-b border-white/5 pb-4 block">Redemption Path Optimization</span>
          
          <div className="space-y-4">
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black uppercase text-red-400 tracking-wider">Traditional Voucher</p>
                <p className="text-white text-xs font-semibold mt-1">20,000 Points → ₹5,000 Amazon Voucher</p>
              </div>
              <span className="text-xs font-bold text-red-400">Value: ₹0.25/pt</span>
            </div>

            <div className="bg-clay/5 border border-clay/20 rounded-xl p-4 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black uppercase text-clay tracking-wider">Yureka Flight Arbitrage</p>
                <p className="text-white text-xs font-semibold mt-1">20,000 Points → Marriott/Airline Transfer</p>
              </div>
              <span className="text-xs font-bold text-clay">Value: ₹1.00/pt</span>
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <span className="text-clay text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">
            Redemption
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-black text-white uppercase tracking-tighter mb-6 leading-none">
            Redeem where your points are actually worth more.
          </h2>
          <p className="text-white/80 text-sm md:text-base leading-relaxed mb-8">
            Yureka helps you redeem your rewards across flights, stays, gift cards, products, dining, events, discounts, and cash-like options through one simple flow designed to maximize value instead of wasting it.
          </p>
          <div className="space-y-4 mb-8">
            {[
              "Compare redemption paths before choosing one.",
              "Avoid low-value conversions and random vouchers.",
              "Unlock better value across travel, shopping, and experiences.",
              "Redeem without learning separate portal logic."
            ].map((bullet, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-clay shrink-0" />
                <span className="text-xs font-semibold text-white/90">{bullet}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link 
              to="/join-waitlist" 
              className="inline-flex items-center gap-2 bg-clay text-cream text-[10px] font-black uppercase tracking-[0.2em] px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-transform"
            >
              Redeem Smarter <ArrowRight size={14} />
            </Link>
            <Link 
              to="/categories" 
              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] px-8 py-4 rounded-full hover:bg-white/10 transition-colors"
            >
              See Redemption Options
            </Link>
          </div>
          <p className="mt-4 text-[9px] uppercase tracking-widest text-white/40 font-bold">
            Earn from anywhere. Redeem where it matters.
          </p>
        </div>
      </div>
    </section>
  );
};

// ─── 11. COMPARE CARDS SECTION ───
export const CompareCardsSection: React.FC = () => {
  const tabs = ["Rewards Rate", "Fees", "Travel Perks", "Category Strength", "Redemption Quality", "Overall Fit"];
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="compare-cards" className="relative py-16 md:py-24 border-b border-white/10 bg-cream overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <span className="text-clay text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">
            Compare Cards
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-black text-white uppercase tracking-tighter leading-none mb-4">
            Compare cards head to head, without the noise.
          </h2>
          <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto">
            Compare cards across fees, rewards, travel perks, lounge access, milestones, category strength, and redemption quality to understand which card wins for your real lifestyle, not just on paper.
          </p>
        </div>

        {/* Tab filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {tabs.map((tab, idx) => (
            <button 
              key={idx} 
              onClick={() => setActiveTab(idx)}
              className={`px-6 py-3 rounded-full text-xs font-bold transition-all ${activeTab === idx ? 'bg-clay text-cream' : 'bg-white/5 text-white/60 hover:text-white border border-white/5'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Comparison grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-[#0f0f0f] border border-white/10 rounded-[2.5rem] p-8 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/50">HDFC Infinia</span>
              <span className="text-xs font-bold text-clay">3.3% Yield</span>
            </div>
            <p className="text-xs text-white/80 leading-relaxed">
              Provides unmatched point multiplier yields on flight/hotel bookings via SmartBuy portal, combined with low devaluations. Best overall fit for high spenders.
            </p>
          </div>
          <div className="bg-[#0f0f0f] border border-white/10 rounded-[2.5rem] p-8 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Axis Magnus</span>
              <span className="text-xs font-bold text-white/60">1.2% Yield</span>
            </div>
            <p className="text-xs text-white/80 leading-relaxed">
              Base reward rate remains solid, but milestone devaluations have significantly impacted net yield. Still useful for transfer partners if you hold Magnus.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-4">
          <Link 
            to="/compare" 
            className="inline-flex items-center gap-2 bg-clay text-cream text-[10px] font-black uppercase tracking-[0.2em] px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-transform"
          >
            Compare Cards <ArrowRight size={14} />
          </Link>
          <Link 
            to="/compare" 
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] px-8 py-4 rounded-full hover:bg-white/10 transition-colors"
          >
            View Top Comparisons
          </Link>
        </div>
      </div>
    </section>
  );
};

// ─── 12. BEST CARD BY CATEGORY SECTION ───
export const BestCardByCategorySection: React.FC = () => {
  const categories = ["Travel", "Shopping", "Dining", "Fuel", "Lifestyle", "Premium", "Beginner", "Everyday Spend"];
  const [selectedCat, setSelectedCat] = useState(0);

  return (
    <section id="best-cards" className="relative py-16 md:py-24 border-b border-white/10 bg-cream overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <span className="text-clay text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">
            Best Card by Category
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-black text-white uppercase tracking-tighter leading-none mb-4">
            Find the best card for the way you spend.
          </h2>
          <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto">
            Yureka helps you discover the best cards across travel, shopping, dining, fuel, lifestyle, premium perks, and everyday spend categories so recommendations feel relevant and practical.
          </p>
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat, idx) => (
            <button 
              key={idx} 
              onClick={() => setSelectedCat(idx)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${selectedCat === idx ? 'bg-clay text-cream' : 'bg-white/5 text-white/80 border border-white/5 hover:text-white'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap justify-center items-center gap-4">
          <Link 
            to="/cards" 
            className="inline-flex items-center gap-2 bg-clay text-cream text-[10px] font-black uppercase tracking-[0.2em] px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-transform"
          >
            Find My Best Card <ArrowRight size={14} />
          </Link>
          <Link 
            to="/categories" 
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] px-8 py-4 rounded-full hover:bg-white/10 transition-colors"
          >
            Browse Categories
          </Link>
        </div>
      </div>
    </section>
  );
};

// ─── 14. PRIVACY SECTION ───
export const PrivacySection: React.FC = () => {
  return (
    <section id="privacy" className="relative py-16 md:py-24 border-b border-white/10 bg-cream overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-clay text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">
            Privacy
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-black text-white uppercase tracking-tighter mb-6 leading-none">
            Privacy-first by design.
          </h2>
          <p className="text-white/80 text-sm md:text-base leading-relaxed mb-8">
            Yureka is designed to access only the shopping and transaction signals required to power Reward IQ, savings recommendations, and optimization suggestions, while minimizing collection of unrelated personal data.
          </p>
          <div className="space-y-4 mb-8">
            {[
              "Limited inbox analysis with clear consent.",
              "No need for full card number or CVV.",
              "Data used to personalize savings and rewards intelligence.",
              "Access can be reviewed and revoked by the user."
            ].map((bullet, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <ShieldCheck size={16} className="text-clay shrink-0" />
                <span className="text-xs font-semibold text-white/90">{bullet}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link 
              to="/privacy-policy" 
              className="inline-flex items-center gap-2 bg-clay text-cream text-[10px] font-black uppercase tracking-[0.2em] px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-transform"
            >
              Read Privacy Principles <ArrowRight size={14} />
            </Link>
            <Link 
              to="/privacy-policy" 
              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] px-8 py-4 rounded-full hover:bg-white/10 transition-colors"
            >
              See How Data Is Used
            </Link>
          </div>
        </div>

        {/* Security / Vault Widget */}
        <div className="bg-[#0f0f0f] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden flex flex-col gap-5 justify-center items-center">
          <div className="w-16 h-16 bg-clay/10 border border-clay/20 rounded-2xl flex items-center justify-center shadow-lg mb-2">
            <ShieldCheck size={32} className="text-clay" />
          </div>
          <h4 className="text-lg font-heading font-bold text-white uppercase tracking-wider text-center">
            Encryption & Consent Vault
          </h4>
          <p className="text-xs text-white/60 text-center max-w-sm">
            All transaction email parsing is done locally or via isolated secure containers. We never view, sell, or retain unrelated emails.
          </p>
          <div className="w-full h-px bg-white/5" />
          <div className="flex justify-between items-center w-full text-[9px] uppercase tracking-widest text-white/40 font-mono">
            <span>ISO 27001 Ready</span>
            <span>GDPR Compliant</span>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── 15. LIFESTYLE VALUE SECTION ───
export const LifestyleValueSection: React.FC = () => {
  return (
    <section id="lifestyle" className="relative py-16 md:py-24 border-b border-white/10 bg-cream overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
        <span className="text-clay text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">
          Lifestyle Value
        </span>
        <h2 className="text-3xl md:text-5xl font-heading font-black text-white uppercase tracking-tighter mb-6 leading-none">
          From daily spends to dream experiences.
        </h2>
        <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto mb-12">
          Yureka helps transform everyday transactions into a smarter rewards engine that can move users toward premium experiences like travel, gadgets, dining, stays, events, and lifestyle wins that usually feel reserved for reward experts.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            "Your next getaway may already be hiding in your everyday spends.",
            "Your shopping cart can do more than just cost money.",
            "Your points should not sit idle or get wasted."
          ].map((text, idx) => (
            <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex flex-col justify-center items-center min-h-[120px]">
              <p className="text-xs font-semibold text-white/90 italic leading-relaxed">
                "{text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── 16. COMING SOON: UPI SDK SECTION ───
export const UPISDKSection: React.FC = () => {
  return (
    <section id="upi-sdk" className="relative py-16 md:py-24 border-b border-white/10 bg-cream overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Mock UPI QR Scan illustration on left */}
        <div className="order-2 lg:order-1 bg-[#0f0f0f] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden flex flex-col gap-6 items-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-clay self-start">UPI QR Scan Intelligence</span>
          
          <div className="w-48 h-48 border border-white/10 rounded-2xl bg-white/[0.02] flex items-center justify-center p-4 relative overflow-hidden group">
            {/* Pulsing Scan Overlay */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-clay shadow-[0_0_15px_#34d399] animate-bounce" />
            <Smartphone size={64} className="text-white/20" />
          </div>

          <div className="w-full bg-white/[0.02] border border-white/5 rounded-xl p-4 flex justify-between items-center">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/40 font-mono">Recommended UPI Account</p>
              <p className="text-white text-xs font-bold mt-1">RuPay Credit Card (Tata Neu Infinity)</p>
            </div>
            <span className="text-xs font-black text-clay">1.5% NeuCoins</span>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-clay/10 border border-clay/20 text-clay text-[9px] font-black uppercase tracking-widest rounded-full mb-4">
            Coming Soon
          </div>
          <h2 className="text-3xl md:text-5xl font-heading font-black text-white uppercase tracking-tighter mb-6 leading-none">
            Smarter rewards at every UPI QR scan.
          </h2>
          <p className="text-white/80 text-sm md:text-base leading-relaxed mb-6">
            Soon, Yureka could help you optimize rewards not just while shopping online, but also when you scan to pay at cafés, restaurants, local stores, and everyday offline merchants.
          </p>
          <div className="space-y-4 mb-8">
            {[
              "Real-time card recommendation at scan time.",
              "MCC-aware reward optimization.",
              "Built around RuPay credit card on UPI journeys.",
              "A smarter offline rewards future."
            ].map((bullet, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-clay shrink-0" />
                <span className="text-xs font-semibold text-white/90">{bullet}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link 
              to="/join-waitlist" 
              className="inline-flex items-center gap-2 bg-clay text-cream text-[10px] font-black uppercase tracking-[0.2em] px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-transform"
            >
              Join Waitlist for Early Access <ArrowRight size={14} />
            </Link>
            <Link 
              to="/join-waitlist" 
              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] px-8 py-4 rounded-full hover:bg-white/10 transition-colors"
            >
              Follow the Roadmap
            </Link>
          </div>
          <p className="mt-4 text-[9px] uppercase tracking-widest text-white/40 font-mono">
            Planned feature. Not live yet.
          </p>
        </div>
      </div>
    </section>
  );
};

// ─── 17. COMING SOON: B2B STACK SECTION ───
export const B2BStackSection: React.FC = () => {
  return (
    <section id="b2b-stack" className="relative py-16 md:py-24 border-b border-white/10 bg-cream overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-clay/10 border border-clay/20 text-clay text-[9px] font-black uppercase tracking-widest rounded-full mb-4">
            Coming Soon
          </div>
          <h2 className="text-3xl md:text-5xl font-heading font-black text-white uppercase tracking-tighter mb-6 leading-none">
            The rewards intelligence layer for banks, fintechs, and modern commerce.
          </h2>
          <p className="text-white/80 text-sm md:text-base leading-relaxed mb-6">
            As Yureka’s consumer stack matures, the same optimization engine will power a white-label rewards and engagement layer for banks, fintechs, UPI apps, startups, and commerce platforms.
          </p>
          <div className="space-y-4 mb-8">
            {[
              "Embedded rewards journeys inside partner apps.",
              "Smarter card and merchant recommendations.",
              "Better offer targeting and reward engagement.",
              "Built to scale the Yureka experience across the ecosystem."
            ].map((bullet, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-clay shrink-0" />
                <span className="text-xs font-semibold text-white/90">{bullet}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link 
              to="/join-waitlist" 
              className="inline-flex items-center gap-2 bg-clay text-cream text-[10px] font-black uppercase tracking-[0.2em] px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-transform"
            >
              Join the Yureka Ecosystem <ArrowRight size={14} />
            </Link>
            <Link 
              to="/join-waitlist" 
              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] px-8 py-4 rounded-full hover:bg-white/10 transition-colors"
            >
              Partner Interest
            </Link>
          </div>
          <p className="mt-4 text-[9px] uppercase tracking-widest text-white/40 font-mono">
            Coming soon. Not part of the live consumer product yet.
          </p>
        </div>

        {/* Code / API Block illustration on right */}
        <div className="bg-[#0f0f0f] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Developer API Sandbox</span>
            <span className="text-[9px] font-bold text-clay font-mono">yureka-sdk.js</span>
          </div>

          <pre className="text-[10px] text-white/70 font-mono p-4 bg-white/[0.01] border border-white/5 rounded-xl overflow-x-auto leading-relaxed select-all">
{`const yureka = require('@yureka/sdk')({
  apiKey: 'yr_live_8f3d...'
});

// Calculate optimal swipe recommendations
const recommendation = await yureka.optimize({
  amount: 54900,
  mcc: '5732', // Electronics
  merchant: 'Amazon India',
  userCards: ['card_hdfc_002', 'card_sbi_009']
});`}
          </pre>
        </div>
      </div>
    </section>
  );
};

// ─── 19. FINAL CTA SECTION ───
export const FinalCTASection: React.FC = () => {
  return (
    <section className="relative py-20 bg-cream overflow-hidden border-b border-white/10">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] to-[#050505]" />
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <span className="text-clay text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">
          Final CTA
        </span>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading font-black text-white uppercase tracking-tighter mb-6 leading-none">
          Stop wasting rewards. <br/>Start spending smarter.
        </h2>
        <p className="text-white/80 text-sm md:text-base max-w-xl mx-auto mb-10 leading-relaxed">
          Yureka turns scattered offers, underused cards, and confusing redemption paths into one intelligent system that helps you earn more and redeem better.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/join-waitlist" 
            className="w-full sm:w-auto bg-clay text-cream text-[10px] font-black uppercase tracking-[0.2em] px-10 py-5 rounded-full shadow-lg hover:scale-105 transition-transform text-center"
          >
            Join the Waitlist
          </Link>
          <Link 
            to="/join-waitlist" 
            className="w-full sm:w-auto bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] px-10 py-5 rounded-full hover:bg-white/10 transition-colors text-center"
          >
            Get My Reward IQ
          </Link>
        </div>
        <p className="mt-6 text-[9px] uppercase tracking-widest text-white/50 font-bold">
          Quick signup. Clear consent. Early access updates.
        </p>
      </div>
    </section>
  );
};
