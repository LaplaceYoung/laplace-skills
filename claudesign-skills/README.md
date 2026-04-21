# Claude Design Skills for Codex

Claude Design Skills for Codex 是一个把 `Claude-Design-Sys-Prompt.txt` 迁移到 Codex 运行面的前端设计插件库与技能库。

它提供：

- Claude Design 风格工作流的 Codex 适配
- skills / plugins / MCP / scripts / examples / tests 五层结构
- 设计生成、预览、验证、导出、handoff 的完整闭环
- 与原系统提示词的能力对照与 parity 文档

## 项目目标

这个仓库的目标是把 Claude Design 的核心能力迁移到 Codex，并保持三类一致性：

1. 工作流一致性
2. 高影响工具语义一致性
3. 可验证交付一致性

当前版本已经完成：

- parity-critical 12 个命令映射
- runtime / artifact / preview / verifier / export 主链路
- deck / prototype / animation / design system 等核心 skill
- 多页 PPTX / PDF 导出
- 本地短时 public URL、文件下载交付、deck shell 运行时能力

## 仓库结构

```text
claudesign-skills/
  docs/          设计规格、对照文档、计划文档
  examples/      示例产物与页面 demo
  mcp/           MCP 描述与构建单元
  packages/      contracts / command-registry
  plugins/       Codex plugins
  scripts/       运行时、导出、验证、MCP server 等脚本
  skills/        Claude Design skills
  templates/     starter components
  tests/         contracts / integration / regression
  artifacts/     验证报告、demo 报告与输出物
```

## 核心能力

### Skills

- `claude-design-core`
- `claude-design-intake`
- `claude-design-html-artifact`
- `claude-design-prototype`
- `claude-design-deck`
- `claude-design-animation`
- `claude-design-design-system`
- `claude-design-tweaks`
- `claude-design-wireframe`
- `claude-design-export-pdf`
- `claude-design-export-pptx-editable`
- `claude-design-export-pptx-screenshots`
- `claude-design-export-standalone-html`
- `claude-design-dev-handoff`
- `claude-design-canva-handoff`
- `claude-design-pdf-read`

### Plugins

- `claude-design-runtime`
- `claude-design-artifacts`
- `claude-design-browser`
- `claude-design-export`
- `claude-design-github`

### MCP

- `design-runtime-mcp`
- `design-preview-mcp`
- `design-assets-mcp`
- `design-verifier-mcp`
- `design-github-mcp`

## 已实现的主工作流

### 1. 设计 intake

- `runtime.questions.build.v1`
- `runtime.template.save.v1`
- `runtime.set_project_title.local`
- `runtime.get_public_url.local`

### 2. 资产与 artifact

- `assets.register.v1`
- `assets.unregister.v1`
- `artifact.create.v1`

### 3. 预览与验证

- `preview.open.v1`
- `preview.inspect.v1`
- `verify.done_gate.v1`
- `verify.run.v1`

### 4. 导出与交付

- `export.pptx.v1`
- `export.bundle_html.v1`
- `export.pdf_print.v1`
- `present_fs_item_for_download`

## 安装到 Codex

### 1. 安装 skills

把 `skills/claude-design-*` 复制到：

```text
C:\Users\<your-user>\.codex\skills\
```

### 2. 安装 plugins marketplace

当前仓库已经包含：

```text
.agents/plugins/marketplace.json
```

可以用 Codex marketplace 本地接入：

```bash
codex marketplace add .
```

### 3. 注册 MCP

可以把以下 server 注册到 Codex：

```bash
codex mcp add design-runtime-mcp -- cmd /c pnpm --dir <repo> exec tsx scripts/mcp/runtime-server.ts
codex mcp add design-preview-mcp -- cmd /c pnpm --dir <repo> exec tsx scripts/mcp/preview-server.ts
codex mcp add design-assets-mcp -- cmd /c pnpm --dir <repo> exec tsx scripts/mcp/assets-server.ts
codex mcp add design-verifier-mcp -- cmd /c pnpm --dir <repo> exec tsx scripts/mcp/verifier-server.ts
codex mcp add design-github-mcp -- cmd /c pnpm --dir <repo> exec tsx scripts/mcp/github-server.ts
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

## 验证命令

合同与注册表验证：

```bash
pnpm phase0:verify
```

完整集成验证：

```bash
pnpm phase1:verify
```

浏览器回归：

```bash
pnpm test:e2e -- tests/regression/examples.spec.ts
```

## Demo

### 杨萌个人宣传页

用于验证插件、skills、MCP 的实跑效果：

- 页面：`examples/yang-meng-profile/index.html`
- 运行报告：`artifacts/demo/yang-meng-mcp-run-report.json`
- 截图：`artifacts/demo/yang-meng-profile.png`
- 规格：`docs/superpowers/specs/2026-04-21-yang-meng-personal-page-design.md`

这个 Demo 采用：

- 编辑化长页
- 强层级排版
- 明显减少卡片使用
- 模拟案例与模拟成就数据

## 与原系统提示词的对照

完整对照文档：

```text
docs/superpowers/mappings/2026-04-21-claude-design-parity-comparison.md
```

该文档覆盖：

- function call / tool use 映射
- skills 映射
- parity-critical commands
- 工作流差异
- Codex adaptation differences

## 当前状态

当前仓库已经达到：

- Claude Design → Codex 核心迁移完成
- 高影响工具语义完成 Codex 适配
- 可通过 tests、browser regression、demo run 进行验证

这个仓库已经可以作为 Claude Design 风格前端插件库与技能库的可运行基础版本继续扩展。
