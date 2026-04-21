import React, { useEffect } from 'react';
import { Shield, ChevronRight } from 'lucide-react';

const CommunityGuidelines: React.FC = () => {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-cream min-h-screen text-[#242424] pb-32">
            {/* Header Section */}
            <div className="pt-6 md:pt-16 pb-16 md:pb-24 border-b border-black/10 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-2 text-[#047857] mb-6">
                        <Shield size={18} strokeWidth={2.5} />
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Legal Compendium</span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-serif leading-[0.9] tracking-tighter mb-8 uppercase">
                        Community Guidelines
                    </h1>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <p className="text-xl md:text-2xl font-serif italic text-[#242424]/60">
                            Rules of engagement for the Yureka financial club.
                        </p>
                        <div className="text-left md:text-right">
                            <p className="text-[10px] uppercase tracking-widest font-bold">Effective Date</p>
                            <p className="text-sm font-mono mt-1 text-[#242424]/60 border-b border-clay inline-block pb-1">April 2026</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto px-6 pt-16 md:pt-24 font-serif text-lg md:text-xl leading-relaxed text-[#242424]/80 space-y-16">
                
                <section>
                    <p className="first-letter:text-6xl first-letter:font-bold first-letter:text-[#047857] first-letter:mr-2 first-letter:float-left">
                        Yureka.Money is more than a platform; it is an exclusive club of financial strategists, reward optimizers, and high-net-worth analysts. We demand a high standard of discourse. Our community is built on a foundation of mutual respect, tactical intelligence, and strict adherence to truth.
                    </p>
                    <p className="mt-6">
                        By participating on the Yureka platform, whether in waitlist forums, user reviews, or interactions with the Yureka AI, you agree unequivocally to the following tenets of behavior.
                    </p>
                </section>

                <section className="space-y-6">
                    <h2 className="text-3xl font-bold uppercase tracking-tight text-[#242424] border-b-2 border-black pb-4">1. Elevate the Discourse</h2>
                    <p>
                        We cater to those who treat credit strategy as a science. Your contributions should reflect this.
                    </p>
                    <ul className="space-y-4 list-none pl-0">
                        <li className="pl-6 relative">
                            <span className="absolute left-0 top-1 text-[#047857] font-bold">&bull;</span>
                            <strong className="text-[#242424] tracking-tight uppercase text-sm mr-2">Substantive Value:</strong> Before posting a review or a strategy, ask yourself if it adds verifiable, tactical value to the community.
                        </li>
                        <li className="pl-6 relative">
                            <span className="absolute left-0 top-1 text-[#047857] font-bold">&bull;</span>
                            <strong className="text-[#242424] tracking-tight uppercase text-sm mr-2">Factual Accuracy:</strong> Speculation regarding RBI regulations, bank terms, or credit scoring algorithms must be clearly marked as such. Do not present financial rumors as fact.
                        </li>
                        <li className="pl-6 relative">
                            <span className="absolute left-0 top-1 text-[#047857] font-bold">&bull;</span>
                            <strong className="text-[#242424] tracking-tight uppercase text-sm mr-2">Professionalism:</strong> Engaging in ad hominem attacks, trolling, or aggressive debate diminishes the quality of our collective intelligence and will not be tolerated.
                        </li>
                    </ul>
                </section>

                <section className="space-y-6">
                    <h2 className="text-3xl font-bold uppercase tracking-tight text-[#242424] border-b-2 border-black pb-4">2. Zero Tolerance for Scams & Solicitation</h2>
                    <p>
                        Yureka.Money is a sanctuary from the noise of predatory financial products and unauthorized financial advisors.
                    </p>
                    <div className="bg-[#242424] text-cream p-8 mt-6 shadow-xl relative overflow-hidden">
                        <span className="absolute top-0 left-0 w-1 h-full bg-[#047857]"></span>
                        <p className="font-mono text-sm tracking-wide">
                            Users offering unauthorized financial advice, attempting to sell third-party services, peddling crypto-schemes, or asking for compensation in exchange for "insider" credit strategies will face immediate, permanent account termination.
                        </p>
                    </div>
                </section>

                <section className="space-y-6">
                    <h2 className="text-3xl font-bold uppercase tracking-tight text-[#242424] border-b-2 border-black pb-4">3. Protection of Confidentiality</h2>
                    <p>
                        Our platform integrates deeply with personal financial data. Respecting this boundary is non-negotiable.
                    </p>
                    <ul className="list-decimal pl-8 space-y-3 font-mono text-sm tracking-wide bg-black/5 p-6 md:p-8 rounded-sm">
                        <li>Do not post your full credit card numbers, CVVs, or OTPs anywhere on the community forums or reviews.</li>
                        <li>Do not ask other users for their sensitive financial data.</li>
                        <li>Respect the privacy of our analysts and staff; do not attempt to contact them outside of designated support channels.</li>
                    </ul>
                </section>

                <section className="space-y-6">
                    <h2 className="text-3xl font-bold uppercase tracking-tight text-[#242424] border-b-2 border-black pb-4">4. Integrity of Review Data</h2>
                    <p>
                        Our Card Explorer relies on the honesty of the Yureka club. When leaving reviews for credit instruments or banks:
                    </p>
                    <ul className="space-y-4 list-none pl-0">
                        <li className="pl-6 relative">
                            <span className="absolute left-0 top-1 text-[#047857] font-bold">&bull;</span>
                            <strong className="text-[#242424] tracking-tight uppercase text-sm mr-2">Be Authentic:</strong> Do not submit fake reviews to artificially inflate or deflate a financial product's standing.
                        </li>
                        <li className="pl-6 relative">
                            <span className="absolute left-0 top-1 text-[#047857] font-bold">&bull;</span>
                            <strong className="text-[#242424] tracking-tight uppercase text-sm mr-2">Disclose Bias:</strong> If you are employed by an issuing bank or networked entity, you must disclose this when discussing competitor products.
                        </li>
                    </ul>
                </section>

                <section className="border-t-4 border-black pt-16 mt-16 text-center space-y-8">
                     <p className="text-sm md:text-base font-mono uppercase tracking-widest">
                         Enforcement: The Yureka Moderation Team reserves the right to remove content, issue warnings, or revoke club access at our sole discretion for any violation of these guidelines.
                     </p>
                     
                     <div className="pt-8">
                         <h3 className="text-2xl font-bold uppercase tracking-tight text-[#242424] mb-4">See a Violation?</h3>
                         <p className="italic text-[#242424]/60 mb-6">If you witness behavior that violates these principles, please report it immediately to our security desk.</p>
                         <a href="mailto:contact@yureka.money" className="inline-flex items-center gap-2 bg-[#242424] text-cream px-8 py-4 uppercase font-bold tracking-[0.2em] text-xs hover:bg-[#047857] hover:scale-105 transition-all">
                             Report Violation <ChevronRight size={14} />
                         </a>
                     </div>
                </section>

            </div>
            
            <div className="max-w-4xl mx-auto px-6 mt-24 flex items-center justify-center gap-4 text-xs font-mono uppercase tracking-widest text-[#242424]/30">
                <span>Brand Name: Yureka.Money</span>
                <span>•</span>
                <span>Club Regulations</span>
            </div>
        </div>
    );
};

export default CommunityGuidelines;
