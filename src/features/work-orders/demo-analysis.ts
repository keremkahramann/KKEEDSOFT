import type { WorkOrderAnalysis } from './analysis';
import type { WorkOrder } from './types';
import type { DataSourceReference } from '../../types/data-source';

/** Ekran bağlantısı için örnek çıktı üretir; gecikme hesabı yapmaz. */
export function createDemoWorkOrderAnalysis(order: WorkOrder): WorkOrderAnalysis {
  const source: DataSourceReference = {
    sourceId: 'work-order-demo',
    sourceName: 'Yerel iş emri örnek verisi',
    sourceRecordId: order.id,
    sourceUpdatedAt: null,
  };

  return {
    workOrderId: order.id,
    analyzedAt: '2026-09-15T09:00:00+03:00',
    delayStatus: 'unknown',
    summary: `${order.id} için örnek üretim bilgileri gösteriliyor. Verinin güncelliği ve gecikme kuralları doğrulanmadığı için gecikme durumu belirlenemiyor.`,
    findings: [
      {
        kind: 'verified',
        description: `Örnek kayıtta ${order.qty.toLocaleString('tr-TR')} adetlik iş emrinin ${order.done.toLocaleString('tr-TR')} adedi tamamlanmış görünüyor. Bu bilgi yalnızca yerel örnek kayıtla doğrulanmıştır.`,
        sources: [source],
      },
      {
        kind: 'inference',
        description: 'Tamamlanan miktar tek başına teslim tarihine yetişilip yetişilemeyeceğini göstermiyor.',
        sources: [source],
      },
    ],
    assumptions: [],
    missingData: [
      'Üretim verisinin kaynakta son güncellenme zamanı bilinmiyor.',
      `${order.deadline} tarihli terminin güncel planla eşleşmesi doğrulanmadı.`,
      'Gecikme hesabında kullanılacak takvim ve iş kuralları netleşmedi.',
    ],
    sources: [source],
  };
}
