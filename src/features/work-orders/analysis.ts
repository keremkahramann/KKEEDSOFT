import type { DataSourceReference } from '../../types/data-source';
import type { WorkOrder } from './types';

/**
 * Analizde değerlendirilen gecikme durumu; iş emrinin çalışma durumu değildir.
 * not_delayed gelecekte zamanında teslim garantisi vermez.
 * unknown, mevcut verilerle gecikmenin belirlenemediğini ifade eder.
 */
export type WorkOrderDelayStatus = 'not_delayed' | 'delayed' | 'unknown';

/** Kaynakla doğrulanan bilgi ile yorum yoluyla ulaşılan sonucu ayırır. */
export type AnalysisFindingKind = 'verified' | 'inference';

export interface WorkOrderAnalysisFinding {
  kind: AnalysisFindingKind;
  description: string;

  /** Bulguyu destekleyen kayıtlar; boş liste doğrulama kanıtı sayılmaz. */
  sources: DataSourceReference[];
}

/**
 * İş emri analizi için başlangıç modeli; henüz kesinleşmiş API sözleşmesi değil.
 * Hesaplama ve gecikme kuralları süreç sahibiyle ayrıca netleştirilecek.
 */
export interface WorkOrderAnalysis {
  workOrderId: WorkOrder['id'];

  /**
   * Analizin oluşturulma zamanı; kaynak verinin güncellenme zamanı değildir.
   * Saat dilimi içeren ISO 8601 metni; API sınırında doğrulanmalıdır.
   */
  analyzedAt: string;

  delayStatus: WorkOrderDelayStatus;
  summary: string;
  findings: WorkOrderAnalysisFinding[];

  /** Analizde kullanılan, henüz doğrulanmamış kabuller. Yoksa boş liste. */
  assumptions: string[];

  /** Sonucu sınırlandıran eksik bilgiler. Yoksa boş liste. */
  missingData: string[];

  /** Bulgular dahil, analizin hazırlanmasında kullanılan kaynak kayıtlar. */
  sources: DataSourceReference[];
}
