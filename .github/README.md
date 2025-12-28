# 🚀 GitHub Actions CI/CD - CapitalHub Desktop

Este directorio contiene los workflows de GitHub Actions para compilar automáticamente la aplicación desktop de CapitalHub para **Windows, macOS y Linux**.

---

## 📋 Workflows Disponibles

### 1. `build-desktop.yml` - Build y Release Automático

**Trigger:** Cuando creas un tag de versión (ej: `v1.0.0`)

**Plataformas:**
- ✅ **Windows** (x64) - `.msi` y `-setup.exe`
- ✅ **macOS Intel** (x64) - `.dmg` y `.app`
- ✅ **macOS Apple Silicon** (ARM64) - `.dmg` y `.app`
- ✅ **Linux** (x64) - `.AppImage` y `.deb`

**Resultado:** Crea automáticamente un Release en GitHub con todos los instaladores.

### 2. `build-desktop-dev.yml` - Build de Desarrollo

**Trigger:** Push a `main` o `develop`, o Pull Requests

**Plataformas:** Windows, macOS, Linux

**Resultado:** Verifica que el código compile correctamente en todas las plataformas (sin crear release).

---

## 🎯 Cómo Crear un Release

### Paso 1: Asegúrate de que el código esté en GitHub

```bash
# Si aún no has subido el código
git remote add origin https://github.com/SASbot01/capitalhub1.1.git
git add .
git commit -m "Add GitHub Actions workflows"
git push -u origin main
```

### Paso 2: Crear un Tag de Versión

```bash
# Crear tag (ej: v1.0.0)
git tag v1.0.0

# Subir el tag a GitHub
git push origin v1.0.0
```

### Paso 3: Esperar a que GitHub Actions Compile

1. Ve a tu repositorio en GitHub
2. Click en la pestaña **"Actions"**
3. Verás el workflow **"Build and Release Desktop Apps"** ejecutándose
4. Espera ~15-20 minutos (compila para 4 plataformas)

### Paso 4: Descargar los Instaladores

1. Ve a la pestaña **"Releases"** en GitHub
2. Verás un nuevo release llamado **"CapitalHub v1.0.0"**
3. Descarga los instaladores:
   - **Windows**: `capital-hub_1.0.0_x64_en-US.msi`
   - **macOS Intel**: `capital-hub_1.0.0_x64.dmg`
   - **macOS Apple Silicon**: `capital-hub_1.0.0_aarch64.dmg`
   - **Linux**: `capital-hub_1.0.0_amd64.AppImage`

---

## 🔧 Trigger Manual (Sin Tag)

También puedes ejecutar el workflow manualmente desde GitHub:

1. Ve a **Actions** en GitHub
2. Selecciona **"Build and Release Desktop Apps"**
3. Click en **"Run workflow"**
4. Selecciona la rama y click en **"Run workflow"**

---

## 📊 Tiempo de Compilación Estimado

| Plataforma | Tiempo Aprox. |
|------------|---------------|
| Windows | ~8-10 min |
| macOS Intel | ~10-12 min |
| macOS Apple Silicon | ~10-12 min |
| Linux | ~8-10 min |
| **Total** | **~15-20 min** (en paralelo) |

---

## 🎨 Características de los Builds

Todos los instaladores incluyen:

- ✅ Header horizontal con navegación
- ✅ Menú responsive con hamburguesa
- ✅ Items "Dashboard" y "Formación" ocultos
- ✅ Mismo diseño que la versión web
- ✅ Funcionalidad completa (login, navegación, logout, etc.)

---

## 🔐 Permisos Necesarios

Los workflows ya están configurados con los permisos correctos:

```yaml
permissions:
  contents: write  # Para crear releases y subir archivos
```

**No necesitas configurar nada más** - GitHub Actions tiene acceso automático a través de `GITHUB_TOKEN`.

---

## 📝 Versionado Semántico

Usa [Semantic Versioning](https://semver.org/) para tus tags:

- **v1.0.0** - Primera versión estable
- **v1.1.0** - Nueva funcionalidad (minor)
- **v1.0.1** - Bug fix (patch)
- **v2.0.0** - Cambios que rompen compatibilidad (major)

---

## 🐛 Troubleshooting

### Error: "Resource not accessible by integration"

**Solución:** Verifica que el repositorio tenga permisos de escritura para GitHub Actions:
1. Settings → Actions → General
2. Workflow permissions → "Read and write permissions"

### Error: "Tag already exists"

**Solución:** Elimina el tag y créalo de nuevo:
```bash
git tag -d v1.0.0
git push origin :refs/tags/v1.0.0
git tag v1.0.0
git push origin v1.0.0
```

### Build falla en macOS

**Solución:** Asegúrate de que `tauri.conf.json` tenga los iconos correctos:
- `icons/32x32.png`
- `icons/128x128.png`
- `icons/icon.icns` (macOS)

---

## 📚 Recursos

- [Tauri GitHub Actions](https://tauri.app/v1/guides/building/cross-platform)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Semantic Versioning](https://semver.org/)

---

## ✅ Checklist de Primera Release

- [ ] Código subido a GitHub
- [ ] Workflows en `.github/workflows/` subidos
- [ ] Permisos de GitHub Actions configurados (read/write)
- [ ] Tag de versión creado (ej: `v1.0.0`)
- [ ] Tag subido a GitHub (`git push origin v1.0.0`)
- [ ] Workflow ejecutándose en Actions
- [ ] Release creado automáticamente con instaladores

---

## 🎉 Resultado Final

Después de seguir estos pasos, tendrás:

1. ✅ **Release automático** en GitHub
2. ✅ **Instaladores para 4 plataformas**:
   - Windows (MSI + NSIS)
   - macOS Intel (DMG)
   - macOS Apple Silicon (DMG)
   - Linux (AppImage + DEB)
3. ✅ **Notas de release** automáticas
4. ✅ **Versionado** claro y profesional

**¡Todo automático con un solo comando: `git push origin v1.0.0`!** 🚀
