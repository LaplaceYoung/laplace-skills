import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function launchPackageServer({ importMetaUrl, scriptRelativePath, label }) {
  const currentDir = path.dirname(fileURLToPath(importMetaUrl));
  const repoRoot = path.resolve(currentDir, '../..');
  const scriptPath = path.resolve(repoRoot, scriptRelativePath);
  const command = process.platform === 'win32' ? 'cmd' : 'pnpm';
  const args =
    process.platform === 'win32'
      ? ['/c', 'pnpm', 'exec', 'tsx', scriptPath]
      : ['exec', 'tsx', scriptPath];

  const child = spawn(command, args, {
    cwd: repoRoot,
    stdio: 'inherit'
  });

  const forwardSignal = (signal) => {
    if (!child.killed) {
      child.kill(signal);
    }
  };

  process.on('SIGINT', () => forwardSignal('SIGINT'));
  process.on('SIGTERM', () => forwardSignal('SIGTERM'));

  child.on('exit', (code) => {
    process.exit(code ?? 0);
  });

  child.on('error', (error) => {
    console.error(`${label} launcher failed`, error);
    process.exit(1);
  });
}
