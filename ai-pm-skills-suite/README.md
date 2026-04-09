# AI PM Skills Suite

面向 AI Product Manager 工作的本地 skills 套件。
目标不是堆很多 prompt，而是把 discovery、PRD、评审、优先级、会议、KPI 和上线复盘这些高频工作，沉淀成可复用、可审阅、可持续迭代的 workflow。

## What this pack is for

- 把零散需求、会议记录、评审意见、指标波动整理成结构化产物
- 让 PM 工作流更适合 agent 协作，而不是只适合人工临时整理
- 用治理规则、rubric、checklist 和 evidence log 控制输出质量
- 只保留可共享的脱敏参考资料，不把原始附件直接打包进仓库

## Included skills

| Tier | Skill | Primary artifact | What it does |
| --- | --- | --- | --- |
| P0 | `01-discovery-research` | `discovery brief` | 将模糊想法转成问题定义、用户场景、研究假设和证据计划 |
| P0 | `02-prd-spec-generation` | `PRD document` | 按 PRD 模板写出结构完整、工程可执行的需求文档 |
| P0 | `04-roadmap-prioritization` | `prioritization memo` | 按价值、成本、风险和依赖关系做优先级排序与版本编排 |
| P1 | `03-evaluation-experiment-review` | `evaluation verdict memo` | 对实验结果、试运行反馈和评审意见做证据化判断 |
| P1 | `05-meeting-review-synthesis` | `decision memo` | 将会议纪要、评审讨论和零散决定整理成结构化决策与行动项 |
| P1 | `06-kpi-analytics` | `KPI analysis memo` | 对产品指标、异常变化和分层表现做面向决策的分析 |
| P2 | `07-launch-retro` | `launch retrospective memo` | 围绕上线前后表现输出结构化复盘与改进动作 |
| P2 | `08-shared-utilities` | `reusable utility package` | 统一管理模板、rubric、检查表和辅助输出规范 |

## Package assets

- `skills/`: 8 个已编写技能，每个技能包含自己的 `SKILL.md` 和脱敏 `references/`
- `references/`: 套件级治理文档，包括 contract、versioning、playbook、rubric、checklist
- `examples/sample-inputs/`: discovery、PRD、优先级、会议、KPI、复盘等样例输入
- `templates/`: 技能模板骨架
- `scripts/`: `backup.ps1`、`restore.ps1`、`validate-skill-metadata.ps1`
- `workspace/`: 审阅记录、清理报告、TODO、变更日志等维护文档

## Governance rules

- 每个 phase gate 前都要跑一次 restore drill
- 任何 critical hallucination 都会阻塞升级
- 每条 gate 记录必须带 owner、reviewer、timestamp 和 evidence link
- `skills/*/references/` 只保留脱敏后的结构、模式、规则和模板摘要
- 原始 PDF / XLSX / 受限附件不直接复制进本目录

## Current status

- `v0.1` 本地套件骨架和 8 个技能均已完成
- Sprint 0 的治理基线已经落地
- backup + restore drill 已通过，且脚本在修复嵌套复制问题后已加固
- 套件当前适合继续做 dry-run、rubric 打分和 reviewer evidence 补齐

## v1 release-ready standard

一个 skill family 只有在满足以下条件后才算 `v1-ready`：

1. 通过计划中定义的全部定量阈值。
2. 至少完成 3 个真实场景 dry-run。
3. reviewer evidence 已完整记录。
4. CN / EN key fields 对齐。
5. 没有未解决的 critical hallucination。

## Suggested use

1. 从 `examples/sample-inputs/` 选择最接近当前任务的样例。
2. 打开目标技能目录下的 `SKILL.md`。
3. 只按需读取该技能自己的 `references/`，不要无差别全量加载。
4. 需要统一格式或评分标准时，优先复用 `08-shared-utilities` 和套件级 `references/`。

## Repository layout

```text
ai-pm-skills-suite/
├─ README.md
├─ examples/
│  └─ sample-inputs/
├─ references/
├─ scripts/
├─ skills/
│  ├─ 01-discovery-research/
│  ├─ 02-prd-spec-generation/
│  ├─ 03-evaluation-experiment-review/
│  ├─ 04-roadmap-prioritization/
│  ├─ 05-meeting-review-synthesis/
│  ├─ 06-kpi-analytics/
│  ├─ 07-launch-retro/
│  └─ 08-shared-utilities/
├─ templates/
└─ workspace/
```

## Notes

- `workspace/` 用来保存维护这套技能时的过程文档和 evidence。
- `workspace/snapshots/` 是本地生成的过程快照，不属于主仓库的长期内容。
- 如果未来引入外部模板或改编材料，会在对应目录补充单独的来源与许可说明。
