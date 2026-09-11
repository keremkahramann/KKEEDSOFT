import React, { useState } from 'react';
import { IconInfo, IconAlert } from '../components/Icons';

const formatCurrency = (n: number) => '₺' + n.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

export default function CostScreen() {
  const [qty, setQty] = useState('300000');
  const [material, setMaterial] = useState('PP+GF30');
  const [matPrice, setMatPrice] = useState('48.50');
  const [weight, setWeight] = useState('0.082');
  const [cycleTime, setCycleTime] = useState('18');
  const [oee, setOee] = useState('74.8');
  const [cavities, setCavities] = useState('4');
  const [margin, setMargin] = useState('22');
  const [deliveryDate, setDeliveryDate] = useState('2026-10-15');
  const [calculated, setCalculated] = useState(true);

  const qtyNum = parseFloat(qty) || 300000;
  const matPriceNum = parseFloat(matPrice) || 48.5;
  const weightNum = parseFloat(weight) || 0.082;
  const fireRate = 0.021;
  const cavitiesNum = parseFloat(cavities) || 4;
  const cycleNum = parseFloat(cycleTime) || 18;
  const oeeNum = parseFloat(oee) || 74.8;
  const marginNum = parseFloat(margin) || 22;

  const matCost = Math.round(qtyNum * weightNum * matPriceNum * (1 + fireRate));
  const machCost = Math.round(qtyNum * (cycleNum / 3600) / (oeeNum / 100) * 380);
  const laborCost = Math.round(qtyNum * 0.0015 * 65);
  const qualityCost = Math.round(qtyNum * 0.0008 * 90);
  const overhead = Math.round((matCost + machCost + laborCost + qualityCost) * 0.18);
  const riskPay = Math.round((matCost + machCost + laborCost + qualityCost + overhead) * 0.05);
  const totalCost = matCost + machCost + laborCost + qualityCost + overhead + riskPay;
  const unitCost = totalCost / qtyNum;
  const suggestedPrice = totalCost * (1 + marginNum / 100);
  const unitPrice = suggestedPrice / qtyNum;

  const scenarios = [
    { name: 'Temel', total: totalCost, date: '16 Eki', confidence: 67, style: 'info' },
    { name: 'İyimser (+%5 OEE)', total: Math.round(totalCost * 0.94), date: '13 Eki', confidence: 52, style: 'ok' },
    { name: 'Riskli (PRESS-07 dışı)', total: Math.round(totalCost * 1.11), date: '22 Eki', confidence: 78, style: 'warning' },
  ];

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left: inputs */}
      <div className="w-96 flex-shrink-0 overflow-y-auto" style={{ background: '#fff', borderRight: '1px solid #D8DEE6' }}>
        <div className="px-5 py-3 sticky top-0 z-10" style={{ background: '#14263D', color: '#fff' }}>
          <h2 className="text-sm font-semibold">Maliyet & Termin Simülatörü</h2>
          <p className="text-xs mt-0.5" style={{ color: '#8FA3B8' }}>Kahraman Twin hesaplama motoru v2.3</p>
        </div>
        <div className="p-5 space-y-5">
          <div>
            <div className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: '#66717F' }}>Sipariş Bilgileri</div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: '#17212B' }}>Müşteri</label>
                <select className="w-full px-3 py-2 rounded text-sm outline-none" style={{ background: '#F4F6F8', border: '1px solid #D8DEE6', color: '#17212B' }}>
                  <option>Arçelik A.Ş.</option><option>Ford Otosan</option><option>Tofaş</option><option>Vestel</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: '#17212B' }}>Ürün / Parça No</label>
                <input type="text" defaultValue="PRT-1042" className="w-full px-3 py-2 rounded text-sm outline-none font-mono" style={{ background: '#F4F6F8', border: '1px solid #D8DEE6', color: '#17212B' }} />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: '#17212B' }}>Sipariş Miktarı (adet)</label>
                <input type="number" value={qty} onChange={e => setQty(e.target.value)}
                  className="w-full px-3 py-2 rounded text-sm outline-none font-mono" style={{ background: '#F4F6F8', border: '1px solid #D8DEE6', color: '#17212B' }} />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: '#17212B' }}>İstenen Teslim Tarihi</label>
                <input type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)}
                  className="w-full px-3 py-2 rounded text-sm outline-none" style={{ background: '#F4F6F8', border: '1px solid #D8DEE6', color: '#17212B' }} />
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: '#66717F' }}>Malzeme</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: '#17212B' }}>Malzeme</label>
                <select value={material} onChange={e => setMaterial(e.target.value)}
                  className="w-full px-2 py-2 rounded text-xs outline-none" style={{ background: '#F4F6F8', border: '1px solid #D8DEE6', color: '#17212B' }}>
                  <option>PP+GF30</option><option>ABS</option><option>PA66</option><option>ST37</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: '#17212B' }}>Fiyat (₺/kg)</label>
                <input type="number" value={matPrice} onChange={e => setMatPrice(e.target.value)}
                  className="w-full px-2 py-2 rounded text-xs outline-none font-mono" style={{ background: '#F4F6F8', border: '1px solid #D8DEE6', color: '#17212B' }} />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: '#17212B' }}>Parça ağırlığı (kg)</label>
                <input type="number" value={weight} onChange={e => setWeight(e.target.value)}
                  className="w-full px-2 py-2 rounded text-xs outline-none font-mono" style={{ background: '#F4F6F8', border: '1px solid #D8DEE6', color: '#17212B' }} />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: '#17212B' }}>Fire oranı (%)</label>
                <input type="number" defaultValue="2.1"
                  className="w-full px-2 py-2 rounded text-xs outline-none font-mono" style={{ background: '#F4F6F8', border: '1px solid #D8DEE6', color: '#17212B' }} />
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: '#66717F' }}>Makine & Kalıp</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: '#17212B' }}>Makine</label>
                <select className="w-full px-2 py-2 rounded text-xs outline-none" style={{ background: '#F4F6F8', border: '1px solid #D8DEE6', color: '#17212B' }}>
                  <option>INJ-01</option><option>INJ-02</option><option>PRESS-05</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: '#17212B' }}>Göz sayısı</label>
                <input type="number" value={cavities} onChange={e => setCavities(e.target.value)}
                  className="w-full px-2 py-2 rounded text-xs outline-none font-mono" style={{ background: '#F4F6F8', border: '1px solid #D8DEE6', color: '#17212B' }} />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: '#17212B' }}>Çevrim süresi (sn)</label>
                <input type="number" value={cycleTime} onChange={e => setCycleTime(e.target.value)}
                  className="w-full px-2 py-2 rounded text-xs outline-none font-mono" style={{ background: '#F4F6F8', border: '1px solid #D8DEE6', color: '#17212B' }} />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: '#17212B' }}>OEE (%)</label>
                <input type="number" value={oee} onChange={e => setOee(e.target.value)}
                  className="w-full px-2 py-2 rounded text-xs outline-none font-mono" style={{ background: '#F4F6F8', border: '1px solid #D8DEE6', color: '#17212B' }} />
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: '#66717F' }}>Fiyatlama</div>
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: '#17212B' }}>Hedef Marj (%)</label>
              <input type="number" value={margin} onChange={e => setMargin(e.target.value)}
                className="w-full px-3 py-2 rounded text-sm outline-none font-mono" style={{ background: '#F4F6F8', border: '1px solid #D8DEE6', color: '#17212B' }} />
            </div>
          </div>

          <button className="w-full py-3 rounded font-semibold text-sm" style={{ background: '#F28C28', color: '#fff' }}>
            Hesapla
          </button>
        </div>
      </div>

      {/* Right: results */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold" style={{ color: '#17212B' }}>Hesaplama Sonucu</h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs px-2 py-1 rounded" style={{ background: '#EAF5EF', color: '#248A5B' }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#248A5B' }} />
              Gerçek Veriler · ERP + MES · 08:41
            </div>
            <span className="text-xs px-2 py-1 rounded" style={{ background: '#FEF6E7', color: '#D98B18' }}>Tahmin — İnsan onayı gerekli</span>
          </div>
        </div>

        {/* Cost breakdown */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg" style={{ background: '#fff', border: '1px solid #D8DEE6' }}>
            <div className="px-4 py-3" style={{ borderBottom: '1px solid #D8DEE6', background: '#F4F6F8' }}>
              <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#66717F' }}>Maliyet Dökümü</div>
            </div>
            <div className="p-4 space-y-2">
              {[
                { label: 'Malzeme', value: matCost, pct: matCost / totalCost },
                { label: 'Makine & Enerji', value: machCost, pct: machCost / totalCost },
                { label: 'İşçilik', value: laborCost, pct: laborCost / totalCost },
                { label: 'Kalite Operasyonları', value: qualityCost, pct: qualityCost / totalCost },
                { label: 'Genel Gider', value: overhead, pct: overhead / totalCost },
                { label: 'Risk Payı', value: riskPay, pct: riskPay / totalCost },
              ].map(({ label, value, pct }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: '#17212B' }}>{label}</span>
                    <span className="font-mono font-semibold" style={{ color: '#17212B' }}>{formatCurrency(value)}</span>
                  </div>
                  <div className="h-1 rounded-full" style={{ background: '#F4F6F8' }}>
                    <div className="h-full rounded-full" style={{ width: `${pct * 100}%`, background: '#315B7D' }} />
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t mt-3 flex items-center justify-between" style={{ borderColor: '#D8DEE6' }}>
                <span className="text-sm font-semibold" style={{ color: '#17212B' }}>Toplam Maliyet</span>
                <span className="text-lg font-bold font-mono" style={{ color: '#14263D' }}>{formatCurrency(totalCost)}</span>
              </div>
              <div className="text-xs" style={{ color: '#66717F' }}>Birim maliyet: <span className="font-mono font-semibold" style={{ color: '#17212B' }}>₺{unitCost.toFixed(2)}</span></div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Offer price */}
            <div className="rounded-lg p-4" style={{ background: '#14263D' }}>
              <div className="text-xs mb-3" style={{ color: '#8FA3B8' }}>Önerilen Teklif Fiyatı (%{margin} Marj)</div>
              <div className="text-3xl font-bold font-mono text-white mb-1">{formatCurrency(suggestedPrice)}</div>
              <div className="text-sm" style={{ color: '#F28C28' }}>Birim: ₺{unitPrice.toFixed(3)}</div>
            </div>

            {/* Delivery */}
            <div className="rounded-lg p-4" style={{ background: '#fff', border: '1px solid #D8DEE6' }}>
              <div className="text-xs mb-2" style={{ color: '#66717F' }}>Tahmini Teslim Tarihi</div>
              <div className="text-xl font-bold font-mono" style={{ color: '#D98B18' }}>16 Ekim 2026</div>
              <div className="text-xs mt-1" style={{ color: '#66717F' }}>İstenilen: 15 Ekim — 1 gün gecikme riski</div>
              <div className="text-xs mt-2 px-2 py-1 rounded" style={{ background: '#FEF6E7', color: '#D98B18' }}>Güven aralığı: 13–22 Ekim</div>
            </div>

            {/* Warnings */}
            <div className="rounded-lg p-3 space-y-2" style={{ background: '#FEF6E7', border: '1px solid #D98B1840' }}>
              <div className="text-xs font-semibold" style={{ color: '#D98B18' }}>Varsayımlar & Uyarılar</div>
              {['PRESS-07 arızası dışında bırakıldı', 'Malzeme fiyatı bugün itibarıyla', 'Mevcut OEE kullanıldı'].map((a, i) => (
                <p key={i} className="text-xs" style={{ color: '#17212B' }}>• {a}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Scenario comparison */}
        <div className="rounded-lg overflow-hidden" style={{ background: '#fff', border: '1px solid #D8DEE6' }}>
          <div className="px-4 py-3" style={{ borderBottom: '1px solid #D8DEE6', background: '#F4F6F8' }}>
            <h3 className="text-sm font-semibold" style={{ color: '#17212B' }}>Senaryo Karşılaştırması</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid #D8DEE6', background: '#F4F6F8' }}>
                  {['Senaryo', 'Toplam Maliyet', 'Birim Maliyet', 'Teklif Fiyatı', 'Teslim', 'Güven'].map(h => (
                    <th key={h} className="text-left px-4 py-2 text-xs font-semibold" style={{ color: '#66717F' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scenarios.map((s, i) => {
                  const uc = s.total / qtyNum;
                  const tp = s.total * (1 + marginNum / 100);
                  return (
                    <tr key={i} style={{ borderBottom: '1px solid #F4F6F8', background: i === 0 ? '#F0F7FF' : undefined }}>
                      <td className="px-4 py-3 font-medium" style={{ color: '#17212B' }}>{s.name}</td>
                      <td className="px-4 py-3 font-mono" style={{ color: '#17212B' }}>{formatCurrency(s.total)}</td>
                      <td className="px-4 py-3 font-mono" style={{ color: '#17212B' }}>₺{uc.toFixed(2)}</td>
                      <td className="px-4 py-3 font-mono font-semibold" style={{ color: '#14263D' }}>{formatCurrency(tp)}</td>
                      <td className="px-4 py-3" style={{ color: '#17212B' }}>{s.date}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded font-mono" style={{
                          background: s.style === 'ok' ? '#EAF5EF' : s.style === 'warning' ? '#FEF6E7' : '#EBF3FC',
                          color: s.style === 'ok' ? '#248A5B' : s.style === 'warning' ? '#D98B18' : '#3478C7'
                        }}>%{s.confidence}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Formula box */}
        <div className="rounded-lg p-4" style={{ background: '#0B1726', border: '1px solid #1D3550' }}>
          <div className="text-xs font-semibold mb-2" style={{ color: '#F28C28' }}>Kullanılan Formüller</div>
          <div className="font-mono text-xs space-y-1" style={{ color: '#8FA3B8' }}>
            <div>Malzeme = Miktar × Ağırlık × Fiyat × (1 + Fire)</div>
            <div>Makine = Miktar × (Çevrim/3600) / OEE × Makine_Saati_Ücreti</div>
            <div>Teklif = Toplam_Maliyet × (1 + Marj%)</div>
            <div style={{ color: '#66717F' }}>Kaynak: ERP fiyat listesi · MES OEE · Kapasite Modeli v2.3 · 07.09.2026</div>
          </div>
        </div>
      </div>
    </div>
  );
}
