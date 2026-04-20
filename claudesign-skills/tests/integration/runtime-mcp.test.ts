import { describe, expect, it } from 'vitest';

import { runtimeServerDescription } from '../../mcp/design-runtime-mcp/src/server.js';
import { buildQuestionsContract, saveTemplateContract } from '../../scripts/runtime/contract-adapters.js';

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
    expect(runtimeServerDescription.tools).toHaveLength(2);
  });

  it('creates a template-save contract response', () => {
    const result = saveTemplateContract({
      correlationId: 'corr-2',
      projectId: 'project-1',
      templateName: 'deck-template',
      sourceArtifactPath: 'tests/fixtures/sample-artifact/index.html'
    });
    expect(result.commandId).toBe('runtime.template.save.v1');
    expect(result.templateId).toContain('deck-template');
  });
});
