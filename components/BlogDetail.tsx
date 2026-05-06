import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
    ArrowLeft, Share2, Bookmark, Clock, 
    Twitter, Linkedin, Link as LinkIcon,
    ChevronUp, BookOpen, ExternalLink, Loader2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getBlogBySlug, fetchBlogsPublic } from '../services/supabaseService';
import { Blog } from '../types';
import ImageWithLoader from './ImageWithLoader';
import { motion, AnimatePresence } from 'motion/react';
import SEO from './SEO';

const BlogDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [related, setRelated] = useState<Blog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [readingProgress, setReadingProgress] = useState(0);
    const [bookmarked, setBookmarked] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [extractedHtml, setExtractedHtml] = useState<string | null>(null);
    const [isReaderLoading, setIsReaderLoading] = useState(false);
    const articleRef = useRef<HTMLDivElement>(null);

    const blogSchema = blog ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": blog.title,
        "image": [blog.image],
        "datePublished": blog.created_at,
        "author": [{ "@type": "Person", "name": blog.author }]
    } : undefined;

    useEffect(() => {
        if (!slug) return;
        setIsLoading(true);
        setExtractedHtml(null);
        
        const fetchBlog = async () => {
            const data = await getBlogBySlug(slug);
            setBlog(data);
            setIsLoading(false);
            
            if (data) {
                const all = await fetchBlogsPublic();
                setRelated((all || []).filter(b => b.id !== data.id && b.category === data.category).slice(0, 3));
                
                // Try to fetch and extract content for seamless reading
                if (data.external_link) {
                    setIsReaderLoading(true);
                    try {
                        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(data.external_link)}`;
                        const response = await fetch(proxyUrl);
                        const result = await response.json();
                        const html = result.contents;
                        
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html, 'text/html');
                        
                        // Selectors for Blogger and common blog platforms
                        const selectors = [
                            '.post-body', 
                            '[itemprop="articleBody"]', 
                            'article', 
                            '.entry-content', 
                            '.main-content',
                            '.post-content'
                        ];
                        
                        let mainContent = null;
                        for (const selector of selectors) {
                            mainContent = doc.querySelector(selector);
                            if (mainContent) break;
                        }
                        
                        if (mainContent) {
                            // Clean up: Remove known branding/clutter selectors
                            const clutter = [
                                '.post-footer', 
                                '.blog-pager', 
                                '.comments', 
                                '#comments', 
                                '.attribution',
                                '.sharing-buttons',
                                '.share-buttons',
                                '.social-sharing',
                                '.navbar',
                                '#navbar'
                            ];
                            clutter.forEach(s => {
                                mainContent?.querySelectorAll(s).forEach(el => el.remove());
                            });

                            // Fix relative links and images
                            const baseUrl = new URL(data.external_link).origin;
                            mainContent.querySelectorAll('img, a').forEach(el => {
                                if (el.hasAttribute('src')) {
                                    const src = el.getAttribute('src');
                                    if (src && src.startsWith('/')) el.setAttribute('src', baseUrl + src);
                                }
                                if (el.hasAttribute('href')) {
                                    const href = el.getAttribute('href');
                                    if (href && href.startsWith('/')) el.setAttribute('href', baseUrl + href);
                                }
                            });
                            
                            setExtractedHtml(mainContent.innerHTML);
                        }
                    } catch (err) {
                        console.warn("Reader mode extraction failed:", err);
                    } finally {
                        setIsReaderLoading(false);
                    }
                }
            }
        };
        fetchBlog();
        window.scrollTo(0, 0);
    }, [slug]);

    useEffect(() => {
        const handleScroll = () => {
            const el = articleRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const totalHeight = el.offsetHeight;
            const scrolled = Math.max(0, -rect.top);
            const progress = Math.min(100, (scrolled / totalHeight) * 100);
            setReadingProgress(progress);
            setShowScrollTop(window.scrollY > 600);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {}
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <div className="space-y-4 text-center">
                    <div className="w-12 h-12 border-2 border-clay/30 border-t-clay rounded-full animate-spin mx-auto" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">Opening Article</p>
                </div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-clay mb-6">404 Not Found</p>
                <h1 className="text-5xl font-heading font-extrabold text-white mb-4 tracking-tight">Article Not Found</h1>
                <p className="text-white/50 mb-10 max-w-md font-serif italic text-lg">The story you are looking for may have been archived or moved.</p>
                <Link to="/blogs" className="bg-white text-black px-8 py-4 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-clay transition-all">
                    Back to Journal
                </Link>
            </div>
        );
    }

    // Estimate word count for reading time display
    const wordCount = (blog.content || '').split(/\s+/).length;
    const readTime = blog.read_time || `${Math.ceil(wordCount / 200)} min read`;

    return (
        <div className="min-h-screen bg-cream pb-32 font-serif" ref={articleRef}>
            <SEO
                title={`${blog.title} | Yureka Journal`}
                description={blog.excerpt || `Read the latest insights on ${blog.category} from ${blog.author}.`}
                schema={blogSchema}
            />

            {/* ── READING PROGRESS BAR ── */}
            <div
                className="fixed top-0 left-0 h-0.5 bg-gradient-to-r from-cream to-clay z-[100] transition-all duration-75"
                style={{ width: `${readingProgress}%` }}
            />

            {/* ── TOP NAV ── */}
            <div className="sticky top-[104px] md:top-20 z-40 bg-cream/90 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-[780px] mx-auto px-6 h-14 flex items-center justify-between">
                    <Link to="/blogs" className="flex items-center gap-2 text-white/40 hover:text-clay transition-colors group text-[11px] font-bold uppercase tracking-widest font-sans">
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Journal
                    </Link>
                    <div className="flex items-center gap-1">
                        <AnimatePresence>
                            {copied && (
                                <motion.span
                                    initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                                    className="text-[10px] font-bold text-clay uppercase tracking-widest mr-2"
                                >
                                    Copied!
                                </motion.span>
                            )}
                        </AnimatePresence>
                        <button onClick={handleShare} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/5 text-white/40 hover:text-clay transition-all">
                            <Share2 size={16} />
                        </button>
                        <button onClick={() => setBookmarked(!bookmarked)} className={`w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/5 transition-all ${bookmarked ? 'text-clay' : 'text-white/40 hover:text-clay'}`}>
                            <Bookmark size={16} fill={bookmarked ? 'currentColor' : 'none'} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-[780px] mx-auto px-6 pt-12 md:pt-20">

                {/* ── ARTICLE HEADER ── */}
                <header className="mb-12">
                    {/* Meta */}
                    <div className="flex items-center flex-wrap gap-3 mb-8 font-sans">
                        <span className="bg-clay/10 text-clay text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                            {blog.category}
                        </span>
                        <div className="flex items-center gap-1.5 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                            <Clock size={11} />{readTime}
                        </div>
                        <div className="flex items-center gap-1.5 text-white/30 text-[10px] font-bold uppercase tracking-widest">
                            <BookOpen size={11} />{wordCount.toLocaleString()} words
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl sm:text-6xl font-heading font-extrabold leading-[1.05] text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 mb-8 tracking-tight">
                        {blog.title}
                    </h1>

                    {/* Author row */}
                    <div className="flex items-center justify-between flex-wrap gap-6 pt-8 border-t border-white/10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center text-lg font-bold shadow-md shrink-0">
                                {blog.author?.[0] || 'Y'}
                            </div>
                            <div>
                                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/40 font-sans">Written By</p>
                                <p className="text-base font-bold text-white/90 font-sans">{blog.author || 'Yureka Editorial'}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/40 font-sans">Published</p>
                            <p className="text-base font-bold text-white/90 font-sans">
                                {new Date(blog.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </p>
                        </div>
                    </div>
                </header>

                {/* ── HERO IMAGE ── */}
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-14 shadow-2xl">
                    <ImageWithLoader
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                {/* ── ARTICLE BODY ── */}
                <article>
                    {/* Pull quote / excerpt - Only show if not an external link (to avoid redundancy) */}
                    {!blog.external_link && blog.excerpt && (
                        <div className="relative pl-6 border-l-4 border-clay mb-12">
                            <p className="text-xl md:text-2xl italic text-white/70 leading-relaxed font-serif font-medium">
                                {blog.excerpt}
                            </p>
                        </div>
                    )}

                    {/* Main content or External Embed */}
                    {blog.external_link ? (
                        <div className="w-full relative min-h-[60vh]">
                             {/* SEAMLESS READER MODE */}
                             {extractedHtml ? (
                                <div className="prose prose-lg max-w-none
                                    prose-headings:font-heading prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:text-white
                                    prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:pb-4 prose-h2:border-b prose-h2:border-white/10
                                    prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-4
                                    prose-p:text-white/80 prose-p:leading-[1.85] prose-p:text-[17px] prose-p:font-serif
                                    prose-a:text-clay prose-a:no-underline hover:prose-a:underline
                                    prose-blockquote:border-l-4 prose-blockquote:border-clay prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-white/60 prose-blockquote:not-italic
                                    prose-strong:text-white prose-strong:font-bold
                                    prose-img:rounded-xl prose-img:shadow-lg prose-img:border prose-img:border-white/10
                                    prose-ul:space-y-2 prose-li:text-white/75 prose-li:font-serif prose-li:text-[17px]
                                    prose-hr:border-white/10 prose-hr:my-16
                                    animate-in fade-in duration-700
                                ">
                                    <div dangerouslySetInnerHTML={{ __html: extractedHtml }} />
                                    
                                    <div className="mt-16 pt-8 border-t border-white/5 text-center">
                                        <p className="text-white/20 text-[10px] uppercase font-bold tracking-widest mb-4">Original source: {new URL(blog.external_link).hostname}</p>
                                    </div>
                                </div>
                             ) : (
                                <div className="w-full relative bg-white/5 rounded-3xl overflow-hidden border border-white/10 shadow-2xl group mb-16">
                                     {/* Loader while iframe is loading */}
                                     {(isReaderLoading || isLoading) && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                                            <Loader2 className="animate-spin text-clay" size={48} />
                                        </div>
                                     )}
                                     
                                     {/* IFRAME FALLBACK with branding protection and connected scroll */}
                                     <div className="relative w-full overflow-hidden">
                                        <iframe 
                                            src={blog.external_link} 
                                            className="w-full h-[4500px] border-none relative z-10 -mb-[120px]"
                                            title={blog.title}
                                            scrolling="no"
                                            allowFullScreen
                                            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                                        />
                                        
                                        {/* Overlay to catch clicks at the very bottom (branding area) */}
                                        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-cream to-transparent z-20 pointer-events-none" />
                                     </div>
                                </div>
                             )}
                        </div>
                    ) : (
                        <div className="prose prose-lg max-w-none
                            prose-headings:font-heading prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:text-white
                            prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:pb-4 prose-h2:border-b prose-h2:border-white/10
                            prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-4
                            prose-p:text-white/80 prose-p:leading-[1.85] prose-p:text-[17px] prose-p:font-serif
                            prose-a:text-clay prose-a:no-underline hover:prose-a:underline
                            prose-blockquote:border-l-4 prose-blockquote:border-clay prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-white/60 prose-blockquote:not-italic
                            prose-strong:text-white prose-strong:font-bold
                            prose-code:bg-clay/10 prose-code:text-clay prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
                            prose-img:rounded-xl prose-img:shadow-lg prose-img:border prose-img:border-white/10
                            prose-ul:space-y-2 prose-li:text-white/75 prose-li:font-serif prose-li:text-[17px]
                            prose-hr:border-white/10 prose-hr:my-16
                        ">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{blog.content}</ReactMarkdown>
                        </div>
                    )}
                </article>


                {/* ── AUTHOR CARD ── */}
                <div className="mt-12 p-8 md:p-10 rounded-2xl bg-white/5 border border-white/10 flex gap-6 items-start">
                    <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center text-2xl font-bold shrink-0 shadow-md">
                        {blog.author?.[0] || 'Y'}
                    </div>
                    <div className="space-y-3">
                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/40 font-sans">About the Author</p>
                            <p className="text-xl font-bold text-white font-sans mt-1">{blog.author || 'Yureka Editorial'}</p>
                        </div>
                        <p className="text-white/60 leading-relaxed font-serif italic text-[15px]">
                            Senior analyst at Yureka, specializing in Indian credit ecosystems, reward optimization, and fintech strategy. Published weekly in The Yureka Journal.
                        </p>
                        <Link to="/blogs" className="inline-flex items-center gap-2 text-clay text-[11px] font-bold uppercase tracking-widest font-sans hover:gap-3 transition-all">
                            More articles <ArrowLeft size={12} className="rotate-180" />
                        </Link>
                    </div>
                </div>

                {/* ── RELATED ARTICLES ── */}
                {related.length > 0 && (
                    <div className="mt-20">
                        <div className="flex items-center gap-4 mb-10">
                            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 font-sans shrink-0">Related Articles</p>
                            <div className="flex-1 h-px bg-white/10" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {related.map(post => (
                                <Link key={post.id} to={`/blogs/${post.slug}`} className="group block">
                                    <div className="aspect-[4/3] rounded-xl overflow-hidden mb-4 border border-white/5">
                                        <ImageWithLoader src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-clay font-sans">{post.category}</span>
                                    <h4 className="text-base font-bold text-white/90 leading-[1.3] mt-1 group-hover:text-clay transition-colors font-sans line-clamp-2">{post.title}</h4>
                                    <p className="text-white/40 text-sm font-serif italic mt-2 line-clamp-2">{post.excerpt}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── CTA ── */}
                <div className="mt-24 rounded-2xl bg-gradient-to-br from-[#123b2c] to-[#0a1f17] border border-clay/20 p-10 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-clay/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <p className="text-clay text-[10px] font-bold uppercase tracking-[0.4em] font-sans mb-4">Never miss a dispatch</p>
                    <h3 className="text-3xl md:text-4xl font-heading font-extrabold text-white tracking-tight mb-3 relative z-10">
                        The future of credit is <span className="italic font-serif font-light text-clay">conversational.</span>
                    </h3>
                    <p className="text-white/60 font-serif italic mb-8 relative z-10">Join 50,000+ others on the AI-driven financial optimization platform.</p>
                    <Link to="/join-waitlist" className="inline-block bg-clay text-black px-10 py-4 rounded-full font-bold uppercase tracking-widest text-[11px] font-sans hover:bg-white transition-all shadow-lg shadow-clay/20 relative z-10">
                        Join VIP Waitlist →
                    </Link>
                </div>
            </div>

            {/* ── SCROLL TO TOP ── */}
            <AnimatePresence>
                {showScrollTop && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="fixed bottom-8 right-8 w-12 h-12 bg-white text-black rounded-full shadow-2xl flex items-center justify-center hover:bg-clay transition-all z-50 border border-black/10"
                    >
                        <ChevronUp size={20} />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BlogDetail;
