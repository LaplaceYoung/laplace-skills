import { launchPackageServer } from '../../scripts/mcp/launch-package-server.mjs';

launchPackageServer({
  importMetaUrl: import.meta.url,
  scriptRelativePath: 'scripts/mcp/preview-server.ts',
  label: '[design-preview-mcp]'
});
