import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  X, 
  Heart,
  ChevronDown,
  User,
  ArrowRight,
  Zap,
  SlidersHorizontal,
  TrendingUp,
  History
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEO from './SEO';
import { transferMatrix } from '../data/transferMatrix';

const VALUATION_MAP: Record<string, number> = {
  'AIRLINE': 0.95,
  'HOTEL': 0.45,
  'CREDIT_CARD': 0.25,
  'DEFAULT': 0.35
};

const PROGRAM_LOGOS: Record<string, string> = {
  'Accor Live Limitless': '/logos/accor.png',
  'AerClub': '/logos/aerclub.png',
  'Aeroplan': '/logos/aeroplan.png',
  'ANA Mileage Club': '/logos/ana.png',
  'Amex': '/logos/amex.png',
  'Asia Miles (Cathay)': '/logos/asiamiles.png',
  'Atmos Rewards': '/logos/atmos.png',
  'AU': '/logos/au.png',
  'Axis': '/logos/axis.png',
  'British Airways Executive Club': '/logos/britishairways.png',
  'Emirates Skywards': '/logos/emirates.png',
  'FalconFlyer': '/logos/falconflyer.png',
  'Fi Credit Card': '/logos/fi.png',
  'Finnair Plus': '/logos/finnair.png',
  'HDFC': '/logos/hdfc.png',
  'HSBC': '/logos/hsbc.png',
  'ICICI': '/logos/icici.png',
  'IndusInd': '/logos/indusind.png',
  'SBI': '/logos/sbi.png',
  'Yes': '/logos/yes.png',
  'Kotak': '/logos/kotak.png',
  'Hilton Honors': '/logos/hilton.png',
  'IHG One Rewards': '/logos/ihg.png',
  'ITC One': '/logos/itc.png',
  'JAL Mileage Bank': '/logos/jal.png'
};

const ProgramIcon: React.FC<{ name: string | null, fallbackColor?: string, size?: string }> = ({ name, fallbackColor = 'bg-blue-500', size = 'w-8 h-8' }) => {
  if (!name) return <div className={`${size} rounded ${fallbackColor} flex items-center justify-center text-[10px] font-bold text-white uppercase`}>??</div>;
  
  // Try exact match first, then prefix match
  let logoUrl = PROGRAM_LOGOS[name];
  
  if (!logoUrl) {
    const banks = ['Axis', 'HDFC', 'Amex', 'AU', 'SBI', 'ICICI', 'HSBC', 'IndusInd', 'Yes', 'Kotak'];
    const matchedBank = banks.find(b => name.startsWith(b));
    if (matchedBank) logoUrl = PROGRAM_LOGOS[matchedBank];
  }

  if (logoUrl) {
    return (
      <div className={`${size} rounded bg-white flex items-center justify-center overflow-hidden border border-slate-100 shadow-sm shrink-0`}>
        <img src={logoUrl} alt={name} className="w-full h-full object-contain p-1" />
      </div>
    );
  }
  
  return (
    <div className={`${size} rounded ${fallbackColor} flex items-center justify-center text-[10px] font-bold text-white uppercase shrink-0`}>
      {name.substring(0, 2)}
    </div>
  );
};

const formatNumber = (num: number) => new Intl.NumberFormat('en-IN').format(Math.round(num));

const RewardsTransferCalculator: React.FC = () => {
  const [amount, setAmount] = useState<number>(10000);
  const [selectedFrom, setSelectedFrom] = useState<string | null>(null);
  const [selectedTo, setSelectedTo] = useState<string | null>(null);
  const [fromSearchQuery, setFromSearchQuery] = useState('');
  const [toSearchQuery, setToSearchQuery] = useState('');
  const [isFromOpen, setIsFromOpen] = useState(false);
  const [isToOpen, setIsToOpen] = useState(false);
  const [showBonusesOnly, setShowBonusesOnly] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const navigate = useNavigate();
  const fromDropdownRef = useRef<HTMLDivElement>(null);
  const toDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const access = localStorage.getItem('yureka_points_access');
    if (!access) navigate('/yureka-os');
  }, [navigate]);

  const { fromPrograms, toPrograms } = useMemo(() => {
    const froms = new Set<string>();
    const tos = new Set<string>();
    transferMatrix.forEach(row => {
      froms.add(row["Transfer From"]);
      tos.add(row["Transfer To"]);
    });

    let fList = Array.from(froms);
    let tList = Array.from(tos);

    if (selectedFrom) {
      const valid = new Set(transferMatrix.filter(r => r["Transfer From"] === selectedFrom).map(r => r["Transfer To"]));
      tList = tList.filter(t => valid.has(t));
    }
    if (selectedTo) {
      const valid = new Set(transferMatrix.filter(r => r["Transfer To"] === selectedTo).map(r => r["Transfer From"]));
      fList = fList.filter(f => valid.has(f));
    }

    return { fromPrograms: fList.sort(), toPrograms: tList.sort() };
  }, [selectedFrom, selectedTo]);

  const results = useMemo(() => {
    if (!selectedFrom && !selectedTo) return [];
    let filtered = transferMatrix;
    if (selectedFrom) filtered = filtered.filter(row => row["Transfer From"] === selectedFrom);
    if (selectedTo) filtered = filtered.filter(row => row["Transfer To"] === selectedTo);
    
    // Sort by yield
    return filtered.sort((a, b) => (1 / (a["Ratio Float"] || 1)) - (1 / (b["Ratio Float"] || 1))).reverse();
  }, [selectedFrom, selectedTo]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-20">
      <SEO title="Transfer Calculator | Yureka" description="Optimize your rewards transfers with precision." />

      <div className="max-w-[1240px] mx-auto px-6 pt-10">
        
        {/* Controls Section (Match Image 2) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            
            {/* Transfer From */}
            <div className="md:col-span-4 relative" ref={fromDropdownRef}>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 px-1">Transfer From</label>
              <div className="flex items-center gap-2">
                <div 
                  onClick={() => setIsFromOpen(!isFromOpen)}
                  className="flex-1 h-[60px] bg-white border border-slate-200 rounded-xl px-4 flex items-center justify-between cursor-pointer hover:border-slate-400 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <ProgramIcon name={selectedFrom} fallbackColor="bg-blue-500" />
                    <span className={`text-sm font-semibold ${selectedFrom ? 'text-slate-900' : 'text-slate-400'}`}>
                      {selectedFrom || 'Select source'}
                    </span>
                  </div>
                  <ChevronDown size={16} className={`text-slate-400 transition-transform ${isFromOpen ? 'rotate-180' : ''}`} />
                </div>
                <button 
                  onClick={() => setSelectedFrom(null)}
                  className="w-12 h-[60px] border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <AnimatePresence>
                {isFromOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                    className="absolute top-full left-0 right-14 z-50 mt-2 bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden"
                  >
                    <div className="p-3 border-b border-slate-100">
                      <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          autoFocus type="text" placeholder="Search programs..." 
                          value={fromSearchQuery} onChange={e => setFromSearchQuery(e.target.value)}
                          className="w-full bg-slate-50 rounded-lg pl-10 pr-4 py-2 text-sm outline-none"
                        />
                      </div>
                    </div>
                    <div className="overflow-y-auto max-h-[300px]">
                      {fromPrograms.filter(p => p.toLowerCase().includes(fromSearchQuery.toLowerCase())).map(p => (
                        <div 
                          key={p} onClick={() => { setSelectedFrom(p); setIsFromOpen(false); }}
                          className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center gap-3"
                        >
                          <ProgramIcon name={p} fallbackColor="bg-blue-400" />
                          <span className="text-sm font-medium text-slate-700">{p}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Transfer To */}
            <div className="md:col-span-4 relative" ref={toDropdownRef}>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 px-1">Transfer To</label>
              <div className="flex items-center gap-2">
                <div 
                  onClick={() => setIsToOpen(!isToOpen)}
                  className="flex-1 h-[60px] bg-white border border-slate-200 rounded-xl px-4 flex items-center justify-between cursor-pointer hover:border-slate-400 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <ProgramIcon name={selectedTo} fallbackColor="bg-indigo-600" />
                    <span className={`text-sm font-semibold ${selectedTo ? 'text-slate-900' : 'text-slate-400'}`}>
                      {selectedTo || 'Select target'}
                    </span>
                  </div>
                  <ChevronDown size={16} className={`text-slate-400 transition-transform ${isToOpen ? 'rotate-180' : ''}`} />
                </div>
                <button 
                  onClick={() => setSelectedTo(null)}
                  className="w-12 h-[60px] border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <AnimatePresence>
                {isToOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                    className="absolute top-full left-0 right-14 z-50 mt-2 bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden"
                  >
                    <div className="p-3 border-b border-slate-100">
                      <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          autoFocus type="text" placeholder="Search targets..." 
                          value={toSearchQuery} onChange={e => setToSearchQuery(e.target.value)}
                          className="w-full bg-slate-50 rounded-lg pl-10 pr-4 py-2 text-sm outline-none"
                        />
                      </div>
                    </div>
                    <div className="overflow-y-auto max-h-[300px]">
                      {toPrograms.filter(p => p.toLowerCase().includes(toSearchQuery.toLowerCase())).map(p => (
                        <div 
                          key={p} onClick={() => { setSelectedTo(p); setIsToOpen(false); }}
                          className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center gap-3"
                        >
                          <ProgramIcon name={p} fallbackColor="bg-indigo-400" />
                          <span className="text-sm font-medium text-slate-700">{p}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Points */}
            <div className="md:col-span-4">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 px-1">Transfer Points</label>
              <div className="h-[60px] bg-white border border-slate-200 rounded-xl px-4 flex items-center gap-2">
                <input 
                  type="number" value={amount} onChange={e => setAmount(Number(e.target.value))}
                  className="flex-1 bg-transparent border-none outline-none text-xl font-bold text-slate-900 text-center"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Login Banner (Match Image 2) */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-8 flex items-center justify-between group cursor-pointer hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-4 text-slate-400 font-medium">
            <User size={18} />
            <span className="text-sm">Login to view your balances</span>
          </div>
          <ArrowRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
        </div>

        {/* Results Toolbar (Match Image 3) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 px-1">
          <h2 className="text-xl font-bold text-slate-900">
            {results.length} <span className="font-normal text-slate-400">Transfer To Options</span>
          </h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowBonusesOnly(!showBonusesOnly)}
              className={`px-4 py-2 rounded-full text-xs font-bold border transition-all flex items-center gap-2 ${showBonusesOnly ? 'bg-amber-50 border-amber-200 text-amber-600 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              <Zap size={14} className={showBonusesOnly ? 'fill-amber-600' : ''} />
              Show Bonus Only
            </button>
            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-full text-xs font-bold hover:bg-slate-50 transition-all flex items-center gap-2">
              <SlidersHorizontal size={14} />
              Sort by Value
            </button>
          </div>
        </div>

        {/* Results List (Match Image 3) */}
        <div className="space-y-4">
          <AnimatePresence mode='popLayout'>
            {results.length === 0 ? (
               <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400">
                  Select a source or target to view conversion routes.
               </div>
            ) : (
              results.map((item, idx) => {
                const yieldBasis = Math.floor(amount / (item["Ratio Float"] || 1));
                const hasBonus = item["Transfer To"].length % 2 === 0; // Simulated bonus
                const yieldValue = hasBonus ? Math.floor(yieldBasis * 1.5) : yieldBasis;
                
                const estSourceVal = amount * (VALUATION_MAP[item["From Category"]] || 0.35);
                const estTargetVal = yieldValue * (VALUATION_MAP[item["To Category"]] || 0.35);
                
                const isFavorite = favorites.has(`${item["Transfer From"]}-${item["Transfer To"]}-${idx}`);

                if (showBonusesOnly && !hasBonus) return null;

                return (
                  <motion.div 
                    layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    key={`${item["Transfer From"]}-${item["Transfer To"]}-${idx}`}
                    className="bg-white rounded-[2rem] border border-slate-200 p-8 hover:shadow-lg hover:border-slate-300 transition-all group"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                      
                      {/* Program Logo & Info */}
                      <div className="lg:col-span-5 flex items-start gap-6">
                        <ProgramIcon name={item["Transfer To"]} fallbackColor="bg-indigo-900" size="w-14 h-14" />
                        <div className="space-y-1.5 flex-1">
                          <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">{item["Transfer To"]}</h3>
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                            <span>{item["Ratio"]} ratio</span>
                            <span className="w-1 h-1 bg-slate-200 rounded-full" />
                            <span className="text-blue-500">via {item["Via"] || 'Direct'}</span>
                            <span className="w-1 h-1 bg-slate-200 rounded-full" />
                            <span>{item["Transfer Time"] || 'Up to 3 days'}</span>
                          </div>
                          {hasBonus && (
                            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 mt-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 w-fit">
                               <Zap size={12} className="fill-emerald-600" />
                               50% Bonus Applied • until Apr 23
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Favorite Heart */}
                      <div className="lg:col-span-1 flex justify-center">
                        <button 
                          onClick={() => {
                             const id = `${item["Transfer From"]}-${item["Transfer To"]}-${idx}`;
                             const next = new Set(favorites);
                             if (next.has(id)) next.delete(id); else next.add(id);
                             setFavorites(next);
                          }}
                          className={`p-3 rounded-full transition-all ${isFavorite ? 'text-rose-500 bg-rose-50' : 'text-slate-200 hover:text-slate-400 hover:bg-slate-50'}`}
                        >
                          <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                        </button>
                      </div>

                      {/* Values Grid */}
                      <div className="lg:col-span-6 grid grid-cols-2 gap-12 pl-4 border-l border-slate-50">
                        {/* Origin Info */}
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">If you transfer</div>
                          <div className="flex items-center gap-2">
                             <div className="w-4 h-4 rounded bg-slate-900 text-[6px] text-white font-bold flex items-center justify-center">AM</div>
                             <span className="text-lg font-bold text-slate-900 tracking-tight">{formatNumber(amount)}</span>
                          </div>
                          <div className="text-[11px] font-semibold text-slate-400">est. ₹{formatNumber(estSourceVal)}</div>
                        </div>

                        {/* Target Info */}
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">You'll receive</div>
                          <div className="flex items-center gap-2">
                             <div className="w-4 h-4 rounded bg-indigo-600 text-[6px] text-white font-bold flex items-center justify-center">TR</div>
                             <span className="text-xl font-bold text-slate-900 tracking-tight">{formatNumber(yieldValue)}</span>
                          </div>
                          <div className="text-[11px] font-semibold text-slate-400">est. ₹{formatNumber(estTargetVal)}</div>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default RewardsTransferCalculator;
