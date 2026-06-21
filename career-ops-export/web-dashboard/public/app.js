const main = document.getElementById('main');
const status = document.getElementById('status');
const tabs = document.querySelectorAll('nav button');

tabs.forEach((b) => b.addEventListener('click', () => loadTab(b.dataset.tab)));

function setActive(tab) {
  tabs.forEach((b) => b.classList.toggle('active', b.dataset.tab === tab));
}

async function loadTab(tab) {
  setActive(tab);
  if (tab === 'tracker') return renderTracker();
  if (tab === 'reports') return renderReports();
  if (tab === 'portals') return renderPortals();
}

async function renderTracker() {
  main.innerHTML = '<p class="muted">Loading…</p>';
  const rows = await fetch('/api/applications').then((r) => r.json());
  if (rows.error) {
    main.innerHTML = `<p class="muted">No tracker data yet (${rows.error}).</p>`;
    return;
  }
  const html = `
    <table>
      <thead><tr><th>#</th><th>Date</th><th>Company</th><th>Role</th><th>Score</th><th>Status</th><th>Report</th></tr></thead>
      <tbody>
        ${rows.map((r) => `
          <tr>
            <td>${r.id}</td>
            <td>${r.date}</td>
            <td>${escapeHtml(r.company)}</td>
            <td>${escapeHtml(r.role)}</td>
            <td>${r.score ?? ''}</td>
            <td><span class="badge ${r.status}">${r.status}</span></td>
            <td>${r.report ? `<a href="#" data-file="${r.report.match(/\(([^)]+)\)/)?.[1] || ''}" class="open-report">view</a>` : ''}</td>
          </tr>`).join('')}
      </tbody>
    </table>`;
  main.innerHTML = html;
  document.querySelectorAll('.open-report').forEach((a) =>
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const file = a.dataset.file.split('/').pop();
      if (file) openReport(file);
    })
  );
}

async function renderReports() {
  main.innerHTML = '<p class="muted">Loading…</p>';
  const reports = await fetch('/api/reports').then((r) => r.json());
  if (!reports.length) {
    main.innerHTML = '<p class="muted">No reports yet. Run an evaluation first.</p>';
    return;
  }
  main.innerHTML = reports.map((r) => `
    <div class="card">
      <h3><a href="#" data-file="${r.file}" class="open-report">${escapeHtml(r.title)}</a></h3>
      <div class="meta">${r.score ? `Score: ${r.score} · ` : ''}${r.legitimacy ? `Legitimacy: ${r.legitimacy} · ` : ''}${r.url ? `<a href="${r.url}" target="_blank">posting</a>` : ''}</div>
    </div>`).join('');
  document.querySelectorAll('.open-report').forEach((a) =>
    a.addEventListener('click', (e) => {
      e.preventDefault();
      openReport(a.dataset.file);
    })
  );
}

async function openReport(file) {
  const { content } = await fetch(`/api/report?file=${encodeURIComponent(file)}`).then((r) => r.json());
  main.innerHTML = `<button class="primary" id="back">&larr; back</button><pre>${escapeHtml(content || 'Not found')}</pre>`;
  document.getElementById('back').addEventListener('click', renderReports);
}

async function renderPortals() {
  main.innerHTML = '<p class="muted">Loading…</p>';
  const data = await fetch('/api/portals').then((r) => r.json());
  const section = (title, key, items) => `
    <h3>${title} (${items.filter((i) => i.enabled).length}/${items.length} enabled)</h3>
    ${items.map((i) => `
      <div class="toggle-row">
        <div>
          <div class="name">${escapeHtml(i.name)}</div>
          <div class="url">${escapeHtml(i.careers_url || i.query || '')}</div>
        </div>
        <label class="switch">
          <input type="checkbox" data-section="${key}" data-name="${escapeHtml(i.name)}" ${i.enabled ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
      </div>`).join('')}
  `;
  main.innerHTML = `
    <div style="margin-bottom:16px;">
      <button class="primary" id="run-scan">Run scan now</button>
      <span class="muted" id="scan-status"></span>
    </div>
    ${section('Tracked Companies', 'tracked_companies', data.tracked_companies)}
    ${section('Search Queries', 'search_queries', data.search_queries)}
  `;
  document.querySelectorAll('input[type=checkbox]').forEach((cb) =>
    cb.addEventListener('change', async () => {
      await fetch('/api/portals/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: cb.dataset.section, name: cb.dataset.name, enabled: cb.checked }),
      });
    })
  );
  document.getElementById('run-scan').addEventListener('click', async () => {
    const el = document.getElementById('scan-status');
    el.textContent = 'Scanning… (this can take a minute)';
    const result = await fetch('/api/scan', { method: 'POST' }).then((r) => r.json());
    el.textContent = result.ok ? 'Scan complete.' : 'Scan finished with errors — check terminal.';
  });
}

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

status.textContent = '';
loadTab('tracker');
