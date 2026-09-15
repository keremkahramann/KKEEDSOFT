import type { WorkOrderAnalysis, WorkOrderDelayStatus } from './analysis';
import type { DataSourceReference } from '../../types/data-source';

interface WorkOrderAnalysisPanelProps {
  analysis: WorkOrderAnalysis | null;
  isDemo: boolean;
}

const STATUS: Record<WorkOrderDelayStatus, { label: string; className: string }> = {
  delayed: { label: 'Gecikmiş', className: 'bg-[#FCEAEA] text-[#C83C3C]' },
  not_delayed: { label: 'Gecikme tespit edilmedi', className: 'bg-[#EAF5EF] text-[#248A5B]' },
  unknown: { label: 'Gecikme durumu bilinmiyor', className: 'bg-[#FEF6E7] text-[#946015]' },
};

function formatTime(value: string | null): string {
  if (value === null) return 'Bilinmiyor';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Geçersiz tarih';
  return new Intl.DateTimeFormat('tr-TR', {
    dateStyle: 'short', timeStyle: 'short', timeZone: 'Europe/Istanbul',
  }).format(date) + ' (İstanbul)';
}

function SourceList({ sources }: { sources: DataSourceReference[] }) {
  if (sources.length === 0) return <p className="text-xs text-[#66717F]">Kaynak belirtilmemiş.</p>;
  return (
    <ul className="space-y-2 text-xs text-[#66717F]">
      {sources.map((source, index) => (
        <li key={`${source.sourceId}:${source.sourceRecordId}:${index}`} className="break-words">
          <span className="font-medium text-[#315B7D]">{source.sourceName}</span>
          {' · '}{source.sourceRecordId ?? 'Kayıt kimliği bilinmiyor'}
          <span className="block mt-0.5">Kaynak güncellemesi: {formatTime(source.sourceUpdatedAt)}</span>
        </li>
      ))}
    </ul>
  );
}

export default function WorkOrderAnalysisPanel({ analysis, isDemo }: WorkOrderAnalysisPanelProps) {
  if (analysis === null) {
    return <section aria-label="İş emri analizi" className="rounded-lg border border-[#D8DEE6] bg-white p-4 text-sm text-[#66717F]">Bu iş emri için henüz analiz bulunmuyor.</section>;
  }
  const status = STATUS[analysis.delayStatus];

  return (
    <section aria-label="İş emri analizi" className="min-w-0 rounded-lg border border-[#D8DEE6] bg-white text-[#17212B]">
      <div className="border-b border-[#D8DEE6] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold">İş emri analizi</h3>
          <span className={`rounded px-2 py-1 text-xs font-medium ${status.className}`}>{status.label}</span>
        </div>
        {isDemo && (
          <p className="mt-3 rounded bg-[#FEF6E7] p-2 text-xs text-[#946015]">
            <strong>Demo analiz.</strong> Yerel örnek veriler kullanılıyor. ERP bağlantısı ve gerçek analiz servisi henüz bağlı değil; analiz zamanı örnektir.
          </p>
        )}
        <p className="mt-3 text-sm leading-relaxed">{analysis.summary}</p>
        <p className="mt-2 text-xs text-[#66717F]">{analysis.workOrderId} · Analiz zamanı: {formatTime(analysis.analyzedAt)}</p>
      </div>

      <div className="space-y-5 p-4">
        <div>
          <h4 className="mb-2 text-xs font-semibold">Bulgular ve dayanakları</h4>
          {analysis.findings.length === 0 ? <p className="text-sm text-[#66717F]">Henüz bulgu yok.</p> : (
            <ul className="space-y-3">
              {analysis.findings.map((finding, index) => (
                <li key={index} className="rounded border border-[#D8DEE6] p-3">
                  <span className="text-xs font-semibold text-[#315B7D]">
                    {finding.kind === 'verified' ? (isDemo ? 'Örnek kayda dayalı bilgi' : 'Doğrulanmış bilgi') : 'Çıkarım'}
                  </span>
                  <p className="my-2 text-sm leading-relaxed">{finding.description}</p>
                  <SourceList sources={finding.sources} />
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div className="rounded bg-[#F4F6F8] p-3">
            <h4 className="mb-2 text-xs font-semibold">Varsayımlar</h4>
            {analysis.assumptions.length === 0 ? <p className="text-sm text-[#66717F]">Varsayım belirtilmemiş.</p> : (
              <ul className="list-disc space-y-1 pl-4 text-sm">{analysis.assumptions.map((item, index) => <li key={index}>{item}</li>)}</ul>
            )}
          </div>
          <div className="rounded bg-[#FEF6E7] p-3">
            <h4 className="mb-2 text-xs font-semibold">Eksik bilgiler</h4>
            {analysis.missingData.length === 0 ? <p className="text-sm text-[#66717F]">Eksik bilgi bildirilmemiş.</p> : (
              <ul className="list-disc space-y-1 pl-4 text-sm">{analysis.missingData.map((item, index) => <li key={index}>{item}</li>)}</ul>
            )}
          </div>
        </div>
        <div>
          <h4 className="mb-2 text-xs font-semibold">Analizde kullanılan kaynaklar</h4>
          <SourceList sources={analysis.sources} />
        </div>
      </div>
    </section>
  );
}
