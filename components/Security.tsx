import React, { useRef, useState, useEffect } from 'react';
import { Lock, ShieldCheck, Award, EyeOff } from 'lucide-react';
import { motion, useInView, AnimatePresence } from 'motion/react';

const EncryptedText: React.FC<{ text: string }> = ({ text }) => {
    const [display, setDisplay] = useState(text);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";

    useEffect(() => {
        const interval = setInterval(() => {
            setDisplay(prev => 
                prev.split('').map((char, i) => {
                    if (char === ' ') return ' ';
                    // Higher frequency of cycling for the "live" feel
                    if (Math.random() > 0.7) return chars[Math.floor(Math.random() * chars.length)];
                    return char;
                }).join('')
            );
        }, 80); // Faster cycle
        return () => clearInterval(interval);
    }, [text]);

    return <span className="font-mono">{display}</span>;
}

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

                        {/* ADVANCED SCANNING CARD GRAPHIC */}
                        <div className="relative h-[250px] md:h-[400px] w-full max-w-4xl mx-auto mb-16 flex items-center justify-center">
                            
                            {/* BASE CONTAINER */}
                            <div className="relative w-[300px] h-[180px] md:w-[480px] md:h-[280px]">
                                
                                {/* LAYER 1: THE REVEALED ENCRYPTED CARD (Full Background) */}
                                <div className="absolute inset-0 bg-[#0F1D1D] rounded-xl border border-emerald-500/30 overflow-hidden shadow-[0_0_50px_rgba(52,211,153,0.1)]">
                                    <div className="p-6 md:p-10 h-full flex flex-col justify-between relative">
                                        <div className="flex justify-between items-start">
                                            <div className="w-10 h-8 md:w-12 md:h-10 bg-emerald-500/20 rounded-md border border-emerald-500/40" />
                                            <div className="text-[8px] md:text-[10px] font-mono text-emerald-400/60 tracking-widest uppercase">SECURE_PROC_ID</div>
                                        </div>
                                        
                                        {/* SCROLLING TERMINAL FEED */}
                                        <div className="absolute left-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none overflow-hidden">
                                            <motion.div 
                                                animate={{ y: [0, -500] }}
                                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                                className="flex flex-col gap-1 p-4"
                                            >
                                                {[...Array(40)].map((_, i) => (
                                                    <div key={i} className="text-[6px] md:text-[8px] font-mono text-emerald-400 whitespace-nowrap">
                                                        {Math.random().toString(16).slice(2, 18).toUpperCase()}
                                                    </div>
                                                ))}
                                            </motion.div>
                                        </div>

                                        <div className="space-y-1 md:space-y-2 opacity-40 overflow-hidden relative z-10">
                                            {[...Array(5)].map((_, i) => (
                                                <div key={i} className="flex gap-2 whitespace-nowrap">
                                                    <span className="text-[8px] md:text-[10px] font-mono text-emerald-400">0x{Math.random().toString(16).slice(2, 8).toUpperCase()}</span>
                                                    <span className="text-[8px] md:text-[10px] font-mono text-emerald-400/30">>> ENCRYPTED_BLOCK_{i}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="text-xl md:text-3xl font-mono text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)] tracking-[0.2em] relative z-10">
                                            <EncryptedText text="**** **** **** 8421" />
                                        </div>
                                    </div>
                                    {/* Circuit Grid Pattern */}
                                    <div className="absolute inset-0 opacity-10 pointer-events-none" 
                                        style={{ backgroundImage: 'radial-gradient(circle, #34d399 1px, transparent 1px)', backgroundSize: '15px 15px' }} 
                                    />
                                </div>

                                {/* LAYER 2: THE VISIBLE WHITE CARD (Top Layer - Clipped from the left) */}
                                <motion.div 
                                    initial={{ clipPath: 'inset(0 0 0 0%)' }}
                                    animate={isInView ? { clipPath: 'inset(0 0 0 45%)' } : { clipPath: 'inset(0 0 0 0%)' }}
                                    transition={{ delay: 0.8, duration: 2.5, ease: [0.65, 0, 0.35, 1] }}
                                    className="absolute inset-0 bg-white rounded-xl shadow-2xl overflow-hidden z-10 border border-gray-200 pointer-events-none"
                                >
                                    <div className="p-6 md:p-10 h-full flex flex-col justify-between w-[300px] md:w-[480px]">
                                        <div className="flex justify-between items-start">
                                            <div className="w-10 h-8 md:w-12 md:h-10 bg-orange-100 rounded-md border border-orange-200" />
                                            <div className="text-[8px] md:text-[10px] font-bold text-gray-300 tracking-widest uppercase">CREDIT CARD</div>
                                        </div>
                                        <div className="space-y-2 md:space-y-4">
                                            <div className="text-xl md:text-3xl font-mono tracking-widest text-[#1A2F2F]">
                                                5371 1823 4402 8421
                                            </div>
                                            <div className="text-[8px] md:text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                                                ATUL KUMAR
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-end">
                                             <div className="text-[8px] md:text-[10px] text-gray-300 font-mono italic">EXP: 04/28</div>
                                             <div className="flex -space-x-2">
                                                 <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-red-500/20 border border-red-500/10" />
                                                 <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-orange-500/20 border border-orange-500/10" />
                                             </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* LAYER 3: THE SCANNING BEAM (Moves Left to Right) */}
                                <motion.div 
                                    initial={{ left: '0%' }}
                                    animate={isInView ? { left: '45%' } : { left: '0%' }}
                                    transition={{ delay: 0.8, duration: 2.5, ease: [0.65, 0, 0.35, 1] }}
                                    className="absolute top-[-15%] bottom-[-15%] w-[3px] bg-emerald-400 z-30 shadow-[0_0_15px_#34d399,0_0_30px_#34d399]"
                                >
                                    {/* Laser Glow Heads */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-emerald-400 blur-sm rounded-full" />
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-emerald-400 blur-sm rounded-full" />
                                    
                                    {/* INTERFERENCE SHIMMER */}
                                    <motion.div 
                                        animate={{ opacity: [0, 0.4, 0], scaleY: [1, 1.2, 1] }}
                                        transition={{ duration: 0.1, repeat: Infinity }}
                                        className="absolute inset-0 bg-white/40 blur-sm"
                                    />

                                    {/* Lock Attachment */}
                                    <motion.div 
                                        initial={{ scale: 0, x: -10, opacity: 0 }}
                                        animate={isInView ? { scale: 1, x: 0, opacity: 1 } : {}}
                                        transition={{ delay: 2.8, type: "spring", stiffness: 200 }}
                                        className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-[#1A2F2F] border-2 border-emerald-400 p-2 md:p-3 rounded-lg md:rounded-xl shadow-[0_0_40px_rgba(52,211,153,0.5)] text-emerald-400 z-40"
                                    >
                                        <Lock size={28} className="md:w-10 md:h-10 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                                    </motion.div>
                                </motion.div>
                            </div>

                            {/* DECORATIVE FLOATING PARTICLES */}
                            {[...Array(12)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-1 h-1 bg-emerald-500/40 rounded-full"
                                    initial={{ 
                                        x: (Math.random() - 0.5) * 800, 
                                        y: (Math.random() - 0.5) * 400,
                                        opacity: 0 
                                    }}
                                    animate={isInView ? { 
                                        opacity: [0, 1, 0],
                                        y: [(Math.random() - 0.5) * 400, (Math.random() - 0.5) * 400 - 150],
                                    } : {}}
                                    transition={{ 
                                        duration: 3 + Math.random() * 2, 
                                        repeat: Infinity, 
                                        delay: i * 0.2 
                                    }}
                                />
                            ))}
                        </div>

                        {/* FEATURE PILLARS */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 text-left max-w-5xl mx-auto">
                            {features.map((f, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ delay: 3 + (i * 0.2) }}
                                    className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-300 group"
                                >
                                    <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">{f.icon}</div>
                                    <h4 className="text-white font-bold text-lg mb-2">{f.title}</h4>
                                    <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
                
                <div className="mt-8 flex justify-center gap-1">
                    {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-ink/10" />)}
                </div>
            </div>
        </section>
    );
};

export default Security;