import React from 'react';
import { IconX, IconCheck, IconAlert, IconInfo } from './Icons';

interface Props { onClose: () => void; onNavigate: (id: string) => void; }

const NOTIFICATIONS = [
  { id: 1, type: 'critical', icon: '⚠', title: 'Plansız Arıza: PRESS-07', desc: 'Hidrolik basınç kaybı. Duruş: 4s 23dk. Etkilenen: WO-2026-1048.', time: '08:14', read: false, action: 'operations' },
  { id: 2, type: 'warning', icon: '📏', title: 'Kalite Alarmı: PRT-1042', desc: 'Çap ölçüsü USL\'ye 0,05 mm kaldı. CMM-01 ölçümü.', time: '08:14', read: false, action: 'quality' },
  { id: 3, type: 'action', icon: '✅', title: 'Onay Bekleniyor: ACT-0421', desc: 'PRESS-07 iş emirlerini PRESS-05\'e aktar. Geçerlilik: 2 saat.', time: '08:45', read: false, action: 'actions' },
  { id: 4, type: 'warning', icon: '🕐', title: 'Termin Riski: WO-2026-1048', desc: 'Mevcut kapasiteyle termin 2 gün aşılabilir.', time: '07:30', read: true, action: 'workorders' },
  { id: 5, type: 'info', icon: 'ℹ', title: 'Bakım Yaklaşıyor: CMM-02', desc: 'Kalibrasyon tarihi 15 Ekim 2026. 38 gün kaldı.', time: '06:00', read: true, action: 'quality' },
];

export default function NotificationPanel({ onClose, onNavigate }: Props) {
  const unread = NOTIFICATIONS.filter(n => !n.read).length;

  const typeStyle = (type: string) => {
    switch (type) {
      case 'critical': return { bg: '#FCEAEA', border: '#C83C3C30', dot: '#C83C3C', text: '#C83C3C' };
      case 'warning':  return { bg: '#FEF6E7', border: '#D98B1830', dot: '#D98B18', text: '#D98B18' };
      case 'action':   return { bg: '#EAF5EF', border: '#248A5B30', dot: '#248A5B', text: '#248A5B' };
      default:         return { bg: '#EBF3FC', border: '#3478C730', dot: '#3478C7', text: '#3478C7' };
    }
  };

  return (
    <div className="absolute top-12 right-16 w-96 rounded-xl shadow-2xl z-50 overflow-hidden" style={{ background: '#fff', border: '1px solid #D8DEE6' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #D8DEE6', background: '#F4F6F8' }}>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold" style={{ color: '#17212B' }}>Bildirimler</span>
          {unread > 0 && <span className="text-xs px-1.5 py-0.5 rounded-full font-bold text-white" style={{ background: '#C83C3C', fontSize: 10 }}>{unread}</span>}
        </div>
        <div className="flex items-center gap-2">
          <button className="text-xs" style={{ color: '#3478C7' }}>Tümünü okundu işaretle</button>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100" style={{ color: '#66717F' }}><IconX size={14} /></button>
        </div>
      </div>

      {/* Notifications */}
      <div className="overflow-y-auto" style={{ maxHeight: 420 }}>
        {NOTIFICATIONS.map(n => {
          const s = typeStyle(n.type);
          return (
            <div key={n.id}
              className="flex gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50"
              style={{ borderBottom: '1px solid #F4F6F8', opacity: n.read ? 0.7 : 1 }}
              onClick={() => { onNavigate(n.action); onClose(); }}>
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-base" style={{ background: s.bg }}>
                  {n.icon}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-semibold truncate" style={{ color: '#17212B' }}>{n.title}</span>
                  <span className="text-xs font-mono flex-shrink-0" style={{ color: '#9FAAB5' }}>{n.time}</span>
                </div>
                <p className="text-xs mt-0.5 leading-snug" style={{ color: '#66717F' }}>{n.desc}</p>
              </div>
              {!n.read && <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ background: s.dot }} />}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5" style={{ borderTop: '1px solid #D8DEE6', background: '#F4F6F8' }}>
        <button className="text-xs w-full text-center" style={{ color: '#3478C7' }}>Tüm bildirimleri görüntüle</button>
      </div>
    </div>
  );
}
