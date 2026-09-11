import React, { useState } from 'react';
import { IconAlert, IconCheck, IconTrendDown, IconTrendUp, IconWrench, IconFactory, IconInfo, IconChevronRight, IconRefresh } from '../components/Icons';

// Mini sparkline (14 points, normalized)
const Spark = ({ data, color, height = 28 }: { data: number[]; color: string; height?: number }) => {
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${100 - ((v - min) / range) * 100}`).join(' ');
  const fill = data.map((v, i) => `${(i / (data.length - 1)) * 100},${100 - ((v - min) / range) * 100}`);
  const fillPath = `0,100 ${fill.join(' ')} 100,100`;
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height }}>
      <polygon points={fillPath} fill={color} opacity="0.12" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const KPIS = [
  {
    label: 'Aktif İş Emirleri',
    value: '28',
    sub: '+2 bugün eklendi',
    trend: 'up',
    trendVal: '+2',
    status: 'info',
    spark: [22, 24, 26, 25, 27, 26, 28, 27, 29, 27, 26, 28, 27, 28],
    sparkColor: '#3478C7',
    nav: 'workorders',
  },
  {
    label: 'Termin Riski',
    value: '4',
    sub: '2\'si kritik seviyede',
    trend: 'up',
    trendVal: '+2 bu hafta',
    status: 'critical',
    spark: [1, 2, 1, 2, 2, 3, 2, 3, 3, 4, 3, 4, 4, 4],
    sparkColor: '#C83C3C',
    nav: 'planning',
  },
  {
    label: 'Aktif Makineler',
    value: '17',
    sub: '21 makineden — 1 arızada',
    trend: 'down',
    trendVal: '−1 bu sabah',
    status: 'warning',
    spark: [21, 21, 20, 21, 21, 21, 20, 21, 20, 19, 18, 18, 17, 17],
    sparkColor: '#D98B18',
    nav: 'machines',
  },
  {
    label: 'Günlük OEE',
    value: '%74,8',
    sub: 'Hedef: %80 — −5,2 pp',
    trend: 'down',
    trendVal: '−2,1%',
    status: 'warning',
    spark: [78, 77, 79, 76, 75, 74, 76, 75, 74, 75, 74, 75, 74, 74.8],
    sparkColor: '#D98B18',
    nav: 'reports',
  },
  {
    label: 'Fire Oranı',
    value: '%2,1',
    sub: 'Limit: %3,0 — 2 hat uyarıda',
    trend: 'up',
    trendVal: '+0,3%',
    status: 'warning',
    spark: [1.8, 1.7, 1.9, 2.0, 1.8, 2.1, 2.0, 1.9, 2.1, 2.2, 2.1, 2.0, 2.1, 2.1],
    sparkColor: '#D98B18',
    nav: 'quality',
  },
  {
    label: 'Onay Bekleyen',
    value: '6',
    sub: '2\'si süresi dolmak üzere',
    trend: null,
    trendVal: null,
    status: 'critical',
    spark: [2, 3, 4, 3, 5, 4, 5, 6, 5, 6, 7, 6, 6, 6],
    sparkColor: '#C83C3C',
    nav: 'actions',
  },
];

const STATUS_DIST = [
  { label: 'Çalışıyor', count: 14, pct: 67, color: '#248A5B' },
  { label: 'Hazırlık',  count: 2,  pct: 9,  color: '#D98B18' },
  { label: 'Bakım',     count: 1,  pct: 5,  color: '#3478C7' },
  { label: 'Duruş',     count: 3,  pct: 14, color: '#9FAAB5' },
  { label: 'Arıza',     count: 1,  pct: 5,  color: '#C83C3C' },
];

const RISK_ORDERS = [
  { id: 'WO-2026-1048', product: 'PRT-1042 Muhafaza Kapağı', customer: 'Arçelik A.Ş.', deadline: '10.09.2026', daysLeft: 3, progress: 63, risk: 'critical', cause: 'PRESS-07 arızası' },
  { id: 'WO-2026-1031', product: 'MTL-0887 Bağlantı Braketi', customer: 'Ford Otosan', deadline: '12.09.2026', daysLeft: 5, progress: 44, risk: 'warning', cause: 'Kapasite yetersizliği' },
  { id: 'WO-2026-1019', product: 'PRT-0654 Kapak Contası', customer: 'Vestel', deadline: '14.09.2026', daysLeft: 7, progress: 71, risk: 'warning', cause: 'Malzeme gecikmesi' },
  { id: 'WO-2026-1055', product: 'MTL-1120 Şasi Profili', customer: 'Tofaş', deadline: '15.09.2026', daysLeft: 8, progress: 38, risk: 'warning', cause: 'OEE düşük' },
];

const ALARMS = [
  { id: 'QA-0312', machine: 'PRESS-07', desc: 'Çap ölçüsü USL\'ye yaklaşıyor', product: 'PRT-1042', time: '08:14', level: 'critical' },
  { id: 'QA-0311', machine: 'INJ-02', desc: 'Fire oranı %3,2 — limit %3,0 aşıldı', product: 'PRT-0877', time: '07:52', level: 'warning' },
  { id: 'QA-0310', machine: 'CNC-01', desc: 'Yüzey pürüzlülüğü Ra 0,9 (hedef 0,8)', product: 'MTL-0887', time: '07:31', level: 'warning' },
];

const PENDING_ACTIONS = [
  { id: 'ACT-0421', type: 'Plan Değişikliği', desc: 'PRESS-07 iş emirlerini PRESS-05\'e aktar', risk: 'high', expires: '1s 42dk', requester: 'Dijital İkiz' },
  { id: 'ACT-0420', type: 'Bakım Talebi', desc: 'INJ-03 periyodik bakım planlaması', risk: 'medium', expires: '3s 58dk', requester: 'Bakım Ekibi' },
  { id: 'ACT-0419', type: 'Fazla Mesai', desc: 'WO-2026-1048 için Cmt fazla mesai onayı', risk: 'medium', expires: '5s içinde', requester: 'A. Kaya' },
];

const TWIN_TIPS = [
  { emoji: '🔄', text: 'PRESS-07 arızası — WO-2026-1048 termini 2 gün risk altında. PRESS-05 rota simülasyonu hazır.', cta: 'Simülasyonu İncele', nav: 'planning', level: 'critical' },
  { emoji: '📉', text: 'Bu hafta OEE ort. %74,8 — geçen haftanın %2,1 altında. INJ-04 duruşları başlıca etken.', cta: 'OEE Analizi', nav: 'reports', level: 'warning' },
  { emoji: '✅', text: 'MTL-0887 iş emri planlamandan 6 saat erken tamamlanabilir. PRESS-01 kapasite fırsatı var.', cta: 'Değerlendir', nav: 'chat', level: 'info' },
];

export default function DashboardScreen({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [dateRange, setDateRange] = useState('today');

  const statusColors: Record<string, string> = { info: '#3478C7', critical: '#C83C3C', warning: '#D98B18', ok: '#248A5B' };

  return (
    <div className="p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold" style={{ color: '#17212B' }}>Genel Bakış</h1>
          <p className="text-xs" style={{ color: '#66717F' }}>07 Eylül 2026, Pazartesi · Son güncelleme: 08:41 · Otomatik yenileme 60 sn</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded overflow-hidden" style={{ border: '1px solid #D8DEE6' }}>
            {[['today', 'Bugün'], ['week', 'Bu Hafta'], ['month', 'Bu Ay']].map(([r, l], i) => (
              <button key={r} onClick={() => setDateRange(r)}
                className="px-3 py-1.5 text-xs font-medium transition-colors"
                style={{ background: dateRange === r ? '#14263D' : '#fff', color: dateRange === r ? '#fff' : '#66717F', borderRight: i < 2 ? '1px solid #D8DEE6' : undefined }}>
                {l}
              </button>
            ))}
          </div>
          <select className="text-xs px-3 py-1.5 rounded" style={{ background: '#fff', border: '1px solid #D8DEE6', color: '#17212B' }}>
            <option>Tüm Tesisler</option><option>Ana Fabrika</option>
          </select>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs" style={{ background: '#fff', border: '1px solid #D8DEE6', color: '#315B7D' }}>
            <IconRefresh size={12} />Yenile
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-6 gap-3">
        {KPIS.map(kpi => {
          const color = statusColors[kpi.status];
          return (
            <button key={kpi.label} onClick={() => onNavigate(kpi.nav)}
              className="rounded-lg text-left overflow-hidden transition-all hover:shadow-md hover:-translate-y-px"
              style={{ background: '#fff', border: `1px solid #D8DEE6` }}>
              <div className="px-4 pt-3 pb-1">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-medium leading-tight" style={{ color: '#66717F' }}>{kpi.label}</span>
                  {kpi.trend && (
                    <div className="flex items-center gap-0.5" style={{ color: kpi.trend === 'up' && kpi.status !== 'info' ? '#C83C3C' : kpi.trend === 'down' && kpi.status !== 'info' ? '#C83C3C' : '#248A5B' }}>
                      {kpi.trend === 'up' ? <IconTrendUp size={11} /> : <IconTrendDown size={11} />}
                      <span className="text-xs">{kpi.trendVal}</span>
                    </div>
                  )}
                </div>
                <div className="text-2xl font-bold font-mono leading-none mb-1" style={{ color }}>{kpi.value}</div>
                <div className="text-xs" style={{ color: '#9FAAB5', fontSize: 10 }}>{kpi.sub}</div>
              </div>
              <div style={{ margin: '0 0 -2px' }}>
                <Spark data={kpi.spark} color={kpi.sparkColor} height={32} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Main grid: 3 columns */}
      <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr 308px' }}>
        {/* Col 1: Machine status distribution + status grid */}
        <div className="space-y-4">
          {/* Machine distribution donut-like */}
          <div className="rounded-lg" style={{ background: '#fff', border: '1px solid #D8DEE6' }}>
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #D8DEE6' }}>
              <h3 className="text-sm font-semibold" style={{ color: '#17212B' }}>Makine Durum Dağılımı</h3>
              <button onClick={() => onNavigate('machines')} className="text-xs hover:underline" style={{ color: '#3478C7' }}>Tümü →</button>
            </div>
            <div className="p-4">
              {/* Stacked bar */}
              <div className="flex h-3 rounded-full overflow-hidden mb-3">
                {STATUS_DIST.map(s => (
                  <div key={s.label} style={{ width: `${s.pct}%`, background: s.color }} title={`${s.label}: ${s.count}`} />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {STATUS_DIST.map(s => (
                  <div key={s.label} className="flex items-center gap-2 py-1">
                    <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: s.color }} />
                    <span className="text-xs flex-1" style={{ color: '#17212B' }}>{s.label}</span>
                    <span className="text-xs font-mono font-bold" style={{ color: s.color }}>{s.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Risk orders */}
          <div className="rounded-lg" style={{ background: '#fff', border: '1px solid #D8DEE6' }}>
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #D8DEE6' }}>
              <h3 className="text-sm font-semibold" style={{ color: '#17212B' }}>Termin Riski</h3>
              <button onClick={() => onNavigate('planning')} className="text-xs hover:underline" style={{ color: '#3478C7' }}>Plan →</button>
            </div>
            <div className="divide-y" style={{ borderColor: '#F4F6F8' }}>
              {RISK_ORDERS.map(o => (
                <div key={o.id} className="px-4 py-3">
                  <div className="flex items-start justify-between mb-1.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold" style={{ color: '#315B7D' }}>{o.id}</span>
                        <span className="text-xs px-1.5 py-0.5 rounded" style={{
                          background: o.risk === 'critical' ? '#FCEAEA' : '#FEF6E7',
                          color: o.risk === 'critical' ? '#C83C3C' : '#D98B18'
                        }}>{o.daysLeft}g</span>
                      </div>
                      <div className="text-xs font-medium mt-0.5" style={{ color: '#17212B' }}>{o.product}</div>
                      <div className="text-xs" style={{ color: '#66717F' }}>{o.customer} · {o.cause}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 rounded-full" style={{ background: '#F4F6F8' }}>
                      <div className="h-full rounded-full" style={{ width: `${o.progress}%`, background: o.progress < 50 ? '#C83C3C' : o.progress < 70 ? '#D98B18' : '#248A5B' }} />
                    </div>
                    <span className="text-xs font-mono" style={{ color: '#66717F' }}>%{o.progress}</span>
                    <button onClick={() => onNavigate('chat')} className="text-xs hover:underline" style={{ color: '#3478C7' }}>Neden?</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Col 2: Quality alarms + OEE area chart */}
        <div className="space-y-4">
          {/* OEE area chart */}
          <div className="rounded-lg" style={{ background: '#fff', border: '1px solid #D8DEE6' }}>
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #D8DEE6' }}>
              <div>
                <h3 className="text-sm font-semibold" style={{ color: '#17212B' }}>Üretim Alanı OEE</h3>
                <p className="text-xs mt-0.5" style={{ color: '#66717F' }}>Güncel · Kaynak: MES</p>
              </div>
            </div>
            <div className="p-4 space-y-2">
              {[
                { area: 'Kalıp Üretimi', oee: 82, target: 85 },
                { area: 'Metal Üretim', oee: 78, target: 82 },
                { area: 'Plastik Enjeksiyon', oee: 74, target: 80 },
                { area: 'Montaj', oee: 87, target: 85 },
                { area: 'Kalite Kontrol', oee: 90, target: 88 },
              ].map(({ area, oee, target }) => (
                <div key={area}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span style={{ color: '#17212B' }}>{area}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold" style={{ color: oee >= target ? '#248A5B' : '#D98B18' }}>%{oee}</span>
                      <span style={{ color: '#9FAAB5' }}>/ %{target} hdf</span>
                    </div>
                  </div>
                  <div className="relative h-2 rounded-full" style={{ background: '#F4F6F8' }}>
                    <div className="absolute h-full rounded-full" style={{ width: `${oee}%`, background: oee >= target ? '#248A5B' : '#D98B18', maxWidth: '100%' }} />
                    <div className="absolute top-0 bottom-0 w-0.5 rounded" style={{ left: `${target}%`, background: '#14263D', opacity: 0.4 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quality alarms */}
          <div className="rounded-lg" style={{ background: '#fff', border: '1px solid #D8DEE6' }}>
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #D8DEE6' }}>
              <h3 className="text-sm font-semibold" style={{ color: '#17212B' }}>Son Kalite Alarmları</h3>
              <button onClick={() => onNavigate('quality')} className="text-xs hover:underline" style={{ color: '#3478C7' }}>Kalite Merkezi →</button>
            </div>
            <div className="divide-y" style={{ borderColor: '#F4F6F8' }}>
              {ALARMS.map(a => (
                <div key={a.id} className="flex items-start gap-3 px-4 py-3">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: a.level === 'critical' ? '#C83C3C' : '#D98B18' }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-mono font-semibold" style={{ color: '#315B7D' }}>{a.machine}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: '#F4F6F8', color: '#66717F' }}>{a.product}</span>
                      <span className="ml-auto text-xs font-mono" style={{ color: '#9FAAB5' }}>{a.time}</span>
                    </div>
                    <p className="text-xs leading-snug" style={{ color: '#17212B' }}>{a.desc}</p>
                  </div>
                  <button onClick={() => onNavigate('problems')} className="text-xs px-2 py-1 rounded flex-shrink-0" style={{ background: '#EBF3FC', color: '#3478C7' }}>Analiz Et</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Col 3: Actions + Twin tips */}
        <div className="space-y-4">
          {/* Pending actions */}
          <div className="rounded-lg" style={{ background: '#fff', border: '1px solid #D8DEE6' }}>
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #D8DEE6' }}>
              <h3 className="text-sm font-semibold" style={{ color: '#17212B' }}>Onay Bekleyen</h3>
              <button onClick={() => onNavigate('actions')} className="text-xs hover:underline" style={{ color: '#3478C7' }}>Tümü (6) →</button>
            </div>
            <div className="divide-y" style={{ borderColor: '#F4F6F8' }}>
              {PENDING_ACTIONS.map(a => (
                <div key={a.id} className="px-4 py-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{
                      background: a.risk === 'high' ? '#FCEAEA' : '#FEF6E7',
                      color: a.risk === 'high' ? '#C83C3C' : '#D98B18'
                    }}>{a.type}</span>
                    <span className="text-xs ml-auto" style={{ color: '#9FAAB5', fontSize: 10 }}>{a.expires}</span>
                  </div>
                  <p className="text-xs mb-2" style={{ color: '#17212B' }}>{a.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: '#66717F' }}>{a.requester}</span>
                    <div className="flex gap-1">
                      <button onClick={() => onNavigate('actions')} className="px-2 py-1 rounded text-xs font-medium" style={{ background: '#EAF5EF', color: '#248A5B' }}>Onayla</button>
                      <button onClick={() => onNavigate('actions')} className="px-2 py-1 rounded text-xs" style={{ background: '#F4F6F8', color: '#66717F' }}>İncele</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Twin suggestions */}
          <div className="rounded-lg overflow-hidden" style={{ border: '1px solid #D8DEE6' }}>
            <div className="px-4 py-3 flex items-center gap-2" style={{ background: '#0F1E30', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: '#F28C28' }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <circle cx="5" cy="5" r="4" stroke="white" strokeWidth="1.5"/>
                  <path d="M3 5l1.5 1.5L7 3.5" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-xs font-semibold text-white">İkiz Önerileri</span>
              <span className="text-xs ml-auto" style={{ color: '#4D6175' }}>Öneri — onay gerektirmez</span>
            </div>
            <div className="divide-y" style={{ borderColor: '#F4F6F8' }}>
              {TWIN_TIPS.map((t, i) => (
                <div key={i} className="px-4 py-3" style={{ background: '#fff' }}>
                  <div className="flex gap-2">
                    <span className="text-sm flex-shrink-0">{t.emoji}</span>
                    <div>
                      <p className="text-xs leading-snug mb-1.5" style={{ color: '#17212B' }}>{t.text}</p>
                      <button onClick={() => onNavigate(t.nav)} className="text-xs font-medium hover:underline" style={{ color: '#3478C7' }}>{t.cta} →</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
