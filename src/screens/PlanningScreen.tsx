import React, { useState } from 'react';
import { IconAlert, IconInfo, IconCheck } from '../components/Icons';

const MACHINES = ['PRESS-01', 'PRESS-02', 'PRESS-03', 'PRESS-05', 'PRESS-06', 'INJ-01', 'INJ-02', 'MOLD-01', 'MOLD-02', 'MOLD-03'];

// Hours 6..22 for a single day view
const HOURS = Array.from({ length: 17 }, (_, i) => i + 6);

type WorkBlock = {
  machineIdx: number;
  start: number; // hour offset from 6
  duration: number; // hours
  id: string;
  label: string;
  product: string;
  color: string;
  textColor: string;
  risk?: 'critical' | 'warning';
  type: 'production' | 'setup' | 'maintenance';
};

const BLOCKS: WorkBlock[] = [
  { machineIdx: 0, start: 0, duration: 5, id: 'WO-1028', label: 'WO-1028', product: 'MTL-0654', color: '#315B7D', textColor: '#fff', type: 'production' },
  { machineIdx: 0, start: 5, duration: 1, id: 'WO-1028-s', label: 'Hazırlık', product: '', color: '#D98B18', textColor: '#fff', type: 'setup' },
  { machineIdx: 0, start: 6, duration: 8, id: 'WO-1048', label: 'WO-1048', product: 'PRT-1042', color: '#248A5B', textColor: '#fff', risk: 'critical', type: 'production' },
  { machineIdx: 0, start: 14, duration: 2, id: 'WO-1048-s', label: 'Hazırlık', product: '', color: '#D98B18', textColor: '#fff', type: 'setup' },
  { machineIdx: 1, start: 0, duration: 10, id: 'WO-1031', label: 'WO-1031', product: 'MTL-0887', color: '#315B7D', textColor: '#fff', risk: 'warning', type: 'production' },
  { machineIdx: 1, start: 10, duration: 6, id: 'WO-1055', label: 'WO-1055', product: 'MTL-1120', color: '#248A5B', textColor: '#fff', type: 'production' },
  { machineIdx: 2, start: 0, duration: 3, id: 'WO-1025-s', label: 'Hazırlık', product: '', color: '#D98B18', textColor: '#fff', type: 'setup' },
  { machineIdx: 2, start: 3, duration: 13, id: 'WO-1025', label: 'WO-1025', product: 'MTL-0877', color: '#315B7D', textColor: '#fff', type: 'production' },
  { machineIdx: 3, start: 0, duration: 16, id: 'WO-1048b', label: 'WO-1048', product: 'PRT-1042', color: '#248A5B', textColor: '#fff', risk: 'critical', type: 'production' },
  { machineIdx: 4, start: 0, duration: 2, id: 'BAK-07', label: 'Bakım', product: '', color: '#3478C7', textColor: '#fff', type: 'maintenance' },
  { machineIdx: 4, start: 2, duration: 14, id: 'WO-1042', label: 'WO-1042', product: 'MTL-1050', color: '#315B7D', textColor: '#fff', type: 'production' },
  { machineIdx: 5, start: 0, duration: 16, id: 'WO-1037', label: 'WO-1037', product: 'PRT-0877', color: '#315B7D', textColor: '#fff', type: 'production' },
  { machineIdx: 6, start: 0, duration: 8, id: 'WO-1048c', label: 'WO-1048', product: 'PRT-1042', color: '#248A5B', textColor: '#fff', type: 'production' },
  { machineIdx: 6, start: 8, duration: 1, id: 'WO-s6', label: 'Hazırlık', product: '', color: '#D98B18', textColor: '#fff', type: 'setup' },
  { machineIdx: 6, start: 9, duration: 7, id: 'WO-1051', label: 'WO-1051', product: 'PRT-1100', color: '#315B7D', textColor: '#fff', type: 'production' },
  { machineIdx: 7, start: 0, duration: 9, id: 'WO-1040', label: 'WO-1040', product: 'KLP-2201', color: '#4A2C5B', textColor: '#fff', type: 'production' },
  { machineIdx: 7, start: 9, duration: 7, id: 'WO-1044', label: 'WO-1044', product: 'KLP-1987', color: '#4A2C5B', textColor: '#fff', type: 'production' },
  { machineIdx: 8, start: 0, duration: 16, id: 'WO-1039', label: 'WO-1039', product: 'KLP-2102', color: '#4A2C5B', textColor: '#fff', type: 'production' },
  { machineIdx: 9, start: 0, duration: 5, id: 'WO-1046', label: 'WO-1046', product: 'KLP-2301', color: '#4A2C5B', textColor: '#fff', type: 'production' },
  { machineIdx: 9, start: 5, duration: 1, id: 'WO-s9', label: 'Hazırlık', product: '', color: '#D98B18', textColor: '#fff', type: 'setup' },
  { machineIdx: 9, start: 6, duration: 10, id: 'WO-1053', label: 'WO-1053', product: 'KLP-2401', color: '#4A2C5B', textColor: '#fff', type: 'production' },
];

const ROW_H = 40;
const HOUR_W = 52;
const MACHINE_W = 110;
const HEADER_H = 36;

export default function PlanningScreen() {
  const [mode, setMode] = useState<'current' | 'simulation'>('current');
  const [selected, setSelected] = useState<WorkBlock | null>(null);
  const totalW = HOURS.length * HOUR_W;

  const now = new Date();
  const currentHour = now.getHours();
  const nowOffset = Math.max(0, currentHour - 6);

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3 flex items-center gap-3 flex-shrink-0" style={{ background: '#fff', borderBottom: '1px solid #D8DEE6' }}>
          <div>
            <h1 className="text-lg font-semibold" style={{ color: '#17212B' }}>Üretim Planlama</h1>
            <p className="text-sm" style={{ color: '#66717F' }}>07 Eylül 2026 · Günlük Görünüm</p>
          </div>
          <div className="flex-1" />
          {/* Mode toggle */}
          <div className="flex rounded overflow-hidden" style={{ border: '1px solid #D8DEE6' }}>
            <button onClick={() => setMode('current')}
              className="px-4 py-1.5 text-xs font-medium transition-colors"
              style={{ background: mode === 'current' ? '#14263D' : '#fff', color: mode === 'current' ? '#fff' : '#66717F' }}>
              Mevcut Plan
            </button>
            <button onClick={() => setMode('simulation')}
              className="px-4 py-1.5 text-xs font-medium transition-colors flex items-center gap-1.5"
              style={{ background: mode === 'simulation' ? '#F28C28' : '#fff', color: mode === 'simulation' ? '#fff' : '#66717F', borderLeft: '1px solid #D8DEE6' }}>
              {mode === 'simulation' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              Simülasyon
            </button>
          </div>
          <div className="flex items-center gap-2">
            {['Önceki Gün', 'Bugün', 'Sonraki Gün'].map((d, i) => (
              <button key={d} className="px-3 py-1.5 text-xs rounded transition-colors"
                style={{ background: i === 1 ? '#EBF3FC' : '#fff', color: i === 1 ? '#3478C7' : '#66717F', border: '1px solid #D8DEE6' }}>
                {d}
              </button>
            ))}
          </div>
        </div>

        {mode === 'simulation' && (
          <div className="px-5 py-2 flex items-center gap-3 text-xs flex-shrink-0" style={{ background: '#FEF6E7', borderBottom: '1px solid #D98B1840' }}>
            <span className="w-2 h-2 rounded-full" style={{ background: '#D98B18' }} />
            <span className="font-semibold" style={{ color: '#D98B18' }}>Simülasyon Modu</span>
            <span style={{ color: '#17212B' }}>Yapılan değişiklikler doğrudan kaydedilmez. Plan değişikliği önerisi oluşturur.</span>
            <button className="ml-auto px-3 py-1 rounded font-medium" style={{ background: '#D98B18', color: '#fff' }}>Öneri Oluştur</button>
            <button className="px-3 py-1 rounded" style={{ background: '#fff', color: '#D98B18', border: '1px solid #D98B18' }}>Simülasyonu Sıfırla</button>
          </div>
        )}

        {/* Gantt */}
        <div className="flex-1 overflow-auto">
          <div style={{ minWidth: MACHINE_W + totalW + 32 }}>
            {/* Time header */}
            <div className="flex sticky top-0 z-10" style={{ background: '#F4F6F8', borderBottom: '1px solid #D8DEE6' }}>
              <div style={{ width: MACHINE_W, minWidth: MACHINE_W, height: HEADER_H, borderRight: '1px solid #D8DEE6' }} className="flex items-center px-3 flex-shrink-0">
                <span className="text-xs font-medium" style={{ color: '#66717F' }}>Makine</span>
              </div>
              <div className="flex flex-1">
                {HOURS.map(h => (
                  <div key={h} style={{ width: HOUR_W, minWidth: HOUR_W, height: HEADER_H, borderRight: '1px solid #E8ECF0' }}
                    className="flex items-center justify-center">
                    <span className="text-xs font-mono font-medium" style={{ color: h === currentHour ? '#F28C28' : '#66717F' }}>
                      {String(h).padStart(2, '0')}:00
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Machine rows */}
            {MACHINES.map((machine, mIdx) => (
              <div key={machine} className="flex" style={{ borderBottom: '1px solid #F0F3F6', height: ROW_H }}>
                {/* Machine label */}
                <div style={{ width: MACHINE_W, minWidth: MACHINE_W, height: ROW_H, borderRight: '1px solid #D8DEE6', background: '#FAFBFC' }}
                  className="flex items-center px-3 flex-shrink-0">
                  <span className="text-xs font-mono font-semibold" style={{ color: '#17212B' }}>{machine}</span>
                </div>

                {/* Timeline */}
                <div className="relative flex-1" style={{ height: ROW_H, background: mIdx % 2 === 0 ? '#fff' : '#FAFBFC' }}>
                  {/* Hour grid lines */}
                  {HOURS.map((_, i) => (
                    <div key={i} className="absolute top-0 bottom-0" style={{ left: i * HOUR_W, width: 1, background: '#E8ECF0' }} />
                  ))}

                  {/* Now line */}
                  {nowOffset >= 0 && nowOffset <= HOURS.length && (
                    <div className="absolute top-0 bottom-0 z-10" style={{ left: nowOffset * HOUR_W, width: 2, background: '#F28C28' }}>
                      <div className="absolute -top-1 w-2 h-2 rounded-full -translate-x-1/2" style={{ background: '#F28C28' }} />
                    </div>
                  )}

                  {/* Work blocks */}
                  {BLOCKS.filter(b => b.machineIdx === mIdx).map(block => (
                    <button
                      key={block.id}
                      onClick={() => setSelected(selected?.id === block.id ? null : block)}
                      className="gantt-bar absolute rounded text-left overflow-hidden transition-all hover:brightness-90"
                      style={{
                        left: block.start * HOUR_W + 1,
                        width: block.duration * HOUR_W - 2,
                        top: 4, height: ROW_H - 8,
                        background: block.color,
                        border: selected?.id === block.id ? '2px solid #F28C28' : `1px solid ${block.risk === 'critical' ? '#C83C3C' : block.risk === 'warning' ? '#D98B18' : 'transparent'}`,
                        boxShadow: block.risk === 'critical' ? '0 0 0 1px #C83C3C' : undefined,
                      }}>
                      <div className="flex items-center gap-1 h-full px-2">
                        {block.risk === 'critical' && <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#C83C3C' }} />}
                        {block.risk === 'warning' && <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#D98B18' }} />}
                        {block.duration > 1 && (
                          <span className="text-xs font-medium truncate" style={{ color: block.textColor }}>{block.label}</span>
                        )}
                        {block.product && block.duration > 2 && (
                          <span className="text-xs truncate opacity-70" style={{ color: block.textColor }}>{block.product}</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="px-5 py-2 flex items-center gap-5 flex-shrink-0" style={{ background: '#F4F6F8', borderTop: '1px solid #D8DEE6' }}>
          {[
            { color: '#315B7D', label: 'Üretim' },
            { color: '#4A2C5B', label: 'Kalıp' },
            { color: '#D98B18', label: 'Hazırlık' },
            { color: '#3478C7', label: 'Bakım' },
            { color: '#C83C3C', label: 'Kritik Risk', dot: true },
            { color: '#D98B18', label: 'Termin Riski', dot: true },
          ].map(({ color, label, dot }) => (
            <div key={label} className="flex items-center gap-1.5">
              {dot ? (
                <div className="w-2 h-2 rounded-full" style={{ background: color }} />
              ) : (
                <div className="w-8 h-3 rounded" style={{ background: color }} />
              )}
              <span className="text-xs" style={{ color: '#66717F' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      {selected && (
        <div className="w-72 flex-shrink-0 overflow-y-auto" style={{ background: '#fff', borderLeft: '1px solid #D8DEE6' }}>
          <div className="px-4 py-3" style={{ borderBottom: '1px solid #D8DEE6', background: '#14263D' }}>
            <div className="text-white font-semibold text-sm">{selected.id}</div>
            <div className="text-xs mt-0.5" style={{ color: '#8FA3B8' }}>{selected.product} · {MACHINES[selected.machineIdx]}</div>
          </div>
          <div className="p-4 space-y-4">
            {selected.risk && (
              <div className="px-3 py-2 rounded" style={{ background: selected.risk === 'critical' ? '#FCEAEA' : '#FEF6E7', border: `1px solid ${selected.risk === 'critical' ? '#C83C3C40' : '#D98B1840'}` }}>
                <div className="text-xs font-semibold mb-1" style={{ color: selected.risk === 'critical' ? '#C83C3C' : '#D98B18' }}>
                  {selected.risk === 'critical' ? 'Kritik Termin Riski' : 'Termin Uyarısı'}
                </div>
                <div className="text-xs" style={{ color: '#17212B' }}>
                  {selected.risk === 'critical' ? 'Mevcut kapasiteyle termin 2 gün aşılabilir.' : 'Hafif gecikme olasılığı var. İzleniyor.'}
                </div>
                <button className="text-xs mt-2 font-medium" style={{ color: '#3478C7' }}>Simülasyona Gönder →</button>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Başlangıç', value: `${String(6 + selected.start).padStart(2, '0')}:00` },
                { label: 'Bitiş', value: `${String(6 + selected.start + selected.duration).padStart(2, '0')}:00` },
                { label: 'Süre', value: `${selected.duration} saat` },
                { label: 'Tür', value: selected.type === 'production' ? 'Üretim' : selected.type === 'setup' ? 'Hazırlık' : 'Bakım' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="text-xs mb-0.5" style={{ color: '#66717F' }}>{label}</div>
                  <div className="text-sm font-medium font-mono" style={{ color: '#17212B' }}>{value}</div>
                </div>
              ))}
            </div>
            <div className="space-y-2 pt-2 border-t" style={{ borderColor: '#D8DEE6' }}>
              <div className="text-xs font-semibold" style={{ color: '#17212B' }}>Kapasite Etkisi</div>
              {['Tahmini tamamlanma: %72 güven', 'Etkilenen sonraki iş: WO-2026-1055', 'Makine yükü: %83'].map((t, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full mt-1.5" style={{ background: '#315B7D' }} />
                  <span className="text-xs" style={{ color: '#17212B' }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
