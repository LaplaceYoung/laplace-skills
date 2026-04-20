import type {
  AssetInput,
  BuildQuestionsReq,
  BuildQuestionsResp,
  BundleHtmlReq,
  BundleHtmlResp,
  CreateArtifactReq,
  CreateArtifactResp,
  DoneGateReq,
  DoneGateResp,
  ExportPdfReq,
  ExportPdfResp,
  ExportPptxReq,
  ExportPptxResp,
  InitialContractCommandId,
  InspectPreviewReq,
  InspectPreviewResp,
  OpenPreviewReq,
  OpenPreviewResp,
  RegisterAssetsReq,
  RegisterAssetsResp,
  RunVerifierReq,
  RunVerifierResp,
  SaveTemplateReq,
  SaveTemplateResp,
  UnregisterAssetsReq,
  UnregisterAssetsResp
} from './commands.js';
import { INITIAL_CONTRACT_COMMAND_IDS } from './commands.js';
import type { ContractErrorCode, ContractOwner } from './enums.js';
import { PHASE0_LIFECYCLE_FREEZE, type ContractLifecycleMetadata } from './lifecycle.js';

export interface ContractPayloadSchema<TPayload extends object> {
  typeName: string;
  required: ReadonlyArray<keyof TPayload & string>;
  optional: ReadonlyArray<keyof TPayload & string>;
}

export interface ContractCommandSchema<
  TCommandId extends InitialContractCommandId,
  TRequest extends object,
  TResponse extends object
> {
  id: TCommandId;
  capability: string;
  owner: ContractOwner;
  lifecycle: ContractLifecycleMetadata;
  correlationId: 'required-in-out';
  request: ContractPayloadSchema<TRequest>;
  response: ContractPayloadSchema<TResponse>;
  errorCodes: ReadonlyArray<ContractErrorCode>;
}

const payloadSchema = <TPayload extends object>(
  typeName: string,
  required: ReadonlyArray<keyof TPayload & string>,
  optional: ReadonlyArray<keyof TPayload & string> = []
): ContractPayloadSchema<TPayload> => ({
  typeName,
  required,
  optional
});

const defineCommand = <
  TCommandId extends InitialContractCommandId,
  TRequest extends object,
  TResponse extends object
>(schema: ContractCommandSchema<TCommandId, TRequest, TResponse>) => schema;

const lifecycle = PHASE0_LIFECYCLE_FREEZE;

export const INITIAL_CONTRACT_CATALOG = [
  defineCommand<'runtime.questions.build.v1', BuildQuestionsReq, BuildQuestionsResp>({
    id: 'runtime.questions.build.v1',
    capability: 'questions_v2',
    owner: 'runtime',
    lifecycle,
    correlationId: 'required-in-out',
    request: payloadSchema<BuildQuestionsReq>(
      'BuildQuestionsReq',
      ['correlationId', 'projectId', 'prompt'],
      ['templateId']
    ),
    response: payloadSchema<BuildQuestionsResp>(
      'BuildQuestionsResp',
      ['correlationId', 'commandId', 'questions', 'generatedAt']
    ),
    errorCodes: ['VALIDATION', 'CONTRACT_VERSION', 'INTERNAL']
  }),
  defineCommand<'runtime.template.save.v1', SaveTemplateReq, SaveTemplateResp>({
    id: 'runtime.template.save.v1',
    capability: 'save_as_template',
    owner: 'runtime',
    lifecycle,
    correlationId: 'required-in-out',
    request: payloadSchema<SaveTemplateReq>(
      'SaveTemplateReq',
      ['correlationId', 'projectId', 'templateName', 'sourceArtifactPath'],
      ['tags']
    ),
    response: payloadSchema<SaveTemplateResp>(
      'SaveTemplateResp',
      ['correlationId', 'commandId', 'templateId', 'version', 'savedAt']
    ),
    errorCodes: ['VALIDATION', 'CONFLICT', 'INTERNAL']
  }),
  defineCommand<'assets.register.v1', RegisterAssetsReq, RegisterAssetsResp>({
    id: 'assets.register.v1',
    capability: 'register_assets',
    owner: 'assets',
    lifecycle,
    correlationId: 'required-in-out',
    request: payloadSchema<RegisterAssetsReq>('RegisterAssetsReq', [
      'correlationId',
      'projectId',
      'assets'
    ]),
    response: payloadSchema<RegisterAssetsResp>('RegisterAssetsResp', [
      'correlationId',
      'commandId',
      'registered'
    ]),
    errorCodes: ['VALIDATION', 'CONFLICT', 'IO', 'INTERNAL']
  }),
  defineCommand<'assets.unregister.v1', UnregisterAssetsReq, UnregisterAssetsResp>({
    id: 'assets.unregister.v1',
    capability: 'unregister_assets',
    owner: 'assets',
    lifecycle,
    correlationId: 'required-in-out',
    request: payloadSchema<UnregisterAssetsReq>(
      'UnregisterAssetsReq',
      ['correlationId', 'projectId', 'assetIds'],
      ['reason']
    ),
    response: payloadSchema<UnregisterAssetsResp>(
      'UnregisterAssetsResp',
      ['correlationId', 'commandId', 'removedAssetIds']
    ),
    errorCodes: ['VALIDATION', 'CONFLICT', 'IO', 'INTERNAL']
  }),
  defineCommand<'artifact.create.v1', CreateArtifactReq, CreateArtifactResp>({
    id: 'artifact.create.v1',
    capability: 'html_artifact_create',
    owner: 'artifacts',
    lifecycle,
    correlationId: 'required-in-out',
    request: payloadSchema<CreateArtifactReq>(
      'CreateArtifactReq',
      ['correlationId', 'projectId', 'artifactKind', 'entryHtml'],
      ['assetIds']
    ),
    response: payloadSchema<CreateArtifactResp>(
      'CreateArtifactResp',
      ['correlationId', 'commandId', 'artifactId', 'manifestPath', 'createdAt']
    ),
    errorCodes: ['VALIDATION', 'STATE', 'INTERNAL']
  }),
  defineCommand<'preview.open.v1', OpenPreviewReq, OpenPreviewResp>({
    id: 'preview.open.v1',
    capability: 'show_html',
    owner: 'preview',
    lifecycle,
    correlationId: 'required-in-out',
    request: payloadSchema<OpenPreviewReq>(
      'OpenPreviewReq',
      ['correlationId', 'artifactId', 'entryUrl'],
      ['viewport']
    ),
    response: payloadSchema<OpenPreviewResp>(
      'OpenPreviewResp',
      ['correlationId', 'commandId', 'previewSessionId', 'status', 'openedAt']
    ),
    errorCodes: ['STATE', 'ENGINE', 'TIMEOUT']
  }),
  defineCommand<'preview.inspect.v1', InspectPreviewReq, InspectPreviewResp>({
    id: 'preview.inspect.v1',
    capability: 'get_webview_logs',
    owner: 'preview',
    lifecycle,
    correlationId: 'required-in-out',
    request: payloadSchema<InspectPreviewReq>(
      'InspectPreviewReq',
      ['correlationId', 'previewSessionId', 'includeConsole'],
      ['includeDomSummary']
    ),
    response: payloadSchema<InspectPreviewResp>(
      'InspectPreviewResp',
      ['correlationId', 'commandId', 'console', 'capturedAt'],
      ['domSummary']
    ),
    errorCodes: ['STATE', 'ENGINE', 'TIMEOUT']
  }),
  defineCommand<'verify.done_gate.v1', DoneGateReq, DoneGateResp>({
    id: 'verify.done_gate.v1',
    capability: 'done',
    owner: 'verifier',
    lifecycle,
    correlationId: 'required-in-out',
    request: payloadSchema<DoneGateReq>(
      'DoneGateReq',
      ['correlationId', 'previewSessionId'],
      ['checklist']
    ),
    response: payloadSchema<DoneGateResp>(
      'DoneGateResp',
      ['correlationId', 'commandId', 'status', 'findings'],
      ['reportPath']
    ),
    errorCodes: ['STATE', 'ENGINE', 'ASSERTION']
  }),
  defineCommand<'verify.run.v1', RunVerifierReq, RunVerifierResp>({
    id: 'verify.run.v1',
    capability: 'fork_verifier_agent',
    owner: 'verifier',
    lifecycle,
    correlationId: 'required-in-out',
    request: payloadSchema<RunVerifierReq>(
      'RunVerifierReq',
      ['correlationId', 'artifactId', 'mode'],
      ['task']
    ),
    response: payloadSchema<RunVerifierResp>(
      'RunVerifierResp',
      ['correlationId', 'commandId', 'verdict', 'issues', 'reportPath']
    ),
    errorCodes: ['STATE', 'ENGINE', 'ASSERTION', 'INTERNAL']
  }),
  defineCommand<'export.pptx.v1', ExportPptxReq, ExportPptxResp>({
    id: 'export.pptx.v1',
    capability: 'gen_pptx',
    owner: 'export',
    lifecycle,
    correlationId: 'required-in-out',
    request: payloadSchema<ExportPptxReq>(
      'ExportPptxReq',
      ['correlationId', 'artifactId', 'mode', 'outputPath']
    ),
    response: payloadSchema<ExportPptxResp>(
      'ExportPptxResp',
      ['correlationId', 'commandId', 'filePath', 'slideCount']
    ),
    errorCodes: ['STATE', 'EXPORT', 'IO']
  }),
  defineCommand<'export.bundle_html.v1', BundleHtmlReq, BundleHtmlResp>({
    id: 'export.bundle_html.v1',
    capability: 'super_inline_html',
    owner: 'export',
    lifecycle,
    correlationId: 'required-in-out',
    request: payloadSchema<BundleHtmlReq>(
      'BundleHtmlReq',
      ['correlationId', 'artifactId', 'outputPath', 'inlineAssets']
    ),
    response: payloadSchema<BundleHtmlResp>(
      'BundleHtmlResp',
      ['correlationId', 'commandId', 'filePath', 'checksum']
    ),
    errorCodes: ['STATE', 'EXPORT', 'IO']
  }),
  defineCommand<'export.pdf_print.v1', ExportPdfReq, ExportPdfResp>({
    id: 'export.pdf_print.v1',
    capability: 'open_for_print',
    owner: 'export',
    lifecycle,
    correlationId: 'required-in-out',
    request: payloadSchema<ExportPdfReq>(
      'ExportPdfReq',
      ['correlationId', 'artifactId', 'outputPath'],
      ['paperSize']
    ),
    response: payloadSchema<ExportPdfResp>(
      'ExportPdfResp',
      ['correlationId', 'commandId', 'filePath', 'pageCount']
    ),
    errorCodes: ['STATE', 'EXPORT', 'IO']
  })
] as const;

export function getCommandSchemaById(commandId: InitialContractCommandId) {
  return INITIAL_CONTRACT_CATALOG.find((schema) => schema.id === commandId);
}

export function hasPhase0Coverage(): boolean {
  return INITIAL_CONTRACT_COMMAND_IDS.every((commandId) =>
    INITIAL_CONTRACT_CATALOG.some((schema) => schema.id === commandId)
  );
}

export type Phase0CommandSchema = (typeof INITIAL_CONTRACT_CATALOG)[number];

export type SupportedAssetKind = AssetInput['kind'];