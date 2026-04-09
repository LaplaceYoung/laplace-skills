---
name: kpi-analytics
description: 对产品指标、异常变化和分层表现进行分析并输出面向决策的结论
version: v0.1
template_version: 1.1
owner: xiaoz
cn_title: KPI与指标分析
en_alias: kpi-analytics
skill_family: analytics
primary_artifact: KPI analysis memo
---

# 目标 / Objective
- Job-to-be-done: 把零散指标、趋势波动和分层表现整理成可驱动行动的 KPI 分析结论。
- Primary user: AI 产品经理、增长负责人、数据分析协作方。
- Success definition: 输出指标定义、现状判断、异常解释、风险提示、建议动作。

# 触发信号 / Trigger signals
- 用户说“帮我看指标”“留存掉了为什么”“分析这周 AI 功能使用情况”。
- 有一组 KPI、埋点结果、漏斗表现或异常波动需要解释。
- 需要给周报、月报、评审会提供结构化数据结论。

# 启用条件 / Activation conditions
- Must-have context: 至少有指标快照、时间范围、分析对象。
- Evidence threshold: 若没有口径或时间范围，只能输出问题清单，不能做趋势结论。
- Stop and ask user when: 缺少指标定义、分母口径、或目标阈值。

# 不启用条件 / Do not use when
- 用户只需要定义埋点，不需要分析结果。
- 用户只有会议纪要，没有任何指标材料。

# 输入要求 / Inputs
## Required
- 指标数据或摘要
- 时间范围
- 分析对象（功能 / 页面 / 用户群）

## Optional
- 分群维度
- 对照组 / 历史基线
- 业务目标或门槛

## Assumptions to declare
- 指标口径是否完整
- 数据是否有延迟或缺失

# 本地参考 / Local references
- `references/metric-patterns-sanitized.md`：KPI 分析 memo 的结构模板
- `references/event-tracking-patterns-sanitized.md`：埋点需求和字段组织模式
- `references/source-coverage.md`：本 skill 可使用的脱敏来源覆盖说明

# Tools 类型类别与启用规则 / Tool categories
| Category | Typical tool types | Enable when | Avoid when | Expected evidence |
| --- | --- | --- | --- | --- |
| Local docs/files | shell / local note read | 指标说明、周报、日志摘要在本地 | 没有材料时 | 指标来源说明 |
| Structured docs | markdown / memo / metric tables | 需要输出周报结论、异常说明、建议动作 | 只需口头一句话时 | KPI memo |
| Data analysis | spreadsheet / trend compare / segmentation | 有具体数据、需要算变化幅度或分层 | 无数据时不要伪造趋势 | 指标表与变化说明 |
| Web research | external benchmark / policy | 只有在需要对比行业 benchmark | 常规内部 KPI 分析 | 外部 benchmark 来源 |
| No-browse reasoning | direct synthesis only | 只基于内部数据做判断 | 需要行业对标时 | 基于内部数据的结论 |

# 任务流程 / Workflow
1. Intake and metric framing
   - 明确看什么指标、看哪个时间段、为谁服务。
2. Metric hygiene check
   - 先校验口径、分母、缺失值、是否可同比/环比。
3. Analysis
   - 看绝对值、变化趋势、分群差异、异常点。
4. Interpretation
   - 区分“观察到的现象”“可能原因”“需要进一步验证的原因”。
5. Artifact generation
   - 输出 KPI memo：现状、洞察、风险、建议动作。
6. Self-check
   - 不把相关性当因果；缺口数据要明确指出。

# 输出物 / Outputs
- Primary artifact: KPI analysis memo
- Supporting tables or checklists: 指标定义表、变化表、分群对比表、问题假设列表
- Decision / recommendation summary: 需要关注的指标和建议动作
- Follow-up / escalation path: 补埋点 / 深挖样本 / 进入复盘

# 严格输出结构 / Strict output schema
- Required sections: 指标口径、核心发现、异常/分群说明、风险与假设、建议动作
- Required tables / fields: 至少一张指标变化表或分群对比表
- Minimal completion rule: 至少指出一个主要变化和一个需要验证的原因

# 失败模式 / Failure modes
- missing_context: 缺指标口径或时间范围。
- conflicting_constraints: 指标提升但用户反馈变差。
- low_confidence: 数据量太小或缺失严重。
- out_of_scope: 用户其实是要写埋点方案或复盘文档。

# 质量检查 / Quality checks
- Contract compliance target: 必须有口径说明、核心发现、风险和建议动作。
- Artifact completeness target: 至少说明一个主要变化和一个验证方向。
- Measurable gate: rubric >= 85/100，format compliance >= 95%，缺失口径说明数 = 0。
- Bilingual consistency target: 指标名称、英文缩写保持一致。
- Hallucination guard: 没有实验或分层支持的“原因”只能写假设。

# Example prompt
请分析过去两周“字字助手”会话创建率、追问率、满意率的变化。我会给你周报摘要和几个用户分群。请输出核心发现、异常可能原因、需要补看的数据和建议动作。

# Expected output shape
- 指标口径与分析范围
- 核心发现
- 分群或异常说明
- 风险与假设
- 建议动作
