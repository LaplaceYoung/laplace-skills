import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import {
  runDoneGateContract,
  runVerifierContract
} from '../runtime/contract-adapters.js';
import { connectStdio, toolResult } from './server-helpers.js';

async function main() {
  const server = new McpServer({
    name: 'design-verifier-mcp',
    version: '0.1.0'
  });

  server.registerTool(
    'done_gate',
    {
      description: 'Run the done gate against a preview artifact path.',
      inputSchema: {
        correlationId: z.string(),
        previewSessionId: z.string(),
        path: z.string(),
        checklist: z.array(z.string()).optional()
      }
    },
    async (args) => toolResult(await runDoneGateContract(args))
  );

  server.registerTool(
    'run_verifier',
    {
      description: 'Run the Claude Design verifier on a built artifact.',
      inputSchema: {
        correlationId: z.string(),
        artifactId: z.string(),
        path: z.string(),
        mode: z.enum(['sweep', 'directed']),
        task: z.string().optional()
      }
    },
    async (args) => toolResult(await runVerifierContract(args))
  );

  await connectStdio(server);
}

void main();
