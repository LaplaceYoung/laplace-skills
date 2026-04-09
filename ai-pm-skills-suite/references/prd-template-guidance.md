# PRD Template Guidance

## 1. Mandatory document structure
For the `02-prd-spec-generation` skill, the output must preserve these top-level sections from `需求文档基础模版.pdf`:
1. 需求背景
2. 用户场景
3. 功能需求
   - 3.1 功能清单
   - 3.2 功能详情
4. 非功能需求
5. 埋点需求
6. 设计图

## 2. Required tables
### 2.1 用户场景表
| 场景 | 用户角色 | 用户目标 | 触发条件 | 预期结果 |
| --- | --- | --- | --- | --- |

### 2.2 功能清单表
| 功能 | 说明 | 优先级 | 上线版本 |
| --- | --- | --- | --- |

### 2.3 功能详情表
| 功能名称 | 子功能 | 业务规则 | 边界与异常情况处理 | 示意图 |
| --- | --- | --- | --- | --- |

## 3. Patterns learned from example PDFs
### From `字字助手需求文档.pdf`
- Add explicit P0-P4 priority definitions and judgment criteria when feature scope is large.
- Split broad requirements into capability domains, then into feature rows.
- For AI features, describe conversation experience, session management, input enhancement, and context management separately when relevant.

### From `字字助手·当前页面问答 需求文档.pdf`
- Add coverage range when the feature spans multiple pages or modules.
- Define data-source priority / context priority when AI answers depend on multiple sources.
- Add edge-case handling and standard reply principles for unavailable or low-confidence information.

### From `通用报告生成需求文档.pdf`
- Add page logic / step flow when the feature is form- or workflow-driven.
- Document page-level interaction details when UI sequence matters.
- Keep section wording concise and implementation-facing.

### From `_财务&报告联动需求文档.pdf`
- Use operation flows, interaction details, and data reference tables when multiple systems/modules are linked.
- Explicitly describe what data is referenced, how it is displayed, and what one-to-many / many-to-one limits exist.

## 4. Default PRD writing rules
1. Chinese-first internal product style.
2. Prefer concrete tables over prose when listing features or rules.
3. If the user gives incomplete info, write assumptions explicitly instead of inventing facts.
4. If the feature involves AI output, document:
   - data source priority
   - response boundaries
   - exception handling
   - no-hallucination principle
5. Optional sections may be inserted as subsections, but the six mandatory top-level sections must remain in order.
