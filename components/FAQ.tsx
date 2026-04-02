import React, { useState } from 'react';
import { Plus, Minus, LayoutGrid, Rocket, ShieldCheck, Gift, HelpCircle } from 'lucide-react';

// --- Level 3: Individual Question & Answer ---
interface FAQQuestionProps {
  question: string;
  answer: string;
}

const FAQQuestion: React.FC<FAQQuestionProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-black/5 rounded-xl mb-3 overflow-hidden bg-white/40 hover:bg-white/60 transition-colors duration-300">
      <button 
        onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
        }}
        className="w-full flex items-center justify-between p-4 text-left group"
        aria-expanded={isOpen}
      >
        <span className="font-sans font-medium text-ink pr-4 text-base md:text-lg group-hover:text-teal transition-colors">{question}</span>
        <div className={`text-teal transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
           {isOpen ? <Minus size={20} /> : <Plus size={20} />}
        </div>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-4 pb-6 pt-0 text-sm md:text-base text-ink/70 font-serif leading-relaxed max-w-[90%]">
            {answer}
        </div>
      </div>
    </div>
  );
};

// --- Level 2: Category Container ---
interface FAQCategoryProps {
  icon: any;
  title: string;
  questions: { q: string; a: string }[];
}

const FAQCategory: React.FC<FAQCategoryProps> = ({ icon: Icon, title, questions }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`glass-panel rounded-3xl transition-all duration-500 overflow-hidden mb-6 ${isOpen ? 'shadow-xl ring-1 ring-teal/20' : 'shadow-sm hover:shadow-md'}`}>
      
      {/* Category Header */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 md:p-8 text-left"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-6">
           <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-300 shrink-0 ${isOpen ? 'bg-teal text-white' : 'bg-teal/10 text-teal'}`}>
               <Icon size={24} strokeWidth={1.5} />
           </div>
           <span className="font-serif font-bold text-xl md:text-2xl text-ink">{title}</span>
        </div>
        <div className={`text-teal transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
           {isOpen ? <Minus size={28} /> : <Plus size={28} />}
        </div>
      </button>
      
      {/* Questions List */}
      <div 
        className={`overflow-hidden transition-all duration-700 ease-in-out ${isOpen ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="p-6 md:p-8 pt-0">
             {questions.map((q, idx) => (
                 <FAQQuestion key={idx} question={q.q} answer={q.a} />
             ))}
        </div>
      </div>
    </div>
  );
};

// --- Data (SEO Optimized for "People Also Ask") ---
const faqData = [
    {
        title: "About Yureka.money",
        icon: LayoutGrid,
        questions: [
            { q: "How is Yureka.money different from other card comparison sites?", a: "Yureka.money is not just a comparison site. We are an AI-driven matching engine. We analyze 200+ cards in real-time based on your specific spending patterns, salary, and lifestyle to find the one that maximizes your rewards. No ads, no bias, just the best card for you." },
            { q: "Is Yureka.money really free?", a: "Yes, completely. We do not charge users for our matching service or our Chrome extension. We earn a small fee from banks when you successfully apply for a card through our platform, allowing us to keep the service free for you." },
            { q: "What is 'Yureka AI'?", a: "Yureka AI is our conversational assistant that helps you navigate the complex world of credit cards. You can ask it questions like 'Which card gives me the most cashback on Swiggy?' or 'Is the Axis Magnus worth the annual fee for my spends?'" }
        ]
    },
    {
        title: "The Matching Process",
        icon: Rocket,
        questions: [
            { q: "How accurate are the reward projections?", a: "Our projections are based on real-world spending data and the latest reward structures of 200+ cards. While individual results may vary, our average user sees a ₹15,000 increase in annual rewards by switching to their Yureka-matched card." },
            { q: "Do I need to share my bank statements?", a: "No. You can manually input your average monthly spends across categories like groceries, travel, and dining. Our AI uses this to calculate the best match without needing access to your private bank data." }
        ]
    },
    {
        title: "Yureka+ Chrome Extension",
        icon: ShieldCheck,
        questions: [
            { q: "What does the Yureka+ extension do?", a: "Yureka+ sits in your browser and automatically suggests the best card to use at checkout on sites like Amazon, Flipkart, and Myntra. It ensures you never miss out on a 5% or 10% discount again." },
            { q: "Is the extension safe to use?", a: "Absolutely. Yureka+ does not see your card numbers or CVV. it only identifies the merchant you are shopping at and cross-references it with your card portfolio to suggest the best one for rewards." }
        ]
    },
    {
        title: "Rewards & Savings",
        icon: Gift,
        questions: [
            { q: "What is the Voucher Hub?", a: "The Voucher Hub is a feature within Yureka where you can buy discounted gift cards for 500+ brands. It's an easy way to save an extra 2-10% on your regular spends, on top of your credit card rewards." },
            { q: "How do I track my rewards?", a: "The Yureka app provides a unified dashboard where you can see the projected and actual rewards earned across all your cards, helping you stay on top of your financial goals." }
        ]
    },
    {
        title: "Support & Debt Help",
        icon: HelpCircle,
        questions: [
            { q: "What is NPA Settlement help?", a: "If you are struggling with credit card debt, our experts can help you negotiate a settlement with banks. We aim to help you clear your dues and rebuild your credit score over time." },
            { q: "How do I contact Yureka support?", a: "You can reach us 24/7 via the 'AI Magic' chat in the app or email us at support@yureka.money. Our team is always here to help you optimize your credit life." }
        ]
    }
];

// --- Main Layout ---
const FAQ: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-cream border-b border-black/10 relative overflow-hidden">
         {/* Background Texture for Glassmorphism Context */}
         <div className="absolute inset-0 pointer-events-none opacity-30" 
              style={{ backgroundImage: 'radial-gradient(#1A5F54 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }}>
         </div>

         <div className="max-w-[1440px] mx-auto px-6 relative z-10">
             
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
                 
                 {/* Left Column: Sticky Header with SEO Keywords */}
                 <div className="lg:col-span-5 lg:sticky lg:top-32">
                     <div className="text-left mb-8">
                        <span className="block text-teal text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-4 animate-fade-in-up">Help & Support</span>
                        <h2 className="text-4xl md:text-7xl font-serif font-bold text-ink mb-4 leading-[0.9] animate-fade-in-up">
                            Frequently Asked <br className="hidden md:block" /> Questions
                        </h2>
                        <h3 className="text-4xl md:text-7xl font-serif font-bold text-ink leading-[0.9] animate-fade-in-up delay-100">
                            We've <span className="text-teal">Got Answers.</span>
                        </h3>
                     </div>
                     <p className="text-base md:text-lg text-ink/70 font-serif italic max-w-md animate-fade-in-up delay-200">
                         Everything you need to know about AI-driven card matching, our zero-fee policy, and the Yureka.money ecosystem.
                     </p>
                 </div>

                 {/* Right Column: Glassmorphism Accordions */}
                 <div className="lg:col-span-7 w-full animate-fade-in-up delay-300">
                     {faqData.map((category, idx) => (
                          <FAQCategory 
                            key={idx} 
                            icon={category.icon} 
                            title={category.title} 
                            questions={category.questions} 
                          />
                     ))}
                 </div>

             </div>
         </div>
    </section>
  );
};

export default FAQ;