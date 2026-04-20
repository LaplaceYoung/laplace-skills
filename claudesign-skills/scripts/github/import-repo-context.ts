import fs from 'node:fs/promises';
import path from 'node:path';

export function parseGithubUrl(repoUrl: string) {
  const normalizedUrl = repoUrl.replace(/\.git$/, '');
  const match = normalizedUrl.match(/github\.com[:/](?<owner>[^/]+)\/(?<repo>[^/]+)$/i);

  if (!match?.groups) {
    throw new Error(`Unsupported GitHub URL: ${repoUrl}`);
  }

  return {
    owner: match.groups.owner,
    repo: match.groups.repo
  };
}

export async function importRepoContext(input: { repoUrl: string; dest: string }) {
  const repo = parseGithubUrl(input.repoUrl);
  const manifestPath = path.join(input.dest, 'repo-context.json');
  const absoluteManifestPath = path.resolve(process.cwd(), manifestPath);

  await fs.mkdir(path.dirname(absoluteManifestPath), { recursive: true });
  await fs.writeFile(
    absoluteManifestPath,
    JSON.stringify(
      {
        source: 'github',
        repoUrl: input.repoUrl,
        owner: repo.owner,
        repo: repo.repo,
        importedAt: new Date().toISOString()
      },
      null,
      2
    ) + '\n',
    'utf8'
  );

  return {
    repoUrl: input.repoUrl,
    dest: input.dest,
    imported: [manifestPath.replace(/\\/g, '/')]
  };
}
