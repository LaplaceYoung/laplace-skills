<div align="center">

# Laplace Skills

**A curated collection of skills I create, refine, and actually use in real AI-agent workflows.**

记录我自己创作、持续优化、并真正投入日常使用的 skills。  
目标不是“收集很多”，而是沉淀 **高复用、强实用、可长期维护** 的技能资产。

[![Skill Packs](https://img.shields.io/badge/skill_packs-2-0f766e?style=flat-square)](./)
[![AI PM Suite](https://img.shields.io/badge/ai_pm_suite-8_workflows-2563eb?style=flat-square)](./ai-pm-skills-suite)
[![Status](https://img.shields.io/badge/status-active-22c55e?style=flat-square)](https://github.com/LaplaceYoung/laplace-skills)
[![Upstream License](https://img.shields.io/badge/upstream-MIT-10b981?style=flat-square)](./design-brand-system/LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/LaplaceYoung/laplace-skills?style=flat-square)](https://github.com/LaplaceYoung/laplace-skills)

</div>

---

## Why this repo

这个仓库专门用来管理我自己的技能库，重点放在：

- **自己会长期使用**：不是 demo，不是一次性 prompt
- **面向真实工作流**：能被 agent 直接拿去执行
- **持续优化**：会根据使用体验不断迭代
- **清晰署名**：原创与改编来源都会明确标注

如果某个 skill 能进入这个仓库，意味着它至少满足以下标准之一：

- 能明显提升任务质量或速度
- 能在多个项目中复用
- 有清晰输入 / 输出模式
- 值得长期维护

---

## Skill Index

| Pack | Description | Highlights | Status | Source |
| --- | --- | --- | --- | --- |
| [`design-brand-system`](./design-brand-system) | 把具体品牌/产品的视觉语言翻译成可执行的 UI 指南、设计约束与实现方向 | 60+ 品牌参考、品牌氛围 shortlist、OpenAI agent preset | ✅ Ready | Adapted from [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) · MIT |
| [`ai-pm-skills-suite`](./ai-pm-skills-suite) | 面向 AI 产品经理工作的本地 workflow skills 套件，把 discovery、PRD、评审、优先级、会议、KPI、上线复盘沉淀为结构化产物 | 8 个原创 skills、治理规则、脱敏参考资料、样例输入、备份/恢复脚本 | 🚧 Active v0.1 | Original |

---

## Featured Packs

### `design-brand-system`

`design-brand-system` 用来把一个品牌的视觉风格，转换成另一个 agent 或开发者可以直接落地的设计规则。

适合以下场景：

- 想让页面更像 **Apple / Linear / Vercel / Notion / Stripe / Airbnb / Tesla**
- 想从品牌风格里抽取 **排版、配色、组件、动效、布局** 规则
- 想根据一种“气质”快速筛选可参考品牌
- 想把“看起来像某品牌”变成 **可执行的 UI 实现说明**

当前包含：

- `SKILL.md`：技能入口与工作流说明
- `references/`：60+ 品牌/产品参考文件
- `agents/openai.yaml`：适配 agent 调用的简要配置

---

### `ai-pm-skills-suite`

`ai-pm-skills-suite` 是一套面向 AI Product Manager 工作流的本地技能包，用来把零散材料整理成可评审、可协作、可追踪的产品产物。

覆盖场景包括：

- discovery 与需求澄清
- PRD 编写与工程对齐
- 实验 / 试运行 / 评审结论整理
- roadmap prioritization 与版本编排
- 会议纪要、决策和行动项提炼
- KPI / 漏斗 / 异常指标分析
- 上线复盘与后续改进行动

当前包含 8 个原创技能：

- `01-discovery-research`
- `02-prd-spec-generation`
- `03-evaluation-experiment-review`
- `04-roadmap-prioritization`
- `05-meeting-review-synthesis`
- `06-kpi-analytics`
- `07-launch-retro`
- `08-shared-utilities`

同时提供：

- `references/`：技能治理规范、rubric、checklist、playbook
- `examples/sample-inputs/`：可直接拿来 dry-run 的样例材料
- `scripts/`：元数据校验、backup / restore 脚本
- `workspace/`：维护该套件时的审阅记录、清理说明与变更日志

---

## How to use

### 1. 浏览仓库

先从根目录查看已有 skill pack，再进入目标目录。

### 2. 读取 skill 入口

每个 skill pack 都有自己的入口文档；具体 skill 则以对应目录下的 `SKILL.md` 为核心入口。

### 3. 按需加载引用内容

以 `design-brand-system` 为例：

1. 先看 `references/index.md`
2. 只打开当前任务真正需要的品牌参考文件
3. 把品牌语言翻译成可执行的实现指导，而不是原文照搬

以 `ai-pm-skills-suite` 为例：

1. 先进入目标技能目录
2. 打开该技能的 `SKILL.md`
3. 只按需读取该技能自己的 `references/`
4. 需要统一格式或评分标准时，再复用套件级 `references/`

### 4. 示例用法

```text
Use $design-brand-system to turn Linear's style into a landing page system.
```

```text
Give me 3 brand candidates for a premium AI product homepage, then extract one into build-ready UI rules.
```

```text
Use ai-pm-skills-suite/skills/02-prd-spec-generation to turn meeting notes and scattered requirements into an executable PRD.
```

```text
Use ai-pm-skills-suite/skills/06-kpi-analytics to analyze a drop in activation and turn it into a decision memo.
```

---

## Repository Structure

```text
laplace-skills/
├─ ai-pm-skills-suite/
│  ├─ README.md
│  ├─ examples/
│  │  └─ sample-inputs/
│  ├─ references/
│  ├─ scripts/
│  ├─ skills/
│  │  ├─ 01-discovery-research/
│  │  ├─ 02-prd-spec-generation/
│  │  ├─ 03-evaluation-experiment-review/
│  │  ├─ 04-roadmap-prioritization/
│  │  ├─ 05-meeting-review-synthesis/
│  │  ├─ 06-kpi-analytics/
│  │  ├─ 07-launch-retro/
│  │  └─ 08-shared-utilities/
│  ├─ templates/
│  └─ workspace/
├─ design-brand-system/
│  ├─ SKILL.md
│  ├─ agents/
│  │  └─ openai.yaml
│  ├─ references/
│  │  ├─ index.md
│  │  └─ *.md
│  ├─ ATTRIBUTION.md
│  └─ LICENSE
├─ .gitignore
└─ README.md
```

---

## Principles

我会尽量让这个仓库里的 skill 保持以下特征：

- **High signal**：少废话，强调真正有用的约束和模式
- **Composable**：能和其他技能或工作流组合使用
- **Readable**：结构清晰，便于 agent 与人类同时理解
- **Maintainable**：方便后续补充、替换、迭代

---

## Acknowledgements

当前仓库中的适配型 skill pack：

- [`design-brand-system`](./design-brand-system) 改编自 [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md)

感谢 upstream 项目整理与沉淀的品牌设计参考资料，为技能化封装提供了基础。

---

## License & Attribution

本仓库可能同时包含：

- 我原创的 skills
- 基于开源项目改编、重组或封装的 skills

对于 `design-brand-system`：

- 来源仓库：[`VoltAgent/awesome-design-md`](https://github.com/VoltAgent/awesome-design-md)
- 上游许可证：**MIT**
- 完整许可证文本：见 [`./design-brand-system/LICENSE`](./design-brand-system/LICENSE)
- 署名说明：见 [`./design-brand-system/ATTRIBUTION.md`](./design-brand-system/ATTRIBUTION.md)

对于 `ai-pm-skills-suite`：

- 当前内容为原创本地 workflow skills 套件
- 若后续引入外部模板、参考或改编材料，会在对应目录单独标注来源与许可

> 说明：相关品牌名称、商标与视觉识别系统归各自权利人所有；本仓库仅对公开可见的设计特征进行学习、整理与 skill 化封装，不主张其品牌所有权。
