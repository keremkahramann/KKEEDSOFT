import React, { useState } from 'react';
import { IconCheck, IconAlert, IconInfo } from '../components/Icons';
import type { WorkOrder, WorkOrderOperation } from '../features/work-orders/types';
import { createDemoWorkOrderAnalysis } from '../features/work-orders/demo-analysis';
import WorkOrderAnalysisPanel from '../features/work-orders/WorkOrderAnalysisPanel';

const ORDERS: WorkOrder[] = [
  { id: 'WO-2026-1048', product: 'PRT-1042 Muhafaza Kapağı', customer: 'Arçelik A.Ş.', qty: 1500000, done: 938400, status: 'in_progress', risk: 'critical', deadline: '10.09.2026', machine: 'INJ-01 / PRESS-07' },
  { id: 'WO-2026-1031', product: 'MTL-0887 Bağlantı Braketi', customer: 'Ford Otosan', qty: 84000, done: 37000, status: 'in_progress', risk: 'warning', deadline: '12.09.2026', machine: 'PRESS-01' },
  { id: 'WO-2026-1055', product: 'MTL-1120 Şasi Profili', customer: 'Tofaş', qty: 25000, done: 9500, status: 'in_progress', risk: 'warning', deadline: '15.09.2026', machine: 'PRESS-02' },
  { id: 'WO-2026-1040', product: 'KLP-2201 Hassas Kalıp', customer: 'İç Üretim', qty: 1, done: 0, status: 'in_progress', risk: 'none', deadline: '20.09.2026', machine: 'MOLD-01' },
  { id: 'WO-2026-1042', product: 'MTL-1050 Flanş Parçası', customer: 'Bosch TR', qty: 60000, done: 52000, status: 'in_progress', risk: 'none', deadline: '25.09.2026', machine: 'PRESS-06' },
];

const OPERATIONS: WorkOrderOperation[] = [
  { seq: 1, name: 'Hammadde hazırlama', resource: 'Depo', plan: '4 saat', actual: '4 saat', status: 'done' },
  { seq: 2, name: 'Kalıp takma ve ayar', resource: 'PRESS-07', plan: '2 saat', actual: '2,5 saat', status: 'done' },
  { seq: 3, name: 'Plastik enjeksiyon', resource: 'INJ-01', plan: '38 saat', actual: '22,6 saat', status: 'in_progress' },
  { seq: 4, name: 'Çapak alma', resource: 'Manuel', plan: '8 saat', actual: '—', status: 'pending' },
  { seq: 5, name: 'Kalite kontrol', resource: 'CMM-01', plan: '4 saat', actual: '—', status: 'pending' },
  { seq: 6, name: 'Paketleme & sevkiyat', resource: 'Sevkiyat', plan: '2 saat', actual: '—', status: 'pending' },
];

type WorkOrderTab = 'detail' | 'ops' | 'quality' | 'cost' | 'audit';

const TABS: { id: WorkOrderTab; label: string }[] = [
  { id: 'detail', label: 'Genel' },
  { id: 'ops', label: 'Operasyon Rotası' },
  { id: 'quality', label: 'Kalite' },
  { id: 'cost', label: 'Maliyet' },
  { id: 'audit', label: 'Geçmiş' },
];

export default function WorkOrderScreen() {
  const [selected, setSelected] = useState<WorkOrder>(ORDERS[0]);
  const [tab, setTab] = useState<WorkOrderTab>('detail');
  const pct = Math.round((selected.done / selected.qty) * 100);
  const analysis = createDemoWorkOrderAnalysis(selected);

  return (
    <div className="flex h-full overflow-hidden">
      {/* List */}
      <div className="w-80 flex-shrink-0 flex flex-col overflow-hidden" style={{ background: '#fff', borderRight: '1px solid #D8DEE6' }}>
        <div className="px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid #D8DEE6', background: '#F4F6F8' }}>
          <h2 className="text-sm font-semibold" style={{ color: '#17212B' }}>İş Emirleri</h2>
          <div className="flex gap-1 mt-2">
            {['Tümü', 'Aktif', 'Riskli', 'Bekleyen'].map(f => (
              <button key={f} className="px-2 py-1 rounded text-xs" style={{ background: f === 'Tümü' ? '#14263D' : '#fff', color: f === 'Tümü' ? '#fff' : '#66717F', border: '1px solid #D8DEE6' }}>{f}</button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto divide-y" style={{ borderColor: '#F4F6F8' }}>
          {ORDERS.map(o => {
            const p = Math.round((o.done / o.qty) * 100);
            return (
              <button key={o.id} onClick={() => setSelected(o)}
                className="w-full text-left p-4 transition-colors hover:bg-gray-50"
                style={{ background: selected.id === o.id ? '#F0F7FF' : undefined }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold" style={{ color: '#315B7D' }}>{o.id}</span>
                  {o.risk !== 'none' && (
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{
                      background: o.risk === 'critical' ? '#FCEAEA' : '#FEF6E7',
                      color: o.risk === 'critical' ? '#C83C3C' : '#D98B18'
                    }}>
                      {o.risk === 'critical' ? 'Kritik' : 'Uyarı'}
                    </span>
                  )}
                </div>
                <div className="text-xs font-medium mb-0.5 truncate" style={{ color: '#17212B' }}>{o.product}</div>
                <div className="text-xs mb-2" style={{ color: '#66717F' }}>{o.customer} · {o.deadline}</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 rounded-full" style={{ background: '#F4F6F8' }}>
                    <div className="h-full rounded-full" style={{ width: `${p}%`, background: p < 40 ? '#C83C3C' : p < 70 ? '#D98B18' : '#248A5B' }} />
                  </div>
                  <span className="text-xs font-mono" style={{ color: '#66717F' }}>%{p}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        <div className="px-5 py-4" style={{ background: '#fff', borderBottom: '1px solid #D8DEE6' }}>
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-sm font-bold" style={{ color: '#315B7D' }}>{selected.id}</span>
                <span className="text-xs px-2 py-0.5 rounded" style={{ background: '#EBF3FC', color: '#3478C7' }}>Devam Ediyor</span>
                {selected.risk !== 'none' && (
                  <span className="text-xs px-2 py-0.5 rounded" style={{
                    background: selected.risk === 'critical' ? '#FCEAEA' : '#FEF6E7',
                    color: selected.risk === 'critical' ? '#C83C3C' : '#D98B18'
                  }}>
                    {selected.risk === 'critical' ? 'Kritik Risk' : 'Termin Uyarısı'}
                  </span>
                )}
              </div>
              <h2 className="text-base font-semibold" style={{ color: '#17212B' }}>{selected.product}</h2>
              <div className="flex items-center gap-3 text-xs mt-1" style={{ color: '#66717F' }}>
                <span>Müşteri: <strong style={{ color: '#17212B' }}>{selected.customer}</strong></span>
                <span>Termin: <strong style={{ color: selected.risk === 'critical' ? '#C83C3C' : '#17212B' }}>{selected.deadline}</strong></span>
                <span>Makine: <strong style={{ color: '#17212B' }}>{selected.machine}</strong></span>
              </div>
            </div>
          </div>
          {/* Progress */}
          <div className="flex items-center gap-3 mt-3">
            <div className="flex-1 h-2 rounded-full" style={{ background: '#F4F6F8' }}>
              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: pct < 40 ? '#C83C3C' : pct < 70 ? '#D98B18' : '#248A5B' }} />
            </div>
            <span className="text-sm font-mono font-bold" style={{ color: '#17212B' }}>{selected.done.toLocaleString('tr-TR')} / {selected.qty.toLocaleString('tr-TR')}</span>
            <span className="text-sm font-mono" style={{ color: '#66717F' }}>(%{pct})</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-5 py-2 flex-shrink-0" style={{ background: '#F4F6F8', borderBottom: '1px solid #D8DEE6' }}>
          {TABS.map(({ id, label }) => (
            <button key={id} onClick={() => setTab(id)}
              className="px-3 py-1.5 rounded text-xs font-medium"
              style={{ background: tab === id ? '#fff' : 'transparent', color: tab === id ? '#17212B' : '#66717F', border: tab === id ? '1px solid #D8DEE6' : '1px solid transparent' }}>
              {label}
            </button>
          ))}
        </div>

        <div className="flex-1 p-5">
          {tab === 'ops' && (
            <div className="rounded-lg overflow-hidden" style={{ border: '1px solid #D8DEE6' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: '#F4F6F8', borderBottom: '1px solid #D8DEE6' }}>
                    {['Sıra', 'Operasyon', 'Kaynak', 'Plan', 'Gerçek', 'Durum'].map(h => (
                      <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold" style={{ color: '#66717F' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {OPERATIONS.map(op => (
                    <tr key={op.seq} style={{ borderBottom: '1px solid #F4F6F8', background: '#fff' }}>
                      <td className="px-4 py-3 font-mono font-bold" style={{ color: '#9FAAB5' }}>{op.seq}</td>
                      <td className="px-4 py-3 font-medium" style={{ color: '#17212B' }}>{op.name}</td>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: '#315B7D' }}>{op.resource}</td>
                      <td className="px-4 py-3" style={{ color: '#66717F' }}>{op.plan}</td>
                      <td className="px-4 py-3 font-mono" style={{ color: '#17212B' }}>{op.actual}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded font-medium" style={{
                          background: op.status === 'done' ? '#EAF5EF' : op.status === 'in_progress' ? '#EBF3FC' : '#F4F6F8',
                          color: op.status === 'done' ? '#248A5B' : op.status === 'in_progress' ? '#3478C7' : '#9FAAB5'
                        }}>
                          {op.status === 'done' ? 'Tamamlandı' : op.status === 'in_progress' ? 'Devam Ediyor' : 'Bekliyor'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'detail' && (
            <div className="space-y-4">
            <WorkOrderAnalysisPanel analysis={analysis} isDemo={true} />
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Sipariş Miktarı', value: selected.qty.toLocaleString('tr-TR') + ' adet' },
                { label: 'Tamamlanan', value: selected.done.toLocaleString('tr-TR') + ' adet' },
                { label: 'Fire', value: '8.240 adet (%0,88)' },
                { label: 'Revizyon', value: 'Rev. C' },
                { label: 'Malzeme', value: 'PP+GF30 · LOT-2026-0441' },
                { label: 'Kalıp', value: 'MLD-2201 (4 göz)' },
                { label: 'Çevrim Süresi', value: '18 sn/döngü' },
                { label: 'OEE', value: '%74,8' },
              ].map(({ label, value }) => (
                <div key={label} className="rounded p-3" style={{ background: '#fff', border: '1px solid #D8DEE6' }}>
                  <div className="text-xs mb-1" style={{ color: '#66717F' }}>{label}</div>
                  <div className="text-sm font-medium font-mono" style={{ color: '#17212B' }}>{value}</div>
                </div>
              ))}
            </div>
            </div>
          )}

          {(tab === 'quality' || tab === 'cost' || tab === 'audit') && (
            <div className="flex items-center justify-center py-16 text-sm" style={{ color: '#9FAAB5' }}>
              {tab === 'quality' ? 'Kalite kontrol kayıtları yükleniyor...' : tab === 'cost' ? 'Maliyet özeti yükleniyor...' : 'Geçmiş kayıtlar yükleniyor...'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
