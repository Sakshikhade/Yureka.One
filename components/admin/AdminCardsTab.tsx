import React from 'react';
import { 
  Edit2, 
  Trash2 
} from 'lucide-react';
import { Card } from '../../types';
import { useSupabase } from '../SupabaseProvider';
import { SkeletonTable } from '../SkeletonLoaders';

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
    <div className="overflow-x-auto">
      <table className="w-full text-left min-w-[1000px]">
        <thead className="bg-black/5 text-[10px] uppercase font-bold tracking-widest text-black/40">
          <tr>
            <th className="px-6 py-4">Card Name</th>
            <th className="px-6 py-4">Bank</th>
            <th className="px-6 py-4">Type</th>
            <th className="px-6 py-4">Best For</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/5">
          {cards.map(card => (
            <tr key={card.id} className="hover:bg-black/[0.01] transition-colors">
              <td className="px-6 py-4 font-bold text-sm">{card.name}</td>
              <td className="px-6 py-4 text-sm text-black/60">{card.bank}</td>
              <td className="px-6 py-4 text-sm text-black/60">{card.type}</td>
              <td className="px-6 py-4 text-sm text-black/60">{card.best_for}</td>
              <td className="px-6 py-4 text-right space-x-2">
                <button 
                  onClick={() => onEdit(card)}
                  className="p-2 text-teal hover:bg-teal/10 rounded-lg transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => onDelete('cards', card.id!)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
