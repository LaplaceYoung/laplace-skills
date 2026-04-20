import fs from 'node:fs';
import fsp from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

import { resolveProjectPath, toPortablePath } from './path-safety.js';

type PublicUrlEntry = {
  token: string;
  projectRelativeFilePath: string;
  absolutePath: string;
  expiresAt: string;
};

const PUBLIC_URL_TTL_MS = 60 * 60 * 1000;
const publicUrlRegistry = new Map<string, PublicUrlEntry>();

let serverInfoPromise:
  | Promise<{
      port: number;
      close: () => Promise<void>;
    }>
  | undefined;

function contentTypeForFile(filePath: string) {
  const extension = path.extname(filePath).toLowerCase();

  switch (extension) {
    case '.html':
      return 'text/html; charset=utf-8';
    case '.css':
      return 'text/css; charset=utf-8';
    case '.js':
      return 'application/javascript; charset=utf-8';
    case '.json':
      return 'application/json; charset=utf-8';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.svg':
      return 'image/svg+xml';
    case '.pdf':
      return 'application/pdf';
    case '.pptx':
      return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
    default:
      return 'application/octet-stream';
  }
}

async function persistPublicUrlEntry(entry: PublicUrlEntry) {
  const registryPath = path.resolve(process.cwd(), 'tmp/runtime/public-urls', `${entry.token}.json`);
  await fsp.mkdir(path.dirname(registryPath), { recursive: true });
  await fsp.writeFile(registryPath, JSON.stringify(entry, null, 2) + '\n', 'utf8');
}

async function ensurePublicUrlServer() {
  if (serverInfoPromise) {
    return await serverInfoPromise;
  }

  serverInfoPromise = new Promise((resolve, reject) => {
    const server = http.createServer((request, response) => {
      const baseUrl = `http://${request.headers.host ?? '127.0.0.1'}`;
      const requestUrl = new URL(request.url ?? '/', baseUrl);
      const segments = requestUrl.pathname.split('/').filter(Boolean);

      if (segments[0] !== 'public' || segments.length < 2) {
        response.writeHead(404).end('Not found');
        return;
      }

      const token = segments[1];
      const entry = publicUrlRegistry.get(token);

      if (!entry) {
        response.writeHead(404).end('Unknown token');
        return;
      }

      if (Date.now() > Date.parse(entry.expiresAt)) {
        publicUrlRegistry.delete(token);
        response.writeHead(410).end('Expired token');
        return;
      }

      if (!fs.existsSync(entry.absolutePath)) {
        response.writeHead(404).end('Missing file');
        return;
      }

      response.writeHead(200, {
        'Content-Type': contentTypeForFile(entry.absolutePath),
        'Cache-Control': 'private, max-age=300',
        'Content-Disposition': `inline; filename="${path.basename(entry.absolutePath)}"`
      });

      fs.createReadStream(entry.absolutePath).pipe(response);
    });

    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();

      if (!address || typeof address === 'string') {
        reject(new Error('Failed to resolve public URL server address'));
        return;
      }

      resolve({
        port: address.port,
        close: async () =>
          await new Promise<void>((closeResolve, closeReject) => {
            server.close((error) => {
              if (error) {
                closeReject(error);
                return;
              }

              closeResolve();
            });
          })
      });
    });
  });

  return await serverInfoPromise;
}

export async function getPublicFileUrl(projectRelativeFilePath: string) {
  const absolutePath = resolveProjectPath(projectRelativeFilePath, 'Public file path');
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + PUBLIC_URL_TTL_MS).toISOString();
  const serverInfo = await ensurePublicUrlServer();
  const entry: PublicUrlEntry = {
    token,
    projectRelativeFilePath,
    absolutePath,
    expiresAt
  };

  publicUrlRegistry.set(token, entry);
  await persistPublicUrlEntry(entry);

  return {
    url: `http://127.0.0.1:${serverInfo.port}/public/${token}/${encodeURIComponent(path.basename(absolutePath))}`,
    expiresAt,
    projectRelativeFilePath,
    absolutePath: toPortablePath(absolutePath)
  };
}
