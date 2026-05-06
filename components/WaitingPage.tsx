import React from 'react';
import { motion } from 'motion/react';
import { 
    Clock, Sparkles, Share2, Twitter, MessageCircle, 
    Instagram, Send, Copy, ArrowLeft, Trophy, Rocket
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSupabase } from './SupabaseProvider';

const WaitingPage: React.FC = () => {
    const { user } = useSupabase();
    // In a real app, we'd fetch the user's rank/code here. 
    // For now, we'll show a beautiful placeholder or fetch if possible.
    
    const shareLink = `https://yureka.money/join-waitlist?ref=YRKMNY-USER`;
    const shareText = "I'm on the Yureka.Money waitlist! Use my link to join the future of credit.";

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareLink);
        alert("Link copied!");
    };

    return (
        <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden">
            {/* Ambient background */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            <div className="absolute top-1/4 -left-1/4 w-[60%] h-[60%] bg-clay/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 -right-1/4 w-[60%] h-[60%] bg-clay/5 blur-[120px] rounded-full pointer-events-none" />

            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl w-full text-center relative z-10"
            >
                <div className="w-24 h-24 bg-clay/10 rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-clay/20 relative">
                    <Clock size={40} className="text-clay animate-pulse" />
                    <div className="absolute -top-2 -right-2">
                        <Sparkles size={24} className="text-clay animate-bounce" />
                    </div>
                </div>

                <h1 className="text-5xl md:text-7xl italic tracking-tighter text-white mb-6 leading-none">Patience is Luxury.</h1>
                <p className="text-xl text-white/40 mb-12 italic">Your application is currently in the review queue. We prioritize high-density contributors.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 text-left hover:border-clay/30 transition-colors group">
                        <Trophy className="text-clay mb-4 group-hover:scale-110 transition-transform" size={32} />
                        <h3 className="text-white text-lg mb-2">Move Up the Rank</h3>
                        <p className="text-white/40 text-xs leading-relaxed">Every successful referral accelerates your approval by approximately 48 hours.</p>
                    </div>
                    <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 text-left hover:border-clay/30 transition-colors group">
                        <Rocket className="text-clay mb-4 group-hover:scale-110 transition-transform" size={32} />
                        <h3 className="text-white text-lg mb-2">Priority Lab Access</h3>
                        <p className="text-white/40 text-xs leading-relaxed">Top 5% of referrers get direct access to the Yureka Intelligence Lab early builds.</p>
                    </div>
                </div>

                <div className="bg-white/[0.03] border border-white/10 rounded-[3rem] p-10 mb-12 relative overflow-hidden">
                    <div className="relative z-10 space-y-6">
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Your Accelerator Link</p>
                        <div className="flex items-center gap-4 bg-black/40 p-2 rounded-2xl border border-white/5">
                            <span className="flex-1 font-mono text-sm font-bold text-clay tracking-wider pl-4 truncate">{shareLink}</span>
                            <button onClick={copyToClipboard} className="w-12 h-12 bg-clay text-cream rounded-xl flex items-center justify-center hover:scale-105 transition-transform shrink-0"><Copy size={18} /></button>
                        </div>
                        
                        <div className="flex justify-center gap-4 pt-4">
                            {[Twitter, MessageCircle, Send].map((Icon, i) => (
                                <button key={i} className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-clay hover:border-clay transition-all">
                                    <Icon size={18} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.5em] text-white/20 hover:text-clay transition-all group">
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Return to Archives
                </Link>
            </motion.div>
        </div>
    );
};

export default WaitingPage;
