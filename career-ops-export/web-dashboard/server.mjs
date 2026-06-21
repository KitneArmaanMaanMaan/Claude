#!/usr/bin/env node
// Zero-dependency local web dashboard for career-ops.
// Reads/writes the same files the CLI uses (data/applications.md via
// tracker.mjs, reports/, portals.yml, config/profile.yml) and serves
// them as a small single-page app.

import { createServer } from 'node:http';
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync, spawn } from 'node:child_process';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PUBLIC = join(__dirname, 'public');
const PORT = process.env.PORT || 4848;

function send(res, status, body, type = 'application/json') {
  res.writeHead(status, { 'Content-Type': type });
  res.end(typeof body === 'string' ? body : JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => resolve(body ? JSON.parse(body) : {}));
  });
}

// ── Tracker ──────────────────────────────────────────────────────────

function getApplications() {
  try {
    const out = execFileSync('node', ['tracker.mjs', 'query', '--json', '--limit', '500'], {
      cwd: ROOT,
      encoding: 'utf8',
    });
    return JSON.parse(out);
  } catch (err) {
    return { error: String(err.message || err) };
  }
}

function getStates() {
  const doc = yaml.load(readFileSync(join(ROOT, 'templates/states.yml'), 'utf8'));
  return doc.states.map((s) => s.label);
}

// Edits the Status column of an existing row in data/applications.md.
// tracker.mjs auto-resyncs the derived DB the next time it's queried.
function updateApplicationStatus(id, newStatus) {
  const states = getStates();
  const canonical = states.find((s) => s.toLowerCase() === String(newStatus).toLowerCase());
  if (!canonical) throw new Error(`Unknown status "${newStatus}". Canonical: ${states.join(', ')}`);
  const path = join(ROOT, 'data/applications.md');
  const lines = readFileSync(path, 'utf8').split('\n');
  let found = false;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^\|\s*(\d+)\s*\|/);
    if (m && parseInt(m[1], 10) === Number(id)) {
      const parts = lines[i].split('|');
      // parts: ['', ' id ', ' date ', ' company ', ' role ', ' score ', ' status ', ' pdf ', ' report ', ' notes ', '']
      parts[6] = ` ${canonical} `;
      lines[i] = parts.join('|');
      found = true;
      break;
    }
  }
  if (!found) throw new Error(`No application with id ${id}`);
  writeFileSync(path, lines.join('\n'));
}

// ── Reports ──────────────────────────────────────────────────────────

function getReports() {
  const dir = join(ROOT, 'reports');
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const text = readFileSync(join(dir, f), 'utf8');
      const titleMatch = text.match(/^#\s*(.+)$/m);
      const scoreMatch = text.match(/\*\*Score:\*\*\s*([\d.]+\/\d)/);
      const dateMatch = text.match(/\*\*Date:\*\*\s*(\S+)/);
      const urlMatch = text.match(/\*\*URL:\*\*\s*(\S+)/);
      const legitMatch = text.match(/\*\*Legitimacy:\*\*\s*(.+)$/m);
      return {
        file: f,
        title: titleMatch ? titleMatch[1].trim() : f,
        score: scoreMatch ? scoreMatch[1] : null,
        date: dateMatch ? dateMatch[1] : null,
        url: urlMatch ? urlMatch[1] : null,
        legitimacy: legitMatch ? legitMatch[1].trim() : null,
      };
    })
    .sort((a, b) => b.file.localeCompare(a.file));
}

function getReportContent(file) {
  const safe = file.replace(/[/\\]/g, '');
  const path = join(ROOT, 'reports', safe);
  if (!existsSync(path)) return null;
  return readFileSync(path, 'utf8');
}

// ── Portals ──────────────────────────────────────────────────────────

function getPortals() {
  const raw = readFileSync(join(ROOT, 'portals.yml'), 'utf8');
  const doc = yaml.load(raw);
  return {
    tracked_companies: doc.tracked_companies || [],
    search_queries: doc.search_queries || [],
  };
}

function togglePortalEntry(section, name, enabled) {
  const path = join(ROOT, 'portals.yml');
  const raw = readFileSync(path, 'utf8');
  const lines = raw.split('\n');
  let inSection = false;
  let inEntry = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^[a-zA-Z_]+:\s*$/.test(line)) {
      inSection = line.startsWith(section + ':');
      inEntry = false;
      continue;
    }
    if (!inSection) continue;
    const nameMatch = line.match(/^\s*-\s*name:\s*(.+)\s*$/);
    if (nameMatch) {
      inEntry = nameMatch[1].trim() === name;
      continue;
    }
    if (inEntry && /^\s*enabled:\s*(true|false)\s*$/.test(line)) {
      lines[i] = line.replace(/(true|false)/, enabled ? 'true' : 'false');
      inEntry = false;
    }
  }
  writeFileSync(path, lines.join('\n'));
}

function bulkTogglePortalEntries(section, names, enabled) {
  for (const name of names) togglePortalEntry(section, name, enabled);
}

function addTrackedCompany({ name, careers_url, notes }) {
  if (!name || !careers_url) throw new Error('name and careers_url are required');
  const path = join(ROOT, 'portals.yml');
  const raw = readFileSync(path, 'utf8');
  const block =
    `\n  - name: ${name}\n    careers_url: ${careers_url}` +
    (notes ? `\n    notes: "${String(notes).replace(/"/g, '\\"')}"` : '') +
    `\n    enabled: true\n`;
  // Insert right after the "tracked_companies:" line.
  const idx = raw.indexOf('tracked_companies:');
  if (idx === -1) throw new Error('tracked_companies: section not found in portals.yml');
  const lineEnd = raw.indexOf('\n', idx) + 1;
  const updated = raw.slice(0, lineEnd) + block + raw.slice(lineEnd);
  writeFileSync(path, updated);
}

function getScanHistory() {
  const path = join(ROOT, 'data/scan-history.tsv');
  if (!existsSync(path)) return [];
  const lines = readFileSync(path, 'utf8').split('\n').filter(Boolean);
  // Format: url \t status \t date (best-effort; tolerate extra columns)
  const byHost = new Map();
  for (const line of lines) {
    const cols = line.split('\t');
    const url = cols[0] || '';
    const date = cols[2] || cols[1] || '';
    let host = '';
    try { host = new URL(url).hostname; } catch { /* ignore malformed */ }
    if (!host) continue;
    const entry = byHost.get(host) || { host, count: 0, lastSeen: '' };
    entry.count += 1;
    if (date > entry.lastSeen) entry.lastSeen = date;
    byHost.set(host, entry);
  }
  return [...byHost.values()];
}

function runScanStreaming(res) {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', 'Transfer-Encoding': 'chunked' });
  const child = spawn('node', ['scan.mjs'], { cwd: ROOT });
  child.stdout.on('data', (d) => res.write(d));
  child.stderr.on('data', (d) => res.write(d));
  child.on('close', (code) => {
    res.write(`\n[scan finished, exit code ${code}]\n`);
    res.end();
  });
  child.on('error', (err) => {
    res.write(`\n[scan failed to start: ${err.message}]\n`);
    res.end();
  });
}

// ── Profile ──────────────────────────────────────────────────────────

function getProfile() {
  return yaml.load(readFileSync(join(ROOT, 'config/profile.yml'), 'utf8'));
}

function saveProfile(partial) {
  const current = getProfile();
  const merged = deepMerge(current, partial);
  const path = join(ROOT, 'config/profile.yml');
  writeFileSync(path, yaml.dump(merged, { lineWidth: -1 }));
  return merged;
}

function deepMerge(base, patch) {
  if (Array.isArray(patch)) return patch;
  if (typeof patch !== 'object' || patch === null) return patch;
  const out = { ...base };
  for (const k of Object.keys(patch)) {
    out[k] = typeof base?.[k] === 'object' && base[k] !== null && !Array.isArray(patch[k])
      ? deepMerge(base[k], patch[k])
      : patch[k];
  }
  return out;
}

// ── Patterns ─────────────────────────────────────────────────────────

function getPatterns() {
  try {
    const out = execFileSync('node', ['analyze-patterns.mjs'], { cwd: ROOT, encoding: 'utf8' });
    return JSON.parse(out);
  } catch (err) {
    return { error: String(err.stdout || err.message || err) };
  }
}

// ── HTTP server ──────────────────────────────────────────────────────

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname === '/api/applications') return send(res, 200, getApplications());
    if (url.pathname === '/api/applications/status' && req.method === 'POST') {
      const { id, status } = await readBody(req);
      updateApplicationStatus(id, status);
      return send(res, 200, { ok: true });
    }
    if (url.pathname === '/api/states') return send(res, 200, getStates());

    if (url.pathname === '/api/reports') return send(res, 200, getReports());
    if (url.pathname === '/api/report' && url.searchParams.get('file')) {
      const content = getReportContent(url.searchParams.get('file'));
      return content === null ? send(res, 404, { error: 'not found' }) : send(res, 200, { content });
    }

    if (url.pathname === '/api/portals') return send(res, 200, getPortals());
    if (url.pathname === '/api/portals/toggle' && req.method === 'POST') {
      const { section, name, enabled } = await readBody(req);
      togglePortalEntry(section, name, enabled);
      return send(res, 200, { ok: true });
    }
    if (url.pathname === '/api/portals/bulk-toggle' && req.method === 'POST') {
      const { section, names, enabled } = await readBody(req);
      bulkTogglePortalEntries(section, names, enabled);
      return send(res, 200, { ok: true });
    }
    if (url.pathname === '/api/portals/add' && req.method === 'POST') {
      const body = await readBody(req);
      addTrackedCompany(body);
      return send(res, 200, { ok: true });
    }
    if (url.pathname === '/api/scan-history') return send(res, 200, getScanHistory());
    if (url.pathname === '/api/scan' && req.method === 'POST') return runScanStreaming(res);

    if (url.pathname === '/api/profile') {
      if (req.method === 'POST') {
        const body = await readBody(req);
        return send(res, 200, saveProfile(body));
      }
      return send(res, 200, getProfile());
    }

    if (url.pathname === '/api/patterns') return send(res, 200, getPatterns());

    // static file serving
    let filePath = url.pathname === '/' ? '/index.html' : url.pathname;
    const fullPath = join(PUBLIC, filePath);
    if (!fullPath.startsWith(PUBLIC) || !existsSync(fullPath)) return send(res, 404, 'Not found', 'text/plain');
    const ext = extname(fullPath);
    send(res, 200, readFileSync(fullPath, 'utf8'), MIME[ext] || 'text/plain');
  } catch (err) {
    send(res, 500, { error: String(err.message || err) });
  }
});

server.listen(PORT, () => {
  console.log(`career-ops dashboard running at http://localhost:${PORT}`);
});
