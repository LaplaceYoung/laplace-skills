export async function generatePptx(input: {
  htmlPath: string;
  mode: 'editable' | 'screenshots';
  outputPath?: string;
}) {
  return {
    htmlPath: input.htmlPath,
    mode: input.mode,
    outputPath: input.outputPath ?? `export/${input.mode}.pptx`,
    slideCount: 1
  };
}
