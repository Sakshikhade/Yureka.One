import React, { useRef } from 'react';
import { Lock, ShieldCheck, Award, EyeOff } from 'lucide-react';
import { motion, useInView } from 'motion/react';

const Security: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, margin: "-100px" });

    const features = [
        {
            title: "Bank-grade encryption",
            desc: "Every transaction and data is encrypted and protected from unauthorized access.",
            icon: <ShieldCheck className="text-emerald-400" size={24} />
        },
        {
            title: "RBI-compliant",
            desc: "Aligned processes and policies so payments are handled with high security.",
            icon: <Award className="text-emerald-400" size={24} />
        },
        {
            title: "No snooping around",
            desc: "Your data belongs to only you. We don't peek, track, or sell your information.",
            icon: <EyeOff className="text-emerald-400" size={24} />
        }
    ];

    return (
        <section className="bg-cream relative flex flex-col items-center justify-center overflow-hidden w-full">
            
            <div className="w-full relative z-10 text-[#242424]">
                
                {/* Confidential Stamp Header (Editorial Anchor) */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    className="flex justify-between items-end border-b-2 border-ink mb-12 pb-4"
                >
                    <div>
                        <div className="flex items-center gap-2 text-[#047857] mb-2">
                             <Lock size={14} strokeWidth={2.5} />
                             <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Privacy Protocol</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#242424] uppercase tracking-tighter leading-[0.8]">Confidential</h2>
                    </div>
                    <div className="hidden md:block text-right mb-1">
                         <p className="text-[9px] font-bold text-[#242424]/40 uppercase tracking-[0.3em] mb-1">DOC. REF: YR-884-X</p>
                         <p className="text-[9px] font-bold text-[#242424]/40 uppercase tracking-[0.3em] leading-none">SECURITY: TRIPLE-LAYER AES</p>
                    </div>
                </motion.div>

                {/* MAIN VAULT PANEL */}
                <motion.div 
                    ref={containerRef}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="relative bg-[#1A2F2F] rounded-2xl overflow-hidden shadow-2xl p-8 md:p-16 lg:p-24"
                >
                    {/* Atmospheric background detail */}
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1A2F2F]/50 to-[#1A2F2F]" />

                    <div className="relative z-10 text-center">
                        <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight mb-12">
                            Your data is <span className="text-emerald-400">locked</span> <br className="hidden md:block" />
                            <span className="text-emerald-400">away</span>, even from us
                        </h3>

                        {/* ILLUSTRATIVE CARD SHIELD GRAPHIC */}
                        <div className="relative h-[280px] md:h-[400px] w-full max-w-3xl mx-auto mb-16 flex items-center justify-center">
                            {/* The Card */}
                            <motion.div 
                                initial={{ x: -50, opacity: 0 }}
                                animate={isInView ? { x: 0, opacity: 1 } : {}}
                                transition={{ delay: 0.5, duration: 1 }}
                                className="relative w-[320px] h-[200px] md:w-[450px] md:h-[280px] bg-white rounded-xl shadow-2xl p-8 text-left rotate-[-2deg] border border-white/20 overflow-hidden"
                            >
                                <div className="flex justify-between items-start mb-12">
                                    <div className="w-12 h-12 bg-orange-100 rounded-md border border-orange-200" /> {/* Chip */}
                                    <div className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Credit Card</div>
                                </div>
                                <div className="text-xl md:text-3xl font-mono tracking-widest text-[#1A2F2F] mb-8">
                                    5371 1823 XXXX
                                </div>
                                <div className="text-[10px] md:text-sm font-bold text-gray-400 tracking-widest uppercase">
                                    ATUL KUMAR
                                </div>
                                {/* Glow Effect on card */}
                                <div className="absolute -bottom-10 right-0 w-32 h-32 bg-emerald-100/50 blur-3xl rounded-full" />
                            </motion.div>

                            {/* The Divider (Shield Line) */}
                            <motion.div 
                                initial={{ height: 0 }}
                                animate={isInView ? { height: '100%' } : {}}
                                transition={{ delay: 1, duration: 0.8 }}
                                className="absolute left-[58%] w-2 md:w-3 bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.5)] z-20 rounded-full"
                            />

                            {/* The Lock Overlay */}
                            <motion.div 
                                initial={{ scale: 0, opacity: 0 }}
                                animate={isInView ? { scale: 1, opacity: 1 } : {}}
                                transition={{ delay: 1.4, type: "spring", stiffness: 200 }}
                                className="absolute left-[58%] top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-[#1A2F2F] border-2 border-emerald-400 p-4 rounded-xl shadow-2xl text-emerald-400"
                            >
                                <Lock size={48} strokeWidth={1.5} />
                            </motion.div>

                            {/* Encrypted Side (Right Overlay) */}
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={isInView ? { opacity: 0.8 } : {}}
                                transition={{ delay: 1.2, duration: 1 }}
                                className="absolute right-[5%] w-[40%] h-full flex flex-col justify-center items-start text-xs font-mono text-emerald-400/40 pointer-events-none select-none overflow-hidden text-left"
                            >
                                <p>0xFB4D9S#AXECNN</p>
                                <p>7BB3>SX10\BB</p>
                                <p>SJJ7UJJK0JKJ+SLFF</p>
                                <p>H{{'$'}}/$#D(DH2LLL)</p>
                                <p>GA4A00A GNNG GNG2</p>
                                <p>6EE?5X S6B00S</p>
                                <p>W00AN0 NWF##</p>
                            </motion.div>
                        </div>

                        {/* FEATURE PILLARS */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 text-left max-w-5xl mx-auto">
                            {features.map((f, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ delay: 1.6 + (i * 0.2) }}
                                    className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors duration-300"
                                >
                                    <div className="mb-4">{f.icon}</div>
                                    <h4 className="text-white font-bold text-lg mb-2">{f.title}</h4>
                                    <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
                
                {/* Visual anchor dots (Editorial touch) */}
                <div className="mt-8 flex justify-center gap-1">
                    {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-ink/10" />)}
                </div>
            </div>
        </section>
    );
};

export default Security;