const API = "/api";

// ──── Auth ────
function showUser() {
  try {
    const u = JSON.parse(localStorage.getItem("gl_user"));
    const el = document.getElementById("navUser");
    if (u && el) el.textContent = u.name || u.email;
  } catch {}
}

async function logout() {
  await fetch("/api/auth/logout", { method: "POST" });
  localStorage.removeItem("gl_user");
  window.location.href = "/login.html";
}

const _origFetch = window.fetch;
window.fetch = async function (...args) {
  const res = await _origFetch.apply(this, args);
  if (res.status === 401 && !String(args[0]).includes("/api/auth/")) {
    window.location.href = "/login.html";
    return res;
  }
  return res;
};

const STATUS_MAP = {
  "new":         { label: "New",         emoji: "🟢", cls: "status-new" },
  "contacted":   { label: "Contacted",   emoji: "🟡", cls: "status-contacted" },
  "interested":  { label: "Interested",  emoji: "🔵", cls: "status-interested" },
  "site-visit":  { label: "Site Visit",  emoji: "🟠", cls: "status-site-visit" },
  "negotiating": { label: "Negotiating", emoji: "🟣", cls: "status-negotiating" },
  "closed":      { label: "Closed",      emoji: "✅", cls: "status-closed" },
  "lost":        { label: "Lost",        emoji: "❌", cls: "status-lost" }
};

const SOURCE_COLORS = {
  "Manual":         { color: "#6b6b80", bg: "rgba(107,107,128,0.12)" },
  "Public Form":    { color: "#6366f1", bg: "rgba(99,102,241,0.12)" },
  "Landing Page":   { color: "#a855f7", bg: "rgba(168,85,247,0.12)" },
  "99acres":        { color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  "Housing.com":    { color: "#f97316", bg: "rgba(249,115,22,0.12)" },
  "WhatsApp":       { color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  "Facebook Ads":   { color: "#3b82f6", bg: "rgba(59,130,246,0.12)" },
  "Google Ads":     { color: "#22d3ee", bg: "rgba(34,211,238,0.12)" },
  "LinkedIn":       { color: "#6366f1", bg: "rgba(99,102,241,0.12)" },
  "Client Referral":{ color: "#34d399", bg: "rgba(52,211,153,0.12)" },
  "Builder Referral":{ color: "#fbbf24", bg: "rgba(251,191,36,0.12)" },
};

// ──── DOM ────
const $  = id => document.getElementById(id);
const searchInput   = $("searchInput");
const filterArea    = $("filterArea");
const filterBudget  = $("filterBudget");
const filterType    = $("filterType");
const filterStatus  = $("filterStatus");
const filterLeadType= $("filterLeadType");
const filterSource  = $("filterSource");
const filterCity    = $("filterCity");
const sortBy        = $("sortBy");
const statsRow      = $("statsRow");
const leadsBody     = $("leadsBody");
const emptyState    = $("emptyState");
const modalOverlay  = $("modalOverlay");
const leadForm      = $("leadForm");
const modalTitle    = $("modalTitle");
const detailOverlay = $("detailOverlay");
const detailBody    = $("detailBody");

// ──── State ────
let leads = [];
let properties = [];

// ──── Init ────
async function init() {
  showUser();
  await Promise.all([fetchLeads(), fetchProperties()]);
  populateAreaFilter();
  populateSourceFilter();
  renderAll();

  searchInput.addEventListener("input", renderAll);
  filterArea.addEventListener("change", renderAll);
  filterBudget.addEventListener("change", renderAll);
  filterType.addEventListener("change", renderAll);
  filterStatus.addEventListener("change", renderAll);
  filterLeadType.addEventListener("change", renderAll);
  if (filterSource) filterSource.addEventListener("change", renderAll);
  if (filterCity) filterCity.addEventListener("change", () => {
    populateAreaFilter();
    renderAll();
  });
  sortBy.addEventListener("change", renderAll);

  $("btnNewLead").addEventListener("click", openNewModal);
  $("btnExport").addEventListener("click", exportCSV);
  $("modalClose").addEventListener("click", closeModal);
  $("btnCancel").addEventListener("click", closeModal);
  $("detailClose").addEventListener("click", closeDetail);
  modalOverlay.addEventListener("click", e => { if (e.target === modalOverlay) closeModal(); });
  detailOverlay.addEventListener("click", e => { if (e.target === detailOverlay) closeDetail(); });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") { closeModal(); closeDetail(); }
  });

  leadForm.addEventListener("submit", handleSubmit);
}

// ──── API Calls ────
async function fetchLeads() {
  try {
    const resp = await fetch(`${API}/leads`);
    if (resp.ok) {
      leads = await resp.json();
    } else {
      console.warn("API unavailable, using localStorage fallback");
      leads = loadLocal();
    }
  } catch {
    console.warn("Server offline, using localStorage fallback");
    leads = loadLocal();
  }
}

async function fetchProperties() {
  try {
    const resp = await fetch(`${API}/properties`);
    if (resp.ok) properties = await resp.json();
  } catch { properties = []; }
}

function loadLocal() {
  try { return JSON.parse(localStorage.getItem("gurgaon_leads")) || []; }
  catch { return []; }
}

async function apiCreate(data) {
  try {
    const resp = await fetch(`${API}/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (resp.ok) return await resp.json();
  } catch { /* fallback below */ }
  const lead = { id: genId(), ...data, createdAt: Date.now(), updatedAt: Date.now() };
  leads.push(lead);
  saveLocal();
  return lead;
}

async function apiUpdate(id, data) {
  try {
    const resp = await fetch(`${API}/leads/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (resp.ok) return await resp.json();
  } catch { /* fallback below */ }
  const idx = leads.findIndex(l => l.id === id);
  if (idx !== -1) { leads[idx] = { ...leads[idx], ...data, updatedAt: Date.now() }; }
  saveLocal();
  return leads[idx];
}

async function apiDelete(id) {
  try {
    const resp = await fetch(`${API}/leads/${id}`, { method: "DELETE" });
    if (resp.ok) return true;
  } catch { /* fallback below */ }
  leads = leads.filter(l => l.id !== id);
  saveLocal();
  return true;
}

function saveLocal() {
  localStorage.setItem("gurgaon_leads", JSON.stringify(leads));
}

// ──── Helpers ────
function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function formatBudget(val) {
  const n = Number(val);
  if (!n) return "—";
  if (n >= 10000000) return "₹" + (n / 10000000).toFixed(n % 10000000 === 0 ? 0 : 1) + " Cr";
  if (n >= 100000) return "₹" + (n / 100000).toFixed(0) + " L";
  return "₹" + n.toLocaleString("en-IN");
}

function formatDate(ts) {
  const d = new Date(ts);
  const day = d.getDate();
  const mon = d.toLocaleString("en-IN", { month: "short" });
  const yr = d.getFullYear().toString().slice(2);
  return `${day} ${mon} '${yr}`;
}

function budgetBucket(min, max) {
  const avg = (Number(min) + Number(max)) / 2;
  if (avg < 5000000) return "under50";
  if (avg < 10000000) return "50to1cr";
  if (avg < 20000000) return "1to2cr";
  if (avg < 50000000) return "2to5cr";
  if (avg < 100000000) return "5to10cr";
  return "above10cr";
}

function getSourceStyle(src) {
  return SOURCE_COLORS[src] || { color: "#6b6b80", bg: "rgba(107,107,128,0.12)" };
}

// ──── Populate filters ────
function populateAreaFilter() {
  const prev = filterArea.value;
  filterArea.innerHTML = '<option value="all">All Areas</option>';
  const city = filterCity ? filterCity.value : "all";
  const areas = new Set();
  leads.forEach(l => {
    if (!l.area) return;
    if (city !== "all" && !l.area.startsWith(city)) return;
    areas.add(l.area);
  });
  [...areas].sort().forEach(a => {
    const opt = document.createElement("option");
    opt.value = a;
    opt.textContent = a;
    filterArea.appendChild(opt);
  });
  if ([...areas].includes(prev)) filterArea.value = prev;
}

function populateSourceFilter() {
  if (!filterSource) return;
  const sources = new Set();
  leads.forEach(l => { if (l.source) sources.add(l.source); });
  Object.keys(SOURCE_COLORS).forEach(s => sources.add(s));
  [...sources].sort().forEach(s => {
    const opt = document.createElement("option");
    opt.value = s;
    opt.textContent = s;
    filterSource.appendChild(opt);
  });
}

// ──── Filtering & Sorting ────
function getFiltered() {
  const q = searchInput.value.toLowerCase().trim();
  const area = filterArea.value;
  const budget = filterBudget.value;
  const type = filterType.value;
  const status = filterStatus.value;
  const leadType = filterLeadType.value;
  const source = filterSource ? filterSource.value : "all";
  const city = filterCity ? filterCity.value : "all";
  const sort = sortBy.value;

  let list = leads.filter(l => {
    if (q && !l.name.toLowerCase().includes(q) && !l.phone.includes(q) && !(l.notes || "").toLowerCase().includes(q) && !(l.email || "").toLowerCase().includes(q) && !(l.source || "").toLowerCase().includes(q)) return false;
    if (city !== "all" && !(l.area || "").startsWith(city)) return false;
    if (area !== "all" && l.area !== area) return false;
    if (budget !== "all" && budgetBucket(l.budgetMin, l.budgetMax) !== budget) return false;
    if (type !== "all" && l.propertyType !== type) return false;
    if (status !== "all" && l.status !== status) return false;
    if (leadType !== "all" && l.leadType !== leadType) return false;
    if (source !== "all" && l.source !== source) return false;
    return true;
  });

  list.sort((a, b) => {
    switch (sort) {
      case "newest": return b.createdAt - a.createdAt;
      case "oldest": return a.createdAt - b.createdAt;
      case "budget-high": return Number(b.budgetMax) - Number(a.budgetMax);
      case "budget-low": return Number(a.budgetMin) - Number(b.budgetMin);
      case "name": return a.name.localeCompare(b.name);
      default: return 0;
    }
  });

  return list;
}

// ──── Render ────
function renderAll() {
  const list = getFiltered();
  renderStats(list);
  renderTable(list);
}

function detectCity(area) {
  const a = (area || "").toLowerCase();
  if (a.startsWith("gurgaon") || a.startsWith("gurugram")) return "Gurgaon";
  if (a.startsWith("ludhiana")) return "Ludhiana";
  if (a.startsWith("patiala")) return "Patiala";
  return "Other";
}

function renderStats() {
  const total = leads.length;
  const buyers = leads.filter(l => l.leadType === "buyer").length;
  const sellers = leads.filter(l => l.leadType === "seller").length;
  const active = leads.filter(l => !["closed","lost"].includes(l.status)).length;
  const hotLeads = leads.filter(l => ["interested","site-visit","negotiating"].includes(l.status)).length;
  const gurgaon = leads.filter(l => detectCity(l.area) === "Gurgaon").length;
  const ludhiana = leads.filter(l => detectCity(l.area) === "Ludhiana").length;
  const patiala = leads.filter(l => detectCity(l.area) === "Patiala").length;

  statsRow.innerHTML = `
    <div class="stat-card"><div class="stat-num" style="color:var(--accent)">${total}</div><div class="stat-lbl">Total</div></div>
    <div class="stat-card"><div class="stat-num" style="color:var(--green)">${buyers}</div><div class="stat-lbl">Buyers</div></div>
    <div class="stat-card"><div class="stat-num" style="color:var(--cyan)">${active}</div><div class="stat-lbl">Active</div></div>
    <div class="stat-card"><div class="stat-num" style="color:var(--orange)">${hotLeads}</div><div class="stat-lbl">Hot</div></div>
    <div class="stat-card"><div class="stat-num" style="color:var(--accent)">${gurgaon}</div><div class="stat-lbl">Gurgaon</div></div>
    <div class="stat-card"><div class="stat-num" style="color:var(--green)">${ludhiana}</div><div class="stat-lbl">Ludhiana</div></div>
    <div class="stat-card"><div class="stat-num" style="color:var(--amber)">${patiala}</div><div class="stat-lbl">Patiala</div></div>
  `;
}

function renderTable(list) {
  if (list.length === 0) {
    leadsBody.innerHTML = "";
    emptyState.classList.add("show");
    document.querySelector(".leads-table").style.display = leads.length > 0 ? "table" : "none";
    if (leads.length > 0) {
      emptyState.querySelector(".empty-title").textContent = "No leads match your filters";
      emptyState.querySelector(".empty-sub").textContent = "Try adjusting your search or filters";
    }
    return;
  }

  emptyState.classList.remove("show");
  document.querySelector(".leads-table").style.display = "table";

  leadsBody.innerHTML = list.map(l => {
    const st = STATUS_MAP[l.status] || STATUS_MAP["new"];
    const sc = getSourceStyle(l.source);
    return `
      <tr onclick="openDetail('${l.id}')">
        <td>
          <span class="lead-name">${l.name}</span>
          <span class="lead-type-tag lead-type-${l.leadType}">${l.leadType}</span>
        </td>
        <td>
          <div class="lead-phone">${l.phone}</div>
          ${l.email ? `<div class="lead-email">${l.email}</div>` : ""}
        </td>
        <td><span class="lead-prop">${l.propertyType}</span></td>
        <td><span class="lead-area">${l.area}</span></td>
        <td><span class="lead-budget">${formatBudget(l.budgetMin)} – ${formatBudget(l.budgetMax)}</span></td>
        <td><span class="source-badge" style="background:${sc.bg};color:${sc.color};border:1px solid ${sc.color}33">${l.source || "Manual"}</span></td>
        <td><span class="status-badge ${st.cls}">${st.emoji} ${st.label}</span></td>
        <td><span class="lead-date">${formatDate(l.createdAt)}</span></td>
        <td>
          <div class="action-btns" onclick="event.stopPropagation()">
            <button class="btn btn-sm btn-outline" onclick="openEditModal('${l.id}')">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteLead('${l.id}')">Del</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

// ──── Modal: Add / Edit ────
function openNewModal() {
  modalTitle.textContent = "Add New Lead";
  leadForm.reset();
  $("fEditId").value = "";
  $("fStatus").value = "new";
  modalOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
  setTimeout(() => $("fName").focus(), 200);
}

function openEditModal(id) {
  const l = leads.find(x => x.id === id);
  if (!l) return;
  modalTitle.textContent = "Edit Lead";
  $("fEditId").value = l.id;
  $("fName").value = l.name;
  $("fPhone").value = l.phone;
  $("fEmail").value = l.email || "";
  $("fLeadType").value = l.leadType;
  $("fPropertyType").value = l.propertyType;
  $("fArea").value = l.area;
  $("fBudgetMin").value = l.budgetMin;
  $("fBudgetMax").value = l.budgetMax;
  $("fTimeline").value = l.timeline || "";
  $("fStatus").value = l.status;
  $("fSource").value = l.source || "";
  $("fProjects").value = l.projects || "";
  $("fNotes").value = l.notes || "";
  modalOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modalOverlay.classList.remove("open");
  document.body.style.overflow = "";
}

async function handleSubmit(e) {
  e.preventDefault();
  const editId = $("fEditId").value;

  const data = {
    name:         $("fName").value.trim(),
    phone:        $("fPhone").value.trim(),
    email:        $("fEmail").value.trim(),
    leadType:     $("fLeadType").value,
    propertyType: $("fPropertyType").value,
    area:         $("fArea").value,
    budgetMin:    $("fBudgetMin").value,
    budgetMax:    $("fBudgetMax").value,
    timeline:     $("fTimeline").value,
    status:       $("fStatus").value,
    source:       $("fSource").value || "Manual",
    projects:     $("fProjects").value.trim(),
    notes:        $("fNotes").value.trim()
  };

  if (editId) {
    await apiUpdate(editId, data);
  } else {
    await apiCreate(data);
  }

  await fetchLeads();
  closeModal();
  renderAll();
}

// ──── Detail Modal ────
async function openDetail(id) {
  const l = leads.find(x => x.id === id);
  if (!l) return;
  const st = STATUS_MAP[l.status] || STATUS_MAP["new"];
  const sc = getSourceStyle(l.source);

  let linkedProps = [];
  try {
    const resp = await fetch(`${API}/leads/${id}/properties`);
    if (resp.ok) linkedProps = await resp.json();
  } catch {}

  const linkedIds = new Set(linkedProps.map(p => p.id));
  const unlinkedProps = properties.filter(p => !linkedIds.has(p.id));

  detailBody.innerHTML = `
    <div style="display:flex;align-items:center;gap:0.6rem;margin-bottom:1rem;flex-wrap:wrap">
      <span style="font-size:1.3rem;font-weight:800">${l.name}</span>
      <span class="lead-type-tag lead-type-${l.leadType}" style="font-size:0.7rem">${l.leadType.toUpperCase()}</span>
      <span class="status-badge ${st.cls}">${st.emoji} ${st.label}</span>
      <span class="source-badge" style="background:${sc.bg};color:${sc.color};border:1px solid ${sc.color}33;font-size:0.65rem">${l.source || "Manual"}</span>
    </div>

    <div class="detail-grid">
      <div class="detail-item">
        <div class="detail-label">Phone</div>
        <div class="detail-value"><a href="tel:${l.phone}" style="color:var(--green);text-decoration:none">${l.phone}</a></div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Email</div>
        <div class="detail-value">${l.email || "—"}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Looking For</div>
        <div class="detail-value">${l.propertyType}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Preferred Area</div>
        <div class="detail-value" style="color:var(--amber)">${l.area}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Budget Range</div>
        <div class="detail-value" style="color:var(--green)">${formatBudget(l.budgetMin)} – ${formatBudget(l.budgetMax)}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Timeline</div>
        <div class="detail-value">${l.timeline || "—"}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Source</div>
        <div class="detail-value" style="color:${sc.color}">${l.source || "Manual"}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Preferred Projects</div>
        <div class="detail-value">${l.projects || "—"}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Added</div>
        <div class="detail-value">${formatDate(l.createdAt)}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Last Updated</div>
        <div class="detail-value">${formatDate(l.updatedAt)}</div>
      </div>
    </div>

    ${l.notes ? `<div class="detail-notes"><strong>Notes / Requirements</strong><br/>${l.notes}</div>` : ""}

    <div class="matched-props-section">
      <div class="matched-props-header">
        <span class="matched-props-title">Matched Properties (${linkedProps.length})</span>
        <button class="btn btn-sm btn-outline" onclick="toggleLinkPanel('${l.id}')">+ Link Property</button>
      </div>
      <div class="matched-props-list" id="matchedPropsList">
        ${linkedProps.length === 0
          ? '<div class="matched-empty">No properties linked yet. Click "+ Link Property" to add.</div>'
          : linkedProps.map(p => renderPropCard(p, l.id, true)).join("")}
      </div>
      <div class="link-panel" id="linkPanel" style="display:none">
        <div class="link-panel-title">Available Properties</div>
        <input type="text" class="link-search" id="linkSearch" placeholder="Search properties by name, area, project..." oninput="filterLinkProps('${l.id}')" />
        <div class="link-panel-list" id="linkPanelList">
          ${unlinkedProps.slice(0, 20).map(p => renderPropCard(p, l.id, false)).join("")}
        </div>
      </div>
    </div>

    <div class="detail-actions">
      <a href="https://wa.me/91${l.phone.replace(/\D/g, '')}" target="_blank" class="btn btn-sm btn-green" onclick="event.stopPropagation()">WhatsApp</a>
      <a href="tel:${l.phone}" class="btn btn-sm btn-outline" onclick="event.stopPropagation()">Call</a>
      <button class="btn btn-sm btn-primary" onclick="closeDetail();openEditModal('${l.id}')">Edit</button>
      <button class="btn btn-sm btn-danger" onclick="deleteLead('${l.id}');closeDetail();">Delete</button>
    </div>
  `;

  detailOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function renderPropCard(p, leadId, linked) {
  const PROP_STATUS = { available: { lbl: "Available", color: "#34d399" }, sold: { lbl: "Sold", color: "#fb7185" }, reserved: { lbl: "Reserved", color: "#fbbf24" } };
  const ps = PROP_STATUS[p.status] || PROP_STATUS.available;
  return `
    <div class="prop-card">
      <div class="prop-card-top">
        <div class="prop-card-info">
          <div class="prop-card-title">${p.title}</div>
          <div class="prop-card-meta">
            <span class="prop-card-area">${p.area}</span>
            ${p.developer ? `<span class="prop-card-dev">by ${p.developer}</span>` : ""}
          </div>
        </div>
        <div class="prop-card-price">${formatBudget(p.price)}</div>
      </div>
      <div class="prop-card-details">
        ${p.bedrooms ? `<span class="prop-tag">${p.bedrooms} BHK</span>` : ""}
        ${p.carpetArea ? `<span class="prop-tag">${p.carpetArea}</span>` : ""}
        ${p.pricePerSqft ? `<span class="prop-tag">₹${p.pricePerSqft}/sqft</span>` : ""}
        <span class="prop-tag" style="color:${ps.color}">${ps.lbl}</span>
        ${p.possession ? `<span class="prop-tag">${p.possession}</span>` : ""}
        ${p.reraId ? `<span class="prop-tag" style="color:var(--green)">RERA</span>` : ""}
      </div>
      ${p.amenities ? `<div class="prop-card-amenities">${p.amenities}</div>` : ""}
      ${p.description ? `<div class="prop-card-desc">${p.description}</div>` : ""}
      ${p.ownerName ? `
      <div class="prop-owner">
        <div class="prop-owner-title">Owner / Contact</div>
        <div class="prop-owner-grid">
          <div class="prop-owner-item"><span class="prop-owner-icon">👤</span><span class="prop-owner-val">${p.ownerName}</span></div>
          <div class="prop-owner-item"><span class="prop-owner-icon">📞</span><a href="tel:${p.ownerPhone}" class="prop-owner-link">${p.ownerPhone}</a></div>
          ${p.ownerEmail ? `<div class="prop-owner-item"><span class="prop-owner-icon">✉️</span><a href="mailto:${p.ownerEmail}" class="prop-owner-link">${p.ownerEmail}</a></div>` : ""}
          ${p.ownerAddress ? `<div class="prop-owner-item prop-owner-addr"><span class="prop-owner-icon">📍</span><span class="prop-owner-val">${p.ownerAddress}</span></div>` : ""}
        </div>
      </div>` : ""}
      <div class="prop-card-actions">
        ${linked
          ? `<button class="btn btn-sm btn-danger" onclick="unlinkProp('${leadId}','${p.id}')">Unlink</button>`
          : `<button class="btn btn-sm btn-primary" onclick="linkProp('${leadId}','${p.id}')">Link to Lead</button>`}
      </div>
    </div>
  `;
}

function toggleLinkPanel(leadId) {
  const panel = $("linkPanel");
  panel.style.display = panel.style.display === "none" ? "block" : "none";
}

function filterLinkProps(leadId) {
  const q = ($("linkSearch")?.value || "").toLowerCase();
  const linkedIds = new Set([...$("matchedPropsList").querySelectorAll(".prop-card")].map(c => c.dataset?.propId));
  const filtered = properties.filter(p => {
    if (linkedIds.has(p.id)) return false;
    if (!q) return true;
    return (p.title + p.area + p.project + p.developer + p.description).toLowerCase().includes(q);
  });
  $("linkPanelList").innerHTML = filtered.slice(0, 20).map(p => renderPropCard(p, leadId, false)).join("")
    || '<div class="matched-empty">No matching properties found.</div>';
}

async function linkProp(leadId, propId) {
  try {
    await fetch(`${API}/leads/${leadId}/properties`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertyId: propId, matchType: "manual" }),
    });
  } catch {}
  openDetail(leadId);
}

async function unlinkProp(leadId, propId) {
  try {
    await fetch(`${API}/leads/${leadId}/properties/${propId}`, { method: "DELETE" });
  } catch {}
  openDetail(leadId);
}

function closeDetail() {
  detailOverlay.classList.remove("open");
  document.body.style.overflow = "";
}

// ──── Delete ────
async function deleteLead(id) {
  if (!confirm("Delete this lead permanently?")) return;
  await apiDelete(id);
  await fetchLeads();
  renderAll();
}

// ──── Export CSV ────
function exportCSV() {
  if (leads.length === 0) { alert("No leads to export."); return; }

  const headers = ["Name","Phone","Email","Lead Type","Property Type","Area","Budget Min","Budget Max","Timeline","Status","Source","Projects","Notes","Added","Updated"];
  const rows = leads.map(l => [
    l.name, l.phone, l.email || "", l.leadType, l.propertyType, l.area,
    formatBudget(l.budgetMin), formatBudget(l.budgetMax),
    l.timeline || "", l.status, l.source || "", l.projects || "",
    (l.notes || "").replace(/"/g, '""'),
    formatDate(l.createdAt), formatDate(l.updatedAt)
  ]);

  let csv = headers.join(",") + "\n";
  rows.forEach(r => {
    csv += r.map(v => `"${v}"`).join(",") + "\n";
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `gurgaon_leads_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

init();
