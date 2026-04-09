---
name: shared-utilities
description: 统一管理本技能库可复用的模板、rubric、检查表和辅助输出规范
version: v0.1
template_version: 1.1
owner: xiaoz
cn_title: 共享工具与规范
en_alias: shared-utilities
skill_family: utilities
primary_artifact: reusable utility package
---

# 目标 / Objective
- Job-to-be-done: 为整套 AI PM skills 提供统一可复用的模板、rubric、检查表、格式规范和调用建议。
- Primary user: 维护技能库的人，以及其他 skill 的作者与调用者。
- Success definition: 输出可被其他 skill 直接引用的共享能力，而不是重复造轮子。

# 触发信号 / Trigger signals
- 用户说“抽共享模板”“统一规范”“补充通用 rubric / checklist / helper”。
- 发现多个技能都在重复写相似的结构、评分方法或输出模板。
- 需要维护整套 skill suite 的一致性。

# 启用条件 / Activation conditions
- Must-have context: 至少已有两个以上 skill 或共享文档需要统一。
- Evidence threshold: 若只是一处局部问题，优先直接改具体 skill，而不是过早抽工具层。
- Stop and ask user when: 不清楚要统一的是模板、评分规则还是输出格式。

# 不启用条件 / Do not use when
- 用户要的是具体一个技能的正文内容，而不是共享规范。
- 需求尚未稳定，抽象共享层会过度设计。

# 输入要求 / Inputs
## Required
- 需要统一的对象：模板 / rubric / checklist / helper / 命名规范
- 至少两个引用场景或重复问题

## Optional
- 现有参考文档
- 维护策略或版本策略

## Assumptions to declare
- 共享层服务的是哪些 skill
- 抽象后哪些差异仍保留在具体 skill 内

# 本地参考 / Local references
- `references/common-prd-patterns-sanitized.md`：整套技能可复用的写作规则和表格模式
- `references/spreadsheet-patterns-sanitized.md`：从工作台表格抽象出的字段组织方式
- `references/source-coverage.md`：本 skill 可使用的脱敏来源覆盖说明

# Tools 类型类别与启用规则 / Tool categories
| Category | Typical tool types | Enable when | Avoid when | Expected evidence |
| --- | --- | --- | --- | --- |
| Local docs/files | shell / file read / diff review | 需要比对多个 skill 的重复结构 | 没有重复模式时 | 引用场景与重复点 |
| Structured docs | templates / rubrics / checklists | 需要沉淀统一规范 | 单点小修时 | 共享文档 |
| Data analysis | simple frequency / issue count | 需要判断哪些问题最常重复 | 没有足够样本时 | 重复问题列表 |
| Web research | web search / official docs verification | 只有在要对齐外部标准、公开框架规范或最新平台约束时启用 | 常规内部技能规范默认禁用 | 外部标准来源 |
| No-browse reasoning | direct synthesis only | 绝大多数共享规范都来自本地 suite | 需要最新外部规范时 | 本地归纳结论 |

# 任务流程 / Workflow
1. Intake and duplication check
   - 明确是要抽模板、评分规则、检查表还是输出标准。
2. Evidence collection
   - 对比多个 skill 和 reference 文档，找重复点和不一致点。
3. Utility design
   - 决定哪些留在共享层，哪些保留在具体 skill。
4. Artifact generation
   - 输出模板 / rubric / checklist / helper 使用说明。
5. Integration guidance
   - 明确哪些 skill 应该如何引用该共享资产。
   - 维护跨 skill 路由矩阵：入口 skill、下一跳 skill、交接产物。
6. Self-check
   - 防止抽象过度，导致具体 skill 失去业务语义。

# 输出物 / Outputs
- Primary artifact: reusable utility package / guidance note
- Supporting tables or checklists: 引用矩阵、适用范围、版本说明
- Decision / recommendation summary: 哪些能力应该共享，哪些不该抽象
- Follow-up / escalation path: 更新模板、更新校验脚本、回改具体 skill

# 严格输出结构 / Strict output schema
- Required sections: 共享对象范围、重复问题、共享资产清单、引用建议、风险与后续动作
- Required tables / fields: 至少一张“技能路由矩阵”或“共享资产引用矩阵”
- Minimal completion rule: 至少列出 2 个共享资产和 2 个调用场景

# 失败模式 / Failure modes
- missing_context: 没有足够重复样本。
- conflicting_constraints: 共享化与业务差异化冲突。
- low_confidence: 抽象层定义过早，可能反复重构。
- out_of_scope: 用户其实要写具体 skill 正文。

# 质量检查 / Quality checks
- Contract compliance target: 必须说明适用范围、引用方式、版本策略。
- Artifact completeness target: 至少列出 2 个调用场景。
- Measurable gate: rubric >= 85/100，format compliance >= 95%，缺失必填章节数 = 0。
- Bilingual consistency target: 共享资产命名统一。
- Hallucination guard: 不要虚构“全员共识规范”。

# Example prompt
请帮我把这套 AI PM skills 里重复出现的评分规则、输出结构和检查项抽成共享工具，并说明哪些 skill 应该复用它们、哪些不该抽太高。

# Expected output shape
- 共享对象范围
- 重复问题与抽象理由
- 共享资产清单
- 引用建议
- 风险与后续动作
