@echo off
echo =====================================================
echo    CAPITALHUB - Iniciando todos los servicios
echo =====================================================
echo.

REM Verificar que Docker esté corriendo
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker no esta corriendo. Por favor, inicia Docker Desktop.
    pause
    exit /b 1
)

echo [1/3] Deteniendo contenedores anteriores...
docker-compose down --remove-orphans

echo.
echo [2/3] Construyendo imagenes (esto puede tardar unos minutos la primera vez)...
docker-compose build

echo.
echo [3/3] Iniciando todos los servicios...
docker-compose up -d

echo.
echo =====================================================
echo    SERVICIOS INICIADOS
echo =====================================================
echo.
echo    Frontend:  http://localhost
echo    Backend:   http://localhost:8081
echo    MinIO:     http://localhost:9001 (admin: minioadmin/minioadmin)
echo    MySQL:     localhost:3306 (root/admin)
echo.
echo    Para ver los logs: docker-compose logs -f
echo    Para detener:      docker-compose down
echo =====================================================

pause

