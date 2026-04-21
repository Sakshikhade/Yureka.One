import React from 'react';
import { 
  Edit2, 
  Trash2,
  Quote,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Review } from '../../types';
import { useSupabase } from '../SupabaseProvider';
import { SkeletonTable } from '../SkeletonLoaders';
import { motion, AnimatePresence } from 'motion/react';

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
    <div className="flex-1 overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[900px]">
        <thead>
          <tr className="bg-slate-50/50 border-b border-black/5">
            <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-black/40">User Identity</th>
            <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-black/40">Affiliation</th>
            <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-black/40">Testimonial Context</th>
            <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-black/40">Status</th>
            <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-black/40 text-right">Management</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/5">
          <AnimatePresence mode="popLayout">
            {reviews.map((review, idx) => (
              <motion.tr 
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                key={review.id} 
                className="group hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-black/5 overflow-hidden border border-black/5 group-hover:scale-105 transition-transform shadow-sm">
                      <img src={review.image} alt={review.author} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-bold text-[#242424] leading-tight group-hover:text-teal transition-colors line-clamp-1">{review.author}</div>
                      <div className="text-[10px] text-black/40 mt-1 uppercase font-bold tracking-tighter">{review.role}</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <img src={review.company_logo} alt="" className="w-6 h-6 object-contain opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                    <span className="text-sm text-[#242424] font-bold">{review.company}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3 max-w-xs">
                    <Quote size={14} className="text-teal/20 shrink-0" />
                    <p className="text-[11px] text-[#242424]/60 line-clamp-2 italic leading-relaxed">"{review.quote}"</p>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-2 w-fit ${
                    review.status === 'published' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                  }`}>
                    {review.status === 'published' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                    {review.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onEdit(review)}
                      className="p-2.5 text-teal hover:bg-teal/10 rounded-xl transition-all border border-transparent hover:border-teal/20 shadow-sm"
                      title="Edit Review"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => onDelete('reviews', review.id!)}
                      className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100 shadow-sm"
                      title="Delete Entry"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
          {reviews.length === 0 && (
            <tr>
              <td colSpan={5} className="px-8 py-24 text-center">
                <p className="text-[#242424] font-serif font-bold text-xl italic">No social proof available yet.</p>
                <p className="text-black/40 text-xs mt-2 uppercase tracking-widest font-black">Curate your customer success stories here.</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
