import fs from 'node:fs';

import type {
  RegisterAssetsReq,
  RegisterAssetsResp,
  BundleHtmlReq,
  BundleHtmlResp,
  BuildQuestionsReq,
  BuildQuestionsResp,
  CreateArtifactReq,
  CreateArtifactResp,
  DoneGateReq,
  DoneGateResp,
  ExportPdfReq,
  ExportPdfResp,
  ExportPptxReq,
  ExportPptxResp,
  InspectPreviewResp,
  OpenPreviewReq,
  OpenPreviewResp,
  PreviewConsoleEntry,
  RunVerifierReq,
  RunVerifierResp,
  SaveTemplateReq,
  SaveTemplateResp,
  UnregisterAssetsReq,
  UnregisterAssetsResp,
  VerifierIssue
} from '../../packages/contracts/src/commands.js';

import { openPreview } from '../preview/preview-open.js';
import { runDoneGate } from '../preview/done-gate.js';
import { runVerifier } from '../verifier/run-verifier.js';
import { buildDesignQuestionSchema } from '../questions/build-question-schema.js';
import { bundleStandaloneHtml } from '../exports/bundle-standalone.js';
import { generatePptx } from '../exports/gen-pptx.js';
import { openForPrint } from '../exports/open-for-print.js';
import { registerAssets, unregisterAssets } from '../asset-registry/registry.js';
import { createArtifact } from '../artifacts/create-artifact.js';
import {
  getPublicFileUrl as resolvePublicFileUrl,
  saveTemplate,
  setProjectTitleManifest
} from './template-store.js';
import { presentFsItemForDownload as presentDownloadItem } from '../exports/present-download.js';

function normalizeProjectId(projectId: string) {
  const normalized = projectId.trim();

  if (normalized.length === 0) {
    throw new Error('projectId must contain at least one visible character');
  }

  return normalized;
}

export function buildQuestionsContract(input: BuildQuestionsReq): BuildQuestionsResp {
  const schema = buildDesignQuestionSchema();
  return {
    correlationId: input.correlationId,
    commandId: 'runtime.questions.build.v1',
    questions: schema.questions.map((question) => ({
      id: question.id,
      title: question.title,
      kind: question.kind
    })),
    generatedAt: new Date().toISOString()
  };
}

export async function saveTemplateContract(input: SaveTemplateReq): Promise<SaveTemplateResp> {
  const saved = await saveTemplate({
    projectId: normalizeProjectId(input.projectId),
    templateName: input.templateName,
    sourceArtifactPath: input.sourceArtifactPath,
    tags: input.tags
  });

  return {
    correlationId: input.correlationId,
    commandId: 'runtime.template.save.v1',
    templateId: saved.templateId,
    version: saved.version,
    savedAt: saved.savedAt
  };
}

export async function setProjectTitle(input: { projectId: string; title: string }) {
  return await setProjectTitleManifest({
    projectId: normalizeProjectId(input.projectId),
    title: input.title.trim()
  });
}

export async function getPublicFileUrl(filePath: string) {
  return await resolvePublicFileUrl(filePath);
}

export async function presentFsItemForDownload(input?: { path?: string; label?: string }) {
  return await presentDownloadItem(input);
}

export async function registerAssetsContract(
  input: RegisterAssetsReq
): Promise<RegisterAssetsResp> {
  const result = await registerAssets(normalizeProjectId(input.projectId), input.assets);

  return {
    correlationId: input.correlationId,
    commandId: 'assets.register.v1',
    registered: result.registered
  };
}

export async function unregisterAssetsContract(
  input: UnregisterAssetsReq
): Promise<UnregisterAssetsResp> {
  const result = await unregisterAssets(normalizeProjectId(input.projectId), input.assetIds);

  return {
    correlationId: input.correlationId,
    commandId: 'assets.unregister.v1',
    removedAssetIds: result.removedAssetIds
  };
}

export async function createArtifactContract(
  input: CreateArtifactReq
): Promise<CreateArtifactResp> {
  const projectId = normalizeProjectId(input.projectId);
  const result = await createArtifact({
    projectId,
    artifactKind: input.artifactKind,
    entryHtml: input.entryHtml,
    assetIds: input.assetIds
  });

  return {
    correlationId: input.correlationId,
    commandId: 'artifact.create.v1',
    artifactId: result.artifactId,
    manifestPath: result.manifestPath,
    createdAt: result.createdAt
  };
}

export async function openPreviewContract(input: OpenPreviewReq): Promise<OpenPreviewResp> {
  const result = await openPreview({ path: input.entryUrl });
  return {
    correlationId: input.correlationId,
    commandId: 'preview.open.v1',
    previewSessionId: result.previewSessionId,
    status: result.status === 'opened' ? 'opened' : 'reused',
    openedAt: new Date().toISOString()
  };
}

export async function inspectPreviewContract(input: {
  correlationId: string;
  path: string;
  previewSessionId: string;
  includeConsole: boolean;
  includeDomSummary?: boolean;
}): Promise<InspectPreviewResp> {
  const gate = await runDoneGate({ path: input.path });
  const consoleEntries: PreviewConsoleEntry[] = input.includeConsole
    ? gate.consoleErrors.map((message) => ({ level: 'error', message }))
    : [];

  return {
    correlationId: input.correlationId,
    commandId: 'preview.inspect.v1',
    console: consoleEntries,
    domSummary: input.includeDomSummary ? `preview:${input.previewSessionId}` : undefined,
    capturedAt: new Date().toISOString()
  };
}

export async function runDoneGateContract(input: DoneGateReq & { path: string }): Promise<DoneGateResp> {
  const result = await runDoneGate({ path: input.path });
  return {
    correlationId: input.correlationId,
    commandId: 'verify.done_gate.v1',
    status: result.status === 'clean' ? 'pass' : 'fail',
    findings: result.consoleErrors,
    reportPath: result.reportPath
  };
}

export async function runVerifierContract(input: RunVerifierReq & { path: string }): Promise<RunVerifierResp> {
  const result = await runVerifier({ path: input.path, task: input.task });
  const issues: VerifierIssue[] = result.findings.map((detail, index) => ({
    code: `ISSUE_${index + 1}`,
    severity: result.verdict === 'fail' ? 'high' : 'low',
    detail
  }));

  return {
    correlationId: input.correlationId,
    commandId: 'verify.run.v1',
    verdict: result.verdict,
    issues,
    reportPath: result.reportPath
  };
}

export async function bundleHtmlContract(
  input: BundleHtmlReq & { inputPath: string }
): Promise<BundleHtmlResp> {
  const result = await bundleStandaloneHtml({
    inputPath: input.inputPath,
    outputPath: input.outputPath
  });

  return {
    correlationId: input.correlationId,
    commandId: 'export.bundle_html.v1',
    filePath: result.outputPath,
    checksum: result.checksum
  };
}

export async function exportPptxContract(
  input: ExportPptxReq & { htmlPath: string }
): Promise<ExportPptxResp> {
  const result = await generatePptx({
    htmlPath: input.htmlPath,
    mode: input.mode,
    outputPath: input.outputPath
  });

  return {
    correlationId: input.correlationId,
    commandId: 'export.pptx.v1',
    filePath: result.outputPath,
    slideCount: result.slideCount
  };
}

export async function exportPdfContract(
  input: ExportPdfReq & { htmlPath: string }
): Promise<ExportPdfResp> {
  const result = await openForPrint({
    htmlPath: input.htmlPath,
    outputPath: input.outputPath,
    paperSize: input.paperSize
  });

  return {
    correlationId: input.correlationId,
    commandId: 'export.pdf_print.v1',
    filePath: result.outputPath,
    pageCount: result.pageCount
  };
}

export function reportExists(reportPath: string): boolean {
  return fs.existsSync(reportPath);
}
