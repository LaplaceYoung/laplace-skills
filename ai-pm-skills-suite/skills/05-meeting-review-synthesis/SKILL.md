---
name: meeting-review-synthesis
description: 将会议纪要、评审讨论和零散决定整理成结构化决策与行动项
version: v0.1
template_version: 1.1
owner: xiaoz
cn_title: 会议与评审总结
en_alias: meeting-review-synthesis
skill_family: collaboration
primary_artifact: decision memo
---

# 目标 / Objective
- Job-to-be-done: 把冗长会议内容变成决策、结论、owner、时间点、待确认项。
- Primary user: 产品经理、会议 owner、跨团队协作者。
- Success definition: 输出可以直接分发给团队的决策纪要，而不是简单压缩原文。

# 触发信号 / Trigger signals
- 用户说“整理会议纪要”“总结评审结论”“提取行动项”。
- 有访谈记录、会议 transcript、群聊讨论、评审评论要整理。
- 需要明确谁决定了什么、谁负责什么、还有什么没定。

# 启用条件 / Activation conditions
- Must-have context: 至少有原始会议内容或结构化笔记。
- Evidence threshold: 若只给很短的碎片，需要明确哪些结论不可靠。
- Stop and ask user when: 缺少基本会议主题、时间范围、或参与者角色，导致 owner 判断失真。

# 不启用条件 / Do not use when
- 用户要写正式 PRD 或版本规划。
- 用户要做结果评估而不是会议纪要整理。

# 输入要求 / Inputs
## Required
- 会议内容 / 评审意见 / 讨论记录
- 会议主题

## Optional
- 参与角色
- 期望输出格式（周会纪要 / 评审结论 / 复盘结论）
- 时间节点和 owner 信息

## Assumptions to declare
- 未明确 owner 的行动项只能标记为“待指派”。
- 未正式确认的观点不能写成已决定事项。

# 本地参考 / Local references
- `references/review-summary-patterns-sanitized.md`：决策纪要的标准结构
- `references/decision-tracking-patterns-sanitized.md`：行动项表和待确认问题表模式
- `references/source-coverage.md`：本 skill 可使用的脱敏来源覆盖说明

# Tools 类型类别与启用规则 / Tool categories
| Category | Typical tool types | Enable when | Avoid when | Expected evidence |
| --- | --- | --- | --- | --- |
| Local docs/files | shell / text note read / transcript extraction | 会议记录在本地文件中 | 没有会议内容时 | 原文摘录 |
| Structured docs | markdown / decision log / action table | 需要形成纪要、行动项、决策表 | 只需短回复时 | 决策与 action list |
| Data analysis | light counts / issue clustering | 需要统计讨论频次、重复问题 | 没有足够样本时 | 问题分类结果 |
| Web research | web search / official docs verification | 仅当会议中存在“待核实的最新外部事实/政策/竞品状态”时启用 | 普通会议纪要整理默认禁用 | 外部核实来源 |
| No-browse reasoning | direct synthesis only | 会议内容已足够、目标是内部纪要 | 需要补最新事实时 | 基于纪要的结构化输出 |

# 任务流程 / Workflow
1. Intake and meeting framing
   - 确认会议类型：需求评审、方案评审、周会、复盘会。
2. Evidence collection
   - 读取原始笔记或 transcript，按议题切分。
3. Decision extraction
   - 区分“已决定 / 倾向性意见 / 未解决问题”。
4. Action planning
   - 提取 owner、截止时间、依赖事项；缺失则标“待指派”。
5. Artifact generation
   - 输出会议纪要、决策表、行动项表、风险提醒。
6. Self-check
   - 避免把讨论中的提议写成已决策。

# 输出物 / Outputs
- Primary artifact: decision memo / meeting summary
- Supporting tables or checklists: 决策表、行动项表、待确认项列表
- Decision / recommendation summary: 本次会议结论与建议 follow-up
- Follow-up / escalation path: 回写 PRD / 回写路线图 / 安排下次确认

# 严格输出结构 / Strict output schema
- Required sections: 会议背景、已决策事项、行动项、待确认问题、风险提醒
- Required tables / fields: 行动项表至少包含事项、owner、状态/时间
- Minimal completion rule: 每条行动项都必须有 owner 或明确标注“待指派”

# 失败模式 / Failure modes
- missing_context: 原始记录太碎，无法还原结论。
- conflicting_constraints: 多方观点冲突但会议未定结论。
- low_confidence: transcript 缺段或上下文断裂。
- out_of_scope: 用户要的是正式需求文档或实验评估。

# 质量检查 / Quality checks
- Contract compliance target: 必须区分已决策、待确认、行动项。
- Artifact completeness target: owner / 时间点缺失时必须显式标注。
- Measurable gate: rubric >= 85/100，format compliance >= 95%，未标注 owner/待指派 的行动项数 = 0。
- Bilingual consistency target: 项目名、模块名写法一致。
- Hallucination guard: 不能凭空指定 owner 或决定状态。

# Example prompt
请把这份需求评审会议纪要整理成“已决策事项、行动项、待确认问题、风险提醒”四部分，并标出每项的负责人和截止时间；没有明确信息的地方请标记待指派，不要自己猜。

# Expected output shape
- 会议背景与主题
- 已决策事项
- 行动项表
- 待确认问题
- 风险提醒与下一步
