import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../..');

const baselineDocPath = path.join(
  rootDir,
  'docs/superpowers/mappings/2026-04-20-parity-critical-command-baseline.md'
);
const registryLockPath = path.join(rootDir, 'artifacts/contracts/registry-lock.json');
const reportPath = path.join(rootDir, 'artifacts/contracts/parity-coverage-report.json');

function normalizeCell(value) {
  return value.trim().replaceAll('`', '');
}

function parseFirstColumnMarkdownTable(markdownText) {
  const rows = markdownText
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter((line) => line.startsWith('|'));

  const values = [];

  for (const row of rows) {
    const columns = row
      .split('|')
      .slice(1, -1)
      .map((cell) => normalizeCell(cell));

    if (columns.length === 0) {
      continue;
    }

    const first = columns[0];
    if (!first || first === '---' || first.toLowerCase() === 'command id') {
      continue;
    }

    values.push(first);
  }

  return values;
}

const baselineDoc = readFileSync(baselineDocPath, 'utf8');
const registryLock = JSON.parse(readFileSync(registryLockPath, 'utf8'));

const baselineIds = parseFirstColumnMarkdownTable(baselineDoc).sort((a, b) => a.localeCompare(b));
const uniqueBaselineIds = [...new Set(baselineIds)];
const duplicateBaselineIds = uniqueBaselineIds.filter(
  (id) => baselineIds.filter((baselineId) => baselineId === id).length > 1
);

const activeCommandIds = (registryLock.commands ?? [])
  .filter((command) => command.lifecycle === 'active')
  .map((command) => command.id)
  .sort((a, b) => a.localeCompare(b));

const activeSet = new Set(activeCommandIds);
const mappedCommandIds = uniqueBaselineIds.filter((id) => activeSet.has(id));
const unmappedCommandIds = uniqueBaselineIds.filter((id) => !activeSet.has(id));
const extraActiveCommandIds = activeCommandIds.filter((id) => !uniqueBaselineIds.includes(id));

const denominator = uniqueBaselineIds.length;
const coverageRatio = denominator === 0 ? 1 : mappedCommandIds.length / denominator;

const report = {
  generatedAt: '2026-04-20',
  baselineDocPath: 'docs/superpowers/mappings/2026-04-20-parity-critical-command-baseline.md',
  registryLockPath: 'artifacts/contracts/registry-lock.json',
  baselineCommandCount: denominator,
  activeRegistryCommandCount: activeCommandIds.length,
  mappedCount: mappedCommandIds.length,
  unmappedCount: unmappedCommandIds.length,
  coverageRatio,
  duplicateBaselineCommandIds: duplicateBaselineIds,
  mappedCommandIds,
  unmappedCommandIds,
  extraActiveCommandIds,
  status: coverageRatio === 1 && unmappedCommandIds.length === 0 && duplicateBaselineIds.length === 0 ? 'pass' : 'fail'
};

mkdirSync(path.dirname(reportPath), { recursive: true });
writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n', 'utf8');

process.stdout.write(
  `parity coverage ${report.status}: ${report.mappedCount}/${report.baselineCommandCount} mapped (ratio=${report.coverageRatio.toFixed(2)})\n`
);
