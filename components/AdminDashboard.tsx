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
  'Shopping', 'Dining', 'Lounge Access', 'Lifetime Free', 'Business', 'UPI'
];

const AdminDashboard: React.FC = () => {
  const { syncStatus, isLoading, refreshAll } = useSupabase();

  // --- Auth & Role State ---
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>('user');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'blogs' | 'cards' | 'waitlist' | 'settings' | 'logs' | 'reviews'>('blogs');
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
    await supabase.auth.signInWithOAuth({ 
      provider: 'google', 
      options: { redirectTo: window.location.origin + '/admin' } 
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
    try {
      if (activeTab === 'blogs') {
        const payload = { ...blogForm };
        if (blogForm.publishMode === 'later' && blogForm.scheduled_at) {
          payload.scheduled_at = new Date(blogForm.scheduled_at).toISOString();
        } else {
          payload.scheduled_at = null;
        }
        editingItem ? await updateBlog(editingItem.id, payload) : await addBlog(payload);
      } else if (activeTab === 'cards') {
        editingItem ? await updateCard(editingItem.id, cardForm) : await addCard(cardForm);
      } else if (activeTab === 'reviews') {
        editingItem ? await updateReview(editingItem.id, reviewForm) : await addReview(reviewForm);
      } else if (activeTab === 'settings') {
        editingItem ? await updateUserRole(editingItem.id, teamForm.role) : await inviteTeamMember(teamForm.email, teamForm.role);
      }
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (err: any) {
      setError(err.message || "Failed to save record.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-cream flex items-center justify-center"><Loader2 className="animate-spin text-teal" size={48} /></div>;
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-12 rounded-3xl shadow-xl border border-black/5 text-center">
          <LayoutDashboard className="mx-auto mb-6 text-teal" size={64} />
          <h1 className="text-3xl font-serif font-bold mb-4">Admin Access Required</h1>
          <p className="text-black/60 mb-8 text-sm">Please sign in with an authorized account to access the Yureka control plane.</p>
          <button onClick={handleLogin} className="w-full bg-teal text-white py-4 rounded-xl font-bold hover:bg-teal/90 transition-all flex items-center justify-center gap-2">Sign in with Google</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50/30">
      <AdminSidebar 
        user={user} userRole={userRole} activeTab={activeTab} isSidebarOpen={isSidebarOpen}
        onTabChange={setActiveTab} onLogout={handleLogout} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader 
          user={user} activeTab={activeTab} 
          onLogout={handleLogout} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />

        <main className="flex-1 p-4 md:p-8 pt-28">
           <div className="max-w-7xl mx-auto space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-3xl font-serif font-bold capitalize">{activeTab} Registry</h2>
                  <p className="text-black/40 text-xs mt-1">Real-time management system for platform assets.</p>
                </div>
                {['blogs', 'cards', 'reviews'].includes(activeTab) && (
                  <button 
                    onClick={() => { setEditingItem(null); setBlogForm({ ...blogForm, title: '', slug: '', excerpt: '', content: '' }); setCardForm(defaultCardForm); setReviewForm(defaultReviewForm); setIsModalOpen(true); }}
                    className="w-full md:w-auto bg-black text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-teal transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    Add {activeTab.slice(0, -1)}
                  </button>
                )}
              </div>

              <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden min-h-[60vh]">
                {activeTab === 'blogs' && <AdminBlogsTab onEdit={handleEdit} onDelete={confirmDelete} formatDateForInput={formatDateForInput} />}
                {activeTab === 'cards' && <AdminCardsTab onEdit={handleEdit} onDelete={confirmDelete} />}
                {activeTab === 'reviews' && <AdminReviewsTab onEdit={handleEdit} onDelete={confirmDelete} />}
                {activeTab === 'waitlist' && <AdminWaitlistTab filter="pending" onFilterChange={() => {}} onUpdateStatus={updateWaitlistStatus} onDelete={confirmDelete} />}
                {activeTab === 'settings' && <AdminSettingsTab onAddMember={() => { setEditingItem(null); setTeamForm({ email: '', role: 'writer' }); setIsModalOpen(true); }} onEditMember={handleEdit} onDeleteMember={(id) => confirmDelete('users', id)} />}
                {activeTab === 'logs' && <AdminLogsTab />}
              </div>
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
