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
  });
  return cleaned;
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

export const deleteBlog = async (id: string) => {
  console.log('Deleting Blog:', id);
  const { error } = await supabase.from('blogs').delete().eq('id', id);
  if (error) {
    console.error('Supabase Blog Delete Error:', error);
    throw error;
  }
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
      console.error('Error fetching cards admin:', error);
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

export const getCards = (callback: (cards: Card[]) => void) => {
  const fetchCards = async () => {
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      callback(data as Card[]);
    } catch (error) {
      console.error('Error fetching cards public:', error);
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
  const { data, error } = await supabase.from('waitlist').insert([cleanData(entry)]).select();
  if (error) {
    console.error('Supabase Waitlist Insert Error:', error);
    throw error;
  }
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
