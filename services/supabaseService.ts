import { supabase } from '../supabase';
import { Blog, Card, WaitlistEntry, NewsletterEntry } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
}

const handleSupabaseError = (error: any, operationType: string, table: string) => {
  console.error(`Supabase Error (${operationType} on ${table}):`, error);
  throw new Error(error.message || `Failed to ${operationType} ${table}`);
};

// --- Blogs ---
export const getBlogs = (callback: (blogs: Blog[]) => void) => {
  const fetchBlogs = async () => {
    const { data, error } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
    if (error) return console.error(error);
    callback(data as any);
  };
  fetchBlogs();
  
  const subscription = supabase.channel('blogs_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'blogs' }, () => fetchBlogs())
    .subscribe();
    
  return () => { supabase.removeChannel(subscription); };
};

export const addBlog = async (blog: any) => {
  const { data, error } = await supabase.from('blogs').insert([blog]).select();
  if (error) handleSupabaseError(error, OperationType.CREATE, 'blogs');
  return data && data.length > 0 ? data[0].id : null;
};

export const updateBlog = async (id: string, blogData: any) => {
  const { error } = await supabase.from('blogs').update(blogData).eq('id', id);
  if (error) handleSupabaseError(error, OperationType.UPDATE, 'blogs');
};

export const deleteBlog = async (id: string) => {
  const { error } = await supabase.from('blogs').delete().eq('id', id);
  if (error) handleSupabaseError(error, OperationType.DELETE, 'blogs');
};

// --- Cards ---
export const getCardsAdmin = (callback: (cards: Card[]) => void) => {
  const fetchCards = async () => {
    const { data, error } = await supabase.from('cards').select('*').order('name', { ascending: true });
    if (error) return console.error(error);
    callback(data as any);
  };
  fetchCards();
  
  const subscription = supabase.channel('cards_admin_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'cards' }, () => fetchCards())
    .subscribe();
    
  return () => { supabase.removeChannel(subscription); };
};

export const getCards = (callback: (cards: Card[]) => void) => {
  const fetchCards = async () => {
    const { data, error } = await supabase.from('cards').select('*').order('created_at', { ascending: false });
    if (error) return console.error(error);
    const publishedCards = (data as any[]).filter(card => card.status === 'published' || !card.status);
    callback(publishedCards);
  };
  fetchCards();
  
  const subscription = supabase.channel('cards_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'cards' }, () => fetchCards())
    .subscribe();
    
  return () => { supabase.removeChannel(subscription); };
};

export const addCard = async (card: any) => {
  const { data, error } = await supabase.from('cards').insert([card]).select();
  if (error) handleSupabaseError(error, OperationType.CREATE, 'cards');
  return data && data.length > 0 ? data[0].id : null;
};

export const updateCard = async (id: string, cardData: any) => {
  const { error } = await supabase.from('cards').update(cardData).eq('id', id);
  if (error) handleSupabaseError(error, OperationType.UPDATE, 'cards');
};

export const deleteCard = async (id: string) => {
  const { error } = await supabase.from('cards').delete().eq('id', id);
  if (error) handleSupabaseError(error, OperationType.DELETE, 'cards');
};

// --- Waitlist ---
export const getWaitlist = (callback: (entries: WaitlistEntry[]) => void) => {
  const fetchWaitlist = async () => {
    const { data, error } = await supabase.from('waitlist').select('*').order('created_at', { ascending: false });
    if (error) return console.error(error);
    callback(data as any);
  };
  fetchWaitlist();
  
  const subscription = supabase.channel('waitlist_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'waitlist' }, () => fetchWaitlist())
    .subscribe();
    
  return () => { supabase.removeChannel(subscription); };
};

export const joinWaitlist = async (entry: { name: string, email: string, phone?: string, role?: string, category?: string, company?: string }) => {
  const { data, error } = await supabase.from('waitlist').insert([entry]).select();
  if (error) handleSupabaseError(error, OperationType.CREATE, 'waitlist');
  return data && data.length > 0 ? data[0].id : null;
};

export const deleteWaitlistEntry = async (id: string) => {
  const { error } = await supabase.from('waitlist').delete().eq('id', id);
  if (error) handleSupabaseError(error, OperationType.DELETE, 'waitlist');
};

// --- Newsletters ---
export const getNewsletters = (callback: (entries: NewsletterEntry[]) => void) => {
  const fetchNewsletters = async () => {
    const { data, error } = await supabase.from('newsletters').select('*').order('subscribed_at', { ascending: false });
    if (error) return console.error(error);
    callback(data as any);
  };
  fetchNewsletters();
  
  const subscription = supabase.channel('newsletters_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'newsletters' }, () => fetchNewsletters())
    .subscribe();
    
  return () => { supabase.removeChannel(subscription); };
};

export const subscribeNewsletter = async (email: string) => {
  const { data, error } = await supabase.from('newsletters').insert([{ email, status: 'active' }]).select();
  if (error) handleSupabaseError(error, OperationType.CREATE, 'newsletters');
  return data && data.length > 0 ? data[0].id : null;
};

export const deleteNewsletterEntry = async (id: string) => {
  const { error } = await supabase.from('newsletters').delete().eq('id', id);
  if (error) handleSupabaseError(error, OperationType.DELETE, 'newsletters');
};

// --- Admin Check ---
export const checkIfAdmin = async (userId: string | undefined, userEmail: string | undefined) => {
  if (userEmail === "toanweshbiswas@gmail.com") {
    return true;
  }
  if (!userId) return false;
  
  try {
    const { data, error } = await supabase.from('users').select('role').eq('id', userId).single();
    if (error || !data) return false;
    return data.role === 'admin';
  } catch (error) {
    return false;
  }
};
