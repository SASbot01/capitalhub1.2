# Script para crear un nuevo release de CapitalHub Desktop
# Uso: .\create-release.ps1 1.0.0

param(
    [Parameter(Mandatory=$true)]
    [string]$Version
)

$ErrorActionPreference = "Stop"

$TAG = "v$Version"

Write-Host "🚀 Creando release de CapitalHub Desktop" -ForegroundColor Green
Write-Host "Versión: $TAG" -ForegroundColor Yellow
Write-Host ""

# Check if tag already exists
$tagExists = git rev-parse $TAG 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "❌ Error: El tag $TAG ya existe" -ForegroundColor Red
    Write-Host "Para eliminar el tag existente:" -ForegroundColor Yellow
    Write-Host "  git tag -d $TAG"
    Write-Host "  git push origin :refs/tags/$TAG"
    exit 1
}

# Check if there are uncommitted changes
$status = git status --porcelain
if ($status) {
    Write-Host "❌ Error: Tienes cambios sin commitear" -ForegroundColor Red
    Write-Host "Haz commit de tus cambios primero:" -ForegroundColor Yellow
    Write-Host "  git add ."
    Write-Host "  git commit -m 'Prepare release $TAG'"
    exit 1
}

# Confirm
$response = Read-Host "¿Estás seguro de crear el release $TAG? (y/n)"
if ($response -notmatch '^[yY]') {
    Write-Host "❌ Cancelado" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📝 Creando tag $TAG..." -ForegroundColor Green
git tag -a $TAG -m "Release $TAG"

Write-Host "📤 Subiendo tag a GitHub..." -ForegroundColor Green
git push origin $TAG

Write-Host ""
Write-Host "✅ ¡Listo!" -ForegroundColor Green
Write-Host ""
Write-Host "🔄 GitHub Actions está compilando la aplicación para:" -ForegroundColor Yellow
Write-Host "  - Windows (x64)"
Write-Host "  - macOS Intel (x64)"
Write-Host "  - macOS Apple Silicon (ARM64)"
Write-Host "  - Linux (x64)"
Write-Host ""
Write-Host "⏱️  Tiempo estimado: 15-20 minutos" -ForegroundColor Yellow
Write-Host ""
Write-Host "📦 Para ver el progreso:" -ForegroundColor Green
Write-Host "  https://github.com/SASbot01/capitalhub1.1/actions"
Write-Host ""
Write-Host "🎉 Cuando termine, los instaladores estarán en:" -ForegroundColor Green
Write-Host "  https://github.com/SASbot01/capitalhub1.1/releases/tag/$TAG"
Write-Host ""
