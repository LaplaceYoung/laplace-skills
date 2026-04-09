# CHANGELOG

## 2026-04-09
- Initialized `ai-pm-skills-suite` scaffold.
- Added skill family directories and shared template.
- Added initial planning doc under `.omx/plans/`.
- Upgraded plan to consensus final with Hybrid A+B roadmap.
- Added Sprint 0 governance artifacts: contract, versioning, go/no-go checklist.
- Added backup / restore scripts and snapshot workspace.
- Restore drill passed using snapshot `20260409-201835`; pre-restore snapshot `20260409-201850` captured automatically.
- Added rubric v1, reviewer/evidence fields, hallucination adjudication flow, and v1 release-ready standard.
- Fixed backup/restore directory-copy behavior to avoid nested duplicate folders.
- Restore drill v4 passed using snapshot `20260409-202459-395`; pre-restore snapshot `20260409-202459-770` captured automatically.
- Upgraded the shared skill template, contract, playbook, and quality checklist to require explicit task clarity, tool categories, and activation conditions.
- Authored all 8 component skill files with engineering-grade workflow, tool-category rules, failure modes, quality checks, and example prompts.
- Added PRD-specific template guidance based on `需求文档基础模版.pdf` and the other local requirement PDFs.
- Added realistic sample input files for discovery, PRD, prioritization, evaluation, KPI, meeting synthesis, and retro dry-runs.
- Added strict output schema blocks, measurable quality gates, and clearer tool gating rules across the skill suite.
- Added cross-skill routing guidance and review evidence at `workspace/review-evidence-2026-04-09.md`.
- Added `workspace/ai-slop-cleanup-report-2026-04-09.md` for bounded deslop evidence.
- Added per-skill `references/` folders with sanitized guidance distilled from confidential local PDF/XLSX attachments.
- Kept all original attachments outside the skill suite; stored only abstracted patterns, schemas, and decision rules.
