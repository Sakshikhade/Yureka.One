import { supabase, supabaseAdmin } from '../supabase';
import { Blog, Card, WaitlistEntry, NewsletterEntry, Review } from '../types';

/**
 * Robust retry wrapper for Supabase fetches with exponential backoff.
 * Helps prevent the "hard refresh" issue by automatically recovering from transient errors.
 */
export const withRetry = async <T>(
  fn: () => Promise<{ data: T | null; error: any }>,
  retries = 3,
  delay = 1000
): Promise<T | null> => {
  try {
    const { data, error } = await fn();
    if (error) {
      // Check for specific transient errors that warrant a retry
      const isTransient = error.code === 'PGRST116' || error.message?.includes('fetch') || error.status === 502 || error.status === 503;
      if (isTransient && retries > 0) throw error;
      if (error) throw error;
    }
    return data;
  } catch (err) {
    if (retries > 0) {
      console.warn(`Supabase sync failed, retrying in ${delay}ms... (${retries} left)`, err);
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    console.error('Supabase critical sync failure:', err);
    throw err;
  }
};

// Helper for cleaning objects for Supabase (removing undefined/null)
const cleanData = (obj: any) => {
  const cleaned = { ...obj };
  Object.keys(cleaned).forEach(key => {
    if (cleaned[key] === undefined) delete cleaned[key];
    // Convert empty strings to null for date fields
    if (key === 'scheduled_at' && cleaned[key] === '') {
      cleaned[key] = null;
    }
    // Convert benefits array to Postgres format if needed
    if (key === 'benefits' && Array.isArray(cleaned[key])) {
      cleaned[key] = cleaned[key].filter((b: string) => b && b.trim() !== '');
    }
    // Handle benefit_items array of objects
    if (key === 'benefit_items' && Array.isArray(cleaned[key])) {
      cleaned[key] = cleaned[key].filter(b => b.heading?.trim() !== '');
    }
  });
  return cleaned;
};

// --- Blogs ---
export const getBlogs = (callback: (blogs: Blog[]) => void, onError?: (error: string) => void) => {
  const fetchBlogs = async () => {
    try {
      const now = new Date().toISOString();
      const data = await withRetry<Blog[]>(() => 
        Promise.resolve(supabase
          .from('blogs')
          .select('*')
          .eq('status', 'published')
          .or(`scheduled_at.is.null,scheduled_at.lte.${now}`)
          .order('created_at', { ascending: false }))
      );
      callback(data || []);
    } catch (error: any) {
      console.error('Error fetching blogs:', error);
      if (onError) onError(error.message || 'Failed to sync blogs archive.');
    }
  };
  fetchBlogs();
  
  const channelId = `blogs-public-${Math.random().toString(36).substring(2, 11)}`;
  const channel = supabase.channel(channelId)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'blogs' }, () => fetchBlogs())
    .subscribe((status) => {
        if (status === 'CHANNEL_ERROR' && onError) onError('Real-time connection interrupted.');
    });
    
  return () => { supabase.removeChannel(channel); };
};

export const getBlogsAdmin = (callback: (blogs: Blog[]) => void, onError?: (error: string) => void) => {
  const fetchBlogs = async () => {
    try {
      const data = await withRetry<Blog[]>(() => 
        Promise.resolve(supabase
          .from('blogs')
          .select('*')
          .order('created_at', { ascending: false }))
      );
      callback(data || []);
    } catch (error: any) {
      console.error('Error fetching blogs admin:', error);
      if (onError) onError(error.message || 'Failed to sync admin blogs.');
    }
  };
  fetchBlogs();
  
  const channelId = `blogs-admin-${Math.random().toString(36).substring(2, 11)}`;
  const channel = supabase.channel(channelId)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'blogs' }, () => fetchBlogs())
    .subscribe();
    
  return () => { supabase.removeChannel(channel); };
};

export const addBlog = async (blog: any) => {
  return await withRetry(async () => {
    const { data, error } = await supabase.from('blogs').insert([cleanData(blog)]).select();
    if (error) return { data: null, error };
    return { data: data[0].id, error: null };
  });
};

export const updateBlog = async (id: string, blogData: any) => {
  const { error } = await supabase.from('blogs').update(cleanData(blogData)).eq('id', id);
  if (error) throw error;
};

export const getBlogBySlug = async (slug: string): Promise<Blog | null> => {
  try {
    const { data, error } = await supabase.from('blogs').select('*').eq('slug', slug).single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('getBlogBySlug Error:', error);
    return null;
  }
};

export const deleteBlog = async (id: string) => {
  const { error } = await supabase.from('blogs').delete().eq('id', id);
  if (error) throw error;
};

// --- Cards ---
export const getCardsAdmin = (callback: (cards: Card[]) => void, onError?: (error: string) => void) => {
  const fetchCards = async () => {
    try {
      const data = await withRetry<Card[]>(() => 
        Promise.resolve(supabase
          .from('cards')
          .select('*')
          .order('created_at', { ascending: false }))
      );
      callback(data || []);
    } catch (error: any) {
      console.error('Error fetching cards admin:', error);
      if (onError) onError(error.message || 'Failed to sync admin repository.');
    }
  };
  fetchCards();
  
  const channelId = `cards-admin-${Math.random().toString(36).substring(2, 11)}`;
  const channel = supabase.channel(channelId)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'cards' }, () => fetchCards())
    .subscribe();
    
  return () => { supabase.removeChannel(channel); };
};

export const getCards = (callback: (cards: Card[]) => void, onError?: (error: string) => void) => {
  const fetchCards = async () => {
    try {
      const data = await withRetry<Card[]>(() => 
        Promise.resolve(supabase
          .from('cards')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false }))
      );
      callback(data || []);
    } catch (error: any) {
      console.error('Error fetching cards public:', error);
      if (onError) onError(error.message || 'Failed to sync card matrix.');
    }
  };
  fetchCards();
  
  const channelId = `cards-public-${Math.random().toString(36).substring(2, 11)}`;
  const channel = supabase.channel(channelId)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'cards' }, () => fetchCards())
    .subscribe();
    
  return () => { supabase.removeChannel(channel); };
};

export const addCard = async (card: any) => {
  return await withRetry(async () => {
    const { data, error } = await supabase.from('cards').insert([cleanData(card)]).select();
    if (error) return { data: null, error };
    return { data: data[0].id, error: null };
  });
};

export const updateCard = async (id: string, cardData: any) => {
  const { error } = await supabase.from('cards').update(cleanData(cardData)).eq('id', id);
  if (error) throw error;
};

export const getCardById = async (id: string): Promise<Card | null> => {
  try {
    const { data, error } = await supabase.from('cards').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('getCardById Error:', error);
    return null;
  }
};

export const getCardBySlug = async (slugOrId: string): Promise<Card | null> => {
  try {
    let result = await supabase.from('cards').select('*').eq('slug', slugOrId).single();
    if (!result.error && result.data) return result.data;
    
    result = await supabase.from('cards').select('*').eq('id', slugOrId).single();
    if (result.error) throw result.error;
    return result.data;
  } catch (error) {
    console.error('getCardBySlug Error:', error);
    return null;
  }
};

export const deleteCard = async (id: string) => {
  const { error } = await supabase.from('cards').delete().eq('id', id);
  if (error) throw error;
};

// --- Waitlist ---
export const getWaitlist = (callback: (entries: WaitlistEntry[]) => void) => {
  const fetchWaitlist = async () => {
    try {
      const data = await withRetry<WaitlistEntry[]>(() => 
        Promise.resolve(supabase
          .from('waitlist')
          .select('*')
          .order('created_at', { ascending: false }))
      );
      callback(data || []);
    } catch (error) {
      console.error('Error fetching waitlist:', error);
    }
  };
  fetchWaitlist();
  
  const channelId = `waitlist-realtime-${Math.random().toString(36).substring(2, 11)}`;
  const channel = supabase.channel(channelId)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'waitlist' }, () => fetchWaitlist())
    .subscribe();
    
  return () => { supabase.removeChannel(channel); };
};

export const joinWaitlist = async (entry: any) => {
  const dataToInsert = { ...cleanData(entry), status: entry.status || 'pending' };
  const { data, error } = await supabase.from('waitlist').insert([dataToInsert]).select();
  if (error) throw error;
  return data[0].id;
};

export const updateWaitlistStatus = async (id: string, status: 'accepted' | 'rejected' | 'on_hold' | 'pending') => {
  const { error } = await supabase.from('waitlist').update({ status }).eq('id', id);
  if (error) throw error;
};

export const deleteWaitlistEntry = async (id: string) => {
  const { error } = await supabase.from('waitlist').delete().eq('id', id);
  if (error) throw error;
};

// --- Newsletters ---
export const getNewsletters = (callback: (entries: NewsletterEntry[]) => void) => {
  const fetchNewsletters = async () => {
    try {
      const data = await withRetry<NewsletterEntry[]>(() => 
        Promise.resolve(supabase
          .from('newsletters')
          .select('*')
          .order('created_at', { ascending: false }))
      );
      callback(data || []);
    } catch (error) {
      console.error('Error fetching newsletters:', error);
    }
  };
  fetchNewsletters();
  
  const channelId = `newsletters-realtime-${Math.random().toString(36).substring(2, 11)}`;
  const channel = supabase.channel(channelId)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'newsletters' }, () => fetchNewsletters())
    .subscribe();
    
  return () => { supabase.removeChannel(channel); };
};

export const subscribeNewsletter = async (email: string) => {
  const { data, error } = await supabase.from('newsletters').insert([{ email, status: 'active' }]).select();
  if (error) throw error;
  return data[0].id;
};

export const deleteNewsletterEntry = async (id: string) => {
  const { error } = await supabase.from('newsletters').delete().eq('id', id);
  if (error) throw error;
};

// --- Reviews ---
export const getReviews = (callback: (reviews: Review[]) => void, onError?: (error: string) => void) => {
  const fetchReviews = async () => {
    try {
      const data = await withRetry<Review[]>(() => 
        Promise.resolve(supabase
          .from('reviews')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false }))
      );
      callback(data || []);
    } catch (error: any) {
      console.error('Error fetching reviews:', error);
      if (onError) onError(error.message || 'Failed to sync community reviews.');
    }
  };
  fetchReviews();
  
  const channelId = `reviews-public-${Math.random().toString(36).substring(2, 11)}`;
  const channel = supabase.channel(channelId)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, () => fetchReviews())
    .subscribe();
    
  return () => { supabase.removeChannel(channel); };
};

export const getReviewsAdmin = (callback: (reviews: Review[]) => void, onError?: (error: string) => void) => {
  const fetchReviews = async () => {
    try {
      const data = await withRetry<Review[]>(() => 
        Promise.resolve(supabase
          .from('reviews')
          .select('*')
          .order('created_at', { ascending: false }))
      );
      callback(data || []);
    } catch (error: any) {
      console.error('Error fetching reviews admin:', error);
      if (onError) onError(error.message || 'Failed to sync admin reviews.');
    }
  };
  fetchReviews();
  
  const channelId = `reviews-admin-${Math.random().toString(36).substring(2, 11)}`;
  const channel = supabase.channel(channelId)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, () => fetchReviews())
    .subscribe();
    
  return () => { supabase.removeChannel(channel); };
};

export const addReview = async (review: any) => {
  return await withRetry(async () => {
    const { data, error } = await supabase.from('reviews').insert([cleanData(review)]).select();
    if (error) return { data: null, error };
    return { data: data[0].id, error: null };
  });
};

export const updateReview = async (id: string, reviewData: any) => {
  const { error } = await supabase.from('reviews').update(cleanData(reviewData)).eq('id', id);
  if (error) throw error;
};

export const deleteReview = async (id: string) => {
  const { error } = await supabase.from('reviews').delete().eq('id', id);
  if (error) throw error;
};

// --- Admin Check ---
export const checkIfAdmin = async (userId: string | undefined, userEmail: string | undefined) => {
  if (userEmail === "toanweshbiswas@gmail.com") return true;
  if (!userEmail) return false;
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('email', userEmail)
      .single();
    
    if (error || !data) return false;
    return ['admin', 'editor', 'writer'].includes(data.role);
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// --- Team Management ---
export const getTeamMembers = async (): Promise<any[]> => {
  const data = await withRetry<any[]>(() => 
    Promise.resolve(supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false }))
  );
  return data || [];
};

export const inviteTeamMember = async (email: string, role: string) => {
  return await withRetry(async () => {
    const { data, error } = await supabase
      .from('users')
      .insert([{ email, role, full_name: email.split('@')[0] }])
      .select();
    if (error) return { data: null, error };
    return { data: data[0], error: null };
  });
};

export const updateUserRole = async (userId: string, role: string) => {
  const { error } = await supabase
    .from('users')
    .update({ role })
    .eq('id', userId);
  if (error) throw error;
};

export const deleteUser = async (userId: string) => {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', userId);
  if (error) throw error;
};

export const getTeamMembersAdmin = (callback: (members: any[]) => void, onError?: (error: string) => void) => {
  const fetchTeam = async () => {
    try {
      const data = await withRetry<any[]>(() => 
        Promise.resolve(supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false }))
      );
      callback(data || []);
    } catch (error: any) {
      console.error('Error fetching team admin:', error);
      if (onError) onError(error.message || 'Failed to sync team registry.');
    }
  };
  fetchTeam();
  
  const channelId = `team-admin-${Math.random().toString(36).substring(2, 11)}`;
  const channel = supabase.channel(channelId)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => fetchTeam())
    .subscribe();
    
  return () => { supabase.removeChannel(channel); };
};

// --- Audit Logs ---
export const getAuditLogs = async (): Promise<any[]> => {
  const data = await withRetry<any[]>(() => 
    Promise.resolve(supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100))
  );
  return data || [];
};

export const getAuditLogsAdmin = (callback: (logs: any[]) => void, onError?: (error: string) => void) => {
  const fetchLogs = async () => {
    try {
      const data = await withRetry<any[]>(() => 
        Promise.resolve(supabase
          .from('audit_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100))
      );
      callback(data || []);
    } catch (error: any) {
      console.error('Error fetching audit logs admin:', error);
      if (onError) onError(error.message || 'Failed to sync activity logs.');
    }
  };
  fetchLogs();
  
  const channelId = `logs-admin-${Math.random().toString(36).substring(2, 11)}`;
  const channel = supabase.channel(channelId)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'audit_logs' }, () => fetchLogs())
    .subscribe();
    
  return () => { supabase.removeChannel(channel); };
};
