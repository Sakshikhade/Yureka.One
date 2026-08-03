import React, { useCallback, useEffect, useState } from 'react'
import {
  LogIn, LogOut, Loader2, Search, CheckCircle, XCircle, PauseCircle,
  Clock, RefreshCw, Filter, ShieldCheck, Users, Coins, Store, Plus, Trash2,
} from 'lucide-react'

type AdminRole = 'viewer' | 'admin' | 'superadmin'
type Tab = 'waitlist' | 'offers' | 'ledger' | 'admins'

const ADMIN_TOKEN_KEY = 'yureka_admin_token'
const ADMIN_ROLE_KEY = 'yureka_admin_role'
const ADMIN_EMAIL_KEY = 'yureka_admin_email'

interface Envelope<T> {
  data: T | null
  status: number
  error?: string
}

async function adminFetch<T>(path: string, token: string | null, init?: RequestInit): Promise<Envelope<T>> {
  try {
    const res = await fetch(path, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'X-Admin-Session': token } : {}),
        ...(init?.headers || {}),
      },
    })
    return (await res.json()) as Envelope<T>
  } catch {
    return { data: null, status: 503, error: 'Admin API unreachable' }
  }
}

function formatPaise(paise: number) {
  return `₹${(paise / 100).toLocaleString('en-IN')}`
}

const STATUS_TABS = [
  { id: 'all', label: 'All', icon: Filter },
  { id: 'pending', label: 'Pending', icon: Clock },
  { id: 'accepted', label: 'Accepted', icon: CheckCircle },
  { id: 'on_hold', label: 'On Hold', icon: PauseCircle },
  { id: 'rejected', label: 'Rejected', icon: XCircle },
] as const

const AdminDashboard: React.FC = () => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(ADMIN_TOKEN_KEY))
  const [role, setRole] = useState<AdminRole | null>(() => localStorage.getItem(ADMIN_ROLE_KEY) as AdminRole | null)
  const [email, setEmail] = useState(() => localStorage.getItem(ADMIN_EMAIL_KEY) || '')
  const [password, setPassword] = useState('')
  const [loginEmail, setLoginEmail] = useState('admin@yureka.one')
  const [authError, setAuthError] = useState<string | null>(null)
  const [signingIn, setSigningIn] = useState(false)
  const [tab, setTab] = useState<Tab>('waitlist')
  const [storeMode, setStoreMode] = useState<string>('')

  const canWrite = role === 'admin' || role === 'superadmin'
  const isSuper = role === 'superadmin'

  const logout = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY)
    localStorage.removeItem(ADMIN_ROLE_KEY)
    localStorage.removeItem(ADMIN_EMAIL_KEY)
    setToken(null)
    setRole(null)
    setEmail('')
  }

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    setSigningIn(true)
    setAuthError(null)
    const res = await adminFetch<{ token: string; role: AdminRole; email: string }>('/api/admin/login', null, {
      method: 'POST',
      body: JSON.stringify({ email: loginEmail, password }),
    })
    setSigningIn(false)
    if (res.error || !res.data) {
      setAuthError(res.error || 'Login failed')
      return
    }
    localStorage.setItem(ADMIN_TOKEN_KEY, res.data.token)
    localStorage.setItem(ADMIN_ROLE_KEY, res.data.role)
    localStorage.setItem(ADMIN_EMAIL_KEY, res.data.email)
    setToken(res.data.token)
    setRole(res.data.role)
    setEmail(res.data.email)
    setPassword('')
  }

  useEffect(() => {
    adminFetch<{ adminStore: string; goldbackStore: string }>('/api/admin/health', null).then((r) => {
      if (r.data) setStoreMode(`${r.data.adminStore}/${r.data.goldbackStore}`)
    })
  }, [])

  // ─── Waitlist ───
  const [entries, setEntries] = useState<any[]>([])
  const [wlLoading, setWlLoading] = useState(false)
  const [wlError, setWlError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const fetchWaitlist = useCallback(async () => {
    if (!token) return
    setWlLoading(true)
    setWlError(null)
    const params = new URLSearchParams()
    if (statusFilter !== 'all') params.set('status', statusFilter)
    if (search.trim()) params.set('search', search.trim())
    const res = await adminFetch<any[]>(`/api/admin/waitlist?${params}`, token)
    setWlLoading(false)
    if (res.status === 401) {
      logout()
      return
    }
    if (res.error || !res.data) {
      setWlError(res.error || 'Failed to load')
      return
    }
    setEntries(res.data)
    setSelected(new Set())
  }, [token, statusFilter, search])

  useEffect(() => {
    if (token && tab === 'waitlist') fetchWaitlist()
  }, [token, tab, fetchWaitlist])

  const setStatus = async (id: string, status: string) => {
    const res = await adminFetch(`/api/admin/waitlist/${id}/status`, token, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
    if (!res.error) setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)))
  }

  const bulkStatus = async (status: string) => {
    const ids = Array.from(selected)
    if (!ids.length) return
    await adminFetch('/api/admin/waitlist/bulk-status', token, {
      method: 'POST',
      body: JSON.stringify({ ids, status }),
    })
    fetchWaitlist()
  }

  // ─── Offers ───
  const [offers, setOffers] = useState<any[]>([])
  const [offersLoading, setOffersLoading] = useState(false)
  const [offerForm, setOfferForm] = useState({
    title: '',
    merchant: '',
    url: '',
    category: 'general',
    description: '',
    rewardPaise: 2500,
    rewardLabel: '₹25 Goldback',
    active: true,
  })

  const fetchOffers = useCallback(async () => {
    if (!token) return
    setOffersLoading(true)
    const res = await adminFetch<any[]>('/api/admin/offers', token)
    setOffersLoading(false)
    if (res.data) setOffers(res.data)
  }, [token])

  useEffect(() => {
    if (token && tab === 'offers') fetchOffers()
  }, [token, tab, fetchOffers])

  const saveOffer = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await adminFetch('/api/admin/offers', token, {
      method: 'POST',
      body: JSON.stringify(offerForm),
    })
    if (!res.error) {
      setOfferForm({
        title: '',
        merchant: '',
        url: '',
        category: 'general',
        description: '',
        rewardPaise: 2500,
        rewardLabel: '₹25 Goldback',
        active: true,
      })
      fetchOffers()
    }
  }

  const removeOffer = async (id: string) => {
    await adminFetch(`/api/admin/offers/${id}`, token, { method: 'DELETE' })
    fetchOffers()
  }

  // ─── Ledger ───
  const [ledger, setLedger] = useState<any[]>([])
  const [accounts, setAccounts] = useState<any[]>([])

  const fetchLedger = useCallback(async () => {
    if (!token) return
    const [l, a] = await Promise.all([
      adminFetch<any[]>('/api/admin/goldback/ledger', token),
      adminFetch<any[]>('/api/admin/goldback/accounts', token),
    ])
    if (l.data) setLedger(l.data)
    if (a.data) setAccounts(a.data)
  }, [token])

  useEffect(() => {
    if (token && tab === 'ledger') fetchLedger()
  }, [token, tab, fetchLedger])

  // ─── Admins ───
  const [admins, setAdmins] = useState<any[]>([])
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<AdminRole>('admin')

  const fetchAdmins = useCallback(async () => {
    if (!token || !isSuper) return
    const res = await adminFetch<any[]>('/api/admin/team', token)
    if (res.data) setAdmins(res.data)
  }, [token, isSuper])

  useEffect(() => {
    if (token && tab === 'admins') fetchAdmins()
  }, [token, tab, fetchAdmins])

  const addAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    await adminFetch('/api/admin/team', token, {
      method: 'POST',
      body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
    })
    setInviteEmail('')
    fetchAdmins()
  }

  const pendingCount = entries.filter((e) => e.status === 'pending').length
  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: 'bg-amber-500/15 text-amber-300 border-amber-500/25',
      accepted: 'bg-clay/15 text-clay border-clay/30',
      on_hold: 'bg-white/10 text-white/50 border-white/15',
      rejected: 'bg-red-500/15 text-red-300 border-red-500/25',
    }
    return map[status] || 'bg-white/10 text-white/40 border-white/10'
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-[#070707] text-white flex items-center justify-center p-6 relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(52,211,153,0.18), transparent 60%)',
          }}
        />
        <form
          onSubmit={login}
          className="relative w-full max-w-md rounded-[2rem] border border-white/[0.08] bg-[#0c0c0c]/95 backdrop-blur-xl p-9 space-y-5 shadow-2xl"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-clay text-black shadow-[0_0_32px_rgba(52,211,153,0.35)]">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Backoffice</h1>
            <p className="text-white/40 text-sm mt-2 leading-relaxed">
              Waitlist, offers, and Goldback — one console on one database.
            </p>
          </div>
          <label className="block space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35">Email</span>
            <input
              className="w-full rounded-2xl bg-black/50 border border-white/10 px-4 py-3.5 text-sm focus:outline-none focus:border-clay/40 transition"
              placeholder="admin@yureka.one"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              autoComplete="username"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35">Password</span>
            <input
              type="password"
              className="w-full rounded-2xl bg-black/50 border border-white/10 px-4 py-3.5 text-sm focus:outline-none focus:border-clay/40 transition"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>
          {authError && (
            <p className="rounded-xl border border-red-500/25 bg-red-500/10 px-3 py-2 text-red-300 text-sm">{authError}</p>
          )}
          <button
            type="submit"
            disabled={signingIn}
            className="w-full rounded-2xl bg-clay text-black font-black uppercase tracking-[0.2em] text-xs py-4 flex items-center justify-center gap-2 hover:brightness-110 transition shadow-[0_0_40px_rgba(52,211,153,0.25)]"
          >
            {signingIn ? <Loader2 className="animate-spin" size={16} /> : <LogIn size={16} />}
            Enter console
          </button>
          <p className="text-[10px] text-white/25 text-center pt-1">
            Local: admin@yureka.one / yureka-admin
          </p>
        </form>
      </div>
    )
  }

  const tabs: { id: Tab; label: string; icon: any; hide?: boolean; hint?: string }[] = [
    { id: 'waitlist', label: 'Waitlist', icon: Users, hint: pendingCount ? `${pendingCount} pending` : undefined },
    { id: 'offers', label: 'Offers', icon: Store },
    { id: 'ledger', label: 'Goldback', icon: Coins },
    { id: 'admins', label: 'Admins', icon: ShieldCheck, hide: !isSuper },
  ]

  return (
    <div className="min-h-screen bg-[#070707] text-white flex">
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-white/[0.07] bg-[#0a0a0a] p-5">
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="h-10 w-10 rounded-xl bg-clay flex items-center justify-center text-black shadow-[0_0_24px_rgba(52,211,153,0.3)]">
            <ShieldCheck size={18} />
          </div>
          <div>
            <p className="font-black tracking-tight leading-none">Yureka</p>
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/30 mt-1">Backoffice</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1.5">
          {tabs.filter((t) => !t.hide).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left transition ${
                tab === t.id
                  ? 'bg-white text-black shadow-lg'
                  : 'text-white/40 hover:bg-white/[0.04] hover:text-white'
              }`}
            >
              <t.icon size={16} />
              <span className="text-[11px] font-black uppercase tracking-[0.14em] flex-1">{t.label}</span>
              {t.hint && tab !== t.id && (
                <span className="text-[9px] font-bold text-amber-300/80">{t.hint}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="mt-auto pt-4 border-t border-white/[0.07] space-y-3">
          <div className="px-2">
            <p className="text-xs font-bold truncate">{email}</p>
            <p className="text-[9px] uppercase tracking-[0.25em] text-white/30 mt-1">
              {role} · {storeMode || '…'}
            </p>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 rounded-xl px-4 py-3 text-white/35 hover:text-red-300 hover:bg-red-500/10 text-[10px] font-black uppercase tracking-[0.2em] transition"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="md:hidden border-b border-white/[0.07] px-4 py-3 flex items-center justify-between gap-3">
          <p className="font-black">Backoffice</p>
          <button onClick={logout} className="text-white/40"><LogOut size={16} /></button>
        </header>
        <nav className="md:hidden flex gap-2 overflow-x-auto px-4 py-3 border-b border-white/[0.07]">
          {tabs.filter((t) => !t.hide).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`shrink-0 rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest ${
                tab === t.id ? 'bg-clay text-black' : 'bg-white/5 text-white/40'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <main className="flex-1 p-5 md:p-8 max-w-5xl w-full mx-auto">
        {tab === 'waitlist' && (
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-black tracking-tight">Waitlist</h2>
              <p className="text-white/40 text-sm mt-1">Approve members into Goldback access</p>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              {STATUS_TABS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStatusFilter(s.id)}
                  className={`rounded-xl px-3.5 py-2 text-[10px] font-black uppercase tracking-widest transition ${
                    statusFilter === s.id ? 'bg-clay text-black' : 'bg-white/[0.04] border border-white/10 text-white/40 hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
              <div className="flex-1 min-w-[8px]" />
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  className="rounded-xl bg-black/40 border border-white/10 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-clay/35 w-44"
                  placeholder="Search…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button onClick={fetchWaitlist} className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-white/45 hover:text-white transition">
                <RefreshCw size={14} />
              </button>
            </div>

            {canWrite && selected.size > 0 && (
              <div className="sticky top-2 z-10 flex flex-wrap gap-2 rounded-2xl border border-clay/25 bg-black/80 backdrop-blur-xl px-4 py-3 shadow-xl">
                <span className="text-xs text-white/50 self-center mr-1">{selected.size} selected</span>
                <button onClick={() => bulkStatus('accepted')} className="rounded-xl bg-clay text-black px-3 py-2 text-xs font-black">Accept</button>
                <button onClick={() => bulkStatus('on_hold')} className="rounded-xl bg-white/10 px-3 py-2 text-xs font-bold">Hold</button>
                <button onClick={() => bulkStatus('rejected')} className="rounded-xl bg-red-500/20 text-red-300 px-3 py-2 text-xs font-bold">Reject</button>
              </div>
            )}

            {wlLoading ? (
              <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-clay" /></div>
            ) : wlError ? (
              <p className="text-red-300 text-sm">{wlError}</p>
            ) : (
              <div className="space-y-2.5">
                {entries.map((e) => (
                  <div key={e.id} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.035] p-4 flex flex-wrap items-center gap-4 transition">
                    {canWrite && (
                      <input
                        type="checkbox"
                        className="accent-emerald-400 h-4 w-4"
                        checked={selected.has(e.id)}
                        onChange={() =>
                          setSelected((prev) => {
                            const n = new Set(prev)
                            if (n.has(e.id)) n.delete(e.id)
                            else n.add(e.id)
                            return n
                          })
                        }
                      />
                    )}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-sm font-black text-clay">
                      {(e.fullName || e.email || '?')[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-[180px]">
                      <p className="font-bold">{e.fullName || '—'}</p>
                      <p className="text-white/40 text-xs mt-0.5">{e.email}</p>
                    </div>
                    <span className={`text-[9px] uppercase tracking-[0.2em] font-black border px-2.5 py-1 rounded-lg ${statusBadge(e.status)}`}>
                      {e.status.replace('_', ' ')}
                    </span>
                    {e.yurekaScore != null && (
                      <span className="text-clay text-xs font-mono tabular-nums">★ {e.yurekaScore}</span>
                    )}
                    {canWrite && (
                      <div className="flex gap-1.5">
                        <button onClick={() => setStatus(e.id, 'accepted')} className="text-[10px] px-2.5 py-1.5 rounded-lg bg-clay/15 text-clay font-bold hover:bg-clay/25">Accept</button>
                        <button onClick={() => setStatus(e.id, 'on_hold')} className="text-[10px] px-2.5 py-1.5 rounded-lg bg-white/8 font-bold hover:bg-white/12">Hold</button>
                        <button onClick={() => setStatus(e.id, 'rejected')} className="text-[10px] px-2.5 py-1.5 rounded-lg bg-red-500/15 text-red-300 font-bold hover:bg-red-500/25">Reject</button>
                      </div>
                    )}
                  </div>
                ))}
                {!entries.length && <p className="text-white/30 text-sm py-16 text-center">No waitlist entries for this filter</p>}
              </div>
            )}
          </section>
        )}

        {tab === 'offers' && (
          <section className="space-y-8">
            <div>
              <h2 className="text-2xl font-black tracking-tight">Offers</h2>
              <p className="text-white/40 text-sm mt-1">Deals that credit Goldback when members shop</p>
            </div>
            {canWrite && (
              <form onSubmit={saveOffer} className="rounded-[1.75rem] border border-white/[0.08] bg-gradient-to-br from-clay/10 to-transparent p-6 grid md:grid-cols-2 gap-3">
                <h3 className="md:col-span-2 text-[10px] font-black uppercase tracking-[0.25em] text-clay flex items-center gap-2">
                  <Plus size={14} /> New offer
                </h3>
                <input className="rounded-xl bg-black/50 border border-white/10 px-3 py-2.5 text-sm focus:outline-none focus:border-clay/35" placeholder="Title" value={offerForm.title} onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })} required />
                <input className="rounded-xl bg-black/50 border border-white/10 px-3 py-2.5 text-sm focus:outline-none focus:border-clay/35" placeholder="Merchant" value={offerForm.merchant} onChange={(e) => setOfferForm({ ...offerForm, merchant: e.target.value })} required />
                <input className="rounded-xl bg-black/50 border border-white/10 px-3 py-2.5 text-sm md:col-span-2 focus:outline-none focus:border-clay/35" placeholder="URL" value={offerForm.url} onChange={(e) => setOfferForm({ ...offerForm, url: e.target.value })} required />
                <input className="rounded-xl bg-black/50 border border-white/10 px-3 py-2.5 text-sm focus:outline-none focus:border-clay/35" placeholder="Category" value={offerForm.category} onChange={(e) => setOfferForm({ ...offerForm, category: e.target.value })} />
                <input className="rounded-xl bg-black/50 border border-white/10 px-3 py-2.5 text-sm focus:outline-none focus:border-clay/35" placeholder="Reward label" value={offerForm.rewardLabel} onChange={(e) => setOfferForm({ ...offerForm, rewardLabel: e.target.value })} />
                <input type="number" className="rounded-xl bg-black/50 border border-white/10 px-3 py-2.5 text-sm focus:outline-none focus:border-clay/35" placeholder="Reward paise" value={offerForm.rewardPaise} onChange={(e) => setOfferForm({ ...offerForm, rewardPaise: Number(e.target.value) })} />
                <textarea className="rounded-xl bg-black/50 border border-white/10 px-3 py-2.5 text-sm md:col-span-2 focus:outline-none focus:border-clay/35" placeholder="Description" rows={2} value={offerForm.description} onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })} />
                <button type="submit" className="md:col-span-2 rounded-xl bg-clay text-black font-black text-xs uppercase tracking-[0.2em] py-3.5 hover:brightness-110 transition">Publish offer</button>
              </form>
            )}

            {offersLoading ? (
              <div className="py-16 flex justify-center"><Loader2 className="animate-spin text-clay" /></div>
            ) : (
              <div className="grid md:grid-cols-2 gap-3">
                {offers.map((o) => (
                  <div key={o.id} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 hover:border-white/15 transition">
                    <div className="flex justify-between gap-3">
                      <div>
                        <p className="font-bold text-lg tracking-tight">{o.title}</p>
                        <p className="text-white/40 text-xs mt-1">{o.merchant} · {o.category}</p>
                      </div>
                      <span className="text-clay text-xs font-black shrink-0 bg-clay/10 border border-clay/25 rounded-xl px-2.5 py-1.5 h-fit">
                        {o.rewardLabel || formatPaise(o.rewardPaise)}
                      </span>
                    </div>
                    <p className="text-white/45 text-sm mt-3 line-clamp-2 leading-relaxed">{o.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className={`text-[9px] uppercase tracking-[0.2em] font-black border px-2 py-1 rounded-lg ${o.active ? 'text-clay border-clay/30 bg-clay/10' : 'text-white/30 border-white/10'}`}>
                        {o.active ? 'live' : 'off'}
                      </span>
                      {canWrite && (
                        <button onClick={() => removeOffer(o.id)} className="text-red-300/60 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-500/10 transition">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {tab === 'ledger' && (
          <section className="space-y-8">
            <div>
              <h2 className="text-2xl font-black tracking-tight">Goldback</h2>
              <p className="text-white/40 text-sm mt-1">Balances and earn ledger across members</p>
            </div>
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35 mb-3">Accounts</h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                {accounts.map((a) => (
                  <div key={a.userId} className="rounded-2xl border border-white/[0.07] bg-gradient-to-br from-clay/10 to-transparent p-5">
                    <p className="text-[10px] text-white/40 truncate uppercase tracking-wider">{a.userId}</p>
                    <p className="text-3xl font-black text-white mt-2 tabular-nums tracking-tight">{formatPaise(a.balancePaise)}</p>
                  </div>
                ))}
                {!accounts.length && <p className="text-white/30 text-sm col-span-full py-6">No balances yet — members earn from offers</p>}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35">Ledger</h3>
                <button onClick={fetchLedger} className="text-white/30 hover:text-white p-1"><RefreshCw size={14} /></button>
              </div>
              <div className="space-y-2">
                {ledger.map((e) => (
                  <div key={e.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5 flex justify-between gap-3 text-sm">
                    <div className="min-w-0">
                      <p className="font-bold truncate">{String(e.meta?.title || e.type)}</p>
                      <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1 truncate">{e.userId} · {e.status}</p>
                    </div>
                    <span className="text-clay font-black tabular-nums shrink-0">+{formatPaise(e.amountPaise)}</span>
                  </div>
                ))}
                {!ledger.length && <p className="text-white/30 text-sm py-10 text-center">No ledger entries yet</p>}
              </div>
            </div>
          </section>
        )}

        {tab === 'admins' && isSuper && (
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-black tracking-tight">Admins</h2>
              <p className="text-white/40 text-sm mt-1">Who can open this console</p>
            </div>
            <form onSubmit={addAdmin} className="flex flex-wrap gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
              <input className="rounded-xl bg-black/40 border border-white/10 px-3 py-2.5 text-sm flex-1 min-w-[200px] focus:outline-none focus:border-clay/35" placeholder="email@…" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
              <select className="rounded-xl bg-black/40 border border-white/10 px-3 py-2.5 text-sm" value={inviteRole} onChange={(e) => setInviteRole(e.target.value as AdminRole)}>
                <option value="viewer">viewer</option>
                <option value="admin">admin</option>
                <option value="superadmin">superadmin</option>
              </select>
              <button type="submit" className="rounded-xl bg-clay text-black px-5 py-2.5 text-xs font-black uppercase tracking-widest hover:brightness-110">Invite</button>
            </form>
            <div className="space-y-2">
              {admins.map((a) => (
                <div key={a.id} className="rounded-2xl border border-white/[0.07] px-4 py-4 flex justify-between items-center gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-xl bg-clay/15 text-clay flex items-center justify-center text-xs font-black shrink-0">
                      {a.email[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold truncate">{a.email}</p>
                      <p className="text-white/30 text-xs">{a.fullName || '—'}</p>
                    </div>
                  </div>
                  <span className="text-[9px] uppercase tracking-[0.2em] font-black text-clay border border-clay/30 bg-clay/10 px-2.5 py-1 rounded-lg shrink-0">{a.role}</span>
                </div>
              ))}
            </div>
          </section>
        )}
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard
