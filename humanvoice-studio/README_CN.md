# Humanvoice Studio（中文）

Humanvoice Studio 是一个“让 AI 更讲人话”的写作技能包，目标是让输出自然、清晰、贴近真实读者。

## 覆盖场景
- 日常交流
- 社媒发帖
- 学术写作
- 长文写作
- 改写与同义转述
- 中文专用场景优化（已落地）

## 目录说明
- `SKILL.md`：技能入口与路由
- `prompts/core/`：全局风格约束
- `prompts/scenes/`：场景化提示词
- `prompts/zh/core/`：中文专项规则（口语化、节奏、句式约束）
- `prompts/zh/scenes/`：中文场景提示词（日常/发帖/学术/长文/改写）
- `prompts/zh/scenes/zh-fiction-novel.md`：中文小说专用场景（人物声纹 + 节奏去模板）
- `references/rubric.md`：人话质量评分标准
- `references/rubric-zh.md`：中文专项评分标准
- `regressions/test-cases.json`：固定回归样本
- `regressions/test-cases-zh.json`：中文回归样本
- `scripts/eval-humanvoice.ps1`：本地评测脚本（初版）
- `scripts/eval-fiction-style.ps1`：小说风格体检（对白占比/模板短语/重复片段）
- `scripts/fetch-human-corpus-zh.ps1`：抓取人写语料源（按 `corpus/sources-human-zh.json`）
- `scripts/clean-human-corpus-zh.ps1`：HTML 语料清洗为纯文本
- `scripts/build-corpus-style-profile-zh.ps1`：构建“人写文本风格画像”
- `scripts/log-fiction-iteration.ps1`：记录每轮迭代长度与评测步骤

## 快速使用
1. 选择一个场景 prompt。
2. 叠加 core 规则。
3. 生成文本。
4. 需要验收时按 rubric 打分。
5. 中文任务优先走 `prompts/zh/core` + `prompts/zh/scenes`。

## 持续迭代流程（推荐）
1. `fetch-human-corpus-zh.ps1` 抓取公开人写语料。
2. `clean-human-corpus-zh.ps1` 清洗语料。
3. `build-corpus-style-profile-zh.ps1` 生成风格画像。
4. 用 `zh-fiction-novel` 改写候选文本。
5. `eval-fiction-style.ps1` + 外部检测器双重评估。
6. `log-fiction-iteration.ps1` 记录本轮结果，仅在跨多个文本都出现同类问题时再更新规则（防过拟合）。

## 仓库洁净约定
- `corpus/raw/` 与 `corpus/clean/` 默认只保留 `.gitkeep`，抓取和清洗产物不直接入库。
- `workspace/` 仅保留可复用笔记；临时画像与迭代日志通过 `.gitignore` 排除。
- 规则更新必须基于多文本证据，避免围绕单一测试样本过拟合。

## 当前进度（v0.1 草案）
- core 规则：完成
- 场景 prompt：完成（5个）
- 中文场景 prompt：完成（5个）
- 回归样本：初版
- 评测脚本：初版
