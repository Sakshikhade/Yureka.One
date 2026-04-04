import React from 'react';
import { 
  Edit2, 
  Trash2 
} from 'lucide-react';
import { Review } from '../../types';
import { useSupabase } from '../SupabaseProvider';
import { SkeletonTable } from '../SkeletonLoaders';

interface AdminReviewsTabProps {
  onEdit: (review: Review) => void;
  onDelete: (collection: string, id: string) => void;
}

export const AdminReviewsTab: React.FC<AdminReviewsTabProps> = ({ 
  onEdit, 
  onDelete 
}) => {
  const { reviews, isLoading } = useSupabase();

  if (isLoading && reviews.length === 0) {
    return <SkeletonTable />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left min-w-[800px]">
        <thead className="bg-black/5 text-[10px] uppercase font-bold tracking-widest text-black/40">
          <tr>
            <th className="px-6 py-4">User</th>
            <th className="px-6 py-4">Designation</th>
            <th className="px-6 py-4">Company</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/5">
          {reviews.map(review => (
            <tr key={review.id} className="hover:bg-black/[0.01] transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <img src={review.image} alt="" className="w-8 h-8 rounded-full object-cover" />
                  <span className="font-bold text-sm">{review.author}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-black/60">{review.role}</td>
              <td className="px-6 py-4 text-sm text-black/60">{review.company}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${review.status === 'published' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                  {review.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right space-x-2">
                <button 
                  onClick={() => onEdit(review)}
                  className="p-2 text-teal hover:bg-teal/10 rounded-lg transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => onDelete('reviews', review.id!)}
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
