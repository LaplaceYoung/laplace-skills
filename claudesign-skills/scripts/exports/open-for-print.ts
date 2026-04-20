import fs from 'node:fs/promises';
import path from 'node:path';

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

import { extractSlidesFromHtml } from './html-slide-model.js';
import { resolveProjectPath, toProjectRelativePath } from '../runtime/path-safety.js';

function sanitizePdfText(value: string) {
  return value.replace(/[^\u0000-\u00ff]/g, '?');
}

export async function openForPrint(input: {
  htmlPath: string;
  outputPath: string;
  paperSize?: 'A4' | 'Letter';
}) {
  const absoluteOutputPath = resolveProjectPath(input.outputPath, 'PDF output path');
  const { slides } = await extractSlidesFromHtml(input.htmlPath);

  await fs.mkdir(path.dirname(absoluteOutputPath), { recursive: true });

  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const pageSize =
    input.paperSize === 'Letter'
      ? ([612, 792] as const)
      : ([595.28, 841.89] as const);

  slides.forEach((slideModel) => {
    const page = pdf.addPage(pageSize);
    const { width: pageWidth, height: pageHeight } = page.getSize();

    page.drawRectangle({
      x: 32,
      y: 42,
      width: pageWidth - 64,
      height: pageHeight - 84,
      borderWidth: 1,
      borderColor: rgb(0.84, 0.78, 0.72),
      color: rgb(0.98, 0.97, 0.95)
    });
    page.drawText(sanitizePdfText(slideModel.label), {
      x: 52,
      y: pageHeight - 82,
      size: 12,
      font,
      color: rgb(0.49, 0.37, 0.26)
    });
    page.drawText(sanitizePdfText(slideModel.title), {
      x: 52,
      y: pageHeight - 122,
      size: 26,
      font,
      color: rgb(0.09, 0.11, 0.16)
    });
    page.drawText(sanitizePdfText(slideModel.body.join('\n') || 'Content captured from the HTML artifact.'), {
      x: 52,
      y: pageHeight - 180,
      size: 14,
      font,
      color: rgb(0.2, 0.25, 0.32),
      maxWidth: pageWidth - 104,
      lineHeight: 20
    });

    if (slideModel.notes) {
      page.drawText(sanitizePdfText(`Speaker notes: ${slideModel.notes}`), {
        x: 52,
        y: 90,
        size: 11,
        font,
        color: rgb(0.45, 0.26, 0.09),
        maxWidth: pageWidth - 104,
        lineHeight: 16
      });
    }

    page.drawText(sanitizePdfText(`Source HTML: ${input.htmlPath}`), {
      x: 52,
      y: 54,
      size: 10,
      font,
      color: rgb(0.38, 0.45, 0.54)
    });
  });

  const bytes = await pdf.save();
  await fs.writeFile(absoluteOutputPath, bytes);

  return {
    htmlPath: input.htmlPath,
    outputPath: toProjectRelativePath(absoluteOutputPath),
    pageCount: slides.length
  };
}
