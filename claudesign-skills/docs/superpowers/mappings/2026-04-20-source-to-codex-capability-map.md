# 2026-04-20 Source to Codex Capability Map

Canonical mapping for Phase 0 contract freeze.

| Source Function | Codex Capability | Command ID | Owner | Lifecycle |
| --- | --- | --- | --- | --- |
| `questions_v2` | `questions_v2` | `runtime.questions.build.v1` | `runtime` | `active` |
| `save_as_template` | `save_as_template` | `runtime.template.save.v1` | `runtime` | `active` |
| `register_assets` | `register_assets` | `assets.register.v1` | `assets` | `active` |
| `unregister_assets` | `unregister_assets` | `assets.unregister.v1` | `assets` | `active` |
| `copy_starter_component` | `html_artifact_create` | `artifact.create.v1` | `artifacts` | `active` |
| `show_html` | `show_html` | `preview.open.v1` | `preview` | `active` |
| `get_webview_logs` | `get_webview_logs` | `preview.inspect.v1` | `preview` | `active` |
| `done` | `done` | `verify.done_gate.v1` | `verifier` | `active` |
| `fork_verifier_agent` | `fork_verifier_agent` | `verify.run.v1` | `verifier` | `active` |
| `gen_pptx` | `gen_pptx` | `export.pptx.v1` | `export` | `active` |
| `super_inline_html` | `super_inline_html` | `export.bundle_html.v1` | `export` | `active` |
| `open_for_print` | `open_for_print` | `export.pdf_print.v1` | `export` | `active` |
