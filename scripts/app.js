/* ============================================================
   CICF PRO — APPLICATION LOGIC
   ============================================================ */

/* ── STATE ───────────────────────────────────────────────── */
const state = {
  projects: JSON.parse(JSON.stringify(PROJECTS_DATA)), // deep copy so we can mutate
  currentPage: 'dashboard',
  filter: 'All',
  search: '',
  view: 'grid',
  editingId: null,
};

/* ── HELPERS ─────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const AV = ['av-0','av-1','av-2','av-3','av-4','av-5','av-6','av-7'];
const av = (i) => AV[Math.abs(i) % AV.length];

function fmtDate(str) {
  if (!str) return '—';
  return new Date(str).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}
function fmtMoney(n) {
  return '$' + n.toLocaleString('en-US');
}
function sc(status) { return status.toLowerCase().replace(/\s+/g, '-'); }
function genId() { return Date.now(); }

/* ── TOAST ───────────────────────────────────────────────── */
let toastTimer;
function toast(msg, icon = '✓') {
  const el = $('#toast');
  $('#toast-icon').textContent = icon;
  $('#toast-msg').textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3000);
}

/* ── PROGRESS BAR ANIMATOR ───────────────────────────────── */
function animateBars(container = document) {
  container.querySelectorAll('[data-w]').forEach(bar => {
    bar.style.width = '0%';
    requestAnimationFrame(() => setTimeout(() => { bar.style.width = bar.dataset.w + '%'; }, 60));
  });
}

/* ── STATUS BADGE ────────────────────────────────────────── */
function badge(status) {
  return `<span class="s-badge ${sc(status)}">${status}</span>`;
}

/* ============================================================
   SIDEBAR
   ============================================================ */
const NAV = [
  { id: 'dashboard', icon: '⊞', label: 'Dashboard' },
  { id: 'projects',  icon: '📁', label: 'Projects', badge: null },
  { id: 'clients',   icon: '👥', label: 'Clients' },
  { id: 'analytics', icon: '📊', label: 'Analytics' },
  { id: 'timeline',  icon: '📅', label: 'Timeline' },
  { id: 'settings',  icon: '⚙', label: 'Settings' },
];

function renderSidebar() {
  const navHtml = NAV.map(n => `
    <div class="nav-item ${n.id === state.currentPage ? 'active' : ''}" data-page="${n.id}" role="button" tabindex="0">
      <span class="nav-icon">${n.icon}</span>
      <span>${n.label}</span>
      ${n.id === 'projects' ? `<span class="nav-badge">${state.projects.length}</span>` : ''}
    </div>`).join('');

  $('#sidebar-inner').innerHTML = `
    <div class="sidebar-header">
      <div class="sidebar-brand">
        <div class="sb-mark">C</div>
        <div class="sb-name">CICF<em>Pro</em></div>
      </div>
    </div>
    <nav class="sidebar-nav">
      <div class="nav-section">Navigation</div>
      ${navHtml}
      <div class="nav-divider"></div>
      <div class="nav-section">Support</div>
      <div class="nav-item" data-page="settings" style="color:var(--gray-600)">
        <span class="nav-icon">❓</span>
        <span>Help & Docs</span>
      </div>
    </nav>
    <div class="sidebar-footer">
      <div class="user-tile" id="logout-btn">
        <div class="user-av">AM</div>
        <div class="user-info">
          <div class="u-name">Alex Morgan</div>
          <div class="u-role">Senior PM</div>
        </div>
        <span class="u-logout" title="Sign out">↪</span>
      </div>
    </div>`;

  $$('.nav-item[data-page]').forEach(item => {
    item.addEventListener('click', () => navigateTo(item.dataset.page));
    item.addEventListener('keydown', e => { if (e.key === 'Enter') navigateTo(item.dataset.page); });
  });
  $('#logout-btn').addEventListener('click', doLogout);
}

/* ── NAVIGATION ──────────────────────────────────────────── */
function navigateTo(page) {
  state.currentPage = page;

  // Toggle pages
  $$('.page-section').forEach(s => s.classList.remove('active'));
  const target = $(`#page-${page}`);
  if (target) target.classList.add('active');

  // Update sidebar
  $$('.nav-item[data-page]').forEach(item => {
    item.classList.toggle('active', item.dataset.page === page);
  });

  // Update breadcrumb
  const labels = { dashboard:'Dashboard', projects:'Projects', clients:'Clients', analytics:'Analytics', timeline:'Timeline', settings:'Settings' };
  $('#bc-current').textContent = labels[page] || page;

  // Render page
  const renderers = {
    dashboard: renderDashboard,
    projects:  renderProjectsPage,
    clients:   renderClientsPage,
    analytics: renderAnalyticsPage,
    timeline:  renderTimelinePage,
    settings:  renderSettingsPage,
  };
  if (renderers[page]) renderers[page]();

  // Close sidebar on mobile
  closeSidebar();
}

/* ============================================================
   DASHBOARD PAGE
   ============================================================ */
function renderDashboard() {
  const projects = state.projects;
  const inProg   = projects.filter(p => p.status === 'In Progress');
  const done     = projects.filter(p => p.status === 'Completed');
  const hold     = projects.filter(p => p.status === 'On Hold');
  const totalBudget = projects.reduce((s, p) => s + (p.budgetNum || 0), 0);
  const avgProgress = Math.round(projects.reduce((s, p) => s + p.progress, 0) / projects.length);
  const uniqueClients = [...new Set(projects.map(p => p.client))].length;

  $('#dash-stats').innerHTML = `
    <div class="stat-card"><div class="stat-icon-wrap black">📋</div><div class="stat-data"><div class="stat-number">${projects.length}</div><div class="stat-label">Total Projects</div></div></div>
    <div class="stat-card"><div class="stat-icon-wrap blue">⚡</div><div class="stat-data"><div class="stat-number">${inProg.length}</div><div class="stat-label">In Progress</div></div></div>
    <div class="stat-card"><div class="stat-icon-wrap green">✓</div><div class="stat-data"><div class="stat-number">${done.length}</div><div class="stat-label">Completed</div></div></div>
    <div class="stat-card"><div class="stat-icon-wrap amber">💰</div><div class="stat-data"><div class="stat-number">${fmtMoney(totalBudget)}</div><div class="stat-label">Total Portfolio Value</div></div></div>`;

  // Recent projects (5 most recent by dueDate)
  const recent = [...projects].sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate)).slice(0, 5);
  $('#recent-projects').innerHTML = recent.map(p => `
    <div class="recent-row" data-id="${p.id}" role="button" tabindex="0">
      <div class="recent-logo ${av(p.id)}">${p.clientLogo}</div>
      <div class="recent-info">
        <div class="recent-name">${p.name}</div>
        <div class="recent-client">${p.client}</div>
      </div>
      ${badge(p.status)}
      <div class="recent-progress-wrap">
        <div class="recent-bar"><div class="recent-bar-fill ${sc(p.status)}" style="width:${p.progress}%"></div></div>
        <div class="recent-pct">${p.progress}%</div>
      </div>
    </div>`).join('');

  $$('#recent-projects .recent-row').forEach(row => {
    const open = () => openDetailModal(parseInt(row.dataset.id));
    row.addEventListener('click', open);
    row.addEventListener('keydown', e => { if (e.key === 'Enter') open(); });
  });

  // Activity feed
  const activities = [
    { text: '<strong>Phantom Brand Studio</strong> reached 80% completion', time: '2 hours ago' },
    { text: 'New team member added to <strong>Solaris SaaS Platform</strong>', time: '5 hours ago' },
    { text: '<strong>Verdant Finance Portal</strong> was marked as Completed', time: '1 day ago' },
    { text: 'Due date updated for <strong>HealthSync Patient App</strong>', time: '2 days ago' },
    { text: '<strong>FreightFlow Logistics Hub</strong> placed On Hold', time: '3 days ago' },
  ];
  $('#activity-feed').innerHTML = activities.map(a => `
    <div class="activity-item">
      <div class="act-dot-col"><div class="act-dot"></div><div class="act-line"></div></div>
      <div><div class="act-text">${a.text}</div><div class="act-time">${a.time}</div></div>
    </div>`).join('');

  $('#dash-quick-stats').innerHTML = `
    <div class="quick-stat"><div class="qs-num">${avgProgress}%</div><div class="qs-lbl">Avg. Progress</div></div>
    <div class="quick-stat"><div class="qs-num">${uniqueClients}</div><div class="qs-lbl">Active Clients</div></div>`;

  // View all projects link
  $('#view-all-projects').onclick = () => navigateTo('projects');
}

/* ============================================================
   PROJECTS PAGE
   ============================================================ */
function renderProjectsPage() {
  renderProjectGrid();

  // Search
  const searchEl = $('#search-input');
  searchEl.value = state.search;
  searchEl.oninput = () => { state.search = searchEl.value; renderProjectGrid(); };

  // Filter pills
  $$('.fp').forEach(pill => {
    pill.classList.toggle('active', pill.dataset.filter === state.filter);
    pill.onclick = () => {
      state.filter = pill.dataset.filter;
      $$('.fp').forEach(p => p.classList.toggle('active', p.dataset.filter === state.filter));
      renderProjectGrid();
    };
  });

  // View toggle
  $$('.vt-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === state.view);
    btn.onclick = () => {
      state.view = btn.dataset.view;
      $$('.vt-btn').forEach(b => b.classList.toggle('active', b.dataset.view === state.view));
      const grid = $('#projects-grid');
      grid.classList.toggle('list-view', state.view === 'list');
    };
  });

  // Add project button
  $('#add-project-btn').onclick = openAddForm;
  $('#export-btn').onclick = () => toast('Export downloaded as CSV', '↓');
}

function renderProjectGrid() {
  let list = state.projects;
  if (state.filter !== 'All') list = list.filter(p => p.status === state.filter);
  if (state.search.trim()) {
    const q = state.search.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.client.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.techStack || []).some(t => t.toLowerCase().includes(q))
    );
  }

  const grid = $('#projects-grid');
  if (!grid) return;

  grid.classList.toggle('list-view', state.view === 'list');

  const title = state.filter === 'All' ? 'All Projects' : state.filter + ' Projects';
  const countEl = $('#proj-count');
  const titleEl = $('#proj-section-title');
  if (countEl) countEl.textContent = `${list.length} project${list.length !== 1 ? 's' : ''}`;
  if (titleEl) titleEl.textContent = title;

  if (!list.length) {
    grid.innerHTML = `<div class="empty-state"><div class="es-icon">🔍</div><h4>No projects found</h4><p>Try adjusting your search or filter.</p></div>`;
    return;
  }

  grid.innerHTML = list.map((p, i) => buildCard(p, i)).join('');
  animateBars(grid);

  $$('.project-card .card-body', grid).forEach(body => {
    body.addEventListener('click', () => openDetailModal(parseInt(body.closest('.project-card').dataset.id)));
  });
  $$('.ca-btn.edit-btn', grid).forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); openEditForm(parseInt(btn.dataset.id)); });
  });
  $$('.ca-btn.danger', grid).forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); deleteProject(parseInt(btn.dataset.id)); });
  });
}

function buildCard(p, i) {
  const cls = sc(p.status);
  const team = p.teamMembers.slice(0, 3).map((m, idx) =>
    `<div class="mini-av ${av(idx)}" title="${m.name}">${m.avatar}</div>`).join('');
  const extra = p.teamMembers.length > 3
    ? `<div class="mini-av extra">+${p.teamMembers.length - 3}</div>` : '';
  const delay = (i % 8) * 0.04;

  return `
    <div class="project-card" data-id="${p.id}" style="animation-delay:${delay}s" role="listitem">
      <div class="card-accent ${cls}"></div>
      <div class="card-actions">
        <button class="ca-btn edit-btn" data-id="${p.id}" title="Edit project">✎</button>
        <button class="ca-btn danger" data-id="${p.id}" title="Delete project">✕</button>
      </div>
      <div class="card-body">
        <div class="card-head">
          <div class="card-logo ${av(p.id)}">${p.clientLogo}</div>
          <div class="card-title-group">
            <div class="card-name">${p.name}</div>
            <div class="card-client">${p.client}</div>
          </div>
          ${badge(p.status)}
        </div>
        <p class="card-desc">${p.description}</p>
        <div class="card-progress">
          <div class="cp-head">
            <span class="cp-label">Progress</span>
            <span class="cp-pct">${p.progress}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill ${cls}" data-w="${p.progress}" style="width:0%"></div>
          </div>
        </div>
        <div class="card-footer">
          <div class="card-due-date">📅 ${fmtDate(p.dueDate)}</div>
          <div class="mini-avatars">${team}${extra}</div>
        </div>
      </div>
    </div>`;
}

/* ── DELETE PROJECT ──────────────────────────────────────── */
function deleteProject(id) {
  if (!confirm('Are you sure you want to delete this project? This cannot be undone.')) return;
  state.projects = state.projects.filter(p => p.id !== id);
  renderProjectGrid();
  renderSidebar(); // update badge count
  toast('Project deleted', '✕');
}

/* ============================================================
   CLIENTS PAGE
   ============================================================ */
function renderClientsPage() {
  const projects = state.projects;

  // Group by client
  const clientMap = {};
  projects.forEach(p => {
    if (!clientMap[p.client]) {
      clientMap[p.client] = { name: p.client, logo: p.clientLogo, id: p.id, category: p.category, projects: [] };
    }
    clientMap[p.client].projects.push(p);
  });
  const clients = Object.values(clientMap);

  // Stats
  const totalBudget = projects.reduce((s, p) => s + (p.budgetNum || 0), 0);
  $('#client-stats').innerHTML = `
    <div class="stat-card"><div class="stat-icon-wrap black">👥</div><div class="stat-data"><div class="stat-number">${clients.length}</div><div class="stat-label">Total Clients</div></div></div>
    <div class="stat-card"><div class="stat-icon-wrap green">✓</div><div class="stat-data"><div class="stat-number">${projects.filter(p=>p.status==='Completed').length}</div><div class="stat-label">Deliveries</div></div></div>
    <div class="stat-card"><div class="stat-icon-wrap amber">💰</div><div class="stat-data"><div class="stat-number">${fmtMoney(totalBudget)}</div><div class="stat-label">Total Contracted</div></div></div>`;

  $('#client-count').textContent = `${clients.length} clients`;

  $('#clients-grid').innerHTML = clients.map((c, i) => {
    const totalBudget = c.projects.reduce((s, p) => s + (p.budgetNum || 0), 0);
    const projectRows = c.projects.map(p =>
      `<div class="client-project-row"><span class="cp-name">${p.name}</span>${badge(p.status)}</div>`).join('');

    return `
      <div class="client-card" style="animation-delay:${i*0.05}s">
        <div class="client-card-top">
          <div class="client-logo ${av(c.id)}">${c.logo}</div>
          <div>
            <div class="client-name">${c.name}</div>
            <div class="client-category">${c.category}</div>
          </div>
        </div>
        <div class="client-stats">
          <div class="client-stat">
            <div class="cs-num">${c.projects.length}</div>
            <div class="cs-lbl">Projects</div>
          </div>
          <div class="client-stat">
            <div class="cs-num">${fmtMoney(totalBudget)}</div>
            <div class="cs-lbl">Total Value</div>
          </div>
        </div>
        <div class="client-projects-list">${projectRows}</div>
      </div>`;
  }).join('');
}

/* ============================================================
   ANALYTICS PAGE
   ============================================================ */
function renderAnalyticsPage() {
  const projects = state.projects;
  const inProg  = projects.filter(p => p.status === 'In Progress').length;
  const done    = projects.filter(p => p.status === 'Completed').length;
  const hold    = projects.filter(p => p.status === 'On Hold').length;
  const totalBudget = projects.reduce((s, p) => s + (p.budgetNum || 0), 0);
  const avgProgress = Math.round(projects.reduce((s, p) => s + p.progress, 0) / projects.length);
  const highPriority = projects.filter(p => p.priority === 'High').length;

  $('#analytics-stats').innerHTML = `
    <div class="stat-card"><div class="stat-icon-wrap black">📊</div><div class="stat-data"><div class="stat-number">${projects.length}</div><div class="stat-label">Total Projects</div></div></div>
    <div class="stat-card"><div class="stat-icon-wrap blue">📈</div><div class="stat-data"><div class="stat-number">${avgProgress}%</div><div class="stat-label">Avg. Completion</div></div></div>
    <div class="stat-card"><div class="stat-icon-wrap amber">💰</div><div class="stat-data"><div class="stat-number">${fmtMoney(totalBudget)}</div><div class="stat-label">Portfolio Value</div></div></div>
    <div class="stat-card"><div class="stat-icon-wrap red">🔥</div><div class="stat-data"><div class="stat-number">${highPriority}</div><div class="stat-label">High Priority</div></div></div>`;

  // Category breakdown
  const catMap = {};
  projects.forEach(p => { catMap[p.category] = (catMap[p.category] || 0) + 1; });
  const cats = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
  const maxCat = cats[0]?.[1] || 1;
  const fillClasses = ['black','gray1','gray2','gray3','gray4'];
  const catBars = cats.map(([label, count], i) => `
    <div class="bc-row">
      <div class="bc-head"><span class="bc-label">${label}</span><span class="bc-value">${count} project${count>1?'s':''}</span></div>
      <div class="bc-track"><div class="bc-fill ${fillClasses[i]||'gray4'}" data-w="${Math.round(count/maxCat*100)}" style="width:0%"></div></div>
    </div>`).join('');

  // Budget by category
  const budgetMap = {};
  projects.forEach(p => { budgetMap[p.category] = (budgetMap[p.category] || 0) + (p.budgetNum || 0); });
  const budgets = Object.entries(budgetMap).sort((a, b) => b[1] - a[1]);
  const maxBudget = budgets[0]?.[1] || 1;
  const budgetBars = budgets.map(([label, val], i) => `
    <div class="bc-row">
      <div class="bc-head"><span class="bc-label">${label}</span><span class="bc-value">${fmtMoney(val)}</span></div>
      <div class="bc-track"><div class="bc-fill ${fillClasses[i]||'gray4'}" data-w="${Math.round(val/maxBudget*100)}" style="width:0%"></div></div>
    </div>`).join('');

  // Progress per project
  const progRows = [...projects].sort((a,b) => b.progress - a.progress).map(p => `
    <div class="po-row">
      <div class="po-name" title="${p.name}">${p.name}</div>
      <div class="po-track"><div class="po-fill ${sc(p.status)}" data-w="${p.progress}" style="width:0%"></div></div>
      <div class="po-pct">${p.progress}%</div>
    </div>`).join('');

  // Priority breakdown
  const priorities = { High: 0, Medium: 0, Low: 0 };
  projects.forEach(p => { if (priorities[p.priority] !== undefined) priorities[p.priority]++; });
  const priBars = Object.entries(priorities).map(([label, count], i) => `
    <div class="bc-row">
      <div class="bc-head"><span class="bc-label">${label} Priority</span><span class="bc-value">${count}</span></div>
      <div class="bc-track"><div class="bc-fill ${fillClasses[i]}" data-w="${projects.length ? Math.round(count/projects.length*100) : 0}" style="width:0%"></div></div>
    </div>`).join('');

  $('#analytics-grid').innerHTML = `
    <div class="analytics-card">
      <h4>Status Distribution</h4>
      <div class="ac-sub">Project portfolio breakdown by status</div>
      <div class="donut-wrap">
        ${buildDonut([
          { label: 'In Progress', count: inProg, color: 'var(--status-progress-bar)' },
          { label: 'Completed',   count: done,   color: 'var(--status-done-bar)' },
          { label: 'On Hold',     count: hold,   color: 'var(--status-hold-bar)' },
        ], projects.length)}
        <div class="donut-legend">
          <div class="legend-item"><div class="legend-dot" style="background:var(--status-progress-bar)"></div><span class="legend-label">In Progress</span><span class="legend-count">${inProg}</span></div>
          <div class="legend-item"><div class="legend-dot" style="background:var(--status-done-bar)"></div><span class="legend-label">Completed</span><span class="legend-count">${done}</span></div>
          <div class="legend-item"><div class="legend-dot" style="background:var(--status-hold-bar)"></div><span class="legend-label">On Hold</span><span class="legend-count">${hold}</span></div>
        </div>
      </div>
    </div>
    <div class="analytics-card">
      <h4>Projects by Category</h4>
      <div class="ac-sub">Distribution across service verticals</div>
      <div class="bar-chart">${catBars}</div>
    </div>
    <div class="analytics-card col-full">
      <h4>Project Progress Overview</h4>
      <div class="ac-sub">Completion percentage for all active projects</div>
      <div class="progress-overview">${progRows}</div>
    </div>
    <div class="analytics-card">
      <h4>Budget by Category</h4>
      <div class="ac-sub">Revenue allocation across verticals</div>
      <div class="bar-chart">${budgetBars}</div>
    </div>
    <div class="analytics-card">
      <h4>Priority Breakdown</h4>
      <div class="ac-sub">Projects grouped by urgency level</div>
      <div class="bar-chart">${priBars}</div>
    </div>`;

  animateBars($('#analytics-grid'));
}

/* ── SVG DONUT CHART ─────────────────────────────────────── */
function buildDonut(segments, total) {
  const R = 62, cx = 80, cy = 80;
  const circ = 2 * Math.PI * R;
  let offset = 0;
  const paths = segments.map(s => {
    const dash = total > 0 ? (s.count / total) * circ : 0;
    const seg = `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${s.color}" stroke-width="16"
      stroke-dasharray="${dash} ${circ}" stroke-dashoffset="${offset}" transform="rotate(-90 ${cx} ${cy})" />`;
    offset -= dash;
    return seg;
  });
  return `
    <svg class="donut-svg" viewBox="0 0 160 160" width="140" height="140">
      <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="var(--gray-100)" stroke-width="16"/>
      ${paths.join('')}
      <text x="${cx}" y="${cy-6}" text-anchor="middle" font-family="Space Grotesk,sans-serif" font-size="22" font-weight="700" fill="var(--text-primary)">${total}</text>
      <text x="${cx}" y="${cy+12}" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" fill="var(--text-muted)">Projects</text>
    </svg>`;
}

/* ============================================================
   TIMELINE PAGE
   ============================================================ */
function renderTimelinePage() {
  const sorted = [...state.projects].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  const now = new Date();

  const rows = sorted.map(p => {
    const due = new Date(p.dueDate);
    const isOverdue = due < now && p.status !== 'Completed';
    const daysLeft = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    const dueText = p.status === 'Completed' ? 'Delivered' : isOverdue ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d left`;
    const dueColor = p.status === 'Completed' ? 'var(--status-done-text)' : isOverdue ? '#dc2626' : daysLeft < 14 ? 'var(--status-hold-text)' : 'var(--text-muted)';

    return `
      <div class="recent-row" data-id="${p.id}" role="button" tabindex="0" style="margin-bottom:8px">
        <div class="recent-logo ${av(p.id)}">${p.clientLogo}</div>
        <div class="recent-info" style="flex:2">
          <div class="recent-name">${p.name}</div>
          <div class="recent-client">${p.client}</div>
        </div>
        ${badge(p.status)}
        <div style="min-width:90px;text-align:right">
          <div style="font-size:13px;font-weight:600;color:${dueColor}">${dueText}</div>
          <div style="font-size:11.5px;color:var(--text-muted)">${fmtDate(p.dueDate)}</div>
        </div>
        <div class="recent-progress-wrap">
          <div class="recent-bar"><div class="recent-bar-fill ${sc(p.status)}" style="width:${p.progress}%"></div></div>
          <div class="recent-pct">${p.progress}%</div>
        </div>
      </div>`;
  }).join('');

  $('#timeline-content').innerHTML = `
    <div style="background:var(--white);border:1px solid var(--border);border-radius:var(--radius-md);padding:20px;box-shadow:var(--shadow-xs)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px">
        <div>
          <div style="font-family:'Space Grotesk',sans-serif;font-size:15px;font-weight:700">Delivery Schedule</div>
          <div style="font-size:12px;color:var(--text-muted);margin-top:2px">Sorted by due date, earliest first</div>
        </div>
      </div>
      ${rows}
    </div>`;

  $$('#timeline-content .recent-row').forEach(row => {
    const open = () => openDetailModal(parseInt(row.dataset.id));
    row.addEventListener('click', open);
    row.addEventListener('keydown', e => { if (e.key === 'Enter') open(); });
  });
}

/* ============================================================
   SETTINGS PAGE
   ============================================================ */
function renderSettingsPage() {
  $('#settings-content').innerHTML = `
    <div class="settings-card">
      <div class="settings-card-header">
        <div>
          <h4>Profile</h4>
          <p>Manage your personal account details</p>
        </div>
      </div>
      <div class="settings-card-body">
        <div class="profile-avatar-row">
          <div class="profile-avatar-big">AM</div>
          <div>
            <div style="font-size:15px;font-weight:600">Alex Morgan</div>
            <div style="font-size:13px;color:var(--text-muted)">Senior Project Manager</div>
            <div style="font-size:12.5px;color:var(--text-muted);margin-top:2px">admin@cicf.io</div>
          </div>
          <button class="profile-change-btn" style="margin-left:auto">Edit Profile</button>
        </div>
        <div class="settings-row">
          <div><div class="settings-row-label">Full Name</div></div>
          <div style="font-size:13.5px;color:var(--text-secondary)">Alex Morgan</div>
        </div>
        <div class="settings-row">
          <div><div class="settings-row-label">Email</div></div>
          <div style="font-size:13.5px;color:var(--text-secondary)">admin@cicf.io</div>
        </div>
        <div class="settings-row">
          <div><div class="settings-row-label">Role</div></div>
          <div style="font-size:13.5px;color:var(--text-secondary)">Senior PM</div>
        </div>
      </div>
    </div>
    <div class="settings-card">
      <div class="settings-card-header">
        <div><h4>Notifications</h4><p>Control how you receive alerts</p></div>
      </div>
      <div class="settings-card-body">
        ${[
          ['Project status changes', 'Notify when a project status is updated', true],
          ['Due date reminders', 'Alerts 7 days before a project is due', true],
          ['New team member added', 'When someone joins a project', false],
          ['Weekly summary digest', 'A weekly overview of your portfolio', true],
        ].map(([lbl, desc, on]) => `
          <div class="settings-row">
            <div><div class="settings-row-label">${lbl}</div><div class="settings-row-desc">${desc}</div></div>
            <div class="toggle-switch ${on ? 'on' : ''}" onclick="this.classList.toggle('on')"></div>
          </div>`).join('')}
      </div>
    </div>
    <div class="settings-card">
      <div class="settings-card-header">
        <div><h4>Preferences</h4><p>Workspace display settings</p></div>
      </div>
      <div class="settings-card-body">
        ${[
          ['Compact card layout', 'Show more projects with smaller cards', false],
          ['Show progress labels', 'Display percentage text on bars', true],
          ['Animated transitions', 'Enable smooth page transitions', true],
        ].map(([lbl, desc, on]) => `
          <div class="settings-row">
            <div><div class="settings-row-label">${lbl}</div><div class="settings-row-desc">${desc}</div></div>
            <div class="toggle-switch ${on ? 'on' : ''}" onclick="this.classList.toggle('on')"></div>
          </div>`).join('')}
      </div>
    </div>
    <div class="settings-card">
      <div class="settings-card-header">
        <div><h4>Danger Zone</h4><p>Irreversible account actions</p></div>
      </div>
      <div class="settings-card-body">
        <div class="settings-row">
          <div><div class="settings-row-label">Sign out everywhere</div><div class="settings-row-desc">Revoke all active sessions</div></div>
          <button class="btn-danger" onclick="doLogout()">Sign Out</button>
        </div>
      </div>
    </div>`;
}

/* ============================================================
   DETAIL MODAL
   ============================================================ */
function openDetailModal(id) {
  const p = state.projects.find(p => p.id === id);
  if (!p) return;
  const cls = sc(p.status);
  const doneMs = p.milestones.filter(m => m.done).length;

  const techHtml = (p.techStack || []).map(t => `<span class="tech-chip">${t}</span>`).join('');
  const teamHtml = (p.teamMembers || []).map((m, i) => `
    <div class="team-row">
      <div class="team-av ${av(i)}">${m.avatar}</div>
      <div><div class="team-name">${m.name}</div><div class="team-role">${m.role}</div></div>
      <div class="team-status-dot"></div>
    </div>`).join('');
  const msHtml = (p.milestones || []).map(m => `
    <div class="ms-item ${m.done ? 'done' : ''}">
      <div class="ms-check">${m.done ? '✓' : '○'}</div>
      <span>${m.label}</span>
    </div>`).join('');
  const barColor = cls === 'in-progress' ? 'var(--status-progress-bar)' : cls === 'completed' ? 'var(--status-done-bar)' : 'var(--status-hold-bar)';

  $('#detail-box').innerHTML = `
    <div class="modal-header">
      <button class="modal-close" id="detail-close">✕</button>
      <div class="modal-accent-line" style="background:${barColor}"></div>
      <div class="modal-title-row">
        <div class="modal-logo ${av(p.id)}">${p.clientLogo}</div>
        <div class="modal-title-text"><h2>${p.name}</h2><p>${p.client}</p></div>
      </div>
      <div class="modal-badge-row">
        ${badge(p.status)}
        <span class="m-badge priority-${p.priority.toLowerCase()}">${p.priority} Priority</span>
        <span class="m-badge">${p.category}</span>
      </div>
    </div>
    <div class="modal-body">
      <div class="modal-meta-row">
        <div class="meta-tile"><div class="mt-lbl">Budget</div><div class="mt-val">${p.budget}</div></div>
        <div class="meta-tile"><div class="mt-lbl">Due Date</div><div class="mt-val">${fmtDate(p.dueDate)}</div></div>
        <div class="meta-tile"><div class="mt-lbl">Team</div><div class="mt-val">${p.teamMembers.length} Members</div></div>
      </div>
      <div class="modal-sec">
        <div class="modal-sec-title">Overview</div>
        <p class="modal-desc">${p.description}</p>
      </div>
      <div class="modal-sec">
        <div class="modal-sec-title">Progress — ${p.progress}%</div>
        <div class="modal-progress-track">
          <div class="modal-progress-fill ${cls}" data-w="${p.progress}" style="width:0%"></div>
        </div>
        <div class="modal-progress-pct">${doneMs} of ${p.milestones.length} milestones complete</div>
      </div>
      <div class="modal-sec">
        <div class="modal-sec-title">Tech Stack</div>
        <div class="tech-chips">${techHtml}</div>
      </div>
      <div class="modal-sec">
        <div class="modal-sec-title">Milestones</div>
        <div class="milestones-list">${msHtml}</div>
      </div>
      <div class="modal-sec">
        <div class="modal-sec-title">Team Members</div>
        <div class="team-list">${teamHtml}</div>
      </div>
    </div>`;

  $('#detail-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  animateBars($('#detail-box'));
  $('#detail-close').onclick = closeDetailModal;
}
function closeDetailModal() {
  $('#detail-overlay').classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { $('#detail-box').innerHTML = ''; }, 320);
}

/* ============================================================
   ADD / EDIT PROJECT FORM
   ============================================================ */
function openAddForm() {
  state.editingId = null;
  $('#form-title').textContent = 'Add New Project';
  $('#form-sub').textContent = 'Fill in the details to create a new project.';
  $('#form-delete-btn').style.display = 'none';
  $('#project-form').reset();
  $('#form-id').value = '';
  openForm();
}

function openEditForm(id) {
  const p = state.projects.find(p => p.id === id);
  if (!p) return;
  state.editingId = id;
  $('#form-title').textContent = 'Edit Project';
  $('#form-sub').textContent = 'Update the project details below.';
  $('#form-delete-btn').style.display = 'block';
  $('#form-id').value = id;

  $('#f-name').value    = p.name;
  $('#f-client').value  = p.client;
  $('#f-category').value = p.category;
  $('#f-status').value  = p.status;
  $('#f-priority').value = p.priority;
  $('#f-progress').value = p.progress;
  $('#f-due').value     = p.dueDate;
  $('#f-budget').value  = p.budget;
  $('#f-desc').value    = p.description;
  $('#f-tech').value    = (p.techStack || []).join(', ');
  $('#f-team').value    = (p.teamMembers || []).map(m => `${m.name}: ${m.role}`).join(', ');

  openForm();
}

function openForm() {
  $('#form-error').style.display = 'none';
  $('#form-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => $('#f-name').focus(), 100);
}
function closeForm() {
  $('#form-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

function saveProject() {
  const name    = $('#f-name').value.trim();
  const client  = $('#f-client').value.trim();
  const dueDate = $('#f-due').value;
  const errEl   = $('#form-error');

  if (!name || !client || !dueDate) {
    errEl.textContent = 'Please fill in all required fields (Name, Client, Due Date).';
    errEl.style.display = 'block';
    return;
  }
  errEl.style.display = 'none';

  const status    = $('#f-status').value;
  const category  = $('#f-category').value;
  const priority  = $('#f-priority').value;
  const progress  = Math.min(100, Math.max(0, parseInt($('#f-progress').value) || 0));
  const budget    = $('#f-budget').value.trim() || '$0';
  const budgetNum = parseInt(budget.replace(/[^0-9]/g, '')) || 0;
  const desc      = $('#f-desc').value.trim();

  const techRaw  = $('#f-tech').value;
  const techStack = techRaw.split(',').map(s => s.trim()).filter(Boolean);

  const teamRaw = $('#f-team').value;
  const teamMembers = teamRaw.split(',').map(s => {
    const [namePart, rolePart] = s.split(':');
    const nm = (namePart || '').trim();
    const role = (rolePart || 'Member').trim();
    const avatar = nm.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);
    return nm ? { name: nm, role, avatar } : null;
  }).filter(Boolean);

  if (state.editingId) {
    const idx = state.projects.findIndex(p => p.id === state.editingId);
    if (idx >= 0) {
      state.projects[idx] = {
        ...state.projects[idx],
        name, client, status, category, priority, progress,
        budget, budgetNum, dueDate, description: desc,
        techStack: techStack.length ? techStack : state.projects[idx].techStack,
        teamMembers: teamMembers.length ? teamMembers : state.projects[idx].teamMembers,
        clientLogo: client.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase(),
      };
      toast('Project updated successfully', '✓');
    }
  } else {
    const newProject = {
      id: genId(),
      name, client, status, category, priority, progress,
      budget, budgetNum, dueDate, startDate: new Date().toISOString().split('T')[0],
      description: desc || 'No description provided.',
      techStack: techStack.length ? techStack : ['TBD'],
      teamMembers: teamMembers.length ? teamMembers : [{ name: 'Unassigned', role: 'Lead', avatar: 'UN' }],
      clientLogo: client.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase(),
      milestones: [
        { label: 'Kickoff', done: true },
        { label: 'Design', done: false },
        { label: 'Development', done: false },
        { label: 'Testing', done: false },
        { label: 'Launch', done: false },
      ],
    };
    state.projects.unshift(newProject);
    toast('Project created successfully! 🎉', '✓');
  }

  closeForm();
  renderSidebar(); // update project count badge

  if (state.currentPage === 'projects') renderProjectGrid();
  else if (state.currentPage === 'dashboard') renderDashboard();
  else if (state.currentPage === 'clients') renderClientsPage();
  else if (state.currentPage === 'analytics') renderAnalyticsPage();
}

/* ============================================================
   SIDEBAR (MOBILE)
   ============================================================ */
function closeSidebar() {
  $('#sidebar').classList.remove('open');
  $('#sidebar-overlay').classList.remove('open');
}

/* ============================================================
   LOGOUT
   ============================================================ */
function doLogout() {
  $('#app-shell').classList.remove('visible');
  $('#app-shell').style.display = 'none';
  $('#login-page').style.cssText = '';
  $('#login-form').reset();
}

/* ============================================================
   BOOT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  // ── LOGIN ──
  $('#login-form').addEventListener('submit', e => {
    e.preventDefault();
    const email = $('#email').value.trim();
    const pass  = $('#password').value;
    const errEl = $('#login-error');
    const btn   = $('#login-btn');

    if (email === 'admin@cicf.io' && pass === 'cicf2026') {
      btn.innerHTML = '<span class="spinner"></span>';
      btn.disabled = true;
      setTimeout(() => {
        $('#login-page').style.display = 'none';
        $('#app-shell').classList.add('visible');
        renderSidebar();
        renderDashboard();
        toast('Welcome back, Alex! 👋', '✓');
      }, 800);
    } else {
      errEl.textContent = 'Invalid credentials. Check the hint above.';
      errEl.classList.add('show');
      setTimeout(() => errEl.classList.remove('show'), 3000);
    }
  });

  // ── TOPBAR ──
  $('#hamburger-btn').addEventListener('click', () => {
    $('#sidebar').classList.toggle('open');
    $('#sidebar-overlay').classList.toggle('open');
  });
  $('#sidebar-overlay').addEventListener('click', closeSidebar);
  $('#topbar-add-btn').addEventListener('click', () => {
    if (state.currentPage !== 'projects') navigateTo('projects');
    setTimeout(openAddForm, 100);
  });
  $('#notif-btn').addEventListener('click', () => toast('No new notifications', '🔔'));

  // ── GLOBAL SEARCH ──
  $('#global-search').addEventListener('input', e => {
    state.search = e.target.value;
    state.filter = 'All';
    navigateTo('projects');
    // Sync search box on projects page
    const pi = $('#search-input');
    if (pi) { pi.value = state.search; }
  });

  // ── MODAL DISMISS ──
  $('#detail-overlay').addEventListener('click', e => { if (e.target === $('#detail-overlay')) closeDetailModal(); });

  // ── FORM BUTTONS ──
  $('#form-close-btn').addEventListener('click', closeForm);
  $('#form-cancel-btn').addEventListener('click', closeForm);
  $('#form-save-btn').addEventListener('click', saveProject);
  $('#form-delete-btn').addEventListener('click', () => {
    if (state.editingId) {
      closeForm();
      setTimeout(() => deleteProject(state.editingId), 100);
    }
  });
  $('#form-overlay').addEventListener('click', e => { if (e.target === $('#form-overlay')) closeForm(); });

  // ── KEYBOARD ──
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeDetailModal(); closeForm(); }
  });
});
