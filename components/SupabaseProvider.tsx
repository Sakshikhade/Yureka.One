import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../supabase';
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
  
  const [syncStatus, setSyncStatus] = useState<'connected' | 'reconnecting' | 'error'>('connected');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminDataLoaded, setIsAdminDataLoaded] = useState(false);

  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Force a manual re-sync by triggering the standalone fetchers
  const refreshAll = useCallback(async () => {
    setIsLoading(true);
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
      setIsLoading(true);
      
      if (isAdminRoute) {
        subs.push(getCardsAdmin((data) => setCards(data)));
        await new Promise(r => setTimeout(r, 100));
        subs.push(getBlogsAdmin((data) => setBlogs(data)));
        await new Promise(r => setTimeout(r, 100));
        subs.push(getReviewsAdmin((data) => setReviews(data)));
        await new Promise(r => setTimeout(r, 100));
        subs.push(getWaitlist((data) => setWaitlist(data)));
        await new Promise(r => setTimeout(r, 100));
        subs.push(getTeamMembersAdmin((data) => setTeam(data)));
        await new Promise(r => setTimeout(r, 100));
        subs.push(getAuditLogsAdmin((data) => setLogs(data)));
        
        setIsAdminDataLoaded(true);
      } else {
        subs.push(getCards(
          (data) => { 
            setCards(data.length > 0 ? data : featuredCards); 
          },
          () => setSyncStatus('error')
        ));
        subs.push(getBlogs(
          (data) => setBlogs(data.filter(b => b.id && b.title && b.title !== 'Untitled Journal')), 
          () => setSyncStatus('error')
        ));
        subs.push(getReviews((data) => setReviews(data), () => setSyncStatus('error')));
      }
      
      setIsLoading(false);
      clearTimeout(fallbackTimer);
    };

    setup();

    return () => {
      clearTimeout(fallbackTimer);
      subs.forEach(unsub => unsub());
    };
  }, [isAdminRoute]);

  useEffect(() => {
    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (window.location.hash) {
          setTimeout(() => {
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
          }, 100);
        }
      }
    });

    const cleanHash = () => {
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    };

    if (window.location.hash && (window.location.hash.includes('access_token') || window.location.hash === '#')) {
      setTimeout(cleanHash, 500);
    }

    return () => {
      authSub.unsubscribe();
    };
  }, []);

  return (
    <SupabaseContext.Provider value={{ 
      supabase,
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
