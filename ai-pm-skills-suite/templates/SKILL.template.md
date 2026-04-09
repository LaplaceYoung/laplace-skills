---
name: <skill-name>
description: <what this skill does>
version: v0.1
template_version: 1.1
owner: <name>
cn_title: <中文标题>
en_alias: <english-alias>
skill_family: <family>
primary_artifact: <main deliverable>
---

# 目标 / Objective
- Job-to-be-done:
- Primary user:
- Success definition:

# 触发信号 / Trigger signals
- Signal 1:
- Signal 2:
- Signal 3:

# 启用条件 / Activation conditions
- Must-have context:
- Evidence threshold:
- Stop and ask user when:

# 不启用条件 / Do not use when
- Case 1:
- Case 2:

# 输入要求 / Inputs
## Required
- input_name:

## Optional
- input_name:

## Assumptions to declare
- assumption:

# Tools 类型类别与启用规则 / Tool categories
| Category | Typical tool types | Enable when | Avoid when | Expected evidence |
| --- | --- | --- | --- | --- |
| Local docs/files | shell / file read / pdf extraction |  |  |  |
| Structured docs | markdown / checklist / tables |  |  |  |
| Data analysis | spreadsheet / scoring / metrics |  |  |  |
| Web research | web search / official docs |  |  |  |
| No-browse reasoning | direct synthesis only |  |  |  |

# 任务流程 / Workflow
1. Intake and scope check
2. Evidence collection / tool selection
3. Core analysis or drafting
4. Artifact generation
5. Self-check and risk note
6. Final response

# 输出物 / Outputs
- Primary artifact:
- Supporting tables or checklists:
- Decision / recommendation summary:
- Follow-up / escalation path:

# 严格输出结构 / Strict output schema
- Required sections:
- Required tables / fields:
- Minimal completion rule:

# 失败模式 / Failure modes
- missing_context:
- conflicting_constraints:
- low_confidence:
- out_of_scope:

# 质量检查 / Quality checks
- Contract compliance target:
- Artifact completeness target:
- Measurable gate: rubric >= 85/100, format compliance >= 95%, missing required sections = 0
- Bilingual consistency target:
- Hallucination guard:

# Example prompt

# Expected output shape
- Section 1
- Section 2
- Section 3
