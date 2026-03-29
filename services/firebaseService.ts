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
import { Blog, Card } from '../types';

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
    // Filter by status on the frontend to avoid index requirements for now
    const publishedBlogs = blogs.filter(blog => blog.status === 'published' || !blog.status);
    callback(publishedBlogs);
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

// --- Cards ---
export const getCards = (callback: (cards: Card[]) => void) => {
  const q = query(collection(db, 'cards'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const cards = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Card));
    // Filter by status on the frontend
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

// --- Waitlist ---
export const joinWaitlist = async (entry: { name: string, email: string, phone?: string }) => {
  try {
    const docRef = await addDoc(collection(db, 'waitlist'), {
      ...entry,
      joinedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, 'create', 'waitlist');
  }
};

// --- Admin Check ---
export const checkIfAdmin = async (uid: string) => {
  // 1. Check if user is the default admin by email first (fastest, doesn't need Firestore)
  const currentUser = auth.currentUser;
  if (currentUser && currentUser.email === "toanweshbiswas@gmail.com" && currentUser.emailVerified) {
    return true;
  }

  try {
    // 2. Check if user is in the users collection as admin
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists() && userDoc.data().role === 'admin') {
      return true;
    }
    return false;
  } catch (error) {
    // If we can't check Firestore (e.g. permission denied), we already checked the email above
    return false;
  }
};
