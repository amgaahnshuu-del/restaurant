$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$nextBin = Join-Path $repoRoot "node_modules\.bin\next.cmd"
$nextCache = Join-Path $repoRoot ".next"
$repoPattern = [regex]::Escape($repoRoot)

function Stop-RepoNodeProcesses {
  $processes = Get-CimInstance Win32_Process -Filter "Name = 'node.exe'" | Where-Object {
    $_.CommandLine -and $_.CommandLine -match $repoPattern
  }

  foreach ($process in $processes) {
    Stop-Process -Id $process.ProcessId -Force -ErrorAction SilentlyContinue
  }
}

Stop-RepoNodeProcesses
Start-Sleep -Seconds 2
Stop-RepoNodeProcesses
Start-Sleep -Seconds 1

if (Test-Path -LiteralPath $nextCache) {
  Remove-Item -LiteralPath $nextCache -Recurse -Force
}

if (-not (Test-Path -LiteralPath $nextBin)) {
  throw "Could not find Next.js binary at $nextBin"
}

& $nextBin "dev" "--port" "3000"
exit $LASTEXITCODE
