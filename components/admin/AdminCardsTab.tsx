import React from 'react';
import { 
  Edit2, 
  Trash2,
  ExternalLink,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Card } from '../../types';
import { useSupabase } from '../SupabaseProvider';
import { SkeletonTable } from '../SkeletonLoaders';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminCardsTabProps {
  onEdit: (card: Card) => void;
  onDelete: (collection: string, id: string) => void;
}

export const AdminCardsTab: React.FC<AdminCardsTabProps> = ({ 
  onEdit, 
  onDelete 
}) => {
  const { cards, isLoading } = useSupabase();

  if (isLoading && cards.length === 0) {
    return <SkeletonTable />;
  }

  return (
    <div className="flex-1 overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[1000px]">
        <thead>
          <tr className="bg-slate-50/50 border-b border-black/5">
            <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-black/40">Financial Product</th>
            <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-black/40">Issuer & Bank</th>
            <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-black/40">Optimization</th>
            <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-black/40">Fees & Rates</th>
            <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-black/40 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/5">
          <AnimatePresence mode="popLayout">
            {cards.map((card, idx) => (
              <motion.tr 
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                key={card.id} 
                className="group hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-10 rounded-xl bg-black/5 overflow-hidden border border-black/5 group-hover:scale-105 transition-transform shadow-sm">
                      <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-bold text-ink leading-tight group-hover:text-teal transition-colors line-clamp-1">{card.name}</div>
                      <div className="text-[10px] text-black/30 mt-1 uppercase font-black tracking-widest">{card.type}</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="text-sm text-ink font-bold">{card.bank}</span>
                    <span className="text-[10px] text-black/40 uppercase font-bold tracking-tighter mt-0.5">{card.issuer || 'Local Primary'}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="px-2.5 py-1.5 rounded-lg bg-teal/5 text-teal text-[10px] font-black uppercase tracking-wider flex items-center gap-2 w-fit border border-teal/10">
                    <Zap size={12} className="text-teal/40" />
                    {card.best_for}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col gap-1">
                    <div className="text-[11px] font-bold text-ink/70">
                      Annual: <span className="text-ink">{card.annual_fee}</span>
                    </div>
                    <div className="text-[10px] text-black/30 font-bold uppercase tracking-tighter flex items-center gap-1">
                      <ShieldCheck size={10} />
                      Rate: {card.rewards_rate}
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onEdit(card)}
                      className="p-2.5 text-teal hover:bg-teal/10 rounded-xl transition-all border border-transparent hover:border-teal/20 shadow-sm"
                      title="Update Details"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => onDelete('cards', card.id!)}
                      className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100 shadow-sm"
                      title="Archive Card"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
          {cards.length === 0 && (
            <tr>
              <td colSpan={5} className="px-8 py-24 text-center">
                <p className="text-ink font-serif font-bold text-xl italic">No financial products listed.</p>
                <p className="text-black/40 text-xs mt-2 uppercase tracking-widest font-black">Add your first credit card to the registry.</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
