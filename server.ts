import express from "express";
import compression from "compression";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import cors from "cors";
import * as dotenv from "dotenv";
import { resolveRouteMeta } from "./lib/seo/resolveRouteMeta";
import { injectHtml } from "./lib/seo/inject";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


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



  // Get cached financial transactions & profile
  app.get("/api/financial-ledger", async (req, res) => {
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

  // Fast profile-only lookup (name/phone/dob/age/gender/location) — skips the
  // slow Gmail inbox scan so Step 1 of the waitlist can move on immediately.
  app.post("/api/scan-profile", async (req, res) => {
    const { accessToken, fallbackData } = req.body;
    const { spawn } = await import("child_process");
    const pythonExecutable = fs.existsSync('./venv/bin/python3') ? './venv/bin/python3' : 'python3';
    const pythonProcess = spawn(pythonExecutable, [
      path.join(__dirname, "scripts", "scanner.py"),
      accessToken || "",
      JSON.stringify(fallbackData || {}),
      "profile_only"
    ]);

    let output = "";
    let errorOutput = "";

    pythonProcess.stdout.on("data", (data) => { output += data.toString(); });
    pythonProcess.stderr.on("data", (data) => { errorOutput += data.toString(); });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        console.error("Python profile lookup failed with exit code:", code, errorOutput);
        return res.status(500).json({ error: "Profile lookup script failed to execute", details: errorOutput });
      }
      try {
        const result = JSON.parse(output.trim());
        if (result.error) {
          return res.status(400).json({ error: result.error });
        }
        res.json(result);
      } catch (err: any) {
        console.error("Failed to parse Python profile lookup JSON response:", err, output);
        res.status(500).json({ error: "Invalid JSON output from profile lookup script", raw: output });
      }
    });
  });

  // Email Deep Scanner API — runs the full inbox scan + Yureka Score. This is
  // slow (can take a minute+), so the frontend fires it in the background and
  // doesn't block on the response; once done, we email the user their score.
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

        // Cache success output locally
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

        const recipient = email || result.profile?.email;
        if (recipient) {
          persistToSupabase(recipient, result.profile, result.score).catch(err =>
            console.error("Failed to persist scan result to Supabase:", err)
          );
        }
        if (recipient && result.score) {
          sendScoreEmail(recipient, result.profile, result.score).catch(err =>
            console.error("Failed to send Yureka Score email:", err)
          );
        }
      } catch (err: any) {
        console.error("Failed to parse Python deep scanner JSON response:", err, output);
        res.status(500).json({ error: "Invalid JSON output from deep scanner script", raw: output });
      }
    });
  });

  // Forwards the already-scanned profile/score to the Java backend (yureka-be),
  // which owns the Supabase Postgres connection, so the waitlist row gets the
  // score without re-scanning Gmail.
  async function persistToSupabase(email: string, profile: any, score: any) {
    const apiBase = process.env.VITE_API_BASE_URL || "http://localhost:8080";
    const res = await fetch(`${apiBase}/api/v1/ledger/ingest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, profile, score }),
    });
    if (!res.ok) {
      throw new Error(`Ingest failed with status ${res.status}: ${await res.text()}`);
    }
    console.log(`Persisted scan result for ${email} to Supabase.`);
  }

  async function sendScoreEmail(recipient: string, profile: any, score: any) {
    const { GMAIL_USER, GMAIL_APP_PASSWORD } = process.env;
    if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
      console.warn("Skipping Yureka Score email — GMAIL_USER/GMAIL_APP_PASSWORD not configured.");
      return;
    }
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.default.createTransport({
      service: 'gmail',
      auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD }
    });
    const firstName = (profile?.name || '').split(' ')[0] || 'there';
    await transporter.sendMail({
      from: `"Yureka One" <${GMAIL_USER}>`,
      to: recipient,
      subject: `Your Yureka Score is ready: ${score.score}/100`,
      text: `Hi ${firstName},\n\nWe finished analysing your inbox. Your Yureka Score is ${score.score}/100 (${score.decision}).\n\nLog in to yureka.one to see your full spending breakdown.\n\n— Team Yureka`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <p>Hi ${firstName},</p>
          <p>We finished analysing your inbox. Your <strong>Yureka Score</strong> is <strong>${score.score}/100</strong> (${score.decision}).</p>
          <p>Log in to <a href="https://yureka.one">yureka.one</a> to see your full spending breakdown.</p>
          <p>— Team Yureka</p>
        </div>
      `
    });
    console.log(`Yureka Score email sent to ${recipient}`);
  }



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

    const portalLink = "https://yureka.one/admin";
    const mailOptions = {
      from: `"Yureka One" <${GMAIL_USER}>`,
      to: email,
      subject: "Welcome to Yureka One Admin Dashboard",
      text: `Hi ${firstName || 'there'},\n\nAnwesh has added you as ${role}, to yureka.one, you can access the same using ${portalLink}, make sure due to nature of security you will get automatically logged out of the admin dashboard within 15 minutes of inactivity`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <p>Hi ${firstName || 'there'},</p>
          <p>Anwesh has added you as <strong>${role}</strong>, to <a href="https://yureka.one">yureka.one</a>.</p>
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
        const resolved = await resolveRouteMeta(req.path);

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
