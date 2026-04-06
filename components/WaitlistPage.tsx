import React, { useState } from 'react';
import { ArrowLeft, User, Building, Check, ArrowRight, Plus, Minus, LayoutGrid, Rocket, ShieldCheck, Gift, Sparkles, HelpCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { joinWaitlist } from '../services/supabaseService';

interface FAQItemProps {
  icon: React.ElementType;
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ icon: Icon, question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`bg-white/40 backdrop-blur-md rounded-3xl border transition-all duration-500 overflow-hidden ${isOpen ? 'border-clay/40 shadow-xl scale-[1.01]' : 'border-ink/5 shadow-sm'}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 md:p-8 text-left group"
      >
        <div className="flex items-center gap-6">
           <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shrink-0 ${isOpen ? 'bg-clay text-white rotate-6 shadow-xl' : 'bg-cream text-clay border border-ink/5'}`}>
               <Icon size={24} strokeWidth={1.5} />
           </div>
           <span className="font-serif italic text-xl md:text-2xl text-ink tracking-tight group-hover:text-clay transition-colors">{question}</span>
        </div>
        <div className={`text-clay/40 transition-all duration-500 transform ${isOpen ? 'rotate-180 text-clay' : ''}`}>
          {isOpen ? <Minus size={28} strokeWidth={1} /> : <Plus size={28} strokeWidth={1} />}
        </div>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-8 pb-10 pl-16 md:pl-[6.5rem] pr-12">
            <div className="w-full h-px bg-ink/5 mb-8"></div>
            <p className="text-ink/60 text-lg leading-relaxed font-serif italic">{answer}</p>
        </div>
      </div>
    </div>
  );
};

const faqs = [
    { category: "General", icon: LayoutGrid, question: "What is Yureka.money?", answer: "Yureka.money is an AI-driven credit card ecosystem. We help you find the perfect cards from 200+ options based on your unique spending DNA. No ads, no bias, just pure optimization." },
    { category: "Getting Started", icon: Rocket, question: "How does the VIP waitlist work?", answer: "Joining the VIP waitlist gives you priority access to our upcoming release, exclusive rewards, and a founding member status. We're launching in Q2 2026." },
    { category: "Data Fidelity", icon: ShieldCheck, question: "Is my data secure?", answer: "Security is non-negotiable. We use industrial-grade encryption and will never sell your personal information. Your wallet, your rules." },
    { category: "Savings", icon: Gift, question: "How much can I actually save?", answer: "Our pilot users see an average of ₹15,000 to ₹30,000 in additional annual rewards by optimizing just two key cards in their rotation." }
];

const WaitlistPage: React.FC = () => {
  const [role, setRole] = useState<'user' | 'partner' | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    category: 'Travel',
    company: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.firstName) {
        setError("Please fill in all required fields.");
        return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
        await joinWaitlist({
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: '', 
            role: role,
            category: role === 'user' ? formData.category : undefined,
            company: role === 'partner' ? formData.company : undefined
        } as any);
        setIsSuccess(true);
    } catch (err) {
        setError("Network error. Please try again.");
    } finally {
        setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
        <div className="min-h-screen bg-cream pt-4 md:pt-8 pb-20 px-6 flex flex-col items-center justify-center text-center font-serif">
            <div className="w-24 h-24 bg-clay text-white rounded-full flex items-center justify-center mb-10 shadow-2xl animate-pulse">
                <Check size={48} strokeWidth={1.5} />
            </div>
            <h1 className="text-5xl md:text-8xl italic tracking-tighter text-ink mb-6">Confirmed.</h1>
            <p className="text-xl md:text-2xl text-ink/40 mb-16 max-w-xl mx-auto leading-relaxed">
                You've been added to the inner circle. Expect an invite as we begin our phased rollout.
            </p>
            <Link to="/" className="bg-ink text-white px-12 py-5 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-clay transition-all rounded-full shadow-2xl hover:scale-105 active:scale-95">
                Back to Archive
            </Link>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pt-4 md:pt-8 pb-32 px-6 overflow-hidden font-serif selection:bg-clay/20">
         
         {/* Minimalist Grid Pattern */}
         <div className="fixed inset-0 pointer-events-none opacity-[0.02]" 
              style={{ backgroundImage: 'radial-gradient(#1A1A1A 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
         </div>

         {/* Form Section */}
         <div className="w-full max-w-4xl mx-auto relative z-10 transition-all duration-1000">
             
             <div className="text-center mb-20">
                <p className="text-clay font-bold text-[10px] uppercase tracking-[0.6em] mb-6">Join the ecosystem</p>
                <h1 className="text-6xl md:text-8xl italic tracking-tighter text-ink leading-tight mb-4">The VIP Waitlist</h1>
                <p className="text-ink/40 text-lg md:text-xl italic max-w-xl mx-auto">Founding membership for the next generation of credit card mastery.</p>
             </div>

             <div className="relative group">
                 {/* Decorative background border */}
                 <div className="absolute inset-0 bg-clay/5 rounded-[3rem] -m-2 blur-2xl group-hover:m-[-3rem] transition-all duration-1000 opacity-50"></div>
                 
                 <div className="relative bg-white/60 backdrop-blur-2xl p-10 md:p-16 rounded-[3rem] border border-ink/5 shadow-2xl">
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                         <button 
                            onClick={() => setRole('user')}
                            className={`group/role p-8 rounded-3xl border-2 transition-all duration-500 text-left ${role === 'user' ? 'bg-ink border-ink text-white shadow-2xl scale-[1.02]' : 'bg-cream/40 border-ink/5 text-ink/40 hover:border-clay/20 hover:text-ink'}`}
                         >
                             <div className="flex justify-between items-start mb-10">
                                <User size={32} strokeWidth={1} className={role === 'user' ? 'text-clay' : 'text-ink/20 group-hover/role:text-clay/60'} />
                                {role === 'user' && <Check size={20} className="text-clay" />}
                             </div>
                             <h3 className="text-2xl italic tracking-tight mb-2">Member</h3>
                             <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">Access to matching engine</p>
                         </button>

                         <button 
                            onClick={() => setRole('partner')}
                            className={`group/role p-8 rounded-3xl border-2 transition-all duration-500 text-left ${role === 'partner' ? 'bg-ink border-ink text-white shadow-2xl scale-[1.02]' : 'bg-cream/40 border-ink/5 text-ink/40 hover:border-clay/20 hover:text-ink'}`}
                         >
                             <div className="flex justify-between items-start mb-10">
                                <Building size={32} strokeWidth={1} className={role === 'partner' ? 'text-clay' : 'text-ink/20 group-hover/role:text-clay/60'} />
                                {role === 'partner' && <Check size={20} className="text-clay" />}
                             </div>
                             <h3 className="text-2xl italic tracking-tight mb-2">Partner</h3>
                             <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">Insights & Collaborations</p>
                         </button>
                     </div>

                     {role && (
                         <div className="space-y-12 animate-fade-in">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                 <div className="space-y-2">
                                     <label className="text-[10px] font-bold text-ink/20 uppercase tracking-[0.4em]">First Identity</label>
                                     <input 
                                       type="text" required placeholder="Jane"
                                       value={formData.firstName}
                                       onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                       className="w-full bg-transparent border-b border-ink/10 py-4 text-2xl font-serif text-ink outline-none focus:border-clay transition-all italic"
                                     />
                                 </div>
                                 <div className="space-y-2">
                                     <label className="text-[10px] font-bold text-ink/20 uppercase tracking-[0.4em]">Last Identity</label>
                                     <input 
                                       type="text" placeholder="Doe"
                                       value={formData.lastName}
                                       onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                       className="w-full bg-transparent border-b border-ink/10 py-4 text-2xl font-serif text-ink outline-none focus:border-clay transition-all italic"
                                     />
                                 </div>
                             </div>

                             <div className="space-y-2">
                                 <label className="text-[10px] font-bold text-ink/20 uppercase tracking-[0.4em]">Digital Address (Email)</label>
                                 <input 
                                   type="email" required placeholder="jane@journal.com"
                                   value={formData.email}
                                   onChange={(e) => setFormData({...formData, email: e.target.value})}
                                   className="w-full bg-transparent border-b border-ink/10 py-4 text-2xl font-serif text-ink outline-none focus:border-clay transition-all italic"
                                 />
                             </div>

                             {role === 'user' ? (
                                 <div className="space-y-4">
                                     <label className="text-[10px] font-bold text-ink/20 uppercase tracking-[0.4em]">Primary Interest</label>
                                     <div className="flex flex-wrap gap-3">
                                         {['Travel', 'Dining', 'Shopping', 'Business'].map(cat => (
                                             <button 
                                                key={cat}
                                                type="button"
                                                onClick={() => setFormData({...formData, category: cat})}
                                                className={`px-8 py-3 rounded-full border text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${formData.category === cat ? 'bg-clay border-clay text-white' : 'bg-transparent border-ink/10 text-ink/40 hover:border-ink/20'}`}
                                             >
                                                 {cat}
                                             </button>
                                         ))}
                                     </div>
                                 </div>
                             ) : (
                                 <div className="space-y-2">
                                     <label className="text-[10px] font-bold text-ink/20 uppercase tracking-[0.4em]">Organization</label>
                                     <input 
                                       type="text" required placeholder="Foundry Inc."
                                       value={formData.company}
                                       onChange={(e) => setFormData({...formData, company: e.target.value})}
                                       className="w-full bg-transparent border-b border-ink/10 py-4 text-2xl font-serif text-ink outline-none focus:border-clay transition-all italic"
                                     />
                                 </div>
                             )}

                             {error && <p className="text-clay text-[10px] font-bold uppercase tracking-widest text-center">{error}</p>}

                             <button 
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="w-full bg-ink text-white py-6 rounded-2xl flex items-center justify-center gap-6 group hover:bg-clay transition-all duration-700 shadow-2xl active:scale-95 disabled:opacity-50"
                             >
                                 <span className="text-[10px] font-bold uppercase tracking-[0.6em]">{isSubmitting ? 'Processing...' : 'Reserve Access'}</span>
                                 {!isSubmitting && <ArrowRight size={20} className="group-hover:translate-x-3 transition-transform duration-700" />}
                             </button>
                         </div>
                     )}
                 </div>
             </div>
         </div>

         {/* FAQ Section */}
         <div className="w-full max-w-4xl mx-auto mt-40">
             <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 px-6">
                <div className="max-w-md">
                    <p className="text-clay font-bold text-[10px] uppercase tracking-[0.6em] mb-4">Support Hub</p>
                    <h2 className="text-4xl md:text-5xl italic tracking-tighter text-ink leading-none">Frequently asked inquiries.</h2>
                </div>
                <p className="text-ink/40 text-sm italic md:text-right max-w-[200px]">Everything you need to know about joining the inner circle.</p>
             </div>
             
             <div className="space-y-6">
                 {faqs.map((faq, idx) => (
                      <FAQItem key={idx} icon={faq.icon} question={faq.question} answer={faq.answer} />
                  ))}
             </div>
         </div>

    </div>
  );
};

export default WaitlistPage;