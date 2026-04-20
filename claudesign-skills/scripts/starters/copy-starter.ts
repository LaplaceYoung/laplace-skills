import fs from 'node:fs/promises';
import path from 'node:path';

export async function copyStarterComponent(input: { kind: string; directory?: string }) {
  const source = path.join(process.cwd(), 'templates/starter-components', input.kind);
  const targetDir = path.join(process.cwd(), input.directory ?? '.');
  const target = path.join(targetDir, input.kind);
  const content = await fs.readFile(source, 'utf8');
  await fs.mkdir(targetDir, { recursive: true });
  await fs.writeFile(target, content, 'utf8');
  return { path: path.relative(process.cwd(), target).replace(/\\/g, '/'), content };
}
