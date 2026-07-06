import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, TrendingUp, Users, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import SEO from './SEO';

const marqueeCSS = `
  @keyframes fb-marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  .fb-marquee-track {
    animation: fb-marquee 35s linear infinite;
    display: flex;
    width: max-content;
  }
`;

const MARQUEE_ITEMS = [
  'Razorpay', 'Snapmint', 'FlexyPe', 'Swiggy MCP',
  'HDFC SmartBuy', 'Axis Rewards', 'Tata Neu', 'CRED',
  'PhonePe', 'Amazon Pay', 'Razorpay', 'Snapmint',
  'FlexyPe', 'Swiggy MCP', 'HDFC SmartBuy', 'Axis Rewards',
  'Tata Neu', 'CRED', 'PhonePe', 'Amazon Pay',
];

const WHY_ITEMS = [
  {
    icon: Users,
    title: 'Capture the Credit-Active Audience',
    body: "Get your brand in front of India's most financially engaged consumers — users who actively optimize their spending, earn rewards, and make high-intent purchases worth capturing.",
    accent: 'bg-clay/[0.07] border-clay/20',
    iconBg: 'bg-clay/15',
    iconColor: 'text-clay',
  },
  {
    icon: TrendingUp,
    title: 'Pay Only for Performance',
    body: "Yureka's intent-based placement means your brand appears only when a user is actively deciding where to buy. No impressions, no waste — pure conversion-ready exposure.",
    accent: 'bg-white/[0.02] border-white/[0.08]',
    iconBg: 'bg-white/5',
    iconColor: 'text-white/60',
  },
  {
    icon: ShieldCheck,
    title: 'Capitalize on First-Party Data',
    body: 'Every transaction builds a richer credit and spending profile. Partners gain pre-scored, consent-verified signals — not raw data dumps — to make smarter lending and targeting decisions.',
    accent: 'bg-white/[0.02] border-white/[0.08]',
    iconBg: 'bg-white/5',
    iconColor: 'text-white/60',
  },
];

const STATS = [
  { value: '₹10:1', label: 'Topline ROAS potential', color: 'text-clay' },
  { value: '16%', label: 'Effective user ROI', color: 'text-emerald-400' },
  { value: '120M+', label: 'Target power shoppers', color: 'text-blue-400' },
  { value: '200+', label: 'Credit cards catalogued', color: 'text-purple-400' },
];

const USE_CASES = [
  {
    badge: 'D2C & E-COMMERCE',
    title: 'Yureka for\nD2C Brands',
    sub: "Reach India's reward-maximizing shoppers at the exact moment of purchase intent.",
    bullets: [
      'AI-targeted placements inside Yureka concierge',
      'Smart checkout: COD → Prepaid / BNPL routing',
      'Goldback co-branding to make your rewards sticky',
    ],
    gradientPos: '80% 20%',
    bg: 'bg-[#0c1e15] border-clay/15',
  },
  {
    badge: 'LENDERS & NBFCS',
    title: 'Yureka for\nLenders',
    sub: 'Expand your lending pool with consent-first alternative credit signals.',
    bullets: [
      'Pre-scored leads from consented transaction data',
      'RBI-compliant LSP data sharing framework',
      'High-fidelity credit profiles beyond bureau scores',
    ],
    gradientPos: '20% 80%',
    bg: 'bg-[#0f0f1c] border-white/[0.08]',
  },
];

const SUB_CATEGORIES = [
  { title: 'Brick & Mortar', desc: "Target lapsed or casual users in an untapped channel with Yureka's first-party data" },
  { title: 'D2C', desc: 'List next to curated card offers to get your brand the attention it deserves — with guaranteed intent' },
  { title: 'E-Commerce', desc: 'Engage digital consumers and increase basket size with AI-powered card-based targeting' },
];

const STEPS = [
  { step: '01', title: 'Integrate', desc: "Connect via Yureka's API in days, not months. Razorpay and Snapmint are already live." },
  { step: '02', title: 'Activate', desc: "Your brand appears inside Yureka AI's recommendation layer at the exact moment a user decides where to buy." },
  { step: '03', title: 'Convert', desc: 'Smart checkout routes orders intelligently — COD risk drops, prepaid and BNPL uptake rises, returns fall.' },
  { step: '04', title: 'Compound', desc: 'Every purchase builds Goldback for users and richer intelligence for you. Signal quality compounds over time.' },
];

const CHART_DATA = [
  { title: 'Transactions', bars: [40, 65, 50, 80, 60, 75, 90] },
  { title: 'Revenue (₹L)', bars: [30, 55, 45, 70, 85, 60, 95] },
  { title: 'Avg. Order Value', bars: [60, 40, 70, 50, 80, 65, 75] },
];

const ForBrands: React.FC = () => {
  return (
    <>
      <style>{marqueeCSS}</style>
      <SEO
        title="Partner With Yureka | Smart Checkout, AI Ads & Credit Data"
        description="Cut RTO and COD failures with Yureka smart checkout, run intent-based campaigns via Yureka AI, and access consent-first alternative credit signals for lending decisions."
      />

      <div className="min-h-screen bg-cream text-white overflow-x-hidden">

        {/* ── HERO ── */}
        <section className="relative pt-40 pb-24 px-6 overflow-hidden">
          <div className="absolute top-20 left-1/4 w-[500px] h-[500px] rounded-full bg-clay/[0.06] blur-[130px] pointer-events-none" />
          <div className="absolute top-48 right-1/3 w-72 h-72 rounded-full bg-blue-500/[0.04] blur-[100px] pointer-events-none" />

          <div className="max-w-5xl mx-auto relative z-10">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center">
              <div className="inline-flex items-center gap-2 bg-clay/10 border border-clay/20 rounded-full px-5 py-2 mb-10">
                <div className="w-1.5 h-1.5 rounded-full bg-clay animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-clay">Open Rewards Network</span>
              </div>

              <h1 className="text-5xl sm:text-7xl md:text-[88px] font-sans font-extrabold leading-[0.88] tracking-tighter mb-6 text-white">
                ROAS you can<br />
                <span className="text-clay">count on.</span>
              </h1>

              <p className="text-white/40 text-base md:text-lg font-serif italic max-w-2xl mx-auto leading-relaxed mb-10">
                Our network of credit-active Indian consumers is the most financially engaged
                audience in the country. Get in front of the right customers and boost their
                LTV without spending a fortune.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                <Link
                  to="/join-waitlist"
                  className="group inline-flex items-center gap-3 bg-clay text-black font-black uppercase tracking-[0.2em] text-[11px] px-10 py-4 rounded-full shadow-[0_10px_40px_-10px_rgba(52,211,153,0.4)] hover:scale-105 transition-all duration-300"
                >
                  Get Started
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="mailto:partnerships@yureka.money"
                  className="inline-flex items-center gap-2 text-white/40 hover:text-white font-black uppercase tracking-[0.15em] text-[10px] transition-colors"
                >
                  View Demo <ChevronRight size={12} />
                </a>
              </div>
            </motion.div>

            {/* Dashboard Mockup */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.9 }}
              className="relative mx-auto max-w-4xl"
            >
              <div className="relative bg-[#0d0d0d] border border-white/10 rounded-3xl p-6 shadow-[0_60px_120px_-20px_rgba(0,0,0,0.9)]">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-clay flex items-center justify-center shrink-0">
                      <span className="text-black text-[11px] font-black">Y</span>
                    </div>
                    <div>
                      <div className="text-[11px] font-black text-white uppercase tracking-wider">Merchant Dashboard</div>
                      <div className="text-[8px] text-white/25 uppercase tracking-widest mt-0.5">This Month's Overview</div>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-white/[0.06]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/[0.06]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-clay/50" />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                  {[
                    { label: 'Total Budget', value: '₹2,30,000' },
                    { label: 'Remaining Budget', value: '₹1,12,000' },
                    { label: 'Revenue Driven', value: '₹9,72,000' },
                    { label: 'Transactions', value: '1,840' },
                  ].map(s => (
                    <div key={s.label} className="bg-white/[0.03] border border-white/[0.05] rounded-2xl p-4">
                      <div className="text-[8px] text-white/25 uppercase tracking-widest mb-2">{s.label}</div>
                      <div className="text-sm font-sans font-extrabold text-white tracking-tight">{s.value}</div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {CHART_DATA.map(chart => (
                    <div key={chart.title} className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-4">
                      <div className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-4">{chart.title}</div>
                      <div className="flex items-end gap-0.5 h-10">
                        {chart.bars.map((h, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-sm bg-clay/25 hover:bg-clay/50 transition-colors"
                            style={{ height: `${h}%` }}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between mt-2">
                        {['J', 'F', 'M', 'A', 'M', 'J', 'J'].map((m, i) => (
                          <span key={i} className="text-[7px] text-white/15">{m}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating offer card */}
              <div className="absolute -top-5 -right-2 md:-right-8 bg-[#111] border border-white/10 rounded-2xl p-4 w-44 shadow-2xl hidden md:block">
                <div className="text-[8px] font-black text-white/25 uppercase tracking-widest mb-3">Live Offers</div>
                {['Razorpay · 3% CB', 'Snapmint · BNPL', 'FlexyPe · 0% EMI'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 py-1.5 border-b border-white/[0.05] last:border-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-clay shrink-0" />
                    <span className="text-[9px] text-white/50">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── PARTNER MARQUEE ── */}
        <section className="py-8 border-y border-white/[0.05] overflow-hidden">
          <div className="relative flex overflow-hidden">
            <div className="fb-marquee-track items-center">
              {MARQUEE_ITEMS.map((name, i) => (
                <div key={i} className="flex items-center gap-8 px-8 shrink-0">
                  <span className="text-[11px] font-black uppercase tracking-[0.25em] text-white/20 whitespace-nowrap">{name}</span>
                  <span className="text-white/[0.08] text-lg font-thin">·</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SPLIT VALUE PROP ── */}
        <section className="py-32 px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <h2 className="text-4xl md:text-5xl lg:text-[56px] font-sans font-extrabold tracking-tighter text-white leading-[1.0]">
                Reach India's power shoppers with less spend and more precision.
              </h2>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="flex flex-col gap-6">
              <p className="text-white/50 font-serif italic text-base md:text-lg leading-relaxed">
                Showcase your brand across Yureka's AI concierge and credit card network
                to attract a new, loyal population of customers you can't reach anywhere else.
              </p>
              <p className="text-white/35 font-serif text-sm leading-relaxed">
                Fine-tune your campaigns with Yureka's exclusive consumer insights — from
                shopper behavior and purchase frequency to wallet share. Measure true
                incremental lift using first-party transaction data.
              </p>
              <a
                href="mailto:partnerships@yureka.money"
                className="inline-flex items-center gap-2 text-clay font-black uppercase tracking-[0.2em] text-[10px] hover:gap-4 transition-all duration-300 w-fit"
              >
                Talk to partnerships <ArrowRight size={12} />
              </a>
            </motion.div>
          </div>
        </section>

        {/* ── WHY YUREKA ── */}
        <section className="py-20 px-6 border-t border-white/[0.05]">
          <div className="max-w-5xl mx-auto">
            <div className="mb-14">
              <p className="text-[9px] font-black uppercase tracking-[0.5em] text-clay mb-4">Why Yureka</p>
              <h2 className="text-4xl md:text-5xl font-sans font-extrabold tracking-tighter text-white">Three unfair advantages.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {WHY_ITEMS.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`border rounded-[2rem] p-8 flex flex-col gap-5 ${item.accent}`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10 ${item.iconBg}`}>
                    <item.icon size={20} className={item.iconColor} />
                  </div>
                  <h3 className="text-lg font-sans font-extrabold tracking-tight leading-tight text-white">{item.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed font-serif">{item.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="py-20 px-6 border-t border-white/[0.05]">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {STATS.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className={`text-4xl md:text-5xl font-sans font-extrabold tracking-tighter leading-none mb-3 ${s.color}`}>{s.value}</div>
                <div className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 leading-relaxed">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── USE CASE CARDS ── */}
        <section className="py-20 px-6 border-t border-white/[0.05]">
          <div className="max-w-5xl mx-auto">
            <div className="mb-5">
              <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/25 mb-4">The Modern Rewards Network</p>
              <p className="text-white/40 font-serif italic text-lg max-w-2xl leading-relaxed">
                Explore how Yureka helps D2C brands, lenders, and financial institutions
                capture new high-value customers for life.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
              {USE_CASES.map((uc, i) => (
                <motion.div
                  key={uc.badge}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className={`relative border rounded-[2.5rem] p-10 overflow-hidden group hover:scale-[1.01] transition-transform duration-500 ${uc.bg}`}
                >
                  <div
                    className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{ backgroundImage: `radial-gradient(circle at ${uc.gradientPos}, #34d399 0%, transparent 60%)` }}
                  />
                  <div className="relative z-10">
                    <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white/25 mb-4">{uc.badge}</p>
                    <h3 className="text-3xl md:text-4xl font-sans font-extrabold tracking-tighter text-white leading-tight mb-4 whitespace-pre-line">{uc.title}</h3>
                    <p className="text-white/45 font-serif italic text-sm mb-8 leading-relaxed">{uc.sub}</p>
                    <div className="flex flex-col gap-3 mb-10">
                      {uc.bullets.map(b => (
                        <div key={b} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-clay mt-1.5 shrink-0" />
                          <span className="text-[11px] font-bold text-white/55 uppercase tracking-wider leading-relaxed">{b}</span>
                        </div>
                      ))}
                    </div>
                    <Link
                      to="/join-waitlist"
                      className="inline-flex items-center gap-3 bg-white/[0.04] border border-white/10 hover:border-clay/40 hover:bg-clay/10 hover:text-clay text-white font-black uppercase tracking-[0.15em] text-[10px] px-8 py-3 rounded-full transition-all duration-300"
                    >
                      Get Started <ArrowRight size={12} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Sub-category tiles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {SUB_CATEGORIES.map((cat, i) => (
                <motion.div
                  key={cat.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white/[0.02] border border-white/[0.06] rounded-[2rem] p-8 hover:border-white/[0.12] transition-colors"
                >
                  <h4 className="text-clay text-base font-sans font-extrabold tracking-tight mb-3">{cat.title}</h4>
                  <p className="text-white/35 text-sm leading-relaxed font-serif">{cat.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PARTNERSHIP LOOP ── */}
        <section className="py-32 px-6 border-t border-white/[0.05]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-20">
              <p className="text-[9px] font-black uppercase tracking-[0.5em] text-clay mb-4">The Partnership Loop</p>
              <h2 className="text-4xl md:text-5xl font-sans font-extrabold tracking-tighter text-white">How it works.</h2>
            </div>
            <div>
              {STEPS.map((s, i) => (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-8 py-10 border-b border-white/[0.05] last:border-0"
                >
                  <div className="text-4xl font-sans font-extrabold text-white/[0.08] tracking-tighter w-16 shrink-0 leading-none pt-1">{s.step}</div>
                  <div>
                    <h3 className="text-xl font-sans font-extrabold text-white uppercase tracking-tight mb-3">{s.title}</h3>
                    <p className="text-white/40 text-sm leading-relaxed font-serif">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="py-32 px-6 border-t border-white/[0.05]">
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
