import React, { useState } from 'react';

const CAPABILITIES = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M4 22V10l5-4 5 4 5-4 5 4v12H4z" stroke="#F28C28" strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M9 22v-5h4v5M15 15h4" stroke="#F28C28" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Şirkete Sor',
    desc: 'Üretim, kalite, maliyet ve termin verilerini doğal dil ile sorgulayın. İkiz veriye dayanarak hesaplar, kaynaklarla doğrular.',
    color: '#F28C28',
    metrics: ['7 entegrasyon kaynağı', 'RAG + LLM', 'Türkçe doğal dil'],
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="3" y="3" width="22" height="22" rx="2" stroke="#3478C7" strokeWidth="1.6"/>
        <path d="M3 10h22M10 10v15M3 17h7" stroke="#3478C7" strokeWidth="1.4" strokeLinecap="round"/>
        <circle cx="19" cy="18" r="3" stroke="#3478C7" strokeWidth="1.4"/>
        <path d="M21 20l2 2" stroke="#3478C7" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Üretimi İzle',
    desc: 'Tüm makineleri, iş emirlerini ve üretim hatlarını tek ekranda gerçek zamanlı izleyin. OEE, arıza ve termin bilgisi anlık.',
    color: '#3478C7',
    metrics: ['Gerçek zamanlı MES', '5 üretim alanı', 'OEE / fire / duruş'],
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 4v6M14 18v6M4 14h6M18 14h6" stroke="#248A5B" strokeWidth="1.6" strokeLinecap="round"/>
        <circle cx="14" cy="14" r="5" stroke="#248A5B" strokeWidth="1.6"/>
        <path d="M11 14l2 2 4-4" stroke="#248A5B" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Senaryo Hesapla',
    desc: 'Sipariş artışı, malzeme değişimi veya makine arızasının maliyet ve termine etkisini simüle edin. Temel, iyimser, riskli karşılaştırması.',
    color: '#248A5B',
    metrics: ['3 senaryo tipi', 'Kapasite simülasyonu', 'Teklif fiyatlama'],
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 3L25 22H3L14 3z" stroke="#D98B18" strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M14 10v6M14 19v1" stroke="#D98B18" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Problemi Analiz Et',
    desc: '5 Neden, balık kılçığı ve benzer vaka eşleştirmesiyle kök neden analizini yapılandırılmış süreçle yürütün.',
    color: '#D98B18',
    metrics: ['8 adımlı süreç', 'Geçmiş vaka tabanı', 'CAPA entegrasyonu'],
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="3" y="8" width="22" height="17" rx="1.5" stroke="#315B7D" strokeWidth="1.6"/>
        <path d="M3 13h22M9 8V5M19 8V5" stroke="#315B7D" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M9 18l2 2 5-5" stroke="#315B7D" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Kontrollü Aksiyon Al',
    desc: 'Yapay zekâ öneri sunar, insan onaylar. Kritik işlemler şifre doğrulama ve denetim kaydıyla uygulanır.',
    color: '#315B7D',
    metrics: ['9 adımlı onay akışı', 'Yetki matrisi', 'Değiştirilemez audit log'],
  },
];

const FLOW_STEPS = [
  { n: '01', label: 'Kullanıcı Talebi', icon: '👤' },
  { n: '02', label: 'İkiz Analizi', icon: '🧠' },
  { n: '03', label: 'Aksiyon Önerisi', icon: '💡' },
  { n: '04', label: 'Yetki Kontrolü', icon: '🔒' },
  { n: '05', label: 'Etki Simülasyonu', icon: '⚡' },
  { n: '06', label: 'İnsan Onayı', icon: '✅' },
  { n: '07', label: 'Uygulama', icon: '🔄' },
  { n: '08', label: 'Audit Kaydı', icon: '📋' },
];

const STATS = [
  { label: 'Entegre Sistem', value: '7' },
  { label: 'Departman', value: '11' },
  { label: 'Ekran', value: '15+' },
  { label: 'Onay Adımı', value: '9' },
];

interface Props { onEnter: () => void; }

export default function CoverScreen({ onEnter }: Props) {
  const [activeCapIdx, setActiveCapIdx] = useState(0);
  const active = CAPABILITIES[activeCapIdx];

  return (
    <div className="min-h-screen flex flex-col overflow-auto" style={{ background: '#0B1726' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-12 py-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded flex items-center justify-center" style={{ background: '#F28C28' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="1" y="1" width="7" height="7" rx="1" fill="white"/>
              <rect x="10" y="1" width="7" height="7" rx="1" fill="white" opacity="0.5"/>
              <rect x="1" y="10" width="7" height="7" rx="1" fill="white" opacity="0.5"/>
              <rect x="10" y="10" width="7" height="7" rx="1" fill="white"/>
            </svg>
          </div>
          <div>
            <div className="font-bold text-white tracking-widest text-sm" style={{ letterSpacing: '0.12em' }}>KAHRAMAN TWIN</div>
            <div className="text-xs tracking-widest" style={{ color: '#4D6175', letterSpacing: '0.1em' }}>OPERATIONAL DIGITAL TWIN</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs" style={{ color: '#4D6175' }}>v2.4.1 · Demo Build · 07.09.2026</span>
          <button onClick={onEnter}
            className="px-5 py-2 rounded font-semibold text-sm transition-all hover:opacity-90"
            style={{ background: '#F28C28', color: '#fff' }}>
            Uygulamayı Aç →
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="px-12 pt-10 pb-16 flex gap-16 items-start">
        <div className="flex-1 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6" style={{ background: 'rgba(242,140,40,0.12)', border: '1px solid rgba(242,140,40,0.25)' }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#F28C28' }} />
            <span className="text-xs font-medium" style={{ color: '#F28C28' }}>Operasyonel Dijital İkiz ve Karar Destek Platformu</span>
          </div>
          <h1 className="font-bold leading-tight mb-6" style={{ fontSize: 48, color: '#fff', lineHeight: 1.1 }}>
            Üretim zekânızı<br/>
            <span style={{ color: '#F28C28' }}>tek merkezde</span><br/>
            birleştirin
          </h1>
          <p className="text-base leading-relaxed mb-8" style={{ color: '#8FA3B8', maxWidth: 480 }}>
            Satıştan teslimata tüm departman verilerini, yapay zekâ analizini ve kontrollü aksiyon yönetimini tek masaüstü uygulamasında birleştiren kurumsal dijital ikiz platformu.
          </p>
          <div className="flex gap-3">
            <button onClick={onEnter}
              className="px-6 py-3 rounded font-semibold text-sm transition-all hover:opacity-90"
              style={{ background: '#F28C28', color: '#fff' }}>
              Demo'yu Başlat
            </button>
            <button onClick={onEnter}
              className="px-6 py-3 rounded font-medium text-sm transition-all"
              style={{ background: 'rgba(255,255,255,0.06)', color: '#B0C4D8', border: '1px solid rgba(255,255,255,0.12)' }}>
              Mimariyi İncele
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-10 pt-10" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            {STATS.map(s => (
              <div key={s.label}>
                <div className="text-3xl font-bold font-mono" style={{ color: '#F28C28' }}>{s.value}</div>
                <div className="text-xs mt-0.5" style={{ color: '#66717F' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: capability selector */}
        <div className="w-96 flex-shrink-0">
          <div className="rounded-xl overflow-hidden" style={{ background: '#14263D', border: '1px solid rgba(255,255,255,0.08)' }}>
            {/* Tab nav */}
            <div className="flex overflow-x-auto scrollbar-hide">
              {CAPABILITIES.map((c, i) => (
                <button key={i} onClick={() => setActiveCapIdx(i)}
                  className="flex-1 py-3 text-xs font-medium whitespace-nowrap px-3 transition-colors"
                  style={{
                    borderBottom: i === activeCapIdx ? `2px solid ${c.color}` : '2px solid transparent',
                    color: i === activeCapIdx ? '#fff' : '#4D6175',
                    background: i === activeCapIdx ? 'rgba(255,255,255,0.04)' : 'transparent',
                  }}>
                  {c.title.split(' ')[0]}
                </button>
              ))}
            </div>
            {/* Content */}
            <div className="p-5">
              <div className="mb-3">{active.icon}</div>
              <div className="text-white font-semibold text-base mb-2">{active.title}</div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: '#8FA3B8' }}>{active.desc}</p>
              <div className="flex flex-wrap gap-2">
                {active.metrics.map(m => (
                  <span key={m} className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(255,255,255,0.06)', color: '#8FA3B8', border: '1px solid rgba(255,255,255,0.08)' }}>{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controlled action flow */}
      <div className="px-12 py-12" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="text-center mb-8">
          <div className="text-xs uppercase tracking-widest mb-2" style={{ color: '#4D6175' }}>Yapay Zekâ Kontrollü Aksiyon Akışı</div>
          <p className="text-sm" style={{ color: '#66717F' }}>Her kritik karar insan onayından geçer. Yapay zekâ doğrudan işlem yapamaz.</p>
        </div>
        <div className="flex items-center justify-center gap-0 overflow-x-auto">
          {FLOW_STEPS.map((step, i) => (
            <React.Fragment key={step.n}>
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl" style={{ background: '#14263D', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {step.icon}
                </div>
                <div className="text-xs font-mono" style={{ color: '#F28C28', fontSize: 10 }}>{step.n}</div>
                <div className="text-xs text-center whitespace-nowrap" style={{ color: '#8FA3B8', maxWidth: 80 }}>{step.label}</div>
              </div>
              {i < FLOW_STEPS.length - 1 && (
                <div className="flex-shrink-0 mx-1" style={{ width: 24, height: 1, background: 'linear-gradient(90deg, #315B7D, #1D3550)' }}>
                  <div className="w-full h-full relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 border-t border-r rotate-45" style={{ borderColor: '#315B7D' }} />
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Architecture overview */}
      <div className="px-12 py-12">
        <div className="text-center mb-10">
          <div className="text-xs uppercase tracking-widest mb-2" style={{ color: '#4D6175' }}>Sistem Mimarisi</div>
          <h2 className="text-xl font-semibold" style={{ color: '#fff' }}>Güvenli, izole, şirket içi altyapı</h2>
        </div>
        <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
          {[
            { tier: 'Sunum', items: ['Windows Masaüstü', 'React + Vite', 'Offline Önbellek'], color: '#F28C28' },
            { tier: 'Servisler', items: ['Dijital İkiz API', 'LLM / RAG Motoru', 'Hesaplama Servisi', 'Aksiyon & Onay'], color: '#3478C7' },
            { tier: 'Veri', items: ['SAP ERP', 'Siemens MES', 'Plex QMS', 'Infor CMMS', 'Doküman Sunucusu'], color: '#248A5B' },
          ].map(tier => (
            <div key={tier.tier} className="rounded-xl p-5" style={{ background: '#14263D', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: tier.color }}>
                {tier.tier} Katmanı
              </div>
              {tier.items.map(item => (
                <div key={item} className="flex items-center gap-2 py-1.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: tier.color, opacity: 0.6 }} />
                  <span className="text-sm" style={{ color: '#B0C4D8' }}>{item}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Departments */}
      <div className="px-12 pb-12">
        <div className="text-center mb-8">
          <div className="text-xs uppercase tracking-widest mb-2" style={{ color: '#4D6175' }}>Kapsam</div>
          <h2 className="text-xl font-semibold" style={{ color: '#fff' }}>11 departman, tek ortak veri modeli</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {['Satış', 'Ar-Ge / Tasarım', 'Üretim Planlama', 'Kalıp Üretimi', 'Metal Üretim', 'Plastik Enjeksiyon', 'Montaj', 'Kalite', 'Bakım', 'Satın Alma', 'Finans'].map(d => (
            <div key={d} className="px-4 py-2 rounded-full text-sm" style={{ background: 'rgba(255,255,255,0.04)', color: '#8FA3B8', border: '1px solid rgba(255,255,255,0.08)' }}>
              {d}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-12 py-10 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <h3 className="text-2xl font-semibold text-white mb-3">Uygulamayı keşfedin</h3>
        <p className="text-sm mb-6" style={{ color: '#66717F' }}>Demo verisiyle tüm ekranları ve akışları inceleyebilirsiniz.</p>
        <button onClick={onEnter}
          className="px-8 py-3 rounded font-bold text-sm transition-all hover:opacity-90 hover:scale-[1.02]"
          style={{ background: '#F28C28', color: '#fff' }}>
          Demo'ya Giriş Yap →
        </button>
        <div className="mt-8 text-xs" style={{ color: '#2A3F52' }}>
          Kahraman Kalıp San. ve Tic. A.Ş. · Gizli Kurumsal Sistem · Yetkisiz erişim yasaktır
        </div>
      </div>
    </div>
  );
}
