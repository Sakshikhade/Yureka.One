import React, { useState, useEffect } from 'react';
import { db, auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
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
  ArrowRight
} from 'lucide-react';
import { getBlogs, getCards, checkIfAdmin } from '../services/firebaseService';
import { Blog, Card, WaitlistEntry } from '../types';

const AdminDashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'blogs' | 'cards' | 'waitlist'>('blogs');
  
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{collection: string, id: string} | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  // Blog Form State
  const [blogForm, setBlogForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    category: 'Credit Cards',
    image: 'https://picsum.photos/seed/blog/800/600',
    readTime: '5 min read'
  });

  // Card Form State
  const [cardForm, setCardForm] = useState({
    name: '',
    bank: '',
    type: 'Rewards',
    image: 'https://picsum.photos/seed/card/400/250',
    rating: 4.5,
    benefits: [''],
    annualFee: '₹0',
    joiningFee: '₹0',
    bestFor: 'Shopping',
    color: 'from-blue-600 to-indigo-700'
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const adminStatus = await checkIfAdmin(user.uid);
        setIsAdmin(adminStatus);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;

    // Subscribe to Blogs
    const blogsQuery = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
    const unsubscribeBlogs = onSnapshot(blogsQuery, (snapshot) => {
      setBlogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Blog)));
    });

    // Subscribe to Cards
    const cardsQuery = query(collection(db, 'cards'), orderBy('name', 'asc'));
    const unsubscribeCards = onSnapshot(cardsQuery, (snapshot) => {
      setCards(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Card)));
    });

    // Subscribe to Waitlist
    const waitlistQuery = query(collection(db, 'waitlist'), orderBy('createdAt', 'desc'));
    const unsubscribeWaitlist = onSnapshot(waitlistQuery, (snapshot) => {
      setWaitlist(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WaitlistEntry)));
    });

    return () => {
      unsubscribeBlogs();
      unsubscribeCards();
      unsubscribeWaitlist();
    };
  }, [isAdmin]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateDoc(doc(db, 'blogs', editingItem.id), {
          ...blogForm,
          updatedAt: Timestamp.now()
        });
      } else {
        await addDoc(collection(db, 'blogs'), {
          ...blogForm,
          slug: blogForm.title.toLowerCase().replace(/ /g, '-'),
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
      }
      setIsModalOpen(false);
      setEditingItem(null);
      setBlogForm({ title: '', excerpt: '', content: '', author: '', category: 'Credit Cards', image: 'https://picsum.photos/seed/blog/800/600', readTime: '5 min read' });
    } catch (error) {
      console.error("Error saving blog", error);
    }
  };

  const handleSaveCard = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateDoc(doc(db, 'cards', editingItem.id), {
          ...cardForm,
          updatedAt: Timestamp.now()
        });
      } else {
        await addDoc(collection(db, 'cards'), {
          ...cardForm,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
      }
      setIsModalOpen(false);
      setEditingItem(null);
      setCardForm({ name: '', bank: '', type: 'Rewards', image: 'https://picsum.photos/seed/card/400/250', rating: 4.5, benefits: [''], annualFee: '₹0', joiningFee: '₹0', bestFor: 'Shopping', color: 'from-blue-600 to-indigo-700' });
    } catch (error) {
      console.error("Error saving card", error);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      await deleteDoc(doc(db, itemToDelete.collection, itemToDelete.id));
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Error deleting item", error);
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

  if (!user) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-black/5 text-center">
          <LayoutDashboard className="mx-auto mb-6 text-teal" size={64} />
          <h1 className="text-3xl font-serif font-bold mb-4">Admin Portal</h1>
          <p className="text-black/60 mb-8">Please sign in with your administrator account to continue.</p>
          <button 
            onClick={handleLogin}
            className="w-full bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-clay transition-colors"
          >
            <LogIn size={20} /> Sign in with Google
          </button>
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
            <span className="font-bold text-xl tracking-tight">Jupyter Admin</span>
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
            <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full" />
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate">{user.displayName}</p>
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
          {activeTab !== 'waitlist' && (
            <button 
              onClick={() => {
                setEditingItem(null);
                setIsModalOpen(true);
              }}
              className="bg-black text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-clay transition-colors shadow-lg"
            >
              <Plus size={20} /> Add New {activeTab === 'blogs' ? 'Post' : 'Card'}
            </button>
          )}
        </header>

        {/* Content Area */}
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
                      {blog.createdAt instanceof Timestamp ? blog.createdAt.toDate().toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => {
                          setEditingItem(blog);
                          setBlogForm({
                            title: blog.title,
                            excerpt: blog.excerpt,
                            content: blog.content,
                            author: blog.author,
                            category: blog.category,
                            image: blog.image,
                            readTime: blog.readTime
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
                    <td className="px-6 py-4 text-sm text-black/60">{card.bestFor}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => {
                          setEditingItem(card);
                          setCardForm({
                            name: card.name,
                            bank: card.bank,
                            type: card.type,
                            image: card.image,
                            rating: card.rating,
                            benefits: card.benefits,
                            annualFee: card.annualFee,
                            joiningFee: card.joiningFee,
                            bestFor: card.bestFor,
                            color: card.color
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
                      {entry.createdAt instanceof Timestamp ? entry.createdAt.toDate().toLocaleDateString() : 'N/A'}
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
              <button onClick={() => setIsModalOpen(false)} className="text-black/40 hover:text-black transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              {activeTab === 'blogs' ? (
                <form onSubmit={handleSaveBlog} className="space-y-4">
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
                      className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all h-48"
                    />
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
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <button type="submit" className="bg-teal text-white px-8 py-3 rounded-xl font-bold hover:bg-teal/90 transition-colors shadow-lg">
                      Save Post
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSaveCard} className="space-y-4">
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
                        value={cardForm.bestFor}
                        onChange={e => setCardForm({...cardForm, bestFor: e.target.value})}
                        className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Annual Fee</label>
                      <input 
                        type="text" 
                        required
                        value={cardForm.annualFee}
                        onChange={e => setCardForm({...cardForm, annualFee: e.target.value})}
                        className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Joining Fee</label>
                      <input 
                        type="text" 
                        required
                        value={cardForm.joiningFee}
                        onChange={e => setCardForm({...cardForm, joiningFee: e.target.value})}
                        className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-black/40 mb-2">Benefits (Comma separated)</label>
                    <input 
                      type="text" 
                      required
                      value={cardForm.benefits.join(', ')}
                      onChange={e => setCardForm({...cardForm, benefits: e.target.value.split(',').map(s => s.trim())})}
                      className="w-full bg-black/5 border-none rounded-xl p-4 focus:ring-2 focus:ring-teal outline-none transition-all"
                    />
                  </div>
                  <div className="flex justify-end pt-4">
                    <button type="submit" className="bg-teal text-white px-8 py-3 rounded-xl font-bold hover:bg-teal/90 transition-colors shadow-lg">
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
