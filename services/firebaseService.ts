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

// --- Blogs ---
export const getBlogs = (callback: (blogs: Blog[]) => void) => {
  const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const blogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Blog));
    callback(blogs);
  }, (error) => handleFirestoreError(error, OperationType.GET, 'blogs'));
};

export const addBlog = async (blog: any) => {
  try {
    const docRef = await addDoc(collection(db, 'blogs'), {
      ...blog,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'blogs');
  }
};

export const updateBlog = async (id: string, blogData: any) => {
  try {
    await updateDoc(doc(db, 'blogs', id), {
      ...blogData,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, 'blogs');
  }
};

export const deleteBlog = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'blogs', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, 'blogs');
  }
};

// --- Cards ---
export const getCardsAdmin = (callback: (cards: Card[]) => void) => {
  const q = query(collection(db, 'cards'), orderBy('name', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const cards = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Card));
    callback(cards);
  }, (error) => handleFirestoreError(error, OperationType.GET, 'cards'));
};

export const getCards = (callback: (cards: Card[]) => void) => {
  const q = query(collection(db, 'cards'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const cards = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Card));
    const publishedCards = cards.filter(card => card.status === 'published' || !card.status);
    callback(publishedCards);
  }, (error) => handleFirestoreError(error, OperationType.GET, 'cards'));
};

export const addCard = async (card: any) => {
  try {
    const docRef = await addDoc(collection(db, 'cards'), {
      ...card,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'cards');
  }
};

export const updateCard = async (id: string, cardData: any) => {
  try {
    await updateDoc(doc(db, 'cards', id), {
      ...cardData,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, 'cards');
  }
};

export const deleteCard = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'cards', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, 'cards');
  }
};

// --- Waitlist ---
export const getWaitlist = (callback: (entries: WaitlistEntry[]) => void) => {
  const q = query(collection(db, 'waitlist'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const entries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WaitlistEntry));
    callback(entries);
  }, (error) => handleFirestoreError(error, OperationType.GET, 'waitlist'));
};

export const joinWaitlist = async (entry: { name: string, email: string, phone?: string, role?: string, category?: string, company?: string }) => {
  try {
    const docRef = await addDoc(collection(db, 'waitlist'), {
      ...entry,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'waitlist');
  }
};

export const deleteWaitlistEntry = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'waitlist', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, 'waitlist');
  }
};

// --- Newsletters ---
export const getNewsletters = (callback: (entries: NewsletterEntry[]) => void) => {
  const q = query(collection(db, 'newsletters'), orderBy('subscribedAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const entries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsletterEntry));
    callback(entries);
  }, (error) => handleFirestoreError(error, OperationType.GET, 'newsletters'));
};

export const subscribeNewsletter = async (email: string) => {
  try {
    const docRef = await addDoc(collection(db, 'newsletters'), {
      email,
      status: 'active',
      subscribedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'newsletters');
  }
};

export const deleteNewsletterEntry = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'newsletters', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, 'newsletters');
  }
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
