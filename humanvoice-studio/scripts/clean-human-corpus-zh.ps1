param(
  [string]$RawDir = "humanvoice-studio/corpus/raw",
  [string]$CleanDir = "humanvoice-studio/corpus/clean"
)

if (!(Test-Path $RawDir)) {
  Write-Error "Raw directory not found: $RawDir"
  exit 1
}
if (!(Test-Path $CleanDir)) {
  New-Item -ItemType Directory -Path $CleanDir | Out-Null
}

Get-ChildItem -Path $RawDir -Filter *.html | ForEach-Object {
  $inFile = $_.FullName
  $name = $_.BaseName
  $outFile = Join-Path $CleanDir ("{0}.txt" -f $name)

  $html = Get-Content -Raw -Encoding UTF8 $inFile

  # Prefer main article container for MediaWiki pages when available.
  if ($html -match 'id=\"mw-content-text\"') {
    $start = $html.IndexOf('id=\"mw-content-text\"')
    if ($start -ge 0) {
      $html = $html.Substring($start)
      $endCandidates = @(
        $html.IndexOf('id=\"catlinks\"'),
        $html.IndexOf('id=\"footer\"'),
        $html.IndexOf('class=\"printfooter\"')
      ) | Where-Object { $_ -gt 0 }
      if ($endCandidates.Count -gt 0) {
        $end = ($endCandidates | Measure-Object -Minimum).Minimum
        $html = $html.Substring(0, $end)
      }
    }
  }

  $text = $html -replace '<script[\\s\\S]*?</script>', ' '
  $text = $text -replace '<style[\\s\\S]*?</style>', ' '
  $text = $text -replace '<[^>]+>', ' '
  $text = $text -replace '&nbsp;',' '
  $text = $text -replace '&amp;','&'
  $text = $text -replace '\\s+', ' '
  $text = $text.Trim()

  Set-Content -Path $outFile -Value $text -Encoding UTF8
  Write-Host "Cleaned: $name"
}

Write-Host "Done. Clean files in $CleanDir"
