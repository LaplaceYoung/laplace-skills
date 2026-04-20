import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import {
  inspectPreviewContract,
  openPreviewContract
} from '../runtime/contract-adapters.js';
import { connectStdio, toolResult } from './server-helpers.js';

async function main() {
  const server = new McpServer({
    name: 'design-preview-mcp',
    version: '0.1.0'
  });

  server.registerTool(
    'open_preview',
    {
      description: 'Open a design artifact for preview and return a preview session id.',
      inputSchema: {
        correlationId: z.string(),
        artifactId: z.string(),
        entryUrl: z.string(),
        viewport: z
          .object({
            width: z.number(),
            height: z.number()
          })
          .optional()
      }
    },
    async (args) => toolResult(await openPreviewContract(args))
  );

  server.registerTool(
    'inspect_preview',
    {
      description: 'Inspect a preview session for console findings and DOM summary.',
      inputSchema: {
        correlationId: z.string(),
        path: z.string(),
        previewSessionId: z.string(),
        includeConsole: z.boolean(),
        includeDomSummary: z.boolean().optional()
      }
    },
    async (args) => toolResult(await inspectPreviewContract(args))
  );

  await connectStdio(server);
}

void main();
