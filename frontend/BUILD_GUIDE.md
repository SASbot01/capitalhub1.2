# 📱💻 Guía de Build: Desktop y Móvil

## 🎯 Resumen

El diseño actual de CapitalHub (header horizontal, menú hamburguesa, items ocultos) funciona **automáticamente** en todas las plataformas:

- ✅ **Web** (navegador)
- ✅ **Desktop** (aplicación .exe con Tauri)
- ✅ **Móvil** (aplicación Android con Capacitor)

**No se requieren cambios en el código** porque Tauri y Capacitor renderizan el mismo código React/HTML/CSS.

---

## 🖥️ Build Desktop (Windows .exe)

### Requisitos Previos

- Node.js instalado
- Rust instalado ([rustup.rs](https://rustup.rs/))
- Visual Studio Build Tools (Windows)

### Comandos

```bash
# Navegar al frontend
cd frontend

# Instalar dependencias (si no lo has hecho)
npm install

# Desarrollo (ventana de prueba)
npm run dev:desktop

# Build de producción (.exe)
npm run build:desktop
```

El archivo `.exe` se generará en:
```
frontend/src-tauri/target/release/capital-hub.exe
```

### Características Desktop

- ✅ Header horizontal con navegación
- ✅ Menú responsive (se adapta al tamaño de ventana)
- ✅ Items ocultos: "Dashboard" y "Formación"
- ✅ Mismo diseño que la web
- ✅ Ventana redimensionable (800x600 por defecto)

---

## 📱 Build Móvil (Android)

### Requisitos Previos

- Node.js instalado
- Android Studio instalado
- Java JDK 17+
- Android SDK configurado

### Comandos

```bash
# Navegar al frontend
cd frontend

# Instalar dependencias (si no lo has hecho)
npm install

# Build y sincronizar con Capacitor
npm run build:mobile

# Abrir en Android Studio
npm run mobile:open:android
```

Desde Android Studio:
1. Espera a que Gradle termine de sincronizar
2. Conecta un dispositivo o inicia un emulador
3. Click en "Run" (▶️)

### Características Móvil

- ✅ Header horizontal con navegación
- ✅ Menú hamburguesa para pantallas pequeñas
- ✅ Items ocultos: "Dashboard" y "Formación"
- ✅ Mismo diseño que la web
- ✅ Optimizado para táctil
- ✅ Sin scroll horizontal

---

## 🔧 Configuraciones Aplicadas

### 1. Vite Config (`vite.config.ts`)

```typescript
export default defineConfig({
  plugins: [react()],
  
  // Optimización para Tauri (desktop)
  clearScreen: false,
  server: {
    port: 5173,
    strictPort: true,
    host: '0.0.0.0',
  },
  
  // Build para todas las plataformas
  build: {
    target: ['es2021', 'chrome97', 'safari13'],
    minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
    sourcemap: !!process.env.TAURI_DEBUG,
  },
})
```

### 2. CSS Global (`index.css`)

```css
/* Prevenir scroll horizontal en todas las plataformas */
html, body {
  overflow-x: hidden;
  max-width: 100vw;
}

/* Mejorar experiencia táctil en móvil */
* {
  -webkit-tap-highlight-color: transparent;
}
```

### 3. Scripts NPM (`package.json`)

```json
{
  "scripts": {
    "dev": "vite",                              // Web dev
    "build:web": "npm run build",               // Build web
    "build:desktop": "npm run build && npx tauri build",  // Build .exe
    "build:mobile": "npm run build && npx cap sync",      // Build móvil
    "dev:desktop": "npx tauri dev",             // Desktop dev
    "mobile:open:android": "npx cap open android"  // Abrir Android Studio
  }
}
```

---

## 🎨 Diseño Unificado

### Header Horizontal (`AppHeader.tsx`)

El mismo componente funciona en todas las plataformas:

**Desktop/Tablet (pantallas grandes):**
```
┌─────────────────────────────────────────────────────┐
│ [C] CapitalHub  Inicio  Perfil  Ofertas  ...  👤   │
└─────────────────────────────────────────────────────┘
```

**Móvil (pantallas pequeñas):**
```
┌─────────────────────────────────────┐
│ [C] CapitalHub          👤  ☰      │
└─────────────────────────────────────┘
```

Al hacer click en ☰ se despliega el menú completo.

### Items del Menú

**Comerciales (Rep):**
- ✅ Inicio
- ❌ Dashboard (oculto)
- ✅ Perfil
- ✅ Ofertas
- ✅ Aplicaciones
- ❌ Formación (oculto)
- ✅ Ajustes

**Empresas (Company):**
- ✅ Inicio
- ❌ Dashboard (oculto)
- ✅ Ofertas
- ✅ Aplicaciones
- ✅ Ajustes

---

## ✅ Verificación

### Checklist Desktop

- [ ] El archivo `.exe` se genera correctamente
- [ ] La aplicación abre sin errores
- [ ] El header horizontal se muestra correctamente
- [ ] Los items "Dashboard" y "Formación" NO aparecen
- [ ] La navegación funciona entre páginas
- [ ] El logout funciona
- [ ] La ventana es redimensionable

### Checklist Móvil

- [ ] La app se instala en el dispositivo/emulador
- [ ] El header horizontal se muestra correctamente
- [ ] El menú hamburguesa (☰) aparece en pantallas pequeñas
- [ ] Los items "Dashboard" y "Formación" NO aparecen
- [ ] La navegación funciona entre páginas
- [ ] El logout funciona
- [ ] No hay scroll horizontal
- [ ] Los botones táctiles responden bien

---

## 🐛 Troubleshooting

### Desktop (Tauri)

**Error: "Rust not found"**
```bash
# Instalar Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

**Error: "WebView2 not found" (Windows)**
- Descargar e instalar [WebView2 Runtime](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)

### Móvil (Capacitor)

**Error: "ANDROID_HOME not set"**
```bash
# Windows (PowerShell)
$env:ANDROID_HOME = "C:\Users\TuUsuario\AppData\Local\Android\Sdk"

# Agregar a PATH del sistema permanentemente
```

**Error: "Gradle build failed"**
```bash
# Limpiar y reconstruir
cd android
./gradlew clean
cd ..
npm run build:mobile
```

---

## 📚 Recursos

- [Tauri Documentation](https://tauri.app/v1/guides/)
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Vite Documentation](https://vitejs.dev/)

---

## 🎯 Conclusión

El diseño actual de CapitalHub es **completamente responsive** y funciona en todas las plataformas sin modificaciones. Los cambios aplicados en la web (header horizontal, items ocultos) se reflejan automáticamente en desktop y móvil.

**¡Solo necesitas construir las aplicaciones y probarlas!** 🚀
