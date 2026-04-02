import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowRight, Bookmark, Share2, Clock, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import ImageWithLoader from './ImageWithLoader';
import { getBlogs } from '../services/supabaseService';
import { Blog } from '../types';

const JournalPage: React.FC = () => {
    const [blogsList, setBlogsList] = useState<Blog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = getBlogs((fetchedBlogs) => {
            setBlogsList(fetchedBlogs);
            setIsLoading(false);
            setError(null);
        }, (err) => {
            console.error("Blogs Fetch Error:", err);
            setError(err);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Placeholder data if Supabase is empty
    const defaultBlogs: Blog[] = [
        {
            id: 'b1',
            title: "The UPI Cashback Revolution: Why your bank is hiding it",
            excerpt: "UPI is the backbone of India's economy, but are you getting the rewards you deserve? Here is how to stack cashback on every scan.",
            category: "Fintech",
            author: "Riya S.",
            date: "Oct 12, 2026",
            image: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=1600",
            featured: true,
            content: "..."
        },
        {
            id: 'b2',
            title: "How AI Finds Your Perfect Card in 60 Seconds",
            excerpt: "Stop scrolling through endless PDF terms. Our AI engine scans 200+ cards to find your match based on real spending habits.",
            category: "Technology",
            author: "Ankit M.",
            date: "Oct 08, 2026",
            image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800",
            featured: false,
            content: "..."
        }
    ];

    const currentBlogs = blogsList.length > 0 ? blogsList : defaultBlogs;
    const featured = currentBlogs.find(b => b.featured) || currentBlogs[0];
    const regular = currentBlogs.filter(b => b.id !== featured?.id);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 border-4 border-ink/10 border-t-clay rounded-full animate-spin"></div>
                    <div className="text-3xl font-serif italic text-ink/40">Loading Journal...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-2xl border border-ink/5 text-center">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
                        <Calendar className="w-10 h-10 text-red-400" />
                    </div>
                    <h2 className="text-4xl font-serif italic mb-6 tracking-tight">The Pulse is Offline</h2>
                    <p className="text-ink/60 mb-10 leading-relaxed font-serif">
                        Our editorial servers are currently unreachable. This is likely due to a security policy update in our database.
                    </p>
                    <div className="bg-ink/5 p-5 rounded-2xl mb-10 text-left border border-ink/5">
                        <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-ink/30 mb-2">Technical Insight</p>
                        <p className="text-xs font-mono text-ink/60 break-words leading-tight">{error}</p>
                    </div>
                    <button 
                        onClick={() => window.location.reload()}
                        className="w-full bg-ink text-white py-5 rounded-full font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-clay transition-all shadow-lg active:scale-95"
                    >
                        Force Reconnect
                    </button>
                    <p className="mt-8 text-[9px] font-bold uppercase tracking-[0.4em] text-ink/20">Ref: RLS_RECURSION_01</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream pt-32 pb-20">
            <div className="max-w-[1440px] mx-auto px-6">
                
                {/* Header - Editorial Style */}
                <div className="text-center mb-24 opacity-0 animate-fade-in-up">
                    <div className="inline-block px-4 py-1 border-2 border-ink mb-8">
                        <p className="text-[10px] font-bold tracking-[0.5em] uppercase text-ink">Yureka Journal • Digital Edition</p>
                    </div>
                    <h1 className="text-6xl md:text-9xl font-serif tracking-tighter leading-none text-ink mb-12">
                        The <span className="italic font-light text-ink/30 text-8xl md:text-[10rem]">Pulse</span>
                    </h1>
                    <div className="flex justify-center items-center gap-8 text-[10px] font-bold uppercase tracking-[0.3em] text-ink/60 border-y border-ink/10 py-6">
                        <span>Strategy</span>
                        <div className="w-1.5 h-1.5 bg-clay rounded-full"></div>
                        <span>Insights</span>
                        <div className="w-1.5 h-1.5 bg-clay rounded-full"></div>
                        <span>Fintech</span>
                    </div>
                </div>

                {/* Featured Story */}
                {featured && (
                    <section className="grid grid-cols-1 lg:grid-cols-12 gap-0 mb-32 border-2 border-ink overflow-hidden opacity-0 animate-fade-in-up delay-100">
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
                                <span>{featured.date}</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-serif leading-[1.1] text-ink mb-8 tracking-tight italic">
                                {featured.title}
                            </h2>
                            <p className="text-lg text-ink/60 font-serif leading-relaxed mb-12 border-l-4 border-clay pl-6">
                                {featured.excerpt}
                            </p>
                            <div className="flex items-center justify-between pt-8 border-t border-ink/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-ink text-white rounded-full flex items-center justify-center font-serif italic text-lg">
                                        {featured.author[0]}
                                    </div>
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-ink">{featured.author}</div>
                                </div>
                                <Link to={`/blogs/${featured.slug}`} className="text-clay hover:text-ink transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest cursor-pointer">
                                    Read <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>
                    </section>
                )}

                {/* News Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-l border-t border-ink/10">
                    {regular.map((post, idx) => (
                        <div 
                            key={post.id} 
                            className="p-10 border-r border-b border-ink/10 hover:bg-white transition-colors group opacity-0 animate-fade-in-up"
                            style={{ animationDelay: `${idx * 100 + 200}ms` }}
                        >
                            <div className="flex items-center justify-between text-[8px] font-bold uppercase tracking-widest text-ink/30 mb-8">
                                <span>{post.category}</span>
                                <span>{post.date}</span>
                            </div>
                            <h3 className="text-2xl font-serif leading-tight text-ink mb-6 group-hover:text-clay transition-colors line-clamp-3">
                                {post.title}
                            </h3>
                            <p className="text-sm text-ink/60 leading-relaxed font-serif mb-10 line-clamp-3">
                                {post.excerpt}
                            </p>
                            <div className="flex items-center justify-between mt-auto">
                                <div className="flex items-center gap-2">
                                    <Clock size={12} className="text-ink/20" />
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-ink/40">5 min read</span>
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

                {/* Newsletter Section - Newsprint Style */}
                <section className="mt-40 p-12 md:p-24 bg-ink text-white relative overflow-hidden text-center rounded-[3rem] shadow-2xl">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <span className="text-clay font-bold text-[10px] uppercase tracking-[0.5em] mb-8 block">Stay Ahead</span>
                        <h2 className="text-4xl md:text-6xl font-serif mb-8 leading-tight tracking-tighter">Get the <span className="italic font-light text-white/40">Premium</span> <br/> Weekly Dispatch.</h2>
                        <p className="text-lg md:text-xl text-white/60 font-serif italic mb-12">
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
