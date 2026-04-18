param(
  [string]$CaseFile = "humanvoice-studio/regressions/test-cases.json"
)

if (!(Test-Path $CaseFile)) {
  Write-Error "Case file not found: $CaseFile"
  exit 1
}

$cases = Get-Content -Raw $CaseFile | ConvertFrom-Json
$count = $cases.Count

Write-Host "Humanvoice eval (draft)"
Write-Host "Loaded cases: $count"
Write-Host "Scenes:"
$cases | Group-Object scene | ForEach-Object {
  Write-Host ("- {0}: {1}" -f $_.Name, $_.Count)
}

Write-Host ""
Write-Host "Next: plug this script into your generation pipeline and rubric scoring."
