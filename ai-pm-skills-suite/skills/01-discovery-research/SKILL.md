---
name: discovery-research
description: 将模糊想法转成问题定义、用户场景、研究假设和证据计划
version: v0.1
template_version: 1.1
owner: xiaoz
cn_title: 需求发现与研究
en_alias: discovery-research
skill_family: research
primary_artifact: discovery brief
---

# 目标 / Objective
- Job-to-be-done: 把“想做一个 AI 功能/产品”的模糊想法，整理成可进入 PRD 或优先级评审的发现性结论。
- Primary user: AI 产品经理、产品 owner、0→1 功能负责人。
- Success definition: 输出一份可执行的 discovery brief，至少包含问题背景、目标用户、关键场景、假设、证据缺口、后续决策问题。

# 触发信号 / Trigger signals
- 用户说“帮我梳理需求背景”“先做 discovery”“先搞清楚用户问题”。
- 用户只有零散想法、会议纪要、访谈笔记、竞品印象，没有成型 PRD。
- 需要在写 PRD 之前先确认：问题值不值得做、谁最痛、证据还缺什么。

# 启用条件 / Activation conditions
- Must-have context: 至少具备产品方向、目标人群、一个业务场景或一组原始材料中的任意两项。
- Evidence threshold: 如果没有明确问题对象，先抽取用户/角色/流程；如果没有事实证据，必须输出证据缺口而不是假装结论充分。
- Stop and ask user when: 连目标用户、业务目标、输出用途都没有，导致 discovery brief 无法落地时。

# 不启用条件 / Do not use when
- 用户已经给出成熟 PRD，只需要格式化或补全模板，此时优先用 `02-prd-spec-generation`。
- 用户已经在比较多个方案的优先级和版本节奏，此时优先用 `04-roadmap-prioritization`。

# 输入要求 / Inputs
## Required
- 产品方向或功能主题
- 目标用户/业务对象（可粗粒度）
- 已有原始材料：会议笔记 / 需求碎片 / PDF / 截图 / 口头描述

## Optional
- 竞品名称或对标产品
- 当前业务指标 / 痛点数据
- 明确的时间窗口或版本计划

## Assumptions to declare
- 哪些结论是推断、哪些来自明确证据
- 竞品/市场信息是否需要最新外部信息验证

# 本地参考 / Local references
- `references/discovery-patterns-sanitized.md`：discovery brief 的标准结构、问题定义框架、证据缺口表
- `references/user-scenario-patterns-sanitized.md`：用户场景的写法模式与 AI 需求常见场景模板
- `references/source-coverage.md`：本 skill 可使用的脱敏来源覆盖说明

# Tools 类型类别与启用规则 / Tool categories
| Category | Typical tool types | Enable when | Avoid when | Expected evidence |
| --- | --- | --- | --- | --- |
| Local docs/files | shell / file read / pdf text extraction | 用户提供了 PDF、访谈记录、内部需求文档 | 没有本地材料时不要硬读空目录 | 提取到的原文要点、来源文件名 |
| Structured docs | markdown / table / checklist writing | 需要输出 discovery brief、问题树、场景表 | 仅做口头 brainstorm 时可不展开复杂表格 | 结构化 discovery brief |
| Data analysis | spreadsheet / simple counts / scoring | 用户给了指标、问卷、样本量或问题频次 | 没有数据时不要伪造量化结论 | 指标摘要、样本限制 |
| Web research | web search / official docs / competitor pages | 用户明确要做竞品扫描、且信息可能过时 | 仅整理本地材料且不依赖最新事实时 | 竞品或市场证据链接 / 来源 |
| No-browse reasoning | direct synthesis only | 本地信息已足够支撑问题定义和假设整理 | 一旦涉及“最新”“竞品现状”“行业现在怎么做”就不能只靠记忆 | 明确写出基于已给材料的推断 |

# 任务流程 / Workflow
1. Intake and scope check
   - 确认这是 discovery 阶段，而不是 PRD/排期/复盘阶段。
   - 标出输出用途：给谁看、下一步要支持什么决策。
2. Evidence collection / tool selection
   - 优先读取本地材料：需求文档、PDF、会议笔记、表格。
   - 若用户要求竞品/最新趋势，再启用 web research。
3. Problem framing
   - 归纳需求背景、目标用户、当前工作流、核心痛点、替代方案。
   - 用 JTBD 视角表达用户想完成什么任务、当前阻碍是什么。
4. Hypothesis and gap analysis
   - 列出关键假设：价值假设、行为假设、可行性假设。
   - 列出证据缺口：需要进一步访谈、日志、数据、竞品验证的点。
5. Artifact generation
   - 输出 discovery brief：背景、用户场景、问题定义、机会点、研究清单、下一步建议。
6. Self-check and final response
   - 检查是否把推断和证据分开写清楚。
   - 若证据不足，明确写“待验证”，不要把猜测写成事实。

# 输出物 / Outputs
- Primary artifact: discovery brief
- Supporting tables or checklists: 用户场景表、痛点优先级、证据缺口清单、研究问题清单
- Decision / recommendation summary: 建议是否进入 PRD，还是先补访谈/数据
- Follow-up / escalation path: 进入 `02-prd-spec-generation` 或补充调研任务

# 严格输出结构 / Strict output schema
- Required sections: 需求背景、目标用户、核心场景、问题定义、关键假设、证据缺口、下一步建议
- Required tables / fields: 至少一张“用户场景表”或“证据缺口表”
- Minimal completion rule: 至少写出 3 个核心场景或明确说明为什么暂时不足 3 个

# 失败模式 / Failure modes
- missing_context: 连基本用户对象或业务目标都缺失，只能先列待确认问题。
- conflicting_constraints: 用户既要求快速上线又要求高风险场景零误判，需要标记冲突并要求取舍。
- low_confidence: 证据只有主观判断，没有日志/样本/访谈支撑。
- out_of_scope: 用户实际要的是详细 PRD、排期、或上线复盘。

# 质量检查 / Quality checks
- Contract compliance target: 必须产出背景、用户、场景、问题、假设、证据缺口、下一步建议。
- Artifact completeness target: 至少 3 个核心场景或明确说明场景不足。
- Measurable gate: rubric >= 85/100，format compliance >= 95%，缺失必填章节数 = 0。
- Bilingual consistency target: 关键术语中英别名一致，不混淆对象。
- Hallucination guard: 未验证竞品/行业事实一律标注“需外部验证”。

# Example prompt
请基于这个想法做一份 discovery brief：我们想在报告编辑器里加一个 AI 审核助手，帮工程师发现数据冲突、规范缺失和表达风险。现有材料只有几条销售反馈、一个旧版需求文档和客服记录。请输出用户场景、核心问题、关键假设、证据缺口、是否值得进入 PRD。

# Expected output shape
- 需求背景 / 当前问题
- 目标用户与核心场景表
- 问题定义与 JTBD
- 关键假设与证据缺口
- 建议动作（进入 PRD / 先补研究）
