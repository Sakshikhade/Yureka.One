import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ArrowUpRight, ChevronDown, Check, Zap, CreditCard as CardIcon, Gift, ShieldCheck, Plane } from 'lucide-react';
import ImageWithLoader from './ImageWithLoader';
import { getCards } from '../services/firebaseService';
import { Card } from '../types';

// --- Filter Components ---

const FilterPill = ({ label, value, options, onChange }: { label: string, value: string, options: string[], onChange: (val: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
            h-10 px-4 flex items-center gap-2 transition-all duration-300 border text-xs font-bold uppercase tracking-wider rounded-full shadow-sm hover:shadow-md
            ${isOpen || (value !== 'Any Category' && value !== 'All Issuers')
                ? 'bg-black text-white border-black' 
                : 'bg-white text-black border-black/10 hover:border-black/30'
            }
        `}
      >
        <span>{value === 'Any Category' || value === 'All Issuers' ? label : value}</span>
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 min-w-[200px] bg-white border border-black/10 rounded-xl shadow-xl z-50 animate-fade-in-up overflow-hidden p-1">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setIsOpen(false); }}
              className="w-full text-left px-4 py-3 hover:bg-black/5 text-black/70 hover:text-black text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all rounded-lg"
            >
              {opt}
              {value === opt && <Check size={14} className="text-teal" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const TogglePill = ({ label, isActive, onClick, icon }: { label: string, isActive: boolean, onClick: () => void, icon?: React.ReactNode }) => {
    return (
        <button
            onClick={onClick}
            className={`
                h-10 px-4 flex items-center gap-2 transition-all duration-300 border text-xs font-bold uppercase tracking-wider rounded-full shadow-sm hover:shadow-md
                ${isActive 
                    ? 'bg-black border-black text-white' 
                    : 'bg-white border-black/10 text-black hover:border-black/30'
                }
            `}
        >
            {icon && <span className={isActive ? 'text-white' : 'text-black/60'}>{icon}</span>}
            <span>{label}</span>
        </button>
    )
}

// --- Main Component ---

const AllHomes: React.FC = () => {
  const [cardsList, setCardsList] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState('Any Category');
  const [issuer, setIssuer] = useState('All Issuers');
  const [noAnnualFee, setNoAnnualFee] = useState(false);
  const [highRewards, setHighRewards] = useState(false);
  const [loungeAccess, setLoungeAccess] = useState(false);
  const [lifetimeFree, setLifetimeFree] = useState(false);

  useEffect(() => {
    const unsubscribe = getCards((fetchedCards) => {
        setCardsList(fetchedCards);
        setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const issuers = useMemo(() => {
      const iss = new Set(cardsList.map(c => c.issuer));
      return ['All Issuers', ...Array.from(iss).sort()];
  }, [cardsList]);

  const categoryOptions = ['Any Category', 'Travel', 'Cashback', 'Shopping', 'Dining', 'Fuel'];

  const filteredCards = useMemo(() => {
    return cardsList.filter(card => {
        if (issuer !== 'All Issuers' && card.issuer !== issuer) return false;
        if (category !== 'Any Category' && card.category !== category) return false;
        
        if (noAnnualFee && card.annualFee !== '₹0' && card.annualFee !== 'Free' && !card.annualFee.toLowerCase().includes('free')) return false;
        
        if (highRewards) {
            const rate = parseFloat(card.rewardsRate.replace(/[^0-9.]/g, ''));
            if (isNaN(rate) || rate < 5) return false;
        }

        if (loungeAccess) {
            const hasLounge = card.features?.some(f => f.toLowerCase().includes('lounge')) || card.category === 'Luxury Travel';
            if (!hasLounge) return false;
        }

        if (lifetimeFree) {
            const isFree = card.annualFee.toLowerCase().includes('lifetime free') || card.annualFee === 'Free';
            if (!isFree) return false;
        }

        return true;
    });
  }, [cardsList, category, issuer, noAnnualFee, highRewards, loungeAccess, lifetimeFree]);

  if (isLoading) {
    return (
        <div className="min-h-screen bg-cream flex items-center justify-center">
            <div className="text-2xl font-serif italic animate-pulse">Loading Explorer...</div>
        </div>
    );
  }

  return (
    <div className="pt-24 pb-20 px-4 md:px-8 max-w-[1440px] mx-auto min-h-screen">
       
       <div className="text-center mb-10 border-b-2 border-ink pb-8">
           <h1 className="text-4xl md:text-6xl font-serif text-ink mb-2 tracking-tight">
               Card Explorer
           </h1>
           <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-ink/40">The Catalog • Vol. 01</p>
       </div>

       {/* Sticky Filter Bar - Floating Glass Island Style */}
       <div className="sticky top-28 z-40 mb-12 flex justify-center pointer-events-none">
            <div className="bg-white/90 backdrop-blur-md border border-black/10 rounded-full px-2 py-2 flex justify-center items-center gap-2 flex-wrap shadow-xl pointer-events-auto max-w-full overflow-x-auto no-scrollbar">
                <div className="flex items-center px-4 shrink-0">
                    <span className="text-xs font-serif italic text-ink/50">Filter:</span>
                </div>
                <div className="h-6 w-px bg-ink/10 hidden md:block shrink-0"></div>
                <FilterPill label="Issuer" value={issuer} options={issuers} onChange={setIssuer} />
                <FilterPill label="Category" value={category} options={categoryOptions} onChange={setCategory} />
                <div className="w-px h-6 bg-ink/10 mx-1 hidden md:block shrink-0"></div>
                <TogglePill label="No Annual Fee" isActive={noAnnualFee} onClick={() => setNoAnnualFee(!noAnnualFee)} />
                <TogglePill label="High Rewards" isActive={highRewards} onClick={() => setHighRewards(!highRewards)} icon={<Zap size={12} className={highRewards ? "fill-white" : ""} />} />
                <TogglePill label="Lounge Access" isActive={loungeAccess} onClick={() => setLoungeAccess(!loungeAccess)} icon={<Plane size={12} />} />
                <TogglePill label="Lifetime Free" isActive={lifetimeFree} onClick={() => setLifetimeFree(!lifetimeFree)} icon={<ShieldCheck size={12} />} />
            </div>
       </div>

       <div className="flex justify-between items-end mb-8 px-2 pb-2 border-b border-ink/10">
            <h2 className="text-ink text-lg font-serif italic">Displaying {filteredCards.length} Credit Cards</h2>
       </div>

       {filteredCards.length > 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-ink/10">
              {filteredCards.map(card => (
                 <div 
                    key={card.id} 
                    className="group border-r border-b border-ink/10 bg-paper hover:bg-[#F5F5F0] transition-colors p-6 flex flex-col h-full"
                 >
                    <div className="relative aspect-[4/3] overflow-hidden mb-6 border border-ink/10 p-1 bg-white shadow-sm shrink-0">
                        <div className="w-full h-full relative overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                             <ImageWithLoader 
                                src={card.image} 
                                alt={card.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-xl font-serif text-ink leading-none">{card.name}</h3>
                                <div className="text-[10px] font-bold uppercase tracking-widest border border-ink/20 px-2 py-1 text-ink/60 rounded-sm whitespace-nowrap">
                                    {card.issuer}
                                </div>
                            </div>
                            
                            <div className="flex gap-4 text-ink/60 text-xs font-mono uppercase tracking-wider mb-6 border-b border-ink/10 pb-4">
                                <span className="flex items-center gap-1.5"><CardIcon size={12} /> {card.category}</span>
                                <span className="flex items-center gap-1.5"><Gift size={12} /> {card.rewardsRate}</span>
                            </div>

                            <div className="flex items-center gap-2 w-full mb-4">
                                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${card.annualFee === '₹0' || card.annualFee === 'Free' || card.annualFee.toLowerCase().includes('lifetime free') ? 'bg-teal' : 'bg-ink/40'}`}></div>
                                <span className={`text-xs font-bold uppercase tracking-widest truncate ${card.annualFee === '₹0' || card.annualFee === 'Free' || card.annualFee.toLowerCase().includes('lifetime free') ? 'text-teal' : 'text-ink/40'}`}>
                                    Annual Fee: {card.annualFee}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-between items-end pt-4 mt-auto">
                            <div>
                                <p className="text-[10px] text-ink/30 font-bold uppercase tracking-widest mb-1">Projected Savings</p>
                                <h4 className="text-2xl font-serif text-ink">{card.projectedSavings}</h4>
                            </div>
                            <button className="border border-ink/20 hover:bg-black hover:text-white text-ink px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 rounded-sm shrink-0">
                                Details <ArrowUpRight size={14} />
                            </button>
                        </div>
                    </div>
                 </div>
              ))}
           </div>
       ) : (
           <div className="flex flex-col items-center justify-center py-32 text-center opacity-60 border border-ink/10 border-dashed rounded-lg">
               <h3 className="text-3xl font-serif text-ink mb-4">No Cards Found</h3>
               <button 
                  onClick={() => {
                      setCategory('Any Category');
                      setIssuer('All Issuers');
                      setNoAnnualFee(false);
                      setHighRewards(false);
                      setLoungeAccess(false);
                      setLifetimeFree(false);
                  }}
                  className="px-8 py-3 bg-black hover:bg-black/90 text-white text-xs font-bold uppercase tracking-widest transition-colors rounded-full shadow-lg"
               >
                   Reset Search
               </button>
           </div>
       )}
    </div>
  )
}

export default AllHomes;
