import React, { useState } from 'react';
import { IconCheck, IconX, IconAlert, IconInfo } from '../components/Icons';

const TABS = ['Bana Atananlar', 'Onay Bekleyen', 'Uygulanıyor', 'Tamamlananlar', 'Reddedilenler'];

const ACTIONS = [
  {
    id: 'ACT-0421', type: 'Plan Değişikliği', status: 'pending_approval',
    requester: 'Dijital İkiz', dept: 'Üretim Planlama',
    entity: 'PRESS-07 → WO-2026-1048',
    desc: 'PRESS-07 arızası nedeniyle WO-2026-1048 iş emrini PRESS-05\'e aktar. PRESS-05 üzerindeki WO-2026-1042\'yi bir gün ertele.',
    current: 'WO-2026-1048 PRESS-07\'de çalışıyor (Duruş: 4s 23dk)',
    proposed: 'WO-2026-1048 PRESS-05\'e taşındı — tamamlanma 10 Eylül 17:00',
    benefit: 'WO-2026-1048 termini korunuyor. Müşteri etkisi sıfır.',
    affected: ['WO-2026-1042 (Tofaş) → +1 gün', 'WO-2026-1055 (Tofaş) → Değişim yok'],
    risk: 'high', riskLabel: 'Yüksek',
    approvals: [{ role: 'Üretim Müdürü', user: 'A. Kaya', status: 'pending' }],
    expires: '2s 15dk',
    systems: ['MES', 'ERP'],
    created: '07.09.2026 08:45',
  },
  {
    id: 'ACT-0420', type: 'Bakım Talebi', status: 'pending_approval',
    requester: 'Bakım Ekibi', dept: 'Bakım',
    entity: 'INJ-03',
    desc: 'INJ-03 periyodik bakım planlaması. Son bakım 87 gün önce yapıldı (limit: 90 gün).',
    current: 'INJ-03 şu an boşta. Bakım aralığı: 90 gün. Geçen süre: 87 gün.',
    proposed: '08.09.2026 06:00 – 10:00 arası bakım bloğu rezerve edilsin.',
    benefit: 'Plansız arıza riski %42 azalır.',
    affected: ['INJ-03 4 saatlik kapasite kaybı'],
    risk: 'medium', riskLabel: 'Orta',
    approvals: [{ role: 'Bakım Müdürü', user: 'F. Arslan', status: 'pending' }],
    expires: '4s içinde',
    systems: ['CMMS', 'MES'],
    created: '07.09.2026 08:30',
  },
];

const AuditRow = ({ time, user, action, result }: any) => (
  <div className="flex items-start gap-3 py-2" style={{ borderBottom: '1px solid #F4F6F8' }}>
    <div className="text-xs font-mono w-14 flex-shrink-0" style={{ color: '#9FAAB5' }}>{time}</div>
    <div className="flex-1">
      <span className="text-xs font-medium" style={{ color: '#17212B' }}>{user}</span>
      <span className="text-xs mx-1" style={{ color: '#66717F' }}>{action}</span>
    </div>
    <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: '#EAF5EF', color: '#248A5B' }}>{result}</span>
  </div>
);

export default function ActionsScreen() {
  const [activeTab, setActiveTab] = useState(1);
  const [selected, setSelected] = useState<typeof ACTIONS[0] | null>(ACTIONS[0]);
  const [approveConfirm, setApproveConfirm] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showReject, setShowReject] = useState(false);

  return (
    <div className="flex h-full overflow-hidden">
      {/* List */}
      <div className="w-80 flex-shrink-0 flex flex-col" style={{ background: '#fff', borderRight: '1px solid #D8DEE6' }}>
        <div className="px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid #D8DEE6' }}>
          <h2 className="text-sm font-semibold" style={{ color: '#17212B' }}>Aksiyon & Onay Merkezi</h2>
        </div>
        {/* Tabs */}
        <div className="flex flex-col overflow-y-auto scrollbar-hide gap-px px-2 py-2">
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setActiveTab(i)}
              className="flex items-center gap-2 px-3 py-2 rounded text-sm text-left transition-colors"
              style={{ background: activeTab === i ? '#EBF3FC' : 'transparent', color: activeTab === i ? '#3478C7' : '#66717F' }}>
              <span className="flex-1">{t}</span>
              {i < 2 && <span className="text-xs px-1.5 py-0.5 rounded-full font-medium" style={{ background: '#F28C28', color: '#fff', fontSize: 10 }}>{i === 0 ? 3 : 6}</span>}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto divide-y" style={{ borderColor: '#F4F6F8' }}>
          {ACTIONS.map(a => (
            <button key={a.id} onClick={() => setSelected(a)}
              className="w-full text-left p-4 transition-colors hover:bg-gray-50"
              style={{ background: selected?.id === a.id ? '#F0F7FF' : undefined }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-semibold" style={{ color: '#315B7D' }}>{a.id}</span>
                <span className="text-xs px-1.5 py-0.5 rounded" style={{
                  background: a.risk === 'high' ? '#FCEAEA' : '#FEF6E7',
                  color: a.risk === 'high' ? '#C83C3C' : '#D98B18'
                }}>{a.riskLabel}</span>
                <span className="ml-auto text-xs" style={{ color: '#9FAAB5' }}>{a.expires}</span>
              </div>
              <div className="text-xs font-medium mb-0.5" style={{ color: '#17212B' }}>{a.type}</div>
              <div className="text-xs truncate" style={{ color: '#66717F' }}>{a.entity}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Detail */}
      {selected && (
        <div className="flex-1 overflow-y-auto">
          {/* Header */}
          <div className="px-5 py-4 flex items-start gap-3" style={{ background: '#fff', borderBottom: '1px solid #D8DEE6' }}>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-sm font-bold" style={{ color: '#315B7D' }}>{selected.id}</span>
                <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ background: '#FEF6E7', color: '#D98B18' }}>Onay Bekliyor</span>
                <span className="text-xs px-2 py-0.5 rounded" style={{
                  background: selected.risk === 'high' ? '#FCEAEA' : '#FEF6E7',
                  color: selected.risk === 'high' ? '#C83C3C' : '#D98B18'
                }}>Risk: {selected.riskLabel}</span>
                <span className="text-xs" style={{ color: '#9FAAB5' }}>Geçerlilik: {selected.expires}</span>
              </div>
              <h2 className="text-base font-semibold mb-1" style={{ color: '#17212B' }}>{selected.type} — {selected.entity}</h2>
              <p className="text-sm" style={{ color: '#66717F' }}>{selected.desc}</p>
              <div className="flex items-center gap-3 mt-2 text-xs" style={{ color: '#9FAAB5' }}>
                <span>Talep eden: <strong style={{ color: '#17212B' }}>{selected.requester}</strong></span>
                <span>Departman: <strong style={{ color: '#17212B' }}>{selected.dept}</strong></span>
                <span>Oluşturulma: <strong style={{ color: '#17212B' }}>{selected.created}</strong></span>
              </div>
            </div>
          </div>

          <div className="p-5 space-y-4">
            {/* Before / After */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg p-4" style={{ background: '#FCEAEA', border: '1px solid #C83C3C30' }}>
                <div className="text-xs font-semibold mb-2" style={{ color: '#C83C3C' }}>Mevcut Durum</div>
                <p className="text-sm" style={{ color: '#17212B' }}>{selected.current}</p>
              </div>
              <div className="rounded-lg p-4" style={{ background: '#EAF5EF', border: '1px solid #248A5B30' }}>
                <div className="text-xs font-semibold mb-2" style={{ color: '#248A5B' }}>Önerilen Değişiklik</div>
                <p className="text-sm" style={{ color: '#17212B' }}>{selected.proposed}</p>
              </div>
            </div>

            {/* Impact */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg p-4" style={{ background: '#fff', border: '1px solid #D8DEE6' }}>
                <div className="text-xs font-semibold mb-2" style={{ color: '#17212B' }}>Beklenen Fayda</div>
                <p className="text-sm" style={{ color: '#248A5B' }}>{selected.benefit}</p>
              </div>
              <div className="rounded-lg p-4" style={{ background: '#fff', border: '1px solid #D8DEE6' }}>
                <div className="text-xs font-semibold mb-2" style={{ color: '#17212B' }}>Etkilenen İşler</div>
                {selected.affected.map((a, i) => (
                  <p key={i} className="text-xs mb-0.5" style={{ color: '#17212B' }}>• {a}</p>
                ))}
              </div>
            </div>

            {/* Simulation label */}
            <div className="flex items-center gap-2 text-xs px-3 py-2 rounded" style={{ background: '#EBF3FC', border: '1px solid #3478C730' }}>
              <IconInfo size={13} style={{ color: '#3478C7' }} />
              <span style={{ color: '#3478C7' }}>Etki simülasyonu çalıştırıldı — Dijital İkiz · 07.09.2026 08:44 · Gerçek uygulama insan onayından sonra gerçekleşir</span>
            </div>

            {/* Approval chain */}
            <div className="rounded-lg p-4" style={{ background: '#fff', border: '1px solid #D8DEE6' }}>
              <div className="text-xs font-semibold mb-3" style={{ color: '#17212B' }}>Onay Zinciri</div>
              {selected.approvals.map((ap, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ background: '#D98B18' }} />
                  <span className="text-sm">{ap.role}: <strong>{ap.user}</strong></span>
                  <span className="text-xs px-2 py-0.5 rounded ml-auto" style={{ background: '#FEF6E7', color: '#D98B18' }}>Bekliyor</span>
                </div>
              ))}
              <div className="text-xs mt-2" style={{ color: '#66717F' }}>
                Hedef sistemler: {selected.systems.join(', ')}
              </div>
            </div>

            {/* Approve / Reject */}
            {!approveConfirm && !showReject ? (
              <div className="flex gap-3">
                <button onClick={() => setApproveConfirm(true)}
                  className="flex-1 py-3 rounded font-semibold text-sm flex items-center justify-center gap-2"
                  style={{ background: '#248A5B', color: '#fff' }}>
                  <IconCheck size={16} />
                  Onayla
                </button>
                <button className="px-4 py-3 rounded font-medium text-sm"
                  style={{ background: '#EBF3FC', color: '#3478C7' }}>
                  Değişiklik İste
                </button>
                <button onClick={() => setShowReject(true)}
                  className="px-4 py-3 rounded font-medium text-sm flex items-center gap-2"
                  style={{ background: '#FCEAEA', color: '#C83C3C' }}>
                  <IconX size={14} />
                  Reddet
                </button>
              </div>
            ) : approveConfirm ? (
              <div className="rounded-lg p-4 space-y-3" style={{ background: '#EAF5EF', border: '1px solid #248A5B40' }}>
                <div className="flex items-center gap-2">
                  <IconAlert size={16} style={{ color: '#248A5B' }} />
                  <span className="text-sm font-semibold" style={{ color: '#248A5B' }}>Onay Doğrulaması</span>
                </div>
                <p className="text-xs" style={{ color: '#17212B' }}>Bu işlem {selected.systems.join(' ve ')} sistemlerine uygulanacaktır. Devam etmek için şifrenizi girin.</p>
                <input type="password" placeholder="Şifreniz" className="w-full px-3 py-2 rounded text-sm outline-none" style={{ background: '#fff', border: '1px solid #248A5B' }} />
                <div className="flex gap-2">
                  <button onClick={() => setApproveConfirm(false)} className="flex-1 py-2 rounded text-sm font-semibold" style={{ background: '#248A5B', color: '#fff' }}>Onayla ve Uygula</button>
                  <button onClick={() => setApproveConfirm(false)} className="px-4 py-2 rounded text-sm" style={{ background: '#fff', color: '#66717F', border: '1px solid #D8DEE6' }}>İptal</button>
                </div>
              </div>
            ) : (
              <div className="rounded-lg p-4 space-y-3" style={{ background: '#FCEAEA', border: '1px solid #C83C3C40' }}>
                <span className="text-sm font-semibold" style={{ color: '#C83C3C' }}>Reddetme Gerekçesi</span>
                <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                  placeholder="Lütfen reddetme gerekçenizi yazın..."
                  className="w-full px-3 py-2 rounded text-sm outline-none resize-none"
                  style={{ background: '#fff', border: '1px solid #C83C3C', minHeight: 80 }} />
                <div className="flex gap-2">
                  <button onClick={() => setShowReject(false)} className="flex-1 py-2 rounded text-sm font-semibold" style={{ background: '#C83C3C', color: '#fff' }}>Reddet</button>
                  <button onClick={() => setShowReject(false)} className="px-4 py-2 rounded text-sm" style={{ background: '#fff', color: '#66717F', border: '1px solid #D8DEE6' }}>İptal</button>
                </div>
              </div>
            )}

            {/* Audit */}
            <div className="rounded-lg" style={{ background: '#fff', border: '1px solid #D8DEE6' }}>
              <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid #D8DEE6' }}>
                <span className="text-xs font-semibold" style={{ color: '#17212B' }}>Denetim Kaydı</span>
                <span className="text-xs ml-auto px-1.5 py-0.5 rounded" style={{ background: '#F4F6F8', color: '#66717F' }}>Değiştirilemez</span>
              </div>
              <div className="px-4 py-2">
                <AuditRow time="08:45" user="Dijital İkiz" action="aksiyon önerisi oluşturdu" result="Oluşturuldu" />
                <AuditRow time="08:45" user="Sistem" action="onay zinciri başlatıldı → A. Kaya" result="Bildirim Gönderildi" />
                <AuditRow time="08:47" user="A. Kaya" action="aksiyon incelendi" result="Görüntülendi" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
