import React, { useState, useEffect } from 'react';
import { useSupabase } from '../SupabaseProvider';
import { Trash2, RefreshCw, Loader2, RotateCcw, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api, isApiError } from '../../lib/api/client';

export const AdminTrashTab: React.FC = () => {
  const { user } = useSupabase();
  const [trashItems, setTrashItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get<any[]>('/api/v1/admin/trash');
      if (!isApiError(res)) setTrashItems(res.data ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRestore = async (id: string) => {
    if (!window.confirm("Restore this item to its original location?")) return;
    setProcessingId(id);
    try {
      const res = await api.post(`/api/v1/admin/trash/${id}/restore`, {});
      if (isApiError(res)) throw new Error(res.error);
      await loadData();
    } catch (e: any) {
      alert("Failed to restore: " + e.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Permanently delete this item? This action cannot be undone.")) return;
    setProcessingId(id);
    try {
      const res = await api.delete(`/api/v1/admin/trash/${id}`);
      if (isApiError(res)) throw new Error(res.error);
      await loadData();
    } catch (e: any) {
      alert("Failed to delete: " + e.message);
    } finally {
      setProcessingId(null);
    }
  };

  const filteredItems = filter === 'all' ? trashItems : trashItems.filter(i => i.entityType === filter);

  const getEntityTitle = (item: any) => {
    const p = item.payload;
    if (!p) return 'Unknown';
    if (item.entityType === 'blog') return p.title || p.heading || 'Blog Post';
    if (item.entityType === 'card') return p.name || 'Card';
    if (item.entityType === 'notification') return p.title || 'Notification';
    if (item.entityType === 'user' || item.entityType === 'waitlist') return p.full_name || p.email || 'User';
    if (item.entityType === 'review') return p.author || 'Review';
    return item.originalId;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-black text-white uppercase tracking-tight flex items-center gap-3">
            <Trash2 className="text-clay" /> Recycle Bin
          </h2>
          <p className="text-sm text-white/40 mt-1">Restore or permanently delete removed entities.</p>
        </div>
        <button onClick={loadData} className="bg-white/5 p-3 rounded-xl hover:bg-white/10 text-white transition-colors">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 dashboard-scroll">
        {['all', 'blog', 'card', 'notification', 'user', 'waitlist', 'review'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-colors ${filter === f ? 'bg-clay text-black' : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-12 flex justify-center"><Loader2 size={24} className="animate-spin text-clay" /></div>
      ) : filteredItems.length === 0 ? (
        <div className="p-12 text-center border border-white/5 rounded-2xl bg-white/[0.02]">
          <p className="text-white/40 text-sm">Trash is empty.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence>
            {filteredItems.map(item => (
              <motion.div 
                key={item.id} 
                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="p-6 rounded-2xl border bg-[#111] border-white/10 flex flex-col md:flex-row gap-6 md:items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-clay/10 text-clay uppercase font-bold">{item.entityType}</span>
                    <h4 className="font-bold text-white text-lg">{getEntityTitle(item)}</h4>
                  </div>
                  <p className="text-[10px] text-white/40 font-mono mt-2">ID: {item.originalId}</p>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest font-mono mt-1">Deleted: {new Date(item.deletedAt).toLocaleString()} • By {item.deletedBy || 'Unknown'}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button 
                    onClick={() => handleRestore(item.id)}
                    disabled={processingId === item.id}
                    title="Restore to active"
                    className="px-4 py-2 bg-clay/10 text-clay rounded-xl hover:bg-clay hover:text-black transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
                  >
                    {processingId === item.id ? <Loader2 size={14} className="animate-spin" /> : <RotateCcw size={14} />}
                    Restore
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    disabled={processingId === item.id}
                    title="Permanently Delete"
                    className="p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <AlertTriangle size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
