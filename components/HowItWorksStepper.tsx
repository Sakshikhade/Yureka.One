import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, CheckCircle2, Cpu, Smartphone, ShieldCheck, Mail, Gift, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const STEPS = [
  {
    id: 1,
    tag: 'Step 1: Secure Link',
    title: 'Connect securely via Gmail.',
    description: 'Use Google to join the waitlist with one click. Our system requests read-only access to analyze shopping receipts and transaction emails.',
    cta: 'Continue with Google',
    availability: 'Secure Consent',
    side: 'left'
  },
  {
    id: 2,
    tag: 'Step 2: AI Parsing',
    title: 'Let AI scan your transaction emails.',
    description: 'The parser runs locally or in secure containers to extract purchase values, merchants, and card bills.',
    cta: 'Learn About Security',
    availability: 'Local & Isolated',
    side: 'right'
  },
  {
    id: 3,
    tag: 'Step 3: Analytics',
    title: 'Get your Reward IQ and savings audit.',
    description: 'Instantly see missed discounts, sub-optimal swipes, and how much value you can unlock with better optimization.',
    cta: 'See Mock Audit',
    availability: 'Instant Results',
    side: 'left'
  },
  {
    id: 4,
    tag: 'Step 4: Smart Execution',
    title: 'Pay with the absolute best option.',
    description: 'Use our extension, web store, and calculator to pick the optimal payment route, buy discounted gift cards, and stack value at checkout.',
    cta: 'Join Waitlist',
    availability: 'Consumer Ecosystem',
    side: 'right'
  }
];

// ── SCREEN RENDERS ──────────────────────────────────────────────────────────

const EmailConnectScreen = () => (
  <div className="w-full h-full bg-[#0d0d0d] p-6 flex flex-col justify-center items-center text-center font-sans">
    <div className="w-16 h-16 rounded-full bg-clay/10 border border-clay/20 flex items-center justify-center mb-6">
      <Mail className="text-clay" size={28} />
    </div>
    <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Gmail Integration</h4>
    <p className="text-[10px] text-white/50 mb-6 max-w-[200px]">Read-only access to receipts and transaction statements.</p>
    <div className="w-full bg-white text-black py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
        <path fill="currentColor" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.247-3.125C18.232 1.637 15.522 1 12.24 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.985 0-.737-.08-1.3-.176-1.782h-10.62Z"/>
      </svg>
      Link Google Account
    </div>
  </div>
);

const AIScanScreen = () => (
  <div className="w-full h-full bg-[#0f0f0f] p-6 flex flex-col justify-center items-center text-center font-sans relative overflow-hidden">
    <div className="w-16 h-16 rounded-full bg-clay/10 border border-clay/20 flex items-center justify-center mb-6 relative">
      <Cpu className="text-clay" size={28} />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.4, 0.1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute inset-0 bg-clay/20 rounded-full"
      />
    </div>
    <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Isolated Scan</h4>
    <div className="w-full bg-white/[0.02] border border-white/5 rounded-xl p-3 text-left space-y-2 max-w-[220px]">
      <div className="flex justify-between items-center text-[9px] font-mono text-white/40">
        <span>Invoice Extracted</span>
        <span className="text-clay">Done</span>
      </div>
      <p className="text-[10px] text-white font-bold font-mono">Swiggy • ₹1,240</p>
    </div>
  </div>
);

const RewardIQScreen = () => (
  <div className="w-full h-full bg-[#0d0d0d] p-6 flex flex-col justify-center items-center text-center font-sans">
    <div className="relative w-24 h-24 flex items-center justify-center mb-6">
      <svg className="w-full h-full transform -rotate-90">
        <circle cx="48" cy="48" r="40" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
        <circle cx="48" cy="48" r="40" fill="transparent" stroke="#34d399" strokeWidth="5" strokeDasharray="251.2" strokeDashoffset="38" />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-2xl font-heading font-black text-white">85</span>
        <span className="text-[7px] text-white/40 uppercase tracking-wider">Reward IQ</span>
      </div>
    </div>
    <div className="space-y-1.5 w-full max-w-[200px]">
      <div className="flex justify-between text-[9px] text-white/60 font-mono">
        <span>Missed Savings:</span>
        <span className="text-red-400 font-bold">₹18,700</span>
      </div>
      <div className="flex justify-between text-[9px] text-white/60 font-mono">
        <span>Unused Potential:</span>
        <span className="text-clay font-bold">₹12,400</span>
      </div>
    </div>
  </div>
);

const SmartExecutionScreen = () => (
  <div className="w-full h-full bg-[#0f0f0f] p-6 flex flex-col justify-center items-center text-center font-sans">
    <div className="w-16 h-16 rounded-full bg-clay/10 border border-clay/20 flex items-center justify-center mb-6">
      <Gift className="text-clay animate-pulse" size={28} />
    </div>
    <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Optimal Pay Route</h4>
    <div className="bg-white/5 border border-clay/35 rounded-xl p-3.5 w-full max-w-[220px]">
      <p className="text-[10px] text-white/80 font-bold uppercase tracking-wider">HDFC Infinia Stack</p>
      <p className="text-clay text-xs font-black mt-1">Instant 15% Savings</p>
    </div>
  </div>
);

const HowItWorksStepper: React.FC = () => {
  const [loopKey, setLoopKey] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setLoopKey(prev => prev + 1);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="how-it-works" className="relative w-full bg-cream py-16 md:py-24 border-b border-white/10 scroll-mt-32">
      <div className="max-w-6xl mx-auto px-6 text-center mb-16 md:mb-24">
        <span className="text-clay text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">
          How It Works
        </span>
        <h2 className="text-3xl md:text-5xl font-heading font-black text-white uppercase tracking-tighter leading-none">
          From inbox signal to smarter rewards.
        </h2>
      </div>

      <div className="max-w-6xl mx-auto px-6 space-y-24 md:space-y-36">
        {STEPS.map((step) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24 items-center"
          >
            {/* Phone Visual Column */}
            <div className={`flex justify-center ${step.side === 'right' ? 'lg:order-2' : 'lg:order-1'}`}>
              <div className="relative">
                <div className="absolute inset-0 bg-clay/5 blur-[100px] rounded-full scale-110" />
                <div className="relative w-[260px] h-[520px] rounded-[3rem] border-[10px] border-[#161616] bg-[#0c0c0c] shadow-2xl overflow-hidden ring-1 ring-white/10">
                  <div className="absolute top-0 inset-x-0 h-8 flex justify-center z-[60]">
                    <div className="w-24 h-6 bg-[#161616] rounded-b-2xl" />
                  </div>
                  <div className="absolute inset-0 pt-8">
                    <AnimatePresence mode="wait">
                      <motion.div 
                        key={loopKey}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="w-full h-full"
                      >
                        {step.id === 1 && <EmailConnectScreen />}
                        {step.id === 2 && <AIScanScreen />}
                        {step.id === 3 && <RewardIQScreen />}
                        {step.id === 4 && <SmartExecutionScreen />}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            {/* Text Column */}
            <div className={`flex flex-col ${step.side === 'right' ? 'lg:order-1 lg:items-start text-left' : 'lg:order-2 lg:items-start text-left'}`}>
              <span className="block text-clay text-[10px] font-black uppercase tracking-[0.4em] mb-4">
                {step.tag}
              </span>
              <h3 className="text-2xl md:text-4xl font-heading font-black text-white uppercase tracking-tighter mb-4 leading-tight">
                {step.title}
              </h3>
              <p className="text-white/80 text-sm md:text-base leading-relaxed mb-8 max-w-md">
                {step.description}
              </p>
              <div className="flex flex-col gap-4 items-start">
                <Link 
                  to="/join-waitlist"
                  className="group relative px-8 py-4 bg-white text-cream rounded-full text-[10px] font-bold uppercase tracking-[0.3em] overflow-hidden transition-all hover:scale-105 shadow-xl"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2 text-black">
                    {step.cta} <ArrowRight size={12} />
                  </span>
                </Link>
                <div className="flex items-center gap-2 mt-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-clay animate-pulse" />
                   <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">
                     Availability: <span className="text-white/60">{step.availability}</span>
                   </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorksStepper;
