param(
  [string]$CleanDir = "humanvoice-studio/corpus/clean",
  [string]$OutFile = "humanvoice-studio/workspace/corpus-style-profile-zh.md"
)

if (!(Test-Path $CleanDir)) {
  Write-Error "Clean directory not found: $CleanDir"
  exit 1
}

$files = Get-ChildItem -Path $CleanDir -Filter *.txt
if ($files.Count -eq 0) {
  Write-Error "No clean corpus files found in $CleanDir"
  exit 1
}

$allText = ""
foreach ($f in $files) {
  $allText += (Get-Content -Raw -Encoding UTF8 $f.FullName) + "`n"
}

$plain = $allText -replace '\\s+', ''
$charCount = $plain.Length

$sentences = ($allText -split '[。！？!?；;]+') | Where-Object { $_.Trim().Length -gt 0 }
$clauses = ($allText -split '[。！？!?；;，,、]+') | Where-Object { $_.Trim().Length -gt 0 }

$sentLens = @()
foreach ($s in $sentences) { $sentLens += $s.Trim().Length }
$clauseLens = @()
foreach ($c in $clauses) { $clauseLens += $c.Trim().Length }

$avg = if ($sentLens.Count -gt 0) { ($sentLens | Measure-Object -Average).Average } else { 0 }
$max = if ($sentLens.Count -gt 0) { ($sentLens | Measure-Object -Maximum).Maximum } else { 0 }
$min = if ($sentLens.Count -gt 0) { ($sentLens | Measure-Object -Minimum).Minimum } else { 0 }

$avgClause = if ($clauseLens.Count -gt 0) { ($clauseLens | Measure-Object -Average).Average } else { 0 }
$maxClause = if ($clauseLens.Count -gt 0) { ($clauseLens | Measure-Object -Maximum).Maximum } else { 0 }
$minClause = if ($clauseLens.Count -gt 0) { ($clauseLens | Measure-Object -Minimum).Minimum } else { 0 }

$dialogCount = ([regex]::Matches($allText, '“[^”]{1,120}”')).Count

$markers = @('忽然','随后','却','仍','于是','只是','然后','当时','过了一会','一时')
$markerStats = @()
foreach ($m in $markers) {
  $c = ([regex]::Matches($allText, [regex]::Escape($m))).Count
  $markerStats += [pscustomobject]@{marker=$m; count=$c}
}
$topMarkers = $markerStats | Sort-Object count -Descending | Select-Object -First 8

$lines = @()
$lines += "# Chinese Human Corpus Style Profile"
$lines += ""
$lines += "- files: $($files.Count)"
$lines += "- chars: $charCount"
$lines += "- sentences: $($sentences.Count)"
$lines += ("- sentence length avg/min/max: {0:N1}/{1}/{2}" -f $avg,$min,$max)
$lines += "- clauses: $($clauses.Count)"
$lines += ("- clause length avg/min/max: {0:N1}/{1}/{2}" -f $avgClause,$minClause,$maxClause)
$lines += "- dialogue quote count: $dialogCount"
$lines += ""
$lines += "## Top discourse markers"
foreach ($t in $topMarkers) {
  $lines += ("- {0}: {1}" -f $t.marker, $t.count)
}
$lines += ""
$lines += "## Interpretation Hints"
$lines += "- Use this profile to calibrate sentence-length variance and narrative connectors."
$lines += "- Do not copy expressions directly from corpus texts."
$lines += "- Prefer structural imitation over lexical imitation."

Set-Content -Path $OutFile -Value ($lines -join "`n") -Encoding UTF8
Write-Host "Profile written: $OutFile"
