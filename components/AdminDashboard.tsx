import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase';
import { 
  LayoutDashboard, 
  CreditCard, 
  FileText, 
  Users, 
  Plus, 
  Trash2, 
  Edit2, 
  LogOut, 
  LogIn,
  Check,
  X,
  Loader2,
  Search,
  Filter,
  ArrowRight,
  Upload,
  Image as ImageIcon,
  ExternalLink,
  Settings,
  AlertCircle,
  Zap,
  History,
  Clock,
  RotateCcw,
  Pause,
  Menu,
  X as CloseIcon,
  CheckCircle,
  PauseCircle,
  XCircle,
  Filter as FilterIcon,
  Check as CheckIcon,
  X as XIcon,
  Clock as ClockIcon
} from 'lucide-react';
import { 
  getBlogsAdmin, addBlog, updateBlog, deleteBlog,
  getCardsAdmin, addCard, updateCard, deleteCard,
  getWaitlist, deleteWaitlistEntry, updateWaitlistStatus,
  checkIfAdmin, getTeamMembers, inviteTeamMember, updateUserRole, deleteUser, getAuditLogs,
  getReviewsAdmin, addReview, updateReview, deleteReview
} from '../services/supabaseService';
import { Blog, Card, WaitlistEntry, Review } from '../types';

// ─── Shared master lists (kept in sync with CardExplorer) ─────────────────────
const ADMIN_BANKS = [
  'HDFC', 'SBI', 'ICICI', 'Axis', 'Kotak', 'Yes Bank', 'RBL', 'Amex',
  'IndusInd', 'BOB', 'SC', 'Indian', 'PNB', 'IDFC', 'Canara', 'HSBC',
  'DBS', 'IDBI', 'AU', 'Equitas', 'CSB', 'Federal', 'SBM', 'South Indian',
  'Utkarsh Bank', 'Suryoday Bank', 'Union Bank', 'Unity SFB', 'DCB',
  'Bank Of India', 'J&K Bank', 'CUB', 'Slice SFB', 'Dhanlaxmi Bank', 'Indian Overseas Bank'
];

const ADMIN_CATEGORIES = [
  'Travel', 'Hotels', 'Cashback', 'Brand Voucher', 'Fuel',
  'Catalogue Products', 'Travel Bookings', 'Brand Wallet', 'Experience',
  'Shopping', 'Dining', 'Lounge Access', 'Lifetime Free', 'Business', 'UPI'
];
// ──────────────────────────────────────────────────────────────────────────────

const AdminDashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>('user');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'blogs' | 'cards' | 'waitlist' | 'settings' | 'logs' | 'reviews'>('blogs');
  
  const [error, setError] = useState<string | null>(null);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [team, setTeam] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [waitlistFilter, setWaitlistFilter] = useState<'pending' | 'accepted' | 'rejected' | 'on_hold' | 'all'>('pending');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{collection: string, id: string} | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!user || !isAdmin) return;

    const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes

    const resetTimer = () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      inactivityTimerRef.current = setTimeout(() => {
        setIsSessionExpired(true);
        handleLogout();
        // Force immediate local logout state to lock the UI
        setUser(null);
        setIsAdmin(false);
      }, INACTIVITY_TIMEOUT);
    };

    const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
    
    resetTimer();
    events.forEach(event => window.addEventListener(event, resetTimer));

    return () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [user, isAdmin]);
  
  // Blog Form State
  const [blogForm, setBlogForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: '',
    category: 'Credit Cards',
    image: 'https://picsum.photos/seed/blog/800/600',
    read_time: '5 min read',
    featured: false,
    status: 'published' as 'draft' | 'published',
    scheduled_at: ''
  });

  // Helper to generate a slug
  const generateSlug = (name: string, bank: string) => {
      return `${name}-${bank}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  // Card Form State
  const defaultCardForm = {
    name: '',
    bank: '',
    issuer: '',
    type: 'Rewards',
    image: 'https://picsum.photos/seed/card/400/250',
    rating: 4.5,
    elite_rating: 4.5,
    benefits: [''],
    benefit_items: [{ heading: '', subheading: '' }],
    verdict: '',
    slug: '',
    apply_link: '',
    annual_fee: '₹0',
    joining_fee: '₹0',
    best_for: 'Shopping',
    category: 'Shopping',
    categories: [] as string[],
    color: 'from-blue-600 to-indigo-700',
    rewards_rate: '5%',
    projected_savings: '₹12,000/yr',
    status: 'published' as 'draft' | 'published'
  };

  const [cardForm, setCardForm] = useState(defaultCardForm);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Team Form State
  const [teamForm, setTeamForm] = useState({
    email: '',
    role: 'writer'
  });
  
  // Review Form State
  const defaultReviewForm: Review = {
    author: '',
    role: '',
    company: '',
    company_logo: '',
    image: 'https://picsum.photos/seed/review/300/400',
    quote: '',
    rotation: 0,
    status: 'published'
  };
  const [reviewForm, setReviewForm] = useState<Review>(defaultReviewForm);

  // Real-time status indicators
  const [syncStatus, setSyncStatus] = useState<'connected' | 'reconnecting' | 'error'>('connected');

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user || null;
      setUser(user);
      if (user) {
        // Fetch role for UI filtering
        try {
          const { data } = await supabase.from('users').select('role').eq('email', user.email).single();
          const fetchedRole = data?.role || 'user';
          
          // CRITICAL: Always allow the super admin
          const isOwner = ['toanweshbiswas@gmail.com', 'buildwithjupyter.network@gmail.com'].includes(user.email);
          const role = isOwner ? 'admin' : fetchedRole;
          
          setUserRole(role);
          setIsAdmin(isOwner || ['admin', 'editor', 'writer'].includes(role));
          
          // Set intelligent default tab
          if (role === 'writer') setActiveTab('blogs');
          if (role === 'editor' && activeTab === 'settings') setActiveTab('blogs');
        } catch (err) {
          console.error("Role fetch error:", err);
          // Even on error, bypass for owner
          if (['toanweshbiswas@gmail.com', 'buildwithjupyter.network@gmail.com'].includes(user.email)) {
            setIsAdmin(true);
            setUserRole('admin');
          } else {
            setIsAdmin(false);
          }
        }
      } else {
        setIsAdmin(false);
        setUserRole('user');
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;

    // Monitor Channel Status
    const checkConnection = () => {
      // Supabase doesn't have a simple "is connected" getter, 
      // but we can infer from the subscription success.
      setSyncStatus('connected');
    };

    // Subscribe to Blogs
    const unsubscribeBlogs = getBlogsAdmin((fetched) => {
      setBlogs(fetched);
      checkConnection();
    });

    // Subscribe to Cards
    const unsubscribeCards = getCardsAdmin((fetched) => setCards(fetched));

    // Subscribe to Waitlist
    const unsubscribeWaitlist = getWaitlist((fetched) => setWaitlist(fetched));

    // Subscribe to Reviews
    const unsubscribeReviews = getReviewsAdmin((fetched) => setReviews(fetched));

    return () => {
      unsubscribeBlogs();
      unsubscribeCards();
      unsubscribeWaitlist();
      unsubscribeReviews();
    };
  }, [isAdmin]);

  useEffect(() => {
    if (activeTab === 'logs' && isAdmin) {
      const fetchLogs = async () => {
        try {
          const fetchedLogs = await getAuditLogs();
          setLogs(fetchedLogs);
        } catch (err) {
          console.error("Failed to fetch logs:", err);
        }
      };
      fetchLogs();
    }
  }, [activeTab, isAdmin]);

  useEffect(() => {
    if (activeTab === 'settings' && isAdmin) {
      const fetchTeam = async () => {
        try {
          const members = await getTeamMembers();
          setTeam(members);
        } catch (err) {
          console.error("Failed to fetch team:", err);
        }
      };
      fetchTeam();
    }
  }, [activeTab, isAdmin]);

  const handleLogin = async () => {
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({ 
        provider: 'google', 
        options: { redirectTo: window.location.origin + '/admin' } 
      });
      if (error) throw error;
    } catch (err: any) {
      console.error("Login failed", err);
      setError(err.message || "An error occurred during sign-in.");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'blogs' | 'cards' | 'reviews' | 'reviews_logo') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instant local preview
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    
    // Optimistically update form image for immediate visual feedback
    if (type === 'blogs') {
      setBlogForm(prev => ({ ...prev, image: localUrl }));
    } else if (type === 'cards') {
      setCardForm(prev => ({ ...prev, image: localUrl }));
    } else if (type === 'reviews') {
       setReviewForm(prev => ({ ...prev, image: localUrl }));
    } else if (type === 'reviews_logo') {
       setReviewForm(prev => ({ ...prev, company_logo: localUrl }));
    }

    setUploading(true);
    try {
      const { data, error } = await supabase.storage.from('media').upload(`${type.startsWith('reviews') ? 'reviews' : type}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`, file);
      if (error) throw error;
      
      const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(data.path);
      const url = publicUrlData.publicUrl;
      
      // Update with the real URL from Supabase Storage
      if (type === 'blogs') {
        setBlogForm(prev => ({ ...prev, image: url }));
      } else if (type === 'cards') {
        setCardForm(prev => ({ ...prev, image: url }));
      } else if (type === 'reviews') {
        setReviewForm(prev => ({ ...prev, image: url }));
      } else if (type === 'reviews_logo') {
        setReviewForm(prev => ({ ...prev, company_logo: url }));
      }
      setPreviewUrl(url);
    } catch (error) {
      console.error("Error uploading file", error);
      setError("Failed to upload image. Please try again.");
      // Rollback preview and form image if upload fails
      setPreviewUrl(null);
      if (type === 'blogs') {
        setBlogForm(prev => ({ ...prev, image: editingItem?.image || 'https://picsum.photos/seed/blog/800/600' }));
      } else if (type === 'cards') {
        setCardForm(prev => ({ ...prev, image: editingItem?.image || 'https://picsum.photos/seed/card/400/250' }));
      } else if (type === 'reviews') {
        setReviewForm(prev => ({ ...prev, image: editingItem?.image || 'https://picsum.photos/seed/review/300/400' }));
      } else if (type === 'reviews_logo') {
        setReviewForm(prev => ({ ...prev, company_logo: editingItem?.company_logo || '' }));
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (editingItem) {
        await updateBlog(editingItem.id, blogForm);
      } else {
        await addBlog(blogForm);
      }
      setIsModalOpen(false);
      setEditingItem(null);
      setPreviewUrl(null);
      setBlogForm({ title: '', slug: '', excerpt: '', content: '', author: '', category: 'Credit Cards', image: 'https://picsum.photos/seed/blog/800/600', read_time: '5 min read', featured: false, status: 'published' as 'draft' | 'published', scheduled_at: '' });
    } catch (error: any) {
      console.error("Save Blog Error:", error);
      setError(error.message || "Failed to save blog post. If this persists, please run the SQL fix script.");
      document.querySelector('#admin-modal-content')?.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (editingItem) {
        await updateCard(editingItem.id, cardForm);
      } else {
        await addCard(cardForm);
      }
      setIsModalOpen(false);
      setEditingItem(null);
      setPreviewUrl(null);
      setCardForm(defaultCardForm);
    } catch (error: any) {
      console.error("Save Card Error:", error);
      setError(error.message || "Failed to save card. If this persists, please run the SQL fix script.");
      document.querySelector('#admin-modal-content')?.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (editingItem) {
        await updateReview(editingItem.id, reviewForm);
      } else {
        await addReview(reviewForm);
      }
      setIsModalOpen(false);
      setEditingItem(null);
      setPreviewUrl(null);
      setReviewForm(defaultReviewForm);
    } catch (error: any) {
      console.error("Save Review Error:", error);
      setError(error.message || "Failed to save review.");
      document.querySelector('#admin-modal-content')?.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateWaitlistStatus = async (id: string, status: 'accepted' | 'rejected' | 'on_hold' | 'pending') => {
    try {
      setSaving(true);
      await updateWaitlistStatus(id, status);
      // Waitlist state will auto-update via realtime subscription in useEffect
    } catch (err: any) {
      setError(err.message || 'Failed to update status');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (editingItem) {
        if (['toanweshbiswas@gmail.com', 'buildwithjupyter.network@gmail.com'].includes(editingItem.email) && teamForm.role !== 'admin') {
          throw new Error("Super admins must remain Admins.");
        }
        await updateUserRole(editingItem.id, teamForm.role);
      } else {
        await inviteTeamMember(teamForm.email, teamForm.role);
        
        // Trigger onboarding email via backend API
        const namePart = teamForm.email.split('@')[0].split('.')[0];
        const firstName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        
        try {
          await fetch('/api/notify-team-member', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: teamForm.email,
              role: teamForm.role,
              firstName: firstName
            })
          });
        } catch (emailErr) {
          console.warn("Onboarding email notification failed to send:", emailErr);
          // We continue because the team member was successfully invited in Supabase
        }
      }
      setIsModalOpen(false);
      setEditingItem(null);
      setTeamForm({ email: '', role: 'writer' });
      // Refresh team list
      const members = await getTeamMembers();
      setTeam(members);
    } catch (error: any) {
      console.error("Save Team Error:", error);
      setError(error.message || "Failed to manage team member.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    // Safety check: Prevent deleting the platform owner
    if (itemToDelete.collection === 'users') {
      const userToDelete = team.find(u => u.id === itemToDelete.id);
      if (['toanweshbiswas@gmail.com', 'buildwithjupyter.network@gmail.com'].includes(userToDelete?.email)) {
        setError("Super admins cannot be removed.");
        setIsDeleteModalOpen(false);
        return;
      }
    }
    
    try {
      if (itemToDelete.collection === 'blogs') await deleteBlog(itemToDelete.id);
      else if (itemToDelete.collection === 'cards') await deleteCard(itemToDelete.id);
      else if (itemToDelete.collection === 'waitlist') await deleteWaitlistEntry(itemToDelete.id);
      else if (itemToDelete.collection === 'reviews') await deleteReview(itemToDelete.id);
      else if (itemToDelete.collection === 'users') {
        await deleteUser(itemToDelete.id);
        // Refresh team list
        const members = await getTeamMembers();
        setTeam(members);
      }
      
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error: any) {
      setError(error.message || "Failed to delete item.");
      setIsDeleteModalOpen(false);
    }
  };

  const confirmDelete = (collectionName: string, id: string) => {
    setItemToDelete({ collection: collectionName, id });
    setIsDeleteModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 className="animate-spin text-teal" size={48} />
      </div>
    );
  }

  const fixData = async () => {
    setSaving(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("No active Supabase session found. Please try logging out and back in.");
      }
      
      console.log("Diagnostic - Session User:", session.user.email);
      console.log("Diagnostic - Session Role:", session.user.role);

      // Test 1: Check if blogs table is readable
      const { error: blogError } = await supabase.from('blogs').select('id').limit(1);
      if (blogError) throw new Error(`Database Error: Cannot read 'blogs' table. ${blogError.message}`);

      // Test 2: Check if cards table is readable
      const { error: cardError } = await supabase.from('cards').select('id').limit(1);
      if (cardError) throw new Error(`Database Error: Cannot read 'cards' table. ${cardError.message}`);

      alert("🎉 System Health Check Passed!\n\n1. Authentication: OK\n2. Database Connection: OK\n3. Table Visibility: OK\n\nIf you still can't SAVE, please run the 'Final Backend Fix' SQL script I provided.");
    } catch (err: any) {
      console.error("Diagnostic Failed", err);
      setError(`Diagnostic Failed: ${err.message}`);
      (window as any).lastSupabaseError = err;
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-black/5 text-center">
          <LayoutDashboard className="mx-auto mb-6 text-teal" size={64} />
          <h1 className="text-3xl font-serif font-bold mb-4">Admin Portal</h1>
          <p className="text-black/60 mb-8">Please sign in with your administrator account to continue.</p>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 text-left">
              <p className="font-bold mb-1 flex items-center gap-2">
                <X size={16} /> Error
              </p>
              <p>{error}</p>
            </div>
          )}

          <button 
            onClick={handleLogin}
            className="w-full bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-clay transition-colors shadow-lg"
          >
            <LogIn size={20} /> Sign in with Google
          </button>

          {isSessionExpired && (
            <div className="fixed inset-0 z-[200] bg-cream/95 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
              <div className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-2xl border border-black/5 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-amber-500" />
                <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Clock className="w-10 h-10 text-amber-500 animate-pulse" />
                </div>
                <h2 className="text-4xl font-serif italic mb-6 tracking-tight">Session Expired</h2>
                <p className="text-black/60 mb-10 leading-relaxed font-serif">
                  For your security, your administrative session has been terminated due to 15 minutes of inactivity.
                </p>
                <button 
                  onClick={() => {
                    setIsSessionExpired(false);
                    handleLogin();
                  }}
                  className="w-full bg-black text-white py-5 rounded-full font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-clay transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3"
                >
                  <LogIn size={14} /> Re-authenticate
                </button>
                <div className="mt-8 pt-8 border-t border-black/5 flex justify-center">
                  <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-black/20 italic">Yureka Security Protocol v2.4</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-black/5">
            <p className="text-[10px] text-black/40 uppercase font-bold tracking-widest mb-4">Deployment Guide</p>
            <div className="text-left space-y-3">
              <div className="flex gap-3">
                <div className="w-5 h-5 bg-teal/10 text-teal rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold">1</div>
                <p className="text-xs text-black/60">Go to <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-teal underline">Supabase Dashboard</a></p>
              </div>
              <div className="flex gap-3">
                <div className="w-5 h-5 bg-teal/10 text-teal rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold">2</div>
                <p className="text-xs text-black/60">Authentication &gt; URL Configuration</p>
              </div>
              <div className="flex gap-3">
                <div className="w-5 h-5 bg-teal/10 text-teal rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold">3</div>
                <p className="text-xs text-black/60">Add <code className="bg-black/5 px-1 rounded">yurekamoney.netlify.app</code> to Redirect URLs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-black/5 text-center">
          <X className="mx-auto mb-6 text-red-500" size={64} />
          <h1 className="text-3xl font-serif font-bold mb-4">Access Denied</h1>
          <p className="text-black/60 mb-8">Your account ({user.email}) does not have administrator privileges.</p>
          <button 
            onClick={handleLogout}
            className="w-full bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-clay transition-colors"
          >
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col lg:flex-row relative overflow-x-hidden">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-black/5 p-4 flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-teal rounded-lg flex items-center justify-center text-white font-bold">J</div>
          <span className="font-bold text-lg tracking-tight">Yureka Admin</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-black/5 rounded-lg transition-colors"
        >
          {isSidebarOpen ? <CloseIcon size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-64 bg-white border-r border-black/5 flex flex-col fixed lg:sticky top-0 h-screen z-50 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-black/5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-teal rounded-lg flex items-center justify-center text-white font-bold">J</div>
            <span className="font-bold text-xl tracking-tight">Yureka Admin</span>
          </div>
          <p className="text-[10px] uppercase font-bold text-black/40 tracking-widest">Management Console</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {/* Blogs - All team members */}
          <button 
            onClick={() => { setActiveTab('blogs'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'blogs' ? 'bg-teal/10 text-teal font-bold' : 'text-black/60 hover:bg-black/5'}`}
          >
            <FileText size={20} /> Blogs
          </button>

          {/* Reviews - All editors/admins */}
          {['admin', 'editor'].includes(userRole) && (
            <button 
              onClick={() => { setActiveTab('reviews'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'reviews' ? 'bg-teal/10 text-teal font-bold' : 'text-black/60 hover:bg-black/5'}`}
            >
              <Users size={20} /> Reviews
            </button>
          )}

          {/* Cards - Admin & Editor */}
          {['admin', 'editor'].includes(userRole) && (
            <button 
              onClick={() => { setActiveTab('cards'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'cards' ? 'bg-teal/10 text-teal font-bold' : 'text-black/60 hover:bg-black/5'}`}
            >
              <CreditCard size={20} /> Cards
            </button>
          )}

          {/* Waitlist - Admin only */}
          {userRole === 'admin' && (
            <button 
              onClick={() => { setActiveTab('waitlist'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'waitlist' ? 'bg-teal/10 text-teal font-bold' : 'text-black/60 hover:bg-black/5'}`}
            >
              <Users size={20} /> Waitlist
            </button>
          )}

          {/* Settings - Admin only */}
          {userRole === 'admin' && (
            <button 
              onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'settings' ? 'bg-teal/10 text-teal font-bold' : 'text-black/60 hover:bg-black/5'}`}
            >
              <Settings size={20} /> Team Settings
            </button>
          )}

          {/* Activity Logs - Admin only */}
          {userRole === 'admin' && (
            <button 
              onClick={() => { setActiveTab('logs'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'logs' ? 'bg-teal/10 text-teal font-bold' : 'text-black/60 hover:bg-black/5'}`}
            >
              <History size={20} /> Activity Log
            </button>
          )}
        </nav>

        <div className="p-4 border-t border-black/5">
          <div className="flex items-center gap-3 mb-4 px-2">
            <img src={user.user_metadata?.avatar_url || "https://picsum.photos/40/40"} alt="" className="w-8 h-8 rounded-full" />
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate">{user.user_metadata?.full_name || 'Admin'}</p>
              <p className="text-[10px] text-black/40 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors font-bold text-sm"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 min-w-0">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-black capitalize">{activeTab}</h1>
            <p className="text-black/40 text-sm">Manage your application {activeTab} here.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-black/5 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${syncStatus === 'connected' ? 'bg-green-500 animate-pulse' : syncStatus === 'reconnecting' ? 'bg-amber-500' : 'bg-red-500'}`} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-black/40">
                {syncStatus === 'connected' ? 'Live Sync Active' : syncStatus === 'reconnecting' ? 'Reconnecting...' : 'Sync Offline'}
              </span>
            </div>
            <button 
              onClick={fixData}
              disabled={saving}
              className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-amber-200 transition-colors flex items-center gap-2"
            >
              <Zap size={14} />
              Diagnostics
            </button>
            {['blogs', 'cards', 'reviews'].includes(activeTab) && (
              <button 
                onClick={() => {
                  setEditingItem(null);
                  if (activeTab === 'blogs') {
                    setBlogForm({ title: '', slug: '', excerpt: '', content: '', author: '', category: 'Credit Cards', image: 'https://picsum.photos/seed/blog/800/600', read_time: '5 min read', featured: false, status: 'published' as 'draft' | 'published', scheduled_at: '' });
                  } else if (activeTab === 'cards') {
                    setCardForm(defaultCardForm);
                  } else if (activeTab === 'reviews') {
                    setReviewForm(defaultReviewForm);
                  }
                  setIsModalOpen(true);
                }}
                className="bg-black text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-clay transition-colors shadow-lg"
              >
                <Plus size={20} /> Add New {activeTab === 'blogs' ? 'Post' : activeTab === 'reviews' ? 'Review' : 'Card'}
              </button>
            )}
          </div>
        </header>

        {/* Content Area */}
        {error && !isModalOpen && (
          <div className="mb-8 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-start gap-3">
            <AlertCircle className="mt-0.5 flex-shrink-0" size={16} />
            <div className="flex-1">
              <p className="font-bold mb-1">Action Failed</p>
              <p className="opacity-80">{error}</p>
              <div className="flex gap-4 mt-3">
                <button onClick={() => setError(null)} className="text-xs font-bold underline hover:text-red-800">Dismiss</button>
                <button 
                  onClick={() => {
                    const debugInfo = (window as any).lastSupabaseError;
                    alert(debugInfo ? `DEBUG INFO:\n${JSON.stringify(debugInfo, null, 2)}` : "No detailed Supabase error captured yet. Try the action again.");
                  }} 
                  className="text-xs font-bold underline text-amber-600 hover:text-amber-800"
                >
                  Show Debug Info
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
          {activeTab === 'blogs' && (
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
                          onClick={() => {
                            setEditingItem(blog);
                            setBlogForm({
                              title: blog.title,
                              slug: blog.slug || '',
                              excerpt: blog.excerpt,
                              content: blog.content,
                              author: blog.author,
                              category: blog.category,
                              image: blog.image,
                              read_time: blog.read_time || '5 min read',
                              featured: blog.featured || false,
                              status: blog.status || 'published',
                              scheduled_at: blog.scheduled_at || ''
                            });
                            setIsModalOpen(true);
                          }}
                          className="p-2 text-teal hover:bg-teal/10 rounded-lg transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => confirmDelete('blogs', blog.id!)}
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
          )}

          {activeTab === 'cards' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[1000px]">
                <thead className="bg-black/5 text-[10px] uppercase font-bold tracking-widest text-black/40">
                  <tr>
                    <th className="px-6 py-4">Card Name</th>
                    <th className="px-6 py-4">Bank</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Best For</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {cards.map(card => (
                    <tr key={card.id} className="hover:bg-black/[0.01] transition-colors">
                      <td className="px-6 py-4 font-bold text-sm">{card.name}</td>
                      <td className="px-6 py-4 text-sm text-black/60">{card.bank}</td>
                      <td className="px-6 py-4 text-sm text-black/60">{card.type}</td>
                      <td className="px-6 py-4 text-sm text-black/60">{card.best_for}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button 
                          onClick={() => {
                            setEditingItem(card);
                            setCardForm({
                              ...defaultCardForm,
                              name: card.name,
                              bank: card.bank,
                              issuer: card.issuer || '',
                              type: card.type,
                              image: card.image,
                              rating: card.rating,
                              elite_rating: card.elite_rating || card.rating || 4.5,
                              benefits: card.benefits || [''],
                              benefit_items: card.benefit_items && card.benefit_items.length > 0 ? card.benefit_items : [{ heading: '', subheading: '' }],
                              verdict: card.verdict || '',
                              slug: card.slug || '',
                              annual_fee: card.annual_fee,
                              joining_fee: card.joining_fee,
                              best_for: card.best_for,
                              category: card.category || 'Shopping',
                              categories: card.categories || (card.category ? [card.category] : []),
                              color: card.color,
                              rewards_rate: card.rewards_rate || '5%',
                              projected_savings: card.projected_savings || '₹12,000/yr',
                              status: card.status || 'published'
                            });
                            setIsModalOpen(true);
                          }}
                          className="p-2 text-teal hover:bg-teal/10 rounded-lg transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => confirmDelete('cards', card.id!)}
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
          )}
          {activeTab === 'reviews' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead className="bg-black/5 text-[10px] uppercase font-bold tracking-widest text-black/40">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Designation</th>
                    <th className="px-6 py-4">Company</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {reviews.map(review => (
                    <tr key={review.id} className="hover:bg-black/[0.01] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={review.image} alt="" className="w-8 h-8 rounded-full object-cover" />
                          <span className="font-bold text-sm">{review.author}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-black/60">{review.role}</td>
                      <td className="px-6 py-4 text-sm text-black/60">{review.company}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${review.status === 'published' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                          {review.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button 
                          onClick={() => {
                            setEditingItem(review);
                            setReviewForm({
                              author: review.author,
                              role: review.role,
                              company: review.company,
                              company_logo: review.company_logo || '',
                              image: review.image,
                              quote: review.quote,
                              rotation: review.rotation || 0,
                              status: review.status || 'published'
                            });
                            setIsModalOpen(true);
                          }}
                          className="p-2 text-teal hover:bg-teal/10 rounded-lg transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => confirmDelete('reviews', review.id!)}
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
          )}

          {activeTab === 'waitlist' && (
            <div className="space-y-6">
              {/* Status Tabs */}
              <div className="flex items-center gap-1 bg-black/5 p-1 rounded-2xl w-fit overflow-x-auto max-w-full no-scrollbar">
                {[
                  { id: 'pending', label: 'New Applicants', icon: Clock },
                  { id: 'accepted', label: 'Accepted', icon: CheckCircle },
                  { id: 'on_hold', label: 'On Hold', icon: PauseCircle },
                  { id: 'rejected', label: 'Rejected', icon: XCircle },
                  { id: 'all', label: 'All', icon: Filter }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const count = tab.id === 'all' 
                    ? waitlist.length 
                    : waitlist.filter(e => (e.status || 'pending') === tab.id).length;
                    
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setWaitlistFilter(tab.id as any)}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                        waitlistFilter === tab.id 
                          ? 'bg-white text-teal shadow-sm' 
                          : 'text-black/40 hover:text-black hover:bg-white/50'
                      }`}
                    >
                      <Icon size={14} />
                      {tab.label}
                      <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[8px] ${
                        waitlistFilter === tab.id ? 'bg-teal/10 text-teal' : 'bg-black/5 text-black/40'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-2 min-w-[900px]">
                  <thead className="bg-black/5 text-[10px] uppercase font-bold tracking-widest text-black/40">
                    <tr>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Details</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {waitlist
                      .filter(entry => waitlistFilter === 'all' || (entry.status || 'pending') === waitlistFilter)
                      .map(entry => (
                        <tr key={entry.id} className="bg-white hover:bg-black/[0.01] transition-colors rounded-xl overflow-hidden">
                          <td className="px-6 py-4">
                            <div className="font-bold text-sm text-black">{entry.name}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-black/60">{entry.email}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${entry.role === 'user' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                              {entry.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-black/60 max-w-[200px] truncate">
                            {entry.role === 'user' ? `Category: ${entry.category}` : `Company: ${entry.company}`}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button 
                                onClick={() => handleUpdateWaitlistStatus(entry.id!, 'accepted')}
                                disabled={entry.status === 'accepted'}
                                title="Accept User"
                                className={`p-2 rounded-lg transition-all ${entry.status === 'accepted' ? 'text-green-600 bg-green-50' : 'text-black/20 hover:text-green-600 hover:bg-green-50'}`}
                              >
                                <CheckCircle size={18} />
                              </button>
                              <button 
                                onClick={() => handleUpdateWaitlistStatus(entry.id!, 'on_hold')}
                                disabled={entry.status === 'on_hold'}
                                title="Put on Hold"
                                className={`p-2 rounded-lg transition-all ${entry.status === 'on_hold' ? 'text-amber-600 bg-amber-50' : 'text-black/20 hover:text-amber-600 hover:bg-amber-50'}`}
                              >
                                <PauseCircle size={18} />
                              </button>
                              <button 
                                onClick={() => handleUpdateWaitlistStatus(entry.id!, 'rejected')}
                                disabled={entry.status === 'rejected'}
                                title="Reject User"
                                className={`p-2 rounded-lg transition-all ${entry.status === 'rejected' ? 'text-red-600 bg-red-50' : 'text-black/20 hover:text-red-600 hover:bg-red-50'}`}
                              >
                                <XCircle size={18} />
                              </button>
                              <button 
                                onClick={() => handleUpdateWaitlistStatus(entry.id!, 'pending')}
                                disabled={!entry.status || entry.status === 'pending'}
                                title="Reset to Pending"
                                className="p-2 text-black/20 hover:text-black hover:bg-black/5 rounded-lg transition-all"
                              >
                                <RotateCcw size={16} />
                              </button>
                              <button 
                                onClick={() => confirmDelete('waitlist', entry.id!)}
                                title="Delete Entry"
                                className="p-2 text-black/20 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-4 md:p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                  <h3 className="text-xl font-serif font-bold mb-1">Team Management</h3>
                  <p className="text-black/40 text-xs">Manage administrative access and contributing writers.</p>
                </div>
                <button 
                  onClick={() => {
                    setEditingItem(null);
                    setTeamForm({ email: '', role: 'writer' });
                    setIsModalOpen(true);
                  }}
                  className="w-full md:w-auto bg-black text-white px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> Add Member
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[700px]">
                  <thead className="bg-black/5 text-[10px] uppercase font-bold tracking-widest text-black/40">
                    <tr>
                      <th className="px-6 py-4">Full Name</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {team.map(member => (
                      <tr key={member.id} className="hover:bg-black/[0.01] transition-colors">
                        <td className="px-6 py-4 font-bold text-sm">{member.full_name || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-black/60">{member.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${member.role === 'admin' ? 'bg-red-100 text-red-600' : member.role === 'editor' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                            {member.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button 
                            onClick={() => {
                              setEditingItem(member);
                              setTeamForm({ email: member.email, role: member.role });
                              setIsModalOpen(true);
                            }}
                            className="p-2 text-teal hover:bg-teal/10 rounded-lg transition-colors"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => confirmDelete('users', member.id)}
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
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="p-4 md:p-8">
              <div className="mb-8">
                <h3 className="text-xl font-serif font-bold mb-1">System Activity Log</h3>
                <p className="text-black/40 text-xs">A transparent record of all changes made to the platform.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                  <thead className="bg-black/5 text-[10px] uppercase font-bold tracking-widest text-black/40">
                    <tr>
                      <th className="px-6 py-4">Time</th>
                      <th className="px-6 py-4">Member</th>
                      <th className="px-6 py-4">Action</th>
                      <th className="px-6 py-4">Target Type</th>
                      <th className="px-6 py-4">Record Name</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {logs.map(log => (
                      <tr key={log.id} className="hover:bg-black/[0.01] transition-colors">
                        <td className="px-6 py-4 text-xs text-black/40">
                          {log.created_at ? new Date(log.created_at).toLocaleString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 font-bold text-sm">{log.user_email || 'System'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${log.action === 'INSERT' ? 'bg-green-100 text-green-600' : log.action === 'UPDATE' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'}`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-black/60 capitalize">{log.table_name}</td>
                        <td className="px-6 py-4 font-bold text-sm">{log.record_name || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 size={32} />
            </div>
            <h3 className="text-2xl font-serif font-bold mb-2">Confirm Delete</h3>
            <p className="text-black/60 mb-8">Are you sure you want to delete this item? This action cannot be undone.</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-6 py-3 rounded-xl font-bold border border-black/10 hover:bg-black/5 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="flex-1 px-6 py-3 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-black/5 flex justify-between items-center">
              <h2 className="text-2xl font-serif font-bold">
                {editingItem ? 'Edit' : 'Add New'} {activeTab === 'blogs' ? 'Blog Post' : activeTab === 'cards' ? 'Card' : activeTab === 'reviews' ? 'Review' : 'Team Member'}
              </h2>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setPreviewUrl(null);
                  setError(null);
                }} 
                className="text-black/40 hover:text-black transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div id="admin-modal-content" className="p-6 overflow-y-auto">
              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-start gap-3">
                  <X className="mt-0.5 flex-shrink-0" size={16} />
                  <div>
                    <p className="font-bold mb-1">Error Saving Data</p>
                    <p className="opacity-80">{error}</p>
                    <p className="mt-2 text-[10px] uppercase tracking-widest font-bold">Please check all fields and try again.</p>
                  </div>
                </div>
              )}

              {activeTab === 'blogs' ? (
                <form onSubmit={handleSaveBlog} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Title</label>
                        <input 
                          type="text" 
                          required
                          value={blogForm.title}
                          onChange={e => setBlogForm({...blogForm, title: e.target.value})}
                          className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Slug (URL Configuration)</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="auto-generated-from-title"
                            value={blogForm.slug}
                            onChange={e => setBlogForm({...blogForm, slug: e.target.value})}
                            className="flex-1 bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all"
                          />
                          <button 
                            type="button"
                            onClick={() => setBlogForm({...blogForm, slug: blogForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')})}
                            className="px-4 bg-black/5 rounded-xl hover:bg-black/10 transition-colors"
                            title="Regenerate slug"
                          >
                            <Settings size={18} />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Author</label>
                          <input 
                            type="text" 
                            required
                            value={blogForm.author}
                            onChange={e => setBlogForm({...blogForm, author: e.target.value})}
                            className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Category</label>
                          <select 
                            value={blogForm.category}
                            onChange={e => setBlogForm({...blogForm, category: e.target.value})}
                            className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all"
                          >
                            <option>Credit Cards</option>
                            <option>Finance</option>
                            <option>Lifestyle</option>
                            <option>Technology</option>
                            <option>Savings</option>
                            <option>Fintech</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Publish Status</label>
                          <select 
                            value={blogForm.status}
                            onChange={e => setBlogForm({...blogForm, status: e.target.value as 'draft' | 'published'})}
                            className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all"
                          >
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2 flex items-center gap-2">
                             <Clock size={12} /> Schedule Release
                           </label>
                          <input 
                            type="datetime-local" 
                            value={blogForm.scheduled_at}
                            onChange={e => setBlogForm({...blogForm, scheduled_at: e.target.value})}
                            className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all"
                          />
                          <p className="text-[9px] text-black/40 mt-1 font-bold uppercase tracking-tight">Leave blank for immediate publication</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-black/5 rounded-xl h-[56px]">
                        <input 
                          type="checkbox" 
                          id="featured"
                          checked={blogForm.featured}
                          onChange={e => setBlogForm({...blogForm, featured: e.target.checked})}
                          className="w-5 h-5 accent-teal"
                        />
                        <label htmlFor="featured" className="text-sm font-bold text-black/60 cursor-pointer">Featured Post</label>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Cover Image</label>
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-black/5 border-2 border-dashed border-black/10 group">
                        {blogForm.image ? (
                          <img src={blogForm.image} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-black/20">
                            <ImageIcon size={48} />
                            <p className="text-xs font-bold uppercase tracking-widest mt-2">No Image Selected</p>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                          <button 
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-white text-black p-3 rounded-full hover:scale-110 transition-transform"
                          >
                            <Upload size={20} />
                          </button>
                        </div>
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={(e) => handleFileUpload(e, 'blogs')}
                        className="hidden" 
                        accept="image/*"
                      />
                      <input 
                        type="text" 
                        placeholder="Or enter image URL"
                        value={blogForm.image}
                        onChange={e => setBlogForm({...blogForm, image: e.target.value})}
                        className="w-full bg-black/5 border-none rounded-xl p-3 text-xs focus:ring-2 focus:ring-teal outline-none transition-all"
                      />
                      {uploading && (
                        <div className="flex items-center gap-2 text-teal text-xs font-bold">
                          <Loader2 size={14} className="animate-spin" /> Uploading...
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Excerpt</label>
                    <textarea 
                      required
                      value={blogForm.excerpt}
                      onChange={e => setBlogForm({...blogForm, excerpt: e.target.value})}
                      className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all h-24"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Content (Markdown)</label>
                    <textarea 
                      required
                      value={blogForm.content}
                      onChange={e => setBlogForm({...blogForm, content: e.target.value})}
                      className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all h-64 font-mono text-sm"
                    />
                  </div>
                  
                  <div className="flex justify-end pt-4 border-t border-black/5">
                    <button 
                      type="submit" 
                      disabled={uploading || saving}
                      className="bg-teal text-white px-10 py-4 rounded-xl font-bold hover:bg-teal/90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {(uploading || saving) ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                      {saving ? 'Saving...' : 'Save Blog Post'}
                    </button>
                  </div>
                </form>
              ) : activeTab === 'cards' ? (
                <form onSubmit={handleSaveCard} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Card Name</label>
                          <input 
                            type="text" 
                            required
                            value={cardForm.name}
                            onChange={e => setCardForm({...cardForm, name: e.target.value})}
                            className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Bank</label>
                          <select
                            required
                            value={cardForm.bank}
                            onChange={e => setCardForm({...cardForm, bank: e.target.value, issuer: e.target.value})}
                            className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all"
                          >
                            <option value="">— Select Bank —</option>
                            {ADMIN_BANKS.map(b => (
                              <option key={b} value={b}>{b}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2 flex items-center justify-between">
                              Slug 
                              <button type="button" onClick={() => {
                                  const gen = generateSlug(cardForm.name, cardForm.bank);
                                  setCardForm({...cardForm, slug: gen});
                              }} className="text-[9px] text-teal hover:underline">Auto-Generate</button>
                          </label>
                          <input 
                              type="text" 
                              placeholder="e.g. hdfc-infinia-hdfc"
                              value={cardForm.slug || ''}
                              onChange={e => setCardForm({...cardForm, slug: e.target.value})}
                              className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all"
                          />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Issuer</label>
                          <input 
                            type="text" 
                            required
                            value={cardForm.issuer}
                            onChange={e => setCardForm({...cardForm, issuer: e.target.value})}
                            className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Rating</label>
                          <input 
                            type="number" step="0.1" min="0" max="5" required
                            value={cardForm.rating}
                            onChange={e => setCardForm({...cardForm, rating: parseFloat(e.target.value)})}
                            className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-teal mb-2">Elite (out of 5)</label>
                          <input 
                            type="number" step="0.1" min="0" max="5" required
                            value={cardForm.elite_rating}
                            onChange={e => setCardForm({...cardForm, elite_rating: parseFloat(e.target.value)})}
                            className="w-full bg-teal/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all text-teal font-bold px-2 md:px-4"
                          />
                        </div>
                      </div>

                      <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Categories</label>
                          <div className="w-full bg-black/5 border-none rounded-xl p-4 h-[240px] overflow-y-auto grid grid-cols-2 gap-2">
                            {ADMIN_CATEGORIES.map(cat => (
                              <label key={cat} className="flex items-center gap-3 cursor-pointer p-1">
                                <input 
                                  type="checkbox" 
                                  checked={cardForm.categories.includes(cat)}
                                  onChange={e => {
                                      const newCategories = e.target.checked 
                                        ? [...cardForm.categories, cat] 
                                        : cardForm.categories.filter(c => c !== cat);
                                      setCardForm({
                                          ...cardForm, 
                                          categories: newCategories,
                                          category: newCategories.length ? newCategories[0] : ''
                                      });
                                  }}
                                  className="w-4 h-4 rounded border-black/10 text-teal focus:ring-teal shrink-0"
                                />
                                <span className="text-sm text-black/60 truncate">{cat}</span>
                              </label>
                            ))}
                          </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Card Image</label>
                        <div className="relative aspect-[1.6/1] rounded-xl overflow-hidden bg-black/5 border-2 border-dashed border-black/10 group">
                          {cardForm.image ? (
                            <img src={cardForm.image} alt="Preview" className="w-full h-full object-contain p-4" />
                          ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-black/20">
                              <ImageIcon size={48} />
                              <p className="text-xs font-bold uppercase tracking-widest mt-2">No Image Selected</p>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                            <button 
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="bg-white text-black p-3 rounded-full hover:scale-110 transition-transform"
                            >
                              <Upload size={20} />
                            </button>
                          </div>
                        </div>
                        <input 
                          type="file" 
                          ref={fileInputRef}
                          onChange={(e) => handleFileUpload(e, 'cards')}
                          className="hidden" 
                          accept="image/*"
                        />
                        <input 
                          type="text" 
                          placeholder="Or enter image URL"
                          value={cardForm.image}
                          onChange={e => setCardForm({...cardForm, image: e.target.value})}
                          className="w-full bg-black/5 border-none rounded-xl p-3 text-xs focus:ring-2 focus:ring-teal outline-none transition-all"
                        />
                        {uploading && (
                          <div className="flex items-center gap-2 text-teal text-xs font-bold">
                            <Loader2 size={14} className="animate-spin" /> Uploading...
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Annual Fee</label>
                          <input 
                            type="text" 
                            required
                            value={cardForm.annual_fee}
                            onChange={e => setCardForm({...cardForm, annual_fee: e.target.value})}
                            className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Joining Fee</label>
                          <input 
                            type="text" 
                            required
                            value={cardForm.joining_fee}
                            onChange={e => setCardForm({...cardForm, joining_fee: e.target.value})}
                            className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Rewards Rate</label>
                          <input 
                            type="text" 
                            required
                            value={cardForm.rewards_rate}
                            onChange={e => setCardForm({...cardForm, rewards_rate: e.target.value})}
                            className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Projected Savings</label>
                          <input 
                            type="text" 
                            required
                            value={cardForm.projected_savings}
                            onChange={e => setCardForm({...cardForm, projected_savings: e.target.value})}
                            className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Type</label>
                          <select 
                            value={cardForm.type}
                            onChange={e => setCardForm({...cardForm, type: e.target.value})}
                            className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all"
                          >
                            <option>Rewards</option>
                            <option>Travel</option>
                            <option>Cashback</option>
                            <option>Premium</option>
                            <option>Fuel</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Best For</label>
                          <select
                            value={cardForm.best_for}
                            onChange={e => setCardForm({...cardForm, best_for: e.target.value})}
                            className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all"
                          >
                            {ADMIN_CATEGORIES.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Publish Status</label>
                          <select 
                            value={cardForm.status}
                            onChange={e => setCardForm({...cardForm, status: e.target.value as 'draft' | 'published'})}
                            className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all"
                          >
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Apply Link (Optional)</label>
                          <input 
                            type="url" 
                            placeholder="https://..."
                            value={cardForm.apply_link || ''}
                            onChange={e => setCardForm({...cardForm, apply_link: e.target.value})}
                            className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Full Width Sections */}
                  <div className="space-y-8 pt-8 border-t border-black/5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-4">Structured Benefits Portfolio</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {cardForm.benefit_items.map((benefit, idx) => (
                            <div key={idx} className="flex items-start gap-4 bg-black/5 p-4 rounded-xl border border-black/5 relative group/item">
                              <div className="flex-1 space-y-3">
                                  <input 
                                    type="text" placeholder="Benefit Heading (e.g. Free Lounge Access)" required
                                    value={benefit.heading}
                                    onChange={e => {
                                        const newItems = [...cardForm.benefit_items];
                                        newItems[idx].heading = e.target.value;
                                        setCardForm({...cardForm, benefit_items: newItems, benefits: newItems.map(i => i.heading)});
                                    }}
                                    className="w-full bg-white border-none rounded-lg p-3 text-sm font-bold focus:ring-2 focus:ring-teal outline-none shadow-sm"
                                  />
                                  <input 
                                    type="text" placeholder="Benefit Subheading (e.g. Premium lifestyle benefit included...)" required
                                    value={benefit.subheading}
                                    onChange={e => {
                                        const newItems = [...cardForm.benefit_items];
                                        newItems[idx].subheading = e.target.value;
                                        setCardForm({...cardForm, benefit_items: newItems});
                                    }}
                                    className="w-full bg-transparent border border-black/10 rounded-lg p-3 text-xs focus:ring-2 focus:ring-teal outline-none"
                                  />
                              </div>
                              <button 
                                type="button" 
                                onClick={() => {
                                  const newItems = cardForm.benefit_items.filter((_, i) => i !== idx);
                                  setCardForm({...cardForm, benefit_items: newItems, benefits: newItems.map(i => i.heading)});
                                }} 
                                className="text-red-500 hover:bg-red-50 p-2 rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                          <button 
                            type="button" 
                            onClick={() => {
                                setCardForm({...cardForm, benefit_items: [...cardForm.benefit_items, {heading: '', subheading: ''}]});
                            }} 
                            className="flex flex-col items-center justify-center border-2 border-dashed border-black/10 rounded-xl p-6 hover:border-teal/50 hover:bg-teal/5 transition-all group"
                          >
                              <Plus className="text-black/20 group-hover:text-teal mb-2" />
                              <span className="text-teal font-bold text-[10px] uppercase tracking-widest">Add Benefit Row</span>
                          </button>
                      </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Editorial Verdict</label>
                        <textarea 
                          placeholder="The KIWI remains a cornerstone of the ecosystem..."
                          value={cardForm.verdict || ''}
                          onChange={e => setCardForm({...cardForm, verdict: e.target.value})}
                          className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all h-32 text-sm leading-relaxed"
                        />
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-8 border-t border-black/5">
                    <button 
                      type="submit" 
                      disabled={uploading || saving}
                      className="bg-teal text-white px-10 py-4 rounded-xl font-bold hover:bg-teal/90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {(uploading || saving) ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                      Save Card
                    </button>
                  </div>
                </form>
              ) : activeTab === 'reviews' ? (
                <form onSubmit={handleSaveReview} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Portrait Upload */}
                    <div className="space-y-4">
                      <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">User Photo</label>
                      <div className="relative aspect-[4/5] w-full max-w-[240px] mx-auto bg-black/5 rounded-xl overflow-hidden border-2 border-dashed border-black/10 group">
                        {reviewForm.image ? (
                          <img src={reviewForm.image} alt="Preview" className="w-full h-full object-cover grayscale" />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-black/20">
                            <ImageIcon size={48} />
                            <p className="text-xs font-bold uppercase tracking-widest mt-2 text-center px-4">Upload Portrait</p>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button 
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-white text-black p-3 rounded-full hover:scale-110 transition-transform"
                          >
                            <Upload size={20} />
                          </button>
                        </div>
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={(e) => handleFileUpload(e, 'reviews')}
                        className="hidden" 
                        accept="image/*"
                      />
                      <input 
                        type="text" 
                        placeholder="Image URL"
                        value={reviewForm.image}
                        onChange={e => setReviewForm({...reviewForm, image: e.target.value})}
                        className="w-full bg-black/5 border-none rounded-xl p-3 text-xs focus:ring-2 focus:ring-teal outline-none transition-all"
                      />
                    </div>

                    {/* Details */}
                    <div className="space-y-6">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">User Name</label>
                        <input 
                          type="text" 
                          required
                          value={reviewForm.author}
                          onChange={e => setReviewForm({...reviewForm, author: e.target.value})}
                          className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Designation</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Marketing VP"
                          value={reviewForm.role}
                          onChange={e => setReviewForm({...reviewForm, role: e.target.value})}
                          className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Company</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Zepto"
                          value={reviewForm.company}
                          onChange={e => setReviewForm({...reviewForm, company: e.target.value})}
                          className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Status</label>
                          <select 
                            value={reviewForm.status}
                            onChange={e => setReviewForm({...reviewForm, status: e.target.value as 'draft' | 'published'})}
                            className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all"
                          >
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Rotation (°)</label>
                          <input 
                            type="number" 
                            step="0.5"
                            value={reviewForm.rotation}
                            onChange={e => setReviewForm({...reviewForm, rotation: parseFloat(e.target.value) || 0})}
                            className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Company Logo</label>
                        <div className="flex items-center gap-4">
                           <div className="w-16 h-16 bg-black/5 rounded-lg overflow-hidden flex items-center justify-center border border-black/5 flex-shrink-0">
                             {reviewForm.company_logo ? (
                               <img src={reviewForm.company_logo} alt="Logo Preview" className="w-full h-full object-contain p-2" />
                             ) : (
                               <div className="text-black/10"><ImageIcon size={24} /></div>
                             )}
                           </div>
                           <div className="flex-1 space-y-2">
                             <input 
                               type="text" 
                               placeholder="Logo URL"
                               value={reviewForm.company_logo}
                               onChange={e => setReviewForm({...reviewForm, company_logo: e.target.value})}
                               className="w-full bg-black/5 border-none rounded-xl p-3 text-xs focus:ring-2 focus:ring-teal outline-none transition-all"
                             />
                             <button 
                               type="button"
                               onClick={() => {
                                 const input = document.createElement('input');
                                 input.type = 'file';
                                 input.accept = 'image/*';
                                 input.onchange = (e) => handleFileUpload(e as any, 'reviews_logo');
                                 input.click();
                               }}
                               className="text-[10px] font-bold uppercase tracking-widest text-teal hover:underline"
                             >
                               Upload Logo
                             </button>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Testimonial Quote</label>
                    <textarea 
                      required
                      value={reviewForm.quote}
                      onChange={e => setReviewForm({...reviewForm, quote: e.target.value})}
                      className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all h-32 font-serif text-lg italic"
                    />
                  </div>

                  <div className="flex justify-end pt-4 border-t border-black/5">
                    <button 
                      type="submit" 
                      disabled={uploading || saving}
                      className="bg-black text-white px-10 py-4 rounded-xl font-bold hover:bg-clay transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {(uploading || saving) ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                      {saving ? 'Saving...' : 'Save Review'}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSaveTeam} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      required
                      disabled={!!editingItem}
                      value={teamForm.email}
                      onChange={e => setTeamForm({...teamForm, email: e.target.value})}
                      className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all disabled:opacity-50"
                      placeholder="e.g. writer@yureka.money"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Administrative Role</label>
                    <select 
                      value={teamForm.role}
                      onChange={e => setTeamForm({...teamForm, role: e.target.value})}
                      className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all"
                    >
                      <option value="writer">Blog Writer (Write/Edit Blogs Only)</option>
                      <option value="editor">Editor (Cards & Blogs)</option>
                      <option value="admin">Admin (Full Access)</option>
                    </select>
                  </div>
                  
                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex gap-3 text-amber-700 text-xs leading-relaxed">
                    <AlertCircle size={18} className="shrink-0" />
                    <p>
                      Adding a team member allows them to sign in via Google. 
                      Permissions are enforced based on the designated role via Supabase RLS.
                    </p>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-black/5">
                    <button 
                      type="submit" 
                      disabled={saving}
                      className="bg-teal text-white px-10 py-4 rounded-xl font-bold hover:bg-teal/90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {saving ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                      {editingItem ? 'Update Role' : 'Invite Member'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
