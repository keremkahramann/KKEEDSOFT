import React, { useState } from 'react';
import { IconDownload, IconFilter, IconRefresh } from '../components/Icons';

const REPORT_TYPES = [
  { id: 'oee', label: 'OEE & Performans', icon: '📊', desc: 'Makine ve hat bazında OEE, availability, performance, quality' },
  { id: 'quality', label: 'Kalite Raporu', icon: '🎯', desc: 'Fire oranı, uygunsuzluk tipleri, CAPA durumu' },
  { id: 'order', label: 'İş Emri Özeti', icon: '📋', desc: 'Planlanan/gerçekleşen, termin uyum oranı' },
  { id: 'cost', label: 'Maliyet Analizi', icon: '₺', desc: 'Makine, işçilik, malzeme ve fire maliyetleri' },
  { id: 'maintenance', label: 'Bakım Raporu', icon: '🔧', desc: 'Planlı/plansız arıza, MTTR, MTBF' },
  { id: 'capacity', label: 'Kapasite Raporu', icon: '⚡', desc: 'Hat ve makine bazında kapasite kullanımı' },
];

const OEE_DATA = [
  { dept: 'Metal Üretim', oee: 78, availability: 87, performance: 91, quality: 98 },
  { dept: 'Plastik Enjeksiyon', oee: 74, availability: 84, performance: 88, quality: 97 },
  { dept: 'Kalıp Üretimi', oee: 82, availability: 91, performance: 93, quality: 98 },
  { dept: 'Montaj', oee: 87, availability: 94, performance: 95, quality: 98 },
  { dept: 'Kalite Kontrol', oee: 90, availability: 96, performance: 94, quality: 100 },
];

const WEEKLY_OEE = [71, 74, 73, 77, 75, 78, 74, 76, 74, 77, 75, 74, 76, 74];

export default function ReportsScreen() {
  const [selected, setSelected] = useState('oee');
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week');

  const minV = 60, maxV = 100;
  const toY = (v: number) => 100 - ((v - minV) / (maxV - minV)) * 100;
  const points = WEEKLY_OEE.map((v, i) => `${(i / (WEEKLY_OEE.length - 1)) * 100},${toY(v)}`).join(' ');

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar */}
      <div className="w-56 flex-shrink-0 overflow-y-auto" style={{ background: '#fff', borderRight: '1px solid #D8DEE6' }}>
        <div className="px-4 py-3" style={{ borderBottom: '1px solid #D8DEE6' }}>
          <h2 className="text-sm font-semibold" style={{ color: '#17212B' }}>Raporlar</h2>
        </div>
        <div className="p-2">
          {REPORT_TYPES.map(r => (
            <button key={r.id} onClick={() => setSelected(r.id)}
              className="w-full text-left p-3 rounded mb-1 transition-colors"
              style={{ background: selected === r.id ? '#EBF3FC' : 'transparent' }}>
              <div className="flex items-center gap-2 mb-1">
                <span>{r.icon}</span>
                <span className="text-sm font-medium" style={{ color: selected === r.id ? '#3478C7' : '#17212B' }}>{r.label}</span>
              </div>
              <p className="text-xs" style={{ color: '#66717F' }}>{r.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        <div className="px-5 py-3 flex items-center gap-3 flex-shrink-0" style={{ background: '#fff', borderBottom: '1px solid #D8DEE6' }}>
          <h1 className="text-base font-semibold" style={{ color: '#17212B' }}>
            {REPORT_TYPES.find(r => r.id === selected)?.label}
          </h1>
          <div className="flex-1" />
          <div className="flex rounded overflow-hidden" style={{ border: '1px solid #D8DEE6' }}>
            {[['day', 'Bugün'], ['week', 'Bu Hafta'], ['month', 'Bu Ay']].map(([id, label]) => (
              <button key={id} onClick={() => setPeriod(id as any)}
                className="px-3 py-1.5 text-xs"
                style={{ background: period === id ? '#14263D' : '#fff', color: period === id ? '#fff' : '#66717F', borderRight: '1px solid #D8DEE6' }}>
                {label}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs" style={{ background: '#14263D', color: '#fff' }}>
            <IconDownload size={13} />
            Excel İndir
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs" style={{ background: '#fff', border: '1px solid #D8DEE6', color: '#315B7D' }}>
            <IconDownload size={13} />
            PDF
          </button>
        </div>

        <div className="p-5 space-y-5">
          {selected === 'oee' && (
            <>
              {/* OEE Trend Chart */}
              <div className="rounded-lg" style={{ background: '#fff', border: '1px solid #D8DEE6' }}>
                <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #D8DEE6' }}>
                  <div>
                    <h3 className="text-sm font-semibold" style={{ color: '#17212B' }}>Tesis OEE Trendi — Son 14 Gün</h3>
                    <p className="text-xs mt-0.5" style={{ color: '#66717F' }}>Tüm makine ortalaması · Kaynak: MES · Güncelleme: 08:41</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold font-mono" style={{ color: '#D98B18' }}>%74,8</div>
                    <div className="text-xs" style={{ color: '#66717F' }}>Bu hafta ort.</div>
                  </div>
                </div>
                <div className="p-5">
                  <svg viewBox="0 0 100 50" className="w-full" style={{ height: 160 }} preserveAspectRatio="none">
                    {/* Target line at 80% */}
                    <line x1="0" y1={toY(80)} x2="100" y2={toY(80)} stroke="#248A5B" strokeWidth="0.5" strokeDasharray="3,2"/>
                    <text x="1" y={toY(80) - 1} fontSize="4" fill="#248A5B">Hedef %80</text>
                    {/* Fill area */}
                    <polygon
                      points={`0,100 ${points} 100,100`}
                      fill="#315B7D" opacity="0.08"/>
                    {/* Line */}
                    <polyline points={points} fill="none" stroke="#315B7D" strokeWidth="1.5"/>
                    {/* Points */}
                    {WEEKLY_OEE.map((v, i) => (
                      <circle key={i} cx={(i / (WEEKLY_OEE.length - 1)) * 100} cy={toY(v)} r="1.8"
                        fill={v >= 80 ? '#248A5B' : '#D98B18'} stroke="#fff" strokeWidth="0.5"/>
                    ))}
                  </svg>
                  <div className="flex justify-between mt-1 text-xs font-mono" style={{ color: '#9FAAB5' }}>
                    <span>25 Ağu</span><span>29 Ağu</span><span>02 Eyl</span><span>07 Eyl</span>
                  </div>
                </div>
              </div>

              {/* Department breakdown */}
              <div className="rounded-lg overflow-hidden" style={{ border: '1px solid #D8DEE6' }}>
                <div className="px-4 py-3" style={{ borderBottom: '1px solid #D8DEE6', background: '#F4F6F8' }}>
                  <h3 className="text-sm font-semibold" style={{ color: '#17212B' }}>Departman Bazlı OEE (Bu Hafta)</h3>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid #D8DEE6', background: '#F4F6F8' }}>
                      {['Departman', 'OEE', 'Kullanılabilirlik', 'Performans', 'Kalite', 'Durum'].map(h => (
                        <th key={h} className="text-left px-4 py-2 text-xs font-semibold" style={{ color: '#66717F' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {OEE_DATA.map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #F4F6F8', background: '#fff' }}>
                        <td className="px-4 py-3 font-medium text-sm" style={{ color: '#17212B' }}>{row.dept}</td>
                        {[row.oee, row.availability, row.performance, row.quality].map((v, j) => (
                          <td key={j} className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 rounded-full" style={{ width: 60, background: '#F4F6F8' }}>
                                <div className="h-full rounded-full" style={{ width: `${v}%`, background: v >= 85 ? '#248A5B' : v >= 75 ? '#D98B18' : '#C83C3C' }} />
                              </div>
                              <span className="font-mono text-xs font-semibold" style={{ color: v >= 85 ? '#248A5B' : v >= 75 ? '#D98B18' : '#C83C3C' }}>%{v}</span>
                            </div>
                          </td>
                        ))}
                        <td className="px-4 py-3">
                          <span className="text-xs px-2 py-0.5 rounded" style={{
                            background: row.oee >= 80 ? '#EAF5EF' : '#FEF6E7',
                            color: row.oee >= 80 ? '#248A5B' : '#D98B18'
                          }}>
                            {row.oee >= 80 ? 'Hedef Üstü' : 'Hedef Altı'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Key insights */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { title: 'En Düşük OEE', value: 'INJ-04', sub: '%0 — Duruşta', color: '#C83C3C' },
                  { title: 'En Fazla Duruş', value: 'PRESS-07', sub: '4s 23dk arıza', color: '#D98B18' },
                  { title: 'En İyi Performans', value: 'CMM-01', sub: '%91 OEE', color: '#248A5B' },
                ].map(({ title, value, sub, color }) => (
                  <div key={title} className="p-4 rounded-lg" style={{ background: '#fff', border: '1px solid #D8DEE6' }}>
                    <div className="text-xs mb-2" style={{ color: '#66717F' }}>{title}</div>
                    <div className="text-xl font-bold font-mono" style={{ color }}>{value}</div>
                    <div className="text-xs mt-1" style={{ color: '#9FAAB5' }}>{sub}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {selected !== 'oee' && (
            <div className="flex flex-col items-center justify-center py-20 rounded-lg" style={{ background: '#fff', border: '1px solid #D8DEE6' }}>
              <div className="text-4xl mb-4">{REPORT_TYPES.find(r => r.id === selected)?.icon}</div>
              <h3 className="text-base font-semibold mb-2" style={{ color: '#17212B' }}>
                {REPORT_TYPES.find(r => r.id === selected)?.label}
              </h3>
              <p className="text-sm mb-6" style={{ color: '#66717F' }}>
                {REPORT_TYPES.find(r => r.id === selected)?.desc}
              </p>
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded text-sm font-medium" style={{ background: '#14263D', color: '#fff' }}>
                  Rapor Oluştur
                </button>
                <button className="px-4 py-2 rounded text-sm" style={{ background: '#fff', color: '#66717F', border: '1px solid #D8DEE6' }}>
                  Şablon Seç
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
