export interface ApiResponse<T> {
  data: T;
  meta: { requestId: string; page?: number; pageSize?: number; total?: number };
}

export interface ApiErrorResponse {
  error: { code: string; message: string; requestId: string };
}

export type MachineStatus = 'running' | 'setup' | 'maintenance' | 'stopped' | 'breakdown' | 'offline';
export interface Machine {
  id: string;
  name: string;
  area: string;
  status: MachineStatus;
  oee: number;
  target: number;
  actual: number;
  downtimeToday: number;
  alarms: string[];
}

export interface WorkOrder {
  id: string;
  product: string;
  customer: string;
  qty: number;
  done: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  risk: 'none' | 'warning' | 'critical';
  deadline: string;
  machineIds: string[];
}

export interface CreateAction {
  type: 'plan_change' | 'maintenance' | 'quality';
  entityId: string;
  description: string;
}

export interface Action extends CreateAction {
  id: string;
  status: 'pending_approval' | 'approved' | 'rejected';
  createdAt: string;
  requesterId: string;
  decidedAt?: string;
  decidedBy?: string;
  reason?: string;
}

export interface AuditEntry {
  id: string;
  actorId: string;
  action: string;
  entityId: string;
  createdAt: string;
}

export interface Dashboard {
  machineCount: number;
  runningMachines: number;
  breakdownMachines: number;
  activeWorkOrders: number;
  pendingActions: number;
}

export interface Principal {
  id: string;
  permissions: ('read' | 'suggest' | 'approve' | 'admin')[];
}
