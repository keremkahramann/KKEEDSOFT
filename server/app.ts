import { randomUUID } from 'node:crypto';
import { createServer, type IncomingMessage } from 'node:http';
import type { Principal } from '../shared/api.js';
import { HttpError, paginate, readJson } from './core/http.js';
import { createAction, decideAction, requirePermission } from './modules/actions.js';
import { createMemoryRepository, type Repository } from './modules/repository.js';

export interface AppOptions {
  authenticate: (req: IncomingMessage) => Principal | undefined | Promise<Principal | undefined>;
  repository?: Repository;
  allowedOrigins?: string[];
}

// These modules are deliberately unavailable until their adapters are implemented.
const planned = new Set([
  '/operations', '/planning', '/problems', '/quality', '/cost', '/documents',
  '/reports', '/admin/users', '/admin/data-sources', '/notifications',
]);

export function createApp(options: AppOptions) {
  const repo = options.repository ?? createMemoryRepository();
  return createServer(async (req, res) => {
    const requestId = randomUUID();
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('X-Request-Id', requestId);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Vary', 'Origin');
    const send = (status: number, data: unknown, meta = {}) => {
      res.statusCode = status;
      res.end(JSON.stringify({ data, meta: { ...meta, requestId } }));
    };
    try {
      const origin = req.headers.origin;
      if (origin) {
        if (!options.allowedOrigins?.includes(origin)) throw new HttpError(403, 'ORIGIN_DENIED', 'Origin izinli değil.');
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Expose-Headers', 'X-Request-Id');
      }
      const url = new URL(req.url ?? '/', 'http://localhost');
      if (!url.pathname.startsWith('/api/v1/')) throw new HttpError(404, 'NOT_FOUND', 'Endpoint bulunamadı.');
      let path: string;
      try { path = decodeURIComponent(url.pathname.slice('/api/v1'.length)); }
      catch { throw new HttpError(400, 'INVALID_PATH', 'URL kodlaması geçersiz.'); }
      if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
        res.writeHead(204).end();
        return;
      }
      if (path === '/health' && req.method === 'GET') {
        send(200, { status: 'ok', service: 'kahraman-twin-api', storage: 'memory' });
        return;
      }
      const user = await options.authenticate(req);
      if (!user) throw new HttpError(401, 'UNAUTHORIZED', 'Geçerli Bearer token gerekli.');
      const decisionMatch = /^\/actions\/([^/]+)\/decision$/.exec(path);
      const detailMatch = /^\/(machines|work-orders|actions)\/([^/]+)$/.exec(path);
      const allowed = decisionMatch ? ['POST'] : path === '/actions' ? ['GET', 'POST']
        : path === '/chat/messages' ? ['POST']
        : planned.has(path) || detailMatch || ['/health', '/auth/me', '/dashboard', '/machines', '/work-orders', '/admin/audit'].includes(path) ? ['GET'] : [];
      if (!allowed.length) throw new HttpError(404, 'NOT_FOUND', 'Endpoint bulunamadı.');
      if (!allowed.includes(req.method ?? '')) {
        res.setHeader('Allow', allowed.join(', '));
        throw new HttpError(405, 'METHOD_NOT_ALLOWED', 'HTTP metodu desteklenmiyor.');
      }
      requirePermission(user, 'read');
      if (path.startsWith('/admin/')) requirePermission(user, 'admin');
      if (planned.has(path) || path === '/chat/messages') {
        throw new HttpError(501, 'NOT_IMPLEMENTED', 'Modül için veri kaynağı/servis entegrasyonu henüz uygulanmadı.');
      }
      if (path === '/auth/me') { send(200, user); return; }
      if (path === '/dashboard') {
        send(200, {
          machineCount: repo.machines.length,
          runningMachines: repo.machines.filter(m => m.status === 'running').length,
          breakdownMachines: repo.machines.filter(m => m.status === 'breakdown').length,
          activeWorkOrders: repo.workOrders.filter(w => w.status === 'in_progress').length,
          pendingActions: repo.actions.filter(a => a.status === 'pending_approval').length,
        });
        return;
      }
      if (path === '/actions' && req.method === 'POST') {
        requirePermission(user, 'suggest');
        send(201, createAction(repo, await readJson(req), user)); return;
      }
      if (decisionMatch) {
        requirePermission(user, 'approve');
        send(200, decideAction(repo, decisionMatch[1], await readJson(req), user)); return;
      }
      if (detailMatch) {
        const rows = detailMatch[1] === 'machines' ? repo.machines : detailMatch[1] === 'work-orders' ? repo.workOrders : repo.actions;
        const item = rows.find(row => row.id === detailMatch[2] || ('name' in row && row.name === detailMatch[2]));
        if (!item) throw new HttpError(404, 'NOT_FOUND', 'Kayıt bulunamadı.');
        send(200, item); return;
      }
      const rows = path === '/machines' ? repo.machines : path === '/work-orders' ? repo.workOrders : path === '/actions' ? repo.actions : repo.audit;
      const status = url.searchParams.get('status');
      const filtered = status ? rows.filter(row => 'status' in row && row.status === status) : rows;
      const result = paginate(filtered, url.searchParams);
      send(200, result.data, result.meta);
    } catch (error) {
      const known = error instanceof HttpError;
      if (!known) console.error({ requestId, message: error instanceof Error ? error.message : 'Unknown error' });
      res.statusCode = known ? error.status : 500;
      if (res.statusCode === 401) res.setHeader('WWW-Authenticate', 'Bearer');
      res.end(JSON.stringify({ error: {
        code: known ? error.code : 'INTERNAL_ERROR',
        message: known ? error.message : 'Beklenmeyen sunucu hatası.', requestId,
      } }));
    }
  });
}
