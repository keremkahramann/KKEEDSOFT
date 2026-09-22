import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as XLSX from 'xlsx';
import { filterRows, parseNumber, type CellValue } from './spreadsheetFilter.ts';
test('Turkish text matching, empty cells and numeric filters', () => {
  const rows: CellValue[][] = [['İZMİR', 24.85], ['Ankara', 0], ['izmir', '1.234,56'], [null, null], ['  ', false]];
  assert.equal(filterRows(rows, 0, 'contains', 'izmir').length, 2);
  assert.equal(filterRows(rows, 0, 'equals', ' ANKARA ').length, 1);
  assert.equal(filterRows(rows, 0, 'notEquals', 'izmir').length, 3);
  assert.equal(filterRows(rows, 0, 'empty', '').length, 2);
  assert.equal(filterRows(rows, 1, 'notEmpty', '').length, 4);
  assert.deepEqual(filterRows(rows, 1, 'greater', '24,85'), [rows[2]]);
  assert.deepEqual(filterRows(rows, 1, 'less', '1'), [rows[1]]);
  assert.deepEqual(filterRows(rows, 1, 'equals', '24,85'), [rows[0]]);
  assert.equal(filterRows(rows, 1, 'greater', 'invalid').length, 0);
  assert.equal(parseNumber('1.234,56'), 1234.56);
  for (const value of ['', ' ', '12abc', '1,2,3', null, false]) assert.equal(parseNumber(value), null);
  assert.equal(rows.length, 5);
});

test('XLSX round trip preserves column positions and supports multiple sheets', () => {
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, XLSX.utils.aoa_to_sheet([
    ['Ad', 'Ölçüm', 'Ad'], ['İzmir', 24.85, 'A'], ['Ankara', null, 'B'], ['Bursa', 25.1, 'C'],
  ]), 'Ölçümler');
  XLSX.utils.book_append_sheet(book, XLSX.utils.aoa_to_sheet([]), 'Boş');
  const loaded = XLSX.read(XLSX.write(book, { type: 'buffer', bookType: 'xlsx' }), { type: 'buffer' });
  const matrix = XLSX.utils.sheet_to_json<CellValue[]>(loaded.Sheets['Ölçümler'], { header: 1, defval: null, blankrows: false });
  assert.equal(loaded.SheetNames.length, 2);
  assert.deepEqual(filterRows(matrix.slice(1), 1, 'greater', '25'), [['Bursa', 25.1, 'C']]);
  assert.deepEqual(filterRows(matrix.slice(1), 1, 'empty', ''), [['Ankara', null, 'B']]);
  assert.deepEqual(filterRows(matrix.slice(1), 2, 'equals', 'b'), [['Ankara', null, 'B']]);
});
