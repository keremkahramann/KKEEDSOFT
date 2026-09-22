import { useMemo, useState } from 'react';
import { analyzePerformance } from '../lib/spreadsheetAnalysis';
import type { CellValue } from '../lib/spreadsheetFilter';

type Sheet = { name: string; rows: CellValue[][]; width: number };
const control = 'w-full rounded border border-[#D8DEE6] bg-white px-3 py-2 text-sm disabled:opacity-50';

export default function SpreadsheetFilter() {
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [fileName, setFileName] = useState('');
  const [sheetIndex, setSheetIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const sheet = sheets[sheetIndex];
  const analysis = useMemo(() => sheet ? analyzePerformance(sheet.rows) : null, [sheet]);

  async function upload(file: File) {
    setError(''); setSheets([]); setFileName(''); setSheetIndex(0);
    if (!/\.xlsx$/i.test(file.name)) { setError('Lütfen .xlsx uzantılı bir dosya seçin.'); return; }
    if (file.size > 20 * 1024 * 1024) { setError('Dosya en fazla 20 MB olabilir.'); return; }
    setBusy(true);
    try {
      const { read, utils } = await import('xlsx');
      const bytes = new Uint8Array(await file.arrayBuffer());
      if (bytes[0] !== 0x50 || bytes[1] !== 0x4b) throw new Error('invalid');
      const workbook = read(bytes, { type: 'array' });
      const parsed = workbook.SheetNames.map(name => {
        const worksheet = workbook.Sheets[name];
        const range = utils.decode_range(worksheet['!ref'] ?? 'A1');
        range.s = { r: 0, c: 0 };
        const matrix = utils.sheet_to_json<CellValue[]>(worksheet, { range, header: 1, raw: false, defval: null, blankrows: false });
        return { name, width: range.e.c + 1, rows: matrix.slice(1) };
      });
      if (!parsed.length) throw new Error('empty');
      setSheets(parsed); setFileName(file.name);
    } catch {
      setError('Dosya okunamadı. Geçerli, şifresiz bir XLSX dosyası seçin.');
    } finally { setBusy(false); }
  }

  return (
    <section className="rounded-lg border border-[#D8DEE6] bg-white text-[#17212B]">
      <div className="border-b border-[#D8DEE6] px-4 py-3">
        <h3 className="text-sm font-semibold">Personel ve operasyon performans analizi</h3>
        <p className="mt-1 text-xs text-[#66717F]">Personel: I · Operasyon: E + F · Performans puanı: P</p>
      </div>
      <div className="space-y-4 p-4">
        <label className="block text-xs font-medium">XLSX dosyası
          <input type="file" accept=".xlsx" disabled={busy} className={`${control} mt-1`} onChange={event => { const file = event.target.files?.[0]; event.target.value = ''; if (file) void upload(file); }} />
        </label>
        <p className="text-xs text-[#66717F]">İlk dolu satır başlık kabul edilir. Dosya cihazınızda işlenir. En fazla 20 MB.</p>
        {busy && <p role="status" className="text-sm text-[#66717F]">Dosya analiz ediliyor…</p>}
        {error && <p role="alert" className="text-sm text-[#C83C3C]">{error}</p>}
        {sheet && analysis && <>
          <p className="break-all text-xs text-[#66717F]">{fileName}</p>
          <label className="block text-xs font-medium">Analiz edilecek sayfa
            <select className={`${control} mt-1`} value={sheetIndex} onChange={event => setSheetIndex(Number(event.target.value))}>
              {sheets.map((item, index) => <option key={index} value={index}>{item.name}</option>)}
            </select>
          </label>
          {sheet.width < 16 ? <p role="alert" className="rounded bg-[#FEF6E7] p-3 text-sm">Bu sayfada P sütunu bulunamadı. E, F, I ve P sütunlarını içeren sayfayı seçin.</p> : <>
            <p className="text-xs text-[#66717F]">Aynı personelin ve aynı E–F operasyon çiftinin kayıtları birleştirilir; P değerlerinin aritmetik ortalaması alınır. Operasyon hesabına yalnızca P &gt; 0 olan ölçümler dahil edilir. Personel hesabında sıfır puanlar dahildir. Eşit ortalamalar ada göre sıralanır. Her tabloda 5 sonuç gösterilir; yeterli veri yoksa mevcut sonuçlar listelenir.</p>
            <div role="status" className="text-xs text-[#66717F]">
              {sheet.rows.length} satır · {analysis.peopleCount} personel · {analysis.operationCount} operasyon
              {analysis.invalidScores > 0 && ` · ${analysis.invalidScores} satırda geçerli performans puanı yok`}
              {analysis.missingPeople > 0 && ` · ${analysis.missingPeople} satır personel adı eksik olduğu için personel analizine alınmadı`}
              {analysis.missingOperations > 0 && ` · ${analysis.missingOperations} satır operasyon bilgisi eksik olduğu için operasyon analizine alınmadı`}
              {analysis.nonPositiveOperations > 0 && ` · ${analysis.nonPositiveOperations} ölçüm P puanı sıfır veya negatif olduğu için operasyon hesabına alınmadı`}
            </div>
            <div className="grid gap-4 xl:grid-cols-3">
              {[
                { title: 'En yüksek performanslı 5 personel', name: 'Personel adı', data: analysis.topPeople, color: '#248A5B' },
                { title: 'En düşük performanslı 5 personel', name: 'Personel adı', data: analysis.bottomPeople, color: '#C83C3C' },
                { title: 'En düşük performanslı 5 operasyon', name: 'Operasyon (E — F)', data: analysis.bottomOperations, color: '#D98B18' },
              ].map(result => <div key={result.title} className="min-w-0 overflow-hidden rounded border border-[#D8DEE6]">
                <h4 className="bg-[#F4F6F8] px-3 py-3 text-sm font-semibold" style={{ color: result.color }}>{result.title}</h4>
                {result.data.length ? <div className="overflow-x-auto"><table className="w-full text-left text-xs">
                  <thead><tr className="border-b border-[#D8DEE6] text-[#66717F]"><th className="p-2">#</th><th className="p-2">{result.name}</th><th className="p-2 text-right">Ortalama puan</th><th className="p-2 text-right">Kayıt</th></tr></thead>
                  <tbody>{result.data.map((group, index) => <tr key={index} className="border-b border-[#F4F6F8]">
                    <td className="p-2">{index + 1}</td><td className="break-words p-2">{group.name}</td>
                    <td className="p-2 text-right font-semibold" style={{ color: result.color }}>{group.average.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="p-2 text-right">{group.count}</td>
                  </tr>)}</tbody>
                </table></div> : <p className="p-3 text-xs text-[#66717F]">Analiz için geçerli kayıt bulunamadı.</p>}
              </div>)}
            </div>
          </>}
        </>}
      </div>
    </section>
  );
}
