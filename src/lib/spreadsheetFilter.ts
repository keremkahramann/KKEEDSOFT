export type CellValue = string | number | boolean | null;
export type FilterOperator = 'contains' | 'equals' | 'notEquals' | 'greater' | 'less' | 'empty' | 'notEmpty';

export function parseNumber(value: CellValue): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value !== 'string' || !value.trim()) return null;
  const text = value.trim();
  // Accept decimal points and Turkish decimal commas (including 1.234,56).
  const normalized = text.includes(',')
    ? (/^[+-]?(?:\d+|\d{1,3}(?:\.\d{3})+),\d+$/.test(text) ? text.replace(/\./g, '').replace(',', '.') : '')
    : text;
  if (!normalized || !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(normalized)) return null;
  const number = Number(normalized);
  return Number.isFinite(number) ? number : null;
}

export function filterRows(rows: CellValue[][], column: number, operator: FilterOperator, query: string): CellValue[][] {
  const needle = query.trim().toLocaleLowerCase('tr-TR');
  const threshold = parseNumber(query);
  return rows.filter(row => {
    const value = row[column] ?? null;
    const text = String(value ?? '').trim().toLocaleLowerCase('tr-TR');
    switch (operator) {
      case 'empty': return text === '';
      case 'notEmpty': return text !== '';
      case 'contains': return text.includes(needle);
      case 'equals': return typeof value === 'number' && threshold !== null ? value === threshold : text === needle;
      case 'notEquals': return typeof value === 'number' && threshold !== null ? value !== threshold : text !== needle;
      case 'greater': case 'less': {
        const number = parseNumber(value);
        return number !== null && threshold !== null && (operator === 'greater' ? number > threshold : number < threshold);
      }
    }
  });
}
