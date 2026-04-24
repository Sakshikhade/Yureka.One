import React from 'react';
import { ArrowUpRight, ArrowRight, Clock, Calendar, Landmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import ImageWithLoader from './ImageWithLoader';
import { Blog } from '../types';
import { useSupabase } from './SupabaseProvider';
import { SkeletonBlog } from './SkeletonLoaders';

import { motion } from 'motion/react';

const JournalPage: React.FC = () => {
    const { blogs: blogsList, isLoading } = useSupabase();

    if (isLoading && blogsList.length === 0) {
        return (
            <div className="min-h-screen bg-[#242424] pt-32 px-6">
                <div className="max-w-[1400px] mx-auto space-y-12">
                   <div className="h-10 w-64 bg-white/5 rounded animate-pulse" />
                   <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="space-y-4">
                                <div className="aspect-square bg-white/5 rounded-2xl animate-pulse" />
                                <div className="h-6 w-full bg-white/5 animate-pulse" />
                                <div className="h-4 w-2/3 bg-white/5 animate-pulse" />
                            </div>
                        ))}
                   </div>
                </div>
            </div>
        );
    }

    // Grouping logic for editorial sections
    const historySection = blogsList.filter(b => b.category === 'History' || b.category === 'Strategy').slice(0, 4);
    const techSection = blogsList.filter(b => b.category === 'AI' || b.category === 'Tech').slice(0, 3);
    const regularArticles = blogsList.filter(b => !historySection.includes(b) && !techSection.includes(b));
    
    // Unique authors for the "Columnists" style section
    const uniqueAuthors = Array.from(new Set(blogsList.map(b => b.author || 'Yureka Research'))).slice(0, 2);

    return (
        <div className="min-h-screen bg-[#242424] pb-32 overflow-x-hidden text-cream selection:bg-clay selection:text-white">
            
            <div className="max-w-[1400px] mx-auto px-6 pt-24 md:pt-40">
                
                {/* ─── SECTION: YUREKA ARCHIVES (TOP) ─── */}
                <section className="mb-24">
                    <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-12">
                        <div className="space-y-1">
                            <h2 className="text-[15px] font-heading font-extrabold uppercase tracking-[0.2em] text-white">Silicon Valley History</h2>
                            <p className="text-[14px] text-white/50 font-serif font-medium">Deep dives into the architectures and minds that built the foundations.</p>
                        </div>
                        <ArrowRight size={20} className="text-white/20" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                        {historySection.length > 0 ? historySection.map((post, idx) => (
                            <motion.div 
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group cursor-pointer"
                            >
                                <Link to={`/blogs/${post.slug}`}>
                                    <div className="space-y-6">
                                        <div className="relative aspect-square overflow-hidden rounded-xl">
                                            <ImageWithLoader src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                                        </div>
                                        <div className="space-y-4">
                                            <h3 className="text-[22px] font-serif leading-[1.2] text-white group-hover:text-clay transition-colors">
                                                {/* Visual trick: stylize the first character of certain words */}
                                                {post.title.split(' ').map((word, i) => (
                                                    <span key={i}>
                                                        {i % 3 === 0 ? (
                                                            <><span className="italic serif font-light text-2xl lowercase pr-0.5">{word[0]}</span>{word.slice(1)}</>
                                                        ) : word}{' '}
                                                    </span>
                                                ))}
                                            </h3>
                                            <p className="text-base text-white/70 leading-relaxed line-clamp-2 font-serif font-medium">
                                                {post.excerpt}
                                            </p>
                                            <div className="flex items-center gap-3 pt-2">
                                                <div className="w-6 h-6 rounded-full bg-clay/20 border border-clay/30 flex items-center justify-center text-[10px] font-bold text-clay">
                                                    {post.author ? post.author[0] : 'Y'}
                                                </div>
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{post.author || 'Yureka Editor'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        )) : (
                            <div className="col-span-full py-20 text-center border border-white/5 rounded-3xl bg-white/2 cursor-wait">
                                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/20 italic">Curating History Dispatches...</span>
                            </div>
                        )}
                    </div>
                </section>

                {/* ─── SECTION: FROM OUR COLUMNISTS ─── */}
                <section className="mb-24 pt-12 border-t border-white/10">
                    <div className="flex items-center justify-between pb-12">
                        <h2 className="text-[15px] font-heading font-extrabold uppercase tracking-[0.2em] text-white">From Our Columnists</h2>
                        <ArrowRight size={20} className="text-white/20" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-stretch">
                        {/* Columnist Bio Card (Iterate unique authors) */}
                        {uniqueAuthors.map((author, aIdx) => (
                            <React.Fragment key={author}>
                                <div className="lg:col-span-1 bg-white/2 border border-white/5 p-8 rounded-2xl flex flex-col justify-between">
                                    <div className="space-y-6">
                                        <div className="aspect-square w-32 rounded-2xl overflow-hidden bg-cream/10 grayscale">
                                             <img src={`https://i.pravatar.cc/300?u=${author}`} alt={author} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="space-y-3">
                                            <h4 className="text-xl font-heading font-extrabold uppercase text-white">{author}</h4>
                                            <p className="text-sm text-white/60 leading-relaxed font-serif font-medium">
                                                Leading writer at Yureka. Exploring the architecture of credit and the neural pathways of rewards in his weekly Journal.
                                            </p>
                                        </div>
                                    </div>
                                    <Link to="/blogs" className="mt-8 border border-white/10 py-3 rounded-lg text-center text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-colors">
                                        Read more from {author.split(' ')[0]} →
                                    </Link>
                                </div>

                                {/* Author's Recent Posts */}
                                {blogsList.filter(b => b.author === author).slice(0, 2).map((post, pIdx) => (
                                    <div key={post.id} className="lg:col-span-1 group cursor-pointer">
                                         <Link to={`/blogs/${post.slug}`}>
                                            <div className="space-y-6">
                                                <div className="relative aspect-square overflow-hidden rounded-xl">
                                                    <ImageWithLoader src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                                                </div>
                                                <div className="space-y-3">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#047857]">{new Date(post.created_at || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                    <h3 className="text-2xl font-serif font-semibold leading-[1.2] text-white group-hover:text-clay transition-colors">
                                                         {post.title}
                                                     </h3>
                                                     <p className="text-base text-white/60 leading-relaxed line-clamp-3 font-serif font-medium italic">
                                                         {post.excerpt}
                                                     </p>
                                                    <div className="flex items-center gap-2 pt-2 grayscale opacity-40">
                                                        <div className="w-5 h-5 rounded-full bg-white/10" />
                                                        <span className="text-[10px] font-bold uppercase tracking-widest">{author}</span>
                                                    </div>
                                                </div>
                                            </div>
                                         </Link>
                                    </div>
                                ))}
                                {aIdx === 0 && <div className="hidden lg:block lg:col-span-1" />} {/* Spacer for layout balance */}
                            </React.Fragment>
                        ))}
                    </div>
                </section>

                {/* ─── SECTION: THE ARCHIVE (GENERAL) ─── */}
                <section className="mt-32 pt-16 border-t border-white/5">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-24">
                        {regularArticles.map((post, idx) => (
                            <motion.div 
                                key={post.id}
                                initial={{ opacity: 0, scale: 0.98 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.05 }}
                                className="group cursor-pointer"
                            >
                                <Link to={`/blogs/${post.slug}`}>
                                    <div className="space-y-6">
                                        <div className="relative aspect-square overflow-hidden rounded-xl border border-white/5">
                                            <ImageWithLoader src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <span className="text-[9px] font-bold uppercase tracking-widest text-clay">{post.category}</span>
                                                <div className="w-1 h-1 bg-white/10 rounded-full" />
                                                <span className="text-[9px] font-bold uppercase tracking-widest text-white/20">{post.read_time || '5m'} Read</span>
                                            </div>
                                            <h3 className="text-xl font-serif font-semibold leading-[1.3] text-white/90 group-hover:text-white transition-colors">
                                                {post.title}
                                            </h3>
                                            <div className="flex items-center gap-3 pt-2">
                                                <img src={`https://i.pravatar.cc/100?u=${post.author}`} className="w-6 h-6 rounded-full grayscale border border-white/10" alt="" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">{post.author || 'Yureka'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* ─── NEWSLETTER (MAGAZINE STYLE) ─── */}
                <motion.section 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-64 border-t-2 border-white py-32 text-center"
                >
                    <div className="max-w-3xl mx-auto space-y-12">
                        <Landmark className="mx-auto text-clay" size={48} />
                        <h2 className="text-4xl md:text-7xl font-heading font-extrabold text-white uppercase tracking-tighter leading-none italic">
                            The <span className="text-clay serif font-light lowercase">Intelligence</span> <br/> Sunday Dispatch.
                        </h2>
                        <p className="text-xl md:text-2xl text-white/50 font-serif italic max-w-xl mx-auto leading-relaxed font-medium">
                            Deep analysis of credit markets and reward loops, delivered to your encrypted inbox every Sunday.
                        </p>
                        <form className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto" onSubmit={(e) => e.preventDefault()}>
                            <input 
                                type="email" 
                                placeholder="EDITORIAL EMAIL" 
                                className="flex-1 bg-transparent border-b border-white/20 px-4 py-6 text-xl text-white font-serif focus:outline-none focus:border-clay transition-colors italic"
                            />
                            <button className="bg-white text-[#242424] px-12 py-6 rounded-xl text-xs font-bold uppercase tracking-[0.3em] hover:bg-clay hover:text-white transition-all active:scale-95">
                                Subscribe →
                            </button>
                        </form>
                    </div>
                </motion.section>
            </div>
        </div>
    );
};

export default JournalPage;
