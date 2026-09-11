import React, { useState } from 'react';
import { IconCheck, IconX, IconUser } from '../components/Icons';

const USERS = [
  { id: 1, name: 'Ahmet Kaya', email: 'a.kaya@kahraman.com.tr', dept: 'Üretim', role: 'Üretim Müdürü', lastLogin: '07.09.2026 06:01', status: 'active', canApprove: true, canSuggest: true, financeAccess: false },
  { id: 2, name: 'Fatma Arslan', email: 'f.arslan@kahraman.com.tr', dept: 'Bakım', role: 'Bakım Müdürü', lastLogin: '07.09.2026 06:45', status: 'active', canApprove: true, canSuggest: true, financeAccess: false },
  { id: 3, name: 'Mehmet Başaran', email: 'm.basaran@kahraman.com.tr', dept: 'Kalite', role: 'Kalite Uzmanı', lastLogin: '06.09.2026 14:22', status: 'active', canApprove: false, canSuggest: true, financeAccess: false },
  { id: 4, name: 'Nur Erdem', email: 'n.erdem@kahraman.com.tr', dept: 'Kalite', role: 'Kalite Uzmanı', lastLogin: '07.09.2026 07:10', status: 'active', canApprove: false, canSuggest: true, financeAccess: false },
  { id: 5, name: 'Hasan Demir', email: 'h.demir@kahraman.com.tr', dept: 'Planlama', role: 'Üretim Planlama Uzmanı', lastLogin: '07.09.2026 07:55', status: 'active', canApprove: false, canSuggest: true, financeAccess: false },
  { id: 6, name: 'Sistem Yöneticisi', email: 'sysadmin@kahraman.com.tr', dept: 'BT', role: 'Sistem Yöneticisi', lastLogin: '05.09.2026 22:00', status: 'active', canApprove: true, canSuggest: true, financeAccess: true },
];

const Tick = ({ v }: { v: boolean }) => (
  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full" style={{ background: v ? '#EAF5EF' : '#F4F6F8' }}>
    {v ? <IconCheck size={10} style={{ color: '#248A5B' }} /> : <IconX size={10} style={{ color: '#9FAAB5' }} />}
  </span>
);

export default function AdminUsersScreen() {
  const [selectedUser, setSelectedUser] = useState(USERS[0]);

  return (
    <div className="flex h-full overflow-hidden p-5 gap-5">
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold" style={{ color: '#17212B' }}>Kullanıcılar & Roller</h1>
          <button className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: '#14263D', color: '#fff' }}>Yeni Kullanıcı</button>
        </div>

        <div className="rounded-lg overflow-hidden" style={{ border: '1px solid #D8DEE6' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#F4F6F8', borderBottom: '2px solid #D8DEE6' }}>
                {['Ad Soyad', 'Departman', 'Rol', 'Son Giriş', 'Durum', 'Öneri', 'Onay', 'Finans'].map(h => (
                  <th key={h} className="text-left px-3 py-2.5 text-xs font-semibold" style={{ color: '#66717F' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {USERS.map(u => (
                <tr key={u.id} onClick={() => setSelectedUser(u)}
                  className="cursor-pointer hover:bg-blue-50 transition-colors"
                  style={{ borderBottom: '1px solid #F4F6F8', background: selectedUser.id === u.id ? '#F0F7FF' : '#fff' }}>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: '#315B7D' }}>
                        {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-medium text-sm" style={{ color: '#17212B' }}>{u.name}</div>
                        <div className="text-xs" style={{ color: '#66717F' }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-xs" style={{ color: '#17212B' }}>{u.dept}</td>
                  <td className="px-3 py-3 text-xs" style={{ color: '#17212B' }}>{u.role}</td>
                  <td className="px-3 py-3 text-xs font-mono" style={{ color: '#66717F' }}>{u.lastLogin}</td>
                  <td className="px-3 py-3">
                    <span className="text-xs px-2 py-0.5 rounded" style={{ background: '#EAF5EF', color: '#248A5B' }}>Aktif</span>
                  </td>
                  <td className="px-3 py-3"><Tick v={u.canSuggest} /></td>
                  <td className="px-3 py-3"><Tick v={u.canApprove} /></td>
                  <td className="px-3 py-3"><Tick v={u.financeAccess} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User detail */}
      <div className="w-72 flex-shrink-0" style={{ background: '#fff', border: '1px solid #D8DEE6', borderRadius: 8 }}>
        <div className="px-4 py-3" style={{ borderBottom: '1px solid #D8DEE6', background: '#14263D', borderRadius: '8px 8px 0 0' }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2" style={{ background: '#F28C28' }}>
            {selectedUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="text-center text-white font-semibold text-sm">{selectedUser.name}</div>
          <div className="text-center text-xs mt-0.5" style={{ color: '#8FA3B8' }}>{selectedUser.role}</div>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: '#66717F' }}>Bilgiler</div>
            {[
              { label: 'Departman', value: selectedUser.dept },
              { label: 'E-posta', value: selectedUser.email },
              { label: 'Son Giriş', value: selectedUser.lastLogin },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-1.5" style={{ borderBottom: '1px solid #F4F6F8' }}>
                <span className="text-xs" style={{ color: '#66717F' }}>{label}</span>
                <span className="text-xs font-medium" style={{ color: '#17212B' }}>{value}</span>
              </div>
            ))}
          </div>
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: '#66717F' }}>Yetkiler</div>
            {[
              { label: 'Aksiyon Önerme', v: selectedUser.canSuggest },
              { label: 'Aksiyon Onaylama', v: selectedUser.canApprove },
              { label: 'Finansal Veriler', v: selectedUser.financeAccess },
              { label: 'Tüm Müşteriler', v: true },
              { label: 'Yönetim Paneli', v: selectedUser.role === 'Sistem Yöneticisi' },
            ].map(({ label, v }) => (
              <div key={label} className="flex items-center justify-between py-1.5" style={{ borderBottom: '1px solid #F4F6F8' }}>
                <span className="text-xs" style={{ color: '#17212B' }}>{label}</span>
                <Tick v={v} />
              </div>
            ))}
          </div>
          <button className="w-full py-2 rounded text-xs font-medium" style={{ background: '#EBF3FC', color: '#3478C7' }}>Yetkileri Düzenle</button>
        </div>
      </div>
    </div>
  );
}
