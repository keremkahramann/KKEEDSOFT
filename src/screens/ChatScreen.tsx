import React, { useState, useRef, useEffect } from 'react';
import { IconSend, IconPlus, IconFilter, IconInfo, IconCheck, IconAlert } from '../components/Icons';

const SUGGESTED = [
  'PRT-1042 siparişinin 300.000 adet artırılması durumunda 15 Ekim\'e yetişir mi?',
  'Bu ay en yüksek fire veren makine hangisi ve nedeni nedir?',
  'PRESS-07 arızasının maliyeti ve termin etkisi nedir?',
  'Gelecek hafta kapasite açığı var mı?',
];

const HISTORY = [
  { id: 1, title: 'PRT-1042 kapasite analizi', date: '07.09.2026 08:30', pinned: true },
  { id: 2, title: 'PRESS-07 arıza maliyet hesabı', date: '06.09.2026 15:12', pinned: false },
  { id: 3, title: 'Eylül kapasite planı sorgusu', date: '05.09.2026 11:45', pinned: false },
];

type Message = {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
};

const DEMO_RESPONSE = {
  summary: 'Mevcut kapasite ve terminlere göre 300.000 ek adet, 15 Ekim tarihi için kritik risk oluşturuyor. Alternatif rota ile %72 olasılıkla gerçekleştirilebilir.',
  verified: [
    { label: 'PRT-1042 mevcut sipariş', value: '1.200.000 adet', source: 'ERP · WO-2026-1048' },
    { label: 'Güncel çevrim süresi', value: '18 sn/parça', source: 'MES · PRESS-07' },
    { label: 'Mevcut OEE', value: '%74,8', source: 'MES · 06.09.2026' },
    { label: 'Kullanılabilir kapasite', value: '41.200 adet/gün', source: 'Hesaplama' },
  ],
  calculation: '300.000 adet ÷ (41.200 adet/gün × 0,748 OEE) ≈ 9,7 gün',
  assumptions: [
    'PRESS-07 bu hafta tamamen dışarıda bırakıldı (arıza)',
    'Vardiya planı mevcut 2 vardiya üzerinden hesaplandı',
    'Malzeme temin süresi 3 iş günü kabul edildi',
  ],
  affected: ['WO-2026-1031 (Ford Otosan) → +2 gün gecikme riski', 'WO-2026-1055 (Tofaş) → PRESS-05 kapasite çakışması'],
  scenarios: [
    { name: 'Mevcut Plan', date: '19 Eki', confidence: '%28', style: 'critical' },
    { name: '3. Vardiya Ekle', date: '14 Eki', confidence: '%67', style: 'warning' },
    { name: 'PRESS-05 Önceliklendir', date: '12 Eki', confidence: '%72', style: 'ok' },
  ],
  risks: ['PRESS-07 onarım süresi belirsiz (mevcut tahmini +3 gün)', 'Malzeme stoğu 6 iş günü için yeterli'],
  missing: ['PRESS-07 onarım tamamlanma tarihi onaylanmadı', 'Ek vardiya maliyeti ERP\'de güncellenmedi'],
  humanNeeded: ['3. vardiya aktivasyonu → Genel Müdür onayı gerekiyor', 'Termin değişikliği → Müşteri bilgilendirmesi gerekiyor'],
  sources: ['ERP · WO-2026-1048 · 07.09.2026 08:15', 'MES · PRESS-07 · 06.09.2026 23:59', 'Kapasite Modeli v2.3'],
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [activeConv, setActiveConv] = useState(1);
  const bottomRef = useRef<HTMLDivElement>(null);

  const sendMessage = (text?: string) => {
    const q = text || input.trim();
    if (!q) return;
    setInput('');
    const userMsg: Message = { id: Date.now(), role: 'user', content: q, timestamp: '08:42' };
    setMessages(prev => [...prev, userMsg]);
    setStreaming(true);
    setTimeout(() => {
      setStreaming(false);
      setShowResponse(true);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: DEMO_RESPONSE.summary,
        timestamp: '08:43',
      }]);
    }, 1800);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streaming]);

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left sidebar */}
      <div className="w-56 flex-shrink-0 flex flex-col" style={{ background: '#fff', borderRight: '1px solid #D8DEE6' }}>
        <div className="p-3">
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded text-sm font-medium transition-colors hover:opacity-90"
            style={{ background: '#14263D', color: '#fff' }}>
            <IconPlus size={14} />
            Yeni Konuşma
          </button>
        </div>
        <div className="px-3 mb-2">
          <div className="text-xs font-medium mb-2 mt-1" style={{ color: '#66717F' }}>Sabitlenmiş</div>
          {HISTORY.filter(h => h.pinned).map(h => (
            <button key={h.id} onClick={() => setActiveConv(h.id)}
              className="w-full text-left px-2 py-2 rounded text-sm mb-1 transition-colors"
              style={{ background: activeConv === h.id ? '#EBF3FC' : 'transparent', color: '#17212B' }}>
              <div className="truncate font-medium">{h.title}</div>
              <div className="text-xs mt-0.5" style={{ color: '#66717F' }}>{h.date}</div>
            </button>
          ))}
        </div>
        <div className="px-3 flex-1">
          <div className="text-xs font-medium mb-2" style={{ color: '#66717F' }}>Geçmiş</div>
          {HISTORY.filter(h => !h.pinned).map(h => (
            <button key={h.id} onClick={() => setActiveConv(h.id)}
              className="w-full text-left px-2 py-2 rounded text-sm mb-1 transition-colors hover:bg-gray-50"
              style={{ background: activeConv === h.id ? '#EBF3FC' : 'transparent', color: '#17212B' }}>
              <div className="truncate">{h.title}</div>
              <div className="text-xs mt-0.5" style={{ color: '#66717F' }}>{h.date}</div>
            </button>
          ))}
        </div>
        {/* Dept filters */}
        <div className="p-3 border-t" style={{ borderColor: '#D8DEE6' }}>
          <div className="text-xs font-medium mb-2" style={{ color: '#66717F' }}>Departman Filtresi</div>
          {['Üretim', 'Kalite', 'Planlama', 'Finans'].map(d => (
            <label key={d} className="flex items-center gap-2 py-1 cursor-pointer">
              <input type="checkbox" defaultChecked className="accent-orange-500" />
              <span className="text-xs" style={{ color: '#17212B' }}>{d}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Context bar */}
        <div className="px-4 py-2 flex items-center gap-3 flex-shrink-0" style={{ background: '#F4F6F8', borderBottom: '1px solid #D8DEE6' }}>
          <span className="text-xs" style={{ color: '#66717F' }}>Bağlam:</span>
          {['PRT-1042', 'WO-2026-1048', 'PRESS-07', 'Eylül 2026'].map(tag => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded" style={{ background: '#EBF3FC', color: '#3478C7', border: '1px solid #3478C720' }}>{tag}</span>
          ))}
          <button className="text-xs ml-auto" style={{ color: '#3478C7' }}>+ İlgili Kaynak Ekle</button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.length === 0 && !streaming && (
            <div className="max-w-2xl mx-auto text-center py-12">
              <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: '#14263D' }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <rect x="3" y="3" width="10" height="10" rx="1" fill="#F28C28"/>
                  <rect x="15" y="3" width="10" height="10" rx="1" fill="white" opacity="0.4"/>
                  <rect x="3" y="15" width="10" height="10" rx="1" fill="white" opacity="0.4"/>
                  <rect x="15" y="15" width="10" height="10" rx="1" fill="#F28C28" opacity="0.7"/>
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2" style={{ color: '#17212B' }}>Dijital İkize Sor</h2>
              <p className="text-sm mb-6" style={{ color: '#66717F' }}>Şirket verileriniz hakkında doğal dilde soru sorun. İkiz analiz eder, hesaplar ve aksiyon önerir.</p>
              <div className="grid grid-cols-2 gap-2 text-left">
                {SUGGESTED.map((s, i) => (
                  <button key={i} onClick={() => sendMessage(s)}
                    className="p-3 rounded text-sm text-left transition-colors hover:border-blue-300"
                    style={{ background: '#fff', border: '1px solid #D8DEE6', color: '#17212B' }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded flex items-center justify-center mr-3 flex-shrink-0 mt-0.5" style={{ background: '#14263D' }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect x="1.5" y="1.5" width="5" height="5" rx="0.5" fill="#F28C28"/>
                    <rect x="7.5" y="1.5" width="5" height="5" rx="0.5" fill="white" opacity="0.5"/>
                    <rect x="1.5" y="7.5" width="5" height="5" rx="0.5" fill="white" opacity="0.5"/>
                    <rect x="7.5" y="7.5" width="5" height="5" rx="0.5" fill="#F28C28" opacity="0.7"/>
                  </svg>
                </div>
              )}
              <div className="max-w-2xl">
                {msg.role === 'user' ? (
                  <div className="px-4 py-3 rounded-2xl rounded-tr-sm" style={{ background: '#14263D', color: '#fff' }}>
                    <p className="text-sm">{msg.content}</p>
                    <span className="text-xs mt-1 block" style={{ color: '#6B8399' }}>{msg.timestamp}</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Summary */}
                    <div className="px-4 py-3 rounded-2xl rounded-tl-sm" style={{ background: '#fff', border: '1px solid #D8DEE6' }}>
                      <p className="text-sm font-medium mb-1" style={{ color: '#17212B' }}>{msg.content}</p>
                      <span className="text-xs" style={{ color: '#66717F' }}>Kahraman Twin · {msg.timestamp} · Tahmin</span>
                    </div>

                    {showResponse && (
                      <>
                        {/* Verified data */}
                        <div className="rounded-lg overflow-hidden" style={{ border: '1px solid #D8DEE6' }}>
                          <div className="px-3 py-2 flex items-center gap-2" style={{ background: '#EAF5EF', borderBottom: '1px solid #D8DEE6' }}>
                            <IconCheck size={13} className="text-green-600" />
                            <span className="text-xs font-semibold" style={{ color: '#248A5B' }}>Doğrulanmış Veriler</span>
                          </div>
                          <div className="grid grid-cols-2 gap-0 bg-white">
                            {DEMO_RESPONSE.verified.map((v, i) => (
                              <div key={i} className="px-3 py-2" style={{ borderRight: i % 2 === 0 ? '1px solid #F4F6F8' : undefined, borderBottom: i < 2 ? '1px solid #F4F6F8' : undefined }}>
                                <div className="text-xs" style={{ color: '#66717F' }}>{v.label}</div>
                                <div className="text-sm font-semibold font-mono" style={{ color: '#17212B' }}>{v.value}</div>
                                <div className="text-xs" style={{ color: '#9FAAB5' }}>{v.source}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Calculation */}
                        <div className="px-3 py-2 rounded font-mono text-xs" style={{ background: '#0B1726', color: '#8FA3B8' }}>
                          <span style={{ color: '#F28C28' }}>HESAPLAMA: </span>{DEMO_RESPONSE.calculation}
                        </div>

                        {/* Scenarios */}
                        <div className="rounded-lg overflow-hidden" style={{ border: '1px solid #D8DEE6' }}>
                          <div className="px-3 py-2" style={{ background: '#F4F6F8', borderBottom: '1px solid #D8DEE6' }}>
                            <span className="text-xs font-semibold" style={{ color: '#17212B' }}>Alternatif Senaryolar</span>
                          </div>
                          <div className="divide-y bg-white" style={{ borderColor: '#F4F6F8' }}>
                            {DEMO_RESPONSE.scenarios.map((s, i) => (
                              <div key={i} className="flex items-center px-3 py-2.5 gap-3">
                                <span className="text-sm flex-1" style={{ color: '#17212B' }}>{s.name}</span>
                                <span className="text-sm font-mono font-semibold" style={{ color: '#17212B' }}>{s.date}</span>
                                <span className="text-xs px-2 py-0.5 rounded font-medium" style={{
                                  background: s.style === 'ok' ? '#EAF5EF' : s.style === 'warning' ? '#FEF6E7' : '#FCEAEA',
                                  color: s.style === 'ok' ? '#248A5B' : s.style === 'warning' ? '#D98B18' : '#C83C3C'
                                }}>{s.confidence}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Assumptions */}
                        <div className="px-3 py-2 rounded" style={{ background: '#FEF6E7', border: '1px solid #D98B1830' }}>
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <IconAlert size={12} style={{ color: '#D98B18' }} />
                            <span className="text-xs font-semibold" style={{ color: '#D98B18' }}>Varsayımlar</span>
                          </div>
                          {DEMO_RESPONSE.assumptions.map((a, i) => (
                            <p key={i} className="text-xs mb-0.5" style={{ color: '#17212B' }}>• {a}</p>
                          ))}
                        </div>

                        {/* Missing data */}
                        <div className="px-3 py-2 rounded" style={{ background: '#FCEAEA', border: '1px solid #C83C3C30' }}>
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <IconInfo size={12} style={{ color: '#C83C3C' }} />
                            <span className="text-xs font-semibold" style={{ color: '#C83C3C' }}>Eksik/Belirsiz Veriler</span>
                          </div>
                          {DEMO_RESPONSE.missing.map((m, i) => (
                            <p key={i} className="text-xs mb-0.5" style={{ color: '#17212B' }}>• {m}</p>
                          ))}
                        </div>

                        {/* Human needed */}
                        <div className="px-3 py-2 rounded" style={{ background: '#EBF3FC', border: '1px solid #3478C730' }}>
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <IconInfo size={12} style={{ color: '#3478C7' }} />
                            <span className="text-xs font-semibold" style={{ color: '#3478C7' }}>İnsan Onayı Gereken Adımlar</span>
                          </div>
                          {DEMO_RESPONSE.humanNeeded.map((h, i) => (
                            <p key={i} className="text-xs mb-0.5" style={{ color: '#17212B' }}>• {h}</p>
                          ))}
                        </div>

                        {/* Sources */}
                        <div className="flex flex-wrap gap-1.5">
                          {DEMO_RESPONSE.sources.map((s, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 rounded font-mono" style={{ background: '#F4F6F8', color: '#66717F', border: '1px solid #D8DEE6' }}>
                              {s}
                            </span>
                          ))}
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap gap-2 pt-1">
                          <button className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: '#14263D', color: '#fff' }}>Aksiyon Önerisi Oluştur</button>
                          <button className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: '#EBF3FC', color: '#3478C7' }}>Senaryoya Dönüştür</button>
                          <button className="px-3 py-1.5 rounded text-xs" style={{ background: '#fff', color: '#66717F', border: '1px solid #D8DEE6' }}>Analizi Kaydet</button>
                          <button className="px-3 py-1.5 rounded text-xs" style={{ background: '#fff', color: '#66717F', border: '1px solid #D8DEE6' }}>Raporla</button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {streaming && (
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded flex items-center justify-center" style={{ background: '#14263D' }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="1.5" y="1.5" width="5" height="5" rx="0.5" fill="#F28C28"/>
                  <rect x="7.5" y="1.5" width="5" height="5" rx="0.5" fill="white" opacity="0.5"/>
                  <rect x="1.5" y="7.5" width="5" height="5" rx="0.5" fill="white" opacity="0.5"/>
                  <rect x="7.5" y="7.5" width="5" height="5" rx="0.5" fill="#F28C28" opacity="0.7"/>
                </svg>
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-sm" style={{ background: '#fff', border: '1px solid #D8DEE6' }}>
                <div className="flex items-center gap-1.5">
                  <div className="text-xs mr-1" style={{ color: '#66717F' }}>Analiz ediliyor</div>
                  <div className="w-1.5 h-1.5 rounded-full streaming-dot" style={{ background: '#315B7D' }} />
                  <div className="w-1.5 h-1.5 rounded-full streaming-dot" style={{ background: '#315B7D' }} />
                  <div className="w-1.5 h-1.5 rounded-full streaming-dot" style={{ background: '#315B7D' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="p-4 flex-shrink-0" style={{ background: '#fff', borderTop: '1px solid #D8DEE6' }}>
          <div className="flex items-end gap-3 rounded-lg p-3" style={{ border: '1px solid #D8DEE6', background: '#F4F6F8' }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Şirket verileriniz hakkında soru sorun... (Enter ile gönder, Shift+Enter yeni satır)"
              className="flex-1 bg-transparent outline-none resize-none text-sm"
              style={{ color: '#17212B', minHeight: 36, maxHeight: 120 }}
              rows={1}
            />
            <button onClick={() => sendMessage()}
              className="px-4 py-2 rounded font-medium text-sm flex items-center gap-2 transition-opacity hover:opacity-90 flex-shrink-0"
              style={{ background: '#14263D', color: '#fff' }}>
              <IconSend size={14} />
              Gönder
            </button>
          </div>
          <p className="text-xs mt-2 text-center" style={{ color: '#9FAAB5' }}>
            Kahraman Twin yalnızca öneri sunar. Kritik kararlar insan onayı gerektirir. Veri kaynakları ve güven düzeyleri her yanıtta belirtilir.
          </p>
        </div>
      </div>
    </div>
  );
}
