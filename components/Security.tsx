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
                        <div className="flex items-center gap-2 text-clay mb-2">
                             <Lock size={16} />
                             <span className="text-xs font-bold uppercase tracking-[0.3em]">Privacy Protocol</span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-serif text-ink uppercase tracking-tighter">Confidential</h2>
                    </div>
                    <div className="hidden md:block text-right">
                         <p className="text-[10px] font-mono text-ink/40 uppercase tracking-widest">Doc. Ref: YR-884-X</p>
                         <p className="text-[10px] font-mono text-ink/40 uppercase tracking-widest leading-none">Security: Triple-Layer AES</p>
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
                    className="relative border border-ink/10 bg-paper p-12 md:p-24 text-center cursor-crosshair group overflow-hidden shadow-2xl"
                >
                    <div className="absolute top-8 right-8 opacity-5">
                        <Fingerprint size={120} className="text-ink" />
                    </div>

                    {/* Masked Content (Dimmed) */}
                    <div className="relative z-10 opacity-20 blur-[3px] transition-all duration-700 group-hover:opacity-10 group-hover:blur-md text-ink">
                        <h3 className="text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tighter leading-[0.8] mb-8">
                            Your Financial Data <br/> Is None Of Our Business.
                        </h3>
                        <p className="font-serif text-xl md:text-2xl italic max-w-xl mx-auto text-ink/70">
                            We use bank-grade encryption for every match. We do not sell, share, or monetize your spending patterns. 
                        </p>
                    </div>

                    {/* Torch Reveal Layer */}
                    <motion.div 
                        className="absolute inset-0 bg-ink text-white flex items-center justify-center pointer-events-none z-20"
                        style={{
                            clipPath: `circle(${isHovered ? '220px' : '0px'} at ${springX}px ${springY}px)`,
                            WebkitClipPath: `circle(${isHovered ? '220px' : '0px'} at ${springX}px ${springY}px)`
                        }}
                    >
                         <div className="p-12 md:p-20 text-center">
                            <h3 className="text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tighter leading-[0.8] mb-8">
                                Your Financial Data <br/> Is None Of Our Business.
                            </h3>
                            <p className="font-serif text-xl md:text-2xl italic max-w-xl mx-auto opacity-80">
                                We use bank-grade encryption for every match. We do not sell, share, or monetize your spending patterns. 
                            </p>
                            <div className="mt-10 inline-block border border-white/30 bg-white/5 backdrop-blur-sm px-6 py-2.5 text-[10px] font-bold uppercase tracking-[0.3em] rounded-full">
                                Verified Secure Protocol
                            </div>
                         </div>
                    </motion.div>
                    
                    {/* Grid Pattern Overlay */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundSize: '40px 40px', backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)' }}></div>

                </motion.div>
            </div>
        </section>
    );
};

export default Security;