import fs from 'node:fs/promises';
import path from 'node:path';

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import {
  importRepoContext,
  parseGithubUrl
} from '../github/import-repo-context.js';
import { connectStdio, toolResult } from './server-helpers.js';

async function main() {
  const server = new McpServer({
    name: 'design-github-mcp',
    version: '0.1.0'
  });

  server.registerTool(
    'parse_repo_url',
    {
      description: 'Parse a GitHub repo URL into owner/repo coordinates.',
      inputSchema: {
        repoUrl: z.string()
      }
    },
    async ({ repoUrl }) => toolResult(parseGithubUrl(repoUrl) as Record<string, unknown>)
  );

  server.registerTool(
    'import_repo_context',
    {
      description: 'Import a GitHub repo manifest into the local workspace.',
      inputSchema: {
        repoUrl: z.string(),
        dest: z.string()
      }
    },
    async (args) => toolResult(await importRepoContext(args))
  );

  server.registerTool(
    'read_imported_context',
    {
      description: 'Read a previously imported GitHub repo context manifest.',
      inputSchema: {
        dest: z.string()
      }
    },
    async ({ dest }) => {
      const manifestPath = path.resolve(process.cwd(), dest, 'repo-context.json');
      return toolResult(JSON.parse(await fs.readFile(manifestPath, 'utf8')) as Record<string, unknown>);
    }
  );

  await connectStdio(server);
}

void main();
