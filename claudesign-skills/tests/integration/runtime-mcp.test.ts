import { describe, expect, it } from 'vitest';

import { runtimeServerDescription } from '../../mcp/design-runtime-mcp/src/server.js';
import {
  buildQuestionsContract,
  getPublicFileUrl,
  saveTemplateContract,
  setProjectTitle
} from '../../scripts/runtime/contract-adapters.js';

describe('buildDesignQuestionSchema', () => {
  it('includes variation and context prompts in the intake schema', () => {
    const schema = buildQuestionsContract({
      correlationId: 'corr-1',
      projectId: 'project-1',
      prompt: 'Design a landing page'
    });
    expect(schema.commandId).toBe('runtime.questions.build.v1');
    expect(schema.questions.some((q) => q.id === 'variation_count')).toBe(true);
    expect(schema.questions.some((q) => q.id === 'context_source')).toBe(true);
    expect(runtimeServerDescription.tools).toHaveLength(4);
  });

  it('creates a persisted template-save contract response', async () => {
    const result = await saveTemplateContract({
      correlationId: 'corr-2',
      projectId: 'project-template',
      templateName: 'deck-template',
      sourceArtifactPath: 'tests/fixtures/sample-artifact/index.html'
    });
    expect(result.commandId).toBe('runtime.template.save.v1');
    expect(result.templateId).toContain('deck-template');
    expect(result.version).toBeGreaterThan(0);
  });

  it('writes a project title manifest once and resolves a fetchable local public file url', async () => {
    const projectId = `project-runtime-${Date.now()}`;
    const manifest = await setProjectTitle({
      projectId,
      title: 'Claude Design Runtime'
    });

    expect(manifest.projectId).toBe(projectId);
    expect(manifest.title).toBe('Claude Design Runtime');
    expect(manifest.changed).toBe(true);

    const unchanged = await setProjectTitle({
      projectId,
      title: 'A different title'
    });

    expect(unchanged.title).toBe('Claude Design Runtime');
    expect(unchanged.changed).toBe(false);

    const publicFile = await getPublicFileUrl('tests/fixtures/sample-artifact/index.html');
    expect(publicFile.url).toContain('http://127.0.0.1:');
    expect(publicFile.url).toContain('/public/');

    const response = await fetch(publicFile.url);
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(body).toContain('Sample Artifact');
  });
});
