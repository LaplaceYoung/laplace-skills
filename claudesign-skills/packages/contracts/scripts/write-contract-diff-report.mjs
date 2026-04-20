import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const lockPath = path.join(root, 'artifacts/contracts/registry-lock.json');
const outputPath = path.join(root, 'artifacts/contracts/contract-diff-report.json');
const lock = JSON.parse(readFileSync(lockPath, 'utf8'));

const report = {
  status: 'pass',
  baseline: 'phase0-initial-freeze',
  comparedTo: null,
  registryVersion: lock.registryVersion,
  frozenAt: lock.frozenAt,
  commandCount: lock.commandCount,
  addedCommands: lock.commands.map((command) => command.id),
  removedCommands: [],
  changedCommands: [],
  ownerSummary: Object.fromEntries(
    [...new Set(lock.commands.map((command) => command.owner))]
      .sort()
      .map((owner) => [owner, lock.commands.filter((command) => command.owner === owner).length])
  ),
  commandsSha256: lock.commandsSha256,
  generatedAt: new Date().toISOString()
};

writeFileSync(outputPath, JSON.stringify(report, null, 2) + '\n', 'utf8');
console.log(`contract diff report written: ${outputPath}`);
