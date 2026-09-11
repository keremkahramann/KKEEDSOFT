import { timingSafeEqual } from 'node:crypto';
import { createApp } from './app.js';

// Development adapter only. Production must inject verified identity + permissions.
if (process.env.NODE_ENV === 'production') throw new Error('Üretim için gerçek kimlik sağlayıcı ve kalıcı repository gerekli.');
const token = process.env.API_DEV_TOKEN;
if (!token || token.length < 32) throw new Error('API_DEV_TOKEN en az 32 karakter olmalı. server/.env dosyasını yapılandırın.');
const port = Number(process.env.API_PORT ?? 3001);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('API_PORT geçersiz.');
const server = createApp({
  allowedOrigins: (process.env.API_ALLOWED_ORIGINS ?? 'http://localhost:8443,http://127.0.0.1:8443').split(',').map(value => value.trim()).filter(Boolean),
  authenticate(req) {
    const actual = Buffer.from(req.headers.authorization ?? '');
    const expected = Buffer.from(`Bearer ${token}`);
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return undefined;
    return { id: 'local-developer', permissions: ['read', 'suggest', 'admin'] };
  },
});
server.requestTimeout = 15_000;
server.headersTimeout = 10_000;
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
server.listen(port, process.env.API_HOST ?? '127.0.0.1', () => console.log(`Kahraman Twin API: port ${port} (development, in-memory)`));
for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(signal, () => {
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 5000).unref();
  });
}
