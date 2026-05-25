$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$envFile = Join-Path $projectRoot ".env"
$dataDir = Join-Path $projectRoot ".postgres-dev\data"
$logFile = Join-Path $projectRoot ".postgres-dev\postgres.log"
$pidFile = Join-Path $dataDir "postmaster.pid"

if (-not (Test-Path $envFile)) {
  throw "Missing .env file. Create it before starting the local PostgreSQL cluster."
}

if (-not (Test-Path $dataDir)) {
  throw "Missing local PostgreSQL data directory: $dataDir"
}

$databaseUrlLine = Get-Content $envFile | Where-Object { $_ -match "^DATABASE_URL=" } | Select-Object -First 1

if (-not $databaseUrlLine) {
  throw "DATABASE_URL was not found in .env."
}

$databaseUrl = ($databaseUrlLine -replace '^DATABASE_URL="?','') -replace '"$',''
$port = 5433

if ($databaseUrl -match "@[^:/?#]+:(\d+)/") {
  $port = [int]$Matches[1]
}

if (Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue) {
  Write-Host "PostgreSQL is already listening on port $port."
  exit 0
}

if (Test-Path $pidFile) {
  $pid = Get-Content $pidFile | Select-Object -First 1
  $stalePid = $null

  if ([int]::TryParse($pid, [ref]$stalePid)) {
    if (-not (Get-Process -Id $stalePid -ErrorAction SilentlyContinue)) {
      Remove-Item -LiteralPath $pidFile
    }
  } else {
    Remove-Item -LiteralPath $pidFile
  }
}

$pgCtl = Get-ChildItem "C:\Program Files\PostgreSQL" -Recurse -Filter "pg_ctl.exe" -ErrorAction SilentlyContinue |
  Sort-Object FullName -Descending |
  Select-Object -First 1

if (-not $pgCtl) {
  throw "pg_ctl.exe was not found under C:\Program Files\PostgreSQL. Install PostgreSQL 18 tools first."
}

& $pgCtl.FullName start -D $dataDir -l $logFile -o ('"-p {0}"' -f $port) -w

if ($LASTEXITCODE -ne 0) {
  throw "Failed to start local PostgreSQL. Check $logFile for details."
}

Write-Host "Local PostgreSQL started on port $port."
