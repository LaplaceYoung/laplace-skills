import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

export function toolResult(payload: Record<string, unknown>) {
  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(payload, null, 2)
      }
    ],
    structuredContent: payload
  };
}

export async function connectStdio(server: { connect: (transport: StdioServerTransport) => Promise<void> }) {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
