import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, BarChart3, ShieldCheck, TrendingUp, Users, Package, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import SEO from './SEO';
import { staticPageMeta } from '../lib/seo/pageMeta';

const PILLARS = [
  {
    icon: Package,
    title: 'Smart Checkout',
    headline: 'Cut RTO. Kill COD failures.',
    body: 'Yureka\'s smart checkout layer pre-screens orders using intent signals and payment history, routing high-risk COD orders to prepaid or BNPL without friction. Partner brands see a measurable drop in return-to-origin rates from day one.',
    stat: '↓ RTO',
    statLabel: 'from first order',
  },
  {
    icon: Zap,
    title: 'AI-Driven Campaigns',
    headline: 'Reach buyers at the moment of intent.',
    body: 'Yureka AI executes orders for users — so we know exactly who is spending, on what, and when. Partners get access to intent-based placements inside the AI concierge flow, at the exact moment a user is deciding where to buy.',
    stat: 'Intent-first',
    statLabel: 'ad placement',
  },
  {
    icon: ShieldCheck,
    title: 'Alternative Credit Data',
    headline: 'Expand your lending pool safely.',
    body: 'As an RBI-compliant Lending Service Provider, Yureka builds high-fidelity alternative credit profiles from consented transaction data. Lenders and NBFCs get pre-scored, consent-verified leads — not raw data dumps.',
    stat: 'RBI-compliant',
    statLabel: 'data sharing',
  },
  {
    icon: TrendingUp,
    title: 'Goldback Co-Branding',
    headline: 'Give your rewards a reason to be kept.',
    body: 'Partner your loyalty program with Yureka Goldback. Instead of expiring points or low-liquidity brand coins, your customers earn 24K digital gold that appreciates — making your rewards the ones they actually save.',
    stat: 'Up to 16%',
    statLabel: 'effective ROI for users',
  },
];

const PARTNERS = [
  { name: 'Razorpay', desc: 'Payments & banking' },
  { name: 'Snapmint', desc: 'BNPL infrastructure' },
  { name: 'FlexyPe', desc: 'Smart checkout' },
  { name: 'Swiggy MCP', desc: 'Agentic ordering' },
];

const ForBrands: React.FC = () => {
  return (
    <>
      <SEO
        title="Partner With Yureka | Smart Checkout, AI Ads & Credit Data"
        description="Cut RTO and COD failures with Yureka smart checkout, run intent-based campaigns via Yureka AI, and access consent-first alternative credit signals for lending decisions."
        keywords={staticPageMeta['/business']?.keywords}
      />

      <div className="min-h-screen bg-cream text-white overflow-x-hidden">

        {/* ── HERO ── */}
        <section className="relative pt-40 pb-32 px-6">
          <div className="absolute inset-0 opacity-[0.015] pointer-events-none"
            style={{ backgroundImage: `radial-gradient(circle at 60% 40%, #34d399 0%, transparent 60%)` }}
          />
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-clay mb-8">
                Yureka — For Brands & Lenders
              </p>
              <h1 className="text-5xl sm:text-7xl md:text-8xl font-sans font-extrabold leading-[0.9] tracking-tighter mb-8 text-white">
                Where your<br />
                <span className="text-clay italic font-serif font-light">customers decide.</span>
              </h1>
              <p className="text-white/50 text-base md:text-xl font-serif italic max-w-2xl mx-auto leading-relaxed mb-12">
                Yureka sits inside the moment of purchase — not after it.
                Reach India's power shoppers through AI-executed orders,
                smarter checkout, and consent-first credit intelligence.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/join-waitlist"
                  className="group inline-flex items-center gap-3 bg-clay text-black font-black uppercase tracking-[0.2em] text-[11px] px-10 py-4 rounded-full shadow-[0_10px_40px_-10px_rgba(52,211,153,0.4)] hover:scale-105 transition-all duration-300"
                >
                  Become a Partner
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="mailto:partnerships@yureka.money"
                  className="inline-flex items-center gap-2 text-white/40 hover:text-white font-black uppercase tracking-[0.2em] text-[10px] transition-colors"
                >
                  partnerships@yureka.money <ChevronRight size={12} />
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── STATS STRIP ── */}
        <section className="border-y border-white/5 py-10 px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '200+', label: 'Credit cards catalogued' },
              { value: '120M+', label: 'Target power shoppers' },
              { value: '16%', label: 'Max effective ROI' },
              { value: 'RBI', label: 'Compliant LSP' },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <div className="text-3xl md:text-4xl font-sans font-extrabold text-clay tracking-tighter">{s.value}</div>
                <div className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mt-2">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── FOUR PILLARS ── */}
        <section className="py-32 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-20">
              <p className="text-[9px] font-black uppercase tracking-[0.5em] text-clay mb-4">What We Offer</p>
              <h2 className="text-4xl md:text-6xl font-sans font-extrabold tracking-tighter text-white leading-tight">
                Four ways to grow<br />
                <span className="text-white/30">with Yureka.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PILLARS.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="group relative bg-white/[0.03] border border-white/8 rounded-[2.5rem] p-8 hover:border-clay/30 hover:bg-white/[0.05] transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-clay/5 blur-3xl group-hover:bg-clay/10 transition-all duration-700" />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-clay/10 flex items-center justify-center group-hover:bg-clay/20 transition-colors">
                        <p.icon size={22} className="text-clay" />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-sans font-extrabold text-clay tracking-tighter leading-none">{p.stat}</div>
                        <div className="text-[8px] font-black uppercase tracking-[0.25em] text-white/30 mt-0.5">{p.statLabel}</div>
                      </div>
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-[0.35em] text-clay/70 mb-2">{p.title}</p>
                    <h3 className="text-xl md:text-2xl font-sans font-extrabold text-white tracking-tight mb-4 leading-tight">{p.headline}</h3>
                    <p className="text-white/40 text-sm leading-relaxed font-serif">{p.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── INFRASTRUCTURE PARTNERS ── */}
        <section className="py-20 px-6 border-t border-white/5">
          <div className="max-w-5xl mx-auto">
            <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/30 text-center mb-12">Live infrastructure partnerships</p>
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
              {PARTNERS.map(p => (
                <div key={p.name} className="text-center">
                  <div className="text-sm font-black uppercase tracking-[0.2em] text-white/60">{p.name}</div>
                  <div className="text-[8px] uppercase tracking-[0.25em] text-white/25 mt-1">{p.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="py-32 px-6 border-t border-white/5">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-20">
              <p className="text-[9px] font-black uppercase tracking-[0.5em] text-clay mb-4">The Partnership Loop</p>
              <h2 className="text-4xl md:text-5xl font-sans font-extrabold tracking-tighter text-white">How it works.</h2>
            </div>
            <div className="space-y-0">
              {[
                { step: '01', title: 'Integrate', desc: 'Connect your storefront, checkout, or lending flow to Yureka\'s API in days, not months. Razorpay and Snapmint are already live.' },
                { step: '02', title: 'Activate', desc: 'Your brand appears inside Yureka AI\'s recommendation layer. Users get your offer at the moment they\'re asking where to buy.' },
                { step: '03', title: 'Convert', desc: 'Smart checkout routes orders intelligently — COD risk drops, prepaid and BNPL uptake rises, and returns fall.' },
                { step: '04', title: 'Compound', desc: 'Every purchase builds Goldback for the user and intelligence for you. The longer the partnership, the higher the signal quality.' },
              ].map((s, i) => (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-8 py-10 border-b border-white/5 last:border-0"
                >
                  <div className="text-4xl font-sans font-extrabold text-white/10 tracking-tighter w-16 shrink-0 leading-none pt-1">{s.step}</div>
                  <div>
                    <h3 className="text-xl font-sans font-extrabold text-white uppercase tracking-tight mb-3">{s.title}</h3>
                    <p className="text-white/40 text-sm leading-relaxed font-serif">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-32 px-6 border-t border-white/5">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="inline-flex items-center gap-2 bg-clay/10 border border-clay/20 rounded-full px-5 py-2 mb-10">
                <Users size={12} className="text-clay" />
                <span className="text-[9px] font-black uppercase tracking-[0.35em] text-clay">Limited Partner Slots — 2026 Cohort</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-sans font-extrabold tracking-tighter text-white leading-tight mb-6">
                Ready to reach<br />
                <span className="text-clay">India's power shoppers?</span>
              </h2>
              <p className="text-white/40 font-serif italic text-lg mb-12 max-w-xl mx-auto leading-relaxed">
                Apply for the 2026 partner cohort. We onboard brands that align with
                the Goldback economy — high-intent, high-value, high-repeat.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/join-waitlist"
                  className="group inline-flex items-center gap-3 bg-clay text-black font-black uppercase tracking-[0.2em] text-[11px] px-12 py-5 rounded-full shadow-[0_10px_40px_-10px_rgba(52,211,153,0.5)] hover:scale-105 transition-all duration-300"
                >
                  Apply Now
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="mailto:partnerships@yureka.money"
                  className="text-white/30 hover:text-white font-black uppercase tracking-[0.2em] text-[10px] transition-colors"
                >
                  partnerships@yureka.money
                </a>
              </div>
            </motion.div>
          </div>
        </section>

      </div>
    </>
  );
};

export default ForBrands;
