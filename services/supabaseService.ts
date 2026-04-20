import { supabase, supabaseAdmin } from '../supabase';
import { Blog, Card, WaitlistEntry, NewsletterEntry, Review } from '../types';

/**
 * Robust retry wrapper for Supabase fetches with exponential backoff.
 */
export const withRetry = async <T>(
  fn: () => Promise<{ data: T | null; error: any }>,
  retries = 3,
  delay = 1000
): Promise<T | null> => {
  try {
    const { data, error } = await fn();
    if (error) {
      const isTransient = error.code === 'PGRST116' || error.message?.includes('fetch') || error.status === 502 || error.status === 503;
      if (isTransient && retries > 0) throw error;
      if (error) throw error;
    }
    return data;
  } catch (err) {
    if (retries > 0) {
      console.warn(`Supabase sync failed, retrying in ${delay}ms...`, err);
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw err;
  }
};

export const cleanData = (obj: any) => {
  const cleaned = { ...obj };
  Object.keys(cleaned).forEach(key => {
    if (cleaned[key] === undefined) delete cleaned[key];
    if (key === 'scheduled_at' && cleaned[key] === '') cleaned[key] = null;
    if (key === 'benefits' && Array.isArray(cleaned[key])) {
      cleaned[key] = cleaned[key].filter((b: string) => b && typeof b === 'string' && b.trim() !== '');
    }
    if (key === 'benefit_items' && Array.isArray(cleaned[key])) {
      cleaned[key] = cleaned[key].filter(b => b && b.heading?.trim() !== '');
    }
  });
  return cleaned;
};

// --- PUBLIC FETCHERS ---
export const fetchBlogsPublic = async () => {
  const now = new Date().toISOString();
  return await withRetry<Blog[]>(() => supabase.from('blogs').select('*').eq('status', 'published').or(`scheduled_at.is.null,scheduled_at.lte.${now}`).order('created_at', { ascending: false }));
};

export const fetchCardsPublic = async () => {
  return await withRetry<Card[]>(() => supabase.from('cards').select('*').eq('status', 'published').order('created_at', { ascending: false }));
};

export const fetchReviewsPublic = async () => {
  return await withRetry<Review[]>(() => supabase.from('reviews').select('*').eq('status', 'published').order('created_at', { ascending: false }));
};

// --- ADMIN FETCHERS (Using supabaseAdmin to bypass RLS) ---
export const fetchBlogsAdmin = async () => {
  return await withRetry<Blog[]>(() => supabaseAdmin.from('blogs').select('*').order('created_at', { ascending: false }));
};

export const fetchCardsAdmin = async () => {
  return await withRetry<Card[]>(() => supabaseAdmin.from('cards').select('*').order('created_at', { ascending: false }));
};

export const fetchReviewsAdmin = async () => {
  return await withRetry<Review[]>(() => supabaseAdmin.from('reviews').select('*').order('created_at', { ascending: false }));
};

export const fetchWaitlist = async () => {
  return await withRetry<WaitlistEntry[]>(() => supabaseAdmin.from('waitlist').select('*').order('created_at', { ascending: false }));
};

export const fetchTeamMembersAdmin = async () => {
  return await withRetry<any[]>(() => supabaseAdmin.from('users').select('*').order('created_at', { ascending: false }));
};

export const fetchAuditLogsAdmin = async () => {
  return await withRetry<any[]>(() => supabaseAdmin.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(100));
};

// --- REALTIME LISTENERS (PUBLIC) ---
export const getBlogs = (callback: (blogs: Blog[]) => void, onError?: (error: string) => void) => {
  const execute = async () => { 
    try { const data = await fetchBlogsPublic(); callback(data || []); } catch (err: any) { if (onError) onError(err.message); }
  };
  execute();
  const sub = supabase.channel('blogs-public').on('postgres_changes', { event: '*', schema: 'public', table: 'blogs' }, () => execute()).subscribe();
  return () => { sub.unsubscribe(); };
};

export const getCards = (callback: (cards: Card[]) => void, onError?: (error: string) => void) => {
  const execute = async () => { 
    try { const data = await fetchCardsPublic(); callback(data || []); } catch (err: any) { if (onError) onError(err.message); }
  };
  execute();
  const sub = supabase.channel('cards-public').on('postgres_changes', { event: '*', schema: 'public', table: 'cards' }, () => execute()).subscribe();
  return () => { sub.unsubscribe(); };
};

export const getReviews = (callback: (reviews: Review[]) => void, onError?: (error: string) => void) => {
  const execute = async () => { 
    try { const data = await fetchReviewsPublic(); callback(data || []); } catch (err: any) { if (onError) onError(err.message); }
  };
  execute();
  const sub = supabase.channel('reviews-public').on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, () => execute()).subscribe();
  return () => { sub.unsubscribe(); };
};

// --- REALTIME LISTENERS (ADMIN) ---
export const getBlogsAdmin = (callback: (blogs: Blog[]) => void, onError?: (error: string) => void) => {
  const execute = async () => { 
    try { const data = await fetchBlogsAdmin(); callback(data || []); } catch (err: any) { if (onError) onError(err.message); }
  };
  execute();
  const sub = supabaseAdmin.channel('blogs-admin').on('postgres_changes', { event: '*', schema: 'public', table: 'blogs' }, () => execute()).subscribe();
  return () => { sub.unsubscribe(); };
};

export const getCardsAdmin = (callback: (cards: Card[]) => void, onError?: (error: string) => void) => {
  const execute = async () => { 
    try { const data = await fetchCardsAdmin(); callback(data || []); } catch (err: any) { if (onError) onError(err.message); }
  };
  execute();
  const sub = supabaseAdmin.channel('cards-admin').on('postgres_changes', { event: '*', schema: 'public', table: 'cards' }, () => execute()).subscribe();
  return () => { sub.unsubscribe(); };
};

export const getReviewsAdmin = (callback: (reviews: Review[]) => void, onError?: (error: string) => void) => {
  const execute = async () => { 
    try { const data = await fetchReviewsAdmin(); callback(data || []); } catch (err: any) { if (onError) onError(err.message); }
  };
  execute();
  const sub = supabaseAdmin.channel('reviews-admin').on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, () => execute()).subscribe();
  return () => { sub.unsubscribe(); };
};

export const getWaitlist = (callback: (entries: WaitlistEntry[]) => void) => {
  const execute = async () => { const data = await fetchWaitlist(); callback(data || []); };
  execute();
  const sub = supabaseAdmin.channel('waitlist-admin').on('postgres_changes', { event: '*', schema: 'public', table: 'waitlist' }, () => execute()).subscribe();
  return () => { sub.unsubscribe(); };
};

export const getTeamMembersAdmin = (callback: (members: any[]) => void) => {
  const execute = async () => { const data = await fetchTeamMembersAdmin(); callback(data || []); };
  execute();
  const sub = supabaseAdmin.channel('team-admin').on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => execute()).subscribe();
  return () => { sub.unsubscribe(); };
};

export const getAuditLogsAdmin = (callback: (logs: any[]) => void) => {
  const execute = async () => { const data = await fetchAuditLogsAdmin(); callback(data || []); };
  execute();
  const sub = supabaseAdmin.channel('logs-admin').on('postgres_changes', { event: '*', schema: 'public', table: 'audit_logs' }, () => execute()).subscribe();
  return () => { sub.unsubscribe(); };
};

// --- MUTATIONS (Using supabaseAdmin to bypass RLS) ---
export const addBlog = async (blog: any) => {
  const { data, error } = await supabaseAdmin.from('blogs').insert([cleanData(blog)]).select();
  if (error) throw error;
  return data[0];
};

export const updateBlog = async (id: string, blogData: any) => {
  const { error } = await supabaseAdmin.from('blogs').update(cleanData(blogData)).eq('id', id);
  if (error) throw error;
};

export const deleteBlog = async (id: string) => {
  const { error } = await supabaseAdmin.from('blogs').delete().eq('id', id);
  if (error) throw error;
};

export const addCard = async (card: any) => {
  const { data, error } = await supabaseAdmin.from('cards').insert([cleanData(card)]).select();
  if (error) throw error;
  return data[0];
};

export const updateCard = async (id: string, cardData: any) => {
  const { error } = await supabaseAdmin.from('cards').update(cleanData(cardData)).eq('id', id);
  if (error) throw error;
};

export const deleteCard = async (id: string) => {
  const { error } = await supabaseAdmin.from('cards').delete().eq('id', id);
  if (error) throw error;
};

export const updateWaitlistStatus = async (id: string, status: string) => {
  const { error } = await supabaseAdmin.from('waitlist').update({ status }).eq('id', id);
  if (error) throw error;
};

export const deleteWaitlistEntry = async (id: string) => {
  const { error } = await supabaseAdmin.from('waitlist').delete().eq('id', id);
  if (error) throw error;
};

export const addReview = async (review: any) => {
  const { data, error } = await supabaseAdmin.from('reviews').insert([cleanData(review)]).select();
  if (error) throw error;
  return data[0];
};

export const updateReview = async (id: string, reviewData: any) => {
  const { error } = await supabaseAdmin.from('reviews').update(cleanData(reviewData)).eq('id', id);
  if (error) throw error;
};

export const deleteReview = async (id: string) => {
  const { error } = await supabaseAdmin.from('reviews').delete().eq('id', id);
  if (error) throw error;
};

export const inviteTeamMember = async (email: string, role: string) => {
  const { data, error } = await supabaseAdmin.from('users').insert([{ email, role, full_name: email.split('@')[0] }]).select();
  if (error) throw error;
  return data[0];
};

export const updateUserRole = async (userId: string, role: string) => {
  const { error } = await supabaseAdmin.from('users').update({ role }).eq('id', userId);
  if (error) throw error;
};

export const deleteUser = async (userId: string) => {
  const { error } = await supabaseAdmin.from('users').delete().eq('id', userId);
  if (error) throw error;
};

// --- MISC UTILS ---
export const getBlogBySlug = async (slug: string): Promise<Blog | null> => {
  const { data } = await supabase.from('blogs').select('*').eq('slug', slug).single();
  return data;
};

export const getCardBySlug = async (slugOrId: string): Promise<Card | null> => {
  let result = await supabase.from('cards').select('*').eq('slug', slugOrId).single();
  if (result.data) return result.data;
  result = await supabase.from('cards').select('*').eq('id', slugOrId).single();
  return result.data;
};

export const checkIfAdmin = async (userId: string | undefined, userEmail: string | undefined) => {
  if (userEmail === "toanweshbiswas@gmail.com" || userEmail === "buildwithjupyter.network@gmail.com") return true;
  if (!userEmail) return false;
  const { data } = await supabase.from('users').select('role').eq('email', userEmail).single();
  return data ? ['admin', 'editor', 'writer'].includes(data.role) : false;
};

export const joinWaitlist = async (entry: any) => {
  const { data, error } = await supabase.from('waitlist').insert([cleanData(entry)]).select();
  if (error) throw error;
  return data[0].id;
};

export const subscribeNewsletter = async (email: string) => {
  const { data, error } = await supabase.from('newsletters').insert([{ email, status: 'active' }]).select();
  if (error) throw error;
  return data[0].id;
};
