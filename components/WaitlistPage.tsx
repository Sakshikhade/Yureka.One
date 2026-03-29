import React, { useState } from 'react';
import { ArrowLeft, User, Building, Check, ArrowRight, Plus, Minus, LayoutGrid, Rocket, ShieldCheck, Gift, Sparkles, HelpCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { joinWaitlist } from '../services/firebaseService';

interface FAQItemProps {
  icon: React.ElementType;
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ icon: Icon, question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen ? 'border-teal shadow-md' : 'border-black/5 shadow-sm'}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left group"
      >
        <div className="flex items-center gap-4">
           <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 shrink-0 ${isOpen ? 'bg-teal text-white' : 'bg-[#E0F2F1] text-teal'}`}>
               <Icon size={20} strokeWidth={2} />
           </div>
           <span className="font-sans font-bold text-lg text-black">{question}</span>
        </div>
        <div className={`text-teal transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          {isOpen ? <Minus size={24} /> : <Plus size={24} />}
        </div>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-5 pb-8 pl-[5rem] pr-8">
            <div className="w-full h-px bg-black/5 mb-4"></div>
            <p className="text-black/60 text-sm leading-relaxed font-serif">{answer}</p>
        </div>
      </div>
    </div>
  );
};

const faqs = [
    { 
        category: "General", 
        icon: LayoutGrid, 
        question: "What is Jupyter.credit?",
        answer: "Jupyter.credit is an AI-driven credit card platform. We help you find the perfect card from 200+ options based on your spending, salary, and lifestyle. No ads, no fees." 
    },
    { 
        category: "Getting Started", 
        icon: Rocket, 
        question: "How does the VIP waitlist work?",
        answer: "Joining the VIP waitlist gives you early access to our MVP rollout, exclusive rewards, and priority support. We're launching in Q2 2026." 
    },
    { 
        category: "Payments & Security", 
        icon: ShieldCheck, 
        question: "Is my data safe?",
        answer: "Absolutely. We use bank-grade encryption and do not sell or share your personal or financial data. Your privacy is our top priority." 
    },
    { 
        category: "Rewards", 
        icon: Gift, 
        question: "How much can I save with Jupyter?",
        answer: "The average user earns ₹15,000 more in rewards per year by switching to their Jupyter-matched card. Some users save up to ₹30,000!" 
    },
    { 
        category: "AI Magic", 
        icon: Sparkles, 
        question: "What is Jupyter AI?",
        answer: "Jupyter AI is our conversational assistant that helps you find the best card and provides personalized financial advice based on your goals." 
    },
    { 
        category: "Support", 
        icon: HelpCircle, 
        question: "How do I contact support?",
        answer: "You can reach us 24/7 via the 'AI Magic' chat in the app or email us at support@jupyter.credit." 
    }
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
            phone: '', // Optional
            role: role,
            category: role === 'user' ? formData.category : undefined,
            company: role === 'partner' ? formData.company : undefined
        } as any);
        setIsSuccess(true);
    } catch (err) {
        setError("Something went wrong. Please try again.");
    } finally {
        setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
        <div className="min-h-screen bg-cream pt-32 pb-20 px-4 md:px-8 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-teal text-white rounded-full flex items-center justify-center mb-8 animate-bounce">
                <Check size={40} />
            </div>
            <h1 className="text-4xl md:text-6xl font-serif text-black mb-4">You're on the list!</h1>
            <p className="text-xl font-serif italic text-black/60 mb-12 max-w-lg mx-auto">
                Welcome to the inner circle. We'll reach out as soon as we're ready to launch.
            </p>
            <Link to="/" className="bg-black text-white px-10 py-4 text-xs font-bold uppercase tracking-widest hover:bg-clay transition-colors rounded-full shadow-lg">
                Back to Home
            </Link>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pt-32 pb-20 px-4 md:px-8 flex flex-col items-center relative">
         
         {/* Background Grid */}
         <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
              style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
         </div>

         {/* Form Section */}
         <div className="w-full max-w-3xl relative z-10 glass-panel shadow-2xl p-8 md:p-12 rounded-xl border border-ink/10 mb-24">
             
             <div className="border-b-2 border-black pb-6 mb-8 flex justify-between items-start">
                 <div>
                    <h1 className="text-2xl md:text-3xl font-serif text-black mb-2">VIP Access Form</h1>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-black/40">Ref: Early Access Request</p>
                 </div>
                 <Link to="/" className="text-[10px] font-bold uppercase tracking-widest border border-black/20 px-4 py-2 hover:bg-black hover:text-white transition-colors text-black rounded-full">
                     Cancel
                 </Link>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-black/10 mb-8 rounded-lg overflow-hidden">
                 <button 
                    onClick={() => setRole('user')}
                    className={`
                        p-6 text-left border-b md:border-b-0 md:border-r border-black/10 hover:bg-clay hover:text-white transition-colors
                        ${role === 'user' ? 'bg-clay text-white' : 'text-black'}
                    `}
                 >
                     <div className="flex justify-between items-center mb-4">
                        <User size={24} />
                        {role === 'user' && <Check size={20} />}
                     </div>
                     <h3 className="text-xl font-serif font-bold mb-1">User</h3>
                     <p className="text-xs uppercase tracking-wider opacity-60">I want the best card</p>
                 </button>

                 <button 
                    onClick={() => setRole('partner')}
                    className={`
                        p-6 text-left hover:bg-clay hover:text-white transition-colors
                        ${role === 'partner' ? 'bg-clay text-white' : 'text-black'}
                    `}
                 >
                     <div className="flex justify-between items-center mb-4">
                        <Building size={24} />
                        {role === 'partner' && <Check size={20} />}
                     </div>
                     <h3 className="text-xl font-serif font-bold mb-1">Partner</h3>
                     <p className="text-xs uppercase tracking-wider opacity-60">I want to collaborate</p>
                 </button>
             </div>

             {role && (
                 <div className="animate-fade-in-up">
                     <form className="space-y-0 border border-black/10 rounded-lg overflow-hidden" onSubmit={handleSubmit}>
                         <div className="grid grid-cols-1 md:grid-cols-2">
                             <div className="border-b md:border-b-0 md:border-r border-black/10 p-4">
                                 <label className="block text-[10px] font-bold text-black/40 uppercase tracking-widest mb-2">First Name</label>
                                 <input 
                                   type="text" 
                                   required
                                   value={formData.firstName}
                                   onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                   className="w-full bg-transparent border-b border-black/20 text-black py-2 focus:outline-none focus:border-black transition-colors" 
                                   placeholder="Jane" 
                                 />
                             </div>
                             <div className="p-4 border-b border-black/10 md:border-b-0">
                                 <label className="block text-[10px] font-bold text-black/40 uppercase tracking-widest mb-2">Last Name</label>
                                 <input 
                                   type="text" 
                                   value={formData.lastName}
                                   onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                   className="w-full bg-transparent border-b border-black/20 text-black py-2 focus:outline-none focus:border-black transition-colors" 
                                   placeholder="Doe" 
                                 />
                             </div>
                         </div>
                         
                         <div className="p-4 border-t border-black/10">
                             <label className="block text-[10px] font-bold text-black/40 uppercase tracking-widest mb-2">Email Address</label>
                             <input 
                               type="email" 
                               required
                               value={formData.email}
                               onChange={(e) => setFormData({...formData, email: e.target.value})}
                               className="w-full bg-transparent border-b border-black/20 text-black py-2 focus:outline-none focus:border-black transition-colors" 
                               placeholder="jane@example.com" 
                             />
                         </div>

                         {role === 'user' ? (
                             <div className="p-4 border-t border-black/10">
                                 <label className="block text-[10px] font-bold text-black/40 uppercase tracking-widest mb-2">Primary Spending Category</label>
                                 <select 
                                   value={formData.category}
                                   onChange={(e) => setFormData({...formData, category: e.target.value})}
                                   className="w-full bg-transparent border-b border-black/20 text-black py-2 focus:outline-none focus:border-black transition-colors appearance-none rounded-none"
                                 >
                                     <option className="bg-white">Travel</option>
                                     <option className="bg-white">Dining & Food</option>
                                     <option className="bg-white">Shopping</option>
                                     <option className="bg-white">Fuel</option>
                                 </select>
                             </div>
                         ) : (
                            <div className="p-4 border-t border-black/10">
                                 <label className="block text-[10px] font-bold text-black/40 uppercase tracking-widest mb-2">Company Name</label>
                                 <input 
                                   type="text" 
                                   required
                                   value={formData.company}
                                   onChange={(e) => setFormData({...formData, company: e.target.value})}
                                   className="w-full bg-transparent border-b border-black/20 text-black py-2 focus:outline-none focus:border-black transition-colors" 
                                   placeholder="Acme Corp" 
                                 />
                            </div>
                         )}
                     </form>
                     
                     {error && (
                         <div className="mt-4 text-red-500 text-xs font-bold uppercase tracking-widest text-center">
                             {error}
                         </div>
                     )}

                     <div className="mt-8 flex justify-end">
                        <button 
                           onClick={handleSubmit}
                           disabled={isSubmitting}
                           className="bg-clay text-white px-10 py-4 text-xs font-bold uppercase tracking-widest hover:bg-teal transition-colors flex items-center gap-2 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                             {isSubmitting ? (
                                 <>Joining... <Loader2 size={16} className="animate-spin" /></>
                             ) : (
                                 <>Join VIP Waitlist <ArrowRight size={16} /></>
                             )}
                        </button>
                     </div>
                 </div>
             )}
         </div>

         {/* FAQ Section */}
         <div className="w-full max-w-3xl relative z-10 mb-24">
             <div className="text-left md:text-center mb-12 px-2">
                 <h2 className="text-2xl md:text-3xl font-serif font-bold text-black mb-2 leading-tight">
                     Got questions?
                 </h2>
                 <h2 className="text-2xl md:text-3xl font-serif font-bold text-black leading-tight">
                     We've <span className="text-teal">got them answered!</span>
                 </h2>
             </div>
             
             <div className="space-y-4">
                 {faqs.map((faq, idx) => (
                      <FAQItem key={idx} icon={faq.icon} question={faq.question} answer={faq.answer} />
                 ))}
             </div>
         </div>

    </div>
  );
};

export default WaitlistPage;