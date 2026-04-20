import { describe, expect, it } from 'vitest';

import { runtimeServerDescription } from '../../mcp/design-runtime-mcp/src/server.js';
import { buildDesignQuestionSchema } from '../../scripts/questions/build-question-schema.js';

describe('buildDesignQuestionSchema', () => {
  it('includes variation and context prompts in the intake schema', () => {
    const schema = buildDesignQuestionSchema();
    expect(schema.title).toBeTruthy();
    expect(schema.questions.some((q: { id: string }) => q.id === 'variation_count')).toBe(true);
    expect(schema.questions.some((q: { id: string }) => q.id === 'context_source')).toBe(true);
    expect(runtimeServerDescription.tools).toHaveLength(2);
  });
});
