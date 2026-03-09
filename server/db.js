const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "leads.db"));

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id            TEXT PRIMARY KEY,
    name          TEXT NOT NULL,
    phone         TEXT NOT NULL,
    email         TEXT DEFAULT '',
    lead_type     TEXT NOT NULL DEFAULT 'buyer',
    property_type TEXT NOT NULL DEFAULT '',
    area          TEXT NOT NULL DEFAULT '',
    budget_min    INTEGER DEFAULT 0,
    budget_max    INTEGER DEFAULT 0,
    timeline      TEXT DEFAULT '',
    status        TEXT NOT NULL DEFAULT 'new',
    source        TEXT DEFAULT 'Manual',
    projects      TEXT DEFAULT '',
    notes         TEXT DEFAULT '',
    created_at    INTEGER NOT NULL,
    updated_at    INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
  CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
  CREATE INDEX IF NOT EXISTS idx_leads_area   ON leads(area);

  CREATE TABLE IF NOT EXISTS properties (
    id            TEXT PRIMARY KEY,
    title         TEXT NOT NULL,
    project       TEXT DEFAULT '',
    developer     TEXT DEFAULT '',
    property_type TEXT NOT NULL DEFAULT '',
    bedrooms      TEXT DEFAULT '',
    area          TEXT NOT NULL DEFAULT '',
    city          TEXT NOT NULL DEFAULT '',
    price         INTEGER DEFAULT 0,
    price_per_sqft INTEGER DEFAULT 0,
    carpet_area   TEXT DEFAULT '',
    status        TEXT NOT NULL DEFAULT 'available',
    possession    TEXT DEFAULT '',
    rera_id       TEXT DEFAULT '',
    amenities     TEXT DEFAULT '',
    description   TEXT DEFAULT '',
    listing_url   TEXT DEFAULT '',
    created_at    INTEGER NOT NULL,
    updated_at    INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_prop_city   ON properties(city);
  CREATE INDEX IF NOT EXISTS idx_prop_area   ON properties(area);
  CREATE INDEX IF NOT EXISTS idx_prop_type   ON properties(property_type);
  CREATE INDEX IF NOT EXISTS idx_prop_status ON properties(status);

  CREATE TABLE IF NOT EXISTS lead_properties (
    lead_id     TEXT NOT NULL,
    property_id TEXT NOT NULL,
    match_type  TEXT DEFAULT 'manual',
    created_at  INTEGER NOT NULL,
    PRIMARY KEY (lead_id, property_id),
    FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
  );
`);

const ownerCols = ["owner_name", "owner_phone", "owner_email", "owner_address"];
for (const col of ownerCols) {
  try { db.exec(`ALTER TABLE properties ADD COLUMN ${col} TEXT DEFAULT ''`); } catch {}
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function sanitizeText(val) {
  if (typeof val !== "string") return "";
  return val.replace(/<[^>]*>/g, "").trim().slice(0, 1000);
}

const stmts = {
  insert: db.prepare(`
    INSERT INTO leads (id, name, phone, email, lead_type, property_type, area,
      budget_min, budget_max, timeline, status, source, projects, notes,
      created_at, updated_at)
    VALUES (@id, @name, @phone, @email, @leadType, @propertyType, @area,
      @budgetMin, @budgetMax, @timeline, @status, @source, @projects, @notes,
      @createdAt, @updatedAt)
  `),
  update: db.prepare(`
    UPDATE leads SET name=@name, phone=@phone, email=@email, lead_type=@leadType,
      property_type=@propertyType, area=@area, budget_min=@budgetMin,
      budget_max=@budgetMax, timeline=@timeline, status=@status, source=@source,
      projects=@projects, notes=@notes, updated_at=@updatedAt
    WHERE id=@id
  `),
  getAll: db.prepare("SELECT * FROM leads ORDER BY created_at DESC"),
  getById: db.prepare("SELECT * FROM leads WHERE id = ?"),
  deleteById: db.prepare("DELETE FROM leads WHERE id = ?"),
  countBySource: db.prepare("SELECT source, COUNT(*) as cnt FROM leads GROUP BY source"),
  countByStatus: db.prepare("SELECT status, COUNT(*) as cnt FROM leads GROUP BY status"),
};

function rowToLead(r) {
  return {
    id: r.id,
    name: r.name,
    phone: r.phone,
    email: r.email,
    leadType: r.lead_type,
    propertyType: r.property_type,
    area: r.area,
    budgetMin: r.budget_min,
    budgetMax: r.budget_max,
    timeline: r.timeline,
    status: r.status,
    source: r.source,
    projects: r.projects,
    notes: r.notes,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

exports.createLead = function (data) {
  const now = Date.now();
  const lead = {
    id: genId(),
    name: sanitizeText(data.name),
    phone: sanitizeText(data.phone),
    email: sanitizeText(data.email || ""),
    leadType: sanitizeText(data.leadType || "buyer"),
    propertyType: sanitizeText(data.propertyType || ""),
    area: sanitizeText(data.area || ""),
    budgetMin: parseInt(data.budgetMin, 10) || 0,
    budgetMax: parseInt(data.budgetMax, 10) || 0,
    timeline: sanitizeText(data.timeline || ""),
    status: sanitizeText(data.status || "new"),
    source: sanitizeText(data.source || "Manual"),
    projects: sanitizeText(data.projects || ""),
    notes: sanitizeText(data.notes || ""),
    createdAt: now,
    updatedAt: now,
  };
  stmts.insert.run(lead);
  return lead;
};

exports.updateLead = function (id, data) {
  const existing = stmts.getById.get(id);
  if (!existing) return null;
  const updated = {
    id,
    name: sanitizeText(data.name ?? existing.name),
    phone: sanitizeText(data.phone ?? existing.phone),
    email: sanitizeText(data.email ?? existing.email),
    leadType: sanitizeText(data.leadType ?? existing.lead_type),
    propertyType: sanitizeText(data.propertyType ?? existing.property_type),
    area: sanitizeText(data.area ?? existing.area),
    budgetMin: parseInt(data.budgetMin ?? existing.budget_min, 10) || 0,
    budgetMax: parseInt(data.budgetMax ?? existing.budget_max, 10) || 0,
    timeline: sanitizeText(data.timeline ?? existing.timeline),
    status: sanitizeText(data.status ?? existing.status),
    source: sanitizeText(data.source ?? existing.source),
    projects: sanitizeText(data.projects ?? existing.projects),
    notes: sanitizeText(data.notes ?? existing.notes),
    updatedAt: Date.now(),
  };
  stmts.update.run(updated);
  return rowToLead(stmts.getById.get(id));
};

exports.getAllLeads = function () {
  return stmts.getAll.all().map(rowToLead);
};

exports.getLeadById = function (id) {
  const r = stmts.getById.get(id);
  return r ? rowToLead(r) : null;
};

exports.deleteLead = function (id) {
  const info = stmts.deleteById.run(id);
  return info.changes > 0;
};

exports.getStats = function () {
  return {
    bySource: stmts.countBySource.all(),
    byStatus: stmts.countByStatus.all(),
  };
};

// ───────── Properties ─────────

const propStmts = {
  insert: db.prepare(`
    INSERT INTO properties (id, title, project, developer, property_type, bedrooms, area, city,
      price, price_per_sqft, carpet_area, status, possession, rera_id, amenities, description,
      listing_url, owner_name, owner_phone, owner_email, owner_address, created_at, updated_at)
    VALUES (@id, @title, @project, @developer, @propertyType, @bedrooms, @area, @city,
      @price, @pricePerSqft, @carpetArea, @status, @possession, @reraId, @amenities, @description,
      @listingUrl, @ownerName, @ownerPhone, @ownerEmail, @ownerAddress, @createdAt, @updatedAt)
  `),
  update: db.prepare(`
    UPDATE properties SET title=@title, project=@project, developer=@developer,
      property_type=@propertyType, bedrooms=@bedrooms, area=@area, city=@city,
      price=@price, price_per_sqft=@pricePerSqft, carpet_area=@carpetArea,
      status=@status, possession=@possession, rera_id=@reraId, amenities=@amenities,
      description=@description, listing_url=@listingUrl,
      owner_name=@ownerName, owner_phone=@ownerPhone, owner_email=@ownerEmail,
      owner_address=@ownerAddress, updated_at=@updatedAt
    WHERE id=@id
  `),
  getAll: db.prepare("SELECT * FROM properties ORDER BY created_at DESC"),
  getById: db.prepare("SELECT * FROM properties WHERE id = ?"),
  deleteById: db.prepare("DELETE FROM properties WHERE id = ?"),
};

function rowToProp(r) {
  return {
    id: r.id, title: r.title, project: r.project, developer: r.developer,
    propertyType: r.property_type, bedrooms: r.bedrooms, area: r.area, city: r.city,
    price: r.price, pricePerSqft: r.price_per_sqft, carpetArea: r.carpet_area,
    status: r.status, possession: r.possession, reraId: r.rera_id,
    amenities: r.amenities, description: r.description, listingUrl: r.listing_url,
    ownerName: r.owner_name, ownerPhone: r.owner_phone,
    ownerEmail: r.owner_email, ownerAddress: r.owner_address,
    createdAt: r.created_at, updatedAt: r.updated_at,
  };
}

exports.createProperty = function (data) {
  const now = Date.now();
  const prop = {
    id: genId(),
    title: sanitizeText(data.title),
    project: sanitizeText(data.project || ""),
    developer: sanitizeText(data.developer || ""),
    propertyType: sanitizeText(data.propertyType || ""),
    bedrooms: sanitizeText(data.bedrooms || ""),
    area: sanitizeText(data.area || ""),
    city: sanitizeText(data.city || ""),
    price: parseInt(data.price, 10) || 0,
    pricePerSqft: parseInt(data.pricePerSqft, 10) || 0,
    carpetArea: sanitizeText(data.carpetArea || ""),
    status: sanitizeText(data.status || "available"),
    possession: sanitizeText(data.possession || ""),
    reraId: sanitizeText(data.reraId || ""),
    amenities: sanitizeText(data.amenities || ""),
    description: sanitizeText(data.description || ""),
    listingUrl: sanitizeText(data.listingUrl || ""),
    ownerName: sanitizeText(data.ownerName || ""),
    ownerPhone: sanitizeText(data.ownerPhone || ""),
    ownerEmail: sanitizeText(data.ownerEmail || ""),
    ownerAddress: sanitizeText(data.ownerAddress || ""),
    createdAt: data.createdAt || now,
    updatedAt: now,
  };
  propStmts.insert.run(prop);
  return prop;
};

exports.updateProperty = function (id, data) {
  const existing = propStmts.getById.get(id);
  if (!existing) return null;
  const updated = {
    id,
    title: sanitizeText(data.title ?? existing.title),
    project: sanitizeText(data.project ?? existing.project),
    developer: sanitizeText(data.developer ?? existing.developer),
    propertyType: sanitizeText(data.propertyType ?? existing.property_type),
    bedrooms: sanitizeText(data.bedrooms ?? existing.bedrooms),
    area: sanitizeText(data.area ?? existing.area),
    city: sanitizeText(data.city ?? existing.city),
    price: parseInt(data.price ?? existing.price, 10) || 0,
    pricePerSqft: parseInt(data.pricePerSqft ?? existing.price_per_sqft, 10) || 0,
    carpetArea: sanitizeText(data.carpetArea ?? existing.carpet_area),
    status: sanitizeText(data.status ?? existing.status),
    possession: sanitizeText(data.possession ?? existing.possession),
    reraId: sanitizeText(data.reraId ?? existing.rera_id),
    amenities: sanitizeText(data.amenities ?? existing.amenities),
    description: sanitizeText(data.description ?? existing.description),
    listingUrl: sanitizeText(data.listingUrl ?? existing.listing_url),
    ownerName: sanitizeText(data.ownerName ?? existing.owner_name),
    ownerPhone: sanitizeText(data.ownerPhone ?? existing.owner_phone),
    ownerEmail: sanitizeText(data.ownerEmail ?? existing.owner_email),
    ownerAddress: sanitizeText(data.ownerAddress ?? existing.owner_address),
    updatedAt: Date.now(),
  };
  propStmts.update.run(updated);
  return rowToProp(propStmts.getById.get(id));
};

exports.getAllProperties = function () {
  return propStmts.getAll.all().map(rowToProp);
};

exports.getPropertyById = function (id) {
  const r = propStmts.getById.get(id);
  return r ? rowToProp(r) : null;
};

exports.deleteProperty = function (id) {
  return propStmts.deleteById.run(id).changes > 0;
};

// ───────── Lead-Property Linking ─────────

const linkStmts = {
  link: db.prepare("INSERT OR IGNORE INTO lead_properties (lead_id, property_id, match_type, created_at) VALUES (?, ?, ?, ?)"),
  unlink: db.prepare("DELETE FROM lead_properties WHERE lead_id = ? AND property_id = ?"),
  getByLead: db.prepare("SELECT p.* FROM properties p JOIN lead_properties lp ON p.id = lp.property_id WHERE lp.lead_id = ? ORDER BY p.price"),
  getByProperty: db.prepare("SELECT l.* FROM leads l JOIN lead_properties lp ON l.id = lp.lead_id WHERE lp.property_id = ? ORDER BY l.created_at DESC"),
  getLinks: db.prepare("SELECT * FROM lead_properties WHERE lead_id = ?"),
};

exports.linkProperty = function (leadId, propertyId, matchType) {
  linkStmts.link.run(leadId, propertyId, matchType || "manual", Date.now());
};

exports.unlinkProperty = function (leadId, propertyId) {
  return linkStmts.unlink.run(leadId, propertyId).changes > 0;
};

exports.getPropertiesForLead = function (leadId) {
  return linkStmts.getByLead.all(leadId).map(rowToProp);
};

exports.getLeadsForProperty = function (propertyId) {
  return linkStmts.getByProperty.all(propertyId).map(rowToLead);
};

exports.getLinksForLead = function (leadId) {
  return linkStmts.getLinks.all(leadId);
};
