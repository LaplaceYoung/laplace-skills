import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

function normalizeCell(value: string): string {
  return value.trim().replaceAll('`', '');
}

function parseTableColumn(text: string, columnIndex: number): string[] {
  return text
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter((line) => line.startsWith('|'))
    .map((line) => line.split('|').slice(1, -1).map((cell) => normalizeCell(cell)))
    .filter((cells) => cells.length > columnIndex)
    .map((cells) => cells[columnIndex])
    .filter((value) => value && value !== '---')
    .filter((value) => value.toLowerCase() !== 'command id')
    .filter((value) => value.toLowerCase() !== 'source function')
    .filter((value) => value.toLowerCase() !== 'codex capability');
}

describe('parity baseline coverage', () => {
  it('maps every baseline command to an active registry command', () => {
    const baselinePath = path.resolve(
      process.cwd(),
      'docs/superpowers/mappings/2026-04-20-parity-critical-command-baseline.md'
    );
    const sourceMapPath = path.resolve(
      process.cwd(),
      'docs/superpowers/mappings/2026-04-20-source-to-codex-capability-map.md'
    );
    const lockPath = path.resolve(process.cwd(), 'artifacts/contracts/registry-lock.json');

    const baselineIds = parseTableColumn(readFileSync(baselinePath, 'utf8'), 0);
    const mappedIds = parseTableColumn(readFileSync(sourceMapPath, 'utf8'), 2);
    const lock = JSON.parse(readFileSync(lockPath, 'utf8')) as {
      commands: Array<{ id: string; lifecycle: string }>;
    };

    const activeIds = lock.commands
      .filter((command) => command.lifecycle === 'active')
      .map((command) => command.id);

    expect(new Set(baselineIds).size).toBe(baselineIds.length);
    expect(new Set(mappedIds).size).toBe(mappedIds.length);

    for (const commandId of baselineIds) {
      expect(activeIds).toContain(commandId);
      expect(mappedIds).toContain(commandId);
    }
  });

  it('emits a passing parity-coverage report', () => {
    const scriptPath = path.resolve(
      process.cwd(),
      'packages/command-registry/scripts/check-parity-coverage.mjs'
    );

    execFileSync(process.execPath, [scriptPath], {
      cwd: process.cwd(),
      stdio: 'pipe'
    });

    const reportPath = path.resolve(process.cwd(), 'artifacts/contracts/parity-coverage-report.json');
    const report = JSON.parse(readFileSync(reportPath, 'utf8')) as {
      status: string;
      coverageRatio: number;
      unmappedCount: number;
      baselineCommandCount: number;
      mappedCount: number;
    };

    expect(report.status).toBe('pass');
    expect(report.coverageRatio).toBe(1);
    expect(report.unmappedCount).toBe(0);
    expect(report.mappedCount).toBe(report.baselineCommandCount);
  });
});
