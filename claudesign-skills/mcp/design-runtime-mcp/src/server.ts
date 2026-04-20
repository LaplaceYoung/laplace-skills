export const runtimeServerDescription = {
  name: 'design-runtime-mcp',
  tools: [
    { name: 'build_questions', commandId: 'runtime.questions.build.v1' },
    { name: 'save_template', commandId: 'runtime.template.save.v1' },
    { name: 'get_public_url', commandId: 'runtime.get_public_url.local' },
    { name: 'set_project_title', commandId: 'runtime.set_project_title.local' }
  ]
};
