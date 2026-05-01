import React from 'react';
import { 
  Edit2, 
  Trash2,
  Quote,
  CheckCircle2,
  Clock,
  Star,
  Apple,
  Play
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
          <tr className="bg-white/5 border-b border-white/5">
            <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-white/40 bg-white/5">User Identity</th>
            <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-white/40 bg-white/5">Affiliation</th>
            <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-white/40 bg-white/5">Testimonial Context</th>
            <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-white/40 bg-white/5">Status</th>
            <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-white/40 text-right bg-white/5">Management</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          <AnimatePresence mode="popLayout">
            {reviews.map((review, idx) => (
              <motion.tr 
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                key={review.id} 
                className="group hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 overflow-hidden border border-white/5 group-hover:scale-105 transition-transform shadow-sm">
                      <img src={review.image} alt={review.author} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-bold text-white leading-tight group-hover:text-clay transition-colors line-clamp-1">{review.author}</div>
                      <div className="text-[10px] text-white/40 mt-1 uppercase font-bold tracking-tighter">{review.role}</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <img src={review.company_logo} alt="" className="w-6 h-6 object-contain opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                    <span className="text-sm text-white font-bold">{review.company}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3 max-w-xs">
                    <Quote size={14} className="text-clay/20 shrink-0" />
                    <p className="text-[11px] text-white/60 line-clamp-2 italic leading-relaxed">"{review.quote}"</p>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={10} className={`${i < (review.rating || 5) ? 'text-clay fill-clay' : 'text-white/10'}`} />
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        {review.source === 'App Store' ? <Apple size={12} className="text-white/40" /> : <Play size={12} className="text-white/40" />}
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/40">{review.source || 'Direct'}</span>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    {review.featured && (
                        <span className="px-2 py-0.5 rounded-full bg-white text-cream text-[8px] font-black uppercase tracking-[0.2em] shadow-sm">Hero Featured</span>
                    )}
                    <span className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-2 w-fit border ${
                        review.status === 'published' ? 'bg-clay/10 text-clay border-clay/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    }`}>
                        {review.status === 'published' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                        {review.status}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onEdit(review)}
                      className="p-2.5 text-clay hover:bg-clay/10 rounded-xl transition-all border border-transparent hover:border-clay/20 shadow-sm"
                      title="Edit Review"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => onDelete('reviews', review.id!)}
                      className="p-2.5 text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20 shadow-sm"
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
                <p className="text-white font-serif font-bold text-xl italic">No social proof available yet.</p>
                <p className="text-white/40 text-xs mt-2 uppercase tracking-widest font-black">Curate your customer success stories here.</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
