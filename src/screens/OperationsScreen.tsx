import React, { useState } from 'react';
import { IconX, IconWrench, IconAlert, IconCheck } from '../components/Icons';

type MachineStatus = 'running' | 'setup' | 'maintenance' | 'stopped' | 'breakdown' | 'offline';

const STATUS_CONFIG: Record<MachineStatus, { label: string; bg: string; text: string; dot: string; border: string }> = {
  running:     { label: 'Çalışıyor',     bg: '#EAF5EF', text: '#248A5B', dot: '#248A5B', border: '#248A5B40' },
  setup:       { label: 'Hazırlık',      bg: '#FEF6E7', text: '#D98B18', dot: '#D98B18', border: '#D98B1840' },
  maintenance: { label: 'Bakım',         bg: '#EBF3FC', text: '#3478C7', dot: '#3478C7', border: '#3478C740' },
  stopped:     { label: 'Duruş',         bg: '#F4F6F8', text: '#66717F', dot: '#9FAAB5', border: '#D8DEE6' },
  breakdown:   { label: 'Plansız Arıza', bg: '#FCEAEA', text: '#C83C3C', dot: '#C83C3C', border: '#C83C3C40' },
  offline:     { label: 'Bağlantı Yok',  bg: '#F4F6F8', text: '#9FAAB5', dot: '#D8DEE6', border: '#D8DEE6' },
};

interface MachineData {
  id: string; name: string; status: MachineStatus; oee: number;
  target: number; actual: number; operator: string;
  product: string; workOrder: string; downtime?: string;
}

const AREAS = [
  {
    id: 'mold', name: 'Kalıp Üretimi', color: '#315B7D',
    machines: [
      { id: 'm1', name: 'MOLD-01', status: 'running' as MachineStatus, oee: 81, target: 2400, actual: 1950, operator: 'M. Şahin', product: 'KLP-2201', workOrder: 'WO-2026-1040' },
      { id: 'm2', name: 'MOLD-02', status: 'running' as MachineStatus, oee: 78, target: 2400, actual: 1870, operator: 'H. Demir', product: 'KLP-1987', workOrder: 'WO-2026-1044' },
      { id: 'm3', name: 'MOLD-03', status: 'running' as MachineStatus, oee: 84, target: 2400, actual: 2015, operator: 'A. Çelik', product: 'KLP-2301', workOrder: 'WO-2026-1046' },
      { id: 'm4', name: 'MOLD-04', status: 'setup' as MachineStatus, oee: 0, target: 2400, actual: 0, operator: 'S. Kurt', product: 'KLP-2401', workOrder: 'WO-2026-1051' },
      { id: 'm5', name: 'MOLD-05', status: 'running' as MachineStatus, oee: 76, target: 2400, actual: 1820, operator: 'E. Yılmaz', product: 'KLP-2102', workOrder: 'WO-2026-1039' },
    ]
  },
  {
    id: 'metal', name: 'Metal Üretim', color: '#5B4A2C',
    machines: [
      { id: 'p1', name: 'PRESS-01', status: 'running' as MachineStatus, oee: 79, target: 3600, actual: 2840, operator: 'B. Yıldız', product: 'MTL-0887', workOrder: 'WO-2026-1031' },
      { id: 'p2', name: 'PRESS-02', status: 'running' as MachineStatus, oee: 82, target: 3600, actual: 2950, operator: 'C. Öz', product: 'MTL-1120', workOrder: 'WO-2026-1055' },
      { id: 'p3', name: 'PRESS-03', status: 'running' as MachineStatus, oee: 75, target: 3600, actual: 2700, operator: 'D. Kılıç', product: 'MTL-0654', workOrder: 'WO-2026-1028' },
      { id: 'p4', name: 'PRESS-04', status: 'setup' as MachineStatus, oee: 0, target: 3600, actual: 0, operator: 'F. Arslan', product: 'MTL-0990', workOrder: 'WO-2026-1058' },
      { id: 'p5', name: 'PRESS-05', status: 'running' as MachineStatus, oee: 80, target: 3600, actual: 2880, operator: 'G. Çetin', product: 'MTL-0887', workOrder: 'WO-2026-1048' },
      { id: 'p6', name: 'PRESS-06', status: 'running' as MachineStatus, oee: 83, target: 3600, actual: 2990, operator: 'H. Güler', product: 'MTL-1050', workOrder: 'WO-2026-1042' },
      { id: 'p7', name: 'PRESS-07', status: 'breakdown' as MachineStatus, oee: 0, target: 3600, actual: 0, operator: '—', product: '—', workOrder: '—', downtime: '4s 23dk' },
    ]
  },
  {
    id: 'injection', name: 'Plastik Enjeksiyon', color: '#2C5B4A',
    machines: [
      { id: 'i1', name: 'INJ-01', status: 'running' as MachineStatus, oee: 77, target: 4800, actual: 3700, operator: 'İ. Koca', product: 'PRT-1042', workOrder: 'WO-2026-1048' },
      { id: 'i2', name: 'INJ-02', status: 'running' as MachineStatus, oee: 74, target: 4800, actual: 3560, operator: 'J. Şen', product: 'PRT-0877', workOrder: 'WO-2026-1037' },
      { id: 'i3', name: 'INJ-03', status: 'maintenance' as MachineStatus, oee: 0, target: 4800, actual: 0, operator: 'Bakım', product: '—', workOrder: '—' },
      { id: 'i4', name: 'INJ-04', status: 'stopped' as MachineStatus, oee: 0, target: 4800, actual: 0, operator: '—', product: '—', workOrder: '—' },
    ]
  },
  {
    id: 'assembly', name: 'Montaj', color: '#4A2C5B',
    machines: [
      { id: 'a1', name: 'MONT-01', status: 'running' as MachineStatus, oee: 88, target: 1200, actual: 1060, operator: 'K. Aydın', product: 'ASM-0301', workOrder: 'WO-2026-1033' },
      { id: 'a2', name: 'MONT-02', status: 'running' as MachineStatus, oee: 85, target: 1200, actual: 1020, operator: 'L. Bozkurt', product: 'ASM-0302', workOrder: 'WO-2026-1034' },
    ]
  },
  {
    id: 'quality', name: 'Kalite Kontrol', color: '#4A3E00',
    machines: [
      { id: 'q1', name: 'CMM-01', status: 'running' as MachineStatus, oee: 91, target: 240, actual: 218, operator: 'M. Başaran', product: 'MTL-0887', workOrder: 'WO-2026-1031' },
      { id: 'q2', name: 'CMM-02', status: 'running' as MachineStatus, oee: 89, target: 240, actual: 213, operator: 'N. Erdem', product: 'PRT-1042', workOrder: 'WO-2026-1048' },
    ]
  },
];

const MachineCard = ({ machine, onClick }: { machine: MachineData; onClick: () => void }) => {
  const st = STATUS_CONFIG[machine.status];
  const progressPct = machine.target > 0 ? Math.round((machine.actual / machine.target) * 100) : 0;
  return (
    <button onClick={onClick} className="text-left rounded-lg p-3 transition-all hover:shadow-md hover:-translate-y-px w-full"
      style={{ background: '#fff', border: `1px solid ${st.border}` }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono font-bold" style={{ color: '#17212B' }}>{machine.name}</span>
        <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded" style={{ background: st.bg }}>
          <div className={`w-1.5 h-1.5 rounded-full ${machine.status === 'breakdown' ? 'animate-pulse-critical' : ''}`} style={{ background: st.dot }} />
          <span className="text-xs font-medium" style={{ color: st.text }}>{st.label}</span>
        </div>
      </div>
      {machine.status === 'running' && (
        <>
          <div className="text-xs mb-1 truncate" style={{ color: '#66717F' }}>{machine.product}</div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span style={{ color: '#66717F' }}>OEE</span>
            <span className="font-mono font-semibold" style={{ color: machine.oee >= 80 ? '#248A5B' : machine.oee >= 70 ? '#D98B18' : '#C83C3C' }}>%{machine.oee}</span>
          </div>
          <div className="h-1 rounded-full mb-1.5" style={{ background: '#F4F6F8' }}>
            <div className="h-full rounded-full" style={{
              width: `${progressPct}%`,
              background: progressPct >= 80 ? '#248A5B' : progressPct >= 60 ? '#D98B18' : '#C83C3C'
            }} />
          </div>
          <div className="flex justify-between text-xs font-mono" style={{ color: '#66717F' }}>
            <span>{machine.actual.toLocaleString('tr-TR')}</span>
            <span>{machine.target.toLocaleString('tr-TR')}</span>
          </div>
        </>
      )}
      {machine.status === 'breakdown' && (
        <div className="text-xs font-medium mt-1" style={{ color: '#C83C3C' }}>
          Duruş süresi: {machine.downtime}
        </div>
      )}
      {(machine.status === 'stopped' || machine.status === 'offline') && (
        <div className="text-xs mt-1" style={{ color: '#9FAAB5' }}>Aktif iş yok</div>
      )}
      {machine.status === 'setup' && (
        <div className="text-xs mt-1" style={{ color: '#D98B18' }}>Kalıp takılıyor: {machine.product}</div>
      )}
      {machine.status === 'maintenance' && (
        <div className="text-xs mt-1" style={{ color: '#3478C7' }}>Periyodik bakım</div>
      )}
    </button>
  );
};

const DetailPanel = ({ machine, onClose }: { machine: MachineData; onClose: () => void }) => {
  const st = STATUS_CONFIG[machine.status];
  return (
    <div className="w-80 flex-shrink-0 flex flex-col overflow-y-auto" style={{ background: '#fff', borderLeft: '1px solid #D8DEE6' }}>
      <div className="px-4 py-3 flex items-center justify-between flex-shrink-0" style={{ borderBottom: '1px solid #D8DEE6', background: '#14263D' }}>
        <div>
          <span className="text-white font-bold font-mono">{machine.name}</span>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: st.dot }} />
            <span className="text-xs" style={{ color: '#8FA3B8' }}>{st.label}</span>
          </div>
        </div>
        <button onClick={onClose} className="text-white/60 hover:text-white"><IconX size={16} /></button>
      </div>
      <div className="p-4 space-y-4 flex-1">
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'İş Emri', value: machine.workOrder },
            { label: 'Ürün', value: machine.product },
            { label: 'Operatör', value: machine.operator },
            { label: 'OEE', value: machine.oee > 0 ? `%${machine.oee}` : '—' },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="text-xs mb-0.5" style={{ color: '#66717F' }}>{label}</div>
              <div className="text-sm font-medium font-mono" style={{ color: '#17212B' }}>{value}</div>
            </div>
          ))}
        </div>

        {machine.status === 'running' && (
          <div>
            <div className="text-xs mb-2" style={{ color: '#66717F' }}>Üretim İlerlemesi</div>
            <div className="h-2 rounded-full" style={{ background: '#F4F6F8' }}>
              <div className="h-full rounded-full" style={{
                width: `${Math.round(machine.actual / machine.target * 100)}%`,
                background: '#248A5B'
              }} />
            </div>
            <div className="flex justify-between text-xs font-mono mt-1" style={{ color: '#66717F' }}>
              <span>Gerç: {machine.actual.toLocaleString('tr-TR')}</span>
              <span>Hdf: {machine.target.toLocaleString('tr-TR')}</span>
            </div>
          </div>
        )}

        {/* Event timeline */}
        <div>
          <div className="text-xs font-semibold mb-2" style={{ color: '#17212B' }}>Son Olaylar</div>
          <div className="space-y-2">
            {[
              { time: '08:14', text: 'Kalite alarmı: çap ölçüsü', type: 'warning' },
              { time: '06:30', text: 'Vardiya başladı', type: 'info' },
              { time: '04:12', text: 'Üretim devam ediyor', type: 'ok' },
            ].map((e, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{
                  background: e.type === 'warning' ? '#D98B18' : e.type === 'ok' ? '#248A5B' : '#3478C7'
                }} />
                <div className="flex-1">
                  <div className="text-xs" style={{ color: '#17212B' }}>{e.text}</div>
                  <div className="text-xs font-mono" style={{ color: '#9FAAB5' }}>{e.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-2 border-t" style={{ borderColor: '#D8DEE6' }}>
          <div className="text-xs font-semibold mb-2" style={{ color: '#17212B' }}>Aksiyonlar</div>
          {[
            { label: 'Duruş Bildir', style: { background: '#FCEAEA', color: '#C83C3C' } },
            { label: 'Bakım Talebi Aç', style: { background: '#EBF3FC', color: '#3478C7' } },
            { label: 'Problem Analizi Başlat', style: { background: '#FEF6E7', color: '#D98B18' } },
            { label: 'Alternatif Makine Hesapla', style: { background: '#F4F6F8', color: '#17212B' } },
          ].map(({ label, style }) => (
            <button key={label} className="w-full text-left px-3 py-2 rounded text-xs font-medium transition-opacity hover:opacity-80" style={{ ...style, border: '1px solid transparent' }}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function OperationsScreen() {
  const [selectedMachine, setSelectedMachine] = useState<MachineData | null>(null);

  const allMachines = AREAS.flatMap(a => a.machines);
  const running = allMachines.filter(m => m.status === 'running').length;
  const breakdown = allMachines.filter(m => m.status === 'breakdown').length;

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg font-semibold" style={{ color: '#17212B' }}>Operasyon Merkezi</h1>
            <p className="text-sm" style={{ color: '#66717F' }}>07.09.2026 · Tüm bölümler · Canlı</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm" style={{ color: '#66717F' }}>
              <span className="font-mono font-semibold text-green-600">{running}</span> çalışıyor
              <span className="font-mono font-semibold" style={{ color: '#C83C3C' }}>{breakdown}</span> arıza
              <span className="font-mono font-semibold" style={{ color: '#D98B18' }}>2</span> hazırlık
            </div>
          </div>
        </div>

        {/* Areas */}
        <div className="space-y-5">
          {AREAS.map(area => (
            <div key={area.id} className="rounded-lg overflow-hidden" style={{ border: '1px solid #D8DEE6' }}>
              <div className="px-4 py-2.5 flex items-center gap-3" style={{ background: '#F4F6F8', borderBottom: '1px solid #D8DEE6' }}>
                <div className="w-2 h-2 rounded-full" style={{ background: area.color }} />
                <span className="text-sm font-semibold" style={{ color: '#17212B' }}>{area.name}</span>
                <div className="flex items-center gap-3 ml-auto text-xs" style={{ color: '#66717F' }}>
                  <span>
                    <span className="font-mono font-semibold" style={{ color: '#248A5B' }}>
                      {area.machines.filter(m => m.status === 'running').length}
                    </span>/{area.machines.length} aktif
                  </span>
                  <span>OEE ort.{' '}
                    <span className="font-mono font-semibold" style={{ color: '#D98B18' }}>
                      %{Math.round(area.machines.filter(m => m.oee > 0).reduce((s, m) => s + m.oee, 0) / Math.max(1, area.machines.filter(m => m.oee > 0).length))}
                    </span>
                  </span>
                </div>
              </div>
              <div className="p-3 grid gap-3" style={{ background: '#FAFBFC', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
                {area.machines.map(m => (
                  <MachineCard key={m.id} machine={m}
                    onClick={() => setSelectedMachine(selectedMachine?.id === m.id ? null : m)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail panel */}
      {selectedMachine && (
        <DetailPanel machine={selectedMachine} onClose={() => setSelectedMachine(null)} />
      )}
    </div>
  );
}
