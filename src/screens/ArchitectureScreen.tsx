import React, { useState } from 'react';

type DiagramType = 'process' | 'system' | 'action' | 'offline' | 'departments';

const DIAGRAM_TABS: { id: DiagramType; label: string }[] = [
  { id: 'process', label: 'A. Tekliften Teslimata' },
  { id: 'system', label: 'B. Sistem Mimarisi' },
  { id: 'action', label: 'C. Kontrollü Aksiyon' },
  { id: 'offline', label: 'D. Offline Sync' },
  { id: 'departments', label: 'E. Departman Veri Akışı' },
];

const NODE = ({ label, sub, color, textColor = '#fff', width = 140, compact = false }: any) => (
  <div className="flex flex-col items-center justify-center rounded-lg text-center px-3"
    style={{ background: color, minWidth: width, height: compact ? 40 : 52, border: '1px solid rgba(255,255,255,0.15)' }}>
    <div className="text-xs font-semibold" style={{ color: textColor, lineHeight: 1.2 }}>{label}</div>
    {sub && <div className="text-xs mt-0.5 opacity-70" style={{ color: textColor, fontSize: 10 }}>{sub}</div>}
  </div>
);

const ARROW = ({ label, vertical = false }: { label?: string; vertical?: boolean }) => (
  vertical ? (
    <div className="flex flex-col items-center my-1">
      <div className="w-px flex-1" style={{ background: '#D8DEE6', minHeight: 16 }} />
      {label && <div className="text-xs px-2 py-0.5 rounded my-0.5" style={{ background: '#F4F6F8', color: '#66717F', whiteSpace: 'nowrap' }}>{label}</div>}
      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent" style={{ borderTopColor: '#D8DEE6' }} />
    </div>
  ) : (
    <div className="flex items-center gap-1 mx-2">
      {label && <div className="text-xs px-1.5 py-0.5 rounded" style={{ background: '#F4F6F8', color: '#66717F', whiteSpace: 'nowrap', fontSize: 10 }}>{label}</div>}
      <div className="w-4 h-px" style={{ background: '#D8DEE6' }} />
      <div className="w-0 h-0 border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent" style={{ borderLeftColor: '#D8DEE6' }} />
    </div>
  )
);

export default function ArchitectureScreen() {
  const [active, setActive] = useState<DiagramType>('process');

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-5 py-3 flex items-center gap-2 flex-shrink-0" style={{ background: '#fff', borderBottom: '1px solid #D8DEE6' }}>
        <div>
          <h1 className="text-lg font-semibold" style={{ color: '#17212B' }}>Süreç & Mimari Diyagramları</h1>
          <p className="text-sm" style={{ color: '#66717F' }}>Kahraman Twin — Sistem ve süreç akışları</p>
        </div>
      </div>

      {/* Diagram tabs */}
      <div className="flex gap-1 px-5 py-2 flex-shrink-0" style={{ background: '#F4F6F8', borderBottom: '1px solid #D8DEE6' }}>
        {DIAGRAM_TABS.map(t => (
          <button key={t.id} onClick={() => setActive(t.id)}
            className="px-3 py-1.5 rounded text-xs font-medium transition-colors"
            style={{ background: active === t.id ? '#14263D' : '#fff', color: active === t.id ? '#fff' : '#66717F', border: '1px solid #D8DEE6' }}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-8">
        {active === 'process' && (
          <div>
            <div className="text-center mb-8">
              <div className="text-xs uppercase tracking-widest mb-1" style={{ color: '#66717F' }}>Diyagram A</div>
              <h2 className="text-xl font-semibold" style={{ color: '#17212B' }}>Tekliften Teslimata Süreç</h2>
            </div>
            <div className="flex items-center justify-center flex-wrap gap-0 max-w-5xl mx-auto">
              {[
                { label: 'Müşteri Talebi', sub: 'Satış', color: '#315B7D' },
                null,
                { label: 'Teklif & Maliyet', sub: 'Satış + Finans', color: '#315B7D' },
                null,
                { label: 'Tasarım & Müh.', sub: 'Ar-Ge', color: '#4A2C5B' },
                null,
                { label: 'Kalıp Hazırlığı', sub: 'Kalıp Üretimi', color: '#4A2C5B' },
                null,
                { label: 'Üretim Planlama', sub: 'Planlama', color: '#315B7D' },
                null,
                { label: 'Üretim', sub: 'Metal/Plastik/Montaj', color: '#2C5B4A' },
                null,
                { label: 'Kalite Kontrol', sub: 'Kalite', color: '#D98B18' },
                null,
                { label: 'Sevkiyat', sub: 'Lojistik', color: '#315B7D' },
                null,
                { label: 'Müşteri Geri Bildirimi', sub: 'Satış + Kalite', color: '#248A5B' },
              ].map((node, i) => {
                if (!node) return <div key={i} className="flex items-center"><div className="w-6 h-px" style={{ background: '#D8DEE6' }} /><div className="w-0 h-0 border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent" style={{ borderLeftColor: '#D8DEE6' }} /></div>;
                return <NODE key={i} {...node} textColor="#fff" />;
              })}
            </div>

            {/* Return arrows for quality issues */}
            <div className="mt-10 max-w-4xl mx-auto rounded-xl p-6" style={{ background: '#FEF6E7', border: '1px solid #D98B1840' }}>
              <div className="text-xs font-semibold mb-4" style={{ color: '#D98B18' }}>Kalite Uygunsuzluğu Geri Dönüş Döngüleri</div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { from: 'Kalite Kontrol', to: 'Tasarım & Müh.', reason: 'Tasarım hatası' },
                  { from: 'Kalite Kontrol', to: 'Üretim Planlama', reason: 'Proses parametresi' },
                  { from: 'Kalite Kontrol', to: 'Üretim', reason: 'İşlem hatası' },
                ].map(({ from, to, reason }) => (
                  <div key={reason} className="flex items-center gap-2 p-3 rounded-lg" style={{ background: '#fff', border: '1px solid #D8DEE6' }}>
                    <div className="text-xs font-medium" style={{ color: '#D98B18' }}>{from}</div>
                    <div className="text-xs" style={{ color: '#9FAAB5' }}>→</div>
                    <div className="text-xs font-medium" style={{ color: '#315B7D' }}>{to}</div>
                    <div className="text-xs ml-auto" style={{ color: '#66717F' }}>{reason}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {active === 'system' && (
          <div>
            <div className="text-center mb-8">
              <div className="text-xs uppercase tracking-widest mb-1" style={{ color: '#66717F' }}>Diyagram B</div>
              <h2 className="text-xl font-semibold" style={{ color: '#17212B' }}>Teknik Sistem Mimarisi</h2>
            </div>
            <div className="grid grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Presentation layer */}
              <div className="rounded-xl p-5" style={{ background: 'rgba(242,140,40,0.08)', border: '1px solid rgba(242,140,40,0.25)' }}>
                <div className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: '#F28C28' }}>Sunum Katmanı</div>
                {['Windows Masaüstü Uygulaması', 'React + Vite + TypeScript', 'Şifreli Yerel Önbellek', 'Offline Senkronizasyon'].map(item => (
                  <div key={item} className="flex items-center gap-2 py-2" style={{ borderBottom: '1px solid rgba(242,140,40,0.15)' }}>
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#F28C28' }} />
                    <span className="text-xs" style={{ color: '#17212B' }}>{item}</span>
                  </div>
                ))}
              </div>

              {/* Services layer */}
              <div className="rounded-xl p-5" style={{ background: 'rgba(49,91,125,0.08)', border: '1px solid rgba(49,91,125,0.25)' }}>
                <div className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: '#315B7D' }}>Servis Katmanı</div>
                {['Kimlik & Yetki Servisi', 'Dijital İkiz API', 'Yerel LLM / RAG Motoru', 'Hesaplama Motoru', 'Aksiyon & Onay Servisi'].map(item => (
                  <div key={item} className="flex items-center gap-2 py-2" style={{ borderBottom: '1px solid rgba(49,91,125,0.15)' }}>
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#315B7D' }} />
                    <span className="text-xs" style={{ color: '#17212B' }}>{item}</span>
                  </div>
                ))}
              </div>

              {/* Data layer */}
              <div className="rounded-xl p-5" style={{ background: 'rgba(36,138,91,0.08)', border: '1px solid rgba(36,138,91,0.25)' }}>
                <div className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: '#248A5B' }}>Veri Katmanı</div>
                {['SAP S/4HANA (ERP)', 'Siemens Opcenter (MES)', 'Plex QMS (Kalite)', 'Infor CMMS (Bakım)', 'Doküman Sunucusu', 'Üretim Sistemleri'].map(item => (
                  <div key={item} className="flex items-center gap-2 py-2" style={{ borderBottom: '1px solid rgba(36,138,91,0.15)' }}>
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#248A5B' }} />
                    <span className="text-xs" style={{ color: '#17212B' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {active === 'action' && (
          <div>
            <div className="text-center mb-8">
              <div className="text-xs uppercase tracking-widest mb-1" style={{ color: '#66717F' }}>Diyagram C</div>
              <h2 className="text-xl font-semibold" style={{ color: '#17212B' }}>Kontrollü Aksiyon İş Akışı</h2>
              <p className="text-sm mt-2" style={{ color: '#66717F' }}>Yapay zekâ doğrudan kritik işlem yapamaz. Her adım izlenebilir ve onaylanabilir.</p>
            </div>
            <div className="max-w-3xl mx-auto">
              <div className="flex flex-col gap-0">
                {[
                  { n: 1, label: 'Kullanıcı İsteği', sub: 'Doğal dil veya seçim', color: '#315B7D', branch: null },
                  { n: 2, label: 'İkiz Analizi', sub: 'Veri doğrulama + hesaplama', color: '#315B7D', branch: '← Eksik veri: Kullanıcıya bildir' },
                  { n: 3, label: 'Aksiyon Önerisi', sub: 'RAG + Hesaplama motoru', color: '#4A2C5B', branch: null },
                  { n: 4, label: 'Yetki Kontrolü', sub: 'Kural + Rol matrisi', color: '#4A2C5B', branch: '← Yetkisiz: Erişim engellendi' },
                  { n: 5, label: 'Etki Simülasyonu', sub: 'Kapasite + Termin etkisi', color: '#2C5B4A', branch: null },
                  { n: 6, label: 'İnsan Onayı', sub: 'Yetkili + Şifre doğrulama', color: '#D98B18', branch: '← Reddedildi: Gerekçe kaydedilir' },
                  { n: 7, label: 'Uygulama', sub: 'ERP / MES / Kalite / Bakım', color: '#2C5B4A', branch: '← Başarısız: Retry / Rollback' },
                  { n: 8, label: 'Sonuç Doğrulama', sub: 'Beklenen vs gerçek', color: '#315B7D', branch: null },
                  { n: 9, label: 'Audit Kaydı', sub: 'Değiştirilemez log', color: '#248A5B', branch: null },
                ].map((step, i) => (
                  <div key={step.n} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: step.color }}>
                        {step.n}
                      </div>
                      {i < 8 && <div className="w-px flex-1 my-1" style={{ background: '#D8DEE6', minHeight: 20 }} />}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-1 rounded-lg px-4 py-3" style={{ background: '#fff', border: '1px solid #D8DEE6' }}>
                          <div className="text-sm font-semibold" style={{ color: '#17212B' }}>{step.label}</div>
                          <div className="text-xs mt-0.5" style={{ color: '#66717F' }}>{step.sub}</div>
                        </div>
                        {step.branch && (
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-px" style={{ background: '#C83C3C' }} />
                            <div className="px-3 py-1.5 rounded text-xs" style={{ background: '#FCEAEA', color: '#C83C3C', border: '1px solid #C83C3C30', whiteSpace: 'nowrap' }}>
                              {step.branch}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {active === 'offline' && (
          <div>
            <div className="text-center mb-8">
              <div className="text-xs uppercase tracking-widest mb-1" style={{ color: '#66717F' }}>Diyagram D</div>
              <h2 className="text-xl font-semibold" style={{ color: '#17212B' }}>Offline Senkronizasyon Akışı</h2>
            </div>
            <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="rounded-xl p-5" style={{ background: '#FCEAEA', border: '1px solid #C83C3C30' }}>
                <div className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: '#C83C3C' }}>Bağlantı Kesintisi</div>
                {['Sunucu bağlantısı kesildi bildirimi', 'Şifreli yerel önbelleke geçiş', 'Salt okunur çalışma modu', 'Kritik aksiyonlar engellendi', 'Değişiklikler yerel kuyruğa alındı'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 py-2" style={{ borderBottom: '1px solid rgba(200,60,60,0.1)' }}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: '#C83C3C', color: '#fff' }}>{i + 1}</div>
                    <span className="text-xs" style={{ color: '#17212B' }}>{item}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-xl p-5" style={{ background: '#EAF5EF', border: '1px solid #248A5B30' }}>
                <div className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: '#248A5B' }}>Bağlantı Restorasyonu</div>
                {['Bağlantı tekrar kuruldu', 'Versiyon kontrolü yapıldı', 'Çakışma tespiti', 'Kullanıcıya çakışma sunuldu', 'Veri birleştirme onaylandı', 'Başarılı senkronizasyon'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 py-2" style={{ borderBottom: '1px solid rgba(36,138,91,0.1)' }}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: '#248A5B', color: '#fff' }}>{i + 1}</div>
                    <span className="text-xs" style={{ color: '#17212B' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {active === 'departments' && (
          <div>
            <div className="text-center mb-8">
              <div className="text-xs uppercase tracking-widest mb-1" style={{ color: '#66717F' }}>Diyagram E</div>
              <h2 className="text-xl font-semibold" style={{ color: '#17212B' }}>Departman & Veri Akışı</h2>
            </div>
            {/* Central hub */}
            <div className="flex flex-col items-center gap-6">
              <div className="flex gap-6">
                {['Satış', 'Ar-Ge / Tasarım', 'Üretim Planlama'].map(d => (
                  <div key={d} className="px-4 py-3 rounded-lg text-center text-xs font-semibold" style={{ background: '#315B7D', color: '#fff', minWidth: 120 }}>{d}</div>
                ))}
              </div>
              <div className="flex items-center gap-3">
                {['↙', '↓', '↘'].map((a, i) => <div key={i} className="text-xl" style={{ color: '#D8DEE6' }}>{a}</div>)}
              </div>

              {/* Central node */}
              <div className="px-8 py-5 rounded-xl text-center" style={{ background: '#14263D', border: '2px solid #F28C28', minWidth: 320 }}>
                <div className="text-white font-bold text-base mb-1">KAHRAMAN TWIN</div>
                <div className="text-xs" style={{ color: '#8FA3B8' }}>Ortak Veri Modeli</div>
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  {['Ürün ID', 'Proje ID', 'Kalıp ID', 'İş Emri ID', 'Makine ID', 'Kalite Lot ID'].map(tag => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(242,140,40,0.2)', color: '#F28C28' }}>{tag}</span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {['↗', '↑', '↖'].map((a, i) => <div key={i} className="text-xl" style={{ color: '#D8DEE6' }}>{a}</div>)}
              </div>
              <div className="flex gap-6">
                {['Kalite', 'Bakım', 'Satın Alma', 'Finans', 'Üretim'].map(d => (
                  <div key={d} className="px-4 py-3 rounded-lg text-center text-xs font-semibold" style={{ background: '#2C5B4A', color: '#fff', minWidth: 100 }}>{d}</div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
