import fs from 'node:fs';

import { describe, expect, it } from 'vitest';

import {
  exportPdfContract,
  exportPptxContract,
  getPublicFileUrl,
  presentFsItemForDownload
} from '../../scripts/runtime/contract-adapters.js';

describe('export conformance contracts', () => {
  it('generates a real pptx artifact in editable and screenshot modes', async () => {
    const editable = await exportPptxContract({
      correlationId: 'corr-pptx-1',
      artifactId: 'artifact-prototype',
      mode: 'editable',
      outputPath: 'tmp/exports/editable-demo.pptx',
      htmlPath: 'tests/fixtures/sample-deck/index.html'
    });

    expect(editable.commandId).toBe('export.pptx.v1');
    expect(editable.slideCount).toBe(2);
    expect(fs.existsSync(editable.filePath)).toBe(true);

    const screenshots = await exportPptxContract({
      correlationId: 'corr-pptx-2',
      artifactId: 'artifact-deck',
      mode: 'screenshots',
      outputPath: 'tmp/exports/screenshots-demo.pptx',
      htmlPath: 'tests/fixtures/sample-deck/index.html'
    });

    expect(screenshots.slideCount).toBe(2);
    expect(fs.existsSync(screenshots.filePath)).toBe(true);
  });

  it('generates a real pdf artifact and presents it for download', async () => {
    const pdf = await exportPdfContract({
      correlationId: 'corr-pdf-1',
      artifactId: 'artifact-system',
      outputPath: 'tmp/exports/design-system.pdf',
      htmlPath: 'tests/fixtures/sample-deck/index.html',
      paperSize: 'A4'
    });

    expect(pdf.commandId).toBe('export.pdf_print.v1');
    expect(pdf.pageCount).toBe(2);
    expect(fs.existsSync(pdf.filePath)).toBe(true);

    const presented = await presentFsItemForDownload({ path: pdf.filePath, label: 'PDF handoff' });
    expect(presented.itemKind).toBe('file');
    expect(presented.label).toBe('PDF handoff');
    expect(presented.exists).toBe(true);
    expect(presented.downloadPath).toBe(pdf.filePath);
  });

  it('zips folders and the whole project for download presentation', async () => {
    const folderDownload = await presentFsItemForDownload({
      path: 'tests/fixtures/sample-artifact',
      label: 'Sample artifact'
    });

    expect(folderDownload.itemKind).toBe('folder');
    expect(folderDownload.label).toBe('Sample artifact');
    expect(folderDownload.downloadPath).toContain('.zip');
    expect(fs.existsSync(folderDownload.absoluteDownloadPath)).toBe(true);

    const projectDownload = await presentFsItemForDownload();
    expect(projectDownload.itemKind).toBe('project');
    expect(projectDownload.label).toBe('Project');
    expect(projectDownload.downloadPath).toBe('tmp/downloads/project.zip');
    expect(fs.existsSync(projectDownload.absoluteDownloadPath)).toBe(true);
  });

  it('confines export and public-url paths to the project root', async () => {
    await expect(
      exportPptxContract({
        correlationId: 'corr-pptx-escape',
        artifactId: 'artifact-escape',
        mode: 'editable',
        outputPath: '../escape.pptx',
        htmlPath: 'examples/prototype/index.html'
      })
    ).rejects.toThrow(/escaped root/i);

    await expect(getPublicFileUrl('../outside.html')).rejects.toThrow(/escaped root/i);
    await expect(presentFsItemForDownload({ path: '../outside' })).rejects.toThrow(/escaped root/i);
  });
});
