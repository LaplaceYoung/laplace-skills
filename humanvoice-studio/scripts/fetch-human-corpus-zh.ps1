param(
  [string]$SourceFile = "humanvoice-studio/corpus/sources-human-zh.json",
  [string]$OutDir = "humanvoice-studio/corpus/raw"
)

if (!(Test-Path $SourceFile)) {
  Write-Error "Source file not found: $SourceFile"
  exit 1
}
if (!(Test-Path $OutDir)) {
  New-Item -ItemType Directory -Path $OutDir | Out-Null
}

$data = Get-Content -Raw -Encoding UTF8 $SourceFile | ConvertFrom-Json

foreach ($s in $data.sources) {
  $id = $s.id
  $url = $s.url
  $out = Join-Path $OutDir ("{0}.html" -f $id)
  try {
    Write-Host "Downloading: $id"
    Invoke-WebRequest -Uri $url -OutFile $out -UseBasicParsing
  }
  catch {
    Write-Warning ("Failed: {0} -> {1}" -f $id, $_.Exception.Message)
  }
}

Write-Host "Done. Raw files in $OutDir"
