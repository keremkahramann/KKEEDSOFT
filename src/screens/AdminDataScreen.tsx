import React, { useState } from 'react';
import { IconServer, IconCheck, IconX, IconRefresh, IconAlert } from '../components/Icons';

const DATA_SOURCES = [
  {
    id: 'erp', name: 'ERP — SAP S/4HANA', type: 'ERP', status: 'connected',
    lastSync: '07.09.2026 08:41', lag: '2 dk', records: '14.832', lastError: null,
    color: '#248A5B',
  },
  {
    id: 'mes', name: 'MES — Siemens Opcenter', type: 'MES', status: 'connected',
    lastSync: '07.09.2026 08:40', lag: '30 sn', records: '1.204.118', lastError: null,
    color: '#248A5B',
  },
  {
    id: 'quality', name: 'Kalite Sistemi — Plex QMS', type: 'Kalite', status: 'connected',
    lastSync: '07.09.2026 08:38', lag: '5 dk', records: '89.441', lastError: null,
    color: '#248A5B',
  },
  {
    id: 'cmms', name: 'Bakım — Infor CMMS', type: 'Bakım', status: 'warning',
    lastSync: '07.09.2026 07:12', lag: '92 dk', records: '3.812',
    lastError: 'Timeout: bağlantı 90 sn içinde yanıt vermedi',
    color: '#D98B18',
  },
  {
    id: 'files', name: 'Dosya Sistemi — Doküman Sunucusu', type: 'Dosya', status: 'connected',
    lastSync: '07.09.2026 02:00', lag: '6s 41dk', records: '12.089', lastError: null,
    color: '#248A5B',
  },
  {
    id: 'llm', name: 'Yerel Dil Modeli — LLM Sunucu', type: 'AI Model', status: 'connected',
    lastSync: '—', lag: '120 ms', records: '—', lastError: null,
    color: '#248A5B',
  },
];

export default function AdminDataScreen() {
  const [testing, setTesting] = useState<string | null>(null);

  const test = (id: string) => {
    setTesting(id);
    setTimeout(() => setTesting(null), 1500);
  };

  return (
    <div className="p-5 max-w-5xl">
      <div className="mb-5">
        <h1 className="text-lg font-semibold" style={{ color: '#17212B' }}>Veri Kaynakları</h1>
        <p className="text-sm" style={{ color: '#66717F' }}>Entegrasyon bağlantıları ve senkronizasyon durumu</p>
      </div>

      <div className="grid gap-4">
        {DATA_SOURCES.map(ds => (
          <div key={ds.id} className="rounded-lg" style={{ background: '#fff', border: '1px solid #D8DEE6' }}>
            <div className="px-5 py-4 flex items-start gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1 ${ds.status === 'warning' ? 'animate-pulse' : ''}`} style={{ background: ds.color }} />
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold" style={{ color: '#17212B' }}>{ds.name}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: '#F4F6F8', color: '#66717F' }}>{ds.type}</span>
                    <span className="text-xs px-2 py-0.5 rounded font-medium" style={{
                      background: ds.status === 'connected' ? '#EAF5EF' : ds.status === 'warning' ? '#FEF6E7' : '#FCEAEA',
                      color: ds.status === 'connected' ? '#248A5B' : ds.status === 'warning' ? '#D98B18' : '#C83C3C'
                    }}>
                      {ds.status === 'connected' ? 'Bağlı' : ds.status === 'warning' ? 'Uyarı' : 'Bağlantı Yok'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs" style={{ color: '#66717F' }}>
                    <span>Son sync: <strong style={{ color: '#17212B' }}>{ds.lastSync}</strong></span>
                    <span>Gecikme: <strong style={{ color: '#17212B' }}>{ds.lag}</strong></span>
                    {ds.records !== '—' && <span>Kayıt: <strong style={{ color: '#17212B' }}>{ds.records}</strong></span>}
                  </div>
                  {ds.lastError && (
                    <div className="mt-2 flex items-start gap-2 text-xs px-2 py-1.5 rounded" style={{ background: '#FEF6E7', color: '#D98B18' }}>
                      <IconAlert size={12} className="flex-shrink-0 mt-0.5" />
                      <span>{ds.lastError}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => test(ds.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs transition-colors"
                  style={{ background: '#F4F6F8', color: '#315B7D', border: '1px solid #D8DEE6' }}>
                  {testing === ds.id ? (
                    <><IconRefresh size={12} className="animate-spin" />Test ediliyor...</>
                  ) : (
                    <><IconServer size={12} />Bağlantıyı Test Et</>
                  )}
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs" style={{ background: '#EBF3FC', color: '#3478C7', border: '1px solid #3478C730' }}>
                  <IconRefresh size={12} />
                  Sync Başlat
                </button>
                <button className="px-3 py-1.5 rounded text-xs" style={{ background: '#fff', color: '#66717F', border: '1px solid #D8DEE6' }}>
                  Logları Gör
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* System info */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        {[
          { label: 'Bağlı Kaynak', value: '5/6', status: 'ok' },
          { label: 'Son Başarılı Sync', value: '08:41', status: 'ok' },
          { label: 'Gecikme Uyarısı', value: '1 kaynak', status: 'warning' },
        ].map(({ label, value, status }) => (
          <div key={label} className="rounded-lg p-4" style={{ background: '#fff', border: '1px solid #D8DEE6' }}>
            <div className="text-xs mb-1" style={{ color: '#66717F' }}>{label}</div>
            <div className="text-xl font-bold font-mono" style={{ color: status === 'warning' ? '#D98B18' : '#248A5B' }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
