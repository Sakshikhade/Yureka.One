import React from 'react';
import { ArrowUpRight, ArrowRight, Clock, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import ImageWithLoader from './ImageWithLoader';
import { Blog } from '../types';
import { useSupabase } from './SupabaseProvider';
import { SkeletonBlog } from './SkeletonLoaders';

import { motion } from 'motion/react';

const JournalPage: React.FC = () => {
    const { blogs: blogsList, isLoading } = useSupabase();

    const currentBlogs = blogsList;
    const featured = currentBlogs.find(b => b.featured) || currentBlogs[0];
    const regular = currentBlogs.filter(b => b.id !== featured?.id);

    if (isLoading && blogsList.length === 0) {
        return (
            <div className="min-h-screen bg-[#F2EFE9] pt-32 px-6">
                <div className="max-w-[1440px] mx-auto space-y-12">
                   <div className="h-[60vh] bg-[#242424]/5 rounded-[3rem] animate-pulse" />
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="h-64 bg-[#242424]/5 rounded-3xl animate-pulse" />
                        <div className="h-64 bg-[#242424]/5 rounded-3xl animate-pulse" />
                        <div className="h-64 bg-[#242424]/5 rounded-3xl animate-pulse" />
                   </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F2EFE9] pb-32 overflow-x-hidden font-sans">
            
            {/* ─── EDITORIAL HEADER ─── */}
            <div className="relative pt-20 pb-32 md:pt-32 md:pb-48 bg-cream overflow-hidden border-b border-ink/5">
                {/* Interlocking Pattern Background */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                    style={{ 
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30c0-16.569-13.431-30-30-30v60c16.569 0 30-13.431 30-30zm0 0c0 16.569 13.431 30 30 30V0c-16.569 0-30 13.431-30 30z' fill='%23000' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                        backgroundSize: '60px 60px' 
                    }} 
                />

                <div className="max-w-[1440px] mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                         <div className="flex items-center justify-center gap-4 mb-10">
                            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#242424]/30 px-6 py-2 border border-ink/10 rounded-full">
                                Volume 01. Issue 04
                            </span>
                        </div>
                        <h1 className="text-6xl md:text-9xl font-heading font-black text-[#242424] tracking-tighter mb-8 leading-[0.85] uppercase">
                            The <br className="md:hidden" /> <span className="text-[#047857] italic serif font-light lowercase">Intelligence</span> <br className="hidden md:block" /> Ledger
                        </h1>
                        <p className="text-[#242424]/60 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed mb-16 italic serif">
                            A curated sequence of briefings on financial strategy, reward architecture, <br className="hidden md:block" /> and the shifting landscape of premium instruments.
                        </p>

                        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-12">
                             {['Strategy', 'Architecture', 'Market Insights', 'Deep Tech'].map((cat) => (
                                <button key={cat} className="group relative py-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#242424] hover:text-[#047857] transition-colors">
                                    {cat}
                                    <span className="absolute bottom-0 left-0 w-0 h-px bg-[#047857] transition-all group-hover:w-full"></span>
                                </button>
                             ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-6 -mt-20 relative z-20">
                
                {/* ─── FEATURED DISPATCH ─── */}
                {featured && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="group relative bg-[#242424] rounded-[3.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(30,26,75,0.4)]"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
                            {/* Graphic Side */}
                            <div className="relative overflow-hidden group-hover:scale-[1.01] transition-transform duration-1000">
                                <ImageWithLoader 
                                    src={featured.image} 
                                    alt={featured.title} 
                                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                                />
                                <div className="absolute inset-0 bg-[#242424]/20 mix-blend-multiply" />
                                <div className="absolute top-12 left-12">
                                    <div className="bg-cream/10 backdrop-blur-md border border-cream/20 px-6 py-3 rounded-2xl">
                                        <span className="text-cream text-[10px] font-bold uppercase tracking-widest">Master File No. 8821</span>
                                    </div>
                                </div>
                            </div>

                            {/* Content Side */}
                            <div className="p-12 md:p-24 flex flex-col justify-center text-cream relative">
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-1.5 h-1.5 bg-[#047857] rounded-full animate-pulse" />
                                        <span className="text-[#047857] text-[10px] font-bold uppercase tracking-[0.3em]">{featured.category}</span>
                                        <span className="text-cream/20 text-[10px] font-bold uppercase tracking-widest">{new Date(featured.created_at || '').toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
                                    </div>

                                    <h2 className="text-4xl md:text-6xl font-heading font-black leading-[0.9] tracking-tighter uppercase group-hover:text-[#047857] transition-colors duration-500">
                                        {featured.title}
                                    </h2>

                                    <p className="text-xl md:text-2xl text-cream/60 font-serif leading-relaxed italic max-w-lg">
                                        "{featured.excerpt}"
                                    </p>

                                    <div className="pt-12 flex flex-col md:flex-row items-center gap-8">
                                        <Link to={`/blogs/${featured.slug}`} className="w-full md:w-auto">
                                            <button className="bg-cream text-[#242424] px-12 py-6 rounded-full text-xs font-bold uppercase tracking-[0.3em] shadow-2xl hover:bg-[#047857] hover:text-cream transition-all transform active:scale-95 cursor-pointer">
                                                Examine Dispatch
                                            </button>
                                        </Link>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full border border-cream/10 flex items-center justify-center font-heading font-black text-[#047857]">
                                                {featured.author ? featured.author[0] : 'Y'}
                                            </div>
                                            <div className="text-[10px] font-bold uppercase tracking-widest text-cream/40">Editorial by <br/> <span className="text-cream">{featured.author || 'Yureka Research'}</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ─── ARCHIVE GRID ─── */}
                <div className="mt-32 space-y-16">
                    <div className="flex items-end justify-between border-b border-ink/5 pb-12">
                        <div className="space-y-4">
                            <h3 className="text-4xl md:text-6xl font-heading font-black text-[#242424] tracking-tight uppercase leading-none">The <span className="text-[#047857] italic serif font-light lowercase">Archives</span></h3>
                            <p className="text-[#242424]/40 text-[10px] font-bold uppercase tracking-[0.5em]">Sequence of documented intelligence dispatches</p>
                        </div>
                        <div className="hidden md:flex gap-4">
                            <Landmark className="text-[#242424]/10" size={48} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-24 gap-x-12">
                        {regular.map((post, idx) => (
                            <motion.div 
                                key={post.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group cursor-pointer"
                            >
                                <Link to={`/blogs/${post.slug}`}>
                                    <div className="space-y-8">
                                        <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                                            <ImageWithLoader src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                                            <div className="absolute inset-0 bg-[#242424]/10 group-hover:bg-transparent transition-colors duration-700" />
                                            <div className="absolute top-6 right-6">
                                                <div className="w-12 h-12 bg-cream rounded-2xl flex items-center justify-center text-[#242424] shadow-xl group-hover:bg-[#047857] group-hover:text-cream transition-all transform group-hover:rotate-45">
                                                    <ArrowUpRight size={24} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4 px-2">
                                            <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-[0.3em] text-[#242424]/30">
                                                <span>{post.category}</span>
                                                <span className="w-1 h-1 bg-[#047857] rounded-full" />
                                                <span>{post.read_time || '4 min'} Read</span>
                                            </div>
                                            <h4 className="text-3xl font-heading font-black text-[#242424] leading-[0.9] tracking-tighter uppercase group-hover:text-[#047857] transition-colors duration-500">
                                                {post.title}
                                            </h4>
                                            <p className="text-sm text-[#242424]/60 font-sans leading-relaxed line-clamp-2">
                                                {post.excerpt}
                                            </p>
                                            <div className="pt-4 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-[#242424]/20">
                                                <span>Pub. REF / {new Date(post.created_at || '').toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit' })}</span>
                                                <span className="group-hover:text-[#047857] transition-colors uppercase">Read Examination →</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* ─── NEWSLETTER LEDGER ─── */}
                <motion.section 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-64 relative bg-cream border border-ink/10 rounded-[4rem] p-12 md:p-32 overflow-hidden text-center"
                >
                    <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none" 
                        style={{ 
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18l1.5-1.5 1.122 1.122L21.122 19H25v2h-3.878l1.5 1.5-1.122 1.122L20 22.122V24.5l-1.5 1.5-1.122-1.122L18.878 23H15v-2h3.878l-1.5-1.5 1.122-1.122L20 19.878V17.5l1.5-1.5 1.122 1.122L21.122 19z' fill='%23000' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                            backgroundSize: '40px 40px' 
                        }} 
                    />

                    <div className="relative z-10 max-w-4xl mx-auto space-y-12">
                        <div className="inline-block px-10 py-2 bg-[#242424] text-cream text-[10px] font-bold uppercase tracking-[0.5em] rounded-full">
                            Access Digital Dispatch
                        </div>
                        <h2 className="text-5xl md:text-8xl font-heading font-black text-[#242424] tracking-tighter leading-[0.85] uppercase">
                            Secure the <span className="text-[#047857] italic serif font-light lowercase">premium</span> <br/> Weekly Dispatch
                        </h2>
                        <p className="text-xl md:text-2xl text-[#242424]/60 font-serif italic max-w-2xl mx-auto leading-relaxed">
                            A highly confidential summary of policy changes, reward arbitrage, and high-yield financial maneuvers.
                        </p>

                        <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto pt-8">
                             <input 
                                type="email" 
                                placeholder="Enter editorial email." 
                                className="flex-1 px-10 py-6 bg-cream border border-ink/10 rounded-full focus:outline-none focus:border-clay text-lg placeholder-ink/20 font-serif"
                             />
                             <button className="bg-[#242424] text-cream px-12 py-6 rounded-full text-xs font-bold uppercase tracking-[0.4em] shadow-2xl hover:bg-[#047857] transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-3">
                                Subscribe <ArrowRight size={16} className="text-[#047857]" />
                             </button>
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#242424]/30 italic">
                            No spam. Only high-performance intelligence.
                        </p>
                    </div>
                </motion.section>
            </div>
        </div>
    );
};

export default JournalPage;
