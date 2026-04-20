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
          // Use the robust checkIfAdmin helper from our service layer
          // This uses supabaseAdmin to bypass RLS and ensures ground truth
          const { checkIfAdmin } = await import('../services/supabaseService');
          const isUserAdmin = await checkIfAdmin(user.id, user.email);
          
          if (isUserAdmin) {
            // Fetch the specific role for UI customization
            const { supabaseAdmin } = await import('../supabase');
            const { data } = await supabaseAdmin.from('users').select('role').eq('email', user.email?.toLowerCase().trim()).single();
            setUserRole(data?.role || 'admin');
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } catch (err) {
          console.error("Critical Auth Verification Error:", err);
          setIsAdmin(false);
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
    const { collection, id } = itemToDelete;
    setError(null);
    
    try {
      const userEmail = user?.email || 'admin@yureka.money';

      console.log(`🗑️ Deleting from ${collection} (ID: ${id})`);

      // Use supabaseAdmin for deletions to ensure administrative actions always succeed
      const { error } = await supabaseAdmin.from(collection).delete().eq('id', id);
      
      if (error) {
        console.error("❌ Database Delete Error:", error);
        throw error;
      }

      // LOG THE DELETION (Fire and forget)
      supabase.from('audit_logs').insert([{
        user_email: userEmail,
        action: 'DELETE',
        table_name: collection,
        record_id: id,
        record_name: 'REMOVED_ITEM'
      }]).then();

    } catch (err: any) {
      console.error("💥 CRITICAL DELETE FAILURE:", err);
      showNotification(`Failed to delete: ${err.message || "Database error"}`, 'error');
    } finally {
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

    try {
      const userEmail = user?.email || 'admin@yureka.money';
      let payload: any = {};
      let collection = '';

      if (activeTab === 'blogs') {
        collection = 'blogs';
        // Generate a valid slug if missing
        const rawSlug = (blogForm.slug || blogForm.title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const finalSlug = editingItem ? blogForm.slug : (rawSlug || `journal-${Date.now()}`);
        
        // Construct a clean payload matching the DB schema exactly
        payload = {
          title: blogForm.title || 'Untitled Journal',
          excerpt: blogForm.excerpt || '',
          content: blogForm.content || '',
          author: blogForm.author || 'Yureka Editorial',
          category: blogForm.category || 'Credit Cards',
          image: blogForm.image || 'https://picsum.photos/seed/blog/800/600',
          slug: finalSlug,
          status: 'published',
          read_time: blogForm.read_time || '5 min read'
        };

        // Handle scheduling safely
        if (blogForm.publishMode === 'later' && blogForm.scheduled_at) {
          try {
            payload.scheduled_at = new Date(blogForm.scheduled_at).toISOString();
          } catch (e) {
            payload.scheduled_at = null;
          }
        } else {
          payload.scheduled_at = null;
        }

        payload = cleanData(payload);
      } 
      else if (activeTab === 'cards') {
        collection = 'cards';
        const cardPayload = { ...cardForm };
        if (!cardPayload.slug) {
          cardPayload.slug = generateSlug(cardPayload.name, cardPayload.bank) || `card-${Date.now()}`;
        }
        // Remove UI-specific or non-DB fields if any exist
        payload = cleanData(cardPayload);
      }
      else if (activeTab === 'reviews') {
        collection = 'reviews';
        payload = cleanData({
          author: reviewForm.author || '',
          role: reviewForm.role || '',
          company: reviewForm.company || '',
          company_logo: reviewForm.company_logo || '',
          image: reviewForm.image || '',
          quote: reviewForm.quote || '',
          status: reviewForm.status || 'published'
        });
      }
      else if (activeTab === 'settings') {
        collection = 'users';
        payload = editingItem 
          ? { role: teamForm.role } 
          : { 
              email: teamForm.email.toLowerCase().trim(), 
              role: teamForm.role, 
              full_name: teamForm.email.split('@')[0],
              created_at: new Date().toISOString()
            };
      }

      // Final Sanitization: Remove metadata that Supabase rejects on inserts/updates
      const finalPayload = { ...payload };
      delete finalPayload.id;
      delete finalPayload.created_at;
      delete finalPayload.updated_at;

      console.log(`📤 Saving to ${collection}:`, finalPayload);

      const isUpdate = !!editingItem;
      const recordId = editingItem?.id || 'new';
      const recordName = activeTab === 'blogs' ? blogForm.title : (activeTab === 'cards' ? cardForm.name : (activeTab === 'reviews' ? reviewForm.author : teamForm.email));

      // Use supabaseAdmin to bypass RLS and ensure reliability for admin users
      const query = isUpdate 
        ? supabaseAdmin.from(collection).update(finalPayload).eq('id', editingItem.id)
        : supabaseAdmin.from(collection).insert([finalPayload]);
      
      const { data, error: saveError } = await query.select();

      if (saveError) {
        console.error("❌ Database Save Error:", saveError);
        throw new Error(saveError.message || "Failed to save to database. Check your network or permissions.");
      }

      if (!data || data.length === 0) {
        throw new Error("The operation was successful, but the database did not return the new record. Try refreshing.");
      }

      const savedItem = data[0];

      // Update global state - SupabaseProvider listeners will also pick this up, 
      // but we update locally for immediate UX response.
      if (isUpdate) {
        if (collection === 'blogs') setBlogs(prev => prev.map(i => i.id === editingItem.id ? savedItem : i));
        else if (collection === 'cards') setCards(prev => prev.map(i => i.id === editingItem.id ? savedItem : i));
        else if (collection === 'reviews') setReviews(prev => prev.map(i => i.id === editingItem.id ? savedItem : i));
        else if (collection === 'users') setTeam(prev => prev.map(i => i.id === editingItem.id ? savedItem : i));
      } else {
        if (collection === 'blogs') setBlogs(prev => [savedItem, ...prev]);
        else if (collection === 'cards') setCards(prev => [savedItem, ...prev]);
        else if (collection === 'reviews') setReviews(prev => [savedItem, ...prev]);
        else if (collection === 'users') setTeam(prev => [savedItem, ...prev]);
      }

      showNotification(`${isUpdate ? 'Updated' : 'Created'} successfully!`);
      setIsModalOpen(false);
      setEditingItem(null);

      // Audit Logging (Fire and forget)
      supabase.from('audit_logs').insert([{
        user_email: userEmail,
        action: isUpdate ? 'UPDATE' : 'INSERT',
        table_name: collection,
        record_id: savedItem.id,
        record_name: recordName
      }]).then();

      // IF NEW TEAM MEMBER, SEND NOTIFICATION
      if (!isUpdate && activeTab === 'settings') {
        fetch("/api/notify-team-member", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: teamForm.email,
            role: teamForm.role,
            firstName: teamForm.email.split('@')[0]
          })
        }).then(res => res.json())
          .then(data => console.log("Notification status:", data))
          .catch(e => console.error("Notification failed:", e));
      }

    } catch (err: any) {
      console.error("💥 CRITICAL SAVE FAILURE:", err);
      setError(err.message || "An unexpected error occurred while saving.");
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
