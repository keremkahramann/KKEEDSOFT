import React, { useState } from 'react';
import { IconFilter, IconDownload, IconLock } from '../components/Icons';

const LOGS = [
  { id: 'LOG-2026-084501', ts: '07.09.2026 08:45:01', user: 'Dijital İkiz', action: 'Aksiyon önerisi oluşturuldu', entity: 'ACT-0421', oldVal: '—', newVal: 'Plan Değişikliği: PRESS-07→PRESS-05', approver: '—', system: 'Dijital İkiz', result: 'Oluşturuldu', reqId: 'REQ-0421-001' },
  { id: 'LOG-2026-084502', ts: '07.09.2026 08:45:02', user: 'Sistem', action: 'Onay bildirimi gönderildi', entity: 'ACT-0421', oldVal: '—', newVal: 'Bildirim: A. Kaya', approver: '—', system: 'Bildirim', result: 'Başarılı', reqId: 'REQ-0421-002' },
  { id: 'LOG-2026-084706', ts: '07.09.2026 08:47:06', user: 'A. Kaya', action: 'Aksiyon görüntülendi', entity: 'ACT-0421', oldVal: '—', newVal: '—', approver: '—', system: 'Uygulama', result: 'Görüntülendi', reqId: 'REQ-0421-003' },
  { id: 'LOG-2026-083012', ts: '07.09.2026 08:30:12', user: 'F. Arslan', action: 'Bakım talebi oluşturuldu', entity: 'ACT-0420', oldVal: '—', newVal: 'INJ-03 PM planı', approver: '—', system: 'CMMS', result: 'Oluşturuldu', reqId: 'REQ-0420-001' },
  { id: 'LOG-2026-081401', ts: '07.09.2026 08:14:01', user: 'CMM-01', action: 'Kalite alarmı tetiklendi', entity: 'QA-2026-0312', oldVal: 'Ø24,93mm', newVal: 'Ø24,95mm (USL: 25,00)', approver: '—', system: 'QMS', result: 'Alarm', reqId: 'REQ-QA-0312' },
  { id: 'LOG-2026-060041', ts: '07.09.2026 06:00:41', user: 'A. Kaya', action: 'Sisteme giriş yapıldı', entity: 'KULLANICI-0041', oldVal: '—', newVal: 'Oturum başladı', approver: '—', system: 'Kimlik', result: 'Başarılı', reqId: 'REQ-AUTH-0041' },
  { id: 'LOG-2026-055901', ts: '06.09.2026 23:59:01', user: 'MES-SRVR', action: 'OEE verisi güncellendi', entity: 'PRESS-07', oldVal: '%81', newVal: '%0 (Arıza)', approver: '—', system: 'MES', result: 'Güncellendi', reqId: 'REQ-MES-7801' },
];

export default function AuditScreen() {
  const [filter, setFilter] = useState('');

  const filtered = LOGS.filter(l =>
    !filter || l.user.toLowerCase().includes(filter.toLowerCase()) ||
    l.action.toLowerCase().includes(filter.toLowerCase()) ||
    l.entity.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-semibold" style={{ color: '#17212B' }}>Denetim Kayıtları</h1>
          <div className="flex items-center gap-2 mt-1">
            <IconLock size={13} style={{ color: '#248A5B' }} />
            <span className="text-xs" style={{ color: '#248A5B' }}>Kayıtlar değiştirilemez — kriptografik imzalı</span>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded" style={{ background: '#fff', border: '1px solid #D8DEE6' }}>
            <IconFilter size={13} style={{ color: '#66717F' }} />
            <input type="text" placeholder="Ara: kullanıcı, işlem, kayıt..." value={filter}
              onChange={e => setFilter(e.target.value)}
              className="outline-none text-xs bg-transparent" style={{ color: '#17212B', width: 200 }} />
          </div>
          <select className="px-3 py-1.5 rounded text-xs" style={{ background: '#fff', border: '1px solid #D8DEE6', color: '#17212B' }}>
            <option>Tüm Sistemler</option><option>ERP</option><option>MES</option><option>QMS</option>
          </select>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs" style={{ background: '#fff', border: '1px solid #D8DEE6', color: '#315B7D' }}>
            <IconDownload size={13} />
            Dışa Aktar
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto rounded-lg" style={{ border: '1px solid #D8DEE6' }}>
        <table className="w-full text-xs" style={{ borderCollapse: 'collapse' }}>
          <thead className="sticky top-0">
            <tr style={{ background: '#F4F6F8', borderBottom: '2px solid #D8DEE6' }}>
              {['Tarih & Saat', 'Kullanıcı', 'İşlem', 'Etkilenen Kayıt', 'Eski Değer', 'Yeni Değer', 'Sistem', 'Sonuç', 'İstek ID'].map(h => (
                <th key={h} className="text-left px-3 py-2.5 font-semibold whitespace-nowrap" style={{ color: '#66717F' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((log, i) => (
              <tr key={log.id} className="hover:bg-gray-50 transition-colors" style={{ borderBottom: '1px solid #F4F6F8', background: i % 2 === 0 ? '#fff' : '#FAFBFC' }}>
                <td className="px-3 py-2.5 font-mono whitespace-nowrap" style={{ color: '#66717F' }}>{log.ts}</td>
                <td className="px-3 py-2.5 font-medium whitespace-nowrap" style={{ color: '#17212B' }}>{log.user}</td>
                <td className="px-3 py-2.5" style={{ color: '#17212B', maxWidth: 200 }}>{log.action}</td>
                <td className="px-3 py-2.5 font-mono" style={{ color: '#315B7D' }}>{log.entity}</td>
                <td className="px-3 py-2.5" style={{ color: '#66717F', maxWidth: 120 }}>
                  <span className="truncate block" title={log.oldVal}>{log.oldVal}</span>
                </td>
                <td className="px-3 py-2.5" style={{ color: '#17212B', maxWidth: 180 }}>
                  <span className="truncate block" title={log.newVal}>{log.newVal}</span>
                </td>
                <td className="px-3 py-2.5">
                  <span className="px-1.5 py-0.5 rounded" style={{ background: '#F4F6F8', color: '#66717F' }}>{log.system}</span>
                </td>
                <td className="px-3 py-2.5">
                  <span className="px-1.5 py-0.5 rounded font-medium" style={{
                    background: log.result === 'Başarılı' || log.result === 'Oluşturuldu' || log.result === 'Güncellendi' || log.result === 'Görüntülendi' ? '#EAF5EF' : log.result === 'Alarm' ? '#FEF6E7' : '#F4F6F8',
                    color: log.result === 'Başarılı' || log.result === 'Oluşturuldu' || log.result === 'Güncellendi' || log.result === 'Görüntülendi' ? '#248A5B' : log.result === 'Alarm' ? '#D98B18' : '#66717F'
                  }}>{log.result}</span>
                </td>
                <td className="px-3 py-2.5 font-mono" style={{ color: '#9FAAB5' }}>{log.reqId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs" style={{ color: '#66717F' }}>Toplam 4.812 kayıt · {filtered.length} sonuç gösteriliyor</span>
        <div className="flex gap-1">
          {[1, 2, 3, '...', 48].map((p, i) => (
            <button key={i} className="px-2.5 py-1 rounded text-xs" style={{
              background: p === 1 ? '#14263D' : '#fff',
              color: p === 1 ? '#fff' : '#66717F',
              border: '1px solid #D8DEE6'
            }}>{p}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
