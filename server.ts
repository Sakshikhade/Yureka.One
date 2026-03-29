import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import admin from "firebase-admin";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
if (!admin.apps.length) {
  const serviceAccountPath = path.resolve(__dirname, 'firebase-service-account.json');
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } else {
    console.warn("Missing firebase-service-account.json - backend APIs will fail.");
  }
}
const db = admin.apps.length ? admin.firestore() : null;
async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", env: process.env.NODE_ENV });
  });

  // --- API Routes for Firebase Admin ---
  const checkDb = (req: any, res: any, next: any) => {
    if (!db) return res.status(500).json({ error: 'Database not initialized' });
    next();
  };

  // Blogs
  app.get("/api/blogs", checkDb, async (req, res) => {
    try {
      const snapshot = await db!.collection('blogs').orderBy('createdAt', 'desc').get();
      const blogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(blogs);
    } catch (error: any) { res.status(500).json({ error: error.message }); }
  });
  
  app.post("/api/blogs", checkDb, async (req, res) => {
    try {
      const newBlog = { ...req.body, createdAt: admin.firestore.Timestamp.now(), updatedAt: admin.firestore.Timestamp.now() };
      const docRef = await db!.collection('blogs').add(newBlog);
      res.json({ id: docRef.id });
    } catch (error: any) { res.status(500).json({ error: error.message }); }
  });

  app.put("/api/blogs/:id", checkDb, async (req, res) => {
    try {
      await db!.collection('blogs').doc(req.params.id).update({ ...req.body, updatedAt: admin.firestore.Timestamp.now() });
      res.json({ success: true });
    } catch (error: any) { res.status(500).json({ error: error.message }); }
  });

  app.delete("/api/blogs/:id", checkDb, async (req, res) => {
    try {
      await db!.collection('blogs').doc(req.params.id).delete();
      res.json({ success: true });
    } catch (error: any) { res.status(500).json({ error: error.message }); }
  });

  // Cards
  app.get("/api/cards", checkDb, async (req, res) => {
    try {
      const snapshot = await db!.collection('cards').orderBy('name', 'asc').get();
      const cards = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(cards);
    } catch (error: any) { res.status(500).json({ error: error.message }); }
  });
  
  app.post("/api/cards", checkDb, async (req, res) => {
    try {
      const newCard = { ...req.body, createdAt: admin.firestore.Timestamp.now(), updatedAt: admin.firestore.Timestamp.now() };
      const docRef = await db!.collection('cards').add(newCard);
      res.json({ id: docRef.id });
    } catch (error: any) { res.status(500).json({ error: error.message }); }
  });

  app.put("/api/cards/:id", checkDb, async (req, res) => {
    try {
      await db!.collection('cards').doc(req.params.id).update({ ...req.body, updatedAt: admin.firestore.Timestamp.now() });
      res.json({ success: true });
    } catch (error: any) { res.status(500).json({ error: error.message }); }
  });

  app.delete("/api/cards/:id", checkDb, async (req, res) => {
    try {
      await db!.collection('cards').doc(req.params.id).delete();
      res.json({ success: true });
    } catch (error: any) { res.status(500).json({ error: error.message }); }
  });

  // Waitlist
  app.get("/api/waitlist", checkDb, async (req, res) => {
    try {
      const snapshot = await db!.collection('waitlist').orderBy('createdAt', 'desc').get();
      const entries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(entries);
    } catch (error: any) { res.status(500).json({ error: error.message }); }
  });
  
  app.post("/api/waitlist", checkDb, async (req, res) => {
    try {
      const newEntry = { ...req.body, createdAt: admin.firestore.Timestamp.now() };
      const docRef = await db!.collection('waitlist').add(newEntry);
      res.json({ id: docRef.id });
    } catch (error: any) { res.status(500).json({ error: error.message }); }
  });

  app.delete("/api/waitlist/:id", checkDb, async (req, res) => {
    try {
      await db!.collection('waitlist').doc(req.params.id).delete();
      res.json({ success: true });
    } catch (error: any) { res.status(500).json({ error: error.message }); }
  });

  // Newsletters
  app.get("/api/newsletters", checkDb, async (req, res) => {
    try {
      const snapshot = await db!.collection('newsletters').orderBy('subscribedAt', 'desc').get();
      const entries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(entries);
    } catch (error: any) { res.status(500).json({ error: error.message }); }
  });
  
  app.post("/api/newsletters", checkDb, async (req, res) => {
    try {
      const newEntry = { ...req.body, status: 'active', subscribedAt: admin.firestore.Timestamp.now() };
      const docRef = await db!.collection('newsletters').add(newEntry);
      res.json({ id: docRef.id });
    } catch (error: any) { res.status(500).json({ error: error.message }); }
  });

  app.delete("/api/newsletters/:id", checkDb, async (req, res) => {
    try {
      await db!.collection('newsletters').doc(req.params.id).delete();
      res.json({ success: true });
    } catch (error: any) { res.status(500).json({ error: error.message }); }
  });
    // Vite middleware for development
    if (process.env.NODE_ENV !== "production") {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.resolve(__dirname, 'dist');
      app.use(express.static(distPath));
      
      // Catch-all route for SPA in production
      app.get('*', (req, res) => {
        if (req.url.startsWith('/api')) {
          return res.status(404).json({ error: 'API not found' });
        }
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
