import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

export async function bundleStandaloneHtml(input: { inputPath: string; outputPath: string }) {
  const sourcePath = path.resolve(process.cwd(), input.inputPath);
  const targetPath = path.resolve(process.cwd(), input.outputPath);
  const content = await fs.readFile(sourcePath, 'utf8');

  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.writeFile(targetPath, content, 'utf8');

  return {
    inputPath: input.inputPath,
    outputPath: input.outputPath,
    assetsInlined: 0,
    checksum: crypto.createHash('sha256').update(content).digest('hex')
  };
}
