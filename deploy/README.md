# 🐳 CapitalHub - Despliegue con Docker

Este directorio contiene todo lo necesario para levantar CapitalHub con Docker.

## 📋 Requisitos

- **Docker Desktop** instalado y corriendo
- Al menos 4GB de RAM disponibles para Docker

## 🚀 Inicio Rápido

### Windows

```powershell
cd deploy
.\start.bat
```

### Linux/Mac

```bash
cd deploy
chmod +x start.sh
./start.sh
```

### O manualmente:

```bash
cd deploy
docker-compose up -d --build
```

## 🌐 URLs de Acceso

| Servicio | URL | Credenciales |
|----------|-----|--------------|
| **Frontend** | http://localhost | - |
| **Backend API** | http://localhost:8081 | - |
| **MinIO Console** | http://localhost:9001 | `minioadmin` / `minioadmin` |
| **MySQL** | localhost:3306 | `root` / `admin` |

## 📦 Servicios

El docker-compose levanta 4 servicios:

1. **mysql** - Base de datos MySQL 8.0
2. **minio** - Almacenamiento de archivos (S3-compatible)
3. **backend** - API Spring Boot (Java 21)
4. **frontend** - Aplicación React (Nginx)

## 🔧 Comandos Útiles

```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend

# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (¡borra datos!)
docker-compose down -v

# Reconstruir solo el backend
docker-compose build backend
docker-compose up -d backend

# Reconstruir solo el frontend
docker-compose build frontend
docker-compose up -d frontend

# Ver estado de los contenedores
docker-compose ps
```

## 🗂️ Estructura de Archivos

```
deploy/
├── docker-compose.yml    # Orquestación de servicios
├── Dockerfile.backend    # Imagen del backend (Java)
├── Dockerfile.frontend   # Imagen del frontend (React + Nginx)
├── start.bat            # Script de inicio (Windows)
├── start.sh             # Script de inicio (Linux/Mac)
└── README.md            # Esta documentación
```

## ⚙️ Variables de Entorno

Las variables se configuran en `docker-compose.yml`. Las principales son:

### Backend
- `SPRING_DATASOURCE_URL` - URL de conexión a MySQL
- `JWT_SECRET` - Secreto para tokens JWT
- `MINIO_URL` - URL del servicio MinIO

### Frontend
- `VITE_API_BASE_URL` - URL del backend (para build)

## 🐛 Solución de Problemas

### El backend no arranca
```bash
# Ver logs del backend
docker-compose logs backend

# Verificar que MySQL esté listo
docker-compose logs mysql
```

### Error de conexión a la base de datos
MySQL puede tardar ~30s en estar listo. El backend esperará automáticamente gracias a los healthchecks.

### Puertos en uso
Si los puertos 80, 3306, 8081 o 9000/9001 están en uso, modifica el `docker-compose.yml`:
```yaml
ports:
  - "NUEVO_PUERTO:PUERTO_INTERNO"
```

### Limpiar todo y empezar de cero
```bash
docker-compose down -v --rmi all
docker-compose up -d --build
```

## 📝 Usuarios de Prueba

Después del primer inicio, la base de datos se poblará con datos de prueba:

| Email | Contraseña | Rol |
|-------|------------|-----|
| rep@test.com | password123 | REP (Comercial) |
| company@test.com | password123 | COMPANY (Empresa) |

---

**¿Problemas?** Revisa los logs con `docker-compose logs -f`

