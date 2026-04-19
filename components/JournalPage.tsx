import React from 'react';
import { ArrowUpRight, ArrowRight, Clock, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import ImageWithLoader from './ImageWithLoader';
import { Blog } from '../types';
import { useSupabase } from './SupabaseProvider';
import { SkeletonBlog } from './SkeletonLoaders';

const JournalPage: React.FC = () => {
    const { blogs: blogsList, isLoading, syncStatus } = useSupabase();

    const currentBlogs = blogsList;
    const featured = currentBlogs.find(b => b.featured) || currentBlogs[0];
    const regular = currentBlogs.filter(b => b.id !== featured?.id);

    if (isLoading && blogsList.length === 0) {
        return (
            <div className="min-h-screen bg-cream pt-32 px-6">
                <div className="max-w-[1440px] mx-auto space-y-12">
                   <div className="h-64 bg-slate-100 rounded-[3rem] animate-pulse" />
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <SkeletonBlog /><SkeletonBlog /><SkeletonBlog />
                   </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream pt-4 md:pt-8 pb-20">
            <div className="max-w-[1440px] mx-auto px-6">
                
                {/* Header - Editorial Style */}
                <div id="journal-header" className="text-center mb-24 opacity-0 animate-fade-in-up scroll-mt-32">

                    <div className="inline-block px-4 py-1 border-2 border-ink mb-8">
                        <p className="text-[10px] font-bold tracking-[0.5em] uppercase text-ink">Yureka Journal • Digital Edition</p>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-heading font-black tracking-tighter leading-none text-ink mb-12 uppercase">
                        The <span className="text-ink/30">Pulse</span>
                    </h1>

                    <div className="flex justify-center items-center gap-8 text-[10px] font-bold uppercase tracking-[0.3em] text-ink/60 border-y border-ink/10 py-6">
                        <span>Strategy</span>
                        <div className="w-1.5 h-1.5 bg-clay rounded-full"></div>
                        <span>Insights</span>
                        <div className="w-1.5 h-1.5 bg-clay rounded-full"></div>
                        <span>Fintech</span>
                    </div>
                </div>

                {/* Main Content Area */}
                {currentBlogs.length === 0 ? (
                  <div className="py-40 text-center border-2 border-dashed border-ink/10 rounded-[3rem]">
                      <h3 className="text-2xl font-heading font-black text-ink/20 uppercase tracking-tighter text-center w-full">Editorial Archive Empty</h3>
                      <p className="text-sm text-ink/40 font-sans mt-4">The next digital dispatch is being prepared for publication.</p>
                  </div>
                ) : (
                  <>
                    {/* Featured Story */}
                    {featured && (
                      <section id="featured-story" className="grid grid-cols-1 lg:grid-cols-12 gap-0 mb-32 border-2 border-ink overflow-hidden opacity-0 animate-fade-in-up delay-100 scroll-mt-32">
                        <div className="lg:col-span-8 relative aspect-[16/9] lg:aspect-auto min-h-[400px] overflow-hidden border-b-2 lg:border-b-0 lg:border-r-2 border-ink">
                            <ImageWithLoader 
                                src={featured.image} 
                                alt={featured.title} 
                                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-[2s] hover:scale-105"
                            />
                            <div className="absolute top-8 left-8 bg-clay text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest shadow-2xl">
                                Featured Story
                            </div>
                        </div>
                        <div className="lg:col-span-4 p-8 md:p-12 flex flex-col justify-center bg-white relative">
                            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-ink/40 mb-8">
                                <span>{featured.category}</span>
                                <div className="w-1 h-1 bg-ink/20 rounded-full"></div>
                                <span>{featured.date || new Date(featured.created_at || '').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-heading font-black leading-[1.1] text-ink mb-8 tracking-tight uppercase">
                                {featured.title}
                            </h2>
                            <p className="text-lg text-ink/60 font-sans font-medium leading-relaxed mb-12 border-l-4 border-clay pl-6">
                                {featured.excerpt}
                            </p>
                            <div className="flex items-center justify-between pt-8 border-t border-ink/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-ink text-white rounded-full flex items-center justify-center font-serif italic text-lg">
                                        {featured.author ? featured.author[0] : 'Y'}
                                    </div>
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-ink">{featured.author || 'Yureka Editor'}</div>
                                </div>
                                <Link to={`/blogs/${featured.slug}`} className="text-clay hover:text-ink transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest cursor-pointer">
                                    Read <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>
                      </section>
                    )}

                    {/* News Grid */}
                    <div id="news-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-l border-t border-ink/10 scroll-mt-32">
                        {regular.map((post, idx) => (
                            <div 
                                key={post.id} 
                                className="p-10 border-r border-b border-ink/10 hover:bg-white transition-colors group opacity-0 animate-fade-in-up"
                                style={{ animationDelay: `${idx * 100 + 200}ms` }}
                            >
                                <div className="flex items-center justify-between text-[8px] font-bold uppercase tracking-widest text-ink/30 mb-8">
                                    <span>{post.category}</span>
                                    <span>{post.date || new Date(post.created_at || '').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                </div>
                                <h3 className="text-2xl font-heading font-bold leading-tight text-ink mb-6 group-hover:text-clay transition-colors line-clamp-3 uppercase">
                                    {post.title}
                                </h3>
                                <p className="text-sm text-ink/60 leading-relaxed font-sans mb-10 line-clamp-3">
                                    {post.excerpt}
                                </p>
                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex items-center gap-2">
                                        <Clock size={12} className="text-ink/20" />
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-ink/40">{post.read_time || '5 min read'}</span>
                                    </div>
                                    <Link to={`/blogs/${post.slug}`}>
                                        <button className="w-10 h-10 border border-ink/10 rounded-full flex items-center justify-center text-ink hover:bg-ink hover:text-white transition-all transform hover:rotate-45 cursor-pointer">
                                            <ArrowUpRight size={14} />
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                  </>
                )}

                {/* Newsletter Section - Newsprint Style */}
                <section id="newsletter" className="mt-40 p-12 md:p-24 bg-ink text-white relative overflow-hidden text-center rounded-[3rem] shadow-2xl scroll-mt-32">

                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <span className="text-clay font-bold text-[10px] uppercase tracking-[0.5em] mb-8 block">Stay Ahead</span>
                         <h2 className="text-4xl md:text-6xl font-heading font-black mb-8 leading-tight tracking-tighter uppercase">Get the <span className="text-white/40 font-light">Premium</span> <br/> Weekly Dispatch.</h2>
                        <p className="text-lg md:text-xl text-white/60 font-sans font-medium mb-12">
                            Deep-dives into credit policy, reward loopholes, and financial strategy. Delivered every Sunday.
                        </p>

                        <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto" onSubmit={(e) => e.preventDefault()}>
                            <input 
                                type="email" 
                                placeholder="Your professional email" 
                                className="flex-1 px-8 py-5 bg-white/5 border border-white/10 rounded-full focus:outline-none focus:border-clay text-lg placeholder-white/20 font-serif text-white backdrop-blur-sm"
                            />
                            <button className="px-10 py-5 bg-clay text-white font-bold uppercase tracking-widest text-xs hover:bg-teal transition-all rounded-full shadow-xl">
                                Dispatch
                            </button>
                        </form>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default JournalPage;
