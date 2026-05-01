import { 
  Edit2, 
  Trash2,
  ExternalLink,
  ShieldCheck,
  Zap,
  Search,
  Filter,
  X,
  ChevronUp,
  ChevronDown,
  Calendar,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import React from 'react';
import { Card } from '../../types';
import { useSupabase } from '../SupabaseProvider';
import { SkeletonTable } from '../SkeletonLoaders';
import { motion, AnimatePresence } from 'motion/react';

interface AdminCardsTabProps {
  onEdit: (card: Card) => void;
  onDelete: (collection: string, id: string) => void;
}

const ADMIN_BANKS = [
  'HDFC', 'SBI', 'ICICI', 'Axis', 'Kotak', 'Yes Bank', 'RBL', 'Amex',
  'IndusInd', 'BOB', 'SC', 'IDFC', 'AU', 'Federal', 'SBM', 'IDBI'
];

const CARD_TYPES = [
  'Rewards', 'Cashback', 'Premium', 'Lifestyle', 'Fuel', 'Shopping', 'Travel', 'Business'
];

export const AdminCardsTab: React.FC<AdminCardsTabProps> = ({ 
  onEdit, 
  onDelete 
}) => {
  const { cards, isLoading } = useSupabase();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [bankFilter, setBankFilter] = React.useState('All Banks');
  const [typeFilter, setTypeFilter] = React.useState('All Types');
  const [statusFilter, setStatusFilter] = React.useState('All Status');
  const [sortBy, setSortBy] = React.useState<'name' | 'created_at'>('name');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');

  if (isLoading && cards.length === 0) {
    return <SkeletonTable />;
  }

  const filteredCards = cards.filter(card => {
    const name = card?.name || '';
    const bank = card?.bank || '';
    const type = card?.type || '';
    const status = card?.status || 'published';

    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          bank.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBank = bankFilter === 'All Banks' || bank === bankFilter;
    const matchesType = typeFilter === 'All Types' || type === typeFilter;
    const matchesStatus = statusFilter === 'All Status' || status === statusFilter.toLowerCase();
    return matchesSearch && matchesBank && matchesType && matchesStatus;
  }).sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'name') {
      comparison = (a.name || '').localeCompare(b.name || '');
    } else if (sortBy === 'created_at') {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      comparison = dateA - dateB;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const toggleSort = (field: 'name' | 'created_at') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Search & Filter Header */}
      <div className="px-8 py-6 border-b border-white/5 bg-white/5/50 flex flex-wrap items-center gap-6">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[300px]">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
          <input 
            type="text" 
            placeholder="Search products or banks..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-3 bg-cream border border-white/5 rounded-2xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-clay/20 focus:border-clay/30 transition-all shadow-sm"
          />
          <AnimatePresence>
            {searchQuery && (
              <motion.button 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40 transition-colors"
              >
                <X size={16} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Bank Filter */}
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-hover:text-clay transition-colors">
              <Layers size={14} />
            </div>
            <select 
              value={bankFilter}
              onChange={(e) => setBankFilter(e.target.value)}
              className="pl-10 pr-10 py-3 bg-cream border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest appearance-none text-white focus:outline-none focus:ring-2 focus:ring-clay/20 shadow-sm cursor-pointer hover:border-white/10 transition-all"
            >
              <option className="bg-cream">All Banks</option>
              {ADMIN_BANKS.sort().map(bank => (
                <option key={bank} value={bank} className="bg-cream">{bank}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
          </div>

          {/* Type Filter */}
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-hover:text-clay transition-colors">
              <Zap size={14} />
            </div>
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="pl-10 pr-10 py-3 bg-cream border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest appearance-none text-white focus:outline-none focus:ring-2 focus:ring-clay/20 shadow-sm cursor-pointer hover:border-white/10 transition-all"
            >
              <option className="bg-cream">All Types</option>
              {CARD_TYPES.sort().map(type => (
                <option key={type} value={type} className="bg-cream">{type}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-hover:text-clay transition-colors">
              <div className="w-2 h-2 rounded-full bg-current" />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-10 py-3 bg-cream border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest appearance-none text-white focus:outline-none focus:ring-2 focus:ring-clay/20 shadow-sm cursor-pointer hover:border-white/10 transition-all"
            >
              <option className="bg-cream">All Status</option>
              <option value="Published" className="bg-cream">Published</option>
              <option value="Draft" className="bg-cream">Draft</option>
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
          </div>

          {/* Reset Button */}
          {(searchQuery || bankFilter !== 'All Banks' || typeFilter !== 'All Types' || statusFilter !== 'All Status') && (
            <motion.button 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => {
                setSearchQuery('');
                setBankFilter('All Banks');
                setTypeFilter('All Types');
                setStatusFilter('All Status');
              }}
              className="text-[10px] uppercase font-black tracking-widest text-red-500 hover:text-red-400 px-5 py-3 bg-red-500/10 rounded-2xl transition-all border border-red-500/20 shadow-sm hover:shadow-md active:scale-95"
            >
              Reset Filters
            </motion.button>
          )}
        </div>
        
        {/* Count Indicator */}
        <div className="ml-auto flex items-center gap-4">
          <div className="h-8 w-px bg-white/5" />
          <div className="text-[10px] uppercase font-black tracking-[0.2em] text-white/30">
            Registry: <span className="text-white">{filteredCards.length}</span><span className="text-white/10 mx-1">/</span>{cards.length}
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-x-auto overflow-y-auto max-h-[calc(100vh-22rem)] custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead className="sticky top-0 z-20 shadow-sm">
            <tr className="bg-white/5 border-b border-white/5">
              <th 
                className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-white/40 bg-white/5 cursor-pointer hover:text-clay transition-colors group"
                onClick={() => toggleSort('name')}
              >
                <div className="flex items-center gap-2">
                  Financial Product
                  <ArrowUpDown size={12} className={`opacity-0 group-hover:opacity-100 transition-opacity ${sortBy === 'name' ? 'opacity-100 text-clay' : ''}`} />
                </div>
              </th>
              <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-white/40 bg-white/5">Issuer & Bank</th>
              <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-white/40 bg-white/5">Optimization</th>
              <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-white/40 bg-white/5">Fees & Status</th>
              <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-white/40 text-right bg-white/5">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {filteredCards.map((card) => (
              <tr 
                key={card.id} 
                className="group hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-10 rounded-xl bg-white/5 overflow-hidden border border-white/5 group-hover:scale-105 transition-transform shadow-sm relative">
                      <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
                      {card.status === 'draft' && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="text-[8px] font-black uppercase text-white tracking-widest">Draft</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-white leading-tight group-hover:text-clay transition-colors line-clamp-1">{card.name}</div>
                      <div className="text-[10px] text-white/30 mt-1 uppercase font-black tracking-widest">{card.type}</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="text-sm text-white/90 font-bold">{card.bank}</span>
                    <span className="text-[10px] text-white/40 uppercase font-bold tracking-tighter mt-0.5">{card.issuer || 'Local Primary'}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="px-2.5 py-1.5 rounded-lg bg-clay/5 text-clay text-[10px] font-black uppercase tracking-wider flex items-center gap-2 w-fit border border-clay/10">
                    <Zap size={12} className="text-clay/40" />
                    {card.best_for}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col gap-1.5">
                    <div className="text-[11px] font-bold text-white/70">
                      Annual: <span className="text-white">{card.annual_fee}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                         card.status === 'published' 
                           ? 'bg-clay/10 text-clay border-clay/20' 
                           : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                       }`}>
                         {card.status || 'published'}
                       </div>
                       <div className="text-[9px] text-white/20 font-mono tracking-tighter">
                         {card.rewards_rate}
                       </div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                    <button 
                      onClick={() => onEdit(card)}
                      className="p-2.5 text-clay hover:bg-clay/10 rounded-xl transition-all border border-transparent hover:border-clay/20 shadow-sm"
                      title="Update Details"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => onDelete('cards', card.id!)}
                      className="p-2.5 text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20 shadow-sm"
                      title="Archive Card"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredCards.length === 0 && (
              <tr>
                <td colSpan={5} className="px-8 py-32 text-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    {cards.length === 0 ? (
                      <>
                        <div className="w-16 h-16 bg-white/5 rounded-3xl mx-auto mb-6 flex items-center justify-center text-white/10">
                          <Layers size={32} />
                        </div>
                        <p className="text-white font-serif font-bold text-2xl italic">No financial products listed.</p>
                        <p className="text-white/40 text-xs mt-3 uppercase tracking-[0.2em] font-black">Add your first credit card to the registry core.</p>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-white/5 rounded-3xl mx-auto mb-6 flex items-center justify-center text-white/10">
                          <Search size={32} />
                        </div>
                        <p className="text-white font-serif font-bold text-2xl italic">No matching products found.</p>
                        <p className="text-white/40 text-xs mt-3 uppercase tracking-[0.2em] font-black">Adjust filters or search parameters to locate nodes.</p>
                      </>
                    )}
                  </motion.div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
