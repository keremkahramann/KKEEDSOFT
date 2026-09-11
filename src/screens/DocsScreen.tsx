import React, { useState } from 'react';
import { IconSearch, IconFilter, IconDownload, IconEye } from '../components/Icons';

const DOCS = [
  { id: 'DOC-2024-0041', title: 'PRT-1042 Üretim Talimatı', dept: 'Üretim', rev: 'Rev.C', date: '01.08.2026', owner: 'M. Şahin', status: 'active', sensitivity: 'Dahili' },
  { id: 'DOC-2024-0039', title: 'MLD-2201 Kalıp Bakım Prosedürü', dept: 'Bakım', rev: 'Rev.B', date: '15.06.2026', owner: 'F. Arslan', status: 'active', sensitivity: 'Dahili' },
  { id: 'DOC-2024-0037', title: 'Enjeksiyon Parametreleri Kılavuzu', dept: 'Ar-Ge', rev: 'Rev.D', date: '10.04.2026', owner: 'A. Çelik', status: 'active', sensitivity: 'Gizli' },
  { id: 'DOC-2024-0035', title: 'PRT-1042 Müşteri Teknik Şartnamesi', dept: 'Kalite', rev: 'Rev.A', date: '03.01.2026', owner: 'N. Erdem', status: 'active', sensitivity: 'Müşteri Gizli' },
  { id: 'DOC-2023-0028', title: 'Arçelik Özel Ambalaj Talimatı', dept: 'Lojistik', rev: 'Rev.B', date: '15.09.2025', owner: 'K. Aydın', status: 'active', sensitivity: 'Müşteri Gizli' },
  { id: 'DOC-2023-0019', title: 'PRT-1042 Eski Üretim Talimatı', dept: 'Üretim', rev: 'Rev.B', date: '20.03.2025', owner: 'M. Şahin', status: 'obsolete', sensitivity: 'Dahili' },
  { id: 'PRB-2025-0187', title: 'Problem Vakası: Kalıp Aşınması PRT-1042', dept: 'Kalite', rev: '—', date: '14.03.2025', owner: 'M. Başaran', status: 'closed', sensitivity: 'Dahili' },
];

export default function DocsScreen() {
  const [filter, setFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('Tümü');

  const depts = ['Tümü', 'Üretim', 'Kalite', 'Bakım', 'Ar-Ge', 'Lojistik'];
  const filtered = DOCS.filter(d => {
    const matchDept = deptFilter === 'Tümü' || d.dept === deptFilter;
    const matchSearch = !filter || d.title.toLowerCase().includes(filter.toLowerCase()) || d.id.toLowerCase().includes(filter.toLowerCase());
    return matchDept && matchSearch;
  });

  return (
    <div className="p-5 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div>
          <h1 className="text-lg font-semibold" style={{ color: '#17212B' }}>Doküman & Bilgi Tabanı</h1>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2 px-3 py-1.5 rounded" style={{ background: '#fff', border: '1px solid #D8DEE6' }}>
          <IconSearch size={13} style={{ color: '#66717F' }} />
          <input type="text" placeholder="Doküman ara..." value={filter} onChange={e => setFilter(e.target.value)}
            className="outline-none text-xs bg-transparent" style={{ color: '#17212B', width: 200 }} />
        </div>
        <div className="flex gap-1">
          {depts.map(d => (
            <button key={d} onClick={() => setDeptFilter(d)} className="px-2.5 py-1.5 rounded text-xs"
              style={{ background: deptFilter === d ? '#14263D' : '#fff', color: deptFilter === d ? '#fff' : '#66717F', border: '1px solid #D8DEE6' }}>
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto rounded-lg" style={{ border: '1px solid #D8DEE6' }}>
        <table className="w-full text-sm">
          <thead className="sticky top-0">
            <tr style={{ background: '#F4F6F8', borderBottom: '2px solid #D8DEE6' }}>
              {['Doküman No', 'Başlık', 'Departman', 'Revizyon', 'Yürürlük Tarihi', 'Sahibi', 'Durum', 'Gizlilik', ''].map(h => (
                <th key={h} className="text-left px-3 py-2.5 text-xs font-semibold whitespace-nowrap" style={{ color: '#66717F' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((doc, i) => (
              <tr key={doc.id} className="hover:bg-gray-50 transition-colors" style={{ borderBottom: '1px solid #F4F6F8', background: '#fff', opacity: doc.status === 'obsolete' ? 0.7 : 1 }}>
                <td className="px-3 py-3 font-mono text-xs font-semibold" style={{ color: '#315B7D' }}>{doc.id}</td>
                <td className="px-3 py-3" style={{ color: '#17212B' }}>
                  <div className="font-medium">{doc.title}</div>
                  {doc.status === 'obsolete' && (
                    <div className="text-xs px-1.5 py-0.5 rounded mt-0.5 inline-block" style={{ background: '#FCEAEA', color: '#C83C3C' }}>Yürürlük Dışı</div>
                  )}
                </td>
                <td className="px-3 py-3 text-xs" style={{ color: '#66717F' }}>{doc.dept}</td>
                <td className="px-3 py-3 font-mono text-xs" style={{ color: '#17212B' }}>{doc.rev}</td>
                <td className="px-3 py-3 text-xs" style={{ color: '#17212B' }}>{doc.date}</td>
                <td className="px-3 py-3 text-xs" style={{ color: '#17212B' }}>{doc.owner}</td>
                <td className="px-3 py-3">
                  <span className="text-xs px-2 py-0.5 rounded" style={{
                    background: doc.status === 'active' ? '#EAF5EF' : doc.status === 'obsolete' ? '#FCEAEA' : '#F4F6F8',
                    color: doc.status === 'active' ? '#248A5B' : doc.status === 'obsolete' ? '#C83C3C' : '#66717F'
                  }}>
                    {doc.status === 'active' ? 'Geçerli' : doc.status === 'obsolete' ? 'Yürürlük Dışı' : 'Kapalı'}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span className="text-xs px-2 py-0.5 rounded" style={{
                    background: doc.sensitivity === 'Gizli' || doc.sensitivity === 'Müşteri Gizli' ? '#FCEAEA' : '#F4F6F8',
                    color: doc.sensitivity === 'Gizli' || doc.sensitivity === 'Müşteri Gizli' ? '#C83C3C' : '#66717F'
                  }}>
                    {doc.sensitivity}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <div className="flex gap-1">
                    <button className="p-1.5 rounded hover:bg-gray-100" style={{ color: '#315B7D' }}><IconEye size={13} /></button>
                    <button className="p-1.5 rounded hover:bg-gray-100" style={{ color: '#315B7D' }}><IconDownload size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
