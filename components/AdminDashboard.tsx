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
  addReview, updateReview, deleteReview
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


import { motion, AnimatePresence } from 'motion/react';


const AdminDashboard: React.FC = () => {
  const { syncStatus, isLoading, refreshAll } = useSupabase();

  // --- Auth & Role State ---
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>('user');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'blogs' | 'cards' | 'waitlist' | 'settings' | 'logs' | 'reviews'>(
    (localStorage.getItem('yureka_admin_tab') as any) || 'blogs'
  );

  useEffect(() => {
    localStorage.setItem('yureka_admin_tab', activeTab);
    setError(null);
  }, [activeTab]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Form States ---
  const [blogForm, setBlogForm] = useState({
    title: '', slug: '', excerpt: '', content: '', author: '', category: 'Credit Cards',
    image: 'https://picsum.photos/seed/blog/800/600', read_time: '5 min read',
    featured: false, status: 'published', publishMode: 'now', scheduled_at: ''
  });

  const defaultCardForm = {
    name: '', bank: '', issuer: '', type: 'Rewards', image: 'https://picsum.photos/seed/card/400/250',
    rating: 4.5, elite_rating: 4.5, benefits: [''], benefit_items: [{ heading: '', subheading: '' }],
    verdict: '', slug: '', apply_link: '', annual_fee: '₹0', joining_fee: '₹0',
    best_for: 'Shopping', category: 'Shopping', categories: [] as string[],
    color: 'from-blue-600 to-indigo-700', rewards_rate: '5%', projected_savings: '₹12,000/yr', status: 'published'
  };
  const [cardForm, setCardForm] = useState(defaultCardForm);

  const defaultReviewForm: Review = {
    author: '', role: '', company: '', company_logo: '', image: 'https://picsum.photos/seed/review/300/400',
    quote: '', rotation: 0, status: 'published'
  };
  const [reviewForm, setReviewForm] = useState<Review>(defaultReviewForm);

  const [teamForm, setTeamForm] = useState({ email: '', role: 'writer' });

  // --- Modal States ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{collection: string, id: string} | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

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
      setCardForm({ ...defaultCardForm, ...item });
    } else if (activeTab === 'reviews') {
      setReviewForm({ ...defaultReviewForm, ...item });
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
    try {
      if (itemToDelete.collection === 'blogs') await deleteBlog(itemToDelete.id);
      else if (itemToDelete.collection === 'cards') await deleteCard(itemToDelete.id);
      else if (itemToDelete.collection === 'waitlist') await deleteWaitlistEntry(itemToDelete.id);
      else if (itemToDelete.collection === 'reviews') await deleteReview(itemToDelete.id);
      else if (itemToDelete.collection === 'users') await deleteUser(itemToDelete.id);
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (err: any) {
      setError(err.message || "Failed to delete item.");
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
      if (activeTab === 'blogs') {
        const timestampedSlug = blogForm.slug || `${blogForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Math.random().toString(36).substring(7)}`;
        
        const payload = {
          title: blogForm.title || 'Untitled Journal',
          slug: editingItem ? blogForm.slug : timestampedSlug,
          excerpt: blogForm.excerpt || '',
          content: blogForm.content || '',
          author: blogForm.author || 'Yureka Editorial',
          category: blogForm.category || 'Credit Cards',
          image: blogForm.image || 'https://picsum.photos/seed/blog/800/600',
          status: 'published',
          read_time: blogForm.read_time || '5 min read',
          scheduled_at: (blogForm.publishMode === 'later' && blogForm.scheduled_at) ? new Date(blogForm.scheduled_at).toISOString() : null
        };

        const { error: saveError } = editingItem 
          ? await supabase.from('blogs').update(payload).eq('id', editingItem.id)
          : await supabase.from('blogs').insert([payload]);

        if (saveError) throw saveError;
      } 
      else if (activeTab === 'cards') {
        const { error: saveError } = editingItem 
          ? await supabase.from('cards').update(cardForm).eq('id', editingItem.id)
          : await supabase.from('cards').insert([cardForm]);
        if (saveError) throw saveError;
      }
      else if (activeTab === 'reviews') {
        const { error: saveError } = editingItem 
          ? await supabase.from('reviews').update(reviewForm).eq('id', editingItem.id)
          : await supabase.from('reviews').insert([reviewForm]);
        if (saveError) throw saveError;
      }
      else if (activeTab === 'settings') {
         editingItem ? await updateUserRole(editingItem.id, teamForm.role) : await inviteTeamMember(teamForm.email, teamForm.role);
      }

      // SUCCESS: Clear everything instantly
      setIsModalOpen(false);
      setEditingItem(null);
      refreshAll().catch(console.error);
    } catch (err: any) {
      console.error("CRITICAL SAVE FAILURE:", err);
      alert(`Publication Conflict: ${err.message || "Unknown error"}. Try changing the title slightly.`);
    } finally {
      setSaving(false);
    }
  };


  const getAddAction = () => {
    if (!['blogs', 'cards', 'reviews', 'settings'].includes(activeTab)) return undefined;
    
    return () => {
       setEditingItem(null);
      if (activeTab === 'blogs') setBlogForm({ ...blogForm, title: '', slug: '', excerpt: '', content: '' });
      else if (activeTab === 'cards') setCardForm(defaultCardForm);
      else if (activeTab === 'reviews') setReviewForm(defaultReviewForm);
      else if (activeTab === 'settings') setTeamForm({ email: '', role: 'writer' });
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
                  {activeTab === 'waitlist' && <AdminWaitlistTab filter="pending" onFilterChange={() => {}} onUpdateStatus={updateWaitlistStatus} onDelete={confirmDelete} />}
                  {activeTab === 'settings' && <AdminSettingsTab onAddMember={() => getAddAction()?.()} onEditMember={handleEdit} onDeleteMember={(collection, id) => confirmDelete(collection, id)} />}
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
    </div>
  );
};

export default AdminDashboard;
