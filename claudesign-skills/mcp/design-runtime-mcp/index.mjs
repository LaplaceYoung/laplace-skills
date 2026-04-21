import { launchPackageServer } from '../../scripts/mcp/launch-package-server.mjs';

launchPackageServer({
  importMetaUrl: import.meta.url,
  scriptRelativePath: 'scripts/mcp/runtime-server.ts',
  label: '[design-runtime-mcp]'
});
