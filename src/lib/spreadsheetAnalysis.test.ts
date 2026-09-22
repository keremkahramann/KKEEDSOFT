import { test } from 'node:test';
import assert from 'node:assert/strict';
import { analyzePerformance } from './spreadsheetAnalysis.ts';
import type { CellValue } from './spreadsheetFilter.ts';

function row(person: string, operation: string, detail: string, score: CellValue) {
  const cells: CellValue[] = Array(16).fill(null);
  cells[8] = person; cells[4] = operation; cells[5] = detail; cells[15] = score;
  return cells;
}
test('ranks grouped averages and groups operations by both E and F', () => {
  const result = analyzePerformance([
    row('Ali', 'OP1', 'Kesim', 100), row(' ali ', 'OP1', 'Kesim', 0),
    row('Ayşe', 'OP1', 'Montaj', 70), row('Can', 'OP2', 'Kesim', 60),
    row('Deniz', 'OP3', 'Boya', 40), row('Ece', 'OP4', 'Paket', 30), row('Fatma', 'OP5', 'Kontrol', 20),
  ]);
  assert.deepEqual(result.topPeople.map(p => p.name), ['Ayşe', 'Can', 'Ali', 'Deniz', 'Ece']);
  assert.deepEqual(result.bottomPeople.map(p => p.name), ['Fatma', 'Ece', 'Deniz', 'Ali', 'Can']);
  assert.equal(result.topPeople[2].average, 50);
  assert.equal(result.topPeople[2].count, 2);
  assert.equal(result.operationCount, 6);
  assert.deepEqual(result.bottomOperations.map(p => p.average), [20, 30, 40, 60, 70]);
});
test('handles missing names independently, invalid scores, zero and decimal percentages', () => {
  const result = analyzePerformance([
    row('İpek', 'A', '', '80,5%'), row('ipek', 'A', '', '19,5'), row('Bora', '', '', 0),
    row('', 'B', 'Kesim', 10), row('Cem', 'C', '', null), row('Cem', 'C', '', 'hatalı'),
  ]);
  assert.equal(result.topPeople[0].average, 50);
  assert.equal(result.topPeople[0].count, 2);
  assert.equal(result.bottomPeople[0].average, 0);
  assert.equal(result.invalidScores, 2);
  assert.equal(result.missingPeople, 1);
  assert.equal(result.missingOperations, 1);
  assert.equal(result.bottomOperations[0].name, 'B — Kesim');
  assert.deepEqual(analyzePerformance([]).topPeople, []);
});
test('ties resolve alphabetically and all rows participate', () => {
  const rows = Array.from({ length: 100 }, () => row('Zeynep', 'A', 'B', 50));
  rows.push(row('Ali', 'A', 'B', 50));
  const result = analyzePerformance(rows);
  assert.deepEqual(result.topPeople.map(p => p.name), ['Ali', 'Zeynep']);
  assert.equal(result.topPeople[1].count, 100);
  assert.equal(result.bottomOperations[0].average, 50);
});

test('operation means exclude zero and negative measurements before ranking', () => {
  const result = analyzePerformance([
    row('Ali', 'A', 'Kesim', 0), row('Ali', 'A', 'Kesim', -20),
    row('Ali', 'A', 'Kesim', 40), row('Ali', 'A', 'Kesim', 80),
    row('Can', 'B', 'Montaj', 50), row('Ece', 'C', 'Boya', 0),
  ]);
  assert.deepEqual(result.bottomOperations.map(p => [p.name, p.average, p.count]), [
    ['B — Montaj', 50, 1], ['A — Kesim', 60, 2],
  ]);
  assert.equal(result.nonPositiveOperations, 3);
  assert.equal(result.topPeople.find(p => p.name === 'Ali')?.average, 25);
  assert.equal(analyzePerformance([row('Ali', 'A', 'Kesim', 0)]).bottomOperations.length, 0);
});
