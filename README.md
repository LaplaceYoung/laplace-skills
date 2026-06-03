<div align="center">

# Laplace Skills

**A curated collection of skills I create, refine, and actually use in real AI-agent workflows.**

记录我自己创作、持续优化、并投入日常使用的 skills。  
目标不是“收集很多”，而是沉淀 **高复用、强实用、可长期维护** 的技能资产。

[![Skill Packs](https://img.shields.io/badge/skill_packs-7-0f766e?style=flat-square)](./)
[![Status](https://img.shields.io/badge/status-active-22c55e?style=flat-square)](https://github.com/LaplaceYoung/laplace-skills)
[![Last Commit](https://img.shields.io/github/last-commit/LaplaceYoung/laplace-skills?style=flat-square)](https://github.com/LaplaceYoung/laplace-skills)

</div>

---

## Why this repo

这个仓库用于管理我自己的技能库，核心原则：

- **长期可用**：不是一次性 prompt，也不是只跑一次的 demo。
- **面向真实工作流**：能被 agent 直接执行。
- **持续优化**：按实际使用反馈迭代。
- **来源清晰**：原创与改编来源明确标注。

只有满足以下条件之一的内容才会进入仓库：

- 明显提升任务质量或速度
- 能在多个项目中复用
- 输入 / 输出模式清晰
- 值得长期维护

---

## Skill Index

| Pack | Description | Highlights | Status | Source |
| --- | --- | --- | --- | --- |
| [`design-brand-system`](./design-brand-system) | 把品牌视觉语言转成可执行 UI 指南与实现约束 | 60+ 品牌参考、shortlist、agent preset | ✅ Ready | Adapted from [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) · MIT |
| [`ai-pm-skills-suite`](./ai-pm-skills-suite) | AI PM 工作流技能套件（discovery/PRD/评审/KPI/复盘） | 8 个原创 skills、治理规则、样例、脚本 | 🚧 Active v0.1 | Original |
| [`harness-friendly-skill-suite`](./harness-friendly-skill-suite) | 面向 agent 仓库改造的 harness-first 套件 | `.harness` 内核、checkpoint resume、delta evaluator | 🚧 Active v0.2 | Original |
| [`dynamic-workflow-skill-suite`](./dynamic-workflow-skill-suite) | 面向 Codex 的动态工作流与多代理任务 harness 套件 | workflow selection、adversarial verification、loop-until-done | 🚧 Active v0.1 | Original |
| [`feasibility-ai-offline-writer`](./feasibility-ai-offline-writer) | 可行性研究离线写作技能包 | prompts 资产、outline selector、lookup 脚本 | 🚧 Active v0.1 | Original |
| [`goodhub-skills`](./goodhub-skills) | GitHub 文档与协作写作技能套件 | README/PR/Issue/Commit/License/CONTRIBUTING 路由 | 🚧 Active v0.1 | Original |
| [`humanvoice-studio`](./humanvoice-studio) | 让 AI 更“讲人话”的通用写作技能包（含中文专项） | 日常/发帖/学术/长文/小说 + 迭代评测脚本 | 🚧 Active v0.1 | Original |

---

## Featured Packs

### `humanvoice-studio`

`humanvoice-studio` 关注“自然表达 + 信息保真 + 可迭代评测”。

覆盖场景：
- 日常交流
- 社媒发帖
- 学术写作
- 长文写作
- 改写转述
- 中文小说优化（`zh-fiction-novel`）

工程化能力：
- 泛化评测脚本：`scripts/eval-fiction-style.ps1`
- 人写语料管线：抓取 / 清洗 / 画像 / 迭代日志
- 防过拟合规则：跨文本证据优先，不围绕单样本调参

### `goodhub-skills`

`goodhub-skills` 是面向 GitHub 协作写作的技能路由包，支持：

- `goodhub-readme`
- `goodhub-pr`
- `goodhub-issue`
- `goodhub-commit`
- `goodhub-license`
- `goodhub-contributing`
- `goodhub-repo-standards`

目标是降低仓库协作文档成本，让输出可复制、可审阅、可直接使用。

### `dynamic-workflow-skill-suite`

`dynamic-workflow-skill-suite` 把复杂任务先组织成可验证的 execution harness，再进入执行。

覆盖场景：
- 动态工作流路由（`dynamic-workflow`）
- 对抗式代码审查（`dynamic-code-review`）
- 根因调试闭环（`dynamic-debug`）
- 主来源研究与排序综合（`dynamic-research`）

工程化能力：
- workflow shape 选择：classify / fan-out / adversarial / generate-filter / tournament / loop
- 明确 success criteria、verification evidence、stop condition
- 主线程负责集成与最终验证，子代理负责独立分支任务

---

## How to use

1. 从根目录选择 skill pack。  
2. 打开目标目录中的 `SKILL.md`。  
3. 仅按需加载对应 `references/` 内容。  
4. 结合样例输入与脚本做 dry-run / regression。  

示例：

```text
Use $humanvoice-studio to rewrite this text in natural Chinese while preserving facts.
```

```text
Use goodhub-skills/goodhub-pr to draft a reviewer-friendly PR body.
```

---

## Repository Structure

```text
laplace-skills/
├─ ai-pm-skills-suite/
├─ design-brand-system/
├─ dynamic-workflow-skill-suite/
├─ feasibility-ai-offline-writer/
├─ harness-friendly-skill-suite/
├─ goodhub-skills/
├─ humanvoice-studio/
├─ .gitignore
└─ README.md
```

---

## Principles

- **High signal**：少废话，重约束与可执行性  
- **Composable**：可和其他技能/工作流组合  
- **Readable**：结构清晰，人和 agent 都易读  
- **Maintainable**：便于补充、替换、迭代  

---

## Acknowledgements

适配型 skill pack：

- [`design-brand-system`](./design-brand-system) 改编自 [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md)

感谢 upstream 项目提供的设计参考资料。

---

## License & Attribution

本仓库可能同时包含：

- 原创 skills
- 基于开源项目改编、重组或封装的 skills

对于 `design-brand-system`：

- 来源仓库：[`VoltAgent/awesome-design-md`](https://github.com/VoltAgent/awesome-design-md)
- 上游许可证：**MIT**
- 许可证文本：[`./design-brand-system/LICENSE`](./design-brand-system/LICENSE)
- 署名说明：[`./design-brand-system/ATTRIBUTION.md`](./design-brand-system/ATTRIBUTION.md)

> 说明：相关品牌名称、商标与视觉识别系统归各自权利人所有；本仓库仅对公开可见设计特征进行学习、整理与 skill 化封装，不主张其品牌所有权。
