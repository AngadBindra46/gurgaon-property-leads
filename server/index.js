require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const { body, validationResult } = require("express-validator");
const crypto = require("crypto");
const path = require("path");
const db = require("./db");
const { requireAuth, mountAuthRoutes, getSession, COOKIE_SECRET } = require("./auth");

const app = express();
const PORT = process.env.PORT || 3000;

// ───────── Security Middleware ─────────

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.CORS_ORIGIN || true, credentials: true }));
app.use(cookieParser(process.env.COOKIE_SECRET || COOKIE_SECRET));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many submissions. Try again later." },
});

const webhookLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});

// ───────── CSRF Token System ─────────

const csrfTokens = new Map();

function generateCsrf() {
  const token = crypto.randomBytes(32).toString("hex");
  csrfTokens.set(token, Date.now() + 3600000);
  return token;
}

function verifyCsrf(token) {
  if (!token || !csrfTokens.has(token)) return false;
  const expiry = csrfTokens.get(token);
  csrfTokens.delete(token);
  return Date.now() < expiry;
}

setInterval(() => {
  const now = Date.now();
  for (const [t, exp] of csrfTokens) {
    if (now > exp) csrfTokens.delete(t);
  }
}, 600000);

// ───────── HMAC Verification ─────────

function verifyHmac(secret, payload, signature, algo = "sha256") {
  if (!secret || !signature) return false;
  const expected = crypto.createHmac(algo, secret).update(payload).digest("hex");
  const sig = signature.replace(/^sha256=|^sha1=/, "");
  try {
    return crypto.timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

// ───────── Validation Rules ─────────

const leadValidation = [
  body("name").trim().notEmpty().withMessage("Name is required").escape(),
  body("phone").trim().notEmpty().withMessage("Phone is required")
    .matches(/^[+\d\s()-]{7,20}$/).withMessage("Invalid phone number").escape(),
  body("email").optional({ values: "falsy" }).trim().isEmail().withMessage("Invalid email").normalizeEmail(),
  body("leadType").optional().isIn(["buyer", "seller", "rental"]),
  body("propertyType").optional().trim().escape(),
  body("area").optional().trim().escape(),
  body("budgetMin").optional().isInt({ min: 0 }).toInt(),
  body("budgetMax").optional().isInt({ min: 0 }).toInt(),
  body("timeline").optional().trim().escape(),
  body("status").optional().isIn(["new", "contacted", "interested", "site-visit", "negotiating", "closed", "lost"]),
  body("source").optional().trim().escape(),
  body("projects").optional().trim().escape(),
  body("notes").optional().trim().escape(),
];

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: "Validation failed", details: errors.array() });
  }
  next();
}

// ───────── Auth ─────────

const root = path.join(__dirname, "..");
mountAuthRoutes(app);

app.get("/login.html", (req, res) => res.sendFile(path.join(root, "login.html")));

// Gate dashboard behind auth (public forms stay open)
app.get("/", (req, res) => {
  if (!getSession(req)) return res.redirect("/login.html");
  res.sendFile(path.join(root, "index.html"));
});

// Public pages (no auth needed)
app.get("/form.html", (req, res) => res.sendFile(path.join(root, "form.html")));
app.get("/landing.html", (req, res) => res.sendFile(path.join(root, "landing.html")));

// ───────── Serve Static Files ─────────

app.use(express.static(root));

// ───────── API: CSRF Token ─────────

app.get("/api/csrf-token", (_req, res) => {
  res.json({ token: generateCsrf() });
});

// ───────── Protected API routes ─────────
app.use("/api/leads", (req, res, next) => {
  if (req.path === "/public" || req.path === "/landing") return next();
  requireAuth(req, res, next);
});
app.use("/api/properties", requireAuth);
app.use("/api/stats", requireAuth);

// ───────── API: Leads CRUD ─────────

app.get("/api/leads", apiLimiter, (_req, res) => {
  res.json(db.getAllLeads());
});

app.get("/api/leads/:id", apiLimiter, (req, res) => {
  const lead = db.getLeadById(req.params.id);
  if (!lead) return res.status(404).json({ error: "Lead not found" });
  res.json(lead);
});

app.post("/api/leads", apiLimiter, leadValidation, handleValidation, (req, res) => {
  const lead = db.createLead({ ...req.body, source: req.body.source || "Manual" });
  res.status(201).json(lead);
});

app.put("/api/leads/:id", apiLimiter, leadValidation, handleValidation, (req, res) => {
  const lead = db.updateLead(req.params.id, req.body);
  if (!lead) return res.status(404).json({ error: "Lead not found" });
  res.json(lead);
});

app.delete("/api/leads/:id", apiLimiter, (req, res) => {
  const ok = db.deleteLead(req.params.id);
  if (!ok) return res.status(404).json({ error: "Lead not found" });
  res.json({ success: true });
});

app.get("/api/stats", apiLimiter, (_req, res) => {
  res.json(db.getStats());
});

// ───────── API: Properties CRUD ─────────

app.get("/api/properties", apiLimiter, (_req, res) => {
  res.json(db.getAllProperties());
});

app.get("/api/properties/:id", apiLimiter, (req, res) => {
  const prop = db.getPropertyById(req.params.id);
  if (!prop) return res.status(404).json({ error: "Property not found" });
  res.json(prop);
});

app.post("/api/properties", apiLimiter, (req, res) => {
  const prop = db.createProperty(req.body);
  res.status(201).json(prop);
});

app.put("/api/properties/:id", apiLimiter, (req, res) => {
  const prop = db.updateProperty(req.params.id, req.body);
  if (!prop) return res.status(404).json({ error: "Property not found" });
  res.json(prop);
});

app.delete("/api/properties/:id", apiLimiter, (req, res) => {
  const ok = db.deleteProperty(req.params.id);
  if (!ok) return res.status(404).json({ error: "Property not found" });
  res.json({ success: true });
});

// ───────── API: Lead-Property Linking ─────────

app.get("/api/leads/:id/properties", apiLimiter, (req, res) => {
  res.json(db.getPropertiesForLead(req.params.id));
});

app.post("/api/leads/:id/properties", apiLimiter, (req, res) => {
  const { propertyId, matchType } = req.body;
  if (!propertyId) return res.status(400).json({ error: "propertyId is required" });
  db.linkProperty(req.params.id, propertyId, matchType);
  res.json({ success: true });
});

app.delete("/api/leads/:leadId/properties/:propId", apiLimiter, (req, res) => {
  db.unlinkProperty(req.params.leadId, req.params.propId);
  res.json({ success: true });
});

app.get("/api/properties/:id/leads", apiLimiter, (req, res) => {
  res.json(db.getLeadsForProperty(req.params.id));
});

// ───────── Public Form Submission ─────────

app.post(
  "/api/leads/public",
  formLimiter,
  leadValidation,
  body("consent").equals("true").withMessage("Consent is required"),
  handleValidation,
  async (req, res) => {
    const csrfToken = req.headers["x-csrf-token"];
    if (!verifyCsrf(csrfToken)) {
      return res.status(403).json({ error: "Invalid or expired form token. Please refresh and try again." });
    }

    if (process.env.RECAPTCHA_SECRET_KEY && !process.env.RECAPTCHA_SECRET_KEY.startsWith("dev-")) {
      const recaptchaToken = req.body.recaptchaToken;
      if (recaptchaToken) {
        try {
          const resp = await fetch(
            `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`
          );
          const data = await resp.json();
          if (!data.success || data.score < 0.5) {
            return res.status(403).json({ error: "reCAPTCHA verification failed." });
          }
        } catch {
          console.error("reCAPTCHA verification error");
        }
      }
    }

    const lead = db.createLead({ ...req.body, source: "Public Form" });
    res.status(201).json({ success: true, message: "Your inquiry has been submitted.", id: lead.id });
  }
);

// ───────── Landing Page Submission ─────────

app.post(
  "/api/leads/landing",
  formLimiter,
  leadValidation,
  body("consent").equals("true").withMessage("Consent is required"),
  handleValidation,
  (req, res) => {
    const lead = db.createLead({ ...req.body, source: "Landing Page" });
    res.status(201).json({ success: true, message: "Thank you! We will contact you shortly.", id: lead.id });
  }
);

// ───────── Webhook: 99acres ─────────

app.post("/api/webhook/99acres", webhookLimiter, (req, res) => {
  const signature = req.headers["x-signature"] || req.headers["x-hub-signature-256"] || "";
  const rawBody = JSON.stringify(req.body);

  if (process.env.WEBHOOK_SECRET_99ACRES && !process.env.WEBHOOK_SECRET_99ACRES.startsWith("dev-")) {
    if (!verifyHmac(process.env.WEBHOOK_SECRET_99ACRES, rawBody, signature)) {
      console.warn("[99acres] Invalid webhook signature");
      return res.status(401).json({ error: "Invalid signature" });
    }
  }

  try {
    const d = req.body;
    const lead = db.createLead({
      name: d.name || d.buyer_name || d.contact_name || "99acres Lead",
      phone: d.phone || d.mobile || d.contact_number || "",
      email: d.email || d.contact_email || "",
      leadType: "buyer",
      propertyType: d.property_type || d.bhk || "",
      area: d.locality || d.area || d.location || "",
      budgetMin: parseInt(d.budget_min || d.min_budget || 0, 10),
      budgetMax: parseInt(d.budget_max || d.max_budget || 0, 10),
      timeline: d.timeline || "",
      status: "new",
      source: "99acres",
      notes: d.message || d.requirement || "",
    });
    console.log(`[99acres] Lead captured: ${lead.name} (${lead.phone})`);
    res.json({ success: true, id: lead.id });
  } catch (err) {
    console.error("[99acres] Webhook error:", err.message);
    res.status(500).json({ error: "Processing failed" });
  }
});

// ───────── Webhook: Housing.com ─────────

app.post("/api/webhook/housing", webhookLimiter, (req, res) => {
  const signature = req.headers["x-signature"] || req.headers["x-hub-signature-256"] || "";
  const rawBody = JSON.stringify(req.body);

  if (process.env.WEBHOOK_SECRET_HOUSING && !process.env.WEBHOOK_SECRET_HOUSING.startsWith("dev-")) {
    if (!verifyHmac(process.env.WEBHOOK_SECRET_HOUSING, rawBody, signature)) {
      console.warn("[Housing.com] Invalid webhook signature");
      return res.status(401).json({ error: "Invalid signature" });
    }
  }

  try {
    const d = req.body;
    const lead = db.createLead({
      name: d.name || d.lead_name || "Housing.com Lead",
      phone: d.phone || d.mobile || d.contact_phone || "",
      email: d.email || d.lead_email || "",
      leadType: "buyer",
      propertyType: d.property_type || d.configuration || "",
      area: d.locality || d.project_location || d.area || "",
      budgetMin: parseInt(d.budget_min || d.min_price || 0, 10),
      budgetMax: parseInt(d.budget_max || d.max_price || 0, 10),
      timeline: d.timeline || d.possession || "",
      status: "new",
      source: "Housing.com",
      notes: d.message || d.requirement || "",
    });
    console.log(`[Housing.com] Lead captured: ${lead.name} (${lead.phone})`);
    res.json({ success: true, id: lead.id });
  } catch (err) {
    console.error("[Housing.com] Webhook error:", err.message);
    res.status(500).json({ error: "Processing failed" });
  }
});

// ───────── Webhook: WhatsApp Business API ─────────

const waConversations = new Map();

app.get("/api/webhook/whatsapp", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    console.log("[WhatsApp] Webhook verified");
    return res.status(200).send(challenge);
  }
  res.sendStatus(403);
});

app.post("/api/webhook/whatsapp", webhookLimiter, (req, res) => {
  const signature = req.headers["x-hub-signature-256"] || "";
  const rawBody = JSON.stringify(req.body);

  if (process.env.WHATSAPP_APP_SECRET && !process.env.WHATSAPP_APP_SECRET.startsWith("dev-")) {
    if (!verifyHmac(process.env.WHATSAPP_APP_SECRET, rawBody, signature)) {
      console.warn("[WhatsApp] Invalid webhook signature");
      return res.sendStatus(401);
    }
  }

  res.sendStatus(200);

  try {
    const entry = req.body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const messages = changes?.value?.messages;
    if (!messages || messages.length === 0) return;

    const msg = messages[0];
    const from = msg.from;
    const text = (msg.text?.body || "").trim();

    if (!waConversations.has(from)) {
      waConversations.set(from, { step: 0, data: { phone: from } });
      sendWhatsAppMessage(from, "Welcome to Gurgaon Property Search! I'll help you find your perfect property.\n\nWhat type of property are you looking for?\n\n1. 1 BHK\n2. 2 BHK\n3. 3 BHK\n4. 4 BHK\n5. Villa\n6. Plot\n7. Commercial");
      return;
    }

    const convo = waConversations.get(from);

    switch (convo.step) {
      case 0: {
        const types = { "1": "1BHK", "2": "2BHK", "3": "3BHK", "4": "4BHK", "5": "Villa", "6": "Plot", "7": "Commercial" };
        convo.data.propertyType = types[text] || text;
        convo.step = 1;
        sendWhatsAppMessage(from, "Which area in Gurgaon are you interested in?\n\n1. Golf Course Road\n2. Dwarka Expressway\n3. Sohna Road\n4. DLF Phase 1-5\n5. New Gurgaon (Sec 82-95)\n6. Other (type the area name)");
        break;
      }
      case 1: {
        const areas = { "1": "Golf Course Road", "2": "Dwarka Expressway", "3": "Sohna Road", "4": "DLF Phase 1-5", "5": "New Gurgaon (Sec 82-95)" };
        convo.data.area = areas[text] || text;
        convo.step = 2;
        sendWhatsAppMessage(from, "What is your budget range?\n\n1. Under ₹50 Lakh\n2. ₹50L - ₹1 Cr\n3. ₹1 Cr - ₹2 Cr\n4. ₹2 Cr - ₹5 Cr\n5. ₹5 Cr - ₹10 Cr\n6. Above ₹10 Cr");
        break;
      }
      case 2: {
        const budgets = {
          "1": { min: 0, max: 5000000 },
          "2": { min: 5000000, max: 10000000 },
          "3": { min: 10000000, max: 20000000 },
          "4": { min: 20000000, max: 50000000 },
          "5": { min: 50000000, max: 100000000 },
          "6": { min: 100000000, max: 999999999 },
        };
        const b = budgets[text] || { min: 0, max: 0 };
        convo.data.budgetMin = b.min;
        convo.data.budgetMax = b.max;
        convo.step = 3;
        sendWhatsAppMessage(from, "Please share your name so we can reach out to you:");
        break;
      }
      case 3: {
        convo.data.name = text;
        convo.step = 4;

        const lead = db.createLead({
          name: convo.data.name,
          phone: convo.data.phone,
          leadType: "buyer",
          propertyType: convo.data.propertyType,
          area: convo.data.area,
          budgetMin: convo.data.budgetMin,
          budgetMax: convo.data.budgetMax,
          status: "new",
          source: "WhatsApp",
        });

        sendWhatsAppMessage(from,
          `Thank you, ${convo.data.name}! Your property inquiry has been registered.\n\n` +
          `Property: ${convo.data.propertyType}\n` +
          `Area: ${convo.data.area}\n\n` +
          `Our team will contact you shortly with the best options. You can also message us anytime with questions!`
        );

        console.log(`[WhatsApp] Lead captured: ${lead.name} (${lead.phone})`);
        waConversations.delete(from);
        break;
      }
      default:
        waConversations.delete(from);
        sendWhatsAppMessage(from, "Let's start fresh! What type of property are you looking for?\n\n1. 1 BHK\n2. 2 BHK\n3. 3 BHK\n4. 4 BHK\n5. Villa\n6. Plot\n7. Commercial");
        waConversations.set(from, { step: 0, data: { phone: from } });
    }
  } catch (err) {
    console.error("[WhatsApp] Processing error:", err.message);
  }
});

async function sendWhatsAppMessage(to, text) {
  if (!process.env.WHATSAPP_ACCESS_TOKEN || process.env.WHATSAPP_ACCESS_TOKEN.startsWith("dev-")) {
    console.log(`[WhatsApp][DEV] Would send to ${to}: ${text.slice(0, 80)}...`);
    return;
  }

  try {
    await fetch(
      `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          type: "text",
          text: { body: text },
        }),
      }
    );
  } catch (err) {
    console.error("[WhatsApp] Send error:", err.message);
  }
}

// ───────── Webhook: Facebook Lead Ads ─────────

app.get("/api/webhook/facebook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.FACEBOOK_VERIFY_TOKEN) {
    console.log("[Facebook] Webhook verified");
    return res.status(200).send(challenge);
  }
  res.sendStatus(403);
});

app.post("/api/webhook/facebook", webhookLimiter, async (req, res) => {
  const signature = req.headers["x-hub-signature-256"] || req.headers["x-hub-signature"] || "";
  const rawBody = JSON.stringify(req.body);

  if (process.env.FACEBOOK_APP_SECRET && !process.env.FACEBOOK_APP_SECRET.startsWith("dev-")) {
    const algo = signature.startsWith("sha1=") ? "sha1" : "sha256";
    if (!verifyHmac(process.env.FACEBOOK_APP_SECRET, rawBody, signature, algo)) {
      console.warn("[Facebook] Invalid webhook signature");
      return res.sendStatus(401);
    }
  }

  res.sendStatus(200);

  try {
    const entries = req.body?.entry || [];
    for (const entry of entries) {
      const changes = entry.changes || [];
      for (const change of changes) {
        if (change.field !== "leadgen") continue;
        const leadgenId = change.value?.leadgen_id;
        if (!leadgenId) continue;

        const leadData = await fetchFacebookLead(leadgenId);
        if (!leadData) continue;

        const fields = {};
        (leadData.field_data || []).forEach((f) => {
          fields[f.name.toLowerCase()] = f.values?.[0] || "";
        });

        const lead = db.createLead({
          name: fields.full_name || fields.name || "Facebook Lead",
          phone: fields.phone_number || fields.phone || "",
          email: fields.email || "",
          leadType: "buyer",
          propertyType: fields.property_type || fields.bhk || "",
          area: fields.area || fields.location || fields.city || "",
          budgetMin: parseInt(fields.budget_min || fields.min_budget || 0, 10),
          budgetMax: parseInt(fields.budget_max || fields.max_budget || 0, 10),
          status: "new",
          source: "Facebook Ads",
          notes: fields.comments || fields.message || "",
        });

        console.log(`[Facebook] Lead captured: ${lead.name} (${lead.phone})`);
      }
    }
  } catch (err) {
    console.error("[Facebook] Webhook error:", err.message);
  }
});

async function fetchFacebookLead(leadgenId) {
  if (!process.env.FACEBOOK_PAGE_ACCESS_TOKEN || process.env.FACEBOOK_PAGE_ACCESS_TOKEN.startsWith("dev-")) {
    console.log(`[Facebook][DEV] Would fetch lead ${leadgenId}`);
    return null;
  }
  try {
    const resp = await fetch(
      `https://graph.facebook.com/v18.0/${leadgenId}?access_token=${process.env.FACEBOOK_PAGE_ACCESS_TOKEN}`
    );
    return await resp.json();
  } catch (err) {
    console.error("[Facebook] Lead fetch error:", err.message);
    return null;
  }
}

// ───────── Start ─────────

app.listen(PORT, () => {
  console.log(`\n  Gurgaon Property Leads Server`);
  console.log(`  ─────────────────────────────`);
  console.log(`  Dashboard:     http://localhost:${PORT}`);
  console.log(`  Public Form:   http://localhost:${PORT}/form.html`);
  console.log(`  Landing Page:  http://localhost:${PORT}/landing.html`);
  console.log(`  API:           http://localhost:${PORT}/api/leads`);
  console.log(`\n  Webhook endpoints:`);
  console.log(`  99acres:       POST /api/webhook/99acres`);
  console.log(`  Housing.com:   POST /api/webhook/housing`);
  console.log(`  WhatsApp:      POST /api/webhook/whatsapp`);
  console.log(`  Facebook Ads:  POST /api/webhook/facebook\n`);
});
