# Claude Design Codex 版与原系统提示词对照报告

**日期：** 2026-04-21  
**对照源：** `Claude-Design-Sys-Prompt.txt`  
**当前仓库：** `F:\简历项目\Laplace-skills\claudesign-skills`

## 1. 结论

当前仓库已经完成 **Claude Design → Codex** 的核心可运行迁移，达到：

1. **12 个 parity-critical command 全量落地并验证通过**
2. **核心工作流闭环已经跑通**：intake → artifact → preview → done gate → verifier → export → handoff
3. **skills / plugins / MCP / scripts / examples / tests** 五层结构已经成型
4. **与原提示词相比，关键差异已经从“缺实现”收敛为“适配方式不同”**

当前版本更准确的定位是：

- **关键能力面：已实现**
- **Codex 适配面：已实现**
- **长尾宿主原生能力：以 Codex 原生工具或适配层替代**
- **字节级宿主复刻：没有必要，当前也没有采用**

---

## 2. Function Call / Tool Use 对照

### 2.1 parity-critical 12 个命令

| 原能力 | Codex 命令 | 当前状态 | 证据 |
|---|---|---|---|
| `questions_v2` | `runtime.questions.build.v1` | 已实现 | `scripts/questions/build-question-schema.ts` |
| `save_as_template` | `runtime.template.save.v1` | 已实现 | `scripts/runtime/template-store.ts` |
| `register_assets` | `assets.register.v1` | 已实现 | `scripts/asset-registry/registry.ts` |
| `unregister_assets` | `assets.unregister.v1` | 已实现 | `scripts/asset-registry/registry.ts` |
| `html_artifact_create` | `artifact.create.v1` | 已实现 | `scripts/artifacts/create-artifact.ts` |
| `show_html` | `preview.open.v1` | 已实现 | `scripts/preview/preview-open.ts` |
| `get_webview_logs` | `preview.inspect.v1` | 已实现 | `scripts/runtime/contract-adapters.ts` |
| `done` | `verify.done_gate.v1` | 已实现 | `scripts/preview/done-gate.ts` |
| `fork_verifier_agent` | `verify.run.v1` | 已实现 | `scripts/verifier/run-verifier.ts` |
| `gen_pptx` | `export.pptx.v1` | 已实现 | `scripts/exports/gen-pptx.ts` |
| `super_inline_html` | `export.bundle_html.v1` | 已实现 | `scripts/exports/bundle-standalone.ts` |
| `open_for_print` | `export.pdf_print.v1` | 已实现 | `scripts/exports/open-for-print.ts` |

### 2.2 其余原工具的 Codex 适配方式

| 原工具 | Codex 适配方式 | 状态 |
|---|---|---|
| `read_file` | shell / 本地文件读取 | 已满足 |
| `write_file` | shell / patch / 本地文件写入 | 已满足 |
| `list_files` | shell | 已满足 |
| `grep` | shell | 已满足 |
| `delete_file` | shell | 已满足 |
| `copy_files` | shell / scripts | 已满足 |
| `str_replace_edit` | patch / 编辑工具 | 已满足 |
| `copy_starter_component` | `scripts/starters/copy-starter.ts` | 已实现 |
| `show_to_user` | Codex 响应 + artifacts/examples 交付 | 已适配 |
| `view_image` | Codex 原生图像查看 | 已满足 |
| `image_metadata` | 通过 assets lane 扩展点承接 | 已适配 |
| `sleep` | shell | 已满足 |
| `save_screenshot` | Playwright / DevTools 路径 | 已适配 |
| `multi_screenshot` | Playwright / DevTools 路径 | 已适配 |
| `eval_js_user_view` | Playwright / DevTools 路径 | 已适配 |
| `screenshot_user_view` | Playwright / DevTools 路径 | 已适配 |
| `run_script` | shell + Node scripts | 已满足 |
| `present_fs_item_for_download` | `scripts/exports/present-download.ts` | 已实现，支持 file / folder / project |
| `get_public_file_url` | `scripts/runtime/public-url-server.ts` | 已实现，本地短时 URL 适配 |
| `update_todos` | `update_plan` | 已满足 |
| `invoke_skill` | Codex skills 机制 | 已满足 |
| `set_project_title` | `scripts/runtime/template-store.ts` | 已实现 |
| `connect_github` | `plugins/claude-design-github` + `design-github-mcp` | 已实现 |
| `snip` | Codex 对话裁剪 + `.omx/context`/state 机制 | 已适配 |
| `web_search` | Codex web | 已满足 |
| `web_fetch` | Codex web / shell fetch 路径 | 已满足 |

### 2.3 原工具体系与当前差异

差异集中在两类：

1. **原系统的宿主原生函数** 现在由 Codex 原生能力承担  
   例如文件系统、图像查看、搜索、网页抓取。
2. **原系统的设计沙盒函数** 现在由 MCP + scripts + Playwright 组合承担  
   例如 preview、done gate、verifier、截图、导出。

这属于 **平台迁移后的正常适配差异**，当前已经满足功能目标。

---

## 3. Skill 对照

### 3.1 原 prompt built-in skills 对照结果

| 原 skill | 当前 skill | 状态 |
|---|---|---|
| Animated video | `claude-design-animation` | 已实现 |
| Interactive prototype | `claude-design-prototype` | 已实现 |
| Make a deck | `claude-design-deck` | 已实现 |
| Make tweakable | `claude-design-tweaks` | 已实现 |
| Frontend design | `claude-design-frontend-direction` | 已实现 |
| Wireframe | `claude-design-wireframe` | 已实现 |
| Export as PPTX (editable) | `claude-design-export-pptx-editable` | 已实现 |
| Export as PPTX (screenshots) | `claude-design-export-pptx-screenshots` | 已实现 |
| Create design system | `claude-design-design-system` | 已实现 |
| Save as PDF | `claude-design-export-pdf` | 已实现 |
| Save as standalone HTML | `claude-design-export-standalone-html` | 已实现 |
| Send to Canva | `claude-design-canva-handoff` | 已实现 |
| Handoff to Claude Code | `claude-design-dev-handoff` | 已实现 |
| read_pdf | `claude-design-pdf-read` | 已实现 |

### 3.2 扩展 skill

当前还补充了：

- `claude-design-core`
- `claude-design-intake`
- `claude-design-html-artifact`

这三项属于对 Codex 适配更友好的工作流封装。

---

## 4. 结构与插件层对照

### 4.1 plugins

已实现 5 个插件：

- `claude-design-runtime`
- `claude-design-artifacts`
- `claude-design-browser`
- `claude-design-export`
- `claude-design-github`

### 4.2 MCP

已实现 5 个 MCP：

- `design-runtime-mcp`
- `design-preview-mcp`
- `design-assets-mcp`
- `design-verifier-mcp`
- `design-github-mcp`

### 4.3 scripts

已实现的脚本面：

- starters
- artifacts
- asset-registry
- preview
- verifier
- exports
- github
- runtime persistence helpers

### 4.4 examples

已实现 4 个示例：

- prototype
- deck
- animation
- design-system

并且已经有浏览器回归覆盖。

---

## 5. 工作流与约束对照

### 5.1 已满足的原工作流约束

| 原工作流要求 | 当前状态 |
|---|---|
| 先 intake 再生成 | 已满足 |
| 产物中心化 | 已满足 |
| preview → done → verifier | 已满足 |
| export 独立成链路 | 已满足 |
| GitHub/context import | 已满足 |
| examples 作为回归基线 | 已满足 |
| contract freeze + registry + coverage | 已满足 |

### 5.2 已满足的工程约束

| 原约束 | 当前状态 |
|---|---|
| 长任务可持续推进 | 已满足，`.omx/context` 持续记录 |
| 交付前验证 | 已满足 |
| verifier 二级检查 | 已满足 |
| artifact / asset path safety | 已满足 |
| browser 回归 | 已满足 |

### 5.3 仍与原 prompt 不同的地方

这些差异属于 **实现策略差异**，不是能力缺失：

1. 原 prompt 直接约束 React/Babel 版本、HTML 工程写法  
   当前仓库更多通过模块边界、测试与 artifact lane 管理。
2. 原 prompt 有更强的视觉审美规则和 anti-slop 文本规则  
   当前仓库把这部分主要保留在分析文档与工作流中，没有全部编码成 lint 级约束。
3. 原 prompt 的 screenshot/eval-js 是宿主函数  
   当前由 Playwright / DevTools 路径承接。
4. `get_public_file_url` 在原宿主里指向 sandbox origin 的短时公网 URL  
   当前实现为 **本机短时可抓取 URL**，满足 Codex 本地运行、浏览器验证、Canva 类导入前的适配测试。
5. `gen_pptx` 与 `open_for_print` 在原宿主依赖浏览器合成捕获  
   当前实现改为 **HTML 结构解析 + 多页导出**，已经具备 slide 级导出语义，导出策略仍与原宿主不同。

---

## 6. 当前验证状态

基于当前仓库最新实现，已经有：

- contracts tests
- registry tests
- integration tests
- examples browser regression
- build verification

当前完成面已经覆盖：

1. command contract correctness
2. registry integrity
3. runtime / assets / github / artifact / export / verifier integration
4. examples browser execution
5. build consistency

---

## 7. 最终判断

### 7.1 已完成项

这个 Codex 版 Claude Design 现在已经完成了：

- 原系统的核心功能迁移
- 原系统的核心 skill 迁移
- 原系统的关键 function/tool 迁移
- parity-critical 12 command 全量实现
- examples + regression + verifier + export 的闭环
- runtime persistence、短时 public URL、本地下载交付、slide 级 PPTX/PDF 导出、deck shell 关键语义补齐

### 7.2 当前最准确的完成度表述

最准确的说法是：

> **Claude Design 的 Codex 适配版已经完成核心功能迁移，并满足关键工作流、关键命令面与高影响工具语义面的可交付实现。**

### 7.3 对“原系统提示词是否都实现满足了”的回答

可以分两层回答：

1. **关键能力与关键链路：是，已经满足。**
2. **工具语义高影响区域：已满足 Codex 适配运行要求。**
3. **宿主平台级原生细节：采用 Codex 化适配，部分实现策略与原系统不同。**

这个结果符合最初设计目标：

- 追求 **行为等价与工作流等价**
- 保留 **Codex 宿主适配差异**

因此当前任务可以认定为 **Claude Design → Codex 核心迁移完成，宿主细节以适配实现交付**。
