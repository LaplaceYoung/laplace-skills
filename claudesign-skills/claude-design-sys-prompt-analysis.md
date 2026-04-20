# Claude Design System Prompt Analysis

## 文件信息
- 源文件：`Claude-Design-Sys-Prompt.txt`
- 规模：约 420+ 行主提示词与工具协议
- 定位：一个面向 **HTML 设计产物生成** 的系统提示词，目标是让模型充当“设计执行者 + 原型工程师 + 交付代理”

## 1. 这个提示词是怎么设计的

### 1.1 顶层角色定义
这个提示词先把模型设成 **expert designer**，并且明确用户是 manager，模型负责代用户产出设计工件。

核心设定有三层：
1. **身份层**：设计师、动画师、UX 设计师、原型师、幻灯片设计师。
2. **媒介层**：统一使用 HTML 作为生产媒介，React/Babel/脚本是实现手段。
3. **交付层**：产物可以是页面、交互原型、deck、视频式 HTML、可导出的 PPTX/PDF、可分享模板。

这意味着它的设计目标不是“聊天解释设计”，而是“直接产出可运行设计资产”。

### 1.2 结构设计方式
整个提示词大致分成两大块：

1. **行为规约层**
   - 角色设定
   - 工作流
   - 设计方法论
   - 实现细则
   - 安全与版权边界
   - 技术约束

2. **工具协议层**
   - 明确函数调用语法
   - 给出完整函数 schema
   - 规定多工具并发与依赖顺序
   - 给出 web_search / web_fetch 的版权与引用规则

这是一个很典型的 **“策略 + SOP + ABI”** 设计：
- 策略：告诉模型应该成为什么样的 agent
- SOP：告诉模型应该按什么步骤工作
- ABI：告诉模型具体如何调用工具

### 1.3 它重点解决的模型失误
这个提示词明显在压制几类常见失误：

- **空泛设计**：要求先拿到设计系统、UI kit、代码库、截图、Figma，再开始设计。
- **从零乱造**：把“从已有设计上下文出发”写成强约束。
- **交付不落地**：要求最后必须 `done`，再交给 `fork_verifier_agent`。
- **HTML 工程事故**：专门约束 React/Babel script 版本、全局样式对象命名、跨脚本作用域共享。
- **演示产物易崩**：要求 deck/video 保存播放位置，要求 fixed-size 内容做自适应缩放。
- **审美 AI 味太重**：专门列出 AI slop tropes，限制 gradient、emoji、常见字体、无意义信息填充。
- **版权风险**：禁止复刻公司特征化界面，除非邮箱域名表明用户属于该公司。

## 2. 它实际在做什么

### 2.1 把 HTML 当成统一设计运行时
这个提示词把 HTML 变成统一的设计容器：
- 静态视觉探索：HTML + CSS + SVG
- 交互原型：HTML + React + JS
- deck：HTML + `deck_stage.js`
- 动画视频：HTML + `animations.jsx`
- 导出：PPTX / PDF / standalone HTML

设计上非常聪明的一点是：**用一个通用运行时覆盖多种设计交付类型**，这样工具链统一，验证链统一，用户预览方式也统一。

### 2.2 把“设计工作流”写成可执行流程
提示词里的标准流程是：
1. 理解需求，必要时提问
2. 读取设计系统与相关资源
3. 计划 / todo
4. 搭目录与复制资源
5. 完成后调用 `done`
6. clean 后调用 `fork_verifier_agent`
7. 用极短总结收尾

这说明它不是单轮回答型 prompt，而是 **项目式执行 prompt**。

### 2.3 把“设计评审机制”内建进系统
它内建了两个关键机制：
- `questions_v2`：项目开始阶段结构化收集偏好
- `fork_verifier_agent`：交付阶段自动做背景验证

这让 prompt 自带“需求澄清环”和“验收闭环”。

## 3. Function Call / Tool Use 是怎么设计的

## 3.1 调用协议
它使用 XML 风格函数调用块：

```xml
<function_calls>
  <invoke name="tool_name">
    <parameter name="arg">value</parameter>
  </invoke>
</function_calls>
```

这说明它服务于一个支持 **显式函数调用标记** 的宿主环境，模型通过生成结构化片段来触发工具。

## 3.2 工具设计风格
工具系统有几个明显特征：

1. **文件系统中心**
   - 所有设计产物都围绕 project filesystem 组织。
   - 支持读、写、复制、搜索、替换、删除、展示、打包、下载。

2. **预览中心**
   - 区分“给模型自己看的 preview”和“给用户看的 preview”。
   - `show_html` 面向 agent 自查，`show_to_user` / `done` 面向用户交付。

3. **浏览器验证中心**
   - 可以取 console logs、执行 JS、截图、批量截图、导出 PPTX。
   - 说明它运行在带 iframe / webview 的设计沙盒里。

4. **流程编排中心**
   - 有 todo、skill、questions、snip、verifier。
   - 这类工具不是内容工具，而是 agent orchestration 工具。

5. **懒加载能力中心**
   - skill 不一次性塞进主 prompt，而是通过 `invoke_skill` 按需加载。

## 3.3 全量函数清单
提示词内显式列出的函数共有 **37 个**：

### 文件与项目操作
- `read_file`
- `write_file`
- `list_files`
- `grep`
- `delete_file`
- `copy_files`
- `str_replace_edit`
- `register_assets`
- `unregister_assets`

### 预览、检查、脚本执行
- `copy_starter_component`
- `show_html`
- `show_to_user`
- `done`
- `view_image`
- `image_metadata`
- `get_webview_logs`
- `sleep`
- `save_screenshot`
- `multi_screenshot`
- `eval_js_user_view`
- `screenshot_user_view`
- `run_script`

### 导出与分发
- `gen_pptx`
- `super_inline_html`
- `open_for_print`
- `present_fs_item_for_download`
- `get_public_file_url`
- `save_as_template`

### 流程编排与集成
- `update_todos`
- `invoke_skill`
- `questions_v2`
- `set_project_title`
- `connect_github`
- `snip`
- `fork_verifier_agent`

### 外部信息获取
- `web_search`
- `web_fetch`

## 3.4 最关键的工具链路
这个 prompt 最核心的工具链路有 6 条：

1. **需求澄清链**
   - `questions_v2`

2. **资源探索链**
   - `list_files` → `read_file` / `grep` / `view_image`

3. **搭建链**
   - `copy_starter_component` → `write_file` / `str_replace_edit` / `copy_files`

4. **预览链**
   - `show_html` → `get_webview_logs`

5. **正式交付链**
   - `done` → `fork_verifier_agent`

6. **导出链**
   - `gen_pptx` / `super_inline_html` / `open_for_print` / `present_fs_item_for_download`

## 3.5 这个工具系统最有代表性的设计点

### A. `done` 是交付闸门
`done` 不只是“展示文件”，它还负责：
- 打开用户视图
- 检查 console error
- 作为后续 verifier 的前置条件

也就是说，**交付 = 展示 + 基础验收**。

### B. `fork_verifier_agent` 是二级验收
提示词要求 clean 后再 fork verifier，说明设计者 agent 与 verifier agent 是分工架构：
- 主 agent 负责创作
- verifier 负责后台检查

这是明显的双 agent 设计。

### C. `questions_v2` 是产品经理式 intake 表单
它要求：
- 问题尽量多
- 至少 10 个问题
- 包含视觉、交互、变体、起点资产等
- 用结构化 UI 收集而不是纯文本追问

这说明它很重视 **前置信息密度**。

### D. `snip` 是上下文管理器
这个工具专门用来删掉旧对话范围，避免上下文爆炸。说明提示词在设计时已经考虑了长任务、多轮设计迭代的 token 压力。

### E. GitHub 工具是条件暴露能力
正文里提到 `github_get_tree`、`github_import_files`、`github_read_file`、`github_list_repos`，但它们没有出现在当前 schema 清单中。说明这套系统支持 **按连接状态动态增减工具集**。

## 4. Skill 是怎么设计的

## 4.1 Skill 机制
这个提示词的 skill 机制是 **按需加载**：
- 主 prompt 只保留 skill 入口和使用时机
- 具体 skill 内容通过 `invoke_skill` 动态注入
- 只有用户需求匹配时才加载

这样做的好处是：
- 主 prompt 更短
- 不同任务可以切换不同专长
- 能力可以扩展，不需要重写主系统提示词

## 4.2 直接点名的 skill
提示词正文里直接点名了两个 skill：

1. **read_pdf skill**
   - 用于读取 PDF
   - 提示里写成“learn how by invoking the read_pdf skill”

2. **Frontend design skill**
   - 当任务缺少现有品牌或设计系统时启用
   - 用来给设计方向建立更大胆、更成体系的审美指导

## 4.3 内建技能列表
当前 prompt 明确列出 13 个 built-in skills：

- Animated video
- Interactive prototype
- Make a deck
- Make tweakable
- Frontend design
- Wireframe
- Export as PPTX (editable)
- Export as PPTX (screenshots)
- Create design system
- Save as PDF
- Save as standalone HTML
- Send to Canva
- Handoff to Claude Code

## 4.4 Skill 体系的作用
这些 skill 覆盖了四类能力：

1. **创作类**
   - Animated video
   - Interactive prototype
   - Wireframe
   - Frontend design

2. **结构类**
   - Make a deck
   - Make tweakable
   - Create design system

3. **导出类**
   - Export as PPTX
   - Save as PDF
   - Save as standalone HTML
   - Send to Canva

4. **交接类**
   - Handoff to Claude Code

这说明它想把 HTML 设计代理做成一个 **多模态设计工作台**，而不是单一网页生成器。

## 5. 这个提示词的核心设计哲学

### 5.1 “设计上下文优先”
它反复强调：
- 先找设计系统
- 先找代码库
- 先找组件
- 先找截图 / Figma / GitHub

核心思想是：**好设计来自上下文对齐，而不是凭空创作。**

### 5.2 “产物优先”
提示词几乎所有要求都围绕“最后交一个可运行、可预览、可验证、可导出的 HTML 产物”。

### 5.3 “流程强约束”
它没有只给原则，还给了很多工程级硬规则：
- pinned React/Babel 版本
- style object 命名规范
- 多 Babel 文件作用域处理
- slide 编号必须 1-indexed
- fixed-size 内容必须 scale
- Tweaks 状态必须可持久化

这类 prompt 设计方式非常适合降低执行漂移。

### 5.4 “把常见坑提前写死”
这个 prompt 很像一份“设计代理事故手册”的反向版本：
- 防 generic UI
- 防页面崩溃
- 防 scope 冲突
- 防版权复刻
- 防信息填充
- 防工具乱用
- 防上下文爆炸

## 6. 我对它的判断

这是一个 **成熟度很高的垂直场景系统提示词**，特点是：
- 目标单一：HTML 设计交付
- 规范密集：把大量失败模式前置成规则
- 工具闭环完整：提问、读写、预览、验证、导出、分享一条龙
- skill 设计清晰：主 prompt 保持轻量，能力按需扩展
- 多 agent 思路明确：主 agent 创作，verifier agent 验收

它本质上是在把 Claude 塑造成一个：
**会问需求、会读资产、会搭原型、会导出交付、会自检验收的设计生产代理。**

## 7. 适合你的一个实用结论
如果你要仿写这类系统提示词，最值得复用的是这 5 个骨架：

1. **角色骨架**：先定义身份、媒介、交付目标。
2. **流程骨架**：把工作流写成固定步骤。
3. **坑位骨架**：把高频失败模式提前固化成规则。
4. **工具骨架**：把工具分成探索、构建、验证、导出四层。
5. **skill 骨架**：主 prompt 保持简洁，复杂能力按需 invoke。

照这个方向写，你会得到一个更稳定、更像专业 agent 的系统提示词。
