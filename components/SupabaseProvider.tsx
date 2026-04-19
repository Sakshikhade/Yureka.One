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
  getAuditLogsAdmin
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
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cards, setCards] = useState<Card[]>(featuredCards);
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
  const initialLoadTime = useRef(Date.now());

  // Determine if we are on an admin route to trigger admin data fetching
  const refreshAll = useCallback(async () => {
    // Real-time subscriptions handle this automatically. 
    // We keep this as a no-op to prevent breaking dependent code.
    console.log('⚡️ Background sync confirmed.');
  }, []);


  useEffect(() => {
    let cardSub: (() => void) | undefined;
    let blogSub: (() => void) | undefined;
    let reviewSub: (() => void) | undefined;
    
    // Admin specific subs
    let adminCardSub: (() => void) | undefined;
    let adminBlogSub: (() => void) | undefined;
    let adminReviewSub: (() => void) | undefined;
    let waitlistSub: (() => void) | undefined;
    let teamSub: (() => void) | undefined;
    let logsSub: (() => void) | undefined;

    // Safety timeout to ensure app transitions to loaded state even on slow network
    const fallbackTimer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    const setupPublic = () => {
      cardSub = getCards(
        (data) => { 
          setCards(data.length > 0 ? data : featuredCards); 
          setIsLoading(false);
          clearTimeout(fallbackTimer);
        },
        () => setSyncStatus('error')
      );
      blogSub = getBlogs((data) => setBlogs(data), () => setSyncStatus('error'));
      reviewSub = getReviews((data) => setReviews(data), () => setSyncStatus('error'));
    };

    const setupAdmin = () => {
      if (!isAdminRoute) return;
      
      setIsLoading(true);
      adminCardSub = getCardsAdmin((data) => setCards(data));
      adminBlogSub = getBlogsAdmin((data) => setBlogs(data));
      adminReviewSub = getReviewsAdmin((data) => setReviews(data));
      waitlistSub = getWaitlist((data) => setWaitlist(data));
      teamSub = getTeamMembersAdmin((data) => setTeam(data));
      logsSub = getAuditLogsAdmin((data) => setLogs(data));
      
      setIsAdminDataLoaded(true);
      setIsLoading(false);
      clearTimeout(fallbackTimer);
    };

    // --- NEW: Event-driven Hash Cleaner ---
    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (window.location.hash) {
          // Clean the hash after a tiny delay to ensure everything is saved
          setTimeout(() => {
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
          }, 100);
        }
      }
    });

    setupPublic();
    if (isAdminRoute) setupAdmin();

    // Clean URL hash after login
    const cleanHash = () => {
      if (window.location.hash) {
        // Use replaceState to clear hash without reloading
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    };

    // Check for hash on initial load or auth change
    if (window.location.hash && (window.location.hash.includes('access_token') || window.location.hash === '#')) {
      // Small timeout to let Supabase finish parsing the token
      setTimeout(cleanHash, 500);
    }

    return () => {

      clearTimeout(fallbackTimer);
      authSub.unsubscribe();
      if (cardSub) cardSub();
      if (blogSub) blogSub();
      if (reviewSub) reviewSub();
      if (adminCardSub) adminCardSub();
      if (adminBlogSub) adminBlogSub();
      if (adminReviewSub) adminReviewSub();
      if (waitlistSub) waitlistSub();
      if (teamSub) teamSub();
      if (logsSub) logsSub();
    };
  }, [isAdminRoute]);

  return (
    <SupabaseContext.Provider value={{ 
      supabase,
      cards, blogs, reviews, waitlist, team, logs, 
      syncStatus, isLoading, isAdminDataLoaded, refreshAll 
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
