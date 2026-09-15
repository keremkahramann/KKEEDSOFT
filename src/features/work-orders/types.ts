// Örnek veride yalnızca bu iş emri durumu bulunuyor.
// Diğer durumlar süreç netleştiğinde eklenebilir.
export type WorkOrderStatus = 'in_progress';

export type WorkOrderRisk = 'none' | 'warning' | 'critical';

export type OperationStatus = 'pending' | 'in_progress' | 'done';

export interface WorkOrder {
  id: string;
  product: string;
  customer: string;
  qty: number;
  done: number;
  status: WorkOrderStatus;
  risk: WorkOrderRisk;
  deadline: string; // Mevcut gösterim: GG.AA.YYYY
  machine: string;
}

export interface WorkOrderOperation {
  seq: number;
  name: string;
  resource: string;
  plan: string; // Mevcut gösterim: "4 saat"
  actual: string; // Mevcut gösterim: "2,5 saat" veya "—"
  status: OperationStatus;
}
