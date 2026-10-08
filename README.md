# AI Engineering Learning Lab 2026

Un entorno de aprendizaje práctico para ingeniería de software, IA, automatización, cloud, DevOps, seguridad y arquitectura.

## Objetivo

Construir una ruta profesional real para aprender haciendo, no solo leyendo. Este proyecto combina:

- roadmap de 24 semanas
- laboratorios prácticos
- retos y break-the-system
- sistema de XP y progreso
- búsqueda y navegación por módulos
- contenido estructurado como datos
- generación de PDF reproducible

## Inicio rápido

```bash
npm install
npm run dev
```

## Consola de código y mentor local

Para habilitar ejecución real de JavaScript, Python, Java y SQL hace falta Docker Desktop activo. En la primera terminal construye el sandbox y arranca la API local:

```powershell
npm run lab:sandbox:build
npm run lab:server
```

En otra terminal, desde la raíz del proyecto, inicia el sitio:

```powershell
npm run dev
```

Abre la URL local que indica Vite (por defecto `http://127.0.0.1:5173`). Para activar el mentor, inicia Ollama y descarga el modelo de desarrollo usado por defecto:

```powershell
ollama pull llama3.2:latest
```

Al abrir **Consola y mentor**, el Lab detecta herramientas y versiones conocidas, WSL, contenedores activos, puertos TCP en escucha, extensiones de VS Code y marcadores de proyecto del workspace actual. El inventario es local y de solo lectura; consulta el snapshot de este equipo y sus límites en [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md). El escaneo de proyectos no sale del workspace ni lee código fuente.

La ejecución solo admite perfiles cerrados y crea un contenedor efímero con red deshabilitada, sin montajes del host, con límites de CPU/memoria/procesos y sistema de archivos de solo lectura. No es una terminal del sistema ni admite comandos de shell arbitrarios; los archivos no se conservan entre ejecuciones. El mentor corre localmente en Ollama, no usa claves externas, no tiene herramientas para ejecutar código y solo recibe el código/salida si marcas explícitamente esa opción. La app pública de GitHub Pages sigue siendo estática y no incluye estas capacidades locales.

## Scripts

```bash
npm run content:build  # regenera generated/content.json desde content/**/*.md
npm run dev
npm run build
npm run validate        # valida el contenido real, no solo que existan archivos
npm run pdf             # genera el PDF completo (~70 páginas) desde el mismo contenido
npm run test
npm run test:e2e        # pruebas de navegador Chromium
npm run lab:sandbox:build # construye el contenedor de ejecución aislada
npm run lab:server        # inicia la API local para runner y mentor
```

`dev`, `build`, `validate`, `pdf` y `test` regeneran `generated/content.json` automáticamente antes de ejecutarse (hooks `pre*` de npm), así que siempre corren contra el contenido Markdown más reciente. Ver `docs/ARCHITECTURE.md` sección 4.7 para el detalle del pipeline.

## Estructura

- `app/` — frontend y estilos
- `content/` — datos del curso
- `docs/` — arquitectura, curriculum y guías operativas/de demo
- `scripts/` — validación y generación del PDF
- `tests/` — pruebas unitarias, de contenido y E2E

## Fase actual

La fase de presentación demo-ready organiza la experiencia como una historia de aprendizaje: **orientación → práctica → proyectos → evidencia y demo**. Incluye navegación directa entre secciones, acciones claras para abrir semanas y laboratorios, estados de foco visibles, soporte para teclado y respeto por la preferencia de movimiento reducido. Los laboratorios también incluyen tres pistas progresivas y solución final con recompensa decreciente de XP (90%, 75%, 60% y 40%).

El sitio, el validador y el PDF leen **el mismo contenido real** (`content/**/*.md` → `generated/content.json`, sin duplicación). `npm run validate` pasa con **0 avisos**:

- dashboard funcional con XP, nivel y progreso persistente en `localStorage`
- roadmap completo de 24 semanas, las 24 con lección completa en Markdown
- **24/24 laboratorios** en Markdown real, con código funcional (Java, SQL, Docker, YAML, JavaScript) en cada uno
- **3/3 retos** en Markdown real
- **glosario de 24 términos** (definición + ejemplo + relación con otros conceptos)
- **biblioteca de recursos de 30 enlaces oficiales** en 9 categorías
- **6 proyectos acumulativos + proyecto final** ("AI Business Operations Platform"), cada uno con visión, stack, entregables y criterios de éxito, visibles en el dashboard y en el PDF
- entrenamiento para práctica sin IA, mentoría con prompts guiados, preguntas de entrevista y checklist laboral persistente
- seguimiento personal independiente para cada uno de los seis proyectos acumulativos y el proyecto final, sin duplicar XP
- documentación completa: `ARCHITECTURE.md`, `CURRICULUM.md`, `LAB-RULES.md`, `CONTRIBUTING.md`, `SECURITY.md`, `OPERATIONS.md`, `TESTING.md`, `AI-EVALUATION.md`, `COSTS.md` (con precios reales verificados), `POSTMORTEM.md`
- validación de contenido, pruebas unitarias y E2E de flujos críticos en Chromium; PDF completo (~70 páginas) generado desde la misma fuente

Para presentar el producto paso a paso, consultar [docs/DEMO-GUIDE.md](docs/DEMO-GUIDE.md). La guía también deja explícitos los límites de la versión actual: el progreso se guarda solo en el navegador y el indicador de preparación para demo es orientativo, no una evaluación automática de calidad.

## Verificación local

```bash
npm run validate
npm test
npm run test:e2e
npm run build
```

La suite E2E instala/usa Chromium de Playwright y levanta Vite temporalmente en `127.0.0.1:4174`; consulta [docs/TESTING.md](docs/TESTING.md) para instalar el navegador y entender qué cubre.

## Publicar en GitHub Pages

El workflow `.github/workflows/deploy-pages.yml` valida contenido, ejecuta pruebas unitarias y E2E, compila el sitio con la ruta base correcta y publica `dist/` en GitHub Pages al hacer push a `main` (o al ejecutarlo manualmente). En el repositorio, configura **Settings → Pages → Build and deployment → Source: GitHub Actions**. El sitio de proyecto se publica normalmente en `https://<owner>.github.io/<repositorio>/`; un repositorio `<owner>.github.io` usa la raíz del dominio.

Para probar localmente el build como un sitio de proyecto en PowerShell:

```powershell
$env:VITE_BASE_PATH = "/Lab/"
npm run build
npm run preview
```
