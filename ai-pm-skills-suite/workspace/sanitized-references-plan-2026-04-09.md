# Sanitized Skill References Implementation Plan

**Goal:** Create per-skill `references/` folders containing only sanitized, reusable guidance distilled from the local confidential PDF/XLSX attachments.

**Architecture:** Keep original attachments outside the skill suite. For each skill, create 2-3 local reference markdown files covering sanitized patterns and source coverage, then update `SKILL.md` to point to those files. Preserve only abstract structure, writing patterns, and decision rules.

**Tech Stack:** PowerShell, Python (`pypdf`, `openpyxl`), Markdown

---

### Task 1: Extract sanitized patterns
- Files:
  - Read: `*.pdf`, `*.xlsx`
  - Create: `ai-pm-skills-suite/workspace/sanitization-notes-2026-04-09.md`
- Focus:
  - PRD structure, tables, priority logic, page-flow patterns, AI boundary rules
  - Spreadsheet field organization patterns only

### Task 2: Create per-skill references folders
- Files:
  - Create: `ai-pm-skills-suite/skills/*/references/*.md`
- Focus:
  - one main sanitized pattern doc
  - one secondary pattern/workflow doc where needed
  - one `source-coverage.md` per skill

### Task 3: Wire skills to local references
- Files:
  - Modify: `ai-pm-skills-suite/skills/*/SKILL.md`
- Focus:
  - add local reference pointers and when to consult them
  - keep sanitized-only language

### Task 4: Verify and record evidence
- Files:
  - Modify: `ai-pm-skills-suite/workspace/CHANGELOG.md`
  - Modify: `ai-pm-skills-suite/workspace/review-evidence-2026-04-09.md`
- Checks:
  - all 8 skills have `references/`
  - no original attachment files copied under `ai-pm-skills-suite/`
  - metadata validator still passes
