---
name: prd-spec-generation
description: 按公司 PRD 模板与示例写法输出结构完整、工程可执行的需求文档
version: v0.1
template_version: 1.1
owner: xiaoz
cn_title: PRD需求文档写作
en_alias: prd-spec-generation
skill_family: prd
primary_artifact: PRD document
---

# 目标 / Objective
- Job-to-be-done: 把零散需求、业务背景、页面逻辑、会议结论整理成一份可评审、可开发、可验收的中文 PRD。
- Primary user: AI 产品经理、功能 owner、需要给设计/研发/测试对齐需求的人。
- Success definition: 输出文档严格保留 PRD 模板的六个一级章节，并补齐功能清单、功能详情、优先级、边界处理、埋点和设计要求。

# 触发信号 / Trigger signals
- 用户说“写 PRD”“整理需求文档”“按模板输出需求”“把这些材料整理成需求文档”。
- 文件夹里有需求 PDF / 草稿 /会议笔记，需要归纳成统一规范文档。
- 需要把 discovery 结论、页面逻辑、交互细节和边界情况整理给研发评审。

# 启用条件 / Activation conditions
- Must-have context: 至少要有功能主题、目标用户/使用对象、一个以上原始材料来源。
- Evidence threshold: 若缺少关键业务规则、上线范围、优先级判断依据，需要在文档中显式写“待确认项”。
- Stop and ask user when: 连功能目标、使用对象、输出用途都不清楚，或者用户没有给任何可整理材料。

# 不启用条件 / Do not use when
- 用户只要需求发现与研究，不需要形成正式文档，此时优先用 `01-discovery-research`。
- 用户只要做路线图排序、版本优先级博弈，不需要完整 PRD，此时优先用 `04-roadmap-prioritization`。
- 用户只要总结会议纪要、行动项，不要把纪要硬扩写成 PRD，优先用 `05-meeting-review-synthesis`。

# 输入要求 / Inputs
## Required
- 功能主题 / 项目名称
- 目标用户或使用角色
- 至少一种原始材料：PDF、需求草稿、会议纪要、页面说明、口头描述

## Optional
- 版本目标 / 上线窗口
- 设计稿链接 / 截图
- 埋点要求或业务指标
- 竞品参考或对标交互

## Assumptions to declare
- 哪些业务规则来自明确材料，哪些是为保证文档完整性做的待确认假设
- 是否需要引入最新外部竞品信息；若需要，应单独验证来源

# 本地参考 / Local references
- `references/prd-template-sanitized.md`：PRD 一级章节和核心表格硬模板
- `references/prd-writing-patterns-sanitized.md`：PRD 写法模式、P0-P4 优先级、页面逻辑和多模块联动写法
- `references/prd-edge-cases-sanitized.md`：AI 需求的边界处理、数据优先级、无信息回复原则
- `references/source-coverage.md`：本 skill 可使用的脱敏来源覆盖说明

# Tools 类型类别与启用规则 / Tool categories
| Category | Typical tool types | Enable when | Avoid when | Expected evidence |
| --- | --- | --- | --- | --- |
| Local docs/files | shell / file read / pdf text extraction | 用户给了 PRD 模板、历史需求文档、会议记录、PDF | 没有本地材料时不要虚构“历史规范” | 来源文件名 + 提取要点 |
| Structured docs | markdown / table / template writing | 需要输出标准 PRD、功能表、边界表、埋点表 | 不需要正式需求文档时避免过度模板化 | 完整 PRD 章节与表格 |
| Data analysis | spreadsheet / metric parsing | 需求涉及指标、埋点、实验结果、优先级量化 | 没有数据时不要编造 KPI | 指标来源、口径说明 |
| Web research | official docs / product pages / current facts | 用户明确要求补最新竞品/政策/标准能力 | 仅需按本地模板整理内部需求时 | 外部来源链接与时间说明 |
| No-browse reasoning | direct synthesis only | 本地材料已足够、只做内部需求整理 | 一旦要写“行业通行做法/竞品现在如何”就不能只靠记忆 | 基于本地材料的结构化重写 |

# 任务流程 / Workflow
1. Intake and template-fit check
   - 先确认输出是正式 PRD，而不是 discovery 简报。
   - 锁定必须保留的一级章节顺序：1需求背景、2用户场景、3功能需求、4非功能需求、5埋点需求、6设计图。
2. Evidence collection and source mapping
   - 读取 `需求文档基础模版.pdf` 作为硬模板。
   - 同时读取其他需求文档，提取可复用写法：优先级分级、页面逻辑、交互细节、数据优先级、边界问题。
   - 若用户补充了 Excel / 指标表，则解析关键口径并写入埋点或验收相关部分。
3. PRD skeleton drafting
   - 先写文档头：标题、版本信息、适用范围、待确认项（如需要）。
   - 再按六个一级章节铺开，不允许跳章、不允许漏章。
4. Core requirement authoring
   - **1 需求背景**：写清背景、来源、为什么要做、预期业务价值。
   - **2 用户场景**：用表格写场景/角色/目标/触发条件/预期结果。
   - **3.1 功能清单**：按功能域列功能、说明、优先级、上线版本。
   - **3.2 功能详情**：逐项写功能名称、子功能、业务规则、边界与异常情况处理、示意图说明。
5. Extended requirement enrichment
   - 若涉及复杂页面流程，补“页面逻辑”或“用户操作流程”作为 3.x 子节。
   - 若涉及 AI 问答/生成，补“数据来源与优先级”“边界问题”“标准回复原则”。
   - 若涉及多系统联动，补“数据引用与展示”“关联限制”“交互细节”。
6. Non-functional and analytics completion
   - **4 非功能需求**：性能、稳定性、兼容性、权限、可追踪性。
   - **5 埋点需求**：关键事件、触发条件、核心字段、分析目标。
   - **6 设计图**：链接/截图/待补说明，不能空白不解释。
7. Self-check and final response
   - 检查是否缺少表格列、优先级依据、边界处理、待确认项。
   - 若信息不足，明确写“待确认”或“未提供”，不能杜撰业务规则。

# 输出物 / Outputs
- Primary artifact: 中文 PRD 文档
- Supporting tables or checklists: 用户场景表、功能清单表、功能详情表、埋点表、待确认项清单
- Decision / recommendation summary: 本版 PRD 的范围、优先级、关键风险、待评审重点
- Follow-up / escalation path: 交给设计补图 / 交给业务补规则 / 进入评审 / 进入路线图排序

# 严格输出结构 / Strict output schema
- Required sections: 1需求背景、2用户场景、3功能需求、4非功能需求、5埋点需求、6设计图
- Required tables / fields: 用户场景表、功能清单表、功能详情表；若无埋点或设计图，也要明确写“暂缺/待补”
- Minimal completion rule: 六个一级章节必须全部出现，且 3.1 / 3.2 必须分开呈现

# 失败模式 / Failure modes
- missing_context: 缺少业务背景、目标用户、边界规则时，只能输出待确认 PRD 草稿。
- conflicting_constraints: 用户既要极简首发又要求全量覆盖，需明确分版本或分优先级处理。
- low_confidence: 需要最新竞品或标准信息但没有可靠来源。
- out_of_scope: 用户实际只要会议总结、竞品分析或纯技术方案，不应强制产出 PRD。

# 质量检查 / Quality checks
- Contract compliance target: 一级章节顺序和核心表格必须完整。
- Artifact completeness target: 至少包含一个用户场景表、一个功能清单表、一个功能详情表、一个待确认列表（如有缺口）。
- Measurable gate: rubric >= 85/100，format compliance >= 95%，缺失一级章节数 = 0。
- Bilingual consistency target: 中文主文档为准，英文 alias 仅作标识，不混淆命名。
- Hallucination guard: 所有“竞品现状”“数据优先级”“异常处理原则”都必须来自材料或明确标注为建议稿。

# Example prompt
请把下面材料整理成正式 PRD：目标是“字字助手-报告编辑器智能审核”，材料包括一个旧版聊天助手需求文档、一个页面逻辑草稿、几条销售反馈和研发限制说明。请严格按 PRD 模板输出，必须保留“1需求背景、2用户场景、3功能需求（3.1功能清单 / 3.2功能详情）、4非功能需求、5埋点需求、6设计图”这六个一级章节；同时借鉴历史文档中的 P0-P4 优先级、页面逻辑、数据来源优先级、边界问题写法。

# Expected output shape
- 文档标题 + 版本记录
- 1 需求背景
- 2 用户场景（表格）
- 3 功能需求
  - 3.1 功能清单（表格）
  - 3.2 功能详情（表格 + 子节）
- 4 非功能需求
- 5 埋点需求
- 6 设计图
- 待确认项 / 评审重点
