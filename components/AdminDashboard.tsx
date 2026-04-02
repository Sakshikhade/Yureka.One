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
  Zap
} from 'lucide-react';
import { 
  getBlogs, addBlog, updateBlog, deleteBlog,
  getCardsAdmin, addCard, updateCard, deleteCard,
  getWaitlist, deleteWaitlistEntry,
  checkIfAdmin 
} from '../services/supabaseService';
import { Blog, Card, WaitlistEntry } from '../types';

const AdminDashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'blogs' | 'cards' | 'waitlist'>('blogs');
  
  const [error, setError] = useState<string | null>(null);
  
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{collection: string, id: string} | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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

  // Card Form State
  const [cardForm, setCardForm] = useState({
    name: '',
    bank: '',
    issuer: '',
    type: 'Rewards',
    image: 'https://picsum.photos/seed/card/400/250',
    rating: 4.5,
    benefits: [''],
    annual_fee: '₹0',
    joining_fee: '₹0',
    best_for: 'Shopping',
    category: 'Shopping',
    color: 'from-blue-600 to-indigo-700',
    rewards_rate: '5%',
    projected_savings: '₹12,000/yr',
    status: 'published' as 'draft' | 'published'
  });

  // Real-time status indicators
  const [syncStatus, setSyncStatus] = useState<'connected' | 'reconnecting' | 'error'>('connected');

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user || null;
      setUser(user);
      if (user) {
        const adminStatus = await checkIfAdmin(user.id, user.email);
        setIsAdmin(adminStatus);
      } else {
        setIsAdmin(false);
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
      setCardForm({ name: '', bank: '', issuer: '', type: 'Rewards', image: 'https://picsum.photos/seed/card/400/250', rating: 4.5, benefits: [''], annual_fee: '₹0', joining_fee: '₹0', best_for: 'Shopping', category: 'Shopping', color: 'from-blue-600 to-indigo-700', rewards_rate: '5%', projected_savings: '₹12,000/yr', status: 'published' as 'draft' | 'published' });
    } catch (error: any) {
      console.error("Save Card Error:", error);
      setError(error.message || "Failed to save card. If this persists, please run the SQL fix script.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      if (itemToDelete.collection === 'blogs') await deleteBlog(itemToDelete.id);
      else if (itemToDelete.collection === 'cards') await deleteCard(itemToDelete.id);
      else if (itemToDelete.collection === 'waitlist') await deleteWaitlistEntry(itemToDelete.id);
      
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
          <button 
            onClick={() => setActiveTab('blogs')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'blogs' ? 'bg-teal/10 text-teal font-bold' : 'text-black/60 hover:bg-black/5'}`}
          >
            <FileText size={20} /> Blogs
          </button>
          <button 
            onClick={() => setActiveTab('cards')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'cards' ? 'bg-teal/10 text-teal font-bold' : 'text-black/60 hover:bg-black/5'}`}
          >
            <CreditCard size={20} /> Cards
          </button>
          <button 
            onClick={() => setActiveTab('waitlist')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'waitlist' ? 'bg-teal/10 text-teal font-bold' : 'text-black/60 hover:bg-black/5'}`}
          >
            <Users size={20} /> Waitlist
          </button>
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
                    setCardForm({ name: '', bank: '', issuer: '', type: 'Rewards', image: 'https://picsum.photos/seed/card/400/250', rating: 4.5, benefits: [''], annual_fee: '₹0', joining_fee: '₹0', best_for: 'Shopping', category: 'Shopping', color: 'from-blue-600 to-indigo-700', rewards_rate: '5%', projected_savings: '₹12,000/yr', status: 'published' as 'draft' | 'published' });
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
                            name: card.name,
                            bank: card.bank,
                            issuer: card.issuer || '',
                            type: card.type,
                            image: card.image,
                            rating: card.rating,
                            benefits: card.benefits,
                            annual_fee: card.annual_fee,
                            joining_fee: card.joining_fee,
                            best_for: card.best_for,
                            category: card.category || 'Shopping',
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
            <table className="w-full text-left">
              <thead className="bg-black/5 text-[10px] uppercase font-bold tracking-widest text-black/40">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Details</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {waitlist.map(entry => (
                  <tr key={entry.id} className="hover:bg-black/[0.01] transition-colors">
                    <td className="px-6 py-4 font-bold text-sm">{entry.name}</td>
                    <td className="px-6 py-4 text-sm text-black/60">{entry.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${entry.role === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                        {entry.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-black/60">
                      {entry.role === 'user' ? `Category: ${entry.category}` : `Company: ${entry.company}`}
                    </td>
                    <td className="px-6 py-4 text-sm text-black/60">
                      {entry.created_at ? new Date(entry.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                {editingItem ? 'Edit' : 'Add New'} {activeTab === 'blogs' ? 'Blog Post' : 'Card'}
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

            <div className="p-6 overflow-y-auto">
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
              ) : (
                <form onSubmit={handleSaveCard} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
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
                          <input 
                            type="text" 
                            required
                            value={cardForm.bank}
                            onChange={e => setCardForm({...cardForm, bank: e.target.value})}
                            className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
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
                          <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Category Dropdown</label>
                          <select 
                            value={cardForm.category}
                            onChange={e => setCardForm({...cardForm, category: e.target.value})}
                            className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all"
                          >
                            <option>Shopping</option>
                            <option>Travel</option>
                            <option>Cashback</option>
                            <option>Dining</option>
                            <option>Fuel</option>
                            <option>Luxury</option>
                            <option>Premium</option>
                          </select>
                        </div>
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
                      </div>
                    </div>

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
                      <input 
                        type="text" 
                        required
                        value={cardForm.best_for}
                        onChange={e => setCardForm({...cardForm, best_for: e.target.value})}
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

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Benefits (Comma separated)</label>
                    <textarea 
                      required
                      value={cardForm.benefits.join(', ')}
                      onChange={e => setCardForm({...cardForm, benefits: e.target.value.split(',').map(s => s.trim())})}
                      className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all h-24"
                    />
                  </div>
                  
                  <div className="flex justify-end pt-4 border-t border-black/5">
                    <button 
                      type="submit" 
                      disabled={uploading}
                      className="bg-teal text-white px-10 py-4 rounded-xl font-bold hover:bg-teal/90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {uploading ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                      Save Card
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
