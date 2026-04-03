import { supabase } from '../supabase';
import { Blog, Card, WaitlistEntry, NewsletterEntry } from '../types';

// Helper for cleaning objects for Supabase (removing undefined/null)
const cleanData = (obj: any) => {
  const cleaned = { ...obj };
  Object.keys(cleaned).forEach(key => {
    if (cleaned[key] === undefined) delete cleaned[key];
    // Convert benefits array to Postgres format if needed
    if (key === 'benefits' && Array.isArray(cleaned[key])) {
      // Ensure it's a valid string array
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
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      callback(data as Blog[]);
    } catch (error: any) {
      console.error('Error fetching blogs:', error);
      if (onError) onError(error.message || 'Failed to fetch blogs');
    }
  };
  fetchBlogs();
  
  const channel = supabase.channel('blogs-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'blogs' }, (payload) => {
      console.log('Real-time blog change:', payload.eventType);
      fetchBlogs();
    })
    .subscribe();
    
  return () => { supabase.removeChannel(channel); };
};

export const addBlog = async (blog: any) => {
  console.log('Adding Blog:', blog);
  const { data, error } = await supabase.from('blogs').insert([cleanData(blog)]).select();
  if (error) {
    console.error('Supabase Blog Insert Error:', error);
    throw error;
  }
  return data[0].id;
};

export const updateBlog = async (id: string, blogData: any) => {
  console.log('Updating Blog:', id, blogData);
  const { error } = await supabase.from('blogs').update(cleanData(blogData)).eq('id', id);
  if (error) {
    console.error('Supabase Blog Update Error:', error);
    throw error;
  }
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
  console.log('Deleting Blog:', id);
  const { error } = await supabase.from('blogs').delete().eq('id', id);
  if (error) {
    console.error('Supabase Blog Delete Error:', error);
    throw error;
  }
};

// --- Cards ---
export const getCardsAdmin = (callback: (cards: Card[]) => void, onError?: (error: string) => void) => {
  const fetchCards = async () => {
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      callback(data as Card[]);
    } catch (error: any) {
      console.error('Error fetching cards admin:', error);
      if (onError) onError(error.message || 'Failed to fetch cards');
    }
  };
  fetchCards();
  
  const channel = supabase.channel('cards-admin-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'cards' }, (payload) => {
      console.log('Real-time card change:', payload.eventType);
      fetchCards();
    })
    .subscribe();
    
  return () => { supabase.removeChannel(channel); };
};

export const getCards = (callback: (cards: Card[]) => void, onError?: (error: string) => void) => {
  const fetchCards = async () => {
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      callback(data as Card[]);
    } catch (error: any) {
      console.error('Error fetching cards public:', error);
      if (onError) onError(error.message || 'Failed to fetch cards');
    }
  };
  fetchCards();
  
  const channel = supabase.channel('cards-public-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'cards' }, () => fetchCards())
    .subscribe();
    
  return () => { supabase.removeChannel(channel); };
};

export const addCard = async (card: any) => {
  console.log('Adding Card:', card);
  const { data, error } = await supabase.from('cards').insert([cleanData(card)]).select();
  if (error) {
    console.error('Supabase Card Insert Error:', error);
    throw error;
  }
  return data[0].id;
};

export const updateCard = async (id: string, cardData: any) => {
  console.log('Updating Card:', id, cardData);
  const { error } = await supabase.from('cards').update(cleanData(cardData)).eq('id', id);
  if (error) {
    console.error('Supabase Card Update Error:', error);
    throw error;
  }
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
    // Try slug first
    let result = await supabase.from('cards').select('*').eq('slug', slugOrId).single();
    if (!result.error && result.data) return result.data;
    
    // Fallback to id
    result = await supabase.from('cards').select('*').eq('id', slugOrId).single();
    if (result.error) throw result.error;
    return result.data;
  } catch (error) {
    console.error('getCardBySlug Error:', error);
    return null;
  }
};

export const deleteCard = async (id: string) => {
  console.log('Deleting Card:', id);
  const { error } = await supabase.from('cards').delete().eq('id', id);
  if (error) {
    console.error('Supabase Card Delete Error:', error);
    throw error;
  }
};

// --- Waitlist ---
export const getWaitlist = (callback: (entries: WaitlistEntry[]) => void) => {
  const fetchWaitlist = async () => {
    try {
      const { data, error } = await supabase
        .from('waitlist')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      callback(data as WaitlistEntry[]);
    } catch (error) {
      console.error('Error fetching waitlist:', error);
    }
  };
  fetchWaitlist();
  
  const channel = supabase.channel('waitlist-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'waitlist' }, () => fetchWaitlist())
    .subscribe();
    
  return () => { supabase.removeChannel(channel); };
};

export const joinWaitlist = async (entry: any) => {
  console.log('Waitlist Join:', entry);
  const dataToInsert = { ...cleanData(entry), status: entry.status || 'pending' };
  const { data, error } = await supabase.from('waitlist').insert([dataToInsert]).select();
  if (error) {
    console.error('Supabase Waitlist Insert Error:', error);
    throw error;
  }
  return data[0].id;
};

export const updateWaitlistStatus = async (id: string, status: 'accepted' | 'rejected' | 'on_hold' | 'pending') => {
  const { error } = await supabase.from('waitlist').update({ status }).eq('id', id);
  if (error) {
    console.error('Supabase Waitlist Status Update Error:', error);
    throw error;
  }
};

export const deleteWaitlistEntry = async (id: string) => {
  const { error } = await supabase.from('waitlist').delete().eq('id', id);
  if (error) throw error;
};

// --- Newsletters ---
export const getNewsletters = (callback: (entries: NewsletterEntry[]) => void) => {
  const fetchNewsletters = async () => {
    try {
      const { data, error } = await supabase
        .from('newsletters')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      callback(data as NewsletterEntry[]);
    } catch (error) {
      console.error('Error fetching newsletters:', error);
    }
  };
  fetchNewsletters();
  
  const channel = supabase.channel('newsletters-realtime')
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

// --- Admin Check ---
export const checkIfAdmin = async (userId: string | undefined, userEmail: string | undefined) => {
  // Hardcoded master admin
  if (userEmail === "toanweshbiswas@gmail.com") return true;
  if (!userEmail) return false;
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('email', userEmail)
      .single();
    
    if (error || !data) return false;
    // Allow dashboard access for all team roles
    return ['admin', 'editor', 'writer'].includes(data.role);
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// --- Team Management ---
export const getTeamMembers = async (): Promise<any[]> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const inviteTeamMember = async (email: string, role: string) => {
  // In a real app, this might send an email or handle auth. 
  // For now, we just add the record to allow them access when they sign in.
  const { data, error } = await supabase
    .from('users')
    .insert([{ email, role, full_name: email.split('@')[0] }])
    .select();
  if (error) throw error;
  return data[0];
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

// --- Audit Logs ---
export const getAuditLogs = async (): Promise<any[]> => {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);
    
  if (error) {
    console.error('Error fetching audit logs:', error);
    throw error;
  }
  return data;
};
