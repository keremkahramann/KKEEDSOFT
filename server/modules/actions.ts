import { randomUUID } from 'node:crypto';
import type { Action, Principal } from '../../shared/api.js';
import { HttpError, stringField } from '../core/http.js';
import type { Repository } from './repository.js';

export function requirePermission(user: Principal, permission: Principal['permissions'][number]) {
  if (!user.permissions.includes(permission)) throw new HttpError(403, 'FORBIDDEN', 'Bu işlem için yetkiniz yok.');
}

export function createAction(repo: Repository, body: Record<string, unknown>, user: Principal): Action {
  requirePermission(user, 'suggest');
  const type = stringField(body, 'type', 30);
  if (type !== 'plan_change' && type !== 'maintenance' && type !== 'quality') {
    throw new HttpError(400, 'VALIDATION_ERROR', 'Aksiyon türü geçersiz.');
  }
  const entityId = stringField(body, 'entityId', 100);
  if (![...repo.machines, ...repo.workOrders].some(row => row.id === entityId)) {
    throw new HttpError(404, 'ENTITY_NOT_FOUND', 'Makine veya iş emri bulunamadı.');
  }
  const action: Action = {
    id: randomUUID(), type, entityId, description: stringField(body, 'description'),
    status: 'pending_approval', requesterId: user.id, createdAt: new Date().toISOString(),
  };
  repo.actions.push(action);
  audit(repo, user.id, 'action.created', action.id);
  return action;
}

export function decideAction(repo: Repository, id: string, body: Record<string, unknown>, user: Principal): Action {
  requirePermission(user, 'approve');
  const decision = stringField(body, 'decision', 20);
  if (decision !== 'approved' && decision !== 'rejected') throw new HttpError(400, 'VALIDATION_ERROR', 'Karar geçersiz.');
  const reason = stringField(body, 'reason');
  const action = repo.actions.find(row => row.id === id);
  if (!action) throw new HttpError(404, 'NOT_FOUND', 'Aksiyon bulunamadı.');
  if (action.requesterId === user.id) throw new HttpError(403, 'SELF_APPROVAL_FORBIDDEN', 'Kendi aksiyonunuzu değerlendiremezsiniz.');
  if (action.status !== 'pending_approval') throw new HttpError(409, 'INVALID_STATE', 'Aksiyon daha önce değerlendirildi.');
  Object.assign(action, { status: decision, reason, decidedBy: user.id, decidedAt: new Date().toISOString() });
  audit(repo, user.id, `action.${decision}`, id);
  return action;
}

function audit(repo: Repository, actorId: string, action: string, entityId: string) {
  repo.audit.push({ id: randomUUID(), actorId, action, entityId, createdAt: new Date().toISOString() });
}
