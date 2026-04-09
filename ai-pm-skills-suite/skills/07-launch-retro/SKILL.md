---
name: launch-retro
description: 围绕需求上线前后表现输出结构化复盘与改进动作
version: v0.1
template_version: 1.1
owner: xiaoz
cn_title: 上线复盘
en_alias: launch-retro
skill_family: retro
primary_artifact: launch retrospective memo
---

# 目标 / Objective
- Job-to-be-done: 将一次版本上线或灰度试运行的表现，整理成“做得好 / 做得差 / 为什么 / 接下来怎么做”的复盘文档。
- Primary user: AI 产品经理、发布 owner、跨团队项目负责人。
- Success definition: 输出包含目标回看、结果、问题聚类、根因假设、改进动作的复盘 memo。

# 触发信号 / Trigger signals
- 用户说“做上线复盘”“总结这次发布”“整理试运行问题”。
- 功能刚灰度/上线，需要系统总结成果和问题。
- 版本收尾后要沉淀经验、生成后续行动项。

# 启用条件 / Activation conditions
- Must-have context: 至少有上线目标、结果反馈、问题记录中的两类信息。
- Evidence threshold: 若没有目标或结果，只能做过程复盘，不能做效果复盘。
- Stop and ask user when: 无法确认上线范围、时间线、关键指标或问题列表。

# 不启用条件 / Do not use when
- 用户只要会后纪要，不是上线复盘。
- 用户还在上线前做优先级讨论。

# 输入要求 / Inputs
## Required
- 上线/灰度对象
- 时间线或关键节点
- 结果材料：指标、用户反馈、issue 列表、支持单

## Optional
- 首发目标 / 成功标准
- 参与角色
- 回滚或补丁记录

## Assumptions to declare
- 若没有量化指标，需说明以质性反馈为主。
- 若问题记录不完整，需提示样本偏差。

# 本地参考 / Local references
- `references/retro-patterns-sanitized.md`：复盘文档的标准结构与结论方式
- `references/risk-issue-patterns-sanitized.md`：问题聚类和行动项模式
- `references/source-coverage.md`：本 skill 可使用的脱敏来源覆盖说明

# Tools 类型类别与启用规则 / Tool categories
| Category | Typical tool types | Enable when | Avoid when | Expected evidence |
| --- | --- | --- | --- | --- |
| Local docs/files | shell / local issue log / meeting notes | 上线记录、客服单、灰度总结在本地 | 没有任何复盘材料时 | 时间线和问题来源 |
| Structured docs | markdown / retro memo / action table | 需要形成复盘文档与改进行动 | 只需临时口头回顾时 | 复盘结构与 action list |
| Data analysis | KPI review / issue counting | 有上线指标、工单、问题频次 | 无数据时不要假精确 | 指标和问题聚类 |
| Web research | web search / official docs verification | 只在要对比外部发布规范、政策或合规变化时启用 | 常规内部复盘默认禁用 | 外部来源 |
| No-browse reasoning | direct synthesis only | 内部上线复盘通常优先本地材料 | 需要外部对标时 | 基于内部证据的结论 |

# 任务流程 / Workflow
1. Intake and launch framing
   - 明确上线目标、范围、时间线、评估窗口。
2. Evidence collection
   - 整理目标、结果、问题、补丁、反馈。
3. Outcome review
   - 回看是否达到预期目标，哪些结果超预期/低于预期。
4. Issue clustering
   - 按体验、稳定性、数据、认知、流程等维度聚类问题。
5. Artifact generation
   - 输出 retro：目标回看、结果、问题、经验、行动项。
6. Self-check
   - 将事实、推断、行动分开写清楚。

# 输出物 / Outputs
- Primary artifact: launch retrospective memo
- Supporting tables or checklists: 时间线、问题聚类表、经验清单、行动项表
- Decision / recommendation summary: 本次发布是否达标、要不要继续扩灰/推广
- Follow-up / escalation path: 回写 PRD / 回写路线图 / 补 issue owner

# 严格输出结构 / Strict output schema
- Required sections: 上线目标、结果回看、问题聚类、经验总结、行动项
- Required tables / fields: 至少一张问题聚类表或行动项表
- Minimal completion rule: 必须明确本次上线是否达标，不能只写现象不下结论

# 失败模式 / Failure modes
- missing_context: 没有明确目标或问题记录。
- conflicting_constraints: 指标达标但体验口碑差。
- low_confidence: 问题样本不完整或时间窗过短。
- out_of_scope: 用户要的是实验评估或会议纪要。

# 质量检查 / Quality checks
- Contract compliance target: 必须有目标、结果、问题、经验、行动项。
- Artifact completeness target: 至少有一个成功经验和一个改进方向。
- Measurable gate: rubric >= 85/100，format compliance >= 95%，缺失结论数 = 0。
- Bilingual consistency target: 版本名、模块名、指标名一致。
- Hallucination guard: 未发生的问题不能“预设为真实教训”。

# Example prompt
请对“字字助手-当前页面问答”灰度上线做一次复盘：材料包括上线目标、两周指标摘要、客服问题列表和一次补丁记录。请输出达标情况、问题聚类、关键经验、后续行动项。

# Expected output shape
- 上线目标与范围
- 结果回看
- 问题聚类
- 经验总结
- 行动项与负责人建议
