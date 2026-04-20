import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import {
  registerAssetsContract,
  unregisterAssetsContract
} from '../runtime/contract-adapters.js';
import { connectStdio, toolResult } from './server-helpers.js';

async function main() {
  const server = new McpServer({
    name: 'design-assets-mcp',
    version: '0.1.0'
  });

  server.registerTool(
    'register_assets',
    {
      description: 'Register project assets for downstream artifact creation.',
      inputSchema: {
        correlationId: z.string(),
        projectId: z.string(),
        assets: z.array(
          z.object({
            path: z.string(),
            kind: z.enum(['image', 'video', 'font', 'other']),
            label: z.string().optional()
          })
        )
      }
    },
    async (args) => toolResult(await registerAssetsContract(args))
  );

  server.registerTool(
    'unregister_assets',
    {
      description: 'Remove project assets from the registry.',
      inputSchema: {
        correlationId: z.string(),
        projectId: z.string(),
        assetIds: z.array(z.string()),
        reason: z.string().optional()
      }
    },
    async (args) => toolResult(await unregisterAssetsContract(args))
  );

  await connectStdio(server);
}

void main();
