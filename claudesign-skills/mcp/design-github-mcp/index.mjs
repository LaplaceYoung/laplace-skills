import { launchPackageServer } from '../../scripts/mcp/launch-package-server.mjs';

launchPackageServer({
  importMetaUrl: import.meta.url,
  scriptRelativePath: 'scripts/mcp/github-server.ts',
  label: '[design-github-mcp]'
});
