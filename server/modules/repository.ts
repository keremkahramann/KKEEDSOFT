import type { Action, AuditEntry, Machine, WorkOrder } from '../../shared/api.js';

// Replace this port with persistent storage / ERP and MES adapters.
export interface Repository {
  machines: Machine[];
  workOrders: WorkOrder[];
  actions: Action[];
  audit: AuditEntry[];
}

export function createMemoryRepository(): Repository {
  return {
    machines: [
      { id: 'P01', name: 'PRESS-01', area: 'Metal Üretim', status: 'running', oee: 79, target: 3600, actual: 2842, downtimeToday: 0, alarms: [] },
      { id: 'P07', name: 'PRESS-07', area: 'Metal Üretim', status: 'breakdown', oee: 0, target: 3600, actual: 0, downtimeToday: 263, alarms: ['Hidrolik basınç kaybı'] },
      { id: 'I01', name: 'INJ-01', area: 'Plastik Enjeksiyon', status: 'running', oee: 77, target: 4800, actual: 3696, downtimeToday: 20, alarms: [] },
    ],
    workOrders: [
      { id: 'WO-2026-1048', product: 'PRT-1042 Muhafaza Kapağı', customer: 'Arçelik A.Ş.', qty: 1500000, done: 938400, status: 'in_progress', risk: 'critical', deadline: '2026-09-10', machineIds: ['I01', 'P07'] },
      { id: 'WO-2026-1031', product: 'MTL-0887 Bağlantı Braketi', customer: 'Ford Otosan', qty: 84000, done: 37000, status: 'in_progress', risk: 'warning', deadline: '2026-09-12', machineIds: ['P01'] },
    ],
    actions: [],
    audit: [],
  };
}
