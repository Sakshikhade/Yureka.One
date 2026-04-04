import React, { useEffect } from 'react';
import { Shield, ChevronRight } from 'lucide-react';

const SecurityProtocolPage: React.FC = () => {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-cream min-h-screen text-ink pb-32">
            {/* Header Section */}
            <div className="pt-32 md:pt-48 pb-16 md:pb-24 border-b border-black/10 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-2 text-clay mb-6">
                        <Shield size={18} strokeWidth={2.5} />
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Legal Compendium</span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-serif leading-[0.9] tracking-tighter mb-8 uppercase">
                        Security Protocol
                    </h1>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <p className="text-xl md:text-2xl font-serif italic text-ink/60">
                            The architecture of financial privacy.
                        </p>
                        <div className="text-left md:text-right">
                            <p className="text-[10px] uppercase tracking-widest font-bold">Protocol Revision</p>
                            <p className="text-sm font-mono mt-1 text-ink/60 border-b border-clay inline-block pb-1">v4.0.1 (April 2026)</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto px-6 pt-16 md:pt-24 font-serif text-lg md:text-xl leading-relaxed text-ink/80 space-y-16">
                
                <section>
                    <p className="first-letter:text-6xl first-letter:font-bold first-letter:text-clay first-letter:mr-2 first-letter:float-left">
                        At Yureka.Money, we recognize that financial data is your most sensitive asset. Our architecture is built upon a simple, unwavering philosophy: Your financial data is none of our business. We exist to optimise your rewards, not to monetise your privacy.
                    </p>
                    <p className="mt-6">
                        This Security Protocol details the cryptographic standards, network architecture, and compliance frameworks utilised to ensure the absolute isolation and integrity of your data.
                    </p>
                </section>

                <section className="space-y-6">
                    <h2 className="text-3xl font-bold uppercase tracking-tight text-ink border-b-2 border-black pb-4">1. Cryptographic Standards</h2>
                    <p>
                        All user data in transit and at rest is secured using military-grade encryption primitives.
                    </p>
                    <ul className="space-y-4 list-none pl-0">
                        <li className="pl-6 relative">
                            <span className="absolute left-0 top-1 text-clay font-bold">&bull;</span>
                            <strong className="text-ink tracking-tight uppercase text-sm mr-2">Data At Rest:</strong> Databases are encrypted using the AES-256 standard. Sensitive identifiers (such as parsed statement data or identity tokens) are additionally hashed using Argon2id before storage.
                        </li>
                        <li className="pl-6 relative">
                            <span className="absolute left-0 top-1 text-clay font-bold">&bull;</span>
                            <strong className="text-ink tracking-tight uppercase text-sm mr-2">Data In Transit:</strong> All communications between the Yureka.Money client application and our servers are encrypted via TLS 1.3, utilizing Perfect Forward Secrecy (PFS).
                        </li>
                    </ul>
                </section>

                <section className="space-y-6">
                    <h2 className="text-3xl font-bold uppercase tracking-tight text-ink border-b-2 border-black pb-4">2. Zero-Knowledge Analytics</h2>
                    <p>
                        We provide reward optimisation insights without human visibility into your specific transactions.
                    </p>
                    <div className="bg-[#111111] text-white p-8 mt-6 shadow-xl relative overflow-hidden">
                        <span className="absolute top-0 left-0 w-1 h-full bg-clay"></span>
                        <p className="font-mono text-sm tracking-wide">
                            Our proprietary analytics engine processes credit card statements directly in a secure, ephemeral container. Once the reward extraction logic is complete, the raw statement data is permanently purged from active memory. We store only the resulting metadata (e.g., total reward points accumulated), meaning even in the event of a theoretical database compromise, your raw transaction history does not exist to be stolen.
                        </p>
                    </div>
                </section>

                <section className="space-y-6">
                    <h2 className="text-3xl font-bold uppercase tracking-tight text-ink border-b-2 border-black pb-4">3. DPDP Rule 6 Compliance</h2>
                    <p>
                        Pursuant to Rule 6 of the Digital Personal Data Protection (DPDP) Rules, Yureka.Money implements rigorous security safeguards.
                    </p>
                    <ul className="list-decimal pl-8 space-y-3 font-mono text-sm tracking-wide bg-black/5 p-6 md:p-8 rounded-sm">
                        <li><strong>Access Controls:</strong> Database clusters reside in private VPC subnets. Access is restricted exclusively to essential infrastructure engineers via VPN tunnels requiring multi-factor authentication (MFA).</li>
                        <li><strong>Intrusion Detection:</strong> Constant automated monitoring for anomalous traffic patterns or unauthorized database queries.</li>
                        <li><strong>Incident Response:</strong> A retained rapid-response security firm is on standby. In the event of a breach, impacted users will be notified within 72 hours, as per DPDP mandates.</li>
                    </ul>
                </section>

                <section className="space-y-6">
                    <h2 className="text-3xl font-bold uppercase tracking-tight text-ink border-b-2 border-black pb-4">4. Payment Gateway Infrastructure</h2>
                    <p>
                        When facilitating credit card bill payments, Yureka.Money never stores your full card number, CVV, or bank credentials.
                    </p>
                    <p className="italic text-base bg-white p-6 border border-black/10">
                        All financial transactions are handled via RBI-compliant, PCI-DSS Level 1 certified payment gateways. Yureka.Money operates strictly as a secure conduit, exchanging only encrypted, single-use payment tokens to authorise transactions.
                    </p>
                </section>
                
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold uppercase tracking-tight text-ink border-b-2 border-black pb-4">5. User Authentication</h2>
                    <ul className="space-y-4 list-none pl-0">
                        <li className="pl-6 relative">
                            <span className="absolute left-0 top-1 text-clay font-bold">&bull;</span>
                            <strong className="text-ink tracking-tight uppercase text-sm mr-2">Session Management:</strong> Active user sessions employ secure, httpOnly JWTs (JSON Web Tokens) with aggressive expiration windows to mitigate session hijacking.
                        </li>
                        <li className="pl-6 relative">
                            <span className="absolute left-0 top-1 text-clay font-bold">&bull;</span>
                            <strong className="text-ink tracking-tight uppercase text-sm mr-2">Inactivity Nullification:</strong> The platform enforces strict state nullification upon user inactivity or explicit logout, immediately terminating access to sensitive dashboards.
                        </li>
                    </ul>
                </section>

                <section className="border-t-4 border-black pt-16 mt-16 text-center space-y-8">
                     <p className="text-sm md:text-base font-mono uppercase tracking-widest">
                         Vulnerability Disclosure: If you are a security researcher and believe you have discovered a vulnerability on the Yureka platform, we ask that you practice responsible disclosure. We run a private bug bounty program for validated, critical exploits.
                     </p>
                     
                     <div className="pt-8">
                         <h3 className="text-2xl font-bold uppercase tracking-tight text-ink mb-4">Report an Incident</h3>
                         <p className="italic text-ink/60 mb-6">If you suspect your account has been compromised, contact our InfoSec team immediately.</p>
                         <a href="mailto:security@yureka.money" className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 uppercase font-bold tracking-[0.2em] text-xs hover:bg-clay hover:scale-105 transition-all">
                             Contact InfoSec <ChevronRight size={14} />
                         </a>
                     </div>
                </section>

            </div>
            
            <div className="max-w-4xl mx-auto px-6 mt-24 flex items-center justify-center gap-4 text-xs font-mono uppercase tracking-widest text-ink/30">
                <span>Infrastructure Desk</span>
                <span>•</span>
                <span>Yureka.Money Security Command</span>
            </div>
        </div>
    );
};

export default SecurityProtocolPage;
