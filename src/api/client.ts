import type { Action, ApiErrorResponse, ApiResponse, AuditEntry, CreateAction, Dashboard, Machine, Principal, WorkOrder } from '../../shared/api';

export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string, public requestId?: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export function createApiClient(options: { baseUrl?: string; getToken?: () => string | undefined } = {}) {
  const baseUrl = (options.baseUrl ?? import.meta.env.VITE_API_BASE_URL ?? '/api/v1').replace(/\/$/, '');
  async function request<T>(path: string, init: RequestInit = {}): Promise<ApiResponse<T>> {
    const headers = new Headers(init.headers);
    headers.set('Accept', 'application/json');
    if (init.body) headers.set('Content-Type', 'application/json');
    const token = options.getToken?.();
    if (token) headers.set('Authorization', `Bearer ${token}`);
    const response = await fetch(`${baseUrl}${path}`, { ...init, headers, signal: init.signal ?? AbortSignal.timeout(15_000) });
    const body = await response.json() as ApiResponse<T> | ApiErrorResponse;
    if (!response.ok) {
      const error = 'error' in body ? body.error : undefined;
      throw new ApiError(response.status, error?.code ?? 'HTTP_ERROR', error?.message ?? 'API isteği başarısız.', error?.requestId);
    }
    return body as ApiResponse<T>;
  }
  const list = <T>(path: string, filters: { page?: number; pageSize?: number; status?: string } = {}) => {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) if (value !== undefined) query.set(key, String(value));
    return request<T[]>(`${path}?${query}`);
  };
  return {
    request,
    health: () => request<{ status: string; service: string; storage: string }>('/health'),
    me: () => request<Principal>('/auth/me'),
    dashboard: () => request<Dashboard>('/dashboard'),
    machines: { list: (filters?: Parameters<typeof list>[1]) => list<Machine>('/machines', filters), get: (id: string) => request<Machine>(`/machines/${encodeURIComponent(id)}`) },
    workOrders: { list: (filters?: Parameters<typeof list>[1]) => list<WorkOrder>('/work-orders', filters), get: (id: string) => request<WorkOrder>(`/work-orders/${encodeURIComponent(id)}`) },
    actions: {
      list: (filters?: Parameters<typeof list>[1]) => list<Action>('/actions', filters),
      get: (id: string) => request<Action>(`/actions/${encodeURIComponent(id)}`),
      create: (body: CreateAction) => request<Action>('/actions', { method: 'POST', body: JSON.stringify(body) }),
      decide: (id: string, decision: 'approved' | 'rejected', reason: string) => request<Action>(`/actions/${encodeURIComponent(id)}/decision`, { method: 'POST', body: JSON.stringify({ decision, reason }) }),
    },
    audit: (filters?: Parameters<typeof list>[1]) => list<AuditEntry>('/admin/audit', filters),
  };
}
