export function buildDesignQuestionSchema() {
  return {
    title: 'Design intake',
    questions: [
      {
        id: 'context_source',
        kind: 'text-options',
        title: 'Context source',
        options: ['Codebase', 'Screenshot', 'Figma', 'Explore a few options', 'Decide for me', 'Other']
      },
      {
        id: 'variation_count',
        kind: 'slider',
        title: 'Variation count',
        min: 1,
        max: 8,
        step: 1,
        default: 3
      },
      {
        id: 'primary_goal',
        kind: 'freeform',
        title: 'Primary goal'
      }
    ]
  } as const;
}
