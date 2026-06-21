const main = document.getElementById('main');
const status = document.getElementById('status');
const tabs = document.querySelectorAll('nav button');

let trackerState = { rows: [], sortKey: 'id', sortDir: 'desc', filter: '' };

tabs.forEach((b) => b.addEventListener('click', () => loadTab(b.dataset.tab)));

function setActive(tab) {
  tabs.forEach((b) => b.classList.toggle('active', b.dataset.tab === tab));
}

async function loadTab(tab) {
  setActive(tab);
  if (tab === 'tracker') return renderTracker();
  if (tab === 'reports') return renderReports();
  if (tab === 'portals') return renderPortals();
  if (tab === 'profile') return renderProfile();
  if (tab === 'patterns') return renderPatterns();
}

function scoreClass(scoreStr) {
  if (!scoreStr) return '';
  const n = parseFloat(scoreStr);
  if (Number.isNaN(n)) return '';
  if (n >= 4) return 'high';
  if (n >= 3) return 'mid';
  return 'low';
}

// ── Tracker ──────────────────────────────────────────────────────────

async function renderTracker() {
  main.innerHTML = '<p class="muted">Loading…</p>';
  const [rows, states] = await Promise.all([
    fetch('/api/applications').then((r) => r.json()),
    fetch('/api/states').then((r) => r.json()),
  ]);
  if (rows.error) {
    main.innerHTML = `<p class="muted">No tracker data yet (${escapeHtml(rows.error)}).</p>`;
    return;
  }
  trackerState.rows = rows;
  trackerState.states = states;
  renderTrackerTable();
}

function renderTrackerTable() {
  const { rows, sortKey, sortDir, filter, states } = trackerState;
  const total = rows.length;
  const applied = rows.filter((r) => ['Applied', 'Responded', 'Interview', 'Offer'].includes(r.status)).length;
  const interview = rows.filter((r) => ['Interview', 'Offer'].includes(r.status)).length;
  const scores = rows.map((r) => parseFloat(r.score)).filter((n) => !Number.isNaN(n));
  const avgScore = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : '—';
  const conversion = applied ? Math.round((interview / applied) * 100) + '%' : '—';

  let filtered = rows.filter((r) => {
    if (!filter) return true;
    const hay = `${r.company} ${r.role} ${r.status}`.toLowerCase();
    return hay.includes(filter.toLowerCase());
  });
  filtered.sort((a, b) => {
    let av = a[sortKey], bv = b[sortKey];
    if (sortKey === 'score') { av = parseFloat(av) || 0; bv = parseFloat(bv) || 0; }
    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const cols = [
    ['id', '#'], ['date', 'Date'], ['company', 'Company'], ['role', 'Role'],
    ['score', 'Score'], ['status', 'Status'], ['report', 'Report'],
  ];

  main.innerHTML = `
    <div class="stats">
      <div class="stat"><div class="num">${total}</div><div class="label">Total applications</div></div>
      <div class="stat"><div class="num">${avgScore}</div><div class="label">Avg score</div></div>
      <div class="stat"><div class="num">${applied}</div><div class="label">Applied+</div></div>
      <div class="stat"><div class="num">${conversion}</div><div class="label">Applied → Interview</div></div>
    </div>
    <div class="toolbar">
      <input type="text" id="tracker-filter" placeholder="Filter by company, role, status…" value="${escapeHtml(filter)}">
    </div>
    <table>
      <thead><tr>${cols.map(([key, label]) => `<th data-key="${key}">${label}${sortKey === key ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''}</th>`).join('')}</tr></thead>
      <tbody>
        ${filtered.map((r) => `
          <tr>
            <td>${r.id}</td>
            <td>${escapeHtml(r.date)}</td>
            <td>${escapeHtml(r.company)}</td>
            <td>${escapeHtml(r.role)}</td>
            <td class="score ${scoreClass(r.score)}">${r.score ?? ''}</td>
            <td>
              <select data-id="${r.id}" class="status-select">
                ${states.map((s) => `<option value="${s}" ${s === r.status ? 'selected' : ''}>${s}</option>`).join('')}
              </select>
            </td>
            <td>${r.report ? `<a href="#" data-file="${(r.report.match(/\(([^)]+)\)/)?.[1] || '').split('/').pop()}" class="open-report">view</a>` : ''}</td>
          </tr>`).join('')}
      </tbody>
    </table>
    ${filtered.length === 0 ? '<p class="muted">No rows match.</p>' : ''}
  `;

  document.getElementById('tracker-filter').addEventListener('input', (e) => {
    trackerState.filter = e.target.value;
    renderTrackerTable();
  });
  main.querySelectorAll('th[data-key]').forEach((th) =>
    th.addEventListener('click', () => {
      const key = th.dataset.key;
      if (trackerState.sortKey === key) trackerState.sortDir = trackerState.sortDir === 'asc' ? 'desc' : 'asc';
      else { trackerState.sortKey = key; trackerState.sortDir = 'asc'; }
      renderTrackerTable();
    })
  );
  main.querySelectorAll('.status-select').forEach((sel) =>
    sel.addEventListener('change', async () => {
      const id = sel.dataset.id;
      const newStatus = sel.value;
      const res = await fetch('/api/applications/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      }).then((r) => r.json());
      if (res.error) { alert(res.error); return; }
      const row = trackerState.rows.find((r) => String(r.id) === String(id));
      if (row) row.status = newStatus;
      renderTrackerTable();
    })
  );
  main.querySelectorAll('.open-report').forEach((a) =>
    a.addEventListener('click', (e) => { e.preventDefault(); if (a.dataset.file) openReport(a.dataset.file); })
  );
}

// ── Reports ──────────────────────────────────────────────────────────

let reportsState = { items: [], selected: new Set(), minScore: 0, legitimacy: '' };

async function renderReports() {
  main.innerHTML = '<p class="muted">Loading…</p>';
  const reports = await fetch('/api/reports').then((r) => r.json());
  reportsState.items = reports;
  renderReportsList();
}

function renderReportsList() {
  const { items, selected, minScore, legitimacy } = reportsState;
  if (!items.length) {
    main.innerHTML = '<p class="muted">No reports yet. Run an evaluation first.</p>';
    return;
  }
  const legitTiers = [...new Set(items.map((r) => r.legitimacy).filter(Boolean))];
  const filtered = items.filter((r) => {
    const s = parseFloat(r.score) || 0;
    if (s < minScore) return false;
    if (legitimacy && r.legitimacy !== legitimacy) return false;
    return true;
  });

  main.innerHTML = `
    <div class="toolbar">
      <label class="muted">Min score: <input type="number" id="min-score" min="0" max="5" step="0.1" value="${minScore}" style="width:60px;"></label>
      <label class="muted">Legitimacy:
        <select id="legit-filter">
          <option value="">all</option>
          ${legitTiers.map((t) => `<option value="${escapeHtml(t)}" ${t === legitimacy ? 'selected' : ''}>${escapeHtml(t)}</option>`).join('')}
        </select>
      </label>
      <button class="secondary" id="compare-btn" ${selected.size < 2 ? 'disabled' : ''}>Compare selected (${selected.size})</button>
    </div>
    ${filtered.map((r) => `
      <div class="card">
        <div style="display:flex; align-items:flex-start; gap:10px;">
          <input type="checkbox" class="compare-check" data-file="${r.file}" ${selected.has(r.file) ? 'checked' : ''} style="margin-top:4px;">
          <div>
            <h3><a href="#" data-file="${r.file}" class="open-report">${escapeHtml(r.title)}</a></h3>
            <div class="meta">
              ${r.score ? `<span class="score ${scoreClass(r.score)}">Score: ${r.score}</span> · ` : ''}
              ${r.legitimacy ? `Legitimacy: ${escapeHtml(r.legitimacy)} · ` : ''}
              ${r.date ? `${escapeHtml(r.date)} · ` : ''}
              ${r.url ? `<a href="${escapeHtml(r.url)}" target="_blank">posting</a>` : ''}
            </div>
          </div>
        </div>
      </div>`).join('')}
    ${filtered.length === 0 ? '<p class="muted">No reports match these filters.</p>' : ''}
  `;

  document.getElementById('min-score').addEventListener('input', (e) => {
    reportsState.minScore = parseFloat(e.target.value) || 0;
    renderReportsList();
  });
  document.getElementById('legit-filter').addEventListener('change', (e) => {
    reportsState.legitimacy = e.target.value;
    renderReportsList();
  });
  main.querySelectorAll('.compare-check').forEach((cb) =>
    cb.addEventListener('change', () => {
      if (cb.checked) selected.add(cb.dataset.file); else selected.delete(cb.dataset.file);
      renderReportsList();
    })
  );
  document.getElementById('compare-btn')?.addEventListener('click', () => openCompare([...selected]));
  main.querySelectorAll('.open-report').forEach((a) =>
    a.addEventListener('click', (e) => { e.preventDefault(); openReport(a.dataset.file); })
  );
}

async function openReport(file) {
  const { content } = await fetch(`/api/report?file=${encodeURIComponent(file)}`).then((r) => r.json());
  main.innerHTML = `
    <button class="secondary" id="back">&larr; back</button>
    <div style="margin-top:12px;">
      <button class="secondary" id="toggle-raw">Toggle raw markdown</button>
    </div>
    <div class="report-html" id="report-body" style="margin-top:12px;"></div>
  `;
  let raw = false;
  const body = document.getElementById('report-body');
  function draw() { body.innerHTML = raw ? `<pre class="raw">${escapeHtml(content || 'Not found')}</pre>` : renderMarkdown(content || 'Not found'); }
  draw();
  document.getElementById('back').addEventListener('click', renderReportsList);
  document.getElementById('toggle-raw').addEventListener('click', () => { raw = !raw; draw(); });
}

async function openCompare(files) {
  const contents = await Promise.all(files.map((f) => fetch(`/api/report?file=${encodeURIComponent(f)}`).then((r) => r.json())));
  main.innerHTML = `
    <button class="secondary" id="back">&larr; back</button>
    <div class="compare-grid cols-${Math.min(files.length, 3)}" style="margin-top:12px;">
      ${contents.map((c, idx) => `<div class="report-html">${renderMarkdown(c.content || 'Not found')}</div>`).join('')}
    </div>
  `;
  document.getElementById('back').addEventListener('click', renderReportsList);
}

// ── Portals ──────────────────────────────────────────────────────────

let portalsState = { data: null, filter: '' };

async function renderPortals() {
  main.innerHTML = '<p class="muted">Loading…</p>';
  const [data, history] = await Promise.all([
    fetch('/api/portals').then((r) => r.json()),
    fetch('/api/scan-history').then((r) => r.json()),
  ]);
  portalsState.data = data;
  portalsState.history = history;
  renderPortalsBody();
}

function renderPortalsBody() {
  const { data, history, filter } = portalsState;
  const historyByUrl = (url) => {
    if (!url) return null;
    try { return history.find((h) => h.host === new URL(url).hostname); } catch { return null; }
  };

  const matches = (i) => !filter || `${i.name} ${i.careers_url || i.query || ''}`.toLowerCase().includes(filter.toLowerCase());

  const section = (title, key, items) => {
    const visible = items.filter(matches);
    return `
    <h3>${title} (${items.filter((i) => i.enabled).length}/${items.length} enabled, ${visible.length} shown)</h3>
    <div class="toolbar">
      <button class="secondary" data-bulk="${key}" data-enabled="true">Enable all shown</button>
      <button class="secondary" data-bulk="${key}" data-enabled="false">Disable all shown</button>
    </div>
    ${visible.map((i) => {
      const h = historyByUrl(i.careers_url);
      return `
      <div class="toggle-row">
        <div>
          <div class="name">${escapeHtml(i.name)}</div>
          <div class="url">${escapeHtml(i.careers_url || i.query || '')}${h ? ` · last scan ${escapeHtml(h.lastSeen || '—')} · ${h.count} seen` : ''}</div>
        </div>
        <label class="switch">
          <input type="checkbox" data-section="${key}" data-name="${escapeHtml(i.name)}" ${i.enabled ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
      </div>`;
    }).join('')}
    ${visible.length === 0 ? '<p class="muted">No matches.</p>' : ''}
  `;
  };

  main.innerHTML = `
    <div class="toolbar">
      <button class="primary" id="run-scan">Run scan now</button>
      <input type="text" id="portal-filter" placeholder="Filter companies/queries…" value="${escapeHtml(filter)}">
    </div>
    <pre class="raw" id="scan-output" style="display:none; max-height:240px; overflow:auto;"></pre>

    <details style="margin-bottom:18px;">
      <summary style="cursor:pointer; color:var(--accent);">+ Add tracked company</summary>
      <div class="form-grid" style="margin-top:10px;">
        <label>Name</label><input type="text" id="new-name">
        <label>Careers URL</label><input type="text" id="new-url">
        <label>Notes</label><input type="text" id="new-notes">
      </div>
      <button class="primary" id="add-company">Add</button>
    </details>

    ${section('Tracked Companies', 'tracked_companies', data.tracked_companies)}
    ${section('Search Queries', 'search_queries', data.search_queries)}
  `;

  document.getElementById('portal-filter').addEventListener('input', (e) => {
    portalsState.filter = e.target.value;
    renderPortalsBody();
  });
  main.querySelectorAll('input[type=checkbox][data-section]').forEach((cb) =>
    cb.addEventListener('change', async () => {
      await fetch('/api/portals/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: cb.dataset.section, name: cb.dataset.name, enabled: cb.checked }),
      });
      const list = data[cb.dataset.section];
      const item = list.find((i) => i.name === cb.dataset.name);
      if (item) item.enabled = cb.checked;
    })
  );
  main.querySelectorAll('button[data-bulk]').forEach((btn) =>
    btn.addEventListener('click', async () => {
      const key = btn.dataset.bulk;
      const enabled = btn.dataset.enabled === 'true';
      const visible = data[key].filter(matches).map((i) => i.name);
      await fetch('/api/portals/bulk-toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: key, names: visible, enabled }),
      });
      data[key].forEach((i) => { if (visible.includes(i.name)) i.enabled = enabled; });
      renderPortalsBody();
    })
  );
  document.getElementById('add-company').addEventListener('click', async () => {
    const name = document.getElementById('new-name').value.trim();
    const careers_url = document.getElementById('new-url').value.trim();
    const notes = document.getElementById('new-notes').value.trim();
    if (!name || !careers_url) { alert('Name and careers URL are required.'); return; }
    const res = await fetch('/api/portals/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, careers_url, notes }),
    }).then((r) => r.json());
    if (res.error) { alert(res.error); return; }
    renderPortals();
  });
  document.getElementById('run-scan').addEventListener('click', async () => {
    const out = document.getElementById('scan-output');
    out.style.display = 'block';
    out.textContent = 'Starting scan…\n';
    const res = await fetch('/api/scan', { method: 'POST' });
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      out.textContent += decoder.decode(value);
      out.scrollTop = out.scrollHeight;
    }
  });
}

// ── Profile ──────────────────────────────────────────────────────────

async function renderProfile() {
  main.innerHTML = '<p class="muted">Loading…</p>';
  const p = await fetch('/api/profile').then((r) => r.json());
  const c = p.candidate || {};
  const n = p.narrative || {};
  const comp = p.compensation || {};
  const loc = p.location || {};

  main.innerHTML = `
    <h3>Candidate</h3>
    <div class="form-grid">
      <label>Full name</label><input type="text" id="f-name" value="${escapeHtml(c.full_name || '')}">
      <label>Email</label><input type="text" id="f-email" value="${escapeHtml(c.email || '')}">
      <label>Phone</label><input type="text" id="f-phone" value="${escapeHtml(c.phone || '')}">
      <label>Location</label><input type="text" id="f-location" value="${escapeHtml(c.location || '')}">
      <label>LinkedIn</label><input type="text" id="f-linkedin" value="${escapeHtml(c.linkedin || '')}">
    </div>
    <h3>Narrative</h3>
    <div class="form-grid">
      <label>Headline</label><input type="text" id="f-headline" value="${escapeHtml(n.headline || '')}">
      <label>Exit story</label><textarea id="f-exit" rows="4">${escapeHtml(n.exit_story || '')}</textarea>
      <label>Superpowers</label><textarea id="f-superpowers" rows="5" placeholder="one per line">${escapeHtml((n.superpowers || []).join('\n'))}</textarea>
    </div>
    <h3>Compensation &amp; Location</h3>
    <div class="form-grid">
      <label>Target range</label><input type="text" id="f-comp-range" value="${escapeHtml(comp.target_range || '')}">
      <label>Minimum</label><input type="text" id="f-comp-min" value="${escapeHtml(comp.minimum || '')}">
      <label>Location flexibility</label><input type="text" id="f-comp-flex" value="${escapeHtml(comp.location_flexibility || '')}">
      <label>Onsite availability</label><input type="text" id="f-onsite" value="${escapeHtml(loc.onsite_availability || '')}">
    </div>
    <button class="primary" id="save-profile">Save</button>
    <span class="muted" id="save-status" style="margin-left:10px;"></span>
  `;

  document.getElementById('save-profile').addEventListener('click', async () => {
    const patch = {
      candidate: {
        full_name: document.getElementById('f-name').value,
        email: document.getElementById('f-email').value,
        phone: document.getElementById('f-phone').value,
        location: document.getElementById('f-location').value,
        linkedin: document.getElementById('f-linkedin').value,
      },
      narrative: {
        headline: document.getElementById('f-headline').value,
        exit_story: document.getElementById('f-exit').value,
        superpowers: document.getElementById('f-superpowers').value.split('\n').map((s) => s.trim()).filter(Boolean),
      },
      compensation: {
        target_range: document.getElementById('f-comp-range').value,
        minimum: document.getElementById('f-comp-min').value,
        location_flexibility: document.getElementById('f-comp-flex').value,
      },
      location: {
        onsite_availability: document.getElementById('f-onsite').value,
      },
    };
    const el = document.getElementById('save-status');
    el.textContent = 'Saving…';
    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    }).then((r) => r.json());
    el.textContent = res.error ? `Error: ${res.error}` : 'Saved.';
  });
}

// ── Patterns ─────────────────────────────────────────────────────────

async function renderPatterns() {
  main.innerHTML = '<p class="muted">Loading…</p>';
  const data = await fetch('/api/patterns').then((r) => r.json());
  if (data.error) {
    main.innerHTML = `<p class="muted">${escapeHtml(data.error)}</p>`;
    return;
  }
  main.innerHTML = `<pre class="raw">${escapeHtml(JSON.stringify(data, null, 2))}</pre>`;
}

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

status.textContent = '';
loadTab('tracker');
