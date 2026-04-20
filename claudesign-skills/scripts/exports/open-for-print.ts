export async function openForPrint(input: {
  htmlPath: string;
  outputPath: string;
  paperSize?: 'A4' | 'Letter';
}) {
  return {
    htmlPath: input.htmlPath,
    outputPath: input.outputPath,
    paperSize: input.paperSize ?? 'A4',
    pageCount: 1
  };
}
