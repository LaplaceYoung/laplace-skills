import fs from 'node:fs';

import { describe, expect, it } from 'vitest';

import { bundleHtmlContract } from '../../scripts/runtime/contract-adapters.js';
import { bundleStandaloneHtml } from '../../scripts/exports/bundle-standalone.js';

describe('bundleStandaloneHtml', () => {
  it('creates a standalone output path and writes bundled html', async () => {
    const outputPath = 'tmp/sample-artifact.standalone.html';
    const result = await bundleStandaloneHtml({
      inputPath: 'tests/fixtures/sample-artifact/index.html',
      outputPath
    });

    expect(result.inputPath).toBe('tests/fixtures/sample-artifact/index.html');
    expect(result.outputPath).toBe(outputPath);
    expect(result.assetsInlined).toBe(0);
    expect(fs.existsSync(outputPath)).toBe(true);
    expect(fs.readFileSync(outputPath, 'utf8')).toContain('Sample Artifact');
  });

  it('returns a bundle-html contract response with checksum evidence', async () => {
    const result = await bundleHtmlContract({
      correlationId: 'corr-export-1',
      artifactId: 'artifact-sample',
      outputPath: 'tmp/sample-artifact.contract.html',
      inlineAssets: true,
      inputPath: 'tests/fixtures/sample-artifact/index.html'
    });

    expect(result.commandId).toBe('export.bundle_html.v1');
    expect(result.filePath).toBe('tmp/sample-artifact.contract.html');
    expect(result.checksum).toHaveLength(64);
    expect(fs.existsSync(result.filePath)).toBe(true);
  });
});
