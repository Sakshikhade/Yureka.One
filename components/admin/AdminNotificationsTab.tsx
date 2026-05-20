import React, { useState, useEffect } from 'react';
import { useSupabase } from '../SupabaseProvider';
import { 
  BellRing, Plus, Archive, ExternalLink, RefreshCw, 
  Eye, MousePointerClick, CheckCircle2, AlertTriangle, Loader2, Copy, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  createNotification, fetchAllNotificationsAdmin, fetchNotificationInteractionsAdmin, 
  archiveNotification, deleteNotification, updateNotification 
} from '../../services/supabaseService';

const VariableItem = ({ tag, desc }: { tag: string, desc: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(tag);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <li className="bg-black/40 p-3 rounded-lg border border-white/5 flex items-center justify-between group">
      <div>
        <code className="text-clay font-mono text-xs">{tag}</code>
        <p className="text-white/40 text-[10px] uppercase tracking-wider mt-1">{desc}</p>
      </div>
      <button 
        onClick={handleCopy}
        type="button"
        title="Copy variable"
        className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-colors"
      >
        {copied ? <Check size={14} className="text-clay" /> : <Copy size={14} />}
      </button>
    </li>
  );
};

export const AdminNotificationsTab: React.FC = () => {
  const { user } = useSupabase();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [interactions, setInteractions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isComposing, setIsComposing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [form, setForm] = useState({ title: '', message: '', type: 'info', image_url: '' });
  const [uploading, setUploading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [notifs, inters] = await Promise.all([
        fetchAllNotificationsAdmin(),
        fetchNotificationInteractionsAdmin()
      ]);
      setNotifications(notifs || []);
      setInteractions(inters || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      // We need supabaseAdmin. Dynamically importing it to avoid cyclic dependencies if any, 
      // or just using regular supabase. Admin tab has RLS bypass if needed.
      const { supabaseAdmin } = await import('../../supabase');
      const path = `notifications/${Date.now()}_${file.name}`;
      const { data, error } = await supabaseAdmin.storage.from('media').upload(path, file);
      if (error) throw error;
      const { data: publicUrlData } = supabaseAdmin.storage.from('media').getPublicUrl(data.path);
      setForm(prev => ({ ...prev, image_url: publicUrlData.publicUrl }));
    } catch (err: any) {
      alert(`Image upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.message) return;
    
    setSubmitting(true);
    try {
      if (editingId) {
        await updateNotification(editingId, {
          title: form.title,
          message: form.message,
          type: form.type,
          image_url: form.image_url
        });
      } else {
        await createNotification({
          title: form.title,
          message: form.message,
          type: form.type,
          created_by: user?.email || 'Admin',
          image_url: form.image_url
        });
      }
      setIsComposing(false);
      setEditingId(null);
      setForm({ title: '', message: '', type: 'info', image_url: '' });
      await loadData();
    } catch (err) {
      alert("Failed to save notification.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleArchive = async (id: string) => {
    if (!window.confirm("Archive this notification? It will no longer show up for users.")) return;
    try {
      await archiveNotification(id);
      await loadData();
    } catch (e) {
      alert("Failed to archive");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Permanently delete this notification? It will be moved to Trash.")) return;
    try {
      await deleteNotification(id, user?.email || 'Admin');
      await loadData();
    } catch (e) {
      alert("Failed to delete notification");
    }
  };

  const handleEdit = (n: any) => {
    setForm({ title: n.title, message: n.message, type: n.type, image_url: n.image_url || '' });
    setEditingId(n.id);
    setIsComposing(true);
  };

  const getStats = (id: string) => {
    const relevant = interactions.filter(i => i.notification_id === id);
    const reads = relevant.filter(i => i.action === 'read').length;
    const clicks = relevant.filter(i => i.action === 'clicked').length;
    return { reads, clicks };
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-black text-white uppercase tracking-tight">Notification Engine</h2>
          <p className="text-sm text-white/40 mt-1">Broadcast personalized, dynamic notifications to all users.</p>
        </div>
        <button 
          onClick={() => setIsComposing(!isComposing)}
          className="bg-clay text-black px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform flex items-center gap-2"
        >
          {isComposing ? <Eye size={14} /> : <Plus size={14} />} 
          {isComposing ? 'View History' : 'Compose Broadcast'}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isComposing ? (
          <motion.div 
            key="compose"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="grid lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 bg-[#111] p-8 rounded-3xl border border-white/5 shadow-2xl">
              <h3 className="text-clay font-black tracking-widest uppercase text-sm mb-6 flex items-center gap-2">
                <BellRing size={16} /> Compose New Push
              </h3>
              
              <form onSubmit={handleSend} className="space-y-6">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-white/40 mb-2">Notification Title</label>
                  <input 
                    type="text" required
                    value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                    placeholder="e.g. Your monthly snapshot is ready!"
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clay/50 font-sans"
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] uppercase font-bold text-white/40 mb-2">Message Body (Supports Variables)</label>
                  <textarea 
                    required rows={5}
                    value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                    placeholder="Hello {{user_name}}, you spent {{total_expenses}} this month on your {{card_name}}..."
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clay/50 font-sans resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-white/40 mb-2">Notification Image (Optional)</label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="file" accept="image/*"
                      onChange={handleFileUpload}
                      className="text-sm text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-white/10 file:text-white hover:file:bg-white/20 transition-colors w-full"
                    />
                    {uploading && <Loader2 size={20} className="animate-spin text-clay shrink-0" />}
                  </div>
                  {form.image_url && (
                    <div className="mt-4 relative w-32 h-20 rounded-xl overflow-hidden border border-white/10">
                      <img src={form.image_url} alt="Notification" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => setForm({...form, image_url: ''})}
                        className="absolute top-1 right-1 w-6 h-6 bg-black/50 hover:bg-red-500 rounded-full flex items-center justify-center text-white text-xs transition-colors"
                      >✕</button>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <label className="flex-1">
                    <span className="block text-[10px] uppercase font-bold text-white/40 mb-2">Type</span>
                    <select 
                      value={form.type} onChange={e => setForm({...form, type: e.target.value})}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clay/50 font-sans appearance-none"
                    >
                      <option value="info">Information (Blue)</option>
                      <option value="success">Success (Green)</option>
                      <option value="alert">Alert (Red)</option>
                    </select>
                  </label>
                </div>

                <div className="flex gap-4">
                  {editingId && (
                    <button 
                      type="button" onClick={() => { setIsComposing(false); setEditingId(null); setForm({ title: '', message: '', type: 'info', image_url: '' }); }}
                      className="w-1/3 bg-white/10 text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                    >
                      Cancel
                    </button>
                  )}
                  <button 
                    type="submit" disabled={submitting}
                    className="flex-1 bg-clay text-black py-4 rounded-xl font-black uppercase tracking-[0.2em] hover:bg-clay/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {submitting ? <Loader2 size={16} className="animate-spin" /> : (editingId ? 'Update Broadcast' : 'Launch Broadcast')}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-clay/5 border border-clay/20 p-8 rounded-3xl h-fit">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <AlertTriangle size={18} className="text-clay" /> Variables Cheat Sheet
              </h3>
              <p className="text-sm text-white/60 mb-6">You can inject live user data into the message using these double-bracket variables. They will be resolved client-side.</p>
              
              <ul className="space-y-4">
                {[
                  { tag: '{{user_name}}', desc: "First name of the user" },
                  { tag: '{{total_expenses}}', desc: "Formatted INR sum of transactions" },
                  { tag: '{{total_bills}}', desc: "Formatted INR sum of bills" },
                  { tag: '{{card_name}}', desc: "Name of their primary active card" }
                ].map(v => (
                  <VariableItem key={v.tag} tag={v.tag} desc={v.desc} />
                ))}
              </ul>
            </div>
          </motion.div>
        ) : (
          <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-clay font-black tracking-widest uppercase text-sm">Broadcast History</h3>
              <button onClick={loadData} className="text-white/40 hover:text-white p-2"><RefreshCw size={16} className={loading ? 'animate-spin' : ''} /></button>
            </div>

            {loading ? (
              <div className="p-12 flex justify-center"><Loader2 size={24} className="animate-spin text-clay" /></div>
            ) : notifications.length === 0 ? (
              <div className="p-12 text-center border border-white/5 rounded-2xl bg-white/[0.02]">
                <p className="text-white/40 text-sm">No broadcasts found.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {notifications.map(n => {
                  const stats = getStats(n.id);
                  return (
                    <div key={n.id} className={`p-6 rounded-2xl border ${n.status === 'active' ? 'bg-[#111] border-white/10' : 'bg-black/50 border-white/5 opacity-60'} flex flex-col md:flex-row gap-6 md:items-center justify-between`}>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className={`w-2 h-2 rounded-full ${n.status === 'active' ? 'bg-clay shadow-[0_0_10px_#21deb3]' : 'bg-white/20'}`} />
                          <h4 className="font-bold text-white text-lg">{n.title}</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40 uppercase font-bold">{n.type}</span>
                        </div>
                        <p className="text-sm text-white/60 mb-2">{n.message}</p>
                        {n.image_url && (
                          <div className="mb-3 w-32 h-20 rounded-lg overflow-hidden border border-white/5 relative">
                            <img src={n.image_url} alt="Notification media" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <p className="text-[10px] text-white/30 uppercase tracking-widest font-mono">Sent: {new Date(n.created_at).toLocaleString()} • By {n.created_by}</p>
                      </div>

                      <div className="flex items-center gap-8 shrink-0">
                        <div className="text-center">
                          <span className="block text-2xl font-black text-white">{stats.reads}</span>
                          <span className="text-[9px] uppercase tracking-widest text-white/40 flex items-center gap-1 justify-center"><Eye size={10} /> Reads</span>
                        </div>
                        <div className="text-center">
                          <span className="block text-2xl font-black text-clay">{stats.clicks}</span>
                          <span className="text-[9px] uppercase tracking-widest text-white/40 flex items-center gap-1 justify-center"><MousePointerClick size={10} /> Clicks</span>
                        </div>
                        
                        {n.status === 'active' && (
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleEdit(n)}
                              title="Edit Notification"
                              className="p-3 bg-white/5 text-white/60 rounded-xl hover:bg-white/10 hover:text-white transition-colors"
                            >
                              <CheckCircle2 size={16} className="hidden" /> {/* Using CheckCircle2 icon place holder? We need an Edit icon or just use Plus text */}
                              Edit
                            </button>
                            <button 
                              onClick={() => handleArchive(n.id)}
                              title="Archive (Hide from users)"
                              className="p-3 bg-white/5 text-white/60 rounded-xl hover:bg-white/10 hover:text-white transition-colors"
                            >
                              <Archive size={16} />
                            </button>
                            <button 
                              onClick={() => handleDelete(n.id)}
                              title="Delete (Move to Trash)"
                              className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors"
                            >
                              <AlertTriangle size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
