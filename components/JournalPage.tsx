import React, { useState } from 'react';
import { ArrowRight, Clock, Search, X, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import ImageWithLoader from './ImageWithLoader';
import { Blog } from '../types';
import { useSupabase } from './SupabaseProvider';
import { motion, AnimatePresence } from 'motion/react';
import SEO from './SEO';

const CATEGORIES = ['All', 'Credit Cards', 'Rewards', 'Travel', 'AI', 'Strategy', 'History', 'Finance'];

const JournalPage: React.FC = () => {
    const { blogs: blogsList, isLoading } = useSupabase();
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchOpen, setSearchOpen] = useState(false);

    const filtered = blogsList.filter(b => {
        const matchCat = activeCategory === 'All' || b.category === activeCategory;
        const matchSearch = !searchQuery || b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCat && matchSearch;
    });

    const hero = filtered[0];
    const featured = filtered.slice(1, 4);
    const rest = filtered.slice(4);

    if (isLoading && blogsList.length === 0) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] pt-32 px-6">
                <div className="max-w-[1400px] mx-auto space-y-12">
                    <div className="h-10 w-64 bg-white/5 rounded-2xl animate-pulse" />
                    <div className="h-[60vh] bg-white/5 rounded-3xl animate-pulse" />
                    <div className="grid grid-cols-3 gap-6">
                        {[1,2,3].map(i => <div key={i} className="h-64 bg-white/5 rounded-2xl animate-pulse" />)}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f0f0f] pb-32 overflow-x-hidden text-cream selection:bg-[#047857] selection:text-white">
            <SEO title="The Yureka Journal | Credit Intelligence" description="Deep dives into credit cards, rewards optimization, and financial strategy from the Yureka editorial team." />

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-24 md:pt-40">

                {/* ── MASTHEAD ── */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 pb-10 border-b border-white/10 mb-12">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#047857] mb-3">Yureka Editorial</p>
                        <h1 className="text-5xl sm:text-7xl md:text-8xl font-heading font-extrabold text-white leading-[0.9] tracking-tighter">
                            The<br /><span className="text-[#047857] italic font-serif font-light">Journal.</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Search */}
                        <AnimatePresence>
                            {searchOpen ? (
                                <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 280, opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="relative overflow-hidden">
                                    <input
                                        autoFocus
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        placeholder="Search articles..."
                                        className="w-full bg-white/5 border border-white/10 rounded-full px-5 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#047857] transition-colors"
                                    />
                                    <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
                                        <X size={16} />
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setSearchOpen(true)} className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
                                    <Search size={16} />
                                </motion.button>
                            )}
                        </AnimatePresence>
                        <div className="text-right">
                            <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">{blogsList.length} Articles</p>
                            <p className="text-[10px] uppercase tracking-widest text-white/20 font-bold">Published</p>
                        </div>
                    </div>
                </div>

                {/* ── CATEGORY PILLS ── */}
                <div className="flex gap-2 flex-wrap mb-16">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${
                                activeCategory === cat
                                    ? 'bg-[#047857] text-white shadow-lg shadow-[#047857]/20'
                                    : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* ── HERO ARTICLE ── */}
                {hero && (
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
                        <Link to={`/blogs/${hero.slug}`} className="group block relative rounded-3xl overflow-hidden aspect-[16/7] shadow-2xl">
                            <ImageWithLoader src={hero.image} alt={hero.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                            <div className="absolute bottom-0 left-0 p-8 md:p-14 max-w-4xl">
                                <div className="flex items-center gap-3 mb-5">
                                    <span className="bg-[#047857] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">{hero.category}</span>
                                    <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5"><Clock size={10} />{hero.read_time || '5 min read'}</span>
                                </div>
                                <h2 className="text-3xl sm:text-5xl md:text-6xl font-heading font-extrabold text-white leading-[1.05] tracking-tight mb-5 group-hover:text-[#a7f3d0] transition-colors">
                                    {hero.title}
                                </h2>
                                <p className="text-white/60 text-base md:text-lg font-serif leading-relaxed line-clamp-2 max-w-2xl italic">{hero.excerpt}</p>
                                <div className="flex items-center gap-3 mt-6">
                                    <div className="w-8 h-8 rounded-full bg-[#047857] flex items-center justify-center text-white text-sm font-bold shrink-0">{hero.author?.[0] || 'Y'}</div>
                                    <span className="text-white/50 text-[11px] font-bold uppercase tracking-widest">{hero.author || 'Yureka Editorial'}</span>
                                    <span className="text-white/20">·</span>
                                    <span className="text-white/30 text-[11px] font-bold uppercase tracking-widest">{new Date(hero.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                            </div>
                            <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-[#047857] transition-all">
                                <ArrowRight size={18} className="text-white group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </Link>
                    </motion.div>
                )}

                {/* ── FEATURED 3 ── */}
                {featured.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                        {featured.map((post, i) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Link to={`/blogs/${post.slug}`} className="group block">
                                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-5">
                                        <ImageWithLoader src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/10">
                                            {post.category}
                                        </span>
                                    </div>
                                    <div className="space-y-3 px-1">
                                        <h3 className="text-lg font-heading font-bold text-white leading-[1.3] group-hover:text-[#047857] transition-colors line-clamp-2">{post.title}</h3>
                                        <p className="text-white/40 text-sm font-serif italic line-clamp-2 leading-relaxed">{post.excerpt}</p>
                                        <div className="flex items-center gap-2 pt-1">
                                            <img src={`https://i.pravatar.cc/40?u=${post.author}`} className="w-5 h-5 rounded-full grayscale" alt="" />
                                            <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest">{post.author || 'Yureka'}</span>
                                            <span className="text-white/10">·</span>
                                            <span className="text-white/20 text-[10px] flex items-center gap-1"><Clock size={9} />{post.read_time || '5m'}</span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* ── DIVIDER WITH TRENDING TAG ── */}
                {rest.length > 0 && (
                    <div className="flex items-center gap-4 mb-12 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-2 text-[#047857]">
                            <TrendingUp size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">More Articles</span>
                        </div>
                        <div className="flex-1 h-px bg-white/5" />
                    </div>
                )}

                {/* ── ARTICLE GRID ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                    {rest.map((post, idx) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: (idx % 4) * 0.08 }}
                        >
                            <Link to={`/blogs/${post.slug}`} className="group block">
                                <div className="relative aspect-[3/2] rounded-xl overflow-hidden mb-4">
                                    <ImageWithLoader src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                                    <span className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full">
                                        {post.category}
                                    </span>
                                </div>
                                <div className="space-y-2.5 px-0.5">
                                    <h3 className="text-base font-heading font-bold text-white/90 leading-[1.3] group-hover:text-white transition-colors line-clamp-2">{post.title}</h3>
                                    <p className="text-white/35 text-xs font-serif italic line-clamp-2 leading-relaxed">{post.excerpt}</p>
                                    <div className="flex items-center justify-between pt-1">
                                        <div className="flex items-center gap-2">
                                            <img src={`https://i.pravatar.cc/40?u=${post.author}`} className="w-5 h-5 rounded-full grayscale opacity-60" alt="" />
                                            <span className="text-white/25 text-[9px] font-bold uppercase tracking-widest">{post.author || 'Yureka'}</span>
                                        </div>
                                        <span className="text-white/20 text-[9px] flex items-center gap-1"><Clock size={8} />{post.read_time || '5m'}</span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Empty state */}
                {filtered.length === 0 && (
                    <div className="py-40 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/20 italic">No articles found</p>
                        <button onClick={() => { setActiveCategory('All'); setSearchQuery(''); }} className="mt-6 text-[#047857] text-[11px] font-bold uppercase tracking-widest hover:underline">Clear Filters</button>
                    </div>
                )}

                {/* ── NEWSLETTER ── */}
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-32 rounded-3xl bg-gradient-to-br from-[#047857] to-[#065f46] p-12 md:p-20 text-center overflow-hidden relative"
                >
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                    <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-black/10 rounded-full blur-2xl" />
                    <div className="relative max-w-2xl mx-auto space-y-8">
                        <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.4em]">Weekly Dispatch</p>
                        <h2 className="text-4xl md:text-6xl font-heading font-extrabold text-white leading-tight tracking-tight">
                            Stay Ahead of<br />the Credit Curve
                        </h2>
                        <p className="text-white/70 text-lg font-serif italic leading-relaxed">
                            Deep analysis of credit markets and reward loops, every Sunday.
                        </p>
                        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="your@email.com"
                                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-5 py-4 text-white placeholder:text-white/40 outline-none focus:border-white/60 transition-colors text-sm"
                            />
                            <button className="bg-white text-[#047857] px-8 py-4 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-[#242424] hover:text-white transition-all shrink-0">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </motion.section>
            </div>
        </div>
    );
};

export default JournalPage;
