import React, { useRef, useState } from 'react';
import { Lock, Fingerprint } from 'lucide-react';
import { motion, useMotionValue, useSpring, useInView } from 'motion/react';

const Security: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const isInView = useInView(containerRef, { once: true, margin: "-100px" });

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 150 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };

    return (
        <section className="py-32 bg-cream border-t border-black/10 relative flex items-center justify-center overflow-hidden">
            
            <div className="max-w-4xl mx-auto w-full px-6 text-ink">
                
                {/* Confidential Stamp Header */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="flex justify-between items-end border-b-2 border-ink mb-12 pb-4"
                >
                    <div>
                        <div className="flex items-center gap-2 text-[#0e4d3a] mb-2">
                             <Lock size={16} strokeWidth={2.5} />
                             <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Privacy Protocol</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-ink uppercase tracking-tighter leading-[0.8]">Confidential</h2>
                    </div>
                    <div className="hidden md:block text-right mb-1">
                         <p className="text-[9px] font-bold text-ink/40 uppercase tracking-[0.3em] mb-1">Doc. Ref: YR-884-X</p>
                         <p className="text-[9px] font-bold text-ink/40 uppercase tracking-[0.3em] leading-none">Security: Triple-Layer AES</p>
                    </div>
                </motion.div>

                <motion.div 
                    ref={containerRef}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="relative border border-ink/10 bg-[#111111] p-12 md:p-32 text-center cursor-crosshair group overflow-hidden shadow-2xl rounded-sm"
                >
                    <div className="absolute top-12 right-12 opacity-[0.03]">
                        <Fingerprint size={160} className="text-white" />
                    </div>

                    {/* Masked Content (Dimmed) */}
                    <div className="relative z-10 transition-all duration-700 opacity-90 group-hover:opacity-40 group-hover:blur-sm text-white">
                        <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tighter leading-[0.9] mb-8 max-w-2xl mx-auto">
                            Your Financial Data <br/> Is None Of Our Business.
                        </h3>
                        <p className="font-serif text-xl md:text-2xl italic max-w-xl mx-auto text-white/60 leading-relaxed">
                            We use bank-grade encryption for every match. We do not sell, share, or monetize your spending patterns. 
                        </p>
                        <div className="mt-12 inline-block border border-white/20 px-8 py-3 text-[9px] font-bold uppercase tracking-[0.4em] rounded-full text-white/40">
                            Verified Secure Protocol
                        </div>
                    </div>

                    {/* Torch Reveal Layer */}
                    <motion.div 
                        className="absolute inset-0 bg-white text-ink flex items-center justify-center pointer-events-none z-20"
                        style={{
                            clipPath: `circle(${isHovered ? '240px' : '0px'} at ${springX}px ${springY}px)`,
                            WebkitClipPath: `circle(${isHovered ? '240px' : '0px'} at ${springX}px ${springY}px)`
                        }}
                    >
                         <div className="p-12 md:p-20 text-center">
                            <div className="mb-8 opacity-20">
                                <Lock size={40} strokeWidth={1} />
                            </div>
                            <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tighter leading-[0.9] mb-8 max-w-2xl mx-auto">
                                Your Financial Data <br/> Is None Of Our Business.
                            </h3>
                            <p className="font-serif text-xl md:text-2xl italic max-w-xl mx-auto text-ink/80 leading-relaxed">
                                We use bank-grade encryption for every match. We do not sell, share, or monetize your spending patterns. 
                            </p>
                            <div className="mt-12 inline-block bg-ink text-white px-8 py-3 text-[9px] font-bold uppercase tracking-[0.4em] rounded-full shadow-xl">
                                Verified Secure Protocol
                            </div>
                         </div>
                    </motion.div>
                    
                    {/* Grid Pattern Overlay Removed */}

                </motion.div>
            </div>
        </section>
    );
};

export default Security;