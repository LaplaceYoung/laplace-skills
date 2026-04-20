import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import {
  buildQuestionsContract,
  getPublicFileUrl,
  saveTemplateContract,
  setProjectTitle
} from '../runtime/contract-adapters.js';
import { connectStdio, toolResult } from './server-helpers.js';

async function main() {
  const server = new McpServer({
    name: 'design-runtime-mcp',
    version: '0.1.0'
  });

  server.registerTool(
    'build_questions',
    {
      description: 'Build the Claude Design intake question schema for a new project.',
      inputSchema: {
        correlationId: z.string(),
        projectId: z.string(),
        prompt: z.string(),
        templateId: z.string().optional()
      }
    },
    async (args) => toolResult(buildQuestionsContract(args))
  );

  server.registerTool(
    'save_template',
    {
      description: 'Persist a reusable template manifest for the current project artifact.',
      inputSchema: {
        correlationId: z.string(),
        projectId: z.string(),
        templateName: z.string(),
        sourceArtifactPath: z.string(),
        tags: z.array(z.string()).optional()
      }
    },
    async (args) => toolResult(await saveTemplateContract(args))
  );

  server.registerTool(
    'get_public_url',
    {
      description: 'Create a short-lived locally fetchable URL for a project file.',
      inputSchema: {
        projectRelativeFilePath: z.string()
      }
    },
    async ({ projectRelativeFilePath }) =>
      toolResult(await getPublicFileUrl(projectRelativeFilePath))
  );

  server.registerTool(
    'set_project_title',
    {
      description: 'Persist the project title once so downstream artifacts use a stable name.',
      inputSchema: {
        projectId: z.string(),
        title: z.string()
      }
    },
    async (args) => toolResult(await setProjectTitle(args))
  );

  await connectStdio(server);
}

void main();
