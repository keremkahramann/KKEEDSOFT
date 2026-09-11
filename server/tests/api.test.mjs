import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createApp } from '../../build/api/server/app.js';

async function fixture(t) {
  const users = {
    reader: { id: 'reader', permissions: ['read'] },
    author: { id: 'author', permissions: ['read', 'suggest', 'approve'] },
    approver: { id: 'approver', permissions: ['read', 'approve', 'admin'] },
  };
  const app = createApp({ allowedOrigins: ['http://localhost:8443'], authenticate: req => users[req.headers.authorization?.replace('Bearer ', '')] });
  await new Promise(resolve => app.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => app.close(resolve)));
  return async (path, { token = 'reader', body, method = 'GET', headers = {} } = {}) => {
    const response = await fetch(`http://127.0.0.1:${app.address().port}/api/v1${path}`, {
      method, headers: { Authorization: `Bearer ${token}`, ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...headers },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    return { status: response.status, headers: response.headers, body: response.status === 204 ? null : await response.json() };
  };
}

test('health, authentication, filtering, pagination and machine aliases', async t => {
  const request = await fixture(t);
  assert.equal((await request('/health', { token: '' })).status, 200);
  assert.equal((await request('/machines', { token: '' })).status, 401);
  const result = await request('/machines?status=running&pageSize=1');
  assert.equal(result.body.data.length, 1);
  assert.equal(result.body.meta.total, 2);
  assert.equal(result.body.meta.requestId, result.headers.get('x-request-id'));
  assert.equal((await request('/machines/PRESS-07')).body.data.id, 'P07');
  assert.equal((await request('/machines?page=0')).status, 400);
  assert.equal((await request('/machines/missing')).status, 404);
  assert.equal((await request('/machines', { method: 'DELETE' })).status, 405);
  assert.equal((await request('/quality')).status, 501);
  assert.equal((await request('/admin/audit')).status, 403);
  assert.equal((await request('/machines', { headers: { Origin: 'https://untrusted.example' } })).status, 403);
  const cors = await request('/machines', { method: 'OPTIONS', headers: { Origin: 'http://localhost:8443' } });
  assert.equal(cors.status, 204);
  assert.equal(cors.headers.get('access-control-allow-origin'), 'http://localhost:8443');
});

test('action validation, permissions, decision conflict and audit trail', async t => {
  const request = await fixture(t);
  const action = { type: 'maintenance', entityId: 'P07', description: 'Hidrolik bakım talebi' };
  assert.equal((await request('/actions', { method: 'POST', body: action })).status, 403);
  assert.equal((await request('/actions', { token: 'author', method: 'POST', body: { ...action, description: '' } })).status, 400);
  assert.equal((await request('/actions', { token: 'author', method: 'POST', body: { ...action, entityId: 'missing' } })).status, 404);
  assert.equal((await request('/actions', { token: 'author', method: 'POST', body: { ...action, description: 'a'.repeat(70000) } })).status, 413);
  const created = await request('/actions', { token: 'author', method: 'POST', body: action });
  assert.equal(created.status, 201);
  assert.equal(created.body.data.status, 'pending_approval');
  const path = `/actions/${created.body.data.id}/decision`;
  const body = { decision: 'approved', reason: 'Bakım planı kontrol edildi.' };
  assert.equal((await request(path, { token: 'author', method: 'POST', body })).status, 403);
  assert.equal((await request(path, { token: 'approver', method: 'POST', body })).body.data.status, 'approved');
  assert.equal((await request(path, { token: 'approver', method: 'POST', body })).status, 409);
  const audit = await request('/admin/audit', { token: 'approver' });
  assert.deepEqual(audit.body.data.map(row => row.action), ['action.created', 'action.approved']);
  assert.equal((await request('/machines/P07')).body.data.status, 'breakdown');
});
