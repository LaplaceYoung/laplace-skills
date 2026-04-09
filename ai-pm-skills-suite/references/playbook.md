# Playbook

## Purpose
Operational guidance for using and evolving the AI PM skill suite.

## Authoring rules
1. Every skill must describe the PM task clearly enough that another agent can execute it without guessing.
2. Every skill must include tool categories, activation conditions, do-not-use conditions, and a numbered workflow.
3. Prefer artifact-first outputs: PRD, prioritization table, KPI memo, retro summary, decision log.
4. If the request depends on current facts, official product details, or external market status, enable web research explicitly; otherwise prefer local evidence and no-browse reasoning.
5. When the user gives PDFs, requirement docs, spreadsheets, or notes, treat local file extraction as the primary evidence path.

## Common tool categories
- Local docs/files: shell reads, PDF extraction, local note inspection
- Structured docs: Markdown drafting, checklists, tables, templates
- Data analysis: metric computation, spreadsheet reading, scoring matrices
- Web research: latest facts, competitors, official docs, current pricing or policy
- No-browse reasoning: synthesis from already-provided materials

## Cross-skill routing matrix
| Entry skill | Typical next skill | Handoff artifact |
| --- | --- | --- |
| `01-discovery-research` | `02-prd-spec-generation` or `04-roadmap-prioritization` | discovery brief / evidence gap list |
| `02-prd-spec-generation` | `04-roadmap-prioritization` or `05-meeting-review-synthesis` | PRD / review focus list |
| `03-evaluation-experiment-review` | `06-kpi-analytics` or `07-launch-retro` | verdict memo / bad-case table |
| `05-meeting-review-synthesis` | `02-prd-spec-generation` or `04-roadmap-prioritization` | decisions / action items / unresolved issues |
| `06-kpi-analytics` | `03-evaluation-experiment-review` or `07-launch-retro` | KPI memo / anomaly notes |
| `08-shared-utilities` | any other skill | rubric / template / checklist / routing advice |

## Promotion rule
A skill is not promotion-ready until its example inputs, output shape, and checklist can be validated by another reviewer without hidden context.
