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
    <div className="flex-1 overflow-x-auto overflow-y-auto max-h-[calc(100vh-16rem)] custom-scrollbar">
      <table className="w-full text-left border-collapse min-w-[900px]">
        <thead className="sticky top-0 z-20 shadow-sm">
          <tr className="bg-[#1a1a1a] border-b border-white/5">
            <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-white/40 bg-[#1a1a1a]">Publication Context</th>
            <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-white/40 bg-[#1a1a1a]">Taxonomy</th>
            <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-white/40 bg-[#1a1a1a]">Author</th>
            <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-white/40 bg-[#1a1a1a]">Status & Timeline</th>
            <th className="px-8 py-5 text-[10px] uppercase font-black tracking-widest text-white/40 text-right bg-[#1a1a1a]">Management</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-white/5">
          {blogs.map((blog, idx) => {
            const isScheduled = blog.scheduled_at && new Date(blog.scheduled_at) > new Date();
            
            return (
              <tr 
                key={blog.id} 
                className="group hover:bg-white/[0.02] transition-colors"
              >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 overflow-hidden border border-white/5 group-hover:scale-105 transition-transform">
                        <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="max-w-md">
                        <div className="font-bold text-white leading-tight group-hover:text-[#34d399] transition-colors line-clamp-1">{blog.title}</div>
                        <div className="text-[11px] text-white/40 mt-1 flex items-center gap-2">
                          <ExternalLink size={10} />
                          {blog.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-2.5 py-1.5 rounded-lg bg-white/5 text-white/60 text-[10px] font-black uppercase tracking-wider flex items-center gap-2 w-fit border border-white/5">
                      <Target size={12} className="text-[#34d399]/40" />
                      {blog.category}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#34d399]/10 flex items-center justify-center text-[#34d399] text-[10px] font-bold">
                        {blog.author?.[0] || 'A'}
                      </div>
                      <span className="text-sm text-white/70 font-medium">{blog.author}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      {isScheduled ? (
                        <div className="flex items-center gap-2 text-amber-400 font-black uppercase tracking-widest text-[9px] bg-amber-500/10 px-2 py-1 rounded-md w-fit border border-amber-500/20">
                          <Clock size={12} /> Scheduled: {new Date(blog.scheduled_at!).toLocaleDateString()}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-[#34d399] font-black uppercase tracking-widest text-[9px] bg-[#34d399]/10 px-2 py-1 rounded-md w-fit border border-[#34d399]/20">
                          <Target size={12} /> Live Post
                        </div>
                      )}
                      <div className="text-[10px] text-white/30 font-bold uppercase tracking-tighter">
                        Created: {blog.created_at ? new Date(blog.created_at).toLocaleDateString() : 'Draft'}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onEdit(blog)}
                        className="p-2.5 text-[#34d399] hover:bg-[#34d399]/10 rounded-xl transition-all border border-transparent hover:border-[#34d399]/20 shadow-sm"
                        title="Edit Publication"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => onDelete('blogs', blog.id!)}
                        className="p-2.5 text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20 shadow-sm"
                        title="Delete Content"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
            );
          })}
          {blogs.length === 0 && (
            <tr>
              <td colSpan={5} className="px-8 py-24 text-center">
                <p className="text-white font-serif font-bold text-xl italic">The catalog is currently empty.</p>
                <p className="text-white/40 text-xs mt-2 uppercase tracking-widest font-black">Begin by publishing your first article.</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
