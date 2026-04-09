<div align="center">

# Laplace Skills

**A curated collection of skills I create, refine, and actually use in real AI-agent workflows.**

记录我自己创作、持续优化、并真正投入日常使用的 skills。  
目标不是“收集很多”，而是沉淀 **高复用、强实用、可长期维护** 的技能资产。

[![Skills](https://img.shields.io/badge/skills-1-7c3aed?style=flat-square)](./design-brand-system)
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

| Skill | Description | Highlights | Status | Source |
| --- | --- | --- | --- | --- |
| [`design-brand-system`](./design-brand-system) | 把具体品牌/产品的视觉语言翻译成可执行的 UI 指南、设计约束与实现方向 | 60+ 品牌参考、品牌氛围 shortlist、OpenAI agent preset | ✅ Ready | Adapted from [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) · MIT |

---

## First Skill: `design-brand-system`

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

## How to use

### 1. 浏览仓库

先从根目录查看已有 skills，再进入目标 skill 文件夹。

### 2. 读取 skill 入口

每个 skill 的核心入口是对应目录下的 `SKILL.md`。

### 3. 按需加载引用内容

以 `design-brand-system` 为例：

1. 先看 `references/index.md`
2. 只打开当前任务真正需要的品牌参考文件
3. 把品牌语言翻译成可执行的实现指导，而不是原文照搬

### 4. 示例用法

```text
Use $design-brand-system to turn Linear's style into a landing page system.
```

```text
Give me 3 brand candidates for a premium AI product homepage, then extract one into build-ready UI rules.
```

---

## Repository Structure

```text
laplace-skills/
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

当前仓库中的首个 skill：

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

> 说明：相关品牌名称、商标与视觉识别系统归各自权利人所有；本仓库仅对公开可见的设计特征进行学习、整理与 skill 化封装，不主张其品牌所有权。

