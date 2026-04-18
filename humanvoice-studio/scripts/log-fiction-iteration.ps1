param(
  [string]$BaselineFile,
  [string]$CandidateFile,
  [string]$LogFile = "humanvoice-studio/workspace/iteration-log.md"
)

if (!(Test-Path $BaselineFile)) { Write-Error "Baseline not found"; exit 1 }
if (!(Test-Path $CandidateFile)) { Write-Error "Candidate not found"; exit 1 }

$base = Get-Content -Raw -Encoding UTF8 $BaselineFile
$cand = Get-Content -Raw -Encoding UTF8 $CandidateFile

$baseChars = ($base -replace '\\s+', '').Length
$candChars = ($cand -replace '\\s+', '').Length
$ratio = if ($baseChars -gt 0) { [math]::Round(100.0 * $candChars / $baseChars, 2) } else { 0 }

$ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$entry = @"
## $ts
- baseline: $BaselineFile
- candidate: $CandidateFile
- chars baseline/candidate: $baseChars / $candChars
- length ratio: $ratio%
- next: run eval-fiction-style.ps1 and external detector, then update zh-fiction-novel rules only if pattern repeats across >=3 different texts.
"@

if (!(Test-Path $LogFile)) {
  Set-Content -Path $LogFile -Value "# Fiction Iteration Log`n" -Encoding UTF8
}
Add-Content -Path $LogFile -Value "`n$entry" -Encoding UTF8
Write-Host "Logged iteration to $LogFile"
