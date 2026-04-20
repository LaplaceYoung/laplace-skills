export const INITIAL_CONTRACT_COMMAND_IDS = [
  'runtime.questions.build.v1',
  'runtime.template.save.v1',
  'assets.register.v1',
  'assets.unregister.v1',
  'artifact.create.v1',
  'preview.open.v1',
  'preview.inspect.v1',
  'verify.done_gate.v1',
  'verify.run.v1',
  'export.pptx.v1',
  'export.bundle_html.v1',
  'export.pdf_print.v1'
] as const;

export type InitialContractCommandId = (typeof INITIAL_CONTRACT_COMMAND_IDS)[number];

export interface BuildQuestionsReq {
  correlationId: string;
  projectId: string;
  prompt: string;
  templateId?: string;
}

export interface QuestionPrompt {
  id: string;
  title: string;
  kind: 'freeform' | 'slider' | 'text-options';
}

export interface BuildQuestionsResp {
  correlationId: string;
  commandId: 'runtime.questions.build.v1';
  questions: QuestionPrompt[];
  generatedAt: string;
}

export interface SaveTemplateReq {
  correlationId: string;
  projectId: string;
  templateName: string;
  sourceArtifactPath: string;
  tags?: string[];
}

export interface SaveTemplateResp {
  correlationId: string;
  commandId: 'runtime.template.save.v1';
  templateId: string;
  version: number;
  savedAt: string;
}

export interface AssetInput {
  path: string;
  kind: 'image' | 'video' | 'font' | 'other';
  label?: string;
}

export interface AssetRecord {
  assetId: string;
  path: string;
  kind: AssetInput['kind'];
}

export interface RegisterAssetsReq {
  correlationId: string;
  projectId: string;
  assets: AssetInput[];
}

export interface RegisterAssetsResp {
  correlationId: string;
  commandId: 'assets.register.v1';
  registered: AssetRecord[];
}

export interface UnregisterAssetsReq {
  correlationId: string;
  projectId: string;
  assetIds: string[];
  reason?: string;
}

export interface UnregisterAssetsResp {
  correlationId: string;
  commandId: 'assets.unregister.v1';
  removedAssetIds: string[];
}

export interface CreateArtifactReq {
  correlationId: string;
  projectId: string;
  artifactKind: 'prototype' | 'deck' | 'animation' | 'design-system';
  entryHtml: string;
  assetIds?: string[];
}

export interface CreateArtifactResp {
  correlationId: string;
  commandId: 'artifact.create.v1';
  artifactId: string;
  manifestPath: string;
  createdAt: string;
}

export interface OpenPreviewReq {
  correlationId: string;
  artifactId: string;
  entryUrl: string;
  viewport?: {
    width: number;
    height: number;
  };
}

export interface OpenPreviewResp {
  correlationId: string;
  commandId: 'preview.open.v1';
  previewSessionId: string;
  status: 'opened' | 'reused';
  openedAt: string;
}

export interface PreviewConsoleEntry {
  level: 'log' | 'info' | 'warn' | 'error';
  message: string;
}

export interface InspectPreviewReq {
  correlationId: string;
  previewSessionId: string;
  includeConsole: boolean;
  includeDomSummary?: boolean;
}

export interface InspectPreviewResp {
  correlationId: string;
  commandId: 'preview.inspect.v1';
  console: PreviewConsoleEntry[];
  domSummary?: string;
  capturedAt: string;
}

export interface DoneGateReq {
  correlationId: string;
  previewSessionId: string;
  checklist?: string[];
}

export interface DoneGateResp {
  correlationId: string;
  commandId: 'verify.done_gate.v1';
  status: 'pass' | 'fail';
  findings: string[];
  reportPath?: string;
}

export interface RunVerifierReq {
  correlationId: string;
  artifactId: string;
  mode: 'sweep' | 'directed';
  task?: string;
}

export interface VerifierIssue {
  code: string;
  severity: 'low' | 'medium' | 'high';
  detail: string;
}

export interface RunVerifierResp {
  correlationId: string;
  commandId: 'verify.run.v1';
  verdict: 'pass' | 'warn' | 'fail';
  issues: VerifierIssue[];
  reportPath: string;
}

export interface ExportPptxReq {
  correlationId: string;
  artifactId: string;
  mode: 'editable' | 'screenshots';
  outputPath: string;
}

export interface ExportPptxResp {
  correlationId: string;
  commandId: 'export.pptx.v1';
  filePath: string;
  slideCount: number;
}

export interface BundleHtmlReq {
  correlationId: string;
  artifactId: string;
  outputPath: string;
  inlineAssets: boolean;
}

export interface BundleHtmlResp {
  correlationId: string;
  commandId: 'export.bundle_html.v1';
  filePath: string;
  checksum: string;
}

export interface ExportPdfReq {
  correlationId: string;
  artifactId: string;
  outputPath: string;
  paperSize?: 'A4' | 'Letter';
}

export interface ExportPdfResp {
  correlationId: string;
  commandId: 'export.pdf_print.v1';
  filePath: string;
  pageCount: number;
}