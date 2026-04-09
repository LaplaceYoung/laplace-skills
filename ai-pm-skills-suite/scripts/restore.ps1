param(
  [Parameter(Mandatory = $true)]
  [string]$SnapshotPath,
  [string]$SuiteRoot = (Split-Path -Parent $PSScriptRoot)
)

if (-not (Test-Path $SnapshotPath)) {
  throw "Snapshot not found: $SnapshotPath"
}

$preRestoreSnapshot = & (Join-Path $PSScriptRoot 'backup.ps1')
$items = @('README.md','skills','templates','references','scripts','examples','workspace\TODO.md','workspace\CHANGELOG.md')

foreach ($item in $items) {
  $source = Join-Path $SnapshotPath $item
  if (-not (Test-Path $source)) { continue }

  $target = Join-Path $SuiteRoot $item
  if ((Get-Item $source) -is [System.IO.DirectoryInfo]) {
    if (Test-Path $target) {
      Remove-Item -LiteralPath $target -Recurse -Force
    }
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

Write-Host "Pre-restore snapshot: $preRestoreSnapshot"
Write-Host "Restored from: $SnapshotPath"
