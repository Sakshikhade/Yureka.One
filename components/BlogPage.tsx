import React, { useEffect, useRef, useState } from 'react';
import ImageWithLoader from './ImageWithLoader';
import { ArrowUpRight, Calendar, User, ArrowRight } from 'lucide-react';
import { getBlogs } from '../services/supabaseService';
import { Blog } from '../types';

interface FadeInSectionProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

const FadeInSection: React.FC<FadeInSectionProps> = ({ children, delay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setIsVisible(true);
      });
    }, { threshold: 0.1 });
    const current = domRef.current;
    if (current) observer.observe(current);
    return () => {
        if(current) observer.unobserve(current);
    }
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-[cubic-bezier(0.25,0.8,0.25,1)] transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const blogs: Blog[] = [
    {
        id: "1",
        title: "The UPI Cashback Revolution: Why your bank is hiding it",
        excerpt: "UPI is the backbone of India's economy, but are you getting the rewards you deserve? Here is how to stack cashback on every scan.",
        category: "Fintech",
        author: "Riya S.",
        date: "Oct 12, 2026",
        image: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=1600",
        featured: true,
        content: "Full content here..."
    },
    {
        id: "2",
        title: "How AI Finds Your Perfect Card in 60 Seconds",
        excerpt: "Stop scrolling through endless PDF terms. Our AI engine scans 200+ cards to find your match based on your real spending habits.",
        category: "Technology",
        author: "Ankit M.",
        date: "Oct 08, 2026",
        image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800",
        featured: false,
        content: "Full content here..."
    },
    {
        id: "3",
        title: "The Voucher Hub: Stacking Rewards like a Pro",
        excerpt: "Did you know you can get 8% off on top of your card rewards? We built a hub for that. Here is the strategy.",
        category: "Savings",
        author: "Team Jupyter",
        date: "Sep 28, 2026",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
        featured: false,
        content: "Full content here..."
    },
    {
        id: "4",
        title: "Investing in Credit: Why your score is your best asset",
        excerpt: "Data-backed analysis on why a high credit score is more valuable than a high savings balance in 2026.",
        category: "Finance",
        author: "Varun K.",
        date: "Sep 15, 2026",
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=800",
        featured: false,
        content: "Full content here..."
    },
    {
        id: "5",
        title: "NPA Settlement: Clearing the path to financial freedom",
        excerpt: "Debt happens. Here is how our AI-driven negotiation tool helps you settle bad debt and rebuild your credit history.",
        category: "Policy",
        author: "Simran J.",
        date: "Aug 30, 2026",
        image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&q=80&w=800",
        featured: false,
        content: "Full content here..."
    }
];

const BlogPage: React.FC = () => {
    const [blogsList, setBlogsList] = useState<Blog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const formatDate = (blog: Blog) => {
        if (blog.date) return blog.date;
        if (blog.created_at) {
            const date = new Date(blog.created_at);
            return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
        }
        return 'N/A';
    };

    useEffect(() => {
        const unsubscribe = getBlogs((fetchedBlogs) => {
            setBlogsList(fetchedBlogs);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const blogsToDisplay = blogsList.length > 0 ? blogsList : blogs;
    const featuredPost = blogsToDisplay.find(b => b.featured) || blogsToDisplay[0];
    const regularPosts = blogsToDisplay.filter(b => b.id !== featuredPost?.id);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <div className="text-2xl font-serif italic animate-pulse">Loading Journal...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream pt-32 pb-20 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03]" 
                 style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '60px 60px' }}>
            </div>
            
            <div className="max-w-[1440px] mx-auto px-6 relative z-10">
                
                {/* Header - Editorial Style */}
                <section className="text-center mb-20">
                    <FadeInSection>
                        <div className="inline-block px-4 py-1 border border-black/10 rounded-full mb-6 bg-white/50 backdrop-blur-sm">
                            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-teal">Insights • Strategy • News</p>
                        </div>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif tracking-tighter mb-6 text-black leading-none">
                            The <span className="italic font-light text-black/40">Blogs</span>
                        </h1>
                        <div className="w-24 h-1 bg-clay mx-auto mb-8"></div>
                    </FadeInSection>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
                    
                    {/* Featured Post - Main Story */}
                    <div className="lg:col-span-8">
                        {featuredPost && (
                            <FadeInSection>
                                <div className="group cursor-pointer relative">
                                    <div className="relative w-full aspect-[16/9] mb-10 overflow-hidden rounded-2xl shadow-2xl border border-black/5">
                                        <ImageWithLoader 
                                            src={featuredPost.image} 
                                            alt={featuredPost.title} 
                                            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-end p-8">
                                            <span className="text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                                                Read Full Article <ArrowUpRight size={16} />
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="max-w-3xl">
                                        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-teal mb-6">
                                            <span className="bg-teal/10 px-3 py-1 rounded-full">{featuredPost.category}</span>
                                            <span className="text-black/40">{formatDate(featuredPost)}</span>
                                        </div>
                                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-[1.1] mb-6 group-hover:text-clay transition-colors text-black tracking-tight">{featuredPost.title}</h2>
                                        <p className="text-xl text-black/60 font-serif leading-relaxed mb-8 line-clamp-3">{featuredPost.excerpt}</p>
                                        
                                        <div className="flex items-center gap-4 border-t border-black/10 pt-8">
                                            <div className="w-12 h-12 rounded-full bg-clay/10 flex items-center justify-center text-clay font-serif italic text-xl">
                                                {featuredPost.author[0]}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-black/40">Author</span>
                                                <span className="text-lg font-serif italic text-black">{featuredPost.author}</span>
                                            </div>
                                            <div className="ml-auto text-[10px] font-bold uppercase tracking-widest text-black/30 bg-black/5 px-3 py-1 rounded-full">
                                                {featuredPost.readTime || '5 min'} read
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </FadeInSection>
                        )}
                    </div>

                    {/* Sidebar / Recent Posts */}
                    <div className="lg:col-span-4">
                         <div className="sticky top-32">
                            <h3 className="text-2xl font-serif italic border-b-2 border-black pb-4 mb-10 text-black flex items-center justify-between">
                                Latest Updates
                                <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-black/40 not-italic">Recent</span>
                            </h3>
                            
                            <div className="flex flex-col gap-10">
                                {regularPosts.map((post, idx) => (
                                    <FadeInSection key={post.id} delay={idx * 100}>
                                        <div className="group cursor-pointer">
                                            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-teal mb-3">
                                                <span>{post.category}</span>
                                                <span className="w-1 h-1 bg-black/20 rounded-full"></span>
                                                <span className="text-black/40">{formatDate(post)}</span>
                                            </div>
                                            <h3 className="text-2xl font-serif leading-tight mb-4 group-hover:text-clay transition-colors text-black line-clamp-2">{post.title}</h3>
                                            <div className="flex items-center gap-2 text-black font-bold text-[10px] uppercase tracking-widest group-hover:gap-4 transition-all opacity-60 group-hover:opacity-100">
                                                Read Story <ArrowRight size={12} />
                                            </div>
                                        </div>
                                    </FadeInSection>
                                ))}
                            </div>

                            <div className="mt-16 p-8 bg-clay/5 border border-clay/10 rounded-2xl">
                                <h4 className="font-serif text-xl mb-4">The Credit Guide</h4>
                                <p className="text-sm text-black/60 mb-6 leading-relaxed">Download our comprehensive guide on maximizing credit rewards in India.</p>
                                <button className="w-full py-3 bg-clay text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-teal transition-colors">
                                    Download Guide
                                </button>
                            </div>
                         </div>
                    </div>

                </div>

                {/* Newsletter - Modern Minimal Style */}
                <section className="relative rounded-3xl overflow-hidden bg-ink text-white py-20 px-10 md:px-20">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
                    </div>
                    
                    <div className="relative z-10 max-w-4xl mx-auto text-center">
                        <span className="text-clay font-bold text-[10px] uppercase tracking-[0.4em] mb-6 block">Newsletter</span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 tracking-tight">Stay ahead of the <span className="italic text-clay">curve.</span></h2>
                        <p className="text-lg md:text-xl font-serif italic text-white/50 mb-12 max-w-2xl mx-auto">Join 10,000+ subscribers getting weekly insights on credit, rewards, and financial freedom.</p>
                        
                        <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto" onSubmit={(e) => e.preventDefault()}>
                            <input 
                                type="email" 
                                placeholder="Enter your email" 
                                className="flex-1 px-8 py-5 bg-white/5 border border-white/10 rounded-full focus:outline-none focus:border-clay text-lg placeholder-white/20 font-serif text-white backdrop-blur-sm transition-colors"
                            />
                            <button className="px-10 py-5 bg-clay text-white font-bold uppercase tracking-widest text-xs hover:bg-teal transition-all rounded-full shadow-xl hover:shadow-clay/20 transform hover:-translate-y-1">
                                Subscribe Now
                            </button>
                        </form>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default BlogPage;