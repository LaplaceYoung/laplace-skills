---
name: roadmap-prioritization
description: 用清晰的价值、成本、风险和依赖关系对需求项做优先级排序与版本编排
version: v0.1
template_version: 1.1
owner: xiaoz
cn_title: 路线图与优先级排序
en_alias: roadmap-prioritization
skill_family: prioritization
primary_artifact: prioritization memo
---

# 目标 / Objective
- Job-to-be-done: 将一组候选需求、功能域或版本备选项，整理成可执行的优先级建议与版本路线图。
- Primary user: 产品经理、产品负责人、跨团队排期 owner。
- Success definition: 输出包含评分逻辑、P0-P4 或等价优先级、依赖关系、版本建议和取舍理由的排序结论。

# 触发信号 / Trigger signals
- 用户说“帮我排优先级”“这些功能先做什么”“做版本规划”。
- 有多项需求需要价值/成本/风险综合排序。
- 评审会前需要一份清楚的取舍说明。

# 启用条件 / Activation conditions
- Must-have context: 至少有候选事项列表 + 粗略目标或约束。
- Evidence threshold: 若没有价值、成本、风险、依赖中的任意两项，只能给初版排序建议并标注低置信。
- Stop and ask user when: 版本时间窗、资源上限、必须上线项完全不明确。

# 不启用条件 / Do not use when
- 用户只想写单一功能的详细 PRD。
- 用户只是在发现问题，还没有形成候选事项列表。

# 输入要求 / Inputs
## Required
- 候选功能/事项列表
- 目标（增长、提效、上线补齐、风险控制等）
- 资源或版本约束

## Optional
- 价值/成本/风险评分
- 依赖关系
- 已有评审意见或业务方偏好

## Assumptions to declare
- 哪些评分来自事实，哪些来自粗估
- 是否采用 P0-P4 或自定义评分框架

# 本地参考 / Local references
- `references/prioritization-patterns-sanitized.md`：排序维度与 P0-P4 抽象定义
- `references/version-planning-patterns-sanitized.md`：版本编排规则和依赖表达方式
- `references/source-coverage.md`：本 skill 可使用的脱敏来源覆盖说明

# Tools 类型类别与启用规则 / Tool categories
| Category | Typical tool types | Enable when | Avoid when | Expected evidence |
| --- | --- | --- | --- | --- |
| Local docs/files | shell / file read / prior PRDs | 有历史 PRD、会议结论、功能池文档 | 没有候选事项时 | 候选项清单来源 |
| Structured docs | markdown / matrices / roadmap tables | 需要输出排序表、版本表、取舍说明 | 仅简单口头判断时 | 评分表与排序结论 |
| Data analysis | spreadsheet / weighted scoring | 有价值、使用频率、成本或风险数据 | 完全无数据时不要伪精确打分 | 评分口径与加权说明 |
| Web research | market scan / official product pages | 排序依赖最新竞品或政策窗口 | 纯内部版本排期 | 外部影响来源 |
| No-browse reasoning | direct synthesis only | 只基于内部需求池做版本编排 | 需要外部趋势判断时 | 内部排序依据 |

# 任务流程 / Workflow
1. Intake and prioritization frame
   - 确认排序目标：上线补齐 / 用户价值 / 商业价值 / 风险防御 / 差异化。
2. Candidate normalization
   - 清理重复项，拆开过大的事项，合并重复描述。
3. Scoring and dependency mapping
   - 至少从价值、成本、风险、依赖四个维度看。
   - 需要时使用 P0-P4：P0 首发必做，P1 快速跟进，P2 中期规划，P3 长期观察，P4 明确不做。
4. Sequencing
   - 给出先后顺序、版本建议、依赖前置项、不可并行项。
5. Trade-off articulation
   - 解释为什么排前、为什么延后、为什么不做。
6. Self-check
   - 检查是否把时间窗、资源上限、依赖关系、风险写清楚。

# 输出物 / Outputs
- Primary artifact: prioritization memo / roadmap proposal
- Supporting tables or checklists: 评分矩阵、P0-P4 表、版本路线图、依赖图
- Decision / recommendation summary: 推荐版本顺序与不做清单
- Follow-up / escalation path: 回写 PRD、补数据、业务复评

# 严格输出结构 / Strict output schema
- Required sections: 排序目标、评分逻辑、优先级结果、版本建议、取舍理由
- Required tables / fields: 至少一张评分矩阵或 P0-P4 分类表
- Minimal completion rule: 每个候选事项都必须有优先级结果或明确标为“信息不足”

# 失败模式 / Failure modes
- missing_context: 候选项或约束太少。
- conflicting_constraints: 高价值项与高风险/高成本项冲突。
- low_confidence: 评分过多依赖主观估计。
- out_of_scope: 用户需要的是详细方案，不是排序。

# 质量检查 / Quality checks
- Contract compliance target: 必须有排序逻辑、优先级、版本建议、取舍理由。
- Artifact completeness target: 至少有排序表和依赖/风险说明。
- Measurable gate: rubric >= 85/100，format compliance >= 95%，未分类候选项数 = 0。
- Bilingual consistency target: 功能名称、版本命名统一。
- Hallucination guard: 未验证的 ROI 或成本不可写成确定数字。

# Example prompt
这里有 12 个 AI 助手相关需求，请帮我做 2 个版本的优先级建议。目标是首发必须可用、第二版提升留存。请给出 P0-P4 分类、排序依据、依赖关系、为什么有些需求不该进首发。

# Expected output shape
- 排序目标与约束
- 评分维度说明
- P0-P4 / 评分矩阵表
- 版本路线图与依赖说明
- 取舍理由与后续建议
