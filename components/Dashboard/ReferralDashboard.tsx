import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
    Users, Copy, Share2, Twitter, MessageCircle, 
    Send, Sparkles, Trophy, Star, Shield, Clock
} from 'lucide-react';
import { useSupabase } from '../SupabaseProvider';
import { fetchUserReferrals } from '../../services/supabaseService';

const ReferralDashboard: React.FC = () => {
    const { user, supabase } = useSupabase();
    const [referrals, setReferrals] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [personalCode, setPersonalCode] = useState('');

    useEffect(() => {
        if (user) loadReferralData();
    }, [user]);

    const loadReferralData = async () => {
        try {
            // 1. Get the user's personal referral code from waitlist table
            const { data: waitlistEntry } = await supabase
                .from('waitlist')
                .select('personal_referral_code')
                .eq('email', user!.email)
                .single();

            if (waitlistEntry?.personal_referral_code) {
                setPersonalCode(waitlistEntry.personal_referral_code);
                const data = await fetchUserReferrals(waitlistEntry.personal_referral_code);
                setReferrals(data || []);
            }
        } catch (err) {
            console.error("Failed to load referrals:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const maskValue = (value: string, type: 'email' | 'phone') => {
        if (!value) return 'N/A';
        if (type === 'email') {
            const [local, domain] = value.split('@');
            return `${local.substring(0, 2)}***@${domain}`;
        } else {
            return `+91 ******${value.slice(-4)}`;
        }
    };

    const shareLink = `https://yureka.money/join-waitlist?ref=${personalCode}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareLink);
        alert("Referral link copied!");
    };

    if (isLoading) return <div className="flex items-center justify-center py-20"><Clock className="animate-spin text-clay" size={40} /></div>;

    return (
        <div className="space-y-10">
            {/* Referral Stats Header */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-2 bg-clay text-cream rounded-[2.5rem] p-10 flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 blur-3xl rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-1000" />
                    <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-60 mb-6">Your Accelerator Code</p>
                        <div className="flex items-center gap-4 bg-black/10 p-2 rounded-2xl border border-white/10 mb-8">
                            <span className="flex-1 font-mono text-2xl font-bold tracking-widest pl-4 truncate">{personalCode}</span>
                            <button onClick={copyToClipboard} className="w-14 h-14 bg-white text-clay rounded-xl flex items-center justify-center hover:scale-105 transition-transform shrink-0 shadow-xl"><Copy size={20} /></button>
                        </div>
                        <p className="text-xs italic opacity-80 leading-relaxed">Share this code with your inner circle to accelerate their approval and boost your rank.</p>
                    </div>
                </div>

                <div className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-center text-center">
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                        <Users className="text-clay" size={20} />
                    </div>
                    <span className="text-5xl font-black text-white tracking-tighter leading-none mb-2">{referrals.length}</span>
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Active Referrals</p>
                </div>

                <div className="bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-center text-center">
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                        <Star className="text-clay" size={20} />
                    </div>
                    <span className="text-5xl font-black text-white tracking-tighter leading-none mb-2">#{(1000 - referrals.length * 10)}</span>
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Predicted Rank</p>
                </div>
            </div>

            {/* Referral List */}
            <div className="bg-white/[0.03] border border-white/5 rounded-[3rem] overflow-hidden">
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Shield className="text-clay" size={18} />
                        <h4 className="text-sm font-black uppercase tracking-[0.3em] text-white">Network Activity</h4>
                    </div>
                    <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Privacy Protected (Hashed)</div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.02]">
                                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Full Name</th>
                                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Identity (Hashed)</th>
                                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Status</th>
                                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Acquired</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {referrals.length > 0 ? referrals.map((ref, i) => (
                                <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-clay/20 flex items-center justify-center text-[10px] font-bold text-clay">
                                                {ref.name[0]}
                                            </div>
                                            <span className="text-sm font-bold text-white tracking-tight">{ref.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-mono text-white/40">{maskValue(ref.email, 'email')}</span>
                                            <span className="text-[10px] font-mono text-white/20">{maskValue(ref.mobile_number, 'phone')}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${ref.status === 'accepted' ? 'bg-clay/10 text-clay border border-clay/20' : 'bg-white/5 text-white/40 border border-white/10'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${ref.status === 'accepted' ? 'bg-clay animate-pulse' : 'bg-white/20'}`} />
                                            {ref.status}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-xs text-white/20 font-mono">
                                        {new Date(ref.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="px-8 py-20 text-center text-white/20 italic">No network activity detected yet. Start sharing to build your portfolio.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReferralDashboard;
