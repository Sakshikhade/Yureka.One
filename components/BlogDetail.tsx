import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
    ArrowLeft, Share2, Bookmark, Clock, Calendar, 
    User, ChevronRight, Sparkles, MessageSquare,
    Facebook, Twitter, Linkedin
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getBlogBySlug } from '../services/supabaseService';
import { Blog } from '../types';
import ImageWithLoader from './ImageWithLoader';

const BlogDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [readingProgress, setReadingProgress] = useState(0);

    useEffect(() => {
        if (!slug) return;
        const fetchBlog = async () => {
            const data = await getBlogBySlug(slug);
            setBlog(data);
            setIsLoading(false);
        };
        fetchBlog();

        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / totalHeight) * 100;
            setReadingProgress(progress);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [slug]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <div className="text-3xl font-serif italic animate-pulse text-ink/40">Opening Journal...</div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-4xl font-serif italic text-ink mb-4">Article not found</h1>
                <p className="text-ink/60 mb-8 max-w-md">The story you are looking for may have been archived or moved.</p>
                <Link to="/blogs" className="bg-ink text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-[10px]">
                    Return to Journal
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream pb-32 font-serif">
            {/* Reading Progress Bar */}
            <div 
                className="fixed top-[104px] md:top-20 left-0 h-1 bg-clay z-[85] transition-all duration-100" 
                style={{ width: `${readingProgress}%` }}
            />

            {/* Top Navigation */}
            <div className="sticky top-[104px] md:top-20 z-40 bg-white/80 backdrop-blur-md border-b border-ink/5 px-6 py-3 md:py-4">
                <div className="max-w-[1000px] mx-auto flex items-center justify-between">
                    <Link to="/blogs" className="flex items-center gap-2 text-ink/40 hover:text-clay transition-colors group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-bold uppercase tracking-widest font-sans">Back to Journal</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-ink/40 hover:text-clay transition-colors"><Share2 size={18} /></button>
                        <button className="p-2 text-ink/40 hover:text-clay transition-colors"><Bookmark size={18} /></button>
                    </div>
                </div>
            </div>

            <div className="max-w-[1000px] mx-auto px-6 pt-8 md:pt-16">
                {/* Article Header */}
                <header className="mb-16">
                    <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-clay mb-8 font-sans">
                        <span>{blog.category}</span>
                        <div className="w-1.5 h-1.5 bg-ink/10 rounded-full"></div>
                        <span className="text-ink/40">{blog.read_time || '5 min read'}</span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-serif leading-[1.1] text-ink mb-12 tracking-tight">
                        {blog.title}
                    </h1>
                    <div className="flex flex-wrap items-center justify-between gap-8 pt-10 border-t border-ink/5">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-ink text-white rounded-full flex items-center justify-center text-xl italic shadow-xl">
                                {blog.author[0]}
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-ink/40 font-sans">Written By</p>
                                <p className="text-xl italic font-medium text-ink">{blog.author}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-8">
                             <div className="text-right">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-ink/40 font-sans">Published</p>
                                <p className="text-lg italic text-ink">{new Date(blog.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                             </div>
                        </div>
                    </div>
                </header>

                {/* Featured Image */}
                <div className="relative aspect-[21/9] rounded-[3rem] overflow-hidden mb-20 shadow-2xl skew-x-[-1deg] hover:skew-x-0 transition-transform duration-1000">
                    <ImageWithLoader 
                        src={blog.image} 
                        alt={blog.title} 
                        className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-1000"
                    />
                </div>

                {/* Article Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 relative">
                    {/* Social Share Sidebar */}
                    <aside className="hidden lg:block lg:col-span-1 sticky top-48 h-fit space-y-8">
                        <button className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-ink/5 text-ink/30 hover:text-ink transition-colors shadow-sm"><Twitter size={18} /></button>
                        <button className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-ink/5 text-ink/30 hover:text-ink transition-colors shadow-sm"><Facebook size={18} /></button>
                        <button className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-ink/5 text-ink/30 hover:text-ink transition-colors shadow-sm"><Linkedin size={18} /></button>
                    </aside>

                    <article className="lg:col-span-10 space-y-10 prose prose-lg prose-ink max-w-none prose-serif">
                        <div className="text-2xl md:text-3xl italic text-ink/60 border-l-8 border-clay pl-10 mb-16 leading-relaxed">
                            {blog.excerpt}
                        </div>
                        
                        <div className="article-content text-xl leading-[1.8] text-ink/80 markdown-body">
                            <ReactMarkdown>{blog.content}</ReactMarkdown>
                        </div>

                        {/* Article Footer */}
                        <footer className="pt-20 mt-20 border-t border-ink/10">
                            <div className="bg-white p-12 rounded-[3.5rem] border border-ink/5 flex flex-col md:flex-row items-center gap-10 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-clay/5 rounded-full -m-16 group-hover:scale-150 transition-transform"></div>
                                <div className="w-24 h-24 bg-ink text-white rounded-full flex items-center justify-center text-4xl italic shrink-0 shadow-lg">
                                    {blog.author[0]}
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold uppercase tracking-[0.3em] text-ink font-sans">About the Author</h4>
                                    <p className="text-xl italic text-ink/60 max-w-xl">
                                        {blog.author} is a senior financial analyst and a regular contributor to the Yureka Journal, specializing in Indian credit ecosystems.
                                    </p>
                                    <div className="flex gap-4 pt-2">
                                        <button className="text-clay font-bold uppercase tracking-widest text-[9px] font-sans hover:text-ink transition-colors">View Profile</button>
                                        <button className="text-ink/30 font-bold uppercase tracking-widest text-[9px] font-sans hover:text-ink transition-colors">Contact</button>
                                    </div>
                                </div>
                            </div>
                        </footer>
                    </article>
                </div>
                
                {/* Related CTA */}
                <div className="mt-40 text-center space-y-8">
                     <div className="inline-flex items-center gap-3 bg-clay/10 px-6 py-2 rounded-full text-clay font-bold text-[10px] uppercase tracking-widest">
                        <Sparkles size={14} /> Never miss a beat
                     </div>
                     <h3 className="text-4xl md:text-6xl font-serif tracking-tighter leading-tight italic">
                        The future of credit is <span className="text-clay">conversational.</span>
                     </h3>
                     <p className="text-xl text-ink/40 max-w-xl mx-auto font-serif italic">
                        Join 50,000+ others waiting for the AI-driven financial optimization engine.
                     </p>
                     <div className="pt-8">
                        <Link to="/join-waitlist" className="bg-ink text-white px-12 py-6 rounded-full font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-clay transition-all shadow-2xl inline-block">
                             Join VIP Waitlist
                        </Link>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default BlogDetail;
