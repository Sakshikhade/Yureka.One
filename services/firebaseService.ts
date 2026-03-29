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

// Helper to handle Firestore errors as per guidelines
const handleFirestoreError = (error: unknown, operationType: string, path: string | null) => {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
};

// --- Blogs ---
export const getBlogs = (callback: (blogs: any[]) => void) => {
  const q = query(collection(db, 'blogs'), orderBy('date', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const blogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(blogs);
  }, (error) => handleFirestoreError(error, 'get', 'blogs'));
};

export const addBlog = async (blog: any) => {
  try {
    const docRef = await addDoc(collection(db, 'blogs'), {
      ...blog,
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, 'create', 'blogs');
  }
};

// --- Cards ---
export const getCards = (callback: (cards: any[]) => void) => {
  const q = query(collection(db, 'cards'), orderBy('name', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const cards = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(cards);
  }, (error) => handleFirestoreError(error, 'get', 'cards'));
};

export const addCard = async (card: any) => {
  try {
    const docRef = await addDoc(collection(db, 'cards'), {
      ...card,
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, 'create', 'cards');
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
  try {
    // Check if user is in the users collection as admin
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists() && userDoc.data().role === 'admin') {
      return true;
    }
    
    // Check if user is the default admin by email
    const currentUser = auth.currentUser;
    if (currentUser && currentUser.email === "toanweshbiswas@gmail.com" && currentUser.emailVerified) {
      return true;
    }

    return false;
  } catch (error) {
    // If we can't check, assume not admin (rules will block anyway)
    return false;
  }
};
