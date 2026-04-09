---
name: evaluation-experiment-review
description: 对实验结果、功能试运行和评审意见进行证据化判断与改进建议输出
version: v0.1
template_version: 1.1
owner: xiaoz
cn_title: 评估与实验复核
en_alias: evaluation-experiment-review
skill_family: evaluation
primary_artifact: evaluation verdict memo
---

# 目标 / Objective
- Job-to-be-done: 将实验结果、试运行反馈、评审意见或 bad cases 变成“结果支持什么、不支持什么、下一步怎么改”的评估结论。
- Primary user: AI 产品经理、增长/评测负责人、功能 owner。
- Success definition: 产出 evidence-backed review memo，明确结论、风险、bad-case 分类、推荐动作。

# 触发信号 / Trigger signals
- 用户说“帮我看实验结果”“这版效果能不能上线”“帮我分析 bad cases”。
- 有 A/B 结果、模型输出样本、人工评审意见、试运行反馈需要判断。
- 需要把“感觉还行”变成可落地的 go / no-go 结论。

# 启用条件 / Activation conditions
- Must-have context: 至少有结果材料、评审样本、或上线反馈中的一种。
- Evidence threshold: 如果没有样本、没有指标、没有评审记录，就只能给评估框架，不能给强结论。
- Stop and ask user when: 缺少目标指标、评估口径或对比基线，无法判断好坏时。

# 不启用条件 / Do not use when
- 用户只想写 PRD 或整理需求文档。
- 用户只是在做需求发现，尚未有任何结果可评估。

# 输入要求 / Inputs
## Required
- 评估对象（功能/模型/版本）
- 结果材料（样本、指标、评审意见、线上反馈）

## Optional
- 目标阈值 / baseline
- 上线门槛或业务约束
- 样本分层信息

## Assumptions to declare
- 指标口径是否完整
- 结果样本是否具有代表性

# 本地参考 / Local references
- `references/evaluation-patterns-sanitized.md`：评估 memo 的判断结构与结论表达
- `references/badcase-patterns-sanitized.md`：bad-case 分类方式与表格模式
- `references/source-coverage.md`：本 skill 可使用的脱敏来源覆盖说明

# Tools 类型类别与启用规则 / Tool categories
| Category | Typical tool types | Enable when | Avoid when | Expected evidence |
| --- | --- | --- | --- | --- |
| Local docs/files | shell / file read / pdf/text review | 结果保存在本地文档、会议记录、反馈表里 | 没有结果材料时 | 样本摘录、反馈来源 |
| Structured docs | markdown / verdict memo / bad-case table | 需要形成 go/no-go memo、评审摘要 | 仅口头讨论时 | 结构化结论与行动项 |
| Data analysis | spreadsheet / metric comparison / segmentation | 有指标、分组结果、A/B 数据 | 没有统计材料时不要伪量化 | 指标表、分层观察 |
| Web research | official docs / benchmark references | 需要对照外部标准或最新平台规则 | 纯内部试运行复盘时 | 外部标准来源 |
| No-browse reasoning | direct synthesis only | 所有结果材料都在本地且不依赖最新事实 | 需要行业 benchmark 时 | 基于现有样本的判断 |

# 任务流程 / Workflow
1. Intake and evaluation framing
   - 明确评估对象、目标、基线、上线门槛。
2. Evidence collection / tool selection
   - 读取样本、指标、反馈；能分层就分层，不能分层就说明限制。
3. Result judgment
   - 判断结果支持什么、不支持什么、哪些只能算趋势。
4. Bad-case analysis
   - 按错误类型、场景类型、严重度聚类 bad cases。
5. Artifact generation
   - 输出 verdict memo：结论、证据、风险、改进建议、是否可进入下一阶段。
6. Self-check
   - 检查是否把样本偏差、基线缺失、口径不一致写明。

# 输出物 / Outputs
- Primary artifact: evaluation verdict memo
- Supporting tables or checklists: 指标对比表、bad-case 分类表、上线门槛检查表
- Decision / recommendation summary: go / conditional go / no-go
- Follow-up / escalation path: 补实验 / 改规则 / 补数据 / 回写 PRD

# 严格输出结构 / Strict output schema
- Required sections: 评估对象、目标、核心结果、bad-case 分类、风险、建议动作
- Required tables / fields: 至少一张指标对比表或 bad-case 分类表
- Minimal completion rule: 必须明确一个 verdict（go / conditional go / no-go）

# 失败模式 / Failure modes
- missing_context: 缺 baseline 或目标阈值。
- conflicting_constraints: 指标好但 bad case 高风险，需分场景讨论。
- low_confidence: 样本太少或分布偏差过大。
- out_of_scope: 用户要的是需求定义而不是结果评估。

# 质量检查 / Quality checks
- Contract compliance target: 结论、证据、风险、建议四块齐全。
- Artifact completeness target: 至少 3 类 bad cases 或明确说明样本不足。
- Measurable gate: rubric >= 85/100，format compliance >= 95%，缺失 verdict 数 = 0。
- Bilingual consistency target: 指标、版本、实验名称命名一致。
- Hallucination guard: 没有数据支持的提升/下降不得写成确定结论。

# Example prompt
请帮我复核“当前页面问答”功能的灰度结果：我给你 20 条用户提问样本、人工标注的满意/不满意、以及 3 类失败案例。请输出这个版本是否适合扩灰，哪些问题是 blocker，哪些只需要快速修复。

# Expected output shape
- 评估对象与目标
- 核心结果结论
- Bad-case 分类与严重度
- 风险与上线建议
- 下一步动作
