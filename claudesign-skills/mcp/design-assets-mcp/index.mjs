import { launchPackageServer } from '../../scripts/mcp/launch-package-server.mjs';

launchPackageServer({
  importMetaUrl: import.meta.url,
  scriptRelativePath: 'scripts/mcp/assets-server.ts',
  label: '[design-assets-mcp]'
});
