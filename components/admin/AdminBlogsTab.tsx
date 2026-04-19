import React from 'react';
import { Blog } from '../../types';
import { useSupabase } from '../SupabaseProvider';
import { SkeletonTable } from '../SkeletonLoaders';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Edit2, 
  Trash2, 
  Clock,
  ExternalLink,
  Target
} from 'lucide-react';

interface AdminBlogsTabProps {
  onEdit: (blog: Blog) => void;
  onDelete: (collection: string, id: string) => void;
  formatDateForInput: (isoString?: string | null) => string;
}

export const AdminBlogsTab: React.FC<AdminBlogsTabProps> = ({ 
  onEdit, 
  onDelete,
  formatDateForInput 
}) => {
  const { blogs, isLoading } = useSupabase();

  if (isLoading && blogs.length === 0) {
    return <SkeletonTable />;
  }

  return (
    <div className="flex-1 overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[900px]">
        <thead>
          <tr className="bg-slate-50/50 border-b border-black/5">
            <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-black/40">Publication Context</th>
            <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-black/40">Taxonomy</th>
            <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-black/40">Author</th>
            <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-black/40">Status & Timeline</th>
            <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-black/40 text-right">Management</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/5">
          <AnimatePresence mode="popLayout">
            {blogs.map((blog, idx) => {
              const isScheduled = blog.scheduled_at && new Date(blog.scheduled_at) > new Date();
              
              return (
                <motion.tr 
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  key={blog.id} 
                  className="group hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-black/5 overflow-hidden border border-black/5 group-hover:scale-105 transition-transform">
                        <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="max-w-md">
                        <div className="font-bold text-ink leading-tight group-hover:text-teal transition-colors line-clamp-1">{blog.title}</div>
                        <div className="text-[11px] text-black/40 mt-1 flex items-center gap-2">
                          <ExternalLink size={10} />
                          {blog.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-2.5 py-1.5 rounded-lg bg-black/5 text-ink/60 text-[10px] font-black uppercase tracking-wider flex items-center gap-2 w-fit">
                      <Target size={12} className="text-black/20" />
                      {blog.category}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-teal/10 flex items-center justify-center text-teal text-[10px] font-bold">
                        {blog.author?.[0] || 'A'}
                      </div>
                      <span className="text-sm text-ink/70 font-medium">{blog.author}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      {isScheduled ? (
                        <div className="flex items-center gap-2 text-amber-600 font-black uppercase tracking-widest text-[9px] bg-amber-50 px-2 py-1 rounded-md w-fit border border-amber-100">
                          <Clock size={12} /> Scheduled: {new Date(blog.scheduled_at!).toLocaleDateString()}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-green-600 font-black uppercase tracking-widest text-[9px] bg-green-50 px-2 py-1 rounded-md w-fit border border-green-100">
                          <Target size={12} /> Live Post
                        </div>
                      )}
                      <div className="text-[10px] text-black/30 font-bold uppercase tracking-tighter">
                        Created: {blog.created_at ? new Date(blog.created_at).toLocaleDateString() : 'Draft'}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onEdit(blog)}
                        className="p-2.5 text-teal hover:bg-teal/10 rounded-xl transition-all border border-transparent hover:border-teal/20 shadow-sm"
                        title="Edit Publication"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => onDelete('blogs', blog.id!)}
                        className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100 shadow-sm"
                        title="Delete Content"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </AnimatePresence>
          {blogs.length === 0 && (
            <tr>
              <td colSpan={5} className="px-8 py-24 text-center">
                <p className="text-ink font-serif font-bold text-xl italic">The catalog is currently empty.</p>
                <p className="text-black/40 text-xs mt-2 uppercase tracking-widest font-black">Begin by publishing your first article.</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
