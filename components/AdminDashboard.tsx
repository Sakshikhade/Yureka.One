import React, { useState, useEffect, useRef } from 'react';
import { supabase, supabaseAdmin } from '../supabase';
import { 
  Zap,
  Loader2,
  Trash2,
  Check,
  X,
  AlertCircle,
  LayoutDashboard
} from 'lucide-react';
import { 
  addBlog, updateBlog, deleteBlog,
  addCard, updateCard, deleteCard,
  deleteWaitlistEntry, updateWaitlistStatus,
  inviteTeamMember, updateUserRole, deleteUser,
  addReview, updateReview, deleteReview,
  withRetry, cleanData
} from '../services/supabaseService';
import { Blog, Card, WaitlistEntry, Review } from '../types';
import { useSupabase } from './SupabaseProvider';

// Admin Sub-components
import { AdminHeader } from './admin/AdminHeader';
import { AdminSidebar } from './admin/AdminSidebar';
import { AdminBlogsTab } from './admin/AdminBlogsTab';
import { AdminCardsTab } from './admin/AdminCardsTab';
import { AdminReviewsTab } from './admin/AdminReviewsTab';
import { AdminWaitlistTab } from './admin/AdminWaitlistTab';
import { AdminSettingsTab } from './admin/AdminSettingsTab';
import { AdminLogsTab } from './admin/AdminLogsTab';
import { AdminModals } from './admin/AdminModals';

const ADMIN_BANKS = [
  'HDFC', 'SBI', 'ICICI', 'Axis', 'Kotak', 'Yes Bank', 'RBL', 'Amex',
  'IndusInd', 'BOB', 'SC', 'IDFC', 'AU', 'Federal', 'SBM', 'IDBI'
];

const ADMIN_CATEGORIES = [
  'Travel', 'Hotels', 'Cashback', 'Brand Voucher', 'Fuel',
  'Shopping', 'Dining', 'Lounge Access', 'Lifetime Free', 'Business', 'UPI',
  'Travel Bookings', 'Catalogue Products', 'Experience'
];
const DEFAULT_BLOG_FORM = {
  title: '', slug: '', excerpt: '', content: '', author: '', category: 'Credit Cards',
  image: 'https://picsum.photos/seed/blog/800/600', read_time: '5 min read',
  featured: false, status: 'published', publishMode: 'now', scheduled_at: ''
};

const DEFAULT_CARD_FORM = {
  name: '', bank: '', issuer: '', type: 'Rewards', image: 'https://picsum.photos/seed/card/400/250',
  rating: 4.5, elite_rating: 4.5, benefits: [''], benefit_items: [{ heading: '', subheading: '' }],
  verdict: '', slug: '', apply_link: '', annual_fee: '₹0', joining_fee: '₹0', intro_offer: '',
  best_for: 'Shopping', category: 'Shopping', categories: [] as string[],
  color: 'from-blue-600 to-indigo-700', rewards_rate: '5%', projected_savings: '₹12,000/yr', status: 'published'
};

const DEFAULT_REVIEW_FORM: Partial<Review> = {
  author: '', role: '', company: '', company_logo: '', image: 'https://picsum.photos/seed/review/300/400',
  quote: '', rotation: 0, status: 'published'
};

const DEFAULT_TEAM_FORM = { email: '', role: 'writer' };

import { motion, AnimatePresence } from 'motion/react';


const AdminDashboard: React.FC = () => {
  const { 
    syncStatus, isLoading, refreshAll, 
    setCards, setBlogs, setReviews, setWaitlist, setTeam 
  } = useSupabase();

  // --- Auth & Role State ---
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>('user');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'blogs' | 'cards' | 'waitlist' | 'settings' | 'logs' | 'reviews'>(
    (localStorage.getItem('yureka_admin_tab') as any) || 'blogs'
  );
  const [waitlistFilter, setWaitlistFilter] = useState<'pending' | 'accepted' | 'rejected' | 'on_hold' | 'all'>('pending');

  useEffect(() => {
    localStorage.setItem('yureka_admin_tab', activeTab);
    setError(null);
  }, [activeTab]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Form States ---
  const [blogForm, setBlogForm] = useState(JSON.parse(JSON.stringify(DEFAULT_BLOG_FORM)));
  const [cardForm, setCardForm] = useState(JSON.parse(JSON.stringify(DEFAULT_CARD_FORM)));
  const [reviewForm, setReviewForm] = useState<Review>(JSON.parse(JSON.stringify(DEFAULT_REVIEW_FORM)) as Review);
  const [teamForm, setTeamForm] = useState(JSON.parse(JSON.stringify(DEFAULT_TEAM_FORM)));

  // --- Modal States ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{collection: string, id: string} | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // --- Helpers ---
  const formatDateForInput = (isoString?: string | null) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const tzOffset = date.getTimezoneOffset() * 60000;
    return (new Date(date.getTime() - tzOffset)).toISOString().slice(0, 16);
  };

  const generateSlug = (name: string, bank: string) => {
      return `${name}-${bank}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  // --- Core Auth Logic ---
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user || null;
      setUser(user);
      if (user) {
        try {
          const { data } = await supabase.from('users').select('role').eq('email', user.email).single();
          const fetchedRole = data?.role || 'user';
          const isOwner = ['toanweshbiswas@gmail.com', 'buildwithjupyter.network@gmail.com'].includes(user.email);
          const role = isOwner ? 'admin' : fetchedRole;
          setUserRole(role);
          setIsAdmin(isOwner || ['admin', 'editor', 'writer'].includes(role));
        } catch (err) {
          console.error("Role fetch error:", err);
          if (['toanweshbiswas@gmail.com'].includes(user.email)) { setIsAdmin(true); setUserRole('admin'); }
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => { await supabase.auth.signOut(); };
  const handleLogin = async () => {
    // Dynamically detect the correct production URL
    const isCustomDomain = window.location.hostname === 'yureka.money';
    const productionUrl = isCustomDomain 
      ? 'https://yureka.money/admin' 
      : 'https://yurekamoney.netlify.app/admin';
    
    const devUrl = window.location.origin + '/admin';
    const isLocal = window.location.hostname === 'localhost';

    await supabase.auth.signInWithOAuth({ 
      provider: 'google', 
      options: { 
        redirectTo: isLocal ? devUrl : productionUrl 
      } 
    });
  };



  // --- CRUD Handlers ---
  const handleEdit = (item: any) => {
    setEditingItem(item);
    if (activeTab === 'blogs') {
      setBlogForm({
        ...item,
        publishMode: (item.scheduled_at && new Date(item.scheduled_at) > new Date()) ? 'later' : 'now',
        scheduled_at: formatDateForInput(item.scheduled_at)
      });
    } else if (activeTab === 'cards') {
      setCardForm({ 
        ...JSON.parse(JSON.stringify(DEFAULT_CARD_FORM)), 
        ...item,
        benefit_items: item.benefit_items || [{ heading: '', subheading: '' }]
      });
    } else if (activeTab === 'reviews') {
      setReviewForm({ ...JSON.parse(JSON.stringify(DEFAULT_REVIEW_FORM)), ...item });
    } else if (activeTab === 'settings') {
      setTeamForm({ email: item.email, role: item.role });
    }
    setIsModalOpen(true);
    setError(null);
  };

  const confirmDelete = (collection: string, id: string) => {
    setItemToDelete({ collection, id });
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    
    // CAPTURE SNAPSHOT FOR ROLLBACK
    let rollbackData: any[] = [];
    const collection = itemToDelete.collection;
    const id = itemToDelete.id;

    // OPTIMISTIC UPDATE
    if (collection === 'blogs') {
      setBlogs(prev => { rollbackData = [...prev]; return prev.filter(i => i.id !== id); });
    } else if (collection === 'cards') {
      setCards(prev => { rollbackData = [...prev]; return prev.filter(i => i.id !== id); });
    } else if (collection === 'reviews') {
      setReviews(prev => { rollbackData = [...prev]; return prev.filter(i => i.id !== id); });
    } else if (collection === 'users') {
      setTeam(prev => { rollbackData = [...prev]; return prev.filter(i => i.id !== id); });
    } else if (collection === 'waitlist') {
      setWaitlist(prev => { rollbackData = [...prev]; return prev.filter(i => i.id !== id); });
    }

    setIsDeleteModalOpen(false);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const userEmail = user?.email || 'admin@yureka.money';

      const deletePromise = async () => {
        // Use supabaseAdmin for deletions to bypass RLS/session issues in admin panel
        const { error } = await supabaseAdmin.from(collection).delete().eq('id', id);
        if (error) throw error;
        return { data: true, error: null };
      };

      await Promise.race([
        withRetry(deletePromise), 
        new Promise((_, reject) => setTimeout(() => reject(new Error("Operation timed out while deleting.")), 15000))
      ]);

      // LOG THE DELETION (Non-blocking)
      supabase.from('audit_logs').insert([{
        user_email: userEmail,
        action: 'DELETE',
        table_name: collection,
        record_id: id,
        record_name: 'REMOVED_ITEM'
      }]).then();

      showNotification(`${collection.toUpperCase()} item deleted successfully.`);
      setItemToDelete(null);

    } catch (err: any) {
      console.error("DELETE FAILURE:", err);
      // ROLLBACK
      if (collection === 'blogs') setBlogs(rollbackData);
      else if (collection === 'cards') setCards(rollbackData);
      else if (collection === 'reviews') setReviews(rollbackData);
      else if (collection === 'users') setTeam(rollbackData);
      else if (collection === 'waitlist') setWaitlist(rollbackData);

      showNotification(`Failed to delete: ${err.message || "Permissions error"}`, 'error');
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const type = activeTab === 'blogs' ? 'blogs' : activeTab === 'cards' ? 'cards' : 'reviews';
      const path = `${type}/${Date.now()}_${file.name}`;
      const { data, error } = await supabaseAdmin.storage.from('media').upload(path, file);
      if (error) throw error;
      const { data: publicUrlData } = supabaseAdmin.storage.from('media').getPublicUrl(data.path);
      const url = publicUrlData.publicUrl;
      if (activeTab === 'blogs') setBlogForm(prev => ({ ...prev, image: url }));
      else if (activeTab === 'cards') setCardForm(prev => ({ ...prev, image: url }));
      else if (activeTab === 'reviews') setReviewForm(prev => ({ ...prev, image: url }));
    } catch (err: any) {
      setError(`Image upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Operation timed out (8s). The data might still be saving in the background.")), 8000)
    );

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const userEmail = user?.email || 'admin@yureka.money';

      // ENFORCE TIMEOUT ON SAVING
      const saveAction = async () => {
        let payload: any = {};
        let collection = '';

        if (activeTab === 'blogs') {
          collection = 'blogs';
          const timestampedSlug = blogForm.slug || `${blogForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Math.random().toString(36).substring(7)}`;
          payload = cleanData({
            ...blogForm,
            title: blogForm.title || 'Untitled Journal',
            slug: editingItem ? blogForm.slug : timestampedSlug,
            author: blogForm.author || 'Yureka Editorial',
            category: blogForm.category || 'Credit Cards',
            image: blogForm.image || 'https://picsum.photos/seed/blog/800/600',
            status: 'published',
            read_time: blogForm.read_time || '5 min read',
            scheduled_at: (blogForm.publishMode === 'later' && blogForm.scheduled_at) ? new Date(blogForm.scheduled_at).toISOString() : null
          });
        } 
        else if (activeTab === 'cards') {
          collection = 'cards';
          // Ensure a slug exists if empty
          const cardPayload = { ...cardForm };
          if (!cardPayload.slug) {
            cardPayload.slug = generateSlug(cardPayload.name, cardPayload.bank) || `card-${Date.now()}`;
          }
          payload = cleanData(cardPayload);
        }
        else if (activeTab === 'reviews') {
          collection = 'reviews';
          payload = cleanData(reviewForm);
        }
        else if (activeTab === 'settings') {
          collection = 'users';
          payload = editingItem 
            ? { role: teamForm.role } 
            : { email: teamForm.email, role: teamForm.role, full_name: teamForm.email.split('@')[0] };
        }

        // METADATA STRIPPING FOR UPDATES/INSERTS
        const finalPayload = { ...payload };
        delete finalPayload.id;
        delete finalPayload.created_at;
        delete finalPayload.updated_at;

        // OPTIMISTIC UPDATE FOR EDITS (Visual only, listener will sync true state)
        if (editingItem) {
          if (collection === 'blogs') setBlogs(prev => prev.map(i => i.id === editingItem.id ? { ...i, ...finalPayload } : i));
          else if (collection === 'cards') setCards(prev => prev.map(i => i.id === editingItem.id ? { ...i, ...finalPayload } : i));
          else if (collection === 'reviews') setReviews(prev => prev.map(i => i.id === editingItem.id ? { ...i, ...finalPayload } : i));
          else if (collection === 'users') setTeam(prev => prev.map(i => i.id === editingItem.id ? { ...i, ...finalPayload } : i));
        }

        const execute = async () => {
          // Use supabaseAdmin to ensure administrative actions always succeed bypasssing RLS
          const query = editingItem 
            ? supabaseAdmin.from(collection).update(finalPayload).eq('id', editingItem.id)
            : supabaseAdmin.from(collection).insert([finalPayload]);
          
          const { data, error: saveError } = await query.select();
          return { data, error: saveError };
        };

        const resultData = await withRetry(execute);

        if (!resultData || resultData.length === 0) {
          throw new Error("The operation completed but no data was returned from the database.");
        }

        // FOR INSERTS, PUSH TO LOCAL STATE
        if (!editingItem) {
           const newItem = resultData[0];
           if (collection === 'blogs') setBlogs(prev => [newItem, ...prev]);
           else if (collection === 'cards') setCards(prev => [newItem, ...prev]);
           else if (collection === 'reviews') setReviews(prev => [newItem, ...prev]);
           else if (collection === 'users') setTeam(prev => [newItem, ...prev]);
        }
        
        return resultData;
      };

      const isUpdate = !!editingItem;
      const recordId = editingItem?.id || 'new';
      const recordName = activeTab === 'blogs' ? blogForm.title : (activeTab === 'cards' ? cardForm.name : (activeTab === 'reviews' ? reviewForm.author : teamForm.email));

      await Promise.race([
        saveAction(), 
        new Promise((_, reject) => setTimeout(() => reject(new Error("The save operation is taking longer than expected (15s). Please check your connection.")), 15000))
      ]);

      showNotification(`${isUpdate ? 'Updated' : 'Created'} successfully!`);
      setIsModalOpen(false);
      setEditingItem(null);

      // LOG THE ACTION (Fire and forget)
      supabase.from('audit_logs').insert([{
        user_email: userEmail,
        action: isUpdate ? 'UPDATE' : 'INSERT',
        table_name: activeTab,
        record_id: recordId,
        record_name: recordName
      }]).then();

    } catch (err: any) {
      console.error("SAVE FAILURE:", err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };


  const getAddAction = () => {
    if (!['blogs', 'cards', 'reviews', 'settings'].includes(activeTab)) return undefined;
    
    return () => {
       setEditingItem(null);
      if (activeTab === 'blogs') setBlogForm(JSON.parse(JSON.stringify(DEFAULT_BLOG_FORM)));
      else if (activeTab === 'cards') setCardForm(JSON.parse(JSON.stringify(DEFAULT_CARD_FORM)));
      else if (activeTab === 'reviews') setReviewForm(JSON.parse(JSON.stringify(DEFAULT_REVIEW_FORM)) as Review);
      else if (activeTab === 'settings') setTeamForm(JSON.parse(JSON.stringify(DEFAULT_TEAM_FORM)));
      setError(null);
      setIsModalOpen(true);
    };
  };

  const getAddLabel = () => {
    if (activeTab === 'settings') return 'Invite Member';
    return `Add ${activeTab.slice(0, -1)}`;
  };

  if (loading) {
    return <div className="min-h-screen bg-cream flex items-center justify-center"><Loader2 className="animate-spin text-teal" size={48} /></div>;
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-12 rounded-3xl shadow-xl border border-black/5 text-center">
          <LayoutDashboard className="mx-auto mb-6 text-teal" size={64} />
          <h1 className="text-3xl font-heading font-black mb-4 uppercase">Admin Access Required</h1>
          <p className="text-black/60 mb-8 text-sm font-sans font-medium">Please sign in with an authorized account to access the Yureka control plane.</p>

          <button onClick={handleLogin} className="w-full bg-teal text-white py-4 rounded-xl font-bold hover:bg-teal/90 transition-all flex items-center justify-center gap-2">Sign in with Google</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50/50 selection:bg-teal/10">
      <AdminSidebar 
        user={user} userRole={userRole} activeTab={activeTab} isSidebarOpen={isSidebarOpen}
        onTabChange={setActiveTab} onLogout={handleLogout} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader 
          user={user} activeTab={activeTab} 
          onLogout={handleLogout} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          onAdd={getAddAction()}
          addLabel={getAddLabel()}
        />

        <main className="flex-1 p-4 md:p-10">
            <div className="max-w-7xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-[2.5rem] border border-black/5 shadow-2xl shadow-black/[0.02] overflow-hidden min-h-[70vh] flex flex-col"
                >
                  {activeTab === 'blogs' && <AdminBlogsTab onEdit={handleEdit} onDelete={confirmDelete} formatDateForInput={formatDateForInput} />}
                  {activeTab === 'cards' && <AdminCardsTab onEdit={handleEdit} onDelete={confirmDelete} />}
                  {activeTab === 'reviews' && <AdminReviewsTab onEdit={handleEdit} onDelete={confirmDelete} />}
                  {activeTab === 'waitlist' && <AdminWaitlistTab filter={waitlistFilter} onFilterChange={setWaitlistFilter} onUpdateStatus={updateWaitlistStatus} onDelete={confirmDelete} />}
                  {activeTab === 'settings' && (
                    <AdminSettingsTab 
                      onAddMember={getAddAction()!} 
                      onEditMember={handleEdit} 
                      onDeleteMember={confirmDelete} 
                    />
                  )}
                  {activeTab === 'logs' && <AdminLogsTab />}
                </motion.div>
              </AnimatePresence>
            </div>
        </main>
      </div>

      <AdminModals 
        isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} activeTab={activeTab} editingItem={editingItem}
        isDeleteModalOpen={isDeleteModalOpen} setIsDeleteModalOpen={setIsDeleteModalOpen} onDeleteConfirm={handleDeleteConfirm}
        onSave={handleSave} onFileUpload={handleFileUpload}
        forms={{ blog: blogForm, card: cardForm, review: reviewForm, team: teamForm }}
        setForms={{ setBlog: setBlogForm, setCard: setCardForm, setReview: setReviewForm, setTeam: setTeamForm }}
        helpers={{ banks: ADMIN_BANKS, categories: ADMIN_CATEGORIES, generateSlug, uploading, saving, error }}
      />

      {/* PREMIUM TOAST NOTIFICATION */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
            className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] backdrop-blur-3xl border flex items-center gap-5 min-w-[340px] max-w-[90vw] ${
              notification.type === 'success' 
                ? 'bg-ink/90 border-teal/20 text-white' 
                : 'bg-red-600/90 border-red-400/20 text-white'
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center relative ${
              notification.type === 'success' ? 'bg-teal/20 text-teal-300' : 'bg-white/20 text-white'
            }`}>
              {notification.type === 'success' && <div className="absolute inset-0 rounded-full border border-teal/40 animate-ping" />}
              {notification.type === 'success' ? '✓' : '!'}
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 leading-none mb-1">
                {notification.type === 'success' ? 'System Optimized' : 'Security Alert'}
              </span>
              <span className="text-sm font-bold tracking-tight leading-tight">{notification.message}</span>
            </div>
            <button 
              onClick={() => setNotification(null)}
              className="text-white/20 hover:text-white transition-colors"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
