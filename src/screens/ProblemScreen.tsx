import React, { useState } from 'react';
import { IconCheck, IconAlert, IconInfo, IconChevronRight } from '../components/Icons';

const STEPS = [
  { id: 1, label: 'Problemi Tanımla', short: 'Tanımla' },
  { id: 2, label: 'Veri Topla', short: 'Veri' },
  { id: 3, label: 'Benzer Vakaları Bul', short: 'Vakalar' },
  { id: 4, label: 'Nedenleri Analiz Et', short: 'Analiz' },
  { id: 5, label: 'Kök Nedeni Doğrula', short: 'Doğrula' },
  { id: 6, label: 'Aksiyon Planla', short: 'Aksiyon' },
  { id: 7, label: 'Sonucu Ölç', short: 'Ölç' },
  { id: 8, label: 'Vakayı Kapat', short: 'Kapat' },
];

const ROOT_CAUSES = [
  {
    category: 'Makine',
    candidate: 'Kalıp aşınması — göz çapı tolerans dışına çıkıyor',
    evidence: ['Son kalıp revizyonu 8 ay önce', 'Çap ölçüleri son 3 günde monoton artış gösteriyor', 'PRESS-07 2.380.000 vuruş (hedef 2.000.000)'],
    counter: ['Kalıp ölçüm raporu dışarıda henüz'],
    confidence: 78,
    status: 'candidate',
  },
  {
    category: 'Malzeme',
    candidate: 'Hammadde lot değişimi — viskozite farkı',
    evidence: ['Lot LOT-2026-0441 3 gün önce açıldı', 'Kaynaktan %2,3 viskozite sapması var'],
    counter: ['Sertifika değerleri nominale yakın', 'Aynı lot başka hatta sorun yok'],
    confidence: 34,
    status: 'low',
  },
  {
    category: 'İnsan',
    candidate: 'Vardiya değişiminde sıcaklık resetlenmedi',
    evidence: ['06:30 vardiya geçişi kayıtları', 'Sıcaklık parametresi 2°C düşük gözlemlenmiş'],
    counter: ['Operatör talimatı takip etmiş', 'İmza defteri dolu'],
    confidence: 22,
    status: 'low',
  },
];

const SIMILAR_CASES = [
  { id: 'PRM-2025-0187', product: 'PRT-1042', machine: 'PRESS-07', date: '14.03.2025', root: 'Kalıp aşınması', resolution: 'Kalıp revize edildi', days: 3 },
  { id: 'PRM-2024-0304', product: 'PRT-0990', machine: 'PRESS-05', date: '22.08.2024', root: 'Malzeme lot sapması', resolution: 'Lot değiştirildi', days: 1 },
];

const MEASUREMENT_DATA = [
  { hour: '06', value: 24.82 }, { hour: '07', value: 24.84 }, { hour: '08', value: 24.86 },
  { hour: '09', value: 24.88 }, { hour: '10', value: 24.91 }, { hour: '11', value: 24.93 },
  { hour: '12', value: 24.95 }, { hour: '13', value: 24.97 }, { hour: '14', value: 24.98 },
];
const NOMINAL = 24.85;
const UTL = 25.00;
const LTL = 24.70;

export default function ProblemScreen() {
  const [activeStep, setActiveStep] = useState(4);
  const [confirmedRoot, setConfirmedRoot] = useState<number | null>(null);

  const minV = 24.60, maxV = 25.10;
  const range = maxV - minV;
  const toY = (v: number) => 100 - ((v - minV) / range) * 100;

  const points = MEASUREMENT_DATA.map((d, i) => ({
    x: (i / (MEASUREMENT_DATA.length - 1)) * 100,
    y: toY(d.value),
  }));
  const polyline = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="px-5 py-3 flex items-start gap-3" style={{ background: '#fff', borderBottom: '1px solid #D8DEE6' }}>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded" style={{ background: '#EBF3FC', color: '#3478C7' }}>PRM-2026-0312</span>
              <span className="text-xs px-2 py-0.5 rounded" style={{ background: '#FEF6E7', color: '#D98B18' }}>Aktif</span>
              <span className="text-xs" style={{ color: '#66717F' }}>Açıldı: 07.09.2026 08:14 · A. Kaya</span>
            </div>
            <h1 className="text-lg font-semibold mb-1" style={{ color: '#17212B' }}>PRT-1042 ürününde çap ölçüsü üst limite yaklaşıyor</h1>
            <div className="flex items-center gap-3 text-xs" style={{ color: '#66717F' }}>
              <span>Ürün: PRT-1042 Rev.C</span>
              <span>Makine: PRESS-07</span>
              <span>Kalıp: MLD-2201</span>
              <span>Lot: LOT-2026-0441</span>
              <span>Müşteri: Arçelik A.Ş.</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: '#14263D', color: '#fff' }}>CAPA Başlat</button>
            <button className="px-3 py-1.5 rounded text-xs" style={{ background: '#fff', color: '#66717F', border: '1px solid #D8DEE6' }}>8D Rapor</button>
          </div>
        </div>

        {/* Step progress */}
        <div className="px-5 py-3 flex items-center gap-0 overflow-x-auto" style={{ background: '#F4F6F8', borderBottom: '1px solid #D8DEE6' }}>
          {STEPS.map((step, i) => {
            const done = step.id < activeStep;
            const active = step.id === activeStep;
            return (
              <React.Fragment key={step.id}>
                <button onClick={() => setActiveStep(step.id)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded transition-colors whitespace-nowrap"
                  style={{
                    background: active ? '#14263D' : done ? '#EAF5EF' : 'transparent',
                    color: active ? '#fff' : done ? '#248A5B' : '#9FAAB5',
                  }}>
                  <div className="w-4 h-4 rounded-full flex items-center justify-center text-xs" style={{
                    background: active ? '#F28C28' : done ? '#248A5B' : '#D8DEE6',
                    color: active || done ? '#fff' : '#9FAAB5',
                    fontSize: 10, fontWeight: 700
                  }}>
                    {done ? '✓' : step.id}
                  </div>
                  <span className="text-xs font-medium">{step.short}</span>
                </button>
                {i < STEPS.length - 1 && <div className="w-3 h-px flex-shrink-0" style={{ background: '#D8DEE6' }} />}
              </React.Fragment>
            );
          })}
        </div>

        <div className="p-5 grid gap-5" style={{ gridTemplateColumns: '1fr 340px' }}>
          {/* Left */}
          <div className="space-y-4">
            {/* Measurement trend */}
            <div className="rounded-lg overflow-hidden" style={{ background: '#fff', border: '1px solid #D8DEE6' }}>
              <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #D8DEE6' }}>
                <div>
                  <h3 className="text-sm font-semibold" style={{ color: '#17212B' }}>Çap Ölçüm Trendi — Ø 24,85 mm</h3>
                  <p className="text-xs" style={{ color: '#66717F' }}>USL: 25,00 · Nominal: 24,85 · LSL: 24,70 · Kaynak: CMM-01 · Bugün</p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded" style={{ background: '#FEF6E7', color: '#D98B18' }}>USL'ye %0,02 mm kaldı</span>
              </div>
              <div className="p-4">
                <svg viewBox="0 0 100 80" className="w-full" style={{ height: 140 }} preserveAspectRatio="none">
                  {/* LSL */}
                  <line x1="0" y1={toY(LTL)} x2="100" y2={toY(LTL)} stroke="#3478C7" strokeWidth="0.4" strokeDasharray="2,1" />
                  {/* Nominal */}
                  <line x1="0" y1={toY(NOMINAL)} x2="100" y2={toY(NOMINAL)} stroke="#248A5B" strokeWidth="0.5" strokeDasharray="3,1" />
                  {/* USL */}
                  <line x1="0" y1={toY(UTL)} x2="100" y2={toY(UTL)} stroke="#C83C3C" strokeWidth="0.6" />
                  {/* Warning zone */}
                  <rect x="0" y={toY(UTL)} width="100" height={toY(UTL * 0.998) - toY(UTL)} fill="#C83C3C" opacity="0.07" />
                  {/* Trend line */}
                  <polyline points={polyline} fill="none" stroke="#F28C28" strokeWidth="1.5" />
                  {/* Data points */}
                  {points.map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r="1.5" fill="#F28C28" />
                  ))}
                  {/* Labels */}
                  <text x="1" y={toY(UTL) - 1} fontSize="4" fill="#C83C3C">USL 25,00</text>
                  <text x="1" y={toY(NOMINAL) - 1} fontSize="4" fill="#248A5B">Nom 24,85</text>
                  <text x="1" y={toY(LTL) - 1} fontSize="4" fill="#3478C7">LSL 24,70</text>
                </svg>
                <div className="flex justify-between mt-1">
                  {MEASUREMENT_DATA.map(d => (
                    <span key={d.hour} className="text-xs font-mono" style={{ color: '#9FAAB5' }}>{d.hour}:00</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Root cause analysis */}
            <div className="rounded-lg overflow-hidden" style={{ background: '#fff', border: '1px solid #D8DEE6' }}>
              <div className="px-4 py-3" style={{ borderBottom: '1px solid #D8DEE6' }}>
                <h3 className="text-sm font-semibold" style={{ color: '#17212B' }}>Aday Kök Nedenler — İkiz Analizi</h3>
                <p className="text-xs mt-0.5" style={{ color: '#66717F' }}>İkiz bir nedeni kesin olarak işaretleyemez. Doğrulamayı insan yapar.</p>
              </div>
              <div className="divide-y" style={{ borderColor: '#F4F6F8' }}>
                {ROOT_CAUSES.map((rc, i) => (
                  <div key={i} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ background: '#F4F6F8', color: '#66717F' }}>{rc.category}</span>
                          <div className="flex items-center gap-1">
                            <div className="h-1.5 rounded-full" style={{ width: 60, background: '#F4F6F8' }}>
                              <div className="h-full rounded-full" style={{
                                width: `${rc.confidence}%`,
                                background: rc.confidence > 60 ? '#D98B18' : rc.confidence > 40 ? '#3478C7' : '#9FAAB5'
                              }} />
                            </div>
                            <span className="text-xs font-mono font-semibold" style={{ color: rc.confidence > 60 ? '#D98B18' : '#66717F' }}>%{rc.confidence}</span>
                          </div>
                        </div>
                        <p className="text-sm font-medium" style={{ color: '#17212B' }}>{rc.candidate}</p>
                      </div>
                      {confirmedRoot === i ? (
                        <span className="text-xs px-2 py-1 rounded font-semibold flex items-center gap-1" style={{ background: '#EAF5EF', color: '#248A5B' }}>
                          <IconCheck size={12} /> Doğrulandı
                        </span>
                      ) : (
                        <button onClick={() => setConfirmedRoot(i)}
                          className="text-xs px-2 py-1 rounded transition-colors hover:opacity-80"
                          style={{ background: '#EBF3FC', color: '#3478C7' }}>
                          Doğrula
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs font-medium mb-1" style={{ color: '#248A5B' }}>Kanıtlar</div>
                        {rc.evidence.map((e, j) => (
                          <p key={j} className="text-xs mb-0.5" style={{ color: '#17212B' }}>• {e}</p>
                        ))}
                      </div>
                      <div>
                        <div className="text-xs font-medium mb-1" style={{ color: '#C83C3C' }}>Karşı Kanıtlar</div>
                        {rc.counter.map((e, j) => (
                          <p key={j} className="text-xs mb-0.5" style={{ color: '#17212B' }}>• {e}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Similar cases + 5 Whys */}
          <div className="space-y-4">
            {/* Similar cases */}
            <div className="rounded-lg overflow-hidden" style={{ background: '#fff', border: '1px solid #D8DEE6' }}>
              <div className="px-4 py-3" style={{ borderBottom: '1px solid #D8DEE6', background: '#F4F6F8' }}>
                <h3 className="text-sm font-semibold" style={{ color: '#17212B' }}>Benzer Geçmiş Vakalar</h3>
                <p className="text-xs mt-0.5" style={{ color: '#66717F' }}>İkiz tarafından eşleştirildi</p>
              </div>
              <div className="divide-y" style={{ borderColor: '#F4F6F8' }}>
                {SIMILAR_CASES.map(c => (
                  <div key={c.id} className="p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono font-semibold" style={{ color: '#315B7D' }}>{c.id}</span>
                      <span className="text-xs" style={{ color: '#66717F' }}>{c.date}</span>
                    </div>
                    <div className="text-xs mb-1" style={{ color: '#17212B' }}>{c.product} · {c.machine}</div>
                    <div className="text-xs mb-1" style={{ color: '#66717F' }}>Kök neden: <span style={{ color: '#17212B' }}>{c.root}</span></div>
                    <div className="text-xs" style={{ color: '#66717F' }}>Çözüm: <span style={{ color: '#248A5B' }}>{c.resolution}</span> · {c.days} günde</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5 Whys */}
            <div className="rounded-lg overflow-hidden" style={{ background: '#fff', border: '1px solid #D8DEE6' }}>
              <div className="px-4 py-3" style={{ borderBottom: '1px solid #D8DEE6' }}>
                <h3 className="text-sm font-semibold" style={{ color: '#17212B' }}>5 Neden Analizi</h3>
              </div>
              <div className="p-3 space-y-2">
                {[
                  { q: 'Sorun nedir?', a: 'Çap ölçüsü üst limite yaklaşıyor' },
                  { q: 'Neden?', a: 'Kalıp göz çapı nominal değerden büyümüş' },
                  { q: 'Neden?', a: 'Kalıp aşınması — 2.38M vuruş aşıldı' },
                  { q: 'Neden?', a: 'Periyodik kalıp revizyonu yapılmadı' },
                  { q: 'Neden?', a: 'PM planında sınır takibi eksik' },
                ].map((w, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold" style={{ background: '#14263D', color: '#F28C28' }}>{i + 1}</div>
                    <div className="flex-1 text-xs rounded p-2" style={{ background: '#F4F6F8' }}>
                      <div className="font-medium mb-0.5" style={{ color: '#66717F' }}>{w.q}</div>
                      <div style={{ color: '#17212B' }}>{w.a}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action */}
            <div className="rounded-lg p-4 space-y-3" style={{ background: '#EAF5EF', border: '1px solid #248A5B40' }}>
              <div className="text-sm font-semibold" style={{ color: '#248A5B' }}>Aksiyon Önerisi</div>
              <p className="text-xs" style={{ color: '#17212B' }}>Kalıp MLD-2201'i üretimden çıkar ve revizyon için kalıp atölyesine gönder. PRESS-05'e geçici rota planla.</p>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: '#248A5B', color: '#fff' }}>Aksiyon Oluştur</button>
                <button className="px-3 py-1.5 rounded text-xs" style={{ background: '#fff', color: '#248A5B', border: '1px solid #248A5B' }}>İkize Sor</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
