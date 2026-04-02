import { supabase } from '../supabase';
import { Blog, Card, WaitlistEntry, NewsletterEntry } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
}

const handleApiError = async (response: Response, operationType: string, table: string) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    console.error(`API Error (${operationType} on ${table}):`, errorData);
    if (typeof window !== 'undefined') {
      (window as any).lastSupabaseError = errorData;
    }
    throw new Error(errorData.error || `Failed to ${operationType} ${table}`);
  }
};

// --- Blogs ---
export const getBlogs = (callback: (blogs: Blog[]) => void) => {
  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      callback(data as Blog[]);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };
  fetchBlogs();
  
  const subscription = supabase.channel('blogs_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'blogs' }, () => fetchBlogs())
    .subscribe();
    
  return () => { supabase.removeChannel(subscription); };
};

export const addBlog = async (blog: any) => {
  const { data, error } = await supabase.from('blogs').insert([blog]).select();
  if (error) throw error;
  return data[0].id;
};

export const updateBlog = async (id: string, blogData: any) => {
  const { error } = await supabase.from('blogs').update(blogData).eq('id', id);
  if (error) throw error;
};

export const deleteBlog = async (id: string) => {
  const { error } = await supabase.from('blogs').delete().eq('id', id);
  if (error) throw error;
};

// --- Cards ---
export const getCardsAdmin = (callback: (cards: Card[]) => void) => {
  const fetchCards = async () => {
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      callback(data as Card[]);
    } catch (error) {
      console.error('Error fetching cards:', error);
    }
  };
  fetchCards();
  
  const subscription = supabase.channel('cards_admin_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'cards' }, () => fetchCards())
    .subscribe();
    
  return () => { supabase.removeChannel(subscription); };
};

export const getCards = (callback: (cards: Card[]) => void) => {
  const fetchCards = async () => {
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      const publishedCards = (data as any[]).filter(card => card.status === 'published' || !card.status);
      callback(publishedCards as Card[]);
    } catch (error) {
      console.error('Error fetching cards:', error);
    }
  };
  fetchCards();
  
  const subscription = supabase.channel('cards_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'cards' }, () => fetchCards())
    .subscribe();
    
  return () => { supabase.removeChannel(subscription); };
};

export const addCard = async (card: any) => {
  const { data, error } = await supabase.from('cards').insert([card]).select();
  if (error) throw error;
  return data[0].id;
};

export const updateCard = async (id: string, cardData: any) => {
  const { error } = await supabase.from('cards').update(cardData).eq('id', id);
  if (error) throw error;
};

export const deleteCard = async (id: string) => {
  const { error } = await supabase.from('cards').delete().eq('id', id);
  if (error) throw error;
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
  
  const subscription = supabase.channel('waitlist_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'waitlist' }, () => fetchWaitlist())
    .subscribe();
    
  return () => { supabase.removeChannel(subscription); };
};

export const joinWaitlist = async (entry: { name: string, email: string, phone?: string, role?: string, category?: string, company?: string }) => {
  const { data, error } = await supabase.from('waitlist').insert([entry]).select();
  if (error) throw error;
  return data[0].id;
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
        .order('subscribed_at', { ascending: false });
      
      if (error) throw error;
      callback(data as NewsletterEntry[]);
    } catch (error) {
      console.error('Error fetching newsletters:', error);
    }
  };
  fetchNewsletters();
  
  const subscription = supabase.channel('newsletters_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'newsletters' }, () => fetchNewsletters())
    .subscribe();
    
  return () => { supabase.removeChannel(subscription); };
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
  if (userEmail === "toanweshbiswas@gmail.com") {
    return true;
  }
  if (!userId) return false;
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (error || !data) return false;
    return data.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};
