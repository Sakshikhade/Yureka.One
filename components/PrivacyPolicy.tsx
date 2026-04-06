import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-cream min-h-screen text-ink pb-32">
            {/* Header Section */}
            <div className="pt-6 md:pt-16 pb-16 md:pb-24 border-b border-black/10 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-2 text-clay mb-6">
                        <Shield size={18} strokeWidth={2.5} />
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Legal Compendium</span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-serif leading-[0.9] tracking-tighter mb-8 uppercase">
                        Privacy Policy
                    </h1>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <p className="text-xl md:text-2xl font-serif italic text-ink/60">
                            How we protect your financial data.
                        </p>
                        <div className="text-left md:text-right">
                            <p className="text-[10px] uppercase tracking-widest font-bold">Last Updated</p>
                            <p className="text-sm font-mono mt-1 text-ink/60 border-b border-clay inline-block pb-1">7th April 2026</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto px-6 pt-16 md:pt-24 font-serif text-lg md:text-xl leading-relaxed text-ink/80 space-y-16">
                
                <section>
                    <p className="first-letter:text-6xl first-letter:font-bold first-letter:text-clay first-letter:mr-2 first-letter:float-left">
                        At Yureka.Money, we understand the importance of safeguarding your privacy and protecting your personal information. Throughout this Privacy Policy, when we mention "the Company," "Yureka.Money," "We," "Us," or "Our," we are referring to Yureka.Money and its affiliates.
                    </p>
                </section>

                <section className="space-y-6">
                    <h2 className="text-3xl font-bold uppercase tracking-tight text-ink border-b-2 border-black pb-4">Collection of Information</h2>
                    <p>Yureka.Money collects various types of information to provide you with our services effectively. This information includes:</p>
                    <ul className="space-y-4 list-none pl-0">
                        <li className="pl-6 relative">
                            <span className="absolute left-0 top-1 text-clay font-bold">&bull;</span>
                            <strong className="text-ink tracking-tight uppercase text-sm mr-2">User Provided Information:</strong> When you register or use Yureka.Money, it is necessary to provide personal details such as your name, email address, contact number, and other relevant information.
                        </li>
                        <li className="pl-6 relative">
                            <span className="absolute left-0 top-1 text-clay font-bold">&bull;</span>
                            <strong className="text-ink tracking-tight uppercase text-sm mr-2">Information Generated Through Use:</strong> We gather data about the services you use on Yureka.Money, your interactions with our platform, transaction details, and other usage metrics to enhance your experience.
                        </li>
                        <li className="pl-6 relative">
                            <span className="absolute left-0 top-1 text-clay font-bold">&bull;</span>
                            <strong className="text-ink tracking-tight uppercase text-sm mr-2">Information from Third Parties:</strong> With your explicit consent, we may obtain information from third parties to authenticate your identity, provide specific services, or personalize your experience.
                        </li>
                    </ul>
                    <p className="italic text-base text-ink/60 border-l-2 border-clay pl-4 mt-6">
                        The nature and amount of information collected depends upon the type of interaction between the company and the user.
                    </p>
                </section>

                <section className="space-y-6">
                    <h2 className="text-3xl font-bold uppercase tracking-tight text-ink border-b-2 border-black pb-4">Use of Information</h2>
                    <p>Yureka.Money utilises the collected information for various purposes, including but not limited to:</p>
                    <ul className="list-disc pl-8 space-y-3">
                        <li>Providing, personalising, and improving our services to meet your needs.</li>
                        <li>Processing transactions and delivering requested services efficiently.</li>
                        <li>Communicating with you about your account, updates, and to send you promotional, marketing, and advertising content related to our services, products, and offerings. This content may be delivered via various channels, including email, SMS messages, WhatsApp messages, and RCS messages.</li>
                        <li>Detecting and preventing fraud, abuse, or security incidents to ensure a safe environment for all users.</li>
                        <li>Complying with legal obligations and enforcing our policies effectively.</li>
                    </ul>
                    <div className="bg-[#111111] text-white p-8 mt-8 border border-black/10 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-clay"></div>
                        <p className="italic text-base">
                            You have the right to withdraw your consent and opt out of receiving promotional communications from us at any time. You can typically do this by following the unsubscribe instructions provided in the communication (e.g., clicking the unsubscribe link in an email or replying "STOP" to a text message).
                        </p>
                    </div>
                </section>

                <section className="space-y-6">
                    <h2 className="text-3xl font-bold uppercase tracking-tight text-ink border-b-2 border-black pb-4">Disclosure of Information</h2>
                    <p>Yureka.Money may disclose your information to:</p>
                    <ul className="list-disc pl-8 space-y-3">
                        <li>Third-party service providers who assist us in delivering services, maintaining our platform, or analysing user data.</li>
                        <li>Partners or affiliates for the provision of specific services, promotions, or joint ventures.</li>
                        <li>Regulatory authorities, law enforcement agencies, or legal entities when required by law or to protect our rights and interests.</li>
                    </ul>
                    <p className="font-bold underline text-ink">We do not sell or lease your information to third parties for marketing purposes.</p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <section className="space-y-4">
                        <h2 className="text-3xl font-bold uppercase tracking-tight text-ink border-b-2 border-black pb-4">Cookies</h2>
                        <p className="text-base">
                            Yureka.Money uses cookies and similar tracking technologies to enhance your browsing experience, analyse site usage, and personalise content. You can manage your cookie preferences through your browser settings.
                        </p>
                    </section>
                    <section className="space-y-4">
                        <h2 className="text-3xl font-bold uppercase tracking-tight text-ink border-b-2 border-black pb-4">Security</h2>
                        <p className="text-base">
                            We take the security of your information seriously and implement reasonable measures to protect it from unauthorised access, alteration, or disclosure. However, please note that no method of transmission over the internet or electronic storage is 100% secure.
                        </p>
                    </section>
                </div>

                <section className="space-y-8">
                    <h2 className="text-3xl font-bold uppercase tracking-tight text-ink border-b-2 border-black pb-4">Data Retention</h2>
                    <p>
                        Yureka.Money deletes personal data upon a user’s request or in accordance with the retention timelines specified below. However, certain data may be retained by the company for legal or compliance purposes.
                    </p>
                    
                    <div className="overflow-x-auto border border-black/10">
                        <table className="w-full text-left text-sm md:text-base border-collapse">
                            <thead className="bg-[#111111] text-white">
                                <tr>
                                    <th className="p-4 uppercase tracking-widest text-[10px] font-bold">Data Category</th>
                                    <th className="p-4 uppercase tracking-widest text-[10px] font-bold">Retention Period</th>
                                    <th className="p-4 uppercase tracking-widest text-[10px] font-bold">Purpose / Deletion Trigger</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/10 bg-white">
                                <tr className="hover:bg-black/5 transition-colors">
                                    <td className="p-4 font-bold text-ink">Registration <span className="block font-normal text-xs text-ink/50 mt-1">(Name, Email, Phone)</span></td>
                                    <td className="p-4 italic">Account lifetime + 1 year</td>
                                    <td className="p-4 text-xs font-mono">Service delivery, fraud prevention<br/>Trigger: Account deletion/withdrawal</td>
                                </tr>
                                <tr className="hover:bg-black/5 transition-colors">
                                    <td className="p-4 font-bold text-ink">Transaction Data <span className="block font-normal text-xs text-ink/50 mt-1">(GVs, bills, rewards)</span></td>
                                    <td className="p-4 italic">7 years</td>
                                    <td className="p-4 text-xs font-mono">RBI/PMLA compliance, dispute resolution<br/>Trigger: End of legal hold</td>
                                </tr>
                                <tr className="hover:bg-black/5 transition-colors">
                                    <td className="p-4 font-bold text-ink">Usage Analytics <span className="block font-normal text-xs text-ink/50 mt-1">(Non-personal)</span></td>
                                    <td className="p-4 italic">2 years</td>
                                    <td className="p-4 text-xs font-mono">Service improvement<br/>Trigger: Automated purge</td>
                                </tr>
                                <tr className="hover:bg-black/5 transition-colors">
                                    <td className="p-4 font-bold text-ink">Logs & Events <span className="block font-normal text-xs text-ink/50 mt-1">(Security)</span></td>
                                    <td className="p-4 italic">1 year</td>
                                    <td className="p-4 text-xs font-mono">Breach investigation (DPDP Rule 6)<br/>Trigger: Annual cycle</td>
                                </tr>
                                <tr className="hover:bg-black/5 transition-colors">
                                    <td className="p-4 font-bold text-ink">KYC Documents <span className="block font-normal text-xs text-ink/50 mt-1">(Financial docs)</span></td>
                                    <td className="p-4 italic">10 years</td>
                                    <td className="p-4 text-xs font-mono">Regulatory audits<br/>Trigger: Requirement expiry</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="space-y-6">
                    <h2 className="text-3xl font-bold uppercase tracking-tight text-ink border-b-2 border-black pb-4">Consent Notice <span className="text-sm font-mono tracking-normal text-clay ml-2">Per DPDP Rule 3</span></h2>
                    <p>Yureka.Money processes your personal data (name, email, phone, transaction details, credit card usage) solely for:</p>
                    <ul className="list-disc pl-8 space-y-2">
                        <li>Reward optimization and bill payments (necessary for service delivery)</li>
                        <li>Fraud detection (legitimate use under DPDP)</li>
                        <li>Communications (with opt-out)</li>
                    </ul>
                    <p className="bg-white p-6 border border-black/10 italic text-base">
                        Consent is free, specific, informed, unconditional, and unambiguous. You may withdraw consent anytime without affecting prior lawful processing.
                    </p>
                    <div className="bg-black/5 p-6 md:p-8 rounded-sm">
                        <h4 className="font-bold uppercase tracking-widest text-sm mb-4">Withdrawal Process</h4>
                        <ul className="space-y-3 text-base">
                            <li className="flex items-start gap-3">
                                <span className="text-clay mt-1">1.</span>
                                <span>Email <a href="mailto:contact@Yureka.Money" className="text-clay underline font-bold">contact@Yureka.Money</a> with "Withdraw Consent - [Your Registered Email]"</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-clay mt-1">2.</span>
                                <span>Deletion request erases all data within 72 hours (except legal retention)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-clay mt-1">3.</span>
                                <span>Post-withdrawal, core services (transaction tracking) may be limited.</span>
                            </li>
                        </ul>
                    </div>
                </section>
                
                <section className="border-t-4 border-black pt-16 mt-16 text-center space-y-8">
                     <p className="text-sm md:text-base font-mono uppercase tracking-widest">
                         Governing Law: This Privacy Policy is governed by the Digital Personal Data Protection Act, 2023 ("DPDP Act"), Digital Personal Data Protection Rules, 2025 ("DPDP Rules"), and applicable provisions of the Information Technology Act, 2000. Yureka.Money, as a Data Fiduciary, complies with all obligations under Rule 3 (consent), Rule 6 (security safeguards), and Rule 13 (SDF requirements if applicable). SPDI Rules, 2011 stand repealed per DPDP notification dated November 14, 2025.
                     </p>
                     
                     <div className="pt-8">
                         <h3 className="text-2xl font-bold uppercase tracking-tight text-ink mb-4">Questions or Concerns?</h3>
                         <p className="italic text-ink/60 mb-6">If you have any questions, concerns, or requests regarding this Privacy Policy or your personal information, please contact us.</p>
                         <a href="mailto:contact@yureka.money" className="inline-flex items-center gap-2 bg-ink text-white px-8 py-4 uppercase font-bold tracking-[0.2em] text-xs hover:bg-clay hover:scale-105 transition-all">
                             Contact Privacy Officer <ChevronRight size={14} />
                         </a>
                     </div>
                </section>
            </div>
            
            <div className="max-w-4xl mx-auto px-6 mt-24 flex items-center justify-center gap-4 text-xs font-mono uppercase tracking-widest text-ink/30">
                <span>Brand Name: Yureka.Money</span>
                <span>•</span>
                <span>Company: Jupyter Network Technologies Pvt Ltd</span>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
