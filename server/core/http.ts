import type { IncomingMessage } from 'node:http';

export class HttpError extends Error {
  constructor(public status: number, public code: string, message: string) {
    super(message);
  }
}

export async function readJson(req: IncomingMessage): Promise<Record<string, unknown>> {
  if (req.headers['content-type']?.split(';')[0].trim().toLowerCase() !== 'application/json') {
    throw new HttpError(415, 'UNSUPPORTED_MEDIA_TYPE', 'application/json gerekli.');
  }
  let size = 0;
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 64 * 1024) throw new HttpError(413, 'PAYLOAD_TOO_LARGE', 'İstek gövdesi çok büyük.');
    chunks.push(Buffer.from(chunk));
  }
  try {
    const body: unknown = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error();
    return body as Record<string, unknown>;
  } catch {
    throw new HttpError(400, 'INVALID_JSON', 'Geçerli bir JSON nesnesi gerekli.');
  }
}

export function stringField(body: Record<string, unknown>, key: string, max = 2000): string {
  const value = body[key];
  if (typeof value !== 'string' || !value.trim() || value.trim().length > max) {
    throw new HttpError(400, 'VALIDATION_ERROR', `${key}: 1-${max} karakter gerekli.`);
  }
  return value.trim();
}

export function paginate<T>(rows: T[], query: URLSearchParams) {
  const parse = (key: string, fallback: number, max: number) => {
    const raw = query.get(key);
    const value = raw === null ? fallback : Number(raw);
    if (!Number.isSafeInteger(value) || value < 1 || value > max) {
      throw new HttpError(400, 'VALIDATION_ERROR', `${key} geçersiz.`);
    }
    return value;
  };
  const page = parse('page', 1, 1_000_000);
  const pageSize = parse('pageSize', 20, 100);
  return { data: rows.slice((page - 1) * pageSize, page * pageSize), meta: { page, pageSize, total: rows.length } };
}
