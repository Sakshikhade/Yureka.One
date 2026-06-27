import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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

import { api, isApiError } from '../lib/api/client';
import { fromApiCard, fromApiBlog, fromApiReview } from '../lib/api/mappers';
import type { Card as ApiCard, Blog as ApiBlog, Review as ApiReview, Waitlist as ApiWaitlist } from '../lib/api/types';
import { Blog, Card, WaitlistEntry, Review } from '../types';
import { useSupabase } from './SupabaseProvider';

// Admin Sub-components
import { AdminHeader } from './admin/AdminHeader';
import { AdminSidebar } from './admin/AdminSidebar';
import { AdminBlogsTab } from './admin/AdminBlogsTab';
import { AdminCardsTab } from './admin/AdminCardsTab';
import AdminUpdatesTab from './admin/AdminUpdatesTab';
import { AdminReviewsTab } from './admin/AdminReviewsTab';
import { AdminWaitlistTab } from './admin/AdminWaitlistTab';
import { AdminSettingsTab } from './admin/AdminSettingsTab';
import { AdminLogsTab } from './admin/AdminLogsTab';
import { AdminNotificationsTab } from './admin/AdminNotificationsTab';
import { AdminTrashTab } from './admin/AdminTrashTab';
import { AdminModals } from './admin/AdminModals';

const cleanData = (obj: any) => {
  const cleaned = { ...obj };
  Object.keys(cleaned).forEach(key => {
    if (cleaned[key] === undefined) delete cleaned[key];
    if (key === 'scheduled_at' && cleaned[key] === '') cleaned[key] = null;
    if (key === 'benefits' && Array.isArray(cleaned[key])) {
      cleaned[key] = cleaned[key].filter((b: string) => b && typeof b === 'string' && b.trim() !== '');
    }
    if (key === 'benefit_items' && Array.isArray(cleaned[key])) {
      cleaned[key] = cleaned[key].filter((b: any) => b && b.heading?.trim() !== '');
    }
  });
  return cleaned;
};

const ADMIN_BANKS = [
  'HDFC', 'SBI', 'ICICI', 'Axis', 'Kotak', 'Yes Bank', 'RBL', 'Amex',
  'IndusInd', 'BOB', 'SC', 'IDFC', 'AU', 'Federal', 'SBM', 'IDBI'
];

const ADMIN_CATEGORIES = [
  'Travel', 'Hotels', 'Cashback', 'Brand Voucher', 'Fuel',
  'Shopping', 'Dining', 'Lounge Access', 'Lifetime Free', 'Business', 'UPI',
  'Travel Bookings', 'Catalogue Products', 'Experience'
];
// Converts the admin form's snake_case card payload to the Java API's camelCase + JSON-stringified JSONB fields.
function toApiCardPayload(c: any) {
  return {
    name: c.name, bank: c.bank, issuer: c.issuer, type: c.type,
    image: c.image, slug: c.slug, status: c.status, color: c.color,
    applyLink: c.apply_link, bestFor: c.best_for, category: c.category,
    categories: c.categories, rating: c.rating, eliteRating: c.elite_rating,
    rewardsRate: c.rewards_rate, projectedSavings: c.projected_savings,
    annualFee: c.annual_fee, joiningFee: c.joining_fee, introOffer: c.intro_offer,
    benefits: c.benefits, benefitItems: JSON.stringify(c.benefit_items ?? []),
    verdict: c.verdict, description: c.description, author: c.author,
    rewardType: c.reward_type, welcomeBenefits: c.welcome_benefits,
    productDetails: c.product_details, pros: c.pros, cons: c.cons,
    cashbackDetails: c.cashback_details, exclusions: c.exclusions,
    comparisonCards: c.comparison_cards, latestNews: c.latest_news,
    detailedFeatures: JSON.stringify(c.detailed_features ?? []),
    redemptionTable: JSON.stringify(c.redemption_table ?? []),
    eligibilityCriteria: JSON.stringify(c.eligibility_criteria ?? []),
    gridBenefits: JSON.stringify(c.grid_benefits ?? []),
    gridFees: JSON.stringify(c.grid_fees ?? []),
    finalVerdictText: c.final_verdict_text, finalReviewImage: c.final_review_image,
  };
}

const DEFAULT_BLOG_FORM = {
  title: '', slug: '', excerpt: '', content: '', author: '', category: 'Credit Cards',
  image: 'https://picsum.photos/seed/blog/800/600', read_time: '5 min read',
  featured: false, status: 'published', publishMode: 'now', scheduled_at: '',
  external_link: ''
};

const DEFAULT_CARD_FORM = {
  name: '', bank: '', issuer: '', type: 'Rewards', image: 'https://picsum.photos/seed/card/400/250',
  rating: 4.5, elite_rating: 4.5, benefits: [''], benefit_items: [{ heading: '', subheading: '' }],
  verdict: '', slug: '', apply_link: '', annual_fee: '₹0', joining_fee: '₹0', intro_offer: '',
  best_for: 'Shopping', category: 'Shopping', categories: [] as string[],
  color: 'from-blue-600 to-indigo-700', rewards_rate: '5%', projected_savings: '₹12,000/yr', status: 'published',
  
  // Review fields
  description: '', author: 'Yureka Research Team', 
  reward_type: 'Cashback', welcome_benefits: '',
  product_details: [''], pros: [''], cons: [''],
  detailed_features: [{ title: '', content: '' }],
  cashback_details: [''],
  redemption_table: [
    { category: 'Product Catalog', value: '₹0.25' },
    { category: 'Flights/Hotels', value: '₹0.30' },
    { category: 'Cashback', value: '₹1.00' },
    { category: 'Airmiles', value: '0.30 Miles' }
  ],
  exclusions: [''],
  eligibility_criteria: [
    { criteria: 'Age', salaried: '21 – 60 Years', self_employed: '21 – 65 Years' },
    { criteria: 'Income', salaried: '₹25,000 / Month', self_employed: '₹6,00,000 / Annum' }
  ],
  comparison_cards: [] as string[],
  latest_news: [''],
  final_review_image: '',
  final_verdict_text: '',
  grid_benefits: [
    { title: 'Movie & Dining', value: '' },
    { title: 'Rewards Rate', value: '' },
    { title: 'Reward Redemption', value: '' },
    { title: 'Travel', value: '' },
    { title: 'Lounge Access', value: '' },
    { title: 'Insurance Benefits', value: '' }
  ],
  grid_fees: [
    { title: 'Spend-Based Waiver', value: '' },
    { title: 'Rewards Redemption Fee', value: '' },
    { title: 'Foreign Currency Markup', value: '' },
    { title: 'Fuel Surcharge Waiver', value: '' },
    { title: 'Cash Advance Charges', value: '' },
    { title: 'Interest Rates', value: '' }
  ]
};

const DEFAULT_REVIEW_FORM: Partial<Review> = {
  author: '', role: '', company: '', company_logo: '', image: 'https://picsum.photos/seed/review/300/400',
  quote: '', rating: 5, source: 'Direct', featured: false, status: 'published'
};

const DEFAULT_TEAM_FORM = { email: '', role: 'writer' };

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
  const [activeTab, setActiveTab] = useState<'blogs' | 'cards' | 'updates' | 'waitlist' | 'settings' | 'logs' | 'reviews' | 'notifications' | 'trash'>(
    (localStorage.getItem('yureka_admin_tab') as any) || 'blogs'
  );
  const [waitlistFilter, setWaitlistFilter] = useState<'pending' | 'accepted' | 'rejected' | 'on_hold' | 'all'>('pending');

  // Critical Loading Timeout to prevent permanent spinner
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        console.warn("⚠️ Admin Auth timed out. Forcing UI state.");
        setLoading(false);
      }
    }, 6000);
    return () => clearTimeout(timer);
  }, [loading]);

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
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        handleAuth(session);
      } else {
        setLoading(false);
      }
    };

    const handleAuth = async (session: any) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      
      if (currentUser) {
        try {
          // Use the consolidated service helper for both check and role
          const roleRes = await api.get<{ role: string }>(`/api/v1/auth/role?email=${encodeURIComponent(currentUser.email)}`, { skipAuth: true });
          const role = !isApiError(roleRes) ? (roleRes.data?.role ?? 'user') : 'user';
          const isUserAdmin = ['admin', 'editor', 'writer'].includes(role);
          
          setUserRole(role);
          setIsAdmin(isUserAdmin);
        } catch (err) {
          console.error("Critical Auth Verification Error:", err);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      handleAuth(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => { await supabase.auth.signOut(); };
  const handleLogin = async () => {
    const isLocal = window.location.hostname === 'localhost';
    const redirectTo = isLocal
      ? window.location.origin + '/admin'
      : `${import.meta.env.VITE_ADMIN_PORTAL_URL ?? window.location.origin}/admin`;

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo }
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

      const deleteRoutes: Record<string, string> = {
        blogs:    `/api/v1/admin/blogs/${id}`,
        cards:    `/api/v1/admin/cards/${id}`,
        reviews:  `/api/v1/admin/reviews/${id}`,
        waitlist: `/api/v1/admin/waitlist/${id}`,
        users:    `/api/v1/admin/team/${id}`,
      };
      const route = deleteRoutes[collection];
      if (!route) throw new Error(`Unknown collection: ${collection}`);
      const delRes = await api.delete(route);
      if (isApiError(delRes)) throw new Error(delRes.error);

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
          external_link: blogForm.external_link || '',
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
        const c = cardForm;
        if (!c.slug) c.slug = generateSlug(c.name, c.bank) || `card-${Date.now()}`;
        // Explicitly map only columns that exist in the DB schema
        payload = {
          name: c.name || '',
          bank: c.bank || '',
          issuer: c.issuer || '',
          type: c.type || 'Rewards',
          image: c.image || '',
          slug: c.slug || '',
          status: c.status || 'published',
          color: c.color || '',
          apply_link: c.apply_link || '',
          best_for: c.best_for || '',
          category: c.category || '',
          categories: c.categories || [],
          rating: Number(c.rating) || 0,
          elite_rating: Number(c.elite_rating) || 0,
          rewards_rate: c.rewards_rate || '',
          projected_savings: c.projected_savings || '',
          annual_fee: c.annual_fee || '',
          joining_fee: c.joining_fee || '',
          intro_offer: c.intro_offer || '',
          benefits: Array.isArray(c.benefits) ? c.benefits.filter((b: string) => b?.trim()) : [],
          benefit_items: Array.isArray(c.benefit_items) ? c.benefit_items.filter((b: any) => b?.heading?.trim()) : [],
          verdict: c.verdict || '',
          description: c.description || '',
          author: c.author || '',
          reward_type: c.reward_type || '',
          product_details: Array.isArray(c.product_details) ? c.product_details.filter((x: string) => x?.trim()) : [],
          pros: Array.isArray(c.pros) ? c.pros.filter((x: string) => x?.trim()) : [],
          cons: Array.isArray(c.cons) ? c.cons.filter((x: string) => x?.trim()) : [],
          redemption_table: Array.isArray(c.redemption_table) ? c.redemption_table : [],
          latest_news: Array.isArray(c.latest_news) ? c.latest_news.filter((x: string) => x?.trim()) : [],
          grid_benefits: Array.isArray(c.grid_benefits) ? c.grid_benefits : [],
          grid_fees: Array.isArray(c.grid_fees) ? c.grid_fees : [],
          final_verdict_text: c.final_verdict_text || '',
        };
      }
      else if (activeTab === 'reviews') {
        collection = 'reviews';
        // Explicit allowlist — only columns confirmed in the reviews table schema
        payload = {
          author: reviewForm.author || '',
          role: reviewForm.role || '',
          company: reviewForm.company || '',
          company_logo: reviewForm.company_logo || '',
          image: reviewForm.image || reviewForm.avatar || '',
          quote: reviewForm.quote || '',
          rating: Number(reviewForm.rating) || 5,
          source: reviewForm.source || 'Direct',
          featured: reviewForm.featured ?? false,
          status: reviewForm.status || 'published',
        };
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
      delete finalPayload.updated_on;
      delete finalPayload.avatar; // not a cards column

      console.log(`📤 Saving to ${collection}:`, finalPayload);

      const isUpdate = !!editingItem;

      let savedItem: any = null;

      if (collection === 'blogs') {
        const res = isUpdate
          ? await api.put<ApiBlog>(`/api/v1/admin/blogs/${editingItem.id}`, finalPayload)
          : await api.post<ApiBlog>('/api/v1/admin/blogs', finalPayload);
        if (isApiError(res)) throw new Error(res.error);
        savedItem = fromApiBlog(res.data!);
        if (isUpdate) setBlogs(prev => prev.map(i => i.id === editingItem.id ? savedItem : i));
        else setBlogs(prev => [savedItem, ...prev]);
      } else if (collection === 'cards') {
        const apiPayload = toApiCardPayload(finalPayload);
        const res = isUpdate
          ? await api.put<ApiCard>(`/api/v1/admin/cards/${editingItem.id}`, apiPayload)
          : await api.post<ApiCard>('/api/v1/admin/cards', apiPayload);
        if (isApiError(res)) throw new Error(res.error);
        savedItem = fromApiCard(res.data!);
        if (isUpdate) setCards(prev => prev.map(i => i.id === editingItem.id ? savedItem : i));
        else setCards(prev => [savedItem, ...prev]);
      } else if (collection === 'reviews') {
        const reviewPayload = { ...finalPayload, companyLogo: finalPayload.company_logo };
        delete reviewPayload.company_logo;
        const res = isUpdate
          ? await api.put<ApiReview>(`/api/v1/admin/reviews/${editingItem.id}`, reviewPayload)
          : await api.post<ApiReview>('/api/v1/admin/reviews', reviewPayload);
        if (isApiError(res)) throw new Error(res.error);
        savedItem = fromApiReview(res.data!);
        if (isUpdate) setReviews(prev => prev.map(i => i.id === editingItem.id ? savedItem : i));
        else setReviews(prev => [savedItem, ...prev]);
      } else if (collection === 'users') {
        if (isUpdate) {
          const res = await api.patch(`/api/v1/admin/team/${editingItem.id}/role`, { role: finalPayload.role });
          if (isApiError(res)) throw new Error(res.error);
          savedItem = res.data;
          setTeam(prev => prev.map(i => i.id === editingItem.id ? savedItem : i));
        } else {
          const res = await api.post(`/api/v1/admin/team`, { email: finalPayload.email, role: finalPayload.role });
          if (isApiError(res)) throw new Error(res.error);
          savedItem = res.data;
          setTeam(prev => [savedItem, ...prev]);
        }
      }

      showNotification(`${isUpdate ? 'Updated' : 'Created'} successfully!`);
      setIsModalOpen(false);
      setEditingItem(null);

      // Send welcome email for new team members
      if (!isUpdate && activeTab === 'settings') {
        api.post('/api/v1/admin/notify', {
          email: teamForm.email,
          role: teamForm.role,
          firstName: teamForm.email.split('@')[0],
        }).catch(e => console.error("Notification failed:", e));
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
        <div className="w-full max-w-md bg-cream p-12 rounded-3xl shadow-xl border border-black/5 text-center">
          <LayoutDashboard className="mx-auto mb-6 text-[#047857]" size={64} />
          <h1 className="text-3xl font-heading font-black mb-4 uppercase">Admin Access Required</h1>
          <p className="text-black/60 mb-8 text-sm font-sans font-medium">Please sign in with an authorized account to access the Yureka control plane.</p>

          <button onClick={handleLogin} className="w-full bg-[#047857] text-cream py-4 rounded-xl font-bold hover:bg-[#047857]/90 transition-all flex items-center justify-center gap-2">Sign in with Google</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-cream selection:bg-clay/20 relative overflow-hidden">
      {/* CONTINUOUS AMBIENT ANIMATION NODES */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
            x: [-20, 20, -20],
            y: [-20, 20, -20]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-clay/20 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.05, 0.1, 0.05],
            x: [20, -20, 20],
            y: [20, -20, 20]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-clay/10 blur-[150px] rounded-full"
        />
      </div>

      <div className="relative z-10 flex w-full min-h-screen">
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

        <main className="flex-1 p-4 md:p-10 bg-cream">
            <div className="max-w-7xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white/5 rounded-[2.5rem] border border-white/5 shadow-2xl shadow-black overflow-hidden min-h-[70vh] flex flex-col"
                >
                  {activeTab === 'blogs' && <AdminBlogsTab onEdit={handleEdit} onDelete={confirmDelete} formatDateForInput={formatDateForInput} />}
                  {activeTab === 'cards' && <AdminCardsTab onEdit={handleEdit} onDelete={confirmDelete} />}
                  {activeTab === 'updates' && <AdminUpdatesTab />}
                  {activeTab === 'reviews' && <AdminReviewsTab onEdit={handleEdit} onDelete={confirmDelete} />}
                  {activeTab === 'waitlist' && <AdminWaitlistTab filter={waitlistFilter} onFilterChange={setWaitlistFilter} onUpdateStatus={async (id: string, status: string) => {
                    const res = await api.patch(`/api/v1/admin/waitlist/${id}/status`, { status });
                    if (isApiError(res)) throw new Error(res.error);
                    setWaitlist(prev => prev.map((w: any) => w.id === id ? { ...w, status } : w));
                  }} onDelete={confirmDelete} />}
                  {activeTab === 'settings' && (
                    <AdminSettingsTab 
                      onAddMember={getAddAction()!} 
                      onEditMember={handleEdit} 
                      onDeleteMember={confirmDelete} 
                    />
                  )}
                  {activeTab === 'logs' && <AdminLogsTab />}
                  {activeTab === 'notifications' && <AdminNotificationsTab />}
                  {activeTab === 'trash' && <AdminTrashTab />}
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
            className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-3xl border flex items-center gap-5 w-[90vw] sm:w-auto sm:min-w-[340px] max-w-[90vw] ${
              notification.type === 'success' 
                ? 'bg-white/5/90 border-clay/20 text-white' 
                : 'bg-red-950/90 border-red-500/20 text-white'
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center relative ${
              notification.type === 'success' ? 'bg-clay/20 text-clay' : 'bg-red-500/20 text-red-500'
            }`}>
              {notification.type === 'success' && <div className="absolute inset-0 rounded-full border border-clay/40 animate-ping" />}
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
    </div>
  );
};

export default AdminDashboard;
