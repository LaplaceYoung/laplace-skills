import fs from 'node:fs/promises';
import path from 'node:path';

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const REPO_ROOT = path.resolve(process.cwd());

async function withClient<T>(
  commandArgs: string[],
  action: (client: Client) => Promise<T>
) {
  const transport = new StdioClientTransport({
    command: 'cmd',
    args: ['/c', 'pnpm', '--dir', REPO_ROOT, 'exec', 'tsx', ...commandArgs],
    cwd: REPO_ROOT,
    stderr: 'pipe'
  });
  const client = new Client({
    name: 'claude-design-demo',
    version: '0.1.0'
  });

  await client.connect(transport);

  try {
    return await action(client);
  } finally {
    await transport.close();
  }
}

function parseToolResult(result: Awaited<ReturnType<Client['callTool']>>) {
  if ('structuredContent' in result && result.structuredContent) {
    return result.structuredContent;
  }

  const text = result.content.find((item) => item.type === 'text');
  return text ? JSON.parse(text.text) : {};
}

async function runDemo() {
  const runtimeResult = await withClient(['scripts/mcp/runtime-server.ts'], async (client) => {
    const tools = await client.listTools();
    const title = await client.callTool({
      name: 'set_project_title',
      arguments: {
        projectId: 'modal-transition-yang-meng',
        title: '模态跃迁｜杨萌个人宣传页'
      }
    });
    const questions = await client.callTool({
      name: 'build_questions',
      arguments: {
        correlationId: 'demo-runtime-questions',
        projectId: 'modal-transition-yang-meng',
        prompt: '为模态跃迁公司的杨萌制作公司个人页面宣传页，减少卡片，采用编辑化单页。'
      }
    });

    return {
      tools: tools.tools.map((tool) => tool.name),
      title: parseToolResult(title),
      questions: parseToolResult(questions)
    };
  });

  const previewResult = await withClient(['scripts/mcp/preview-server.ts'], async (client) => {
    const opened = await client.callTool({
      name: 'open_preview',
      arguments: {
        correlationId: 'demo-preview-open',
        artifactId: 'yang-meng-profile',
        entryUrl: 'examples/yang-meng-profile/index.html'
      }
    });
    const openPayload = parseToolResult(opened) as Record<string, unknown>;
    const inspected = await client.callTool({
      name: 'inspect_preview',
      arguments: {
        correlationId: 'demo-preview-inspect',
        path: 'examples/yang-meng-profile/index.html',
        previewSessionId: openPayload.previewSessionId,
        includeConsole: true,
        includeDomSummary: true
      }
    });

    return {
      open: openPayload,
      inspect: parseToolResult(inspected)
    };
  });

  const verifierResult = await withClient(['scripts/mcp/verifier-server.ts'], async (client) => {
    const doneGate = await client.callTool({
      name: 'done_gate',
      arguments: {
        correlationId: 'demo-done-gate',
        previewSessionId: 'yang-meng-preview',
        path: 'examples/yang-meng-profile/index.html'
      }
    });
    const verifier = await client.callTool({
      name: 'run_verifier',
      arguments: {
        correlationId: 'demo-verifier',
        artifactId: 'yang-meng-profile',
        path: 'examples/yang-meng-profile/index.html',
        mode: 'directed',
        task: '检查个人宣传页的信息层级、控制台错误与结构完整性。'
      }
    });

    return {
      doneGate: parseToolResult(doneGate),
      verifier: parseToolResult(verifier)
    };
  });

  const report = {
    generatedAt: new Date().toISOString(),
    artifactPath: 'examples/yang-meng-profile/index.html',
    runtimeResult,
    previewResult,
    verifierResult
  };

  const reportPath = path.resolve(REPO_ROOT, 'artifacts/demo/yang-meng-mcp-run-report.json');
  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2) + '\n', 'utf8');
  console.log(JSON.stringify(report, null, 2));
}

void runDemo();
