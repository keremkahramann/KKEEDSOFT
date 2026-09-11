import React, { useState } from 'react';
import { IconArrowLeft, IconWrench, IconAlert, IconCheck, IconInfo, IconChevronDown } from '../components/Icons';

const EVENTS = [
  { time: '08:14', type: 'alarm', label: 'Kalite Alarmı', desc: 'QMS: Çap ölçüsü üst limite yaklaşıyor (PRT-1042)', color: '#D98B18' },
  { time: '07:45', type: 'info', label: 'Üretim', desc: 'Ürün sayacı: 3.200 adet (hedef: 3.600)', color: '#3478C7' },
  { time: '06:30', type: 'ok', label: 'Vardiya Başlangıcı', desc: 'Operatör: İ. Koca · 2. Vardiya', color: '#248A5B' },
  { time: '05:12', type: 'error', label: 'Plansız Duruş Sonu', desc: 'Duruş süresi: 23 dk · Neden: Malzeme besleme', color: '#C83C3C' },
  { time: '04:49', type: 'error', label: 'Plansız Duruş', desc: 'Malzeme besleme arızası — operatör müdahalesi', color: '#C83C3C' },
  { time: '02:00', type: 'info', label: 'Senkronizasyon', desc: 'MES veri sync: 4.218 kayıt güncellendi', color: '#3478C7' },
  { time: '00:00', type: 'ok', label: 'Vardiya Başlangıcı', desc: 'Operatör: S. Demirci · 1. Vardiya', color: '#248A5B' },
];

const QC_MEASUREMENTS = [
  { time: '06:00', value: 24.82, ok: true },
  { time: '06:30', value: 24.83, ok: true },
  { time: '07:00', value: 24.85, ok: true },
  { time: '07:30', value: 24.87, ok: true },
  { time: '08:00', value: 24.91, ok: true },
  { time: '08:30', value: 24.95, ok: false },
];

const MINI_OEE = [74, 78, 72, 80, 77, 79, 75, 78, 82, 74, 77, 76];

interface Props {
  machineId?: string;
  onBack: () => void;
  onNavigate: (screen: string) => void;
}

export default function MachineDetailScreen({ machineId = 'I01', onBack, onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState<'overview' | 'quality' | 'maintenance' | 'history'>('overview');

  // For demo we show INJ-01 details (running on PRT-1042)
  const isBreakdown = machineId === 'P07';
  const machineName = machineId === 'P07' ? 'PRESS-07' : 'INJ-01';
  const status = isBreakdown ? 'breakdown' : 'running';

  const minV = 24.60, maxV = 25.10, range = maxV - minV;
  const USL = 25.00, NOM = 24.85, LSL = 24.70;
  const toY = (v: number) => 100 - ((v - minV) / range) * 100;
  const toX = (i: number) => (i / (QC_MEASUREMENTS.length - 1)) * 100;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 flex items-center gap-4 flex-shrink-0" style={{ background: '#14263D' }}>
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm transition-opacity hover:opacity-70" style={{ color: '#8FA3B8' }}>
          <IconArrowLeft size={16} />
          Makineler
        </button>
        <div className="w-px h-5" style={{ background: 'rgba(255,255,255,0.15)' }} />
        <div className="flex items-center gap-3">
          <span className="font-mono font-bold text-white text-lg">{machineName}</span>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded" style={{
            background: isBreakdown ? 'rgba(200,60,60,0.2)' : 'rgba(36,138,91,0.2)',
            border: `1px solid ${isBreakdown ? '#C83C3C40' : '#248A5B40'}`
          }}>
            <div className={`w-2 h-2 rounded-full ${isBreakdown ? 'animate-pulse-critical' : ''}`} style={{ background: isBreakdown ? '#C83C3C' : '#248A5B' }} />
            <span className="text-xs font-medium" style={{ color: isBreakdown ? '#F87171' : '#6EE7A0' }}>
              {isBreakdown ? 'Plansız Arıza' : 'Çalışıyor'}
            </span>
          </div>
          {isBreakdown && <span className="text-xs" style={{ color: '#F87171' }}>Duruş: 4s 23dk</span>}
        </div>
        <div className="flex-1" />
        <div className="flex gap-2">
          <button onClick={() => onNavigate('problems')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium"
            style={{ background: 'rgba(242,140,40,0.15)', color: '#F28C28', border: '1px solid rgba(242,140,40,0.3)' }}>
            <IconAlert size={13} />
            Problem Analizi
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs"
            style={{ background: 'rgba(255,255,255,0.08)', color: '#8FA3B8' }}>
            <IconWrench size={13} />
            Bakım Talebi
          </button>
          <button onClick={() => onNavigate('workorders')}
            className="px-3 py-1.5 rounded text-xs"
            style={{ background: 'rgba(255,255,255,0.08)', color: '#8FA3B8' }}>
            İş Emri Gör
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 px-5 py-2 flex-shrink-0" style={{ background: '#fff', borderBottom: '1px solid #D8DEE6' }}>
        {[['overview', 'Genel Bakış'], ['quality', 'Kalite Ölçümleri'], ['maintenance', 'Bakım Geçmişi'], ['history', '24 Saat Olaylar']].map(([id, label]) => (
          <button key={id} onClick={() => setActiveTab(id as any)}
            className="px-4 py-2 rounded text-sm font-medium transition-colors"
            style={{
              background: activeTab === id ? '#14263D' : 'transparent',
              color: activeTab === id ? '#fff' : '#66717F',
            }}>
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5">
        {activeTab === 'overview' && (
          <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr 320px' }}>
            {/* Left: core info */}
            <div className="space-y-4">
              {/* Status KPIs */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'OEE', value: isBreakdown ? '—' : '%77', color: '#D98B18' },
                  { label: 'Çevrim Süresi', value: isBreakdown ? '—' : '18 sn', color: '#17212B' },
                  { label: 'Günlük Hedef', value: isBreakdown ? '—' : '4.800', color: '#17212B' },
                  { label: 'Gerçekleşen', value: isBreakdown ? '0' : '3.696', color: isBreakdown ? '#C83C3C' : '#17212B' },
                  { label: 'Fire Oranı', value: isBreakdown ? '—' : '%0,88', color: '#D98B18' },
                  { label: 'Verimlilik', value: isBreakdown ? '—' : '%77,0', color: '#D98B18' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="p-3 rounded" style={{ background: '#fff', border: '1px solid #D8DEE6' }}>
                    <div className="text-xs mb-1" style={{ color: '#66717F' }}>{label}</div>
                    <div className="text-xl font-bold font-mono" style={{ color }}>{value}</div>
                  </div>
                ))}
              </div>

              {/* OEE trend */}
              <div className="rounded-lg p-4" style={{ background: '#fff', border: '1px solid #D8DEE6' }}>
                <div className="text-xs font-semibold mb-3" style={{ color: '#17212B' }}>Son 12 Saat OEE Trendi</div>
                <svg viewBox="0 0 100 36" className="w-full" style={{ height: 72 }} preserveAspectRatio="none">
                  <line x1="0" y1={36 - (80/100)*36} x2="100" y2={36-(80/100)*36} stroke="#248A5B" strokeWidth="0.4" strokeDasharray="2,1" opacity="0.5"/>
                  {MINI_OEE.map((v, i) => {
                    const x = (i / (MINI_OEE.length - 1)) * 100;
                    const y = 36 - (v / 100) * 36;
                    return (
                      <rect key={i} x={x - 2.5} y={y} width={5} height={36 - y} rx="0.5"
                        fill={v >= 80 ? '#248A5B' : v >= 70 ? '#D98B18' : '#C83C3C'} opacity="0.75" />
                    );
                  })}
                </svg>
                <div className="flex justify-between text-xs font-mono mt-1" style={{ color: '#9FAAB5' }}>
                  <span>20:00</span><span>02:00</span><span>08:00</span>
                </div>
              </div>
            </div>

            {/* Middle: work order + details */}
            <div className="space-y-4">
              <div className="rounded-lg" style={{ background: '#fff', border: '1px solid #D8DEE6' }}>
                <div className="px-4 py-3" style={{ borderBottom: '1px solid #D8DEE6', background: '#F4F6F8' }}>
                  <div className="text-xs font-semibold" style={{ color: '#17212B' }}>Aktif İş Emri & Bağlamsal Bilgi</div>
                </div>
                <div className="p-4 space-y-3">
                  {[
                    { label: 'İş Emri', value: isBreakdown ? '—' : 'WO-2026-1048', mono: true, highlight: true },
                    { label: 'Ürün', value: isBreakdown ? '—' : 'PRT-1042 Muhafaza Kapağı', mono: false },
                    { label: 'Müşteri', value: isBreakdown ? '—' : 'Arçelik A.Ş.', mono: false },
                    { label: 'Bağlı Kalıp', value: isBreakdown ? '—' : 'MLD-2201 (4 göz)', mono: true },
                    { label: 'Operatör', value: isBreakdown ? '—' : 'İ. Koca', mono: false },
                    { label: 'Vardiya', value: isBreakdown ? '—' : '2. Vardiya (06:00–14:00)', mono: false },
                    { label: 'Termin', value: isBreakdown ? '—' : '10.09.2026', mono: false, critical: true },
                  ].map(({ label, value, mono, highlight, critical }) => (
                    <div key={label} className="flex items-start justify-between py-1.5" style={{ borderBottom: '1px solid #F4F6F8' }}>
                      <span className="text-xs" style={{ color: '#66717F' }}>{label}</span>
                      <span className={`text-xs font-medium ${mono ? 'font-mono' : ''}`} style={{ color: critical ? '#C83C3C' : highlight ? '#315B7D' : '#17212B' }}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Maintenance */}
              <div className="rounded-lg p-4" style={{ background: '#fff', border: '1px solid #D8DEE6' }}>
                <div className="text-xs font-semibold mb-3" style={{ color: '#17212B' }}>Bakım Bilgileri</div>
                <div className="space-y-2">
                  {[
                    { label: 'Son Bakım', value: '12.08.2026', ok: true },
                    { label: 'Sonraki Bakım', value: '12.11.2026', ok: true },
                    { label: 'Toplam Çalışma', value: '14.280 saat' },
                    { label: 'Vuruş Sayısı', value: '1.884.000' },
                  ].map(({ label, value, ok }) => (
                    <div key={label} className="flex justify-between text-xs">
                      <span style={{ color: '#66717F' }}>{label}</span>
                      <span className="font-mono" style={{ color: '#17212B' }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: event timeline */}
            <div className="rounded-lg overflow-hidden" style={{ border: '1px solid #D8DEE6' }}>
              <div className="px-4 py-3" style={{ borderBottom: '1px solid #D8DEE6', background: '#F4F6F8' }}>
                <div className="text-xs font-semibold" style={{ color: '#17212B' }}>Son 24 Saat Olaylar</div>
              </div>
              <div className="p-3 space-y-0 overflow-y-auto" style={{ maxHeight: 380 }}>
                {EVENTS.map((ev, i) => (
                  <div key={i} className="flex gap-3 pb-3" style={{ borderLeft: `2px solid ${ev.color}20`, marginLeft: 4, paddingLeft: 12, position: 'relative' }}>
                    <div className="absolute left-0 top-1 w-2 h-2 rounded-full -translate-x-1" style={{ background: ev.color }} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-mono" style={{ color: '#9FAAB5' }}>{ev.time}</span>
                        <span className="text-xs font-semibold" style={{ color: ev.color }}>{ev.label}</span>
                      </div>
                      <p className="text-xs leading-snug" style={{ color: '#17212B' }}>{ev.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'quality' && (
          <div className="space-y-4 max-w-4xl">
            <div className="rounded-lg overflow-hidden" style={{ border: '1px solid #D8DEE6' }}>
              <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #D8DEE6' }}>
                <div>
                  <h3 className="text-sm font-semibold" style={{ color: '#17212B' }}>Çap Ölçüm Trendi — Ø 24,85 mm</h3>
                  <p className="text-xs mt-0.5" style={{ color: '#66717F' }}>USL: 25,00 · Nominal: 24,85 · LSL: 24,70 · Ölçüm: CMM-01 · Her 30 dk</p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ background: '#FEF6E7', color: '#D98B18' }}>
                  Son ölçüm USL'ye 0,05 mm uzakta
                </span>
              </div>
              <div className="p-5">
                <svg viewBox="0 0 100 60" className="w-full" style={{ height: 180 }} preserveAspectRatio="none">
                  <rect x="0" y={toY(USL)} width="100" height="5" fill="#C83C3C" opacity="0.05"/>
                  <line x1="0" y1={toY(LSL)} x2="100" y2={toY(LSL)} stroke="#3478C7" strokeWidth="0.5" strokeDasharray="2,1"/>
                  <line x1="0" y1={toY(NOM)} x2="100" y2={toY(NOM)} stroke="#248A5B" strokeWidth="0.6" strokeDasharray="3,1"/>
                  <line x1="0" y1={toY(USL)} x2="100" y2={toY(USL)} stroke="#C83C3C" strokeWidth="0.8"/>
                  <text x="1" y={toY(USL) - 1} fontSize="4" fill="#C83C3C">USL 25,00</text>
                  <text x="1" y={toY(NOM) - 1} fontSize="4" fill="#248A5B">Nom 24,85</text>
                  <text x="1" y={toY(LSL) - 1} fontSize="4" fill="#3478C7">LSL 24,70</text>
                  <polyline points={QC_MEASUREMENTS.map((m, i) => `${toX(i)},${toY(m.value)}`).join(' ')} fill="none" stroke="#F28C28" strokeWidth="1.5"/>
                  {QC_MEASUREMENTS.map((m, i) => (
                    <circle key={i} cx={toX(i)} cy={toY(m.value)} r="2" fill={m.ok ? '#F28C28' : '#C83C3C'} stroke="#fff" strokeWidth="0.5"/>
                  ))}
                </svg>
                <div className="flex gap-4 mt-3">
                  {QC_MEASUREMENTS.map((m, i) => (
                    <div key={i} className="text-center">
                      <div className="text-xs font-mono font-semibold" style={{ color: m.ok ? '#17212B' : '#C83C3C' }}>{m.value.toFixed(2)}</div>
                      <div className="text-xs" style={{ color: '#9FAAB5' }}>{m.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="max-w-2xl space-y-2">
            {EVENTS.map((ev, i) => (
              <div key={i} className="flex gap-4 p-3 rounded-lg" style={{ background: '#fff', border: '1px solid #D8DEE6' }}>
                <div className="w-1.5 self-stretch rounded-full flex-shrink-0" style={{ background: ev.color }} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-semibold" style={{ color: '#9FAAB5' }}>{ev.time}</span>
                    <span className="text-xs font-semibold px-1.5 py-0.5 rounded" style={{ background: `${ev.color}18`, color: ev.color }}>{ev.label}</span>
                  </div>
                  <p className="text-sm" style={{ color: '#17212B' }}>{ev.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className="max-w-3xl">
            <div className="rounded-lg overflow-hidden" style={{ border: '1px solid #D8DEE6' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: '#F4F6F8', borderBottom: '1px solid #D8DEE6' }}>
                    {['Tarih', 'Tür', 'Açıklama', 'Teknisyen', 'Süre', 'Sonuç'].map(h => (
                      <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold" style={{ color: '#66717F' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { date: '12.08.2026', type: 'Periyodik', desc: 'PM-60: Yağlama, filtre, ayar', tech: 'F. Arslan', dur: '4 saat', result: 'Tamamlandı' },
                    { date: '15.06.2026', type: 'Korektif', desc: 'Hidrolik pompa sızdırmazlık', tech: 'S. Kurt', dur: '3 saat', result: 'Tamamlandı' },
                    { date: '12.05.2026', type: 'Periyodik', desc: 'PM-60: Kontrol ve ayar', tech: 'F. Arslan', dur: '4 saat', result: 'Tamamlandı' },
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #F4F6F8', background: '#fff' }}>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: '#66717F' }}>{row.date}</td>
                      <td className="px-4 py-3"><span className="text-xs px-1.5 py-0.5 rounded" style={{ background: '#F4F6F8', color: '#66717F' }}>{row.type}</span></td>
                      <td className="px-4 py-3 text-xs" style={{ color: '#17212B' }}>{row.desc}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: '#17212B' }}>{row.tech}</td>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: '#17212B' }}>{row.dur}</td>
                      <td className="px-4 py-3"><span className="text-xs px-1.5 py-0.5 rounded" style={{ background: '#EAF5EF', color: '#248A5B' }}>{row.result}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
