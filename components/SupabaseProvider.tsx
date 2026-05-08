import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase, supabaseAdmin } from '../supabase';
import { Card, Blog, Review, WaitlistEntry } from '../types';
import { featuredCards } from '../data';
import { 
  getCards, 
  getBlogs, 
  getReviews, 
  getCardsAdmin, 
  getBlogsAdmin, 
  getReviewsAdmin,
  getWaitlist,
  getTeamMembersAdmin,
  getAuditLogsAdmin,
  fetchCardsPublic,
  fetchBlogsPublic,
  fetchReviewsPublic,
  fetchCardsAdmin,
  fetchBlogsAdmin,
  fetchReviewsAdmin,
  fetchWaitlist,
  fetchTeamMembersAdmin,
  fetchAuditLogsAdmin
} from '../services/supabaseService';
import { SupabaseClient } from '@supabase/supabase-js';

interface SupabaseContextType {
  supabase: SupabaseClient;
  cards: Card[];
  blogs: Blog[];
  reviews: Review[];
  waitlist: WaitlistEntry[];
  team: any[];
  logs: any[];
  user: any | null;
  session: any | null;
  currentUserStatus: 'none' | 'pending' | 'accepted' | 'admin' | 'loading';
  syncStatus: 'connected' | 'reconnecting' | 'error';
  isLoading: boolean;
  isAdminDataLoaded: boolean;
  refreshAll: () => Promise<void>;
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
  setBlogs: React.Dispatch<React.SetStateAction<Blog[]>>;
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
  setWaitlist: React.Dispatch<React.SetStateAction<WaitlistEntry[]>>;
  setTeam: React.Dispatch<React.SetStateAction<any[]>>;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [team, setTeam] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  
  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [currentUserStatus, setCurrentUserStatus] = useState<'none' | 'pending' | 'accepted' | 'admin' | 'loading'>('loading');
  const [syncStatus, setSyncStatus] = useState<'connected' | 'reconnecting' | 'error'>('connected');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminDataLoaded, setIsAdminDataLoaded] = useState(false);
  const isInitialLoad = useRef(true);

  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Force a manual re-sync by triggering the standalone fetchers
  const refreshAll = useCallback(async () => {
    try {
      if (isAdminRoute) {
        const [c, b, r, w, t, l] = await Promise.all([
          fetchCardsAdmin(),
          fetchBlogsAdmin(),
          fetchReviewsAdmin(),
          fetchWaitlist(),
          fetchTeamMembersAdmin(),
          fetchAuditLogsAdmin()
        ]);
        setCards(c || []);
        setBlogs(b || []);
        setReviews(r || []);
        setWaitlist(w || []);
        setTeam(t || []);
        setLogs(l || []);
      } else {
        const [c, b, r] = await Promise.all([
          fetchCardsPublic(),
          fetchBlogsPublic(),
          fetchReviewsPublic()
        ]);
        setCards((c && c.length > 0) ? c : featuredCards);
        setBlogs(b || []);
        setReviews(r || []);
      }
      console.log('⚡️ Manual Cloud Resync Complete.');
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
    }, 8000);

    const setup = async () => {
      console.log('⚡️ SupabaseProvider setup initiated');
      // Only set loading if this is the absolute first mount and we have no data
      if (isInitialLoad.current && cards.length === 0) {
        setIsLoading(true);
      }
      try {
        if (isAdminRoute) {
          console.log('⚡️ Admin route detected. Fetching session...');
          // Check for session before attempting admin fetches
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            console.log('⚡️ Admin session found. Initiating fetches...');
            subs.push(getCardsAdmin((data) => { console.log('⚡️ Admin cards loaded'); setCards(data); }));
            await new Promise(r => setTimeout(r, 100));
            subs.push(getBlogsAdmin((data) => { console.log('⚡️ Admin blogs loaded'); setBlogs(data); }));
            await new Promise(r => setTimeout(r, 100));
            subs.push(getReviewsAdmin((data) => { console.log('⚡️ Admin reviews loaded'); setReviews(data); }));
            await new Promise(r => setTimeout(r, 100));
            subs.push(getWaitlist((data) => { console.log('⚡️ Admin waitlist loaded'); setWaitlist(data); }));
            await new Promise(r => setTimeout(r, 100));
            subs.push(getTeamMembersAdmin((data) => { console.log('⚡️ Admin team loaded'); setTeam(data); }));
            await new Promise(r => setTimeout(r, 100));
            subs.push(getAuditLogsAdmin((data) => { console.log('⚡️ Admin logs loaded'); setLogs(data); }));
            setIsAdminDataLoaded(true);
            console.log('⚡️ Admin fetches complete.');
          } else {
            console.log('⚡️ No admin session found.');
          }
        } else {
          console.log('⚡️ Public route detected. Initiating public fetches...');
          subs.push(getCards(
            (data) => { 
              console.log('⚡️ Public cards loaded', data?.length);
              setCards(data.length > 0 ? data : featuredCards); 
            },
            (err) => {
              console.error('⚡️ Public cards fetch failed', err);
              setSyncStatus('error');
            }
          ));
          subs.push(getBlogs(
            (data) => {
              console.log('⚡️ Public blogs loaded', data?.length);
              setBlogs(data.filter(b => b.id && b.title && b.title !== 'Untitled Journal'));
            }, 
            (err) => {
              console.error('⚡️ Public blogs fetch failed', err);
              setSyncStatus('error');
            }
          ));
          subs.push(getReviews(
            (data) => {
              console.log('⚡️ Public reviews loaded', data?.length);
              setReviews(data);
            }, 
            (err) => {
              console.error('⚡️ Public reviews fetch failed', err);
              setSyncStatus('error');
            }
          ));
        }
      } catch (err) {
        console.error("Supabase Setup Error:", err);
        setSyncStatus('error');
      } finally {
        console.log('⚡️ SupabaseProvider setup complete.');
        setIsLoading(false);
        isInitialLoad.current = false;
        clearTimeout(fallbackTimer);
      }
    };

    setup();

    return () => {
      clearTimeout(fallbackTimer);
      subs.forEach(unsub => unsub());
    };
  }, [isAdminRoute]);

  useEffect(() => {
    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      const currentUser = session?.user || null;
      setUser(currentUser);
      
      if (currentUser) {
        try {
          const normalizedEmail = currentUser.email?.toLowerCase().trim() || '';
          const { data: teamMember } = await supabaseAdmin.from('users').select('role').eq('email', normalizedEmail).maybeSingle();
          if (teamMember) {
            setCurrentUserStatus('admin');
          } else {
            const { data: waitlist } = await supabaseAdmin.from('waitlist').select('status').eq('email', normalizedEmail).maybeSingle();
            if (waitlist) {
              setCurrentUserStatus(waitlist.status as any);
            } else {
              setCurrentUserStatus('none');
            }
          }
        } catch (err) {
          setCurrentUserStatus('none');
        }
      } else {
        setCurrentUserStatus('none');
      }
      
      if (_event === 'SIGNED_IN') {
        refreshAll();
      }
    });

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      const currentUser = session?.user || null;
      setUser(currentUser);
      if (currentUser) {
        try {
          const normalizedEmail = currentUser.email?.toLowerCase().trim() || '';
          const { data: teamMember } = await supabaseAdmin.from('users').select('role').eq('email', normalizedEmail).maybeSingle();
          if (teamMember) {
            setCurrentUserStatus('admin');
          } else {
            const { data: waitlist } = await supabaseAdmin.from('waitlist').select('status').eq('email', normalizedEmail).maybeSingle();
            if (waitlist) {
              setCurrentUserStatus(waitlist.status as any);
            } else {
              setCurrentUserStatus('none');
            }
          }
        } catch (err) {
          setCurrentUserStatus('none');
        }
      } else {
        setCurrentUserStatus('none');
      }
    });

    return () => authSub.unsubscribe();
  }, []);

  return (
    <SupabaseContext.Provider value={{ 
      supabase,
      user,
      session,
      currentUserStatus,
      cards, blogs, reviews, waitlist, team, logs, 
      syncStatus, isLoading, isAdminDataLoaded, refreshAll,
      setCards, setBlogs, setReviews, setWaitlist, setTeam
    }}>
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
