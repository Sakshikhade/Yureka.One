import React from 'react';
import { 
  Edit2, 
  Trash2, 
  Clock 
} from 'lucide-react';
import { Blog } from '../../types';
import { useSupabase } from '../SupabaseProvider';
import { SkeletonTable } from '../SkeletonLoaders';

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
    <div className="overflow-x-auto">
      <table className="w-full text-left min-w-[800px]">
        <thead className="bg-black/5 text-[10px] uppercase font-bold tracking-widest text-black/40">
          <tr>
            <th className="px-6 py-4">Title</th>
            <th className="px-6 py-4">Category</th>
            <th className="px-6 py-4">Author</th>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/5">
          {blogs.map(blog => (
            <tr key={blog.id} className="hover:bg-black/[0.01] transition-colors">
              <td className="px-6 py-4 font-bold text-sm">{blog.title}</td>
              <td className="px-6 py-4 text-sm text-black/60">{blog.category}</td>
              <td className="px-6 py-4 text-sm text-black/60">{blog.author}</td>
              <td className="px-6 py-4 text-sm text-black/60">
                {blog.scheduled_at && new Date(blog.scheduled_at) > new Date() ? (
                  <span className="flex items-center gap-1.5 text-amber-600 font-bold uppercase tracking-widest text-[9px]">
                    <Clock size={10} /> Scheduled: {new Date(blog.scheduled_at).toLocaleDateString()}
                  </span>
                ) : blog.created_at ? (
                  new Date(blog.created_at).toLocaleDateString()
                ) : (
                  'N/A'
                )}
              </td>
              <td className="px-6 py-4 text-right space-x-2">
                <button 
                  onClick={() => onEdit(blog)}
                  className="p-2 text-teal hover:bg-teal/10 rounded-lg transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => onDelete('blogs', blog.id!)}
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
