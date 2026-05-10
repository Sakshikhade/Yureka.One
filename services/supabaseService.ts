import { supabase, supabaseAdmin } from '../supabase';
import { Blog, Card, WaitlistEntry, NewsletterEntry, Review, CardContribution } from '../types';

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
  // Try slug first
  const { data: bySlug } = await supabase
    .from('cards')
    .select('*')
    .eq('slug', slugOrId)
    .maybeSingle();
  
  if (bySlug) return bySlug;

  // Try ID if it's a valid UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(slugOrId)) {
    const { data: byId } = await supabase
      .from('cards')
      .select('*')
      .eq('id', slugOrId)
      .maybeSingle();
    return byId;
  }

  return null;
};

export const getUserRole = async (email: string | undefined): Promise<string> => {
  if (!email) return 'user';
  
  // Super admin check
  const superAdmins = [
    "toanweshbiswas@gmail.com", 
    "buildwithjupyter.network@gmail.com",
    "work.anweshbiswas@gmail.com",
    "info.sachisiva@gmail.com",
    "tiwari.sansrite@gmail.com"
  ];
  if (superAdmins.includes(email.toLowerCase().trim())) return 'admin';

  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle(); // maybeSingle handles 0 rows without error
    
    if (error) {
      console.error("Error fetching user role:", error);
      return 'user';
    }
    
    return data?.role || 'user';
  } catch (err) {
    console.error("Failed to fetch role:", err);
    return 'user';
  }
};

export const checkIfAdmin = async (userId: string | undefined, userEmail: string | undefined) => {
  const role = await getUserRole(userEmail);
  return ['admin', 'editor', 'writer'].includes(role);
};

export const joinWaitlist = async (entry: any) => {
  const normalizedEmail = entry.email?.toLowerCase().trim();

  // 1. Check if this email already exists in the waitlist
  const { data: existing, error: existingError } = await supabaseAdmin
    .from('waitlist')
    .select('*')
    .eq('email', normalizedEmail)
    .limit(1)
    .maybeSingle();

  if (existingError) throw existingError;

  // 2. If they already exist, update their record and return it (no duplicate error)
  if (existing) {
    const { data: updated, error: updateError } = await supabaseAdmin
      .from('waitlist')
      .update(cleanData({
        ...entry,
        email: normalizedEmail,
        status: existing.status // preserve existing status (don't reset accepted users)
      }))
      .eq('id', existing.id)
      .select();
    if (updateError) throw updateError;
    return updated![0];
  }

  // 3. New user — calculate rank and generate referral code
  const { count, error: countError } = await supabase
    .from('waitlist')
    .select('*', { count: 'exact', head: true });
  
  if (countError) throw countError;
  const rank = 1000 + (count || 0) + 1;

  // 4. Generate Personal Referral Code (e.g., YRKMNY1234)
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const personalReferralCode = `YRKMNY${randomSuffix}`;

  // 5. Prepare Payload
  const payload = cleanData({
    ...entry,
    email: normalizedEmail,
    rank,
    personal_referral_code: personalReferralCode,
    status: entry.status || 'pending'
  });

  const { data, error } = await supabase.from('waitlist').insert([payload]).select();
  if (error) throw error;
  return data[0];
};

export const subscribeNewsletter = async (email: string) => {
  const { data, error } = await supabase.from('newsletters').insert([{ email, status: 'active' }]).select();
  if (error) throw error;
  return data[0].id;
};
// --- USER PORTAL SERVICES ---
export const fetchUserCards = async (userId: string) => {
  return await withRetry<any[]>(() => supabase.from('user_owned_cards').select('*').eq('user_id', userId).order('created_at', { ascending: false }));
};

export const addUserCard = async (cardData: any) => {
  const { data, error } = await supabase.from('user_owned_cards').insert([cardData]).select();
  if (error) throw error;
  return data[0];
};

export const removeUserCard = async (id: string) => {
  const { error } = await supabase.from('user_owned_cards').delete().eq('id', id);
  if (error) throw error;
};

export const fetchUserReferrals = async (referralCode: string) => {
  return await withRetry<any[]>(() => supabase.from('waitlist').select('name, email, mobile_number, status, created_at').eq('referral_code', referralCode).order('created_at', { ascending: false }));
};

export const updateWaitlistMetadata = async (id: string, metadata: any) => {
  const { error } = await supabase.from('waitlist').update(metadata).eq('id', id);
  if (error) throw error;
};

export const getWaitlistEntry = async (email: string) => {
  const { data, error } = await supabaseAdmin
    .from('waitlist')
    .select('*')
    .eq('email', email.toLowerCase().trim())
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
};

// --- RANK ENGINE ---

/**
 * Fetches referral stats for a user by their personal referral code.
 * Returns total referrals and how many have been approved by admin.
 */
export const fetchReferralStats = async (personalReferralCode: string) => {
  const { data, error } = await supabaseAdmin
    .from('waitlist')
    .select('id, status')
    .eq('referral_code', personalReferralCode);

  if (error) throw error;

  const total = data?.length || 0;
  const approved = data?.filter((r: any) => r.status === 'accepted').length || 0;
  return { total, approved };
};

/**
 * Rank Formula:
 *   Each referral reduces rank by 15 positions.
 *   Each admin-approved referral reduces rank by an extra 35 positions.
 *   Rank can never go below 1.
 */
export const RANK_BOOST_PER_REFERRAL = 15;
export const RANK_BOOST_PER_APPROVAL = 35;

export const computeAndUpdateRank = async (email: string) => {
  // 1. Fetch the user's waitlist entry
  const entry = await getWaitlistEntry(email);
  if (!entry) throw new Error('No waitlist entry found for this email.');

  const baseRank: number = entry.rank || 1000;
  const personalCode: string = entry.personal_referral_code || '';

  // 2. Fetch referral stats
  let stats = { total: 0, approved: 0 };
  if (personalCode) {
    stats = await fetchReferralStats(personalCode);
  }

  // 3. Apply formula
  const boost = (stats.total * RANK_BOOST_PER_REFERRAL) + (stats.approved * RANK_BOOST_PER_APPROVAL);
  const effectiveRank = Math.max(1, baseRank - boost);

  // 4. Persist updated rank back to DB
  const { error: updateError } = await supabaseAdmin
    .from('waitlist')
    .update({ rank: effectiveRank })
    .eq('id', entry.id);

  if (updateError) throw updateError;

  return {
    baseRank,
    effectiveRank,
    totalReferrals: stats.total,
    approvedReferrals: stats.approved,
    rankBoost: boost,
    entry: { ...entry, rank: effectiveRank },
  };
};

// --- CARD CONTRIBUTIONS (COMMUNITY INTEL) ---
export const submitCardContribution = async (contribution: any) => {
  const { data, error } = await supabase.from('card_contributions').insert([contribution]).select();
  if (error) throw error;
  return data[0];
};

export const fetchCardContributionsAdmin = async () => {
  return await withRetry<any[]>(() => 
    supabaseAdmin.from('card_contributions').select('*').order('created_at', { ascending: false })
  );
};

export const getCardContributionsAdmin = (callback: (contributions: any[]) => void) => {
  const execute = async () => { const data = await fetchCardContributionsAdmin(); callback(data || []); };
  execute();
  const sub = supabaseAdmin.channel('contributions-admin').on('postgres_changes', { event: '*', schema: 'public', table: 'card_contributions' }, () => execute()).subscribe();
  return () => { sub.unsubscribe(); };
};

export const updateCardContributionStatus = async (id: string, status: string) => {
  const { error } = await supabaseAdmin.from('card_contributions').update({ status }).eq('id', id);
  if (error) throw error;
};

export const deleteCardContribution = async (id: string) => {
  const { error } = await supabaseAdmin.from('card_contributions').delete().eq('id', id);
  if (error) throw error;
};
