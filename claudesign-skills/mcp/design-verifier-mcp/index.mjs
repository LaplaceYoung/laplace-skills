import { launchPackageServer } from '../../scripts/mcp/launch-package-server.mjs';

launchPackageServer({
  importMetaUrl: import.meta.url,
  scriptRelativePath: 'scripts/mcp/verifier-server.ts',
  label: '[design-verifier-mcp]'
});
