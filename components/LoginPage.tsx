import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Loader2, Globe, ShieldCheck, Zap } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useSupabase } from './SupabaseProvider';

const LoginPage: React.FC = () => {
    const { supabase, user, currentUserStatus } = useSupabase();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user && currentUserStatus !== 'loading') {
            if (currentUserStatus === 'accepted' || currentUserStatus === 'admin') {
                navigate('/dashboard');
            } else if (currentUserStatus === 'pending') {
                navigate('/waiting');
            } else if (currentUserStatus === 'none') {
                setError("Neural record not found. Please join the waitlist to secure your access.");
                setIsLoading(false);
            }
        }
    }, [user, currentUserStatus, navigate]);

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError(null);
        const { error: authError } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + '/dashboard'
            }
        });
        if (authError) {
            console.error(authError);
            setError(authError.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-cream flex items-center justify-center p-6 relative overflow-hidden font-serif">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            <div className="absolute top-1/4 -left-1/4 w-[60%] h-[60%] bg-clay/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-1/4 -right-1/4 w-[60%] h-[60%] bg-clay/5 blur-[120px] rounded-full" />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-12">
                    <div className="w-20 h-20 bg-clay/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
                        <ShieldCheck size={40} className="text-clay" />
                    </div>
                    <h1 className="text-5xl italic tracking-tighter text-white mb-4">Welcome Back</h1>
                    <p className="text-white/40 text-lg">Access your elite credit dashboard and neural insights.</p>
                </div>

                <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl backdrop-blur-xl space-y-8">
                    <AnimatePresence>
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl"
                            >
                                <p className="text-red-400 text-[10px] font-black uppercase tracking-widest text-center">{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button 
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full bg-white text-cream py-6 rounded-2xl flex items-center justify-center gap-4 group hover:bg-clay transition-all shadow-2xl active:scale-95 disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Globe size={20} />}
                        <span className="text-xs font-black uppercase tracking-[0.3em]">Sign In with Google</span>
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                        <div className="relative flex justify-center text-[9px] uppercase tracking-[0.5em] font-bold text-white/10 bg-transparent px-4">Secure Access</div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4 text-white/30 group">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-clay/10 transition-colors">
                                <Zap size={18} className="group-hover:text-clay" />
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-widest">Real-time Neural Sync</div>
                        </div>
                        <div className="flex items-center gap-4 text-white/30 group">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-clay/10 transition-colors">
                                <Sparkles size={18} className="group-hover:text-clay" />
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-widest">Priority Approval Path</div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.3em] mb-4">New to Yureka.Money?</p>
                    <Link 
                        to="/join-waitlist" 
                        className="inline-flex items-center gap-2 text-clay hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.4em]"
                    >
                        Join the Inner Circle <ArrowRight size={14} />
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
