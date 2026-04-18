param(
  [Parameter(Mandatory = $true)]
  [string[]]$Files,
  [string]$PatternFile = ""
)

function Get-Text([string]$path) {
  if (!(Test-Path $path)) { throw "File not found: $path" }
  return Get-Content -Raw -Encoding UTF8 $path
}

function Get-Sentences([string]$text) {
  $arr = $text -split '[。！？!?\n]+'
  return $arr | Where-Object { $_.Trim().Length -gt 0 }
}

function StdDev([double[]]$vals) {
  if ($vals.Count -le 1) { return 0.0 }
  $mean = ($vals | Measure-Object -Average).Average
  $sum = 0.0
  foreach ($v in $vals) { $sum += [math]::Pow(($v - $mean), 2) }
  return [math]::Sqrt($sum / $vals.Count)
}

function Get-PatternRules([string]$patternFile) {
  if ($patternFile -and (Test-Path $patternFile)) {
    $raw = Get-Content -Raw -Encoding UTF8 $patternFile | ConvertFrom-Json
    return $raw
  }

  return @(
    @{ name = 'transition_templates'; regex = '(就在这时|下一秒|话音未落|与此同时)' },
    @{ name = 'conclusion_templates'; regex = '(这就是|归根结底|总而言之|说到底)' },
    @{ name = 'psych_summary'; regex = '([他她它](知道|明白|意识到|想起|忽然觉得))' },
    @{ name = 'contrast_frame'; regex = '(不是.{0,10}而是)' }
  )
}

function Normalize-SentenceStart([string]$s) {
  $t = $s.Trim()
  $t = $t -replace '^[“"《\(\[]+', ''
  if ($t.Length -gt 6) { return $t.Substring(0, 6) }
  return $t
}

$rules = Get-PatternRules $PatternFile

Write-Host "Fiction Style Diagnostics (Generalized)"
Write-Host "======================================"

foreach ($f in $Files) {
  $text = Get-Text $f
  $plain = ($text -replace '\s+', '')
  $chars = $plain.Length

  $sentences = Get-Sentences $text
  $sentLens = @()
  foreach ($s in $sentences) { $sentLens += $s.Trim().Length }
  $avgSent = if ($sentLens.Count -gt 0) { ($sentLens | Measure-Object -Average).Average } else { 0 }
  $stdSent = StdDev ($sentLens | ForEach-Object { [double]$_ })

  $paras = ($text -split "`r?`n`r?`n") | Where-Object { $_.Trim().Length -gt 0 }
  $paraLens = @()
  foreach ($p in $paras) { $paraLens += (($p -replace '\s+', '').Length) }
  $avgPara = if ($paraLens.Count -gt 0) { ($paraLens | Measure-Object -Average).Average } else { 0 }
  $stdPara = StdDev ($paraLens | ForEach-Object { [double]$_ })

  $dialogMatches = [regex]::Matches($text, '“[^”]{1,120}”')
  $dialogChars = 0
  foreach ($m in $dialogMatches) { $dialogChars += $m.Value.Length }
  $dialogRatio = if ($chars -gt 0) { 100.0 * $dialogChars / $chars } else { 0 }

  $patternHits = @{}
  foreach ($r in $rules) {
    $count = ([regex]::Matches($text, $r.regex)).Count
    $patternHits[$r.name] = $count
  }

  $ngrams = @{}
  for ($i = 0; $i -le $plain.Length - 4; $i++) {
    $g = $plain.Substring($i, 4)
    if ($ngrams.ContainsKey($g)) { $ngrams[$g]++ } else { $ngrams[$g] = 1 }
  }
  $topNgrams = $ngrams.GetEnumerator() | Sort-Object -Property Value -Descending | Select-Object -First 8

  $starts = @{}
  foreach ($s in $sentences) {
    $key = Normalize-SentenceStart $s
    if ($key.Length -eq 0) { continue }
    if ($starts.ContainsKey($key)) { $starts[$key]++ } else { $starts[$key] = 1 }
  }
  $topStarts = $starts.GetEnumerator() | Sort-Object -Property Value -Descending | Select-Object -First 5
  $maxStartRatio = 0
  if ($sentences.Count -gt 0 -and $topStarts.Count -gt 0) {
    $maxStartRatio = 100.0 * $topStarts[0].Value / $sentences.Count
  }

  Write-Host ""
  Write-Host ("File: {0}" -f $f)
  Write-Host ("Chars: {0}" -f $chars)
  Write-Host ("Sentences: {0}, AvgLen: {1:N1}, StdDev: {2:N1}" -f $sentences.Count, $avgSent, $stdSent)
  Write-Host ("Paragraphs: {0}, AvgLen: {1:N1}, StdDev: {2:N1}" -f $paras.Count, $avgPara, $stdPara)
  Write-Host ("Dialogue Ratio: {0:N1}%" -f $dialogRatio)
  Write-Host ("Sentence-start max share: {0:N1}%" -f $maxStartRatio)

  Write-Host "Pattern Category Hits:"
  foreach ($r in $rules) {
    Write-Host ("- {0}: {1}" -f $r.name, $patternHits[$r.name])
  }

  Write-Host "Top sentence starts:"
  foreach ($entry in $topStarts) {
    Write-Host ("- {0}: {1}" -f $entry.Key, $entry.Value)
  }

  Write-Host "Top 4-gram repeats:"
  foreach ($entry in $topNgrams) {
    Write-Host ("- {0}: {1}" -f $entry.Key, $entry.Value)
  }
}
