import React, { useState } from 'react';
import { IconWrench, IconAlert, IconCheck, IconX, IconSearch, IconFilter } from '../components/Icons';

type MachineStatus = 'running' | 'setup' | 'maintenance' | 'stopped' | 'breakdown' | 'offline';

const STATUS_CFG: Record<MachineStatus, { label: string; bg: string; text: string; dot: string; border: string; icon: string }> = {
  running:     { label: 'Çalışıyor',     bg: '#EAF5EF', text: '#248A5B', dot: '#248A5B', border: '#248A5B30', icon: '▶' },
  setup:       { label: 'Hazırlık',      bg: '#FEF6E7', text: '#D98B18', dot: '#D98B18', border: '#D98B1830', icon: '⚙' },
  maintenance: { label: 'Bakım',         bg: '#EBF3FC', text: '#3478C7', dot: '#3478C7', border: '#3478C730', icon: '🔧' },
  stopped:     { label: 'Duruş',         bg: '#F4F6F8', text: '#66717F', dot: '#9FAAB5', border: '#D8DEE6',   icon: '⏸' },
  breakdown:   { label: 'Plansız Arıza', bg: '#FCEAEA', text: '#C83C3C', dot: '#C83C3C', border: '#C83C3C40', icon: '⚠' },
  offline:     { label: 'Bağlantı Yok', bg: '#F4F6F8', text: '#9FAAB5', dot: '#D8DEE6', border: '#D8DEE6',   icon: '○' },
};

interface Machine {
  id: string; name: string; type: string; area: string; status: MachineStatus;
  oee: number; target: number; actual: number; operator: string; workOrder: string;
  product: string; mold: string; cycleTime: number; shift: string;
  lastMaintenance: string; nextMaintenance: string; downtimeToday: number;
  alarms: string[];
}

const MACHINES: Machine[] = [
  { id: 'P01', name: 'PRESS-01', type: 'Pres', area: 'Metal Üretim', status: 'running', oee: 79, target: 3600, actual: 2842, operator: 'B. Yıldız', workOrder: 'WO-2026-1031', product: 'MTL-0887', mold: 'MLD-0887A', cycleTime: 4.2, shift: '2. Vardiya', lastMaintenance: '15.08.2026', nextMaintenance: '15.11.2026', downtimeToday: 0, alarms: [] },
  { id: 'P02', name: 'PRESS-02', type: 'Pres', area: 'Metal Üretim', status: 'running', oee: 82, target: 3600, actual: 2952, operator: 'C. Öz', workOrder: 'WO-2026-1055', product: 'MTL-1120', mold: 'MLD-1120B', cycleTime: 3.8, shift: '2. Vardiya', lastMaintenance: '20.08.2026', nextMaintenance: '20.11.2026', downtimeToday: 0, alarms: [] },
  { id: 'P03', name: 'PRESS-03', type: 'Pres', area: 'Metal Üretim', status: 'running', oee: 75, target: 3600, actual: 2700, operator: 'D. Kılıç', workOrder: 'WO-2026-1028', product: 'MTL-0654', mold: 'MLD-0654C', cycleTime: 4.5, shift: '2. Vardiya', lastMaintenance: '10.08.2026', nextMaintenance: '10.11.2026', downtimeToday: 12, alarms: ['Pres kuvveti nominal altı'] },
  { id: 'P04', name: 'PRESS-04', type: 'Pres', area: 'Metal Üretim', status: 'setup', oee: 0, target: 3600, actual: 0, operator: 'F. Arslan', workOrder: 'WO-2026-1058', product: 'MTL-0990', mold: 'MLD-0990D', cycleTime: 5.1, shift: '2. Vardiya', lastMaintenance: '05.08.2026', nextMaintenance: '05.11.2026', downtimeToday: 45, alarms: [] },
  { id: 'P05', name: 'PRESS-05', type: 'Pres', area: 'Metal Üretim', status: 'running', oee: 80, target: 3600, actual: 2880, operator: 'G. Çetin', workOrder: 'WO-2026-1048', product: 'PRT-1042', mold: 'MLD-2201', cycleTime: 18, shift: '2. Vardiya', lastMaintenance: '25.08.2026', nextMaintenance: '25.11.2026', downtimeToday: 0, alarms: [] },
  { id: 'P06', name: 'PRESS-06', type: 'Pres', area: 'Metal Üretim', status: 'running', oee: 83, target: 3600, actual: 2988, operator: 'H. Güler', workOrder: 'WO-2026-1042', product: 'MTL-1050', mold: 'MLD-1050E', cycleTime: 3.9, shift: '2. Vardiya', lastMaintenance: '28.08.2026', nextMaintenance: '28.11.2026', downtimeToday: 0, alarms: [] },
  { id: 'P07', name: 'PRESS-07', type: 'Pres', area: 'Metal Üretim', status: 'breakdown', oee: 0, target: 3600, actual: 0, operator: '—', workOrder: '—', product: '—', mold: '—', cycleTime: 0, shift: '—', lastMaintenance: '01.07.2026', nextMaintenance: 'Arıza sonrası', downtimeToday: 263, alarms: ['Hidrolik basınç kaybı', 'Plansız duruş 4s 23dk'] },
  { id: 'I01', name: 'INJ-01', type: 'Enjeksiyon', area: 'Plastik Enjeksiyon', status: 'running', oee: 77, target: 4800, actual: 3696, operator: 'İ. Koca', workOrder: 'WO-2026-1048', product: 'PRT-1042', mold: 'MLD-2201', cycleTime: 18, shift: '2. Vardiya', lastMaintenance: '12.08.2026', nextMaintenance: '12.11.2026', downtimeToday: 20, alarms: [] },
  { id: 'I02', name: 'INJ-02', type: 'Enjeksiyon', area: 'Plastik Enjeksiyon', status: 'running', oee: 74, target: 4800, actual: 3552, operator: 'J. Şen', workOrder: 'WO-2026-1037', product: 'PRT-0877', mold: 'MLD-0877F', cycleTime: 22, shift: '2. Vardiya', lastMaintenance: '08.08.2026', nextMaintenance: '08.11.2026', downtimeToday: 35, alarms: ['Fire oranı %3,2 — limit aşıldı'] },
  { id: 'I03', name: 'INJ-03', type: 'Enjeksiyon', area: 'Plastik Enjeksiyon', status: 'maintenance', oee: 0, target: 4800, actual: 0, operator: 'Bakım', workOrder: '—', product: '—', mold: '—', cycleTime: 0, shift: '—', lastMaintenance: '07.09.2026', nextMaintenance: '11.09.2026', downtimeToday: 480, alarms: [] },
  { id: 'I04', name: 'INJ-04', type: 'Enjeksiyon', area: 'Plastik Enjeksiyon', status: 'stopped', oee: 0, target: 4800, actual: 0, operator: '—', workOrder: '—', product: '—', mold: '—', cycleTime: 0, shift: '—', lastMaintenance: '20.07.2026', nextMaintenance: '20.10.2026', downtimeToday: 480, alarms: [] },
  { id: 'M01', name: 'MOLD-01', type: 'Tezgâh', area: 'Kalıp Üretimi', status: 'running', oee: 81, target: 2400, actual: 1944, operator: 'M. Şahin', workOrder: 'WO-2026-1040', product: 'KLP-2201', mold: '—', cycleTime: 0, shift: '2. Vardiya', lastMaintenance: '10.09.2026', nextMaintenance: '10.12.2026', downtimeToday: 0, alarms: [] },
  { id: 'M02', name: 'MOLD-02', type: 'Tezgâh', area: 'Kalıp Üretimi', status: 'running', oee: 78, target: 2400, actual: 1872, operator: 'H. Demir', workOrder: 'WO-2026-1044', product: 'KLP-1987', mold: '—', cycleTime: 0, shift: '2. Vardiya', lastMaintenance: '05.09.2026', nextMaintenance: '05.12.2026', downtimeToday: 0, alarms: [] },
  { id: 'C01', name: 'CNC-01', type: 'CNC', area: 'Kalıp Üretimi', status: 'running', oee: 85, target: 2000, actual: 1700, operator: 'A. Çelik', workOrder: 'WO-2026-1046', product: 'KLP-2301', mold: '—', cycleTime: 0, shift: '2. Vardiya', lastMaintenance: '01.09.2026', nextMaintenance: '01.12.2026', downtimeToday: 0, alarms: [] },
  { id: 'A01', name: 'MONT-01', type: 'Montaj', area: 'Montaj', status: 'running', oee: 88, target: 1200, actual: 1056, operator: 'K. Aydın', workOrder: 'WO-2026-1033', product: 'ASM-0301', mold: '—', cycleTime: 0, shift: '2. Vardiya', lastMaintenance: '15.08.2026', nextMaintenance: '15.11.2026', downtimeToday: 0, alarms: [] },
];

const OEESparkline = ({ value }: { value: number }) => {
  if (value === 0) return <span className="text-xs" style={{ color: '#9FAAB5' }}>—</span>;
  const color = value >= 80 ? '#248A5B' : value >= 70 ? '#D98B18' : '#C83C3C';
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 rounded-full flex-1" style={{ background: '#F4F6F8', maxWidth: 60 }}>
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="font-mono font-semibold text-xs" style={{ color }}>%{value}</span>
    </div>
  );
};

export default function MachinesScreen({ onSelectMachine }: { onSelectMachine: (id: string) => void }) {
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [areaFilter, setAreaFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'oee' | 'status'>('name');

  const areas = ['all', ...Array.from(new Set(MACHINES.map(m => m.area)))];
  const statuses = ['all', 'running', 'breakdown', 'maintenance', 'setup', 'stopped'];

  const filtered = MACHINES
    .filter(m => {
      const matchSearch = !filter || m.name.toLowerCase().includes(filter.toLowerCase()) || m.workOrder.toLowerCase().includes(filter.toLowerCase()) || m.product.toLowerCase().includes(filter.toLowerCase());
      const matchStatus = statusFilter === 'all' || m.status === statusFilter;
      const matchArea = areaFilter === 'all' || m.area === areaFilter;
      return matchSearch && matchStatus && matchArea;
    })
    .sort((a, b) => {
      if (sortBy === 'oee') return b.oee - a.oee;
      if (sortBy === 'status') return a.status.localeCompare(b.status);
      return a.name.localeCompare(b.name);
    });

  const running = MACHINES.filter(m => m.status === 'running').length;
  const breakdown = MACHINES.filter(m => m.status === 'breakdown').length;
  const maintenance = MACHINES.filter(m => m.status === 'maintenance').length;
  const avgOEE = Math.round(MACHINES.filter(m => m.oee > 0).reduce((s, m) => s + m.oee, 0) / MACHINES.filter(m => m.oee > 0).length);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 flex items-center gap-4 flex-shrink-0" style={{ background: '#fff', borderBottom: '1px solid #D8DEE6' }}>
        <div>
          <h1 className="text-lg font-semibold" style={{ color: '#17212B' }}>Makineler</h1>
          <p className="text-sm" style={{ color: '#66717F' }}>{MACHINES.length} makine · Gerçek zamanlı</p>
        </div>

        {/* Summary pills */}
        <div className="flex items-center gap-2 ml-4">
          {[
            { label: 'Çalışıyor', value: running, style: { bg: '#EAF5EF', text: '#248A5B' } },
            { label: 'Arıza', value: breakdown, style: { bg: '#FCEAEA', text: '#C83C3C' } },
            { label: 'Bakım', value: maintenance, style: { bg: '#EBF3FC', text: '#3478C7' } },
            { label: 'Ort. OEE', value: `%${avgOEE}`, style: { bg: '#FEF6E7', text: '#D98B18' } },
          ].map(({ label, value, style }) => (
            <div key={label} className="flex items-center gap-2 px-3 py-1.5 rounded" style={{ background: style.bg }}>
              <span className="font-mono font-bold text-sm" style={{ color: style.text }}>{value}</span>
              <span className="text-xs" style={{ color: style.text }}>{label}</span>
            </div>
          ))}
        </div>

        <div className="flex-1" />

        {/* Filters */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded" style={{ background: '#F4F6F8', border: '1px solid #D8DEE6' }}>
          <IconSearch size={13} style={{ color: '#66717F' }} />
          <input type="text" placeholder="Makine, iş emri, ürün..." value={filter} onChange={e => setFilter(e.target.value)}
            className="outline-none text-xs bg-transparent" style={{ color: '#17212B', width: 180 }} />
        </div>

        <select value={areaFilter} onChange={e => setAreaFilter(e.target.value)}
          className="px-3 py-1.5 rounded text-xs outline-none" style={{ background: '#fff', border: '1px solid #D8DEE6', color: '#17212B' }}>
          <option value="all">Tüm Alanlar</option>
          {areas.slice(1).map(a => <option key={a} value={a}>{a}</option>)}
        </select>

        <div className="flex rounded overflow-hidden" style={{ border: '1px solid #D8DEE6' }}>
          {statuses.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className="px-2.5 py-1.5 text-xs transition-colors"
              style={{
                background: statusFilter === s ? '#14263D' : '#fff',
                color: statusFilter === s ? '#fff' : '#66717F',
                borderRight: '1px solid #D8DEE6',
              }}>
              {s === 'all' ? 'Tümü' : STATUS_CFG[s as MachineStatus].label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
          <thead className="sticky top-0 z-10">
            <tr style={{ background: '#F4F6F8', borderBottom: '2px solid #D8DEE6' }}>
              {[
                { key: 'name', label: 'Makine' },
                { key: null, label: 'Alan' },
                { key: 'status', label: 'Durum' },
                { key: null, label: 'İş Emri / Ürün' },
                { key: null, label: 'Operatör' },
                { key: 'oee', label: 'OEE' },
                { key: null, label: 'Hedef / Gerçek' },
                { key: null, label: 'Duruş (dk)' },
                { key: null, label: 'Alarmlar' },
                { key: null, label: '' },
              ].map(({ key, label }) => (
                <th key={label} className="text-left px-4 py-2.5 text-xs font-semibold whitespace-nowrap" style={{ color: '#66717F' }}>
                  {key ? (
                    <button onClick={() => setSortBy(key as any)} className="flex items-center gap-1 hover:text-blue-600">
                      {label} {sortBy === key && '↕'}
                    </button>
                  ) : label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((m, i) => {
              const st = STATUS_CFG[m.status];
              const progressPct = m.target > 0 ? Math.round((m.actual / m.target) * 100) : 0;
              return (
                <tr key={m.id}
                  className="cursor-pointer transition-colors hover:bg-blue-50"
                  style={{ borderBottom: '1px solid #F4F6F8', background: i % 2 === 0 ? '#fff' : '#FAFBFC' }}
                  onClick={() => onSelectMachine(m.id)}>
                  {/* Name */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {m.status === 'breakdown' && <div className="w-2 h-2 rounded-full animate-pulse-critical flex-shrink-0" style={{ background: '#C83C3C' }} />}
                      <span className="font-mono font-bold" style={{ color: '#17212B' }}>{m.name}</span>
                      <span className="text-xs" style={{ color: '#9FAAB5' }}>{m.type}</span>
                    </div>
                  </td>
                  {/* Area */}
                  <td className="px-4 py-3 text-xs" style={{ color: '#66717F' }}>{m.area}</td>
                  {/* Status */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded w-fit" style={{ background: st.bg }}>
                      <div className={`w-1.5 h-1.5 rounded-full ${m.status === 'breakdown' ? 'animate-pulse-critical' : ''}`} style={{ background: st.dot }} />
                      <span className="text-xs font-medium" style={{ color: st.text }}>{st.label}</span>
                    </div>
                  </td>
                  {/* Work order / Product */}
                  <td className="px-4 py-3">
                    {m.workOrder !== '—' ? (
                      <div>
                        <div className="text-xs font-mono font-semibold" style={{ color: '#315B7D' }}>{m.workOrder}</div>
                        <div className="text-xs" style={{ color: '#66717F' }}>{m.product}</div>
                      </div>
                    ) : <span className="text-xs" style={{ color: '#9FAAB5' }}>—</span>}
                  </td>
                  {/* Operator */}
                  <td className="px-4 py-3 text-xs" style={{ color: '#17212B' }}>{m.operator}</td>
                  {/* OEE */}
                  <td className="px-4 py-3" style={{ minWidth: 120 }}><OEESparkline value={m.oee} /></td>
                  {/* Target / Actual */}
                  <td className="px-4 py-3">
                    {m.target > 0 ? (
                      <div>
                        <div className="flex items-center gap-1 text-xs font-mono">
                          <span style={{ color: '#17212B' }}>{m.actual.toLocaleString('tr-TR')}</span>
                          <span style={{ color: '#9FAAB5' }}>/</span>
                          <span style={{ color: '#66717F' }}>{m.target.toLocaleString('tr-TR')}</span>
                        </div>
                        <div className="h-1 rounded-full mt-1" style={{ background: '#F4F6F8', width: 80 }}>
                          <div className="h-full rounded-full" style={{ width: `${progressPct}%`, background: progressPct >= 80 ? '#248A5B' : '#D98B18' }} />
                        </div>
                      </div>
                    ) : <span className="text-xs" style={{ color: '#9FAAB5' }}>—</span>}
                  </td>
                  {/* Downtime */}
                  <td className="px-4 py-3">
                    {m.downtimeToday > 0 ? (
                      <span className="font-mono text-xs font-semibold" style={{ color: m.downtimeToday > 60 ? '#C83C3C' : '#D98B18' }}>
                        {m.downtimeToday} dk
                      </span>
                    ) : <span className="text-xs" style={{ color: '#9FAAB5' }}>0</span>}
                  </td>
                  {/* Alarms */}
                  <td className="px-4 py-3">
                    {m.alarms.length > 0 ? (
                      <div className="flex flex-col gap-0.5">
                        {m.alarms.map((a, ai) => (
                          <span key={ai} className="text-xs px-1.5 py-0.5 rounded" style={{ background: '#FEF6E7', color: '#D98B18' }}>{a}</span>
                        ))}
                      </div>
                    ) : <span className="text-xs" style={{ color: '#9FAAB5' }}>—</span>}
                  </td>
                  {/* Action */}
                  <td className="px-4 py-3">
                    <button className="text-xs px-2 py-1 rounded hover:bg-blue-100" style={{ color: '#3478C7' }}>Detay →</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer summary */}
      <div className="px-4 py-2 flex items-center justify-between text-xs flex-shrink-0" style={{ background: '#F4F6F8', borderTop: '1px solid #D8DEE6', color: '#66717F' }}>
        <span>{filtered.length} / {MACHINES.length} makine gösteriliyor</span>
        <span>Son güncelleme: 07.09.2026 08:41 · Otomatik yenileme 30 sn</span>
      </div>
    </div>
  );
}
