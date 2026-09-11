import React, { useState } from 'react';
import { IconServer, IconLock, IconEye, IconEyeOff, IconCheck, IconX } from '../components/Icons';

interface LoginScreenProps {
  onLogin: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [serverAddr, setServerAddr] = useState('srv-twin.kahraman.local:8443');
  const [serverStatus, setServerStatus] = useState<'idle' | 'testing' | 'ok' | 'error'>('ok');
  const [offlineMode, setOfflineMode] = useState(false);

  const testConnection = () => {
    setServerStatus('testing');
    setTimeout(() => setServerStatus('ok'), 1200);
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#0B1726' }}>
      {/* Left panel - branding */}
      <div className="flex-1 flex flex-col justify-between p-12" style={{ background: 'linear-gradient(160deg, #14263D 0%, #0B1726 100%)' }}>
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded flex items-center justify-center" style={{ background: '#F28C28' }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect x="2" y="2" width="8" height="8" rx="1" fill="white" opacity="0.9"/>
                <rect x="12" y="2" width="8" height="8" rx="1" fill="white" opacity="0.6"/>
                <rect x="2" y="12" width="8" height="8" rx="1" fill="white" opacity="0.6"/>
                <rect x="12" y="12" width="8" height="8" rx="1" fill="white" opacity="0.9"/>
              </svg>
            </div>
            <div>
              <div className="text-white font-bold text-xl tracking-wide" style={{ fontFamily: 'Inter', letterSpacing: '0.08em' }}>KAHRAMAN TWIN</div>
              <div className="text-xs tracking-widest uppercase" style={{ color: '#8FA3B8', letterSpacing: '0.12em' }}>Operational Digital Twin</div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-light text-white leading-tight mb-4">
              Üretim verisini<br/>
              <span style={{ color: '#F28C28' }} className="font-semibold">tek merkezde</span><br/>
              yönetin
            </h1>
            <p className="text-base leading-relaxed" style={{ color: '#8FA3B8' }}>
              Satıştan teslimata tüm süreçleri, makineleri, kalıpları ve kaliteyi tek dijital ikiz üzerinden izleyin ve yönetin.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2">
            {['Şirkete Sor', 'Üretimi İzle', 'Senaryo Hesapla', 'Problemi Analiz Et', 'Kontrollü Aksiyon Al'].map((f) => (
              <div key={f} className="px-3 py-1.5 rounded text-sm" style={{ background: 'rgba(255,255,255,0.07)', color: '#B0C4D8', border: '1px solid rgba(255,255,255,0.1)' }}>
                {f}
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs" style={{ color: '#4D6175' }}>
          Kahraman Kalıp San. ve Tic. A.Ş. — Gizli Kurumsal Sistem
        </div>
      </div>

      {/* Right panel - login form */}
      <div className="w-[480px] flex items-center justify-center p-12" style={{ background: '#F4F6F8' }}>
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-1" style={{ color: '#17212B' }}>Giriş Yap</h2>
            <p className="text-sm" style={{ color: '#66717F' }}>Kahraman Twin kurumsal ağı üzerinden çalışır.</p>
          </div>

          {/* Server status */}
          <div className="mb-6 p-3 rounded flex items-center gap-3" style={{
            background: serverStatus === 'error' ? '#FCEAEA' : '#EAF5EF',
            border: `1px solid ${serverStatus === 'error' ? '#C83C3C40' : '#248A5B40'}`
          }}>
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${serverStatus === 'testing' ? 'animate-pulse' : ''}`} style={{
              background: serverStatus === 'ok' ? '#248A5B' : serverStatus === 'error' ? '#C83C3C' : '#D98B18'
            }} />
            <div className="flex-1">
              <div className="text-xs font-medium" style={{ color: serverStatus === 'error' ? '#C83C3C' : '#248A5B' }}>
                {serverStatus === 'ok' ? 'Sunucu bağlantısı sağlandı' : serverStatus === 'error' ? 'Sunucu erişilemiyor' : 'Bağlantı test ediliyor...'}
              </div>
              <div className="text-xs mt-0.5" style={{ color: '#66717F' }}>srv-twin.kahraman.local · Son sync: 07.09.2026 08:41</div>
            </div>
            <div className="flex items-center gap-1">
              <IconServer size={14} className="text-green-600" />
              <span className="text-xs font-medium" style={{ color: '#248A5B' }}>Güvenli Ağ</span>
            </div>
          </div>

          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#17212B' }}>Kullanıcı Adı</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="ad.soyad"
                className="w-full px-3 py-2.5 rounded text-sm border outline-none transition-all"
                style={{ background: '#fff', border: '1px solid #D8DEE6', color: '#17212B' }}
                onFocus={e => e.target.style.borderColor = '#315B7D'}
                onBlur={e => e.target.style.borderColor = '#D8DEE6'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#17212B' }}>Şifre</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 pr-10 rounded text-sm border outline-none transition-all"
                  style={{ background: '#fff', border: '1px solid #D8DEE6', color: '#17212B' }}
                  onFocus={e => e.target.style.borderColor = '#315B7D'}
                  onBlur={e => e.target.style.borderColor = '#D8DEE6'}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
                  style={{ color: '#66717F' }}>
                  {showPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                </button>
              </div>
            </div>

            {/* Server address */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#17212B' }}>Sunucu Adresi</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={serverAddr}
                  onChange={e => setServerAddr(e.target.value)}
                  className="flex-1 px-3 py-2.5 rounded text-sm border outline-none"
                  style={{ background: '#fff', border: '1px solid #D8DEE6', color: '#17212B', fontFamily: 'JetBrains Mono', fontSize: 12 }}
                />
                <button type="button" onClick={testConnection}
                  className="px-3 py-2 rounded text-xs font-medium transition-colors"
                  style={{ background: '#EBF3FC', color: '#3478C7', border: '1px solid #3478C740' }}>
                  Test
                </button>
              </div>
            </div>

            <button type="submit"
              className="w-full py-3 rounded font-semibold text-sm transition-all hover:opacity-90 active:scale-[0.99]"
              style={{ background: '#14263D', color: '#fff' }}>
              Giriş Yap
            </button>

            <div className="relative flex items-center gap-3">
              <div className="flex-1 border-t" style={{ borderColor: '#D8DEE6' }} />
              <span className="text-xs" style={{ color: '#66717F' }}>ya da</span>
              <div className="flex-1 border-t" style={{ borderColor: '#D8DEE6' }} />
            </div>

            <button type="button" onClick={onLogin}
              className="w-full py-3 rounded font-medium text-sm transition-all hover:opacity-90"
              style={{ background: '#fff', border: '1px solid #D8DEE6', color: '#17212B' }}>
              <span className="flex items-center justify-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="1" y="1" width="6.5" height="6.5" fill="#F35325"/>
                  <rect x="8.5" y="1" width="6.5" height="6.5" fill="#81BC06"/>
                  <rect x="1" y="8.5" width="6.5" height="6.5" fill="#05A6F0"/>
                  <rect x="8.5" y="8.5" width="6.5" height="6.5" fill="#FFBA08"/>
                </svg>
                Windows hesabımla giriş yap
              </span>
            </button>

            {/* Offline mode */}
            <div className="pt-2 border-t" style={{ borderColor: '#D8DEE6' }}>
              <button type="button" onClick={() => { setOfflineMode(!offlineMode); onLogin(); }}
                className="w-full text-center text-sm transition-colors hover:underline"
                style={{ color: '#66717F' }}>
                Sunucu erişilemiyor — Sınırlı offline mod
              </button>
              <p className="text-xs text-center mt-1" style={{ color: '#9FAAB5' }}>
                Offline modda yalnızca önbelleğe alınmış veriler görüntülenebilir. Kritik aksiyonlar engellenir.
              </p>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t flex justify-between text-xs" style={{ borderColor: '#D8DEE6', color: '#9FAAB5' }}>
            <span>Uygulama v2.4.1</span>
            <span>Veri modeli: 07.09.2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
