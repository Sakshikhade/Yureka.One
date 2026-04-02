import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Supabase Client
const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || ""; // Should ideally be SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // --- API Routes ---

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", env: process.env.NODE_ENV });
  });

  // Blogs API
  app.get("/api/blogs", async (req, res) => {
    const { data, error } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  app.post("/api/blogs", async (req, res) => {
    const { data, error } = await supabase.from('blogs').insert([req.body]).select();
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data[0]);
  });

  app.put("/api/blogs/:id", async (req, res) => {
    const { data, error } = await supabase.from('blogs').update(req.body).eq('id', req.params.id).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
  });

  app.delete("/api/blogs/:id", async (req, res) => {
    const { error } = await supabase.from('blogs').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.status(204).send();
  });

  // Cards API
  app.get("/api/cards", async (req, res) => {
    const { data, error } = await supabase.from('cards').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  app.post("/api/cards", async (req, res) => {
    const { data, error } = await supabase.from('cards').insert([req.body]).select();
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data[0]);
  });

  app.put("/api/cards/:id", async (req, res) => {
    const { data, error } = await supabase.from('cards').update(req.body).eq('id', req.params.id).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
  });

  app.delete("/api/cards/:id", async (req, res) => {
    const { error } = await supabase.from('cards').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.status(204).send();
  });

  // Waitlist API
  app.get("/api/waitlist", async (req, res) => {
    const { data, error } = await supabase.from('waitlist').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  app.post("/api/waitlist", async (req, res) => {
    const { data, error } = await supabase.from('waitlist').insert([req.body]).select();
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data[0]);
  });

  app.delete("/api/waitlist/:id", async (req, res) => {
    const { error } = await supabase.from('waitlist').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.status(204).send();
  });

  // Newsletters API
  app.get("/api/newsletters", async (req, res) => {
    const { data, error } = await supabase.from('newsletters').select('*').order('subscribed_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  app.post("/api/newsletters", async (req, res) => {
    const { data, error } = await supabase.from('newsletters').insert([req.body]).select();
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data[0]);
  });

  app.delete("/api/newsletters/:id", async (req, res) => {
    const { error } = await supabase.from('newsletters').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.status(204).send();
  });

  // Admin Check API
  app.get("/api/auth/admin-check", async (req, res) => {
    const { userId, email } = req.query;
    
    if (email === "toanweshbiswas@gmail.com") {
      return res.json({ isAdmin: true });
    }
    if (!userId) return res.json({ isAdmin: false });
    
    try {
      const { data, error } = await supabase.from('users').select('role').eq('id', userId as string).single();
      if (error || !data) return res.json({ isAdmin: false });
      return res.json({ isAdmin: data.role === 'admin' });
    } catch (error) {
      return res.json({ isAdmin: false });
    }
  });

  // --- Vite / Frontend Handling ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    
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
