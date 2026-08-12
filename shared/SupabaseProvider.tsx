import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, Blog, Review, WaitlistEntry } from '@/types';
import { featuredCards } from '@landing/data';
import { api, isApiError } from '@backend/lib/api/client';
import { fromApiCard, fromApiBlog, fromApiReview, fromApiWaitlist } from '@backend/lib/api/mappers';
import type { Card as ApiCard, Blog as ApiBlog, Review as ApiReview, Waitlist as ApiWaitlist } from '@backend/lib/api/types';
import {
  getSupabaseBrowser,
  setAuthTokenGetter,
  normalizeWaitlistStatus,
  type AppUserStatus,
  type Session,
  type User,
  supabaseConfigured,
} from '@shared/auth';

export interface ParsedTransaction {
  brandName: string;
  amount: string;
  description: string;
  date: string;
  sender: string;
  type?: string;
}

interface SupabaseContextType {
  cards: Card[];
  blogs: Blog[];
  reviews: Review[];
  waitlist: WaitlistEntry[];
  team: any[];
  logs: any[];
  user: User | null;
  session: Session | null;
  currentUserStatus: AppUserStatus;
  syncStatus: 'connected' | 'reconnecting' | 'error';
  isLoading: boolean;
  isAdminDataLoaded: boolean;
  refreshAll: () => Promise<void>;
  refreshUserStatus: () => Promise<void>;
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
  setBlogs: React.Dispatch<React.SetStateAction<Blog[]>>;
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
  setWaitlist: React.Dispatch<React.SetStateAction<WaitlistEntry[]>>;
  setTeam: React.Dispatch<React.SetStateAction<any[]>>;

  ledgerTransactions: ParsedTransaction[];
  ledgerLoading: boolean;
  ledgerError: string | null;
  scanProgress: number;
  syncLedger: (forceSync?: boolean) => Promise<void>;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

async function loadAdminData(setters: {
  setCards: (v: any) => void; setBlogs: (v: any) => void; setReviews: (v: any) => void;
  setWaitlist: (v: any) => void; setTeam: (v: any) => void; setLogs: (v: any) => void;
}) {
  const [cRes, bRes, rRes, wRes, tRes, lRes] = await Promise.all([
    api.get<ApiCard[]>('/api/v1/admin/cards'),
    api.get<ApiBlog[]>('/api/v1/admin/blogs'),
    api.get<ApiReview[]>('/api/v1/admin/reviews'),
    api.get<ApiWaitlist[]>('/api/v1/admin/waitlist'),
    api.get<any[]>('/api/v1/admin/team'),
    api.get<any[]>('/api/v1/admin/audit-logs'),
  ]);
  if (!isApiError(cRes))  setters.setCards((cRes.data ?? []).map(fromApiCard));
  if (!isApiError(bRes))  setters.setBlogs((bRes.data ?? []).map(fromApiBlog));
  if (!isApiError(rRes))  setters.setReviews((rRes.data ?? []).map(fromApiReview));
  if (!isApiError(wRes))  setters.setWaitlist((wRes.data ?? []).map(fromApiWaitlist));
  if (!isApiError(tRes))  setters.setTeam(tRes.data ?? []);
  if (!isApiError(lRes))  setters.setLogs(lRes.data ?? []);
}

async function resolveUserStatus(
  email: string
): Promise<'none' | 'pending' | 'accepted' | 'admin' | 'rejected' | 'on-hold'> {
  if (!email) return 'none';
  try {
    const statusRes = await api.get<{
      role?: string
      status?: string
      canAccessDashboard?: boolean
    }>(`/api/v1/auth/status?email=${encodeURIComponent(email)}`, {
      skipAuth: true,
      timeoutMs: 15000,
    })
    if (!isApiError(statusRes) && statusRes.data?.status) {
      const s = statusRes.data.status
      if (s === 'admin' || s === 'accepted' || s === 'pending' || s === 'rejected' || s === 'on-hold') {
        return s
      }
      if (s === 'on_hold') return 'on-hold'
      if (s === 'none') return 'none'
    }

    // Fallback if older API without /auth/status
    const [roleRes, entryRes] = await Promise.all([
      api.get<{ role: string }>(`/api/v1/auth/role?email=${encodeURIComponent(email)}`, {
        skipAuth: true,
        timeoutMs: 12000,
      }),
      api.get<ApiWaitlist>(`/api/v1/waitlist/entry?email=${encodeURIComponent(email)}`, {
        timeoutMs: 12000,
      }),
    ]);
    if (!isApiError(roleRes) && ['admin', 'editor', 'writer', 'superadmin'].includes(roleRes.data?.role ?? '')) {
      return 'admin';
    }
    if (!isApiError(entryRes) && entryRes.data) {
      const normalized = normalizeWaitlistStatus(entryRes.data.status);
      if (normalized) return normalized;
    }
  } catch {
    // fall through
  }
  return 'none';
}

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [team, setTeam] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);

  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [currentUserStatus, setCurrentUserStatus] = useState<AppUserStatus>('loading');
  const [syncStatus, setSyncStatus] = useState<'connected' | 'reconnecting' | 'error'>('connected');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminDataLoaded, setIsAdminDataLoaded] = useState(false);
  const isInitialLoad = useRef(true);
  const publicDataLoaded = useRef(false);
  const sessionRef = useRef<Session | null>(null);
  const statusRequestId = useRef(0);

  const [ledgerTransactions, setLedgerTransactions] = useState<ParsedTransaction[]>([]);
  const [ledgerLoading, setLedgerLoading] = useState(false);
  const [ledgerError, setLedgerError] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState(0);

  const applyStatusForEmail = useCallback(async (email: string | undefined | null) => {
    const reqId = ++statusRequestId.current;
    if (!email) {
      if (reqId === statusRequestId.current) setCurrentUserStatus('none');
      return;
    }
    setCurrentUserStatus('loading');
    const status = await resolveUserStatus(email);
    if (reqId === statusRequestId.current) setCurrentUserStatus(status);
  }, []);

  const refreshUserStatus = useCallback(async () => {
    await applyStatusForEmail(sessionRef.current?.user?.email);
  }, [applyStatusForEmail]);

  const syncLedger = useCallback(async (forceSync = false) => {
    const userEmail = sessionRef.current?.user?.email;
    if (!userEmail) return;

    setLedgerLoading(true);
    setLedgerError(null);
    const cacheKey = `yureka_financial_ledger_${userEmail}`;

    if (!forceSync) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const data = JSON.parse(cached);
          if (data.transactions) {
            setLedgerTransactions(data.transactions);
            setLedgerLoading(false);
            return;
          }
        } catch (e) {
          console.error("Cache parse error:", e);
        }
      }
    }

    try {
      if (forceSync) {
        setScanProgress(15);
        const scanRes = await api.post<{ profile: any; transactions: any[] }>(
          '/api/v1/ledger/scan',
          { accessToken: sessionRef.current?.provider_token || '', email: userEmail, fallbackData: { email: userEmail } }
        );
        setScanProgress(60);
        if (!isApiError(scanRes) && scanRes.data?.transactions?.length) {
          localStorage.setItem(cacheKey, JSON.stringify(scanRes.data));
          setLedgerTransactions(scanRes.data.transactions);
        } else {
          const dbRes = await api.get<{ profile: any; transactions: any[] }>(
            `/api/v1/ledger?email=${encodeURIComponent(userEmail)}`
          );
          if (!isApiError(dbRes) && dbRes.data?.transactions) {
            localStorage.setItem(cacheKey, JSON.stringify(dbRes.data));
            setLedgerTransactions(dbRes.data.transactions);
          }
          if (isApiError(scanRes)) setLedgerError(scanRes.error ?? null);
        }
        setScanProgress(100);
      } else {
        const res = await api.get<{ profile: any; transactions: any[] }>(
          `/api/v1/ledger?email=${encodeURIComponent(userEmail)}`
        );
        if (!isApiError(res) && res.data?.transactions) {
          localStorage.setItem(cacheKey, JSON.stringify(res.data));
          setLedgerTransactions(res.data.transactions);
        }
      }
    } catch (err) {
      console.error("Ledger sync error:", err);
      setLedgerError("Failed to synchronize with email ledger.");
    } finally {
      setTimeout(() => setLedgerLoading(false), 500);
    }
  }, []);

  useEffect(() => {
    if (session?.user?.email) {
      syncLedger(false);
    }
  }, [session, syncLedger]);

  // Real Supabase Auth — replaces demo stub
  useEffect(() => {
    setAuthTokenGetter(() => sessionRef.current?.access_token ?? null);

    const sb = getSupabaseBrowser();
    if (!sb) {
      console.warn(
        supabaseConfigured
          ? 'Supabase client failed to initialize'
          : 'Supabase Auth not configured (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY). Gating will treat users as logged out.'
      );
      setUser(null);
      setSession(null);
      sessionRef.current = null;
      setCurrentUserStatus('none');
      setIsLoading(false);
      return () => setAuthTokenGetter(null);
    }

    let cancelled = false;

    const applySession = async (next: Session | null) => {
      if (cancelled) return;
      sessionRef.current = next;
      setSession(next);
      setUser(next?.user ?? null);
      await applyStatusForEmail(next?.user?.email);
    };

    sb.auth.getSession().then(({ data }) => {
      void applySession(data.session);
    });

    const { data: sub } = sb.auth.onAuthStateChange((_event, next) => {
      void applySession(next);
    });

    const onFocus = () => {
      if (sessionRef.current?.user?.email) {
        void applyStatusForEmail(sessionRef.current.user.email);
      }
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') onFocus();
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
      window.removeEventListener('focus', onFocus);
      setAuthTokenGetter(null);
    };
  }, [applyStatusForEmail]);

  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const refreshAll = useCallback(async () => {
    try {
      if (isAdminRoute) {
        await loadAdminData({ setCards, setBlogs, setReviews, setWaitlist, setTeam, setLogs });
      } else {
        const [cRes, bRes, rRes] = await Promise.all([
          api.get<ApiCard[]>('/api/v1/cms/cards', { skipAuth: true }),
          api.get<ApiBlog[]>('/api/v1/cms/blogs', { skipAuth: true }),
          api.get<ApiReview[]>('/api/v1/cms/reviews', { skipAuth: true }),
        ]);
        if (!isApiError(cRes)) {
          const c = (cRes.data ?? []).map(fromApiCard);
          setCards(c.length > 0 ? c : featuredCards);
        } else {
          setCards(featuredCards);
        }
        if (!isApiError(bRes)) {
          setBlogs((bRes.data ?? []).map(fromApiBlog));
        } else {
          setBlogs([]);
        }
        if (!isApiError(rRes)) {
          setReviews((rRes.data ?? []).map(fromApiReview));
        } else {
          setReviews([]);
        }
      }
    } catch (err) {
      console.error('Manual resync failed:', err);
      setSyncStatus('error');
    } finally {
      setIsLoading(false);
    }
  }, [isAdminRoute]);

  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      setIsLoading(false);
    }, 12000);

    const setup = async () => {
      if (isInitialLoad.current && cards.length === 0) {
        setIsLoading(true);
      }
      try {
        if (isAdminRoute) {
          await loadAdminData({ setCards, setBlogs, setReviews, setWaitlist, setTeam, setLogs });
          setIsAdminDataLoaded(true);
        } else if (!publicDataLoaded.current) {
          const [cRes, bRes, rRes] = await Promise.all([
            api.get<ApiCard[]>('/api/v1/cms/cards', { skipAuth: true }),
            api.get<ApiBlog[]>('/api/v1/cms/blogs', { skipAuth: true }),
            api.get<ApiReview[]>('/api/v1/cms/reviews', { skipAuth: true }),
          ]);

          if (!isApiError(cRes)) {
            const mapped = (cRes.data ?? []).map(fromApiCard);
            setCards(mapped.length > 0 ? mapped : featuredCards);
          } else {
            setCards(featuredCards);
          }

          if (!isApiError(bRes)) {
            const mapped = (bRes.data ?? []).map(fromApiBlog).filter(b => b.id && b.title && b.title !== 'Untitled Journal');
            setBlogs(mapped);
          } else {
            setBlogs([]);
          }

          if (!isApiError(rRes)) {
            const mapped = (rRes.data ?? []).map(fromApiReview);
            setReviews(mapped);
          } else {
            setReviews([]);
          }
        }
      } catch (err) {
        console.error("Supabase Setup Error:", err);
        setSyncStatus('error');
        setCards(prev => prev.length > 0 ? prev : featuredCards);
      } finally {
        setIsLoading(false);
        isInitialLoad.current = false;
        publicDataLoaded.current = true;
        clearTimeout(fallbackTimer);
      }
    };

    setup();

    return () => {
      clearTimeout(fallbackTimer);
    };
  }, [isAdminRoute]);

  const contextValue = useMemo(() => ({
    user,
    session,
    currentUserStatus,
    cards, blogs, reviews, waitlist, team, logs,
    syncStatus, isLoading, isAdminDataLoaded, refreshAll, refreshUserStatus,
    setCards, setBlogs, setReviews, setWaitlist, setTeam,
    ledgerTransactions, ledgerLoading, ledgerError, scanProgress, syncLedger,
  }), [
    user, session, currentUserStatus,
    cards, blogs, reviews, waitlist, team, logs,
    syncStatus, isLoading, isAdminDataLoaded, refreshAll, refreshUserStatus,
    setCards, setBlogs, setReviews, setWaitlist, setTeam,
    ledgerTransactions, ledgerLoading, ledgerError, scanProgress, syncLedger,
  ]);

  return (
    <SupabaseContext.Provider value={contextValue}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};
