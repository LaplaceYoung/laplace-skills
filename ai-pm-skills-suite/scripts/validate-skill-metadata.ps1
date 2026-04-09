param(
  [string]$Root = "..\skills"
)

$requiredTokens = @(
  'template_version',
  'cn_title',
  'en_alias',
  'skill_family',
  'primary_artifact',
  '# 目标 / Objective',
  '# 触发信号 / Trigger signals',
  '# 启用条件 / Activation conditions',
  '# 不启用条件 / Do not use when',
  '# 输入要求 / Inputs',
  '# Tools 类型类别与启用规则 / Tool categories',
  '# 任务流程 / Workflow',
  '# 输出物 / Outputs',
  '# 严格输出结构 / Strict output schema',
  '# 失败模式 / Failure modes',
  '# 质量检查 / Quality checks',
  '# Example prompt',
  '# Expected output shape'
)

$placeholderTokens = @(
  '<skill-name>',
  '<what this skill does>',
  '<中文标题>',
  '<english-alias>',
  '<family>',
  '<main deliverable>',
  '<name>'
)

Write-Host "Validate skill metadata under $Root"

Get-ChildItem -Path $Root -Recurse -Filter 'SKILL.md' -ErrorAction SilentlyContinue | ForEach-Object {
  $content = Get-Content -Raw $_.FullName
  $missing = @()
  foreach ($token in $requiredTokens) {
    if ($content.IndexOf($token) -lt 0) {
      $missing += $token
    }
  }

  $foundPlaceholders = @()
  foreach ($token in $placeholderTokens) {
    if ($content.IndexOf($token) -ge 0) {
      $foundPlaceholders += $token
    }
  }

  if ($missing.Count -gt 0 -or $foundPlaceholders.Count -gt 0) {
    $missingText = if ($missing.Count -gt 0) { $missing -join ', ' } else { 'none' }
    $placeholderText = if ($foundPlaceholders.Count -gt 0) { $foundPlaceholders -join ', ' } else { 'none' }
    Write-Warning ("Review needed: {0} :: missing [{1}] :: placeholders [{2}]" -f $_.FullName, $missingText, $placeholderText)
  } else {
    Write-Host "OK: $($_.FullName)"
  }
}
