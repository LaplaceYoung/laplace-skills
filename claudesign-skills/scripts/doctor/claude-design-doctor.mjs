import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const repoRoot = process.cwd();
const reportDir = path.join(repoRoot, 'artifacts', 'doctor');
const reportPath = path.join(reportDir, 'doctor-report.json');

const requiredPaths = [
  '.agents/plugins/marketplace.json',
  'plugins/claude-design/.codex-plugin/plugin.json',
  'plugins/claude-design-github/.codex-plugin/plugin.json',
  'skills/claude-design-core/SKILL.md'
];

const mcpPackages = [
  'design-runtime-mcp',
  'design-preview-mcp',
  'design-assets-mcp',
  'design-verifier-mcp',
  'design-github-mcp'
];

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readJson(relativePath) {
  const raw = fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
  return JSON.parse(raw.replace(/^\uFEFF/, ''));
}

async function checkMcpProtocol(relativeMainPath) {
  const absolutePath = path.join(repoRoot, relativeMainPath);
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [absolutePath],
    cwd: repoRoot,
    stderr: 'pipe'
  });
  const client = new Client({
    name: 'claude-design-doctor',
    version: '0.1.0'
  });

  try {
    await client.connect(transport);
    const tools = await client.listTools();
    return {
      ok: true,
      toolCount: tools.tools.length,
      toolNames: tools.tools.map((tool) => tool.name)
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : String(error)
    };
  } finally {
    await transport.close().catch(() => undefined);
  }
}

async function checkLauncherLiveness(relativeMainPath) {
  const absolutePath = path.join(repoRoot, relativeMainPath);
  return await new Promise((resolve) => {
    const child = spawn(process.execPath, [absolutePath], {
      cwd: repoRoot,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let stderr = '';
    let resolved = false;

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('exit', (code, signal) => {
      if (resolved) {
        return;
      }
      resolved = true;
      resolve({ ok: false, code, signal, stderr: stderr.trim() });
    });

    wait(1200).then(() => {
      if (resolved) {
        return;
      }
      resolved = true;
      child.kill('SIGTERM');
      resolve({ ok: true, code: null, signal: 'SIGTERM', stderr: stderr.trim() });
    });
  });
}

async function main() {
  const pathChecks = requiredPaths.map((relativePath) => ({
    path: relativePath,
    exists: fs.existsSync(path.join(repoRoot, relativePath))
  }));

  const mcpChecks = [];

  for (const packageName of mcpPackages) {
    const manifest = readJson(path.join('mcp', packageName, 'package.json'));
    const relativeMainPath = path.join('mcp', packageName, manifest.main);
    const mainExists = fs.existsSync(path.join(repoRoot, relativeMainPath));
    const launch = mainExists
      ? await checkLauncherLiveness(relativeMainPath)
      : { ok: false, code: null, signal: null, stderr: 'main entry missing' };
    const protocol = mainExists
      ? await checkMcpProtocol(relativeMainPath)
      : { ok: false, message: 'main entry missing' };

    mcpChecks.push({
      packageName,
      main: relativeMainPath.replaceAll('\\', '/'),
      mainExists,
      launch,
      protocol
    });
  }

  const marketplace = readJson('.agents/plugins/marketplace.json');

  const report = {
    generatedAt: new Date().toISOString(),
    pluginCount: marketplace.plugins.length,
    pluginNames: marketplace.plugins.map((plugin) => plugin.name),
    pathChecks,
    mcpChecks,
    ok:
      pathChecks.every((item) => item.exists) &&
      mcpChecks.every((item) => item.mainExists && item.launch.ok && item.protocol.ok)
  };

  fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n', 'utf8');
  console.log(JSON.stringify(report, null, 2));

  if (!report.ok) {
    process.exit(1);
  }
}

void main();
