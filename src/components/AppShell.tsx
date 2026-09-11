import React, { useState } from 'react';
import {
  IconDashboard, IconChat, IconFactory, IconCalendar, IconMachine,
  IconWork, IconAlert, IconQuality, IconCost, IconActions, IconDocs,
  IconReport, IconAdmin, IconChevronRight, IconChevronDown, IconBell,
  IconSearch, IconUser, IconServer, IconSync, IconMenuCollapse, IconX,
  IconInfo, IconRefresh
} from './Icons';
import NotificationPanel from './NotificationPanel';

const NAV_ITEMS = [
  { id: 'dashboard',   label: 'Genel Bakış',       icon: IconDashboard },
  { id: 'chat',        label: 'İkize Sor',          icon: IconChat,    badge: 0 },
  { id: 'operations',  label: 'Operasyon Merkezi',  icon: IconFactory },
  { id: 'planning',    label: 'Üretim Planlama',    icon: IconCalendar },
  { id: 'machines',    label: 'Makineler',          icon: IconMachine },
  { id: 'workorders',  label: 'İş Emirleri',        icon: IconWork },
  { id: 'problems',    label: 'Problem Çözme',      icon: IconAlert,   badge: 3 },
  { id: 'quality',     label: 'Kalite',             icon: IconQuality },
  { id: 'cost',        label: 'Maliyet & Termin',   icon: IconCost },
  { id: 'actions',     label: 'Aksiyonlar',         icon: IconActions, badge: 6 },
  { id: 'docs',        label: 'Dokümanlar',         icon: IconDocs },
  { id: 'reports',     label: 'Raporlar',           icon: IconReport },
];

const ADMIN_ITEMS = [
  { id: 'admin-datasources', label: 'Veri Kaynakları',   icon: IconServer },
  { id: 'admin-users',       label: 'Kullanıcılar & Roller', icon: IconUser },
  { id: 'architecture',      label: 'Mimari Diyagramlar', icon: IconInfo },
  { id: 'admin-audit',       label: 'Denetim Kayıtları', icon: IconDocs },
];

type ServerStatus = 'online' | 'slow' | 'offline';

interface AppShellProps {
  currentScreen: string;
  onNavigate: (id: string) => void;
  children: React.ReactNode;
  serverStatus?: ServerStatus;
}

export default function AppShell({ currentScreen, onNavigate, children, serverStatus = 'online' }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [adminOpen, setAdminOpen] = useState(currentScreen.startsWith('admin') || currentScreen === 'architecture');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const STATUS_CFG: Record<ServerStatus, { bg: string; text: string; label: string; dot: string }> = {
    online:  { bg: '#EAF5EF', text: '#248A5B', label: 'Çevrimiçi', dot: '#248A5B' },
    slow:    { bg: '#FEF6E7', text: '#D98B18', label: 'Yavaş',     dot: '#D98B18' },
    offline: { bg: '#FCEAEA', text: '#C83C3C', label: 'Çevrimdışı', dot: '#C83C3C' },
  };
  const st = STATUS_CFG[serverStatus];

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#F4F6F8' }}>
      {/* Sidebar */}
      <aside className="flex flex-col flex-shrink-0 transition-all duration-200" style={{
        width: collapsed ? 52 : 220,
        background: '#0F1E30',
        borderRight: '1px solid rgba(255,255,255,0.05)',
      }}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-3.5 py-3.5 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', minHeight: 56 }}>
          <div className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0" style={{ background: '#F28C28' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="5.2" height="5.2" rx="0.6" fill="white"/>
              <rect x="7.8" y="1" width="5.2" height="5.2" rx="0.6" fill="white" opacity="0.5"/>
              <rect x="1" y="7.8" width="5.2" height="5.2" rx="0.6" fill="white" opacity="0.5"/>
              <rect x="7.8" y="7.8" width="5.2" height="5.2" rx="0.6" fill="white"/>
            </svg>
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <div className="text-white font-bold text-xs tracking-widest whitespace-nowrap" style={{ letterSpacing: '0.1em' }}>KAHRAMAN TWIN</div>
              <div className="text-xs whitespace-nowrap" style={{ color: '#4D6175', fontSize: 10, letterSpacing: '0.06em' }}>Digital Twin v2.4.1</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto scrollbar-hide py-2">
          {NAV_ITEMS.map(({ id, label, icon: Icon, badge }) => {
            const active = currentScreen === id || (currentScreen === 'machine-detail' && id === 'machines');
            return (
              <button key={id} onClick={() => onNavigate(id)}
                className="w-full flex items-center gap-2.5 transition-all relative group"
                style={{
                  padding: collapsed ? '8px 14px' : '8px 12px',
                  background: active ? 'rgba(242,140,40,0.1)' : 'transparent',
                  borderLeft: `3px solid ${active ? '#F28C28' : 'transparent'}`,
                }}
                title={collapsed ? label : undefined}>
                <Icon size={15} className="flex-shrink-0" style={{ color: active ? '#F28C28' : '#5A7287' }} />
                {!collapsed && (
                  <span className="flex-1 text-left text-xs truncate" style={{ color: active ? '#F28C28' : '#A0B4C5' }}>{label}</span>
                )}
                {!collapsed && badge && badge > 0 ? (
                  <span className="text-xs px-1.5 py-0.5 rounded-full font-bold" style={{ background: '#F28C28', color: '#fff', fontSize: 9, minWidth: 16, textAlign: 'center' }}>{badge}</span>
                ) : null}
                {collapsed && badge && badge > 0 ? (
                  <div className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: '#F28C28' }} />
                ) : null}
              </button>
            );
          })}

          {/* Admin section */}
          <div className="mt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 8 }}>
            <button onClick={() => !collapsed && setAdminOpen(!adminOpen)}
              className="w-full flex items-center gap-2.5 transition-all"
              style={{ padding: collapsed ? '8px 14px' : '8px 12px' }}>
              <IconAdmin size={15} className="flex-shrink-0" style={{ color: '#4D6175' }} />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left text-xs" style={{ color: '#5A7287' }}>Yönetim</span>
                  {adminOpen ? <IconChevronDown size={12} style={{ color: '#4D6175' }} /> : <IconChevronRight size={12} style={{ color: '#4D6175' }} />}
                </>
              )}
            </button>
            {adminOpen && !collapsed && ADMIN_ITEMS.map(({ id, label, icon: Icon }) => {
              const active = currentScreen === id;
              return (
                <button key={id} onClick={() => onNavigate(id)}
                  className="w-full flex items-center gap-2.5 transition-all"
                  style={{ padding: '7px 12px 7px 32px', background: active ? 'rgba(242,140,40,0.08)' : 'transparent', borderLeft: `3px solid ${active ? '#F28C28' : 'transparent'}` }}>
                  <Icon size={13} style={{ color: active ? '#F28C28' : '#4D6175' }} />
                  <span className="text-xs" style={{ color: active ? '#F28C28' : '#7A8F9C' }}>{label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Collapse toggle */}
        <div className="p-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center py-2 rounded transition-colors hover:bg-white/5"
            style={{ color: '#3A4F60' }}>
            <IconMenuCollapse size={14} />
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Offline banner */}
        {serverStatus === 'offline' && (
          <div className="flex items-center gap-3 px-5 py-2 flex-shrink-0" style={{ background: '#C83C3C', color: '#fff' }}>
            <div className="w-2 h-2 rounded-full bg-white animate-pulse-critical" />
            <span className="text-xs font-semibold">Çevrimdışı Sınırlı Mod — Sunucuya bağlanılamıyor. Yalnızca önbellek verisi görüntüleniyor. Kritik aksiyonlar devre dışı.</span>
            <button className="ml-auto text-xs px-2 py-1 rounded" style={{ background: 'rgba(255,255,255,0.2)' }}>Yeniden Bağlan</button>
          </div>
        )}
        {serverStatus === 'slow' && (
          <div className="flex items-center gap-3 px-5 py-2 flex-shrink-0" style={{ background: '#D98B18', color: '#fff' }}>
            <div className="w-2 h-2 rounded-full bg-white" />
            <span className="text-xs font-medium">Sunucu bağlantısı yavaş — veri gecikmeli yüklenebilir.</span>
          </div>
        )}

        {/* Top bar */}
        <header className="flex items-center gap-3 px-5 flex-shrink-0" style={{ height: 56, background: '#fff', borderBottom: '1px solid #D8DEE6' }}>
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2 rounded flex-1 max-w-xs" style={{ background: '#F4F6F8', border: '1px solid #D8DEE6' }}>
            <IconSearch size={13} style={{ color: '#9FAAB5' }} />
            <input type="text" placeholder="İş emri, makine, ürün, doküman..." className="bg-transparent outline-none text-xs flex-1" style={{ color: '#17212B' }} />
            <kbd className="text-xs px-1.5 py-0.5 rounded" style={{ background: '#E8ECF0', color: '#66717F', fontSize: 9 }}>Ctrl K</kbd>
          </div>

          <div className="flex-1" />

          {/* Tesis */}
          <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded cursor-pointer hover:bg-gray-50" style={{ background: '#F4F6F8', border: '1px solid #D8DEE6', color: '#17212B' }}>
            <IconFactory size={13} style={{ color: '#315B7D' }} />
            <span className="font-medium">Ana Fabrika</span>
            <IconChevronDown size={11} style={{ color: '#9FAAB5' }} />
          </div>

          {/* Server status */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded cursor-pointer" style={{ background: st.bg }}>
            <div className={`w-1.5 h-1.5 rounded-full ${serverStatus === 'offline' ? 'animate-pulse-critical' : ''}`} style={{ background: st.dot }} />
            <span className="text-xs font-medium" style={{ color: st.text }}>{st.label}</span>
            <span className="text-xs ml-1" style={{ color: '#9FAAB5' }}>· sync 08:41</span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
              className="relative p-2 rounded transition-colors hover:bg-gray-50">
              <IconBell size={17} style={{ color: '#315B7D' }} />
              <div className="absolute top-1 right-1 w-4 h-4 rounded-full text-white flex items-center justify-center font-bold" style={{ background: '#C83C3C', fontSize: 9 }}>3</div>
            </button>
            {showNotifications && (
              <NotificationPanel onClose={() => setShowNotifications(false)} onNavigate={onNavigate} />
            )}
          </div>

          {/* User */}
          <div className="relative">
            <button onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
              className="flex items-center gap-2 px-3 py-1.5 rounded transition-colors hover:bg-gray-50">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: '#315B7D' }}>AK</div>
              <div className="text-left">
                <div className="text-xs font-semibold leading-tight" style={{ color: '#17212B' }}>Ahmet Kaya</div>
                <div className="text-xs" style={{ color: '#66717F', fontSize: 10 }}>Üretim Müdürü</div>
              </div>
              <IconChevronDown size={11} style={{ color: '#9FAAB5' }} />
            </button>
            {showUserMenu && (
              <div className="absolute top-10 right-0 w-48 rounded-lg shadow-xl z-50" style={{ background: '#fff', border: '1px solid #D8DEE6' }}>
                <div className="px-4 py-3" style={{ borderBottom: '1px solid #D8DEE6' }}>
                  <div className="text-sm font-semibold" style={{ color: '#17212B' }}>Ahmet Kaya</div>
                  <div className="text-xs" style={{ color: '#66717F' }}>a.kaya@kahraman.com.tr</div>
                </div>
                {['Profil Ayarları', 'Bildirim Tercihleri', 'Klavye Kısayolları', 'Yardım'].map(item => (
                  <button key={item} onClick={() => setShowUserMenu(false)}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-gray-50" style={{ color: '#17212B' }}>
                    {item}
                  </button>
                ))}
                <div style={{ borderTop: '1px solid #D8DEE6' }}>
                  <button className="w-full text-left px-4 py-2 text-xs" style={{ color: '#C83C3C' }}>Çıkış Yap</button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Click outside to close menus */}
        {(showNotifications || showUserMenu) && (
          <div className="fixed inset-0 z-40" onClick={() => { setShowNotifications(false); setShowUserMenu(false); }} />
        )}

        {/* Screen content */}
        <main className="flex-1 overflow-auto relative">
          {children}
        </main>
      </div>
    </div>
  );
}
