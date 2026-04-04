import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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

interface SupabaseContextType {
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

  // Determine if we are on an admin route to trigger admin data fetching
  const isInternalAdminRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');

  const refreshAll = useCallback(async () => {
    // This can be used to manually force a full state refresh if real-time drops
    window.location.reload();
  }, []);

  useEffect(() => {
    let cardSub: () => void;
    let blogSub: () => void;
    let reviewSub: () => void;
    
    // Admin specific subs
    let adminCardSub: () => void;
    let adminBlogSub: () => void;
    let adminReviewSub: () => void;
    let waitlistSub: () => void;
    let teamSub: () => void;
    let logsSub: () => void;

    const initializePublicSubscriptions = () => {
      cardSub = getCards(
        (data) => { setCards(data.length > 0 ? data : featuredCards); setIsLoading(false); },
        () => setSyncStatus('error')
      );
      blogSub = getBlogs((data) => setBlogs(data), () => setSyncStatus('error'));
      reviewSub = getReviews((data) => setReviews(data), () => setSyncStatus('error'));
    };

    const initializeAdminSubscriptions = () => {
      if (!isInternalAdminRoute) return;
      
      setIsLoading(true);
      adminCardSub = getCardsAdmin((data) => setCards(data));
      adminBlogSub = getBlogsAdmin((data) => setBlogs(data));
      adminReviewSub = getReviewsAdmin((data) => setReviews(data));
      waitlistSub = getWaitlist((data) => setWaitlist(data));
      teamSub = getTeamMembersAdmin((data) => setTeam(data));
      logsSub = getAuditLogsAdmin((data) => setLogs(data));
      
      setIsAdminDataLoaded(true);
      setIsLoading(false);
    };

    initializePublicSubscriptions();
    if (isInternalAdminRoute) initializeAdminSubscriptions();

    return () => {
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
  }, [isInternalAdminRoute]);

  return (
    <SupabaseContext.Provider value={{ 
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
