import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Search, Zap } from 'lucide-react';

const STEPS = [
  {
    id: 1,
    title: 'Securely link your accounts or upload your latest credit card statements for analysis.',
  },
  {
    id: 2,
    title: 'Our neural engine audits your spending behavior and scans 200+ premium cards.',
  },
  {
    id: 3,
    title: 'Review your personalized intelligence report. We match you with the exact cards that maximize your yield.',
  },
  {
    id: 4,
    title: 'Apply seamlessly and start earning 15% more on every zero-fee transaction.',
  }
];

// Screen 1: Scan / Upload
const ScanScreen = () => (
  <div className="w-full h-full flex flex-col justify-center items-center px-6 relative pointer-events-none">
    <h3 className="text-3xl font-serif text-[#047857] mb-4">Neural<br/><span className="text-[#242424]">Audit</span></h3>
    <p className="text-[10px] text-[#242424]/50 text-center mb-8 uppercase tracking-widest font-sans">
      Initializing protocol
    </p>
    
    <div className="w-full h-32 rounded-xl border border-ink/10 relative overflow-hidden bg-white/50 flex items-center justify-center">
      <div className="absolute inset-x-0 top-0 h-1 bg-[#047857] shadow-[0_0_15px_#047857] animate-[scan_2s_ease-in-out_infinite_alternate]" />
      <Search className="text-[#047857]/40 w-10 h-10" />
    </div>
    
    <div className="w-full bg-white border border-ink/5 shadow-sm rounded-xl mt-8 py-4 text-center text-xs text-[#242424]/50 animate-pulse">
      Scanning statements...
    </div>
  </div>
);

// Screen 2: Processing Matrix
const ProcessingScreen = () => (
  <div className="w-full h-full flex flex-col justify-center items-start px-6 relative pointer-events-none">
    <h3 className="text-[28px] font-serif text-[#242424] mb-8 leading-tight">
      We're currently<br/>
      <span className="text-[#047857] italic">crunching the data</span>
    </h3>
    
    <div className="space-y-6 w-full relative">
       <div className="absolute left-[9px] top-4 bottom-4 w-px bg-ink/10" />
       
       <div className="flex gap-4 relative">
          <div className="w-5 h-5 rounded-full bg-[#047857] border-4 border-cream z-10 shrink-0" />
          <div>
            <div className="text-xs text-[#242424] font-medium mb-1">Upload Received</div>
            <div className="text-[10px] text-[#242424]/40">Secure hash verified</div>
          </div>
       </div>

       <div className="flex gap-4 relative">
          <div className="w-5 h-5 rounded-full bg-[#047857]/40 border-4 border-cream z-10 shrink-0 animate-pulse" />
          <div>
            <div className="text-xs text-[#242424] font-medium mb-1">Matrix Audit</div>
            <div className="text-[10px] text-[#242424]/40">Scanning 42,000 data points...</div>
          </div>
       </div>

       <div className="flex gap-4 relative opacity-40">
          <div className="w-5 h-5 rounded-full bg-ink/10 border-4 border-cream z-10 shrink-0" />
          <div>
            <div className="text-xs text-[#242424] font-medium mb-1">Yield Mapping</div>
            <div className="text-[10px] text-[#242424]/40">Pending</div>
          </div>
       </div>
    </div>
  </div>
);

// Screen 3: Match / Report
const MatchScreen = () => (
  <div className="w-full h-full flex flex-col justify-center px-6 pointer-events-none relative">
     <h3 className="text-2xl font-serif text-[#242424] leading-snug mb-8">
        Here is your<br/>
        <span className="text-[#047857]">optimized portfolio</span>
     </h3>

     <div className="w-full rounded-2xl bg-white border border-ink/5 p-5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#047857]/10 blur-2xl rounded-full" />
        <p className="text-[9px] uppercase tracking-widest text-[#047857] font-bold mb-6">Top Match 98%</p>
        <h4 className="text-lg font-serif text-[#242424] mb-1 uppercase tracking-tight">HDFC Diners Black</h4>
        <p className="text-xs text-[#242424]/50 mb-6">Premium Travel & Lounge</p>

        <div className="p-3 bg-cream rounded-xl flex justify-between items-center border border-ink/5">
           <div>
              <div className="text-[9px] text-[#242424]/40 uppercase tracking-widest mb-1">Projected VIP Yield</div>
              <div className="text-sm font-medium text-emerald-600">₹45,000 /yr</div>
           </div>
           <Zap className="text-emerald-500 w-4 h-4" />
        </div>
     </div>
  </div>
);

// Screen 4: Success
const SuccessScreen = () => (
  <div className="w-full h-full flex flex-col justify-center items-center px-6 pointer-events-none relative text-center">
      <div className="w-20 h-20 rounded-full border border-dashed border-[#047857]/30 flex items-center justify-center mb-8 relative">
         <div className="absolute inset-0 bg-[#047857]/5 rounded-full animate-ping opacity-50" />
         <CheckCircle2 className="text-[#047857] w-10 h-10" />
      </div>

      <h3 className="text-2xl font-serif text-[#242424] mb-2">Unlocked</h3>
      <p className="text-xs text-[#242424]/50 font-sans tracking-wide mb-10 max-w-[200px]">
        Your card application is approved and yield strategy is active.
      </p>

      <div className="w-full rounded-xl bg-white border border-ink/5 shadow-sm p-4 text-left">
         <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-[#242424]/60">New Card Status</span>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Dispatched</span>
         </div>
         <div className="flex justify-between items-center">
            <span className="text-xs text-[#242424]/60">Lifetime Value</span>
            <span className="text-sm text-[#242424] font-medium">+15% base yield</span>
         </div>
      </div>
  </div>
);

const HowItWorksStepper: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [isHovering, setIsHovering] = useState(false);

  // Auto-cycle through steps if not interacting
  useEffect(() => {
    if (isHovering) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev % 4) + 1);
    }, 4500);
    return () => clearInterval(interval);
  }, [isHovering]);

  const screens = {
    1: <ScanScreen />,
    2: <ProcessingScreen />,
    3: <MatchScreen />,
    4: <SuccessScreen />
  };

  return (
    <section 
        className="w-full bg-paper border-y border-ink/10 py-24 lg:py-32 relative overflow-hidden"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
    >
      {/* Background Radiating Rings (Concentric circles like image) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1200px] aspect-square pointer-events-none opacity-20">
        <div className="absolute inset-0 m-auto w-[40%] h-[40%] rounded-full border border-ink/10" />
        <div className="absolute inset-0 m-auto w-[60%] h-[60%] rounded-full border border-dashed border-ink/10" />
        <div className="absolute inset-0 m-auto w-[80%] h-[80%] rounded-full border border-ink/5" />
        <div className="absolute inset-0 m-auto w-[100%] h-[100%] rounded-full border border-dashed border-ink/5" />
        
        {/* Subtle grid over the bg */}
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: 'linear-gradient(to right, #242424 1px, transparent 1px), linear-gradient(to bottom, #242424 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
        />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
        
        {/* LEFT COLUMN: Titles */}
        <div className="lg:col-span-3 text-center lg:text-left order-1">
          <p className="text-[10px] text-[#242424]/30 uppercase tracking-[0.3em] font-bold mb-4 font-sans">
            How does it work?
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-[2.5rem] font-serif text-[#242424] leading-tight">
            Optimize Your Yield in <span className="italic font-light text-[#047857]">&lt;5 Minutes</span>
          </h2>
        </div>

        {/* CENTER COLUMN: Phone Mockup */}
        <div className="lg:col-span-4 xl:col-span-5 flex justify-center order-2 lg:order-2 my-8 lg:my-0">
          <div className="relative w-[260px] sm:w-[280px] h-[540px] sm:h-[580px] rounded-[3rem] border-[8px] border-white bg-cream shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden ring-1 ring-ink/5 shrink-0">
             
             {/* Phone Notch/Dynamic Island */}
             <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-50">
               <div className="w-32 h-6 bg-white rounded-b-3xl border-b border-x border-ink/5"></div>
             </div>

             {/* Phone Top Status Bar */}
             <div className="absolute top-0 inset-x-0 h-12 flex justify-between items-center px-6 z-40 pointer-events-none text-[10px] font-medium text-[#242424]/50">
                <span>13:13</span>
                <div className="flex gap-1.5 items-center">
                   <div className="w-4 h-3 bg-[#242424]/50 rounded-sm"></div>
                   <div className="w-3 h-3 bg-[#242424]/50 rounded-full"></div>
                </div>
             </div>

             {/* Screen Content */}
             <div className="absolute inset-0 pt-12 pb-8 bg-gradient-to-b from-white to-cream/50">
                <AnimatePresence mode="wait">
                   <motion.div
                      key={activeStep}
                      initial={{ opacity: 0, y: 15, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -15, scale: 0.98 }}
                      transition={{ duration: 0.4 }}
                      className="w-full h-full"
                   >
                      {screens[activeStep as keyof typeof screens]}
                   </motion.div>
                </AnimatePresence>
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Stepper list */}
        <div className="lg:col-span-5 xl:col-span-4 order-3 flex flex-col gap-4">
           {STEPS.map((step, index) => {
             const isActive = activeStep === step.id;
             return (
                <div 
                   key={step.id}
                   onClick={() => setActiveStep(step.id)}
                   className={`
                     cursor-pointer transition-all duration-500 rounded-2xl p-6 lg:p-8 backdrop-blur-xl
                     ${isActive 
                         ? 'bg-white/80 border border-white shadow-xl scale-[1.02]' 
                         : 'bg-transparent border border-transparent hover:bg-white/40 opacity-50 hover:opacity-100'
                     }
                   `}
                >
                 <div className="flex gap-4">
                    <span className={`text-[11px] font-bold mt-1 ${isActive ? 'text-[#047857]' : 'text-[#242424]/50'}`}>
                      {index + 1}.
                    </span>
                    <p className={`text-sm md:text-base leading-relaxed ${isActive ? 'text-[#242424] font-sans' : 'text-[#242424]/60 font-sans'}`}>
                      {step.title}
                    </p>
                 </div>
               </div>
             );
           })}
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 98%; opacity: 0; }
        }
      `}} />
    </section>
  );
};

export default HowItWorksStepper;
