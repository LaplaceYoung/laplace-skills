import fs from 'node:fs/promises';
import path from 'node:path';

import PptxGenJS from 'pptxgenjs';

import { extractSlidesFromHtml } from './html-slide-model.js';
import { resolveProjectPath, toProjectRelativePath } from '../runtime/path-safety.js';

export async function generatePptx(input: {
  htmlPath: string;
  mode: 'editable' | 'screenshots';
  outputPath?: string;
}) {
  const outputPath = input.outputPath ?? `export/${input.mode}.pptx`;
  const absoluteOutputPath = resolveProjectPath(outputPath, 'PPTX output path');
  const { slides } = await extractSlidesFromHtml(input.htmlPath);

  await fs.mkdir(path.dirname(absoluteOutputPath), { recursive: true });

  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = 'Codex Claude Design parity pack';
  pptx.subject = `Exported from ${input.htmlPath}`;
  pptx.title = slides[0]?.title ?? 'Claude Design export';

  for (const slideModel of slides) {
    const slide = pptx.addSlide();
    const isEditable = input.mode === 'editable';

    slide.background = { color: isEditable ? 'F6F1E8' : '1F2937' };
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.45,
      y: 0.4,
      w: 12.3,
      h: 6.2,
      line: { color: isEditable ? 'D6C7B4' : 'E5E7EB', width: 1.5 },
      fill: { color: isEditable ? 'FBF8F2' : '111827' },
      radius: 0.08
    });
    slide.addText(slideModel.label, {
      x: 0.75,
      y: 0.55,
      w: 3.5,
      h: 0.3,
      fontFace: 'Georgia',
      fontSize: 11,
      color: isEditable ? '7C5E42' : 'D1D5DB',
      italic: true
    });
    slide.addText(slideModel.title, {
      x: 0.75,
      y: 1.05,
      w: 8.8,
      h: 0.7,
      fontFace: 'Aptos Display',
      fontSize: 24,
      bold: true,
      color: isEditable ? '1F2937' : 'F9FAFB'
    });
    slide.addText(
      slideModel.body.length > 0 ? slideModel.body.join('\n') : 'Content captured from the HTML artifact.',
      {
        x: 0.8,
        y: 2.0,
        w: 8.7,
        h: 2.9,
        fontFace: 'Aptos',
        fontSize: 16,
        color: isEditable ? '334155' : 'E5E7EB',
        breakLine: false,
        margin: 0.06,
        valign: 'top'
      }
    );
    slide.addText(`Source HTML: ${input.htmlPath}`, {
      x: 0.8,
      y: 5.7,
      w: 5.8,
      h: 0.28,
      fontFace: 'Aptos',
      fontSize: 9,
      color: isEditable ? '64748B' : '9CA3AF'
    });

    if (slideModel.notes) {
      slide.addText(`Speaker notes: ${slideModel.notes}`, {
        x: 9.7,
        y: 1.2,
        w: 2.5,
        h: 3.3,
        fontFace: 'Aptos',
        fontSize: 10,
        color: isEditable ? '7C2D12' : 'FDE68A',
        margin: 0.05,
        valign: 'top'
      });
    }
  }

  await pptx.writeFile({ fileName: absoluteOutputPath });

  return {
    htmlPath: input.htmlPath,
    mode: input.mode,
    outputPath: toProjectRelativePath(absoluteOutputPath),
    slideCount: slides.length
  };
}
