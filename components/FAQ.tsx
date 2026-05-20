import React, { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FAQQuestionProps {
  question: string;
  answer: string;
}

const FAQQuestion: React.FC<FAQQuestionProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-white/5 rounded-xl mb-3 overflow-hidden bg-white/[0.02] hover:bg-white/[0.05] transition-colors duration-300">
      <button 
        onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
        }}
        className="w-full flex items-center justify-between p-5 text-left group"
        aria-expanded={isOpen}
      >
        <span className="font-sans font-bold text-white pr-4 text-sm md:text-base group-hover:text-clay transition-colors uppercase tracking-tight">{question}</span>
        <motion.div 
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-clay shrink-0"
        >
           {isOpen ? <Minus size={16} /> : <Plus size={16} />}
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-5 pb-6 pt-0 text-xs md:text-sm text-white/70 font-sans leading-relaxed max-w-[95%]">
                {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const faqQuestions = [
  {
    q: "How does Yureka analyze my emails without compromising privacy?",
    a: "We use a limited, read-only Gmail integration that specifically scans for shopping invoices, receipts, and bank transaction statements. Our system never reads your personal messages, and we do not store or sell unrelated data. You can review and revoke access at any time."
  },
  {
    q: "Do I need to enter my credit card numbers?",
    a: "No. Yureka never asks for your CVV, full card numbers, or PINs. You only specify the cards you own (e.g., HDFC Infinia or SBI Cashback) so our recommendation engine knows what you have in your wallet."
  },
  {
    q: "What is a Reward IQ score?",
    a: "It’s a rating from 0 to 100 that measures how efficiently you use your cards, stack promotions, and redeem points. A higher score means you are extracting maximum value from your daily spends, while a lower score shows where you are leaving money on the table."
  },
  {
    q: "How does the Chrome Extension work?",
    a: "Once installed, the extension runs quietly in your browser. When you reach a checkout page on platforms like Amazon or Flipkart, it pops up to tell you exactly which card to pay with, or suggests buying a discounted gift card from our platform first to stack more value."
  },
  {
    q: "Are there any charges to use Yureka?",
    a: "Our core consumer features—including Reward IQ, Chrome Extension, and Yureka AI recommendations—are completely free for users. We make money by partnering with brands to offer discounted gift cards and by earning commission from banks when you choose to apply for a card through us."
  }
];

const FAQ: React.FC = () => {
  return (
    <section id="faq" className="py-16 md:py-24 bg-cream border-b border-white/10 relative overflow-hidden scroll-mt-32">
         {/* Background Texture */}
         <div className="absolute inset-0 pointer-events-none opacity-[0.05]" 
              style={{ backgroundImage: 'radial-gradient(#34d399 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }}>
         </div>

          <div className="max-w-6xl mx-auto relative z-10 text-white px-6 md:px-12 lg:px-16">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
                  
                  {/* Left Column */}
                  <div className="lg:col-span-5 lg:sticky lg:top-32">
                      <motion.div 
                         initial={{ opacity: 0, x: -30 }}
                         whileInView={{ opacity: 1, x: 0 }}
                         viewport={{ once: true }}
                         transition={{ duration: 0.8 }}
                         className="text-left mb-8"
                      >
                         <span className="block text-clay text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] mb-6">FAQs</span>
                         <h2 className="text-4xl md:text-5xl lg:text-[clamp(1.5rem,3.5vw,4rem)] font-heading font-black text-white mb-4 leading-[0.9] tracking-tighter uppercase">
                             Frequently <br className="hidden md:block" /> Asked Questions
                         </h2>
                      </motion.div>
                      <motion.p 
                         initial={{ opacity: 0 }}
                         whileInView={{ opacity: 0.7 }}
                         viewport={{ once: true }}
                         transition={{ delay: 0.4, duration: 1 }}
                         className="text-xs md:text-sm lg:text-base text-white/80 max-w-md border-l-2 border-clay pl-6 leading-relaxed"
                      >
                          Navigating the world of credit rewards shouldn't be a mystery. We've clarified the most common queries about Yureka.
                      </motion.p>
                  </div>

                  {/* Right Column */}
                  <div className="lg:col-span-7 w-full space-y-4">
                      {faqQuestions.map((item, idx) => (
                           <FAQQuestion 
                             key={idx} 
                             question={item.q} 
                             answer={item.a} 
                           />
                      ))}
                  </div>

              </div>
          </div>
    </section>
  );
};

export default FAQ;