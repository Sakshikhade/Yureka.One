import { 
  db, 
  auth,
  collection, 
  getDocs, 
  getDoc,
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  Timestamp,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  where
} from '../firebase';
import { Blog, Card, WaitlistEntry, NewsletterEntry } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

// Helper to handle Firestore errors as per guidelines
const handleFirestoreError = (error: unknown, operationType: OperationType | string, path: string | null) => {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType: operationType as OperationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
};

// Helper for backend API calls
const apiFetch = async (endpoint: string, options?: RequestInit) => {
  const res = await fetch(endpoint, options);
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || `API Error: ${res.statusText}`);
  }
  return res.json();
};

// --- Blogs ---
export const getBlogs = (callback: (blogs: Blog[]) => void) => {
  const fetchBlogs = () => apiFetch('/api/blogs').then(callback).catch(e => console.error('getBlogs error', e));
  fetchBlogs();
  const interval = setInterval(fetchBlogs, 5000);
  return () => clearInterval(interval);
};

export const addBlog = async (blog: any) => {
  const res = await apiFetch('/api/blogs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(blog)
  });
  return res.id;
};

export const updateBlog = async (id: string, blogData: any) => {
  await apiFetch(`/api/blogs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(blogData)
  });
};

export const deleteBlog = async (id: string) => {
  await apiFetch(`/api/blogs/${id}`, { method: 'DELETE' });
};

// --- Cards ---
export const getCardsAdmin = (callback: (cards: Card[]) => void) => {
  const fetchCards = () => apiFetch('/api/cards').then(callback).catch(e => console.error('getCardsAdmin error', e));
  fetchCards();
  const interval = setInterval(fetchCards, 5000);
  return () => clearInterval(interval);
};

export const getCards = (callback: (cards: Card[]) => void) => {
  const fetchCards = () => apiFetch('/api/cards').then((cards: Card[]) => {
    const publishedCards = cards.filter(card => card.status === 'published' || !card.status);
    callback(publishedCards);
  }).catch(e => console.error('getCards error', e));
  fetchCards();
  const interval = setInterval(fetchCards, 5000);
  return () => clearInterval(interval);
};

export const addCard = async (card: any) => {
  const res = await apiFetch('/api/cards', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(card)
  });
  return res.id;
};

export const updateCard = async (id: string, cardData: any) => {
  await apiFetch(`/api/cards/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cardData)
  });
};

export const deleteCard = async (id: string) => {
  await apiFetch(`/api/cards/${id}`, { method: 'DELETE' });
};

// --- Waitlist ---
export const getWaitlist = (callback: (entries: WaitlistEntry[]) => void) => {
  const fetchWaitlist = () => apiFetch('/api/waitlist').then(callback).catch(e => console.error('getWaitlist error', e));
  fetchWaitlist();
  const interval = setInterval(fetchWaitlist, 5000);
  return () => clearInterval(interval);
};

export const joinWaitlist = async (entry: { name: string, email: string, phone?: string, role?: string, category?: string, company?: string }) => {
  const res = await apiFetch('/api/waitlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry)
  });
  return res.id;
};

export const deleteWaitlistEntry = async (id: string) => {
  await apiFetch(`/api/waitlist/${id}`, { method: 'DELETE' });
};

// --- Newsletters ---
export const getNewsletters = (callback: (entries: NewsletterEntry[]) => void) => {
  const fetchNewsletters = () => apiFetch('/api/newsletters').then(callback).catch(e => console.error('getNewsletters error', e));
  fetchNewsletters();
  const interval = setInterval(fetchNewsletters, 5000);
  return () => clearInterval(interval);
};

export const subscribeNewsletter = async (email: string) => {
  const res = await apiFetch('/api/newsletters', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  return res.id;
};

export const deleteNewsletterEntry = async (id: string) => {
  await apiFetch(`/api/newsletters/${id}`, { method: 'DELETE' });
};

// --- Admin Check ---
export const checkIfAdmin = async (uid: string) => {
  const currentUser = auth.currentUser;
  if (currentUser && currentUser.email === "toanweshbiswas@gmail.com" && currentUser.emailVerified) {
    return true;
  }
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists() && userDoc.data().role === 'admin') {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};
