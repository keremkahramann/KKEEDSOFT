import { parseNumber, type CellValue } from './spreadsheetFilter.ts';

export type PerformanceGroup = { name: string; average: number; count: number };
const label = (value: CellValue | undefined) => String(value ?? '').trim().replace(/\s+/g, ' ');

export function analyzePerformance(rows: CellValue[][]) {
  const people = new Map<string, PerformanceGroup>();
  const operations = new Map<string, PerformanceGroup>();
  let invalidScores = 0, missingPeople = 0, missingOperations = 0;
  let nonPositiveOperations = 0;
  function add(groups: Map<string, PerformanceGroup>, parts: string[], score: number) {
    const key = JSON.stringify(parts.map(part => part.toLocaleLowerCase('tr-TR')));
    const group = groups.get(key) ?? { name: parts.filter(Boolean).join(' — '), average: 0, count: 0 };
    group.count++;
    group.average += (score - group.average) / group.count;
    groups.set(key, group);
  }
  for (const row of rows) {
    const raw = row[15];
    const score = parseNumber(typeof raw === 'string' ? raw.trim().replace(/^%\s*|\s*%$/g, '') : raw ?? null);
    if (score === null) { invalidScores++; continue; }
    const person = label(row[8]);
    const operation = [label(row[4]), label(row[5])];
    if (person) add(people, [person], score); else missingPeople++;
    if (!operation.some(Boolean)) missingOperations++;
    if (score <= 0) nonPositiveOperations++;
    else if (operation.some(Boolean)) add(operations, operation, score);
  }
  const rank = (groups: Map<string, PerformanceGroup>, descending = false) => [...groups.values()].sort((a, b) =>
    (descending ? b.average - a.average : a.average - b.average) || a.name.localeCompare(b.name, 'tr-TR'));
  return {
    topPeople: rank(people, true).slice(0, 5), bottomPeople: rank(people).slice(0, 5),
    bottomOperations: rank(operations).slice(0, 5), invalidScores, missingPeople, missingOperations,
    peopleCount: people.size, operationCount: operations.size, nonPositiveOperations,
  };
}
