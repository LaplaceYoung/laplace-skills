# Claude Design Skills for Codex

把 `Claude-Design-Sys-Prompt.txt` 迁移为可安装的 Codex skills、plugins、MCP 与验证脚本。

## 项目目标

- 复刻 Claude Design 的核心工作流
- 提供适配 Codex 的安装入口
- 保持可验证、可运行、可导出的前端设计链路

当前版本重点完成：

- Claude Design 主工作流插件聚合
- 5 个 MCP 的真实可执行入口
- doctor / smoke 验证链路
- Yang Meng 宣传页 demo 跑通

## 架构

```text
claudesign-skills/
  .agents/plugins/marketplace.json
  plugins/
    claude-design/
    claude-design-github/
  skills/
    claude-design-*
  mcp/
    design-runtime-mcp/
    design-preview-mcp/
    design-assets-mcp/
    design-verifier-mcp/
    design-github-mcp/
  scripts/
  tests/
  artifacts/
```

### Plugin

- `claude-design`
  - intake
  - asset / artifact
  - preview
  - done gate / verifier
  - export
- `claude-design-github`
  - GitHub repo context import

### Skills

- `claude-design-core`
- `claude-design-intake`
- `claude-design-html-artifact`
- `claude-design-prototype`
- `claude-design-wireframe`
- `claude-design-tweaks`
- `claude-design-deck`
- `claude-design-animation`
- `claude-design-design-system`
- `claude-design-dev-handoff`
- `claude-design-canva-handoff`
- `claude-design-pdf-read`
- `claude-design-export-pdf`
- `claude-design-export-pptx-editable`
- `claude-design-export-pptx-screenshots`
- `claude-design-export-standalone-html`
- `claude-design-frontend-direction`

### MCP

- `design-runtime-mcp`
- `design-preview-mcp`
- `design-assets-mcp`
- `design-verifier-mcp`
- `design-github-mcp`

每个 MCP 包现在都有真实启动入口：

- `mcp/<name>/index.mjs`

这一步修复了此前的 `initialize response` 握手失败问题。

## 安装

### 1. 安装 skills

把 `skills/claude-design-*` 复制到：

```text
C:\Users\<your-user>\.codex\skills\
```

### 2. 安装 plugins marketplace

仓库自带：

```text
.agents/plugins/marketplace.json
```

接入方式：

```bash
codex marketplace add .
```

### 3. 注册 MCP

推荐直接注册包级 launcher：

```bash
codex mcp add design-runtime-mcp -- node <repo>\\mcp\\design-runtime-mcp\\index.mjs
codex mcp add design-preview-mcp -- node <repo>\\mcp\\design-preview-mcp\\index.mjs
codex mcp add design-assets-mcp -- node <repo>\\mcp\\design-assets-mcp\\index.mjs
codex mcp add design-verifier-mcp -- node <repo>\\mcp\\design-verifier-mcp\\index.mjs
codex mcp add design-github-mcp -- node <repo>\\mcp\\design-github-mcp\\index.mjs
```

查看状态：

```bash
codex mcp list
```

## 本地开发

安装依赖：

```bash
pnpm install
```

构建：

```bash
pnpm build
```

## 验证

doctor：

```bash
pnpm claude-design:doctor
```

输出：

```text
artifacts/doctor/doctor-report.json
```

smoke：

```bash
pnpm claude-design:smoke
```

输出：

```text
artifacts/demo/yang-meng-mcp-run-report.json
```

阶段验证：

```bash
pnpm phase0:verify
pnpm phase1:verify
```

## Demo

Yang Meng 宣传页：

- 页面：`examples/yang-meng-profile/index.html`
- 运行报告：`artifacts/demo/yang-meng-mcp-run-report.json`
- 截图：`artifacts/demo/yang-meng-profile.png`
- 设计规格：`docs/superpowers/specs/2026-04-21-yang-meng-personal-page-design.md`

页面特征：

- 编辑化长页
- 强层级信息编排
- 减少卡片
- 使用模拟案例与个人成就数据

## 和 oh-my-codex 的对齐

当前对齐方向：

- 插件层收敛为主入口插件
- skills 保持细粒度工作流
- MCP 负责真实执行与状态变更
- doctor / smoke 提供安装后验收

这和 oh-my-codex 的主路径设计一致：

- 少量主入口 surface
- 大量 skills 承担工作流
- 运行链路必须可验证

参考：

- https://github.com/Yeachan-Heo/oh-my-codex

## Parity 文档

完整对照：

```text
docs/superpowers/mappings/2026-04-21-claude-design-parity-comparison.md
```

覆盖内容：

- function call / tool use 映射
- skills 映射
- parity-critical commands
- Codex 适配差异

## 当前状态

- MCP 握手问题已修复
- 主插件结构已收敛
- doctor 与 smoke 已可直接运行
- 核心 integration 测试通过
- 可作为 Claude Design 风格前端插件库与技能库继续扩展
