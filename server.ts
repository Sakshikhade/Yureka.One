import express from "express";
import compression from "compression";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { resolveRouteMeta } from "./lib/seo/resolveRouteMeta";
import { injectHtml } from "./lib/seo/inject";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Supabase Client
const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || ""; // Should ideally be SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey);

// Fire a throwaway query at boot so the first real request (often a crawler
// hitting a /cards/:slug or /blogs/:slug page) doesn't pay the ~1.5-2s cold
// connection cost that the SEO meta injector's short timeout can't absorb.
supabase.from('cards').select('id').limit(1).then(
  () => console.log('Supabase connection warmed.'),
  () => {}
);

async function startServer() {
  const app = express();
  app.use(compression());
  app.use(cors());
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

  async function saveDataToSupabase(profile: any, transactions: any[], explicitEmail?: string) {
    if (!profile) return;
    const email = explicitEmail || profile.email || "toanweshbiswas@gmail.com";

    // 1. Save profile to waitlist table
    try {
      const { data: existing } = await supabase
        .from("waitlist")
        .select("*")
        .eq("email", email.toLowerCase().trim())
        .limit(1)
        .maybeSingle();

      const dobFormatted = profile.dob ? profile.dob.split("/").reverse().join("-") : null;
      const payload = {
        name: profile.name || "",
        first_name: (profile.name || "").split(" ")[0] || "",
        last_name: (profile.name || "").split(" ")[1] || "",
        mobile_number: profile.phone || "",
        date_of_birth: dobFormatted,
        gender: profile.gender || "",
        status: "pending"
      };

      if (existing) {
        const { error: updateError } = await supabase
          .from("waitlist")
          .update(payload)
          .eq("id", existing.id);
        if (updateError) throw updateError;
        console.log(`Successfully updated Supabase waitlist profile for ${email}`);
      } else {
        const { count } = await supabase
          .from("waitlist")
          .select("*", { count: "exact", head: true });
        const rank = 1000 + (count || 0) + 1;
        const personalReferralCode = `YRKMNY${Math.floor(1000 + Math.random() * 9000)}`;

        const { error: insertError } = await supabase
          .from("waitlist")
          .insert([{
            ...payload,
            email: email.toLowerCase().trim(),
            rank,
            personal_referral_code: personalReferralCode
          }]);
        if (insertError) throw insertError;
        console.log(`Successfully created new Supabase waitlist profile for ${email}`);
      }
    } catch (err: any) {
      console.warn("Supabase profile save warning:", err.message || err);
    }

    // 2. Save transactions to financial_ledger table
    if (transactions && transactions.length > 0) {
      try {
        // Fetch existing rows to deduplicate
        const { data: existingRows } = await supabase
          .from("financial_ledger")
          .select("brand_name, amount, date")
          .eq("user_email", email.toLowerCase().trim());

        const existingKeys = new Set(
          (existingRows || []).map(r => `${r.brand_name}|${r.amount}|${r.date}`)
        );

        const newRows = transactions
          .filter(tx => !existingKeys.has(`${tx.brandName || ""}|${tx.amount || ""}|${tx.date || ""}`))
          .map(tx => ({
            user_email: email.toLowerCase().trim(),
            brand_name: tx.brandName || "",
            amount: tx.amount || "",
            description: tx.description || "",
            date: tx.date || "",
            sender: tx.sender || "",
            type: tx.type || "Transaction"
          }));

        if (newRows.length > 0) {
          const { error: insertError } = await supabase
            .from("financial_ledger")
            .insert(newRows);

          if (insertError) throw insertError;
          console.log(`Successfully appended ${newRows.length} new unique transactions to Supabase financial_ledger!`);
        } else {
          console.log(`No new unique transactions to insert.`);
        }
      } catch (err: any) {
        console.warn("Supabase transactions save warning (migration might be missing):", err.message || err);
      }
    }
  }

  // Get cached financial transactions & profile
  app.get("/api/financial-ledger", async (req, res) => {
    const userEmail = (req.query.email as string) || "toanweshbiswas@gmail.com";
    try {
      const { data: dbData, error: dbError } = await supabase
        .from("financial_ledger")
        .select("*")
        .eq("user_email", userEmail.toLowerCase().trim());

      if (!dbError && dbData && dbData.length > 0) {
        const transactions = dbData.map(row => ({
          brandName: row.brand_name,
          amount: row.amount,
          description: row.description,
          date: row.date,
          sender: row.sender,
          type: row.type
        }));
        
        const { data: profileRow } = await supabase
          .from("waitlist")
          .select("*")
          .eq("email", userEmail.toLowerCase().trim())
          .limit(1)
          .maybeSingle();

        const profile = profileRow ? {
          name: profileRow.name,
          dob: profileRow.date_of_birth ? profileRow.date_of_birth.split("-").reverse().join("/") : "",
          gender: profileRow.gender,
          phone: profileRow.mobile_number
        } : {};

        console.log(`Loaded ${transactions.length} transactions from Supabase for ${userEmail}`);
        return res.json({ profile, transactions });
      }
    } catch (err) {
      console.warn("Supabase load failed, falling back to local file cache:", err);
    }

    const fs = await import("fs/promises");
    const cachePath = path.join(__dirname, "data", "financial_cache.json");
    try {
      const dataStr = await fs.readFile(cachePath, "utf-8");
      const data = JSON.parse(dataStr);
      res.json(data);
    } catch (err) {
      res.json({ profile: {}, transactions: [] });
    }
  });

  // Email Deep Scanner API
  app.post("/api/scan-email", async (req, res) => {
    const { accessToken, email, fallbackData } = req.body;
    const { spawn } = await import("child_process");
    const pythonExecutable = fs.existsSync('./venv/bin/python3') ? './venv/bin/python3' : 'python3';
    const pythonProcess = spawn(pythonExecutable, [
      path.join(__dirname, "scripts", "scanner.py"),
      accessToken || "",
      JSON.stringify(fallbackData || {})
    ]);

    let output = "";
    let errorOutput = "";

    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on("close", async (code) => {
      if (code !== 0) {
        console.error("Python deep scanner process failed with exit code:", code, errorOutput);
        return res.status(500).json({ error: "Deep scanner script failed to execute", details: errorOutput });
      }

      try {
        const result = JSON.parse(output.trim());
        if (result.error) {
          return res.status(400).json({ error: result.error });
        }

        // Persist to Supabase
        await saveDataToSupabase(result.profile, result.transactions || [], email || (fallbackData && fallbackData.email));

        // Cache success output locally as fallback
        const fs = await import("fs/promises");
        const cacheDir = path.join(__dirname, "data");
        try {
          await fs.mkdir(cacheDir, { recursive: true });
        } catch {}
        await fs.writeFile(
          path.join(cacheDir, "financial_cache.json"),
          JSON.stringify(result, null, 2)
        );

        res.json(result);
      } catch (err: any) {
        console.error("Failed to parse Python deep scanner JSON response:", err, output);
        res.status(500).json({ error: "Invalid JSON output from deep scanner script", raw: output });
      }
    });
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
    
    if (["toanweshbiswas@gmail.com", "buildwithjupyter.network@gmail.com"].includes(email as string)) {
      return res.json({ isAdmin: true });
    }
    if (!userId) return res.json({ isAdmin: false });
    
    try {
      const { data, error } = await supabase.from('users').select('role').eq('id', userId as string).single();
      if (error || !data) return res.json({ isAdmin: false });
      return res.json({ isAdmin: data.role === 'admin' });
    } catch (err) {
      return res.json({ isAdmin: false });
    }
  });

  // Email Notification API
  app.post("/api/notify-team-member", async (req, res) => {
    const { email, role, firstName } = req.body;
    const { GMAIL_USER, GMAIL_APP_PASSWORD } = process.env;

    if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
        console.error("Email configuration error: GMAIL_USER or GMAIL_APP_PASSWORD not found in environment.");
        return res.status(500).json({ error: "Email configuration missing on server" });
    }

    if (!email) {
        return res.status(400).json({ error: "Missing recipient email" });
    }

    console.log(`Attempting to send onboarding email to: ${email}`);

    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.default.createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD
      }
    });

    const portalLink = "https://yurekamoney.netlify.app/admin";
    const mailOptions = {
      from: `"Yureka Money" <${GMAIL_USER}>`,
      to: email,
      subject: "Welcome to Yureka Money Admin Dashboard",
      text: `Hi ${firstName || 'there'},\n\nAnwesh has added you as ${role}, to yureka.money, you can access the same using ${portalLink}, make sure due to nature of security you will get automatically logged out of the admin dashboard within 15 minutes of inactivity`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <p>Hi ${firstName || 'there'},</p>
          <p>Anwesh has added you as <strong>${role}</strong>, to <a href="https://yurekamoney.netlify.app">yurekamoney.netlify.app</a>.</p>
          <p>You can access the portal here: <a href="${portalLink}">${portalLink}</a></p>
          <p style="color: #666; font-size: 0.9em;">Important: For security purposes, you will be automatically logged out of the admin dashboard after 15 minutes of inactivity.</p>
          <p>Welcome aboard!</p>
        </div>
      `
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent successfully:", info.messageId);
      res.json({ success: true, messageId: info.messageId });
    } catch (error: any) {
      console.error("CRITICAL: Onboarding Email delivery failed:", error);
      res.status(500).json({ error: error.message, code: error.code });
    }
  });

  // --- Vite / Frontend Handling ---
  if (process.env.NODE_ENV !== "production") {
    // Dynamically import vite (devDependency) only in dev mode
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    // index: false — otherwise express.static auto-serves the raw index.html
    // for the exact "/" request (with its own ETag) before the catch-all
    // below ever runs, silently skipping meta injection on the homepage only.
    app.use(express.static(distPath, {
      index: false,
      maxAge: '1y',
      immutable: true,
      setHeaders(res, filePath) {
        // index.html must never be cached — it contains the runtime script tags
        if (filePath.endsWith('index.html')) {
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        }
      },
    }));

    // Read once at boot — every request injects route-specific meta into this
    // same cached template string, so crawlers that don't execute JS still
    // get a correct unique <title>/description/OG image/JSON-LD per URL.
    const indexTemplate = fs.readFileSync(path.resolve(distPath, 'index.html'), 'utf-8');

    // Express 5 requires named wildcard params — bare '*' is no longer valid
    app.get('/{*splat}', async (req, res) => {
      if (req.url.startsWith('/api')) {
        return res.status(404).json({ error: 'API not found' });
      }

      try {
        const resolved = await resolveRouteMeta(req.path, supabase);

        if (resolved.redirect) {
          return res.redirect(301, resolved.redirect);
        }

        const html = injectHtml(indexTemplate, resolved.meta, req.path, resolved.schemas);
        res.status(resolved.status).set('Content-Type', 'text/html; charset=utf-8').send(html);
      } catch (err) {
        console.warn('SEO meta injection failed, serving plain index.html:', err);
        res.sendFile(path.resolve(distPath, 'index.html'));
      }
    });
  }

  async function runDeepScannerBackground() {
    console.log("Auto-triggering background financial deep sync...");
    const { spawn } = await import("child_process");
    const pythonExecutable = fs.existsSync('./venv/bin/python3') ? './venv/bin/python3' : 'python3';
    const pythonProcess = spawn(pythonExecutable, [
      path.join(__dirname, "scripts", "scanner.py"),
      "",
      "{}"
    ]);
    let output = "";
    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });
    pythonProcess.on("close", async (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(output.trim());
          if (!result.error) {
            // Persist to Supabase in background
            await saveDataToSupabase(result.profile, result.transactions || []);

            const fs = await import("fs/promises");
            const cacheDir = path.join(__dirname, "data");
            try {
              await fs.mkdir(cacheDir, { recursive: true });
            } catch {}
            await fs.writeFile(
              path.join(cacheDir, "financial_cache.json"),
              JSON.stringify(result, null, 2)
            );
            console.log("Successfully updated daily financial deep cache!");
          }
        } catch (e) {
          console.error("Failed to parse background deep sync result:", e);
        }
      } else {
        console.error("Background daily sync failed with exit code:", code);
      }
    });
  }

  function scheduleDailySync() {
    console.log("Daily background email deep sync scheduled for 12:00 PM local time.");
    setInterval(async () => {
      const now = new Date();
      if (now.getHours() === 12 && now.getMinutes() === 0) {
        try {
          await runDeepScannerBackground();
        } catch (err) {
          console.error("Failed executing scheduled background sync:", err);
        }
      }
    }, 60000); // Check every 60 seconds
  }

  scheduleDailySync();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
