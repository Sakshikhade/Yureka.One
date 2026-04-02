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
      const response = await fetch('/api/blogs');
      if (response.ok) {
        const data = await response.json();
        callback(data);
      }
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
  const response = await fetch('/api/blogs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(blog),
  });
  await handleApiError(response, OperationType.CREATE, 'blogs');
  const data = await response.json();
  return data.id;
};

export const updateBlog = async (id: string, blogData: any) => {
  const response = await fetch(`/api/blogs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(blogData),
  });
  await handleApiError(response, OperationType.UPDATE, 'blogs');
};

export const deleteBlog = async (id: string) => {
  const response = await fetch(`/api/blogs/${id}`, {
    method: 'DELETE',
  });
  await handleApiError(response, OperationType.DELETE, 'blogs');
};

// --- Cards ---
export const getCardsAdmin = (callback: (cards: Card[]) => void) => {
  const fetchCards = async () => {
    try {
      const response = await fetch('/api/cards');
      if (response.ok) {
        const data = await response.json();
        callback(data);
      }
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
      const response = await fetch('/api/cards');
      if (response.ok) {
        const data = await response.json();
        const publishedCards = (data as any[]).filter(card => card.status === 'published' || !card.status);
        callback(publishedCards);
      }
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
  const response = await fetch('/api/cards', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(card),
  });
  await handleApiError(response, OperationType.CREATE, 'cards');
  const data = await response.json();
  return data.id;
};

export const updateCard = async (id: string, cardData: any) => {
  const response = await fetch(`/api/cards/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cardData),
  });
  await handleApiError(response, OperationType.UPDATE, 'cards');
};

export const deleteCard = async (id: string) => {
  const response = await fetch(`/api/cards/${id}`, {
    method: 'DELETE',
  });
  await handleApiError(response, OperationType.DELETE, 'cards');
};

// --- Waitlist ---
export const getWaitlist = (callback: (entries: WaitlistEntry[]) => void) => {
  const fetchWaitlist = async () => {
    try {
      const response = await fetch('/api/waitlist');
      if (response.ok) {
        const data = await response.json();
        callback(data);
      }
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
  const response = await fetch('/api/waitlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });
  await handleApiError(response, OperationType.CREATE, 'waitlist');
  const data = await response.json();
  return data.id;
};

export const deleteWaitlistEntry = async (id: string) => {
  const response = await fetch(`/api/waitlist/${id}`, {
    method: 'DELETE',
  });
  await handleApiError(response, OperationType.DELETE, 'waitlist');
};

// --- Newsletters ---
export const getNewsletters = (callback: (entries: NewsletterEntry[]) => void) => {
  const fetchNewsletters = async () => {
    try {
      const response = await fetch('/api/newsletters');
      if (response.ok) {
        const data = await response.json();
        callback(data);
      }
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
  const response = await fetch('/api/newsletters', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, status: 'active' }),
  });
  await handleApiError(response, OperationType.CREATE, 'newsletters');
  const data = await response.json();
  return data.id;
};

export const deleteNewsletterEntry = async (id: string) => {
  const response = await fetch(`/api/newsletters/${id}`, {
    method: 'DELETE',
  });
  await handleApiError(response, OperationType.DELETE, 'newsletters');
};

// --- Admin Check ---
export const checkIfAdmin = async (userId: string | undefined, userEmail: string | undefined) => {
  if (userEmail === "toanweshbiswas@gmail.com") {
    return true;
  }
  if (!userId) return false;
  
  try {
    const response = await fetch(`/api/auth/admin-check?userId=${userId}&email=${userEmail || ''}`);
    if (response.ok) {
      const data = await response.json();
      return data.isAdmin;
    }
    return false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};
