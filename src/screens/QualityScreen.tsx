import React, { useState } from 'react';

const NC_DATA = [
  { product: 'PRT-1042', machine: 'PRESS-07', type: 'Çap sapması', count: 47, rate: 2.8, trend: 'up' },
  { product: 'PRT-0877', machine: 'INJ-02', type: 'Fire — şekil hatası', count: 38, rate: 3.2, trend: 'up' },
  { product: 'MTL-0887', machine: 'CNC-01', type: 'Yüzey pürüzlülüğü', count: 21, rate: 1.1, trend: 'down' },
  { product: 'KLP-2201', machine: 'MOLD-01', type: 'Boyut tolerans', count: 14, rate: 0.7, trend: 'stable' },
];

const OPEN_CAPA = [
  { id: 'CAPA-2026-0041', product: 'PRT-1042', type: '8D', owner: 'M. Başaran', due: '14.09.2026', status: 'open', priority: 'high' },
  { id: 'CAPA-2026-0039', product: 'PRT-0877', type: 'CAPA', owner: 'N. Erdem', due: '20.09.2026', status: 'in_progress', priority: 'medium' },
  { id: 'CAPA-2026-0036', product: 'MTL-0887', type: 'CAPA', owner: 'A. Çelik', due: '30.09.2026', status: 'in_progress', priority: 'low' },
];

const CALIBRATIONS = [
  { id: 'CMM-01', name: 'Koordinat Ölçüm Makinesi', lastCal: '01.08.2026', nextCal: '01.11.2026', status: 'ok' },
  { id: 'CMM-02', name: 'Koordinat Ölçüm Makinesi', lastCal: '15.07.2026', nextCal: '15.10.2026', status: 'warning' },
  { id: 'TACH-01', name: 'Mikrometre Seti', lastCal: '10.08.2026', nextCal: '10.12.2026', status: 'ok' },
  { id: 'PRES-01', name: 'Basınç Kalibratörü', lastCal: '01.06.2026', nextCal: '01.09.2026', status: 'critical' },
];

export default function QualityScreen() {
  const [tab, setTab] = useState<'overview' | 'nc' | 'capa' | 'calibration'>('overview');

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 flex items-center gap-3 flex-shrink-0" style={{ background: '#fff', borderBottom: '1px solid #D8DEE6' }}>
        <div>
          <h1 className="text-lg font-semibold" style={{ color: '#17212B' }}>Kalite Merkezi</h1>
          <p className="text-sm" style={{ color: '#66717F' }}>07 Eylül 2026 · Tüm hatlar</p>
        </div>
        <div className="flex-1" />
        <div className="flex gap-1 rounded overflow-hidden" style={{ border: '1px solid #D8DEE6' }}>
          {[['overview', 'Genel'], ['nc', 'Uygunsuzluklar'], ['capa', 'CAPA / 8D'], ['calibration', 'Kalibrasyon']].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id as any)}
              className="px-3 py-1.5 text-xs font-medium transition-colors"
              style={{ background: tab === id ? '#14263D' : '#fff', color: tab === id ? '#fff' : '#66717F', borderRight: '1px solid #D8DEE6' }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {tab === 'overview' && (
          <div className="space-y-4">
            {/* KPIs */}
            <div className="grid grid-cols-5 gap-3">
              {[
                { label: 'Günlük Fire Oranı', value: '%2,1', status: 'warning' },
                { label: 'Açık Uygunsuzluk', value: '14', status: 'info' },
                { label: 'Açık CAPA/8D', value: '3', status: 'info' },
                { label: 'Karantina Lot', value: '2', status: 'critical' },
                { label: 'Müşteri Şikâyeti', value: '0', status: 'ok' },
              ].map(({ label, value, status }) => {
                const colors: Record<string, string> = { warning: '#D98B18', info: '#3478C7', critical: '#C83C3C', ok: '#248A5B' };
                return (
                  <div key={label} className="rounded-lg p-4" style={{ background: '#fff', border: '1px solid #D8DEE6' }}>
                    <div className="text-xs mb-2" style={{ color: '#66717F' }}>{label}</div>
                    <div className="text-2xl font-semibold font-mono" style={{ color: colors[status] }}>{value}</div>
                  </div>
                );
              })}
            </div>

            {/* Fire rate chart */}
            <div className="rounded-lg" style={{ background: '#fff', border: '1px solid #D8DEE6' }}>
              <div className="px-4 py-3" style={{ borderBottom: '1px solid #D8DEE6' }}>
                <h3 className="text-sm font-semibold" style={{ color: '#17212B' }}>Günlük Fire Oranı — Son 14 Gün (%)</h3>
              </div>
              <div className="p-4">
                <svg viewBox="0 0 100 40" className="w-full" style={{ height: 120 }} preserveAspectRatio="none">
                  <line x1="0" y1="25" x2="100" y2="25" stroke="#C83C3C" strokeWidth="0.4" strokeDasharray="2,1" />
                  <text x="1" y="24" fontSize="3.5" fill="#C83C3C">Limit %3,0</text>
                  {[2.1, 1.8, 2.3, 1.9, 2.0, 2.2, 1.7, 2.5, 2.8, 2.4, 2.1, 1.9, 2.0, 2.1].map((v, i) => {
                    const x = (i / 13) * 96 + 2;
                    const barH = (v / 4) * 36;
                    const y = 38 - barH;
                    const overLimit = v >= 3.0;
                    return (
                      <rect key={i} x={x - 2} y={y} width={4} height={barH} rx="0.5"
                        fill={overLimit ? '#C83C3C' : v > 2.5 ? '#D98B18' : '#315B7D'} opacity="0.8" />
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>
        )}

        {tab === 'nc' && (
          <div className="space-y-4">
            <div className="rounded-lg overflow-hidden" style={{ background: '#fff', border: '1px solid #D8DEE6' }}>
              <div className="px-4 py-3 grid text-xs font-semibold" style={{ borderBottom: '1px solid #D8DEE6', background: '#F4F6F8', color: '#66717F', gridTemplateColumns: '1fr 120px 180px 80px 80px 80px' }}>
                <span>Ürün / Makine</span><span>Uygunsuzluk</span><span>Tür</span><span>Adet</span><span>Oran</span><span>Trend</span>
              </div>
              {NC_DATA.map((r, i) => (
                <div key={i} className="px-4 py-3 grid items-center text-sm" style={{ borderBottom: '1px solid #F4F6F8', gridTemplateColumns: '1fr 120px 180px 80px 80px 80px' }}>
                  <div>
                    <div className="font-medium font-mono" style={{ color: '#17212B' }}>{r.product}</div>
                    <div className="text-xs" style={{ color: '#66717F' }}>{r.machine}</div>
                  </div>
                  <span className="text-xs" style={{ color: '#66717F' }}>Boyut</span>
                  <span className="text-xs" style={{ color: '#17212B' }}>{r.type}</span>
                  <span className="font-mono" style={{ color: '#17212B' }}>{r.count}</span>
                  <span className="font-mono font-semibold" style={{ color: r.rate > 3 ? '#C83C3C' : r.rate > 2 ? '#D98B18' : '#248A5B' }}>%{r.rate.toFixed(1)}</span>
                  <span className="text-xs" style={{ color: r.trend === 'up' ? '#C83C3C' : r.trend === 'down' ? '#248A5B' : '#66717F' }}>
                    {r.trend === 'up' ? '▲' : r.trend === 'down' ? '▼' : '—'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'capa' && (
          <div className="space-y-4">
            <div className="rounded-lg overflow-hidden" style={{ background: '#fff', border: '1px solid #D8DEE6' }}>
              <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #D8DEE6', background: '#F4F6F8' }}>
                <h3 className="text-sm font-semibold" style={{ color: '#17212B' }}>Açık CAPA / 8D Kayıtları</h3>
                <button className="text-xs px-3 py-1.5 rounded" style={{ background: '#14263D', color: '#fff' }}>Yeni Kayıt</button>
              </div>
              <div className="divide-y" style={{ borderColor: '#F4F6F8' }}>
                {OPEN_CAPA.map(c => (
                  <div key={c.id} className="px-4 py-3">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-mono font-semibold" style={{ color: '#315B7D' }}>{c.id}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ background: c.type === '8D' ? '#EBF3FC' : '#F4F6F8', color: c.type === '8D' ? '#3478C7' : '#66717F' }}>{c.type}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded" style={{
                        background: c.priority === 'high' ? '#FCEAEA' : c.priority === 'medium' ? '#FEF6E7' : '#EAF5EF',
                        color: c.priority === 'high' ? '#C83C3C' : c.priority === 'medium' ? '#D98B18' : '#248A5B'
                      }}>
                        {c.priority === 'high' ? 'Yüksek' : c.priority === 'medium' ? 'Orta' : 'Düşük'}
                      </span>
                      <span className="ml-auto text-xs" style={{ color: '#66717F' }}>Son: {c.due}</span>
                    </div>
                    <div className="text-sm font-medium" style={{ color: '#17212B' }}>{c.product}</div>
                    <div className="text-xs mt-0.5" style={{ color: '#66717F' }}>Sorumlu: {c.owner}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'calibration' && (
          <div className="space-y-4">
            <div className="rounded-lg overflow-hidden" style={{ background: '#fff', border: '1px solid #D8DEE6' }}>
              <div className="px-4 py-3" style={{ borderBottom: '1px solid #D8DEE6', background: '#F4F6F8' }}>
                <h3 className="text-sm font-semibold" style={{ color: '#17212B' }}>Ölçüm Cihazı Kalibrasyon Durumu</h3>
              </div>
              <div className="divide-y" style={{ borderColor: '#F4F6F8' }}>
                {CALIBRATIONS.map(c => (
                  <div key={c.id} className="flex items-center px-4 py-3 gap-4">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.status === 'ok' ? '#248A5B' : c.status === 'warning' ? '#D98B18' : '#C83C3C' }} />
                    <div className="flex-1">
                      <div className="text-sm font-medium" style={{ color: '#17212B' }}>{c.id} — {c.name}</div>
                      <div className="text-xs mt-0.5" style={{ color: '#66717F' }}>Son: {c.lastCal} · Sonraki: {c.nextCal}</div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded font-medium" style={{
                      background: c.status === 'ok' ? '#EAF5EF' : c.status === 'warning' ? '#FEF6E7' : '#FCEAEA',
                      color: c.status === 'ok' ? '#248A5B' : c.status === 'warning' ? '#D98B18' : '#C83C3C'
                    }}>
                      {c.status === 'ok' ? 'Geçerli' : c.status === 'warning' ? 'Yakın' : 'Süresi Doldu'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
