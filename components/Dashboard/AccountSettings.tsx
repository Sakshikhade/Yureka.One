import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
    User, Mail, Phone, Calendar, GenderReveal, 
    Save, ShieldCheck, Loader2, Sparkles, Check
} from 'lucide-react';
import { useSupabase } from '../SupabaseProvider';
import { updateWaitlistMetadata } from '../../services/supabaseService';

const AccountSettings: React.FC = () => {
    const { user, supabase } = useSupabase();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [waitlistId, setWaitlistId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobileNumber: '',
        dateOfBirth: '',
        gender: ''
    });

    useEffect(() => {
        if (user) loadAccountData();
    }, [user]);

    const loadAccountData = async () => {
        try {
            const { data: entry } = await supabase
                .from('waitlist')
                .select('*')
                .eq('email', user!.email)
                .single();

            if (entry) {
                setWaitlistId(entry.id);
                setFormData({
                    firstName: entry.first_name || '',
                    lastName: entry.last_name || '',
                    email: entry.email || '',
                    mobileNumber: entry.mobile_number || '',
                    dateOfBirth: entry.date_of_birth || '',
                    gender: entry.gender || ''
                });
            }
        } catch (err) {
            console.error("Failed to load account:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!waitlistId) return;
        setIsSaving(true);
        try {
            await updateWaitlistMetadata(waitlistId, {
                mobile_number: formData.mobileNumber,
                date_of_birth: formData.dateOfBirth,
                gender: formData.gender
            });
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (err) {
            alert("Failed to update profile.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-clay" size={40} /></div>;

    return (
        <div className="max-w-3xl space-y-12">
            <div className="bg-white/[0.03] border border-white/5 rounded-[3rem] p-10 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-clay/10 blur-3xl rounded-full -mr-10 -mt-10" />
                
                <div className="relative z-10 space-y-10">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-center text-white/40">
                            <User size={32} />
                        </div>
                        <div>
                            <h3 className="text-3xl italic tracking-tighter text-white">{formData.firstName} {formData.lastName}</h3>
                            <div className="flex items-center gap-2 text-clay">
                                <ShieldCheck size={14} />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified Identity</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-white/40 transition-colors" size={18} />
                                <input 
                                    type="email" value={formData.email} disabled
                                    className="w-full bg-white/[0.02] border border-white/10 rounded-2xl pl-16 pr-6 py-5 text-white/40 outline-none cursor-not-allowed text-sm"
                                />
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[8px] font-black uppercase tracking-widest text-white/10">Read Only</div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Mobile Number</label>
                            <div className="relative group">
                                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-clay transition-colors" size={18} />
                                <input 
                                    type="tel" value={formData.mobileNumber}
                                    onChange={e => setFormData({...formData, mobileNumber: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 py-5 text-white outline-none focus:border-clay transition-all text-sm"
                                    placeholder="+91 XXXXX XXXXX"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Date of Birth</label>
                            <div className="relative group">
                                <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-clay transition-colors" size={18} />
                                <input 
                                    type="date" value={formData.dateOfBirth}
                                    onChange={e => setFormData({...formData, dateOfBirth: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 py-5 text-white outline-none focus:border-clay transition-all text-sm appearance-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Gender</label>
                            <select 
                                value={formData.gender}
                                onChange={e => setFormData({...formData, gender: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white outline-none focus:border-clay transition-all text-sm appearance-none bg-black"
                            >
                                <option value="" className="bg-black">Select Gender</option>
                                <option value="male" className="bg-black">Male</option>
                                <option value="female" className="bg-black">Female</option>
                                <option value="other" className="bg-black">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3 text-white/20">
                            <ShieldCheck size={18} />
                            <p className="text-[10px] font-medium leading-relaxed italic">Your account is secured by military-grade OAuth encryption.</p>
                        </div>
                        
                        <button 
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`w-full md:w-auto px-10 py-5 rounded-2xl flex items-center justify-center gap-4 transition-all active:scale-95 disabled:opacity-50 ${showSuccess ? 'bg-clay text-cream' : 'bg-white text-cream hover:bg-clay'}`}
                        >
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                                {isSaving ? 'Encrypting...' : showSuccess ? 'Data Secured' : 'Commit Changes'}
                            </span>
                            {isSaving ? <Loader2 className="animate-spin" size={18} /> : showSuccess ? <Check size={18} /> : <Save size={18} />}
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-8 bg-red-500/5 border border-red-500/10 rounded-[2rem] flex items-center gap-6">
                <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center text-red-400 shrink-0">
                    <Sparkles size={20} />
                </div>
                <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-red-400 mb-1">Danger Zone</p>
                    <p className="text-xs text-white/40 italic">Revoking access will permanently remove you from the priority waitlist and delete all portfolio data.</p>
                </div>
                <button className="ml-auto text-[9px] font-black uppercase tracking-[0.3em] text-red-400/40 hover:text-red-400 transition-colors">Request Deletion</button>
            </div>
        </div>
    );
};

export default AccountSettings;
