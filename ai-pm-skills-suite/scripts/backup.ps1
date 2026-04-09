param(
  [string]$SuiteRoot = (Split-Path -Parent $PSScriptRoot)
)

$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss-fff'
$snapshotRoot = Join-Path $SuiteRoot 'workspace\snapshots'
$snapshotPath = Join-Path $snapshotRoot $timestamp
$items = @('README.md','skills','templates','references','scripts','examples','workspace\TODO.md','workspace\CHANGELOG.md')

New-Item -ItemType Directory -Force -Path $snapshotPath | Out-Null
foreach ($item in $items) {
  $source = Join-Path $SuiteRoot $item
  if (-not (Test-Path $source)) { continue }

  $target = Join-Path $snapshotPath $item
  if ((Get-Item $source) -is [System.IO.DirectoryInfo]) {
    New-Item -ItemType Directory -Force -Path $target | Out-Null
    Get-ChildItem -Force $source | ForEach-Object {
      Copy-Item -Path $_.FullName -Destination $target -Recurse -Force
    }
  } else {
    $targetParent = Split-Path -Parent $target
    if ($targetParent) { New-Item -ItemType Directory -Force -Path $targetParent | Out-Null }
    Copy-Item -Path $source -Destination $target -Force
  }
}
Write-Output $snapshotPath
