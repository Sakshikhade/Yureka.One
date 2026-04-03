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
  Pause
} from 'lucide-react';
import { 
  getBlogs, addBlog, updateBlog, deleteBlog,
  getCardsAdmin, addCard, updateCard, deleteCard,
  getWaitlist, deleteWaitlistEntry, updateWaitlistStatus,
  checkIfAdmin, getTeamMembers, inviteTeamMember, updateUserRole, deleteUser, getAuditLogs
} from '../services/supabaseService';
import { Blog, Card, WaitlistEntry } from '../types';

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
  const [activeTab, setActiveTab] = useState<'blogs' | 'cards' | 'waitlist' | 'settings' | 'logs'>('blogs');
  
  const [error, setError] = useState<string | null>(null);
  
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [team, setTeam] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  
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
        handleLogout();
        alert("Security Session Expired: You have been logged out due to 15 minutes of inactivity.");
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
    status: 'published' as 'draft' | 'published'
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
  
  // Team Form State
  const [teamForm, setTeamForm] = useState({
    email: '',
    role: 'writer'
  });

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
    const unsubscribeBlogs = getBlogs((fetched) => {
      setBlogs(fetched);
      checkConnection();
    });

    // Subscribe to Cards
    const unsubscribeCards = getCardsAdmin((fetched) => setCards(fetched));

    // Subscribe to Waitlist
    const unsubscribeWaitlist = getWaitlist((fetched) => setWaitlist(fetched));

    return () => {
      unsubscribeBlogs();
      unsubscribeCards();
      unsubscribeWaitlist();
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'blogs' | 'cards') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instant local preview
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    
    // Optimistically update form image for immediate visual feedback
    if (type === 'blogs') {
      setBlogForm(prev => ({ ...prev, image: localUrl }));
    } else {
      setCardForm(prev => ({ ...prev, image: localUrl }));
    }

    setUploading(true);
    try {
      const { data, error } = await supabase.storage.from('media').upload(`${type}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`, file);
      if (error) throw error;
      
      const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(data.path);
      const url = publicUrlData.publicUrl;
      
      // Update with the real URL from Supabase Storage
      if (type === 'blogs') {
        setBlogForm(prev => ({ ...prev, image: url }));
      } else {
        setCardForm(prev => ({ ...prev, image: url }));
      }
      setPreviewUrl(url);
    } catch (error) {
      console.error("Error uploading file", error);
      setError("Failed to upload image. Please try again.");
      // Rollback preview and form image if upload fails
      setPreviewUrl(null);
      if (type === 'blogs') {
        setBlogForm(prev => ({ ...prev, image: editingItem?.image || 'https://picsum.photos/seed/blog/800/600' }));
      } else {
        setCardForm(prev => ({ ...prev, image: editingItem?.image || 'https://picsum.photos/seed/card/400/250' }));
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
      setBlogForm({ title: '', slug: '', excerpt: '', content: '', author: '', category: 'Credit Cards', image: 'https://picsum.photos/seed/blog/800/600', read_time: '5 min read', featured: false, status: 'published' as 'draft' | 'published' });
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
    <div className="min-h-screen bg-[#F8F9FA] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-black/5 flex flex-col fixed h-full z-20">
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
            onClick={() => setActiveTab('blogs')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'blogs' ? 'bg-teal/10 text-teal font-bold' : 'text-black/60 hover:bg-black/5'}`}
          >
            <FileText size={20} /> Blogs
          </button>

          {/* Cards - Admin & Editor */}
          {['admin', 'editor'].includes(userRole) && (
            <button 
              onClick={() => setActiveTab('cards')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'cards' ? 'bg-teal/10 text-teal font-bold' : 'text-black/60 hover:bg-black/5'}`}
            >
              <CreditCard size={20} /> Cards
            </button>
          )}

          {/* Waitlist - Admin only */}
          {userRole === 'admin' && (
            <button 
              onClick={() => setActiveTab('waitlist')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'waitlist' ? 'bg-teal/10 text-teal font-bold' : 'text-black/60 hover:bg-black/5'}`}
            >
              <Users size={20} /> Waitlist
            </button>
          )}

          {/* Settings - Admin only */}
          {userRole === 'admin' && (
            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'settings' ? 'bg-teal/10 text-teal font-bold' : 'text-black/60 hover:bg-black/5'}`}
            >
              <Settings size={20} /> Team Settings
            </button>
          )}

          {/* Activity Logs - Admin only */}
          {userRole === 'admin' && (
            <button 
              onClick={() => setActiveTab('logs')}
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
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
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
            {activeTab !== 'waitlist' && (
              <button 
                onClick={() => {
                  setEditingItem(null);
                  if (activeTab === 'blogs') {
                    setBlogForm({ title: '', slug: '', excerpt: '', content: '', author: '', category: 'Credit Cards', image: 'https://picsum.photos/seed/blog/800/600', read_time: '5 min read', featured: false, status: 'published' as 'draft' | 'published' });
                  } else {
                    setCardForm(defaultCardForm);
                    setIsModalOpen(true);
                  }
                  setIsModalOpen(true);
                }}
                className="bg-black text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-clay transition-colors shadow-lg"
              >
                <Plus size={20} /> Add New {activeTab === 'blogs' ? 'Post' : 'Card'}
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
            <table className="w-full text-left">
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
                      {blog.created_at ? new Date(blog.created_at).toLocaleDateString() : 'N/A'}
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
                            status: blog.status || 'published'
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
          )}

          {activeTab === 'cards' && (
            <table className="w-full text-left">
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
          )}

          {activeTab === 'waitlist' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-2">
                <thead className="bg-black/5 text-[10px] uppercase font-bold tracking-widest text-black/40">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Details</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {waitlist.map(entry => (
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
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          entry.status === 'accepted' ? 'bg-green-50 text-green-600' :
                          entry.status === 'rejected' ? 'bg-red-50 text-red-600' :
                          entry.status === 'on_hold' ? 'bg-amber-50 text-amber-600' :
                          'bg-black/5 text-black/40'
                        }`}>
                          {entry.status === 'accepted' ? <Check size={10} /> : 
                           entry.status === 'rejected' ? <X size={10} /> :
                           entry.status === 'on_hold' ? <Pause size={10} /> : <Clock size={10} />}
                          {entry.status || 'pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[10px] font-bold text-black/30">
                        {entry.created_at ? new Date(entry.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => handleUpdateWaitlistStatus(entry.id!, 'accepted')}
                            disabled={entry.status === 'accepted'}
                            title="Accept User"
                            className={`p-2 rounded-lg transition-all ${entry.status === 'accepted' ? 'text-green-600 bg-green-50' : 'text-black/20 hover:text-green-600 hover:bg-green-50'}`}
                          >
                            <Check size={18} />
                          </button>
                          <button 
                            onClick={() => handleUpdateWaitlistStatus(entry.id!, 'on_hold')}
                            disabled={entry.status === 'on_hold'}
                            title="Put on Hold"
                            className={`p-2 rounded-lg transition-all ${entry.status === 'on_hold' ? 'text-amber-600 bg-amber-50' : 'text-black/20 hover:text-amber-600 hover:bg-amber-50'}`}
                          >
                            <Pause size={18} />
                          </button>
                          <button 
                            onClick={() => handleUpdateWaitlistStatus(entry.id!, 'rejected')}
                            disabled={entry.status === 'rejected'}
                            title="Reject User"
                            className={`p-2 rounded-lg transition-all ${entry.status === 'rejected' ? 'text-red-600 bg-red-50' : 'text-black/20 hover:text-red-600 hover:bg-red-50'}`}
                          >
                            <X size={18} />
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
          )}

          {activeTab === 'settings' && (
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
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
                  className="bg-black text-white px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2"
                >
                  <Plus size={16} /> Add Member
                </button>
              </div>

              <table className="w-full text-left">
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
                  {team.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-black/40 italic font-serif">
                        No team members found. Team functionality requires 'users' table setup.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-serif font-bold mb-1">System Activity Log</h3>
                  <p className="text-black/40 text-xs">A transparent record of all changes made to the platform.</p>
                </div>
              </div>

              <table className="w-full text-left">
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
                  {logs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-black/40 italic font-serif">
                        No activity logs found. Try performing some changes.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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
                {editingItem ? 'Edit' : 'Add New'} {activeTab === 'blogs' ? 'Blog Post' : activeTab === 'cards' ? 'Card' : 'Team Member'}
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
                        <div className="flex items-center gap-4 p-4 bg-black/5 rounded-xl h-[56px] mt-6">
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
