import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, Blog, Review, WaitlistEntry } from '../types';
import { featuredCards } from '../data';
import { api, isApiError } from '../lib/api/client';
import { fromApiCard, fromApiBlog, fromApiReview, fromApiWaitlist } from '../lib/api/mappers';
import type { Card as ApiCard, Blog as ApiBlog, Review as ApiReview, Waitlist as ApiWaitlist } from '../lib/api/types';

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
  user: any | null;
  session: any | null;
  currentUserStatus: 'none' | 'pending' | 'accepted' | 'admin' | 'loading' | 'rejected' | 'on-hold';
  syncStatus: 'connected' | 'reconnecting' | 'error';
  isLoading: boolean;
  isAdminDataLoaded: boolean;
  refreshAll: () => Promise<void>;
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
  setBlogs: React.Dispatch<React.SetStateAction<Blog[]>>;
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
  setWaitlist: React.Dispatch<React.SetStateAction<WaitlistEntry[]>>;
  setTeam: React.Dispatch<React.SetStateAction<any[]>>;

  // Ledger Integration
  ledgerTransactions: ParsedTransaction[];
  ledgerLoading: boolean;
  ledgerError: string | null;
  scanProgress: number;
  syncLedger: (forceSync?: boolean) => Promise<void>;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

// Fetches all admin data from the Java API in parallel and updates state.
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

// Resolves currentUserStatus for a given email using the Java API.
// Checks role first (admin/editor/writer → 'admin'), then waitlist status.
async function resolveUserStatus(
  email: string
): Promise<'none' | 'pending' | 'accepted' | 'admin' | 'rejected' | 'on-hold'> {
  if (!email) return 'none';
  try {
    // Fire both checks in parallel — saves one full RTT for non-admin users
    const [roleRes, entryRes] = await Promise.all([
      api.get<{ role: string }>(`/api/v1/auth/role?email=${encodeURIComponent(email)}`, { skipAuth: true }),
      api.get<ApiWaitlist>(`/api/v1/waitlist/entry?email=${encodeURIComponent(email)}`),
    ]);
    if (!isApiError(roleRes) && ['admin', 'editor', 'writer'].includes(roleRes.data?.role ?? '')) {
      return 'admin';
    }
    if (!isApiError(entryRes) && entryRes.data) {
      const s = entryRes.data.status;
      return (s === 'on_hold' ? 'on-hold' : s) as ReturnType<typeof resolveUserStatus> extends Promise<infer R> ? R : never;
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

  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [currentUserStatus, setCurrentUserStatus] = useState<'none' | 'pending' | 'accepted' | 'admin' | 'loading' | 'rejected' | 'on-hold'>('loading');
  const [syncStatus, setSyncStatus] = useState<'connected' | 'reconnecting' | 'error'>('connected');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminDataLoaded, setIsAdminDataLoaded] = useState(false);
  const isInitialLoad = useRef(true);
  const publicDataLoaded = useRef(false);

  // Financial Ledger State
  const [ledgerTransactions, setLedgerTransactions] = useState<ParsedTransaction[]>([]);
  const [ledgerLoading, setLedgerLoading] = useState(false);
  const [ledgerError, setLedgerError] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState(0);

  const syncLedger = useCallback(async (forceSync = false) => {
    const userEmail = session?.user?.email;
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
          { accessToken: session?.provider_token || '', email: userEmail, fallbackData: { email: userEmail } }
        );
        setScanProgress(60);
        if (!isApiError(scanRes) && scanRes.data?.transactions?.length) {
          localStorage.setItem(cacheKey, JSON.stringify(scanRes.data));
          setLedgerTransactions(scanRes.data.transactions);
        } else {
          // Scanner returned 0 items — fall back to DB read
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
  }, [session]);

  useEffect(() => {
    if (session?.user?.email) {
      syncLedger(false);
    }
  }, [session, syncLedger]);

  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Force a manual re-sync by triggering the standalone fetchers
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
    let subs: Array<() => void> = [];
    
    const fallbackTimer = setTimeout(() => {
      setIsLoading(false);
    }, 12000);

    const setup = async () => {
      // Only set loading if this is the absolute first mount and we have no data
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

          // Cards — fall back to the static hardcoded set if the API is unavailable
          if (!isApiError(cRes)) {
            const mapped = (cRes.data ?? []).map(fromApiCard);
            setCards(mapped.length > 0 ? mapped : featuredCards);
          } else {
            setCards(featuredCards);
          }

          // Blogs
          if (!isApiError(bRes)) {
            const mapped = (bRes.data ?? []).map(fromApiBlog).filter(b => b.id && b.title && b.title !== 'Untitled Journal');
            setBlogs(mapped);
          } else {
            setBlogs([]);
          }

          // Reviews
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
        // Ensure cards are never left empty — always fall back to the static set
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
      subs.forEach(unsub => unsub());
    };
  }, [isAdminRoute]);

  // Auth removed — the app runs unauthenticated (no Supabase session).
  useEffect(() => {
    setCurrentUserStatus('none');
  }, []);

  const contextValue = useMemo(() => ({
    user,
    session,
    currentUserStatus,
    cards, blogs, reviews, waitlist, team, logs,
    syncStatus, isLoading, isAdminDataLoaded, refreshAll,
    setCards, setBlogs, setReviews, setWaitlist, setTeam,
    ledgerTransactions, ledgerLoading, ledgerError, scanProgress, syncLedger,
  }), [
    user, session, currentUserStatus,
    cards, blogs, reviews, waitlist, team, logs,
    syncStatus, isLoading, isAdminDataLoaded, refreshAll,
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
