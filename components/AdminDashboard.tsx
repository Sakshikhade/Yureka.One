import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    LogIn, LogOut, Loader2, Search, CheckCircle, XCircle, PauseCircle,
    Clock, RefreshCw, Filter, ShieldCheck, Users, UserCog, Plus, Trash2
} from 'lucide-react';
import { api, isApiError } from '../lib/api/client';

interface WaitlistEntry {
    id: string;
    fullName: string | null;
    email: string;
    mobileNumber: string | null;
    dateOfBirth: string | null;
    gender: string | null;
    monthlySpend: string | null;
    topCategory: string | null;
    yurekaScore: number | null;
    role: string;
    referralCode: string | null;
    personalReferralCode: string | null;
    rank: number;
    status: string;
    joinedAt: string | null;
    createdAt: string;
}

interface AdminUser {
    id: string;
    email: string;
    fullName: string | null;
    role: 'viewer' | 'admin' | 'superadmin';
    createdAt: string;
}

type AdminRole = 'viewer' | 'admin' | 'superadmin';

const ADMIN_TOKEN_KEY = 'yureka_admin_token';
const ADMIN_ROLE_KEY = 'yureka_admin_role';

const STATUS_TABS = [
    { id: 'all', label: 'All', icon: Filter },
    { id: 'pending', label: 'Pending', icon: Clock },
    { id: 'accepted', label: 'Accepted', icon: CheckCircle },
    { id: 'on_hold', label: 'On Hold', icon: PauseCircle },
    { id: 'rejected', label: 'Rejected', icon: XCircle },
] as const;

const AdminDashboard: React.FC = () => {
    // ─── Auth state ───
    const [adminToken, setAdminToken] = useState<string | null>(() => localStorage.getItem(ADMIN_TOKEN_KEY));
    const [adminRole, setAdminRole] = useState<AdminRole | null>(() => localStorage.getItem(ADMIN_ROLE_KEY) as AdminRole | null);
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);
    const [view, setView] = useState<'waitlist' | 'admins'>('waitlist');
    const canApprove = adminRole === 'admin' || adminRole === 'superadmin';
    const isSuperAdmin = adminRole === 'superadmin';

    // ─── Waitlist state ───
    const [entries, setEntries] = useState<WaitlistEntry[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [bulkActionLoading, setBulkActionLoading] = useState(false);

    // ─── Filters ───
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [minScore, setMinScore] = useState('');
    const [maxScore, setMaxScore] = useState('');

    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search), 300);
        return () => clearTimeout(t);
    }, [search]);

    // ─── Google sign-in ───
    const startAdminSignIn = () => {
        setAuthError(null);
        setIsSigningIn(true);
        const google = (window as any).google;
        if (!google?.accounts?.oauth2) {
            setAuthError('Google sign-in failed to load. Please refresh the page and try again.');
            setIsSigningIn(false);
            return;
        }
        const clientId = (import.meta as any).env.VITE_GOOGLE_CLIENT_ID;
        const tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: clientId,
            scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
            callback: async (tokenResponse: any) => {
                if (tokenResponse?.error || !tokenResponse?.access_token) {
                    setAuthError('Google sign-in was cancelled or denied.');
                    setIsSigningIn(false);
                    return;
                }
                try {
                    const res = await api.post<{ token: string; role: AdminRole }>(
                        '/api/v1/auth/admin-login',
                        { accessToken: tokenResponse.access_token },
                        { skipAuth: true }
                    );
                    if (isApiError(res)) {
                        setAuthError(res.error || 'This Google account is not authorized for admin access.');
                        return;
                    }
                    const { token, role } = res.data!;
                    localStorage.setItem(ADMIN_TOKEN_KEY, token);
                    localStorage.setItem(ADMIN_ROLE_KEY, role);
                    setAdminToken(token);
                    setAdminRole(role);
                } catch (e) {
                    console.error('Admin login failed:', e);
                    setAuthError('Something went wrong signing in. Please try again.');
                } finally {
                    setIsSigningIn(false);
                }
            },
        });
        tokenClient.requestAccessToken();
    };

    const logout = () => {
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        localStorage.removeItem(ADMIN_ROLE_KEY);
        setAdminToken(null);
        setAdminRole(null);
        setEntries([]);
        setSelected(new Set());
    };

    // ─── Fetch waitlist ───
    const fetchWaitlist = useCallback(async () => {
        if (!adminToken) return;
        setIsLoading(true);
        setLoadError(null);
        try {
            const params = new URLSearchParams();
            if (statusFilter !== 'all') params.set('status', statusFilter);
            if (debouncedSearch.trim()) params.set('search', debouncedSearch.trim());
            if (minScore !== '') params.set('minScore', minScore);
            if (maxScore !== '') params.set('maxScore', maxScore);

            const res = await api.get<WaitlistEntry[]>(
                `/api/v1/admin/waitlist?${params.toString()}`,
                { headers: { 'X-Admin-Session': adminToken! } }
            );
            if (isApiError(res)) {
                if (res.status === 401) {
                    logout();
                    setAuthError('Your admin session expired. Please sign in again.');
                    return;
                }
                setLoadError(res.error || 'Failed to load waitlist.');
                return;
            }
            setEntries(res.data! || []);
            setSelected(new Set());
        } catch (e) {
            console.error('Failed to fetch waitlist:', e);
            setLoadError('Failed to load waitlist.');
        } finally {
            setIsLoading(false);
        }
    }, [adminToken, statusFilter, debouncedSearch, minScore, maxScore]);

    useEffect(() => { fetchWaitlist(); }, [fetchWaitlist]);

    // ─── Solo status update ───
    const updateStatus = async (id: string, status: string) => {
        if (!adminToken) return;
        try {
            const res = await api.patch(`/api/v1/admin/waitlist/${id}/status`, { status }, { headers: { 'X-Admin-Session': adminToken! } });
            if (isApiError(res)) {
                setLoadError(res.error || 'Failed to update status.');
                return;
            }
            setEntries(prev => prev.map(e => e.id === id ? { ...e, status } : e));
        } catch (e) {
            console.error('Failed to update status:', e);
        }
    };

    // ─── Bulk status update ───
    const bulkUpdateStatus = async (status: string) => {
        if (!adminToken || selected.size === 0) return;
        setBulkActionLoading(true);
        try {
            const ids = Array.from(selected);
            const res = await api.post('/api/v1/admin/waitlist/bulk-status', { ids, status }, { headers: { 'X-Admin-Session': adminToken! } });
            if (isApiError(res)) {
                setLoadError(res.error || 'Bulk update failed.');
                return;
            }
            setEntries(prev => prev.map(e => selected.has(e.id) ? { ...e, status } : e));
            setSelected(new Set());
        } catch (e) {
            console.error('Bulk update failed:', e);
        } finally {
            setBulkActionLoading(false);
        }
    };

    const toggleSelected = (id: string) => {
        setSelected(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    const toggleSelectAll = () => {
        setSelected(prev => prev.size === entries.length ? new Set() : new Set(entries.map(e => e.id)));
    };

    // ─── Manage admins (superadmin only) ───
    const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
    const [isLoadingAdmins, setIsLoadingAdmins] = useState(false);
    const [adminError, setAdminError] = useState<string | null>(null);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState<AdminRole>('viewer');
    const [isInviting, setIsInviting] = useState(false);

    const fetchAdmins = useCallback(async () => {
        if (!adminToken || !isSuperAdmin) return;
        setIsLoadingAdmins(true);
        setAdminError(null);
        try {
            const res = await api.get<AdminUser[]>('/api/v1/admin/team', { headers: { 'X-Admin-Session': adminToken! } });
            if (isApiError(res)) {
                setAdminError(res.error || 'Failed to load admin users.');
                return;
            }
            setAdminUsers(res.data! || []);
        } catch (e) {
            console.error('Failed to fetch admins:', e);
            setAdminError('Failed to load admin users.');
        } finally {
            setIsLoadingAdmins(false);
        }
    }, [adminToken, isSuperAdmin]);

    useEffect(() => { if (view === 'admins') fetchAdmins(); }, [view, fetchAdmins]);

    const addAdmin = async () => {
        if (!adminToken || !inviteEmail.trim()) return;
        setIsInviting(true);
        setAdminError(null);
        try {
            const res = await api.post<AdminUser>(
                '/api/v1/admin/team',
                { email: inviteEmail.trim(), role: inviteRole },
                { headers: { 'X-Admin-Session': adminToken! } }
            );
            if (isApiError(res)) {
                setAdminError(res.error || 'Failed to add admin.');
                return;
            }
            setInviteEmail('');
            setInviteRole('viewer');
            fetchAdmins();
            // Best-effort welcome email — don't block on failure
            api.post('/api/v1/admin/notify', {
                email: res.data!.email, role: res.data!.role, firstName: res.data!.fullName,
            }, { headers: { 'X-Admin-Session': adminToken! } }).catch(() => {});
        } catch (e) {
            console.error('Failed to add admin:', e);
            setAdminError('Failed to add admin.');
        } finally {
            setIsInviting(false);
        }
    };

    const updateAdminRole = async (id: string, role: AdminRole) => {
        if (!adminToken) return;
        try {
            const res = await api.patch(`/api/v1/admin/team/${id}/role`, { role }, { headers: { 'X-Admin-Session': adminToken! } });
            if (isApiError(res)) {
                setAdminError(res.error || 'Failed to update role.');
                return;
            }
            setAdminUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
        } catch (e) {
            console.error('Failed to update admin role:', e);
        }
    };

    const removeAdmin = async (id: string) => {
        if (!adminToken) return;
        try {
            const res = await api.delete(`/api/v1/admin/team/${id}`, { headers: { 'X-Admin-Session': adminToken! } });
            if (isApiError(res)) {
                setAdminError(res.error || 'Failed to remove admin.');
                return;
            }
            setAdminUsers(prev => prev.filter(u => u.id !== id));
        } catch (e) {
            console.error('Failed to remove admin:', e);
        }
    };

    // ─── Sign-in gate ───
    if (!adminToken) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-sm w-full text-center bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl"
                >
                    <div className="w-14 h-14 bg-clay/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-clay/20">
                        <ShieldCheck size={22} className="text-clay" />
                    </div>
                    <h2 className="text-2xl font-heading font-black text-white uppercase tracking-tighter mb-3">Admin Access</h2>
                    <p className="text-white/50 text-sm leading-relaxed mb-8">
                        Sign in with your registered Google account to manage the waitlist.
                    </p>

                    <button
                        onClick={startAdminSignIn}
                        disabled={isSigningIn}
                        className="w-full bg-white text-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-clay transition-all duration-300 shadow-xl active:scale-[0.98] disabled:opacity-50"
                    >
                        {isSigningIn ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
                        <span className="text-[11px] font-black uppercase tracking-[0.2em]">
                            {isSigningIn ? 'Signing in…' : 'Continue with Google'}
                        </span>
                    </button>

                    {authError && (
                        <p className="mt-4 text-red-400 text-[10px] font-bold uppercase tracking-widest">{authError}</p>
                    )}
                </motion.div>
            </div>
        );
    }

    // ─── Waitlist admin table ───
    return (
        <div className="min-h-screen bg-[#050505] px-6 py-10">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-heading font-black text-white uppercase tracking-tighter flex items-center gap-3">
                            <Users size={26} className="text-clay" /> {view === 'waitlist' ? 'Waitlist Admin' : 'Manage Admins'}
                        </h1>
                        <p className="text-white/40 text-xs mt-1">
                            {view === 'waitlist' ? `${entries.length} entries matching current filters` : `Signed in as ${adminRole}`}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {isSuperAdmin && (
                            <div className="flex items-center gap-1 bg-white/[0.03] border border-white/10 rounded-xl p-1">
                                <button
                                    onClick={() => setView('waitlist')}
                                    className={`px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === 'waitlist' ? 'bg-clay text-black' : 'text-white/40 hover:text-white'}`}
                                >
                                    Waitlist
                                </button>
                                <button
                                    onClick={() => setView('admins')}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === 'admins' ? 'bg-clay text-black' : 'text-white/40 hover:text-white'}`}
                                >
                                    <UserCog size={12} /> Admins
                                </button>
                            </div>
                        )}
                        {view === 'waitlist' && (
                            <button
                                onClick={() => fetchWaitlist()}
                                className="p-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition-all"
                                title="Refresh"
                            >
                                <RefreshCw size={16} className={`text-white/50 ${isLoading ? 'animate-spin' : ''}`} />
                            </button>
                        )}
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all border border-red-500/10 text-[10px] font-black uppercase tracking-widest"
                        >
                            <LogOut size={14} /> Logout
                        </button>
                    </div>
                </div>

                {view === 'admins' && isSuperAdmin && (
                    <div className="space-y-6">
                        <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-5">
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mb-3">Add Admin</p>
                            <div className="flex flex-wrap gap-3">
                                <input
                                    type="email" placeholder="email@example.com"
                                    value={inviteEmail}
                                    onChange={e => setInviteEmail(e.target.value)}
                                    className="flex-1 min-w-[220px] bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-clay/50 placeholder:text-white/20"
                                />
                                <select
                                    value={inviteRole}
                                    onChange={e => setInviteRole(e.target.value as AdminRole)}
                                    className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-clay/50"
                                >
                                    <option value="viewer" className="bg-black">Viewer</option>
                                    <option value="admin" className="bg-black">Admin</option>
                                    <option value="superadmin" className="bg-black">Superadmin</option>
                                </select>
                                <button
                                    onClick={addAdmin}
                                    disabled={isInviting || !inviteEmail.trim()}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-clay text-black text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
                                >
                                    {isInviting ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />} Add
                                </button>
                            </div>
                            {adminError && <p className="mt-3 text-red-400 text-[10px] font-bold uppercase tracking-widest">{adminError}</p>}
                        </div>

                        <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[600px]">
                                <thead>
                                    <tr className="border-b border-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-white/30 bg-white/[0.02]">
                                        <th className="px-4 py-4">Email</th>
                                        <th className="px-4 py-4">Tier</th>
                                        <th className="px-4 py-4">Added</th>
                                        <th className="px-4 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {adminUsers.map(u => (
                                        <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="px-4 py-4">
                                                <div className="font-bold text-white text-sm">{u.fullName || '—'}</div>
                                                <div className="text-[11px] text-white/40 lowercase">{u.email}</div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <select
                                                    value={u.role}
                                                    onChange={e => updateAdminRole(u.id, e.target.value as AdminRole)}
                                                    className="bg-black/30 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-clay/50"
                                                >
                                                    <option value="viewer" className="bg-black">Viewer</option>
                                                    <option value="admin" className="bg-black">Admin</option>
                                                    <option value="superadmin" className="bg-black">Superadmin</option>
                                                </select>
                                            </td>
                                            <td className="px-4 py-4 text-xs text-white/40">
                                                {new Date(u.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <button onClick={() => removeAdmin(u.id)}
                                                    className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Remove">
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {!isLoadingAdmins && adminUsers.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-16 text-center text-white/20 text-[10px] font-black uppercase tracking-widest">
                                                No admins added yet
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {view === 'waitlist' && (
                <>
                {/* Filters */}
                <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-5 space-y-4">
                    <div className="flex flex-wrap gap-2">
                        {STATUS_TABS.map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setStatusFilter(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                        statusFilter === tab.id
                                            ? 'bg-clay text-black'
                                            : 'bg-white/[0.03] text-white/40 hover:text-white hover:bg-white/5 border border-white/10'
                                    }`}
                                >
                                    <Icon size={13} /> {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <div className="relative flex-1 min-w-[220px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                            <input
                                type="text" placeholder="Search name, email, mobile…"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full bg-black/30 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-clay/50 placeholder:text-white/20"
                            />
                        </div>
                        <input
                            type="number" placeholder="Min score"
                            value={minScore}
                            onChange={e => setMinScore(e.target.value)}
                            className="w-28 bg-black/30 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-clay/50 placeholder:text-white/20"
                        />
                        <input
                            type="number" placeholder="Max score"
                            value={maxScore}
                            onChange={e => setMaxScore(e.target.value)}
                            className="w-28 bg-black/30 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-clay/50 placeholder:text-white/20"
                        />
                    </div>
                </div>

                {/* Bulk actions */}
                {canApprove && selected.size > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between bg-clay/10 border border-clay/25 rounded-2xl px-5 py-3"
                    >
                        <span className="text-xs font-bold text-white">{selected.size} selected</span>
                        <div className="flex gap-2">
                            <button disabled={bulkActionLoading} onClick={() => bulkUpdateStatus('accepted')}
                                className="px-4 py-2 rounded-lg bg-clay text-black text-[10px] font-black uppercase tracking-widest disabled:opacity-50">Approve</button>
                            <button disabled={bulkActionLoading} onClick={() => bulkUpdateStatus('on_hold')}
                                className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-300 text-[10px] font-black uppercase tracking-widest disabled:opacity-50">Hold</button>
                            <button disabled={bulkActionLoading} onClick={() => bulkUpdateStatus('rejected')}
                                className="px-4 py-2 rounded-lg bg-red-500/20 text-red-300 text-[10px] font-black uppercase tracking-widest disabled:opacity-50">Reject</button>
                        </div>
                    </motion.div>
                )}

                {loadError && (
                    <p className="text-red-400 text-xs font-bold text-center">{loadError}</p>
                )}

                {/* Table */}
                <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1100px]">
                        <thead>
                            <tr className="border-b border-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-white/30 bg-white/[0.02]">
                                {canApprove && (
                                    <th className="px-4 py-4">
                                        <input type="checkbox"
                                            checked={entries.length > 0 && selected.size === entries.length}
                                            onChange={toggleSelectAll} />
                                    </th>
                                )}
                                <th className="px-4 py-4">Name / Email</th>
                                <th className="px-4 py-4">Mobile</th>
                                <th className="px-4 py-4">DOB / Gender</th>
                                <th className="px-4 py-4">Monthly Spend</th>
                                <th className="px-4 py-4">Top Category</th>
                                <th className="px-4 py-4">Score</th>
                                <th className="px-4 py-4">Rank</th>
                                <th className="px-4 py-4">Status</th>
                                {canApprove && <th className="px-4 py-4 text-right">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence mode="popLayout">
                                {entries.map(entry => (
                                    <motion.tr key={entry.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="hover:bg-white/[0.02] transition-colors">
                                        {canApprove && (
                                            <td className="px-4 py-4">
                                                <input type="checkbox" checked={selected.has(entry.id)} onChange={() => toggleSelected(entry.id)} />
                                            </td>
                                        )}
                                        <td className="px-4 py-4">
                                            <div className="font-bold text-white text-sm">{entry.fullName || '—'}</div>
                                            <div className="text-[11px] text-white/40 lowercase">{entry.email}</div>
                                        </td>
                                        <td className="px-4 py-4 text-xs text-white/60">{entry.mobileNumber || '—'}</td>
                                        <td className="px-4 py-4 text-xs text-white/60">
                                            {entry.dateOfBirth || '—'}{entry.gender ? ` · ${entry.gender}` : ''}
                                        </td>
                                        <td className="px-4 py-4 text-xs text-white/60">{entry.monthlySpend || '—'}</td>
                                        <td className="px-4 py-4 text-xs text-white/60">{entry.topCategory || '—'}</td>
                                        <td className="px-4 py-4">
                                            {entry.yurekaScore != null
                                                ? <span className="text-clay font-black text-sm">{entry.yurekaScore}</span>
                                                : <span className="text-white/20 text-xs">—</span>}
                                        </td>
                                        <td className="px-4 py-4 text-xs text-white/40">#{entry.rank}</td>
                                        <td className="px-4 py-4">
                                            <span className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
                                                entry.status === 'accepted' ? 'bg-clay/10 text-clay' :
                                                entry.status === 'on_hold' ? 'bg-blue-500/10 text-blue-400' :
                                                entry.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                                                'bg-amber-500/10 text-amber-400'
                                            }`}>
                                                {entry.status}
                                            </span>
                                        </td>
                                        {canApprove && (
                                            <td className="px-4 py-4">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button onClick={() => updateStatus(entry.id, 'accepted')} disabled={entry.status === 'accepted'}
                                                        className="p-2 rounded-lg text-white/30 hover:text-clay hover:bg-clay/10 disabled:opacity-30 transition-all" title="Approve">
                                                        <CheckCircle size={16} />
                                                    </button>
                                                    <button onClick={() => updateStatus(entry.id, 'on_hold')} disabled={entry.status === 'on_hold'}
                                                        className="p-2 rounded-lg text-white/30 hover:text-blue-400 hover:bg-blue-500/10 disabled:opacity-30 transition-all" title="Hold">
                                                        <PauseCircle size={16} />
                                                    </button>
                                                    <button onClick={() => updateStatus(entry.id, 'rejected')} disabled={entry.status === 'rejected'}
                                                        className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-30 transition-all" title="Reject">
                                                        <XCircle size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                            {!isLoading && entries.length === 0 && (
                                <tr>
                                    <td colSpan={canApprove ? 10 : 8} className="px-4 py-16 text-center text-white/20 text-[10px] font-black uppercase tracking-widest">
                                        No entries match these filters
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                </>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
