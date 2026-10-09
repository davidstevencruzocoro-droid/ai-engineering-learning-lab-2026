# AI Engineering Learning Lab 2026 - Architecture

## 0. Auditoría de implementación (2026-10-08)

Esta sección documenta el estado real verificado del repositorio, no el estado deseado. Se actualiza cada vez que se audita el proyecto.

**Lo que ya existía antes de esta auditoría:** SPA con Vite, dashboard de XP/nivel/progreso en `localStorage`, roadmap de 24 semanas, búsqueda/filtros, `docs/ARCHITECTURE.md` y `docs/CURRICULUM.md` desarrollados, 24 archivos `content/weeks/*.md` con el formato de lección completo, 8 archivos `content/labs/*.md` (semanas 1-8), `.github/workflows/validate.yml`.

**Problema crítico detectado:** existía una doble fuente de verdad. `content/**/*.md` estaba pensado como "contenido como datos" pero el sitio, el PDF y la validación en realidad leían un conjunto de arrays hardcodeados y duplicados en `app/js/data.js`. Los dos nunca se verificaban entre sí, así que podían (y empezaban a) divergir. Además:

- `scripts/generate-pdf.js` generaba 1 página de texto fijo (no derivado del contenido real).
- `scripts/validate-content.js` solo comprobaba que existieran carpetas y archivos, no que el contenido estuviera completo o fuera correcto.
- `tests/` tenía 2 asserts triviales ("el archivo existe").
- Solo 8 de 24 semanas tenían laboratorio en Markdown; las semanas 9-24 solo existían como JSON corto en `data.js`.

**Corrección aplicada (Fase "arreglar la base"):** se construyó un pipeline real de contenido (`scripts/build-content.js` + `scripts/lib/content-parser.js`) que lee `content/**/*.md`, genera `generated/content.json`, y ese archivo es ahora la única fuente que consumen `app/js/data.js`, `scripts/validate-content.js` y `scripts/generate-pdf.js`. Ya no puede haber divergencia entre lo que se valida, lo que se muestra y lo que se imprime, porque los tres leen el mismo artefacto generado. Ver sección 4.7 para el detalle técnico.

**Deuda conocida y visible (no oculta):** las semanas 9-24 todavía no tienen `content/labs/lab-week-NN.md` propio; usan un fallback explícito definido en `scripts/build-content.js` y marcado con `pending: true` en todo el pipeline (UI, PDF, validación). `npm run validate` reporta esto como aviso en cada ejecución. Esto es trabajo de la Fase B (completar currículum), no de esta fase.

## 0.1. Fase B — Completar currículum (2026-10-08)

Ejecutada inmediatamente después de la Fase "arreglar la base", sobre el mismo pipeline (sin nuevas dependencias):

- Se escribieron los 16 laboratorios que faltaban (`content/labs/lab-week-09.md` a `lab-week-24.md`), eliminando por completo el fallback de labs (`LAB_FALLBACK` se borró de `scripts/build-content.js` por quedar muerto). Los 24 labs son ahora Markdown real.
- Se escribieron los 2 retos que faltaban (`challenge-02.md`, `challenge-03.md`); el fallback de retos también se eliminó.
- Se amplió el glosario de 4 a 24 términos (API, REST, JWT, OAuth, Docker, CI/CD, RAG, Embedding, LLM, Agente, Tool Calling, Vector Database, Prompt, Grounding, Alucinación, MLOps, LLMOps, Observabilidad, SLO, SLA, Rate Limit, Idempotencia, Circuit Breaker, Webhook), cada uno con definición, ejemplo y relación con otros términos.
- Se amplió la biblioteca de recursos a 9 categorías (Herramientas, Programación, Frontend, Datos, IA, Automatización, DevOps, Cloud, Testing, Seguridad) con 30 enlaces oficiales.
- Se añadieron los docs que faltaban: `SECURITY.md`, `OPERATIONS.md`, `TESTING.md`, `AI-EVALUATION.md`, `COSTS.md`, `POSTMORTEM.md`. `COSTS.md` cita precios reales verificados contra `platform.claude.com/docs` el 2026-10-08, no cifras de blogs de terceros (varias búsquedas web de "pricing 2026" devolvieron cifras y nombres de modelo inconsistentes entre sí — se descartaron por no ser fuente primaria).
- Se añadió un nuevo tipo de contenido, **proyectos acumulativos**: `content/projects/project-01.md` a `project-06.md` + `project-final.md`, con su propio parser (`buildProjects()` en `build-content.js`), validación (deben existir los 6 + el final, cada uno con visión/stack/entregables/criterios), sección en el PDF y panel "Proyectos del programa" en el dashboard (`app/js/app.js` → `renderProgramProjects`). Esto es independiente del tracker de hitos semana 22-24 que ya existía (`projectMilestones` en `data.js`), que se mantiene sin cambios porque sigue siendo una vista válida de seguimiento del proyecto final específicamente.
- Resultado: `npm run validate` pasa con **0 avisos** (antes: 19). Los 24 labs, 24 semanas, 3 retos, 24 términos de glosario, 30 recursos y 6+1 proyectos vienen todos de Markdown real, sin fallback.

**Estado actualizado:** los modos sin IA y AI as Mentor, la práctica de entrevista, el checklist profesional y las pruebas E2E se implementaron en la siguiente iteración (sección 0.4 y `docs/TESTING.md`). La mentoría guiada por prompts es parte de la UI estática; además, la sección 0.5 documenta el servicio opcional local para ejecutar fragmentos y consultar Ollama. Sigue pendiente ejecutar el workflow de despliegue desde el repositorio GitHub conectado y verificar la URL pública.

## 0.2. Fase C — Pulido de experiencia para demo (2026-10-08)

Se afinó la presentación de la aplicación sin cambiar el modelo de contenido, el formato persistido ni las dependencias:

- El recorrido visible sigue una secuencia de producto: orientación y avance → roadmap → laboratorios → proyectos acumulativos → hitos/evidencia → preparación y narrativa de demo → recursos.
- El encabezado explica el resultado esperado (práctica verificable y evidencia para portafolio), ofrece accesos directos y añade navegación por secciones.
- Las tarjetas de semana y laboratorio tienen acciones explícitas para abrir el detalle. Se eliminó la dependencia de hacer clic en cualquier parte de la tarjeta; los controles son botones nativos y utilizables con teclado.
- Se añadió un enlace para saltar al contenido, foco visible, navegación responsive y soporte de `prefers-reduced-motion`.
- La guía de demo vive en `docs/DEMO-GUIDE.md`; documenta el recorrido, los criterios de presentación y los límites reales.

**Decisiones y límites:** no se cambió `localStorage` ni el cálculo del indicador de preparación. El progreso sigue siendo local a un navegador/dispositivo y el porcentaje de demo es una señal heurística basada en actividades completadas, no una certificación de calidad. El reinicio continúa eliminando el progreso local guardado.

## 0.3. Fase C — Ayuda progresiva en laboratorios (2026-10-08)

Se implementó el sistema de ayuda sobre los 24 laboratorios, conservando Markdown como fuente de verdad:

- Cada archivo de lab contiene una pista inicial más `Pista 2` y `Pista 3`; la solución existente es la cuarta etapa de ayuda.
- El builder genera `hints[]` y conserva `hint` como alias de la primera pista para lectores existentes. El validador falla si falta cualquiera de las tres pistas o está vacía.
- La UI solo permite revelar la siguiente etapa, mantiene visibles las anteriores y muestra XP resultante/base antes de completar.
- Multiplicadores sobre la XP base: sin ayuda 100%; pistas 1/2/3 90/75/60%; solución 40%. Las recompensas fraccionarias se redondean al entero más cercano.
- `labHelpLevels` guarda la etapa máxima vista por laboratorio en el mismo registro local. Leer una etapa repetida es idempotente; completar, completar después de usar ayuda, o revelar ayuda tras completar ajusta correctamente el XP.
- Los registros anteriores sin `labHelpLevels` se consideran labs completados sin ayuda (100%) hasta que se consulte una etapa. No se requiere migración destructiva.
- El PDF enumera las tres pistas con su porcentaje; no incorpora la solución.

**Límite explícito:** las notas de penalización/evaluación de Markdown siguen siendo rúbricas informativas, no una penalización automatizada. El XP variable solo representa el nivel de ayuda revelado; la app no evalúa la calidad del trabajo entregado.

## 0.4. Entrenamiento, seguimiento y E2E (2026-10-08)

- Se añadieron guías visibles de práctica sin IA, ocho prompts de mentoría, preguntas de entrevista y un checklist de preparación laboral.
- Las guías y prompts se muestran localmente; el servicio Ollama descrito en la sección 0.5 es opcional y no se usa desde GitHub Pages. El checklist laboral se conserva en `localStorage` sin alterar XP.
- Cada proyecto acumulativo y el proyecto final tiene un estado personal (`not-started`, `in-progress`, `completed`) separado del estado de semanas. No concede XP para evitar doble contabilización; entregables y criterios de éxito se muestran desde el contenido Markdown generado.
- `projectStatuses` y `completedCareerItems` son campos aditivos en el progreso local; los registros anteriores se normalizan con valores por defecto y no requieren migración destructiva.
- Se añadió Playwright para cuatro flujos Chromium, separado de `npm test`: ayudas/XP/persistencia, completar sin ayuda, persistencia de proyectos/checklist y layout móvil. `npm run test:e2e` inicia Vite temporalmente en el puerto 4174.

## 0.5. Consola de código y mentoría local (2026-10-08)

- `server/index.mjs` expone una API solo en `127.0.0.1:4176`; Vite reenvía `/api` desde la app local. GitHub Pages continúa siendo estático y no ejecuta este servicio.
- `/api/run` acepta perfiles fijos de JavaScript, Python, Java y SQL/SQLite. Cada petición inicia `ai-lab-sandbox:local` como un contenedor efímero sin red, volúmenes ni capacidades, con usuario no privilegiado y límites de recursos, tiempo y salida. No hay shell general ni persistencia de archivos.
- `/api/mentor` remite la conversación a Ollama en `127.0.0.1:11434` usando `llama3.2:latest` por defecto. El usuario decide explícitamente si comparte el código y la última salida. La respuesta solo se presenta como texto y nunca se ejecuta.
- La configuración no requiere servicios externos ni credenciales. Los contratos, límites, políticas de origen, rate limits y errores se describen en `docs/SECURITY.md`; los pasos de arranque y recuperación están en `docs/OPERATIONS.md` y `README.md`.
- La interfaz conserva la disponibilidad estática del curso si la API local, Docker o Ollama no están activos. Las capacidades locales quedan deshabilitadas o muestran el error correspondiente hasta que el servicio requerido esté disponible.

## 0.6. Inventario local de entorno (2026-10-08)

- La API de solo loopback ofrece `GET /api/environment`, con detección de versiones de herramientas permitidas, WSL, estado/modelos locales, contenedores Docker, extensiones de VS Code, puertos TCP en escucha y proyectos reconocidos.
- Las comprobaciones usan argumentos fijos de solo lectura, tienen timeout y límite de salida; el resultado se cachea 30 segundos. No se ejecuta una orden arbitraria enviada por la UI.
- El descubrimiento de proyectos queda limitado al workspace del servidor y a una carpeta de profundidad. Solo lee nombres de marcadores como `package.json` y `pom.xml`; no busca en todo `Documents` ni inspecciona código fuente.
- La UI consulta el inventario al entrar en la consola y lo muestra como texto local. No lo añade al prompt de Ollama ni genera laboratorios automáticamente. El snapshot real y los elementos aún pendientes están en `docs/ENVIRONMENT.md`.

## 0.7. Terminal Tutor (2026-10-08)

Nota de coordinación: las secciones 0.2-0.6 (modos de práctica, ayuda progresiva, consola/mentor local, inventario de entorno) se construyeron en paralelo por otro agente (GitHub Copilot) mientras se trabajaba en las secciones 0-0.1 de este documento, en el mismo directorio y sin control de versiones en ese momento. Se verificó el estado resultante (`npm run validate`, `npm test`, `npm run build`, `npm run pdf`) antes de seguir añadiendo nada, y se inicializó git para que el trabajo concurrente quede versionado a partir de aquí.

- Nuevo tipo de contenido **Terminal Tutor** (`content/terminal/*.md`, 10 comandos): cada uno con frontmatter (`id`, `command`, `category`, `risk`) y las secciones Qué hace / Cuándo usarlo / Riesgos / Ejemplo / Ejercicio / Error común / Recovery, siguiendo exactamente el mismo patrón `##` que ya usan semanas y labs — cero cambios al parser.
- Cubre `git status`, `git add`+`commit`, `git log`, `git branch`, `git reset --hard` (con simulación segura en carpeta temporal, el ejemplo explícito que pedía el usuario), `docker ps`, `docker compose up`, `docker logs`, `npm install`+`run`, `curl`.
- `buildTerminalCommands()` en `scripts/build-content.js`, validado en `scripts/validate-content.js` (cada comando requiere qué-hace/ejemplo/error-común y un `risk` válido), con su propia sección en el PDF y panel "Terminal Tutor" en el dashboard (`app/js/app.js` → `renderTerminalTutor`), con acento visual por nivel de riesgo (rojo/ámbar/verde).
- Deliberadamente **no** ejecuta comandos reales contra el sistema del usuario — es contenido de referencia con ejemplos para copiar y ejecutar manualmente, a diferencia del sandbox Docker de la sección 0.5 que sí ejecuta fragmentos de código (en un contenedor aislado). Mezclar "enseñar `git reset --hard`" con "ejecutarlo automáticamente sobre el repositorio real del usuario" sería una escalada de riesgo injustificada.

## 0.8. Autocalificación, Log Analyzer, mapa de dominio y Break the System (2026-10-08)

A petición explícita del usuario ("quiero que vaya todo lo más avanzado"), cuatro mejoras construidas sobre la infraestructura ya existente, sin ampliar la superficie de ejecución del sandbox ni del servidor local:

- **Autocalificación real** (`server/grading.mjs`, endpoint `POST /api/grade`): combina el código del estudiante con un arnés de pruebas oculto (nunca expuesto al cliente) y lo ejecuta en el MISMO sandbox Docker que `/api/run` — cero cambios a `runner.py` ni al `Dockerfile`. `executeCode`/`gradeCode` comparten ahora `runSandbox(language, source)` extraído de la función original. Implementado para `lab-19` (circuit breaker, JS), `lab-04` (esquema SQL vía SQLite) y `lab-06` (ejercicio "Break the system": código con dos bugs plantados — condición invertida y acceso a propiedad sin verificar — que el estudiante debe corregir). Verificado end-to-end con soluciones correctas e incorrectas antes de darlo por bueno, tanto por API directa como desde el navegador real.
- **Log Analyzer** (`POST /api/log-analyzer`): reutiliza el mentor Ollama con un prompt especializado que fuerza un formato fijo de 4 secciones (CLASIFICACIÓN / HIPÓTESIS MÁS PROBABLE / CÓMO CONFIRMARLO / POSIBLE SOLUCIÓN). La llamada a Ollama se extrajo a `callOllama()`, compartida con el mentor general. Verificado con Ollama real (`llama3.2:latest`) respondiendo en el formato esperado.
- **Mapa de dominio personal** (`app/js/progress.js`: `recordGradingAttempt`/`getWeakAreas`/`getMasteredExercises`): cada intento de autocalificación queda registrado con qué checks fallaron; un panel nuevo ("Mapa de dominio personal") resurfacea ejercicios no resueltos en vez de perderlos en el XP general. Verificado en navegador: un intento fallido aparece como pendiente de repasar y desaparece al corregirlo.
- **Break the System interactivo**: se implementó como una variante del sistema de autocalificación (código con bugs plantados + tests ocultos que verifican la corrección) en vez de simular fallos reales del sistema del usuario (puerto ocupado, Docker caído, variable de entorno rota). Decisión deliberada: simular esos fallos de forma realista habría requerido o bien tocar el entorno real del usuario (inaceptable) o bien una sesión de contenedor persistente con acceso a shell (superficie de ejecución mucho mayor que un snippet de una sola ejecución). La vía elegida da el mismo ciclo pedagógico (detectar → diagnosticar → corregir → verificar) sin ese riesgo.

## 1. Estado actual del repositorio

El repositorio ya no está vacío: tiene una aplicación funcional (ver sección 0). La arquitectura descrita a continuación refleja lo que existe y se ha corregido, no un diseño especulativo desde cero.

---

## 2. Principios arquitectónicos

La solución debe cumplir estas reglas:

- Aprendizaje práctico antes que contenido teórico aislado.
- Cada concepto debe tener práctica, evaluación y dashboard de progreso.
- El contenido debe ser datos, no hardcoded en páginas HTML.
- La interfaz debe ser robusta, accesible y responsive.
- El sistema debe permitir ser extendido semana a semana.
- El PDF debe ser reproducible y generable desde el contenido central.
- El sistema debe funcionar sin backend en fases iniciales y permitir crecer si se requieren más capacidades.

---

## 3. Arquitectura propuesta

### 3.1. Arquitectura general

Se recomienda una arquitectura de frontend estático con contenido gestionado como datos:

- Frontend: HTML + CSS + JavaScript (o TypeScript) con Vite
- Contenido educativo: archivos Markdown dentro de `content/`
- Persistencia local: `localStorage`
- Generación de PDF: script Node para compilar el contenido y exportarlo a PDF
- Validación: scripts Node para revisar links, estructura y contenido
- Testing: `node --test` para suites unitarias y Playwright para flujos E2E de navegador

Esto ofrece varias ventajas:

- Arranque rápido y sencillo
- Bajo mantenimiento
- Fácil publicación estática
- Excelente para un laboratorio educativo
- Permite una progresión realista sin depender de un backend complejo

### 3.2. Por qué no un monolito pesado desde el inicio

Un backend completo no es necesario para la primera versión porque la prioridad es:

- enseñar contenido,
- guiar progresos,
- evaluar labs,
- mantener un dashboard,
- publicar material en PDF,
- permitir testing y validación.

Si el proyecto evoluciona, el sistema puede incorporar servicios laterales (API, autenticación, base de datos, almacenamiento de progreso, dashboard de IA), pero no es recomendable forzarlo desde el principio.

---

## 4. Arquitectura técnica recomendada

### 4.1. Frontend

- Vite para el arranque del proyecto
- HTML semántico y componentes reutilizables
- CSS modular o estructurado por secciones
- JavaScript/TypeScript para lógica de navegación, XP, filtros y persistencia

#### Objetivos del frontend

- Mostrar roadmap y semanas
- Renderizar lecciones por módulo
- Mostrar labs, retos, break the system, soluciones y pistas
- Gestionar progreso del estudiante
- Guardar estado con `localStorage`
- Permitir búsqueda global
- Mostrar métricas de aprendizaje

### 4.2. Contenido como datos

Se recomienda separar el contenido del renderizado:

- `content/roadmap/`: roadmap general
- `content/weeks/`: archivos por semana
- `content/lessons/`: lecciones por módulo
- `content/labs/`: laboratorios y ejercicios
- `content/challenges/`: retos y pruebas
- `content/projects/`: proyectos acumulativos
- `content/glossary/`: glosario
- `content/resources/`: recursos y referencias

Esto permite:

- no duplicar contenido,
- generar PDFs reproducibles,
- validar enlaces,
- extender cursos sin alterar el frontend

### 4.3. Persistencia del progreso

Para una primera versión, la mejor opción es `localStorage` porque:

- no requiere backend,
- funciona en navegador local,
- facilita experimentación,
- permite un prototipo útil sin infraestructura.

Se guardarán:

- XP
- nivel actual
- semanas completadas
- laboratorios aprobados
- retos completados
- notas
- preferencias
- última sesión abierta

Si más adelante se convierte en aplicación multiusuario, se podrá migrar a un backend con autenticación y base de datos.

### 4.4. Generación del PDF (decisión real, no especulativa)

Se evaluaron dos enfoques: (a) `pdfkit` escribiendo texto directamente, sin dependencias de navegador; (b) Markdown → HTML → Puppeteer/Playwright headless, con fidelidad visual al CSS del sitio pero con una dependencia pesada (descarga de Chromium) que complica CI y el entorno de desarrollo en Windows.

**Decisión: se mantiene `pdfkit`.** Motivo: cero dependencias de navegador, funciona igual en cualquier máquina/CI, y es suficiente para un documento de texto estructurado (no necesita fidelidad pixel-perfect al sitio web). El trade-off aceptado es un diseño más simple que un PDF renderizado desde el mismo CSS del sitio.

`scripts/generate-pdf.js` ya no escribe texto fijo: construye el documento completo iterando `generated/content.json` (ver 4.7) — portada, índice con número de página real (técnica de `bufferPages` + `switchToPage`), objetivo y filosofía, roadmap, las 24 semanas completas, laboratorios, retos, glosario, recursos por categoría, checklist de avance derivado de los criterios de aprobación reales, y resumen de proyecto final. Pie de página con numeración en todas las páginas. Salida: `generated/AI-Engineering-Lab-2026.pdf` (~60 páginas con el contenido actual).

### 4.5. Validación del contenido (implementada)

`scripts/validate-content.js` ejecuta el mismo `build()` que usa el resto del pipeline y valida, sobre el contenido real (no solo sobre la existencia de archivos):

- que existan las 24 semanas, sin ids duplicados ni huecos
- que cada semana tenga objetivo, conceptos, reto, BREAK THE SYSTEM, RECOVERY, evaluación, evidencia y criterio de aprobación
- que cada lab con Markdown propio tenga pista, solución, criterio e instrucciones
- que el glosario no tenga términos duplicados ni vacíos
- que los recursos usen HTTPS
- qué labs/retos siguen en fallback (deuda de Fase B) — como **aviso**, no error, para no romper CI mientras esa deuda se resuelve por fases

Distingue errores (bloquean con exit 1: contenido malformado, duplicados) de avisos (no bloquean: contenido pendiente de fases futuras, documentado explícitamente). Verificado manualmente rompiendo a propósito una sección de `content/weeks/week-02.md`: el validador lo detectó y señaló el archivo y la sección exactos.

### 4.6. Testing (implementado, alcance real)

Se usa `node --test` (sin dependencias extra) con dos tipos de prueba:

- `tests/content/content-pipeline.test.js`: el pipeline de contenido genera 24 semanas completas, ids sin huecos, labs con Markdown propio bien formados, labs pendientes correctamente marcados, glosario sin duplicados, recursos en HTTPS.
- `tests/app/progress.test.mjs`: lógica pura de XP/nivel/progreso (`app/js/progress.js`) — suma y resta de XP, no-negatividad, inmutabilidad de los toggles. Se extrajo esta lógica de `app.js` específicamente para poder probarla sin DOM/navegador.

**Pendiente (Fase B/C, no implementado aún):** pruebas E2E de navegación/UI en navegador real. Se evaluará Playwright cuando el contenido esté más completo; no se reclama como ya implementado para evitar la misma desalineación documentación-código que motivó esta auditoría.

### 4.7. Pipeline de contenido (nuevo)

```text
content/**/*.md (frontmatter + secciones ## Titulo)
        ↓
scripts/lib/content-parser.js (frontmatter + split de secciones)
        ↓
scripts/build-content.js  →  generated/content.json
        ↓                         ↓                    ↓
app/js/data.js          scripts/validate-content.js   scripts/generate-pdf.js
(sitio web)              (CI / npm run validate)        (PDF completo)
```

`npm run content:build` regenera `generated/content.json`. Los scripts `dev`, `build`, `validate`, `pdf` y `test` lo regeneran automáticamente como paso `pre*` de npm, así que nunca se ejecutan contra contenido desactualizado.

Para semanas/labs sin Markdown propio todavía (labs 9-24, 2 de los 3 retos), `build-content.js` usa un fallback explícito definido en el propio script (copiado del `data.js` anterior) y lo marca con `pending: true` en cada entrada. Esto es deuda visible, no deuda oculta: aparece en los avisos de `npm run validate`, en el PDF (`[PENDIENTE: Fase B]`) y en `generated/content.json` (`meta.labsPending`).
- guardado de progreso
- cálculo de XP
- render de laboratorios
- accesibilidad básica
- generación de PDF

---

## 5. Estructura de carpetas propuesta

```text
ai-engineering-lab/
├── README.md
├── package.json
├── vite.config.*
├── index.html
├── app/
│   ├── css/
│   ├── js/
│   └── assets/
├── content/
│   ├── roadmap/
│   ├── weeks/
│   ├── lessons/
│   ├── labs/
│   ├── challenges/
│   ├── projects/
│   ├── glossary/
│   └── resources/
├── docs/
│   ├── ARCHITECTURE.md
│   ├── CURRICULUM.md
│   ├── LAB-RULES.md
│   └── CONTRIBUTING.md
├── scripts/
│   ├── generate-pdf.*
│   ├── validate-content.*
│   └── validate-links.*
├── tests/
│   ├── unit/
│   ├── e2e/
│   └── content/
├── generated/
│   └── AI-Engineering-Lab-2026.pdf
├── .github/
│   └── workflows/
│       └── validate.yml
└── public/
```

---

## 6. Decisiones de arquitectura

### 6.1. Elección de Node + Vite

Se prioriza una solución centralizada en Node por varias razones:

- es ideal para automatizar scripts,
- facilita validar contenido,
- genera PDF reproduciblemente,
- combina bien con frontend estático,
- mantiene una experiencia de desarrollo profesional.

### 6.2. Elección de Markdown como fuente de verdad

Este content model permite:

- actualizar contenido sin tocar el frontend,
- crear una base para el PDF,
- facilitar revisión y crecimiento del curso,
- mejorar maintainability.

### 6.3. Elección de localStorage para progreso

La primera versión tiene un enfoque educativo y local; no requiere autenticación ni persistencia compleja. `localStorage` satisface la necesidad funcional sin introducir la complejidad de un backend.

### 6.4. Elección de separación entre datos y render

El contenido no está embebido en el HTML. Esto reduce ruido, facilita pruebas y mejora extensibilidad.

---

## 7. Flujo de software

### 7.1. Flujo de contenido

```text
Markdown en content/
        ↓
Validación de estructura
        ↓
Render del HTML del curso
        ↓
Persistencia local del progreso
        ↓
Generación del PDF
```

### 7.2. Flujo de aprendizaje

```text
Estudiante abre curso
        ↓
Navega semanas y módulos
        ↓
Completa laboratorio
        ↓
Prueba resultados
        ↓
Recibe feedback y XP
        ↓
Guarda progreso en localStorage
```

### 7.3. Flujo de evaluación

```text
Laboratorio
        ↓
Comandos / resultado esperado
        ↓
Validación automática
        ↓
Puntuación + XP
        ↓
Documentación de evidencia
```

---

## 8. Riesgos y mitigaciones

### Riesgo: contenido acoplado al HTML

Mitigación: mover todo el contenido a archivos Markdown y cargarlo dinámicamente.

### Riesgo: PDF no reproducible

Mitigación: generar desde el contenido fuente y automatizar la exportación con script.

### Riesgo: progreso no persistente

Mitigación: usar `localStorage` con esquema claro y serialización segura.

### Riesgo: demasiada complejidad técnica

Mitigación: mantener una fase inicial ligera y modular, sin backend no necesario.

### Riesgo: falta de validación

Mitigación: crear scripts de validación y tests automáticos antes de una entrega.

---

## 9. Estrategia recomendada de implementación

### Fase 1 - Foundation

- Crear repositorio base
- definir estructura
- añadir README inicial
- crear docs/ARCHITECTURE.md y docs/CURRICULUM.md
- preparar `package.json` y scripts base

### Fase 2 - Content model

- crear roadmap, semanas, labs y retos
- definir metadata mínima por módulo
- preparar validación de contenido

### Fase 3 - Frontend UI

- renderizar secciones, navegación, checklist y dashboard
- calcular XP y progreso
- implementar búsqueda y filtros

### Fase 4 - Labs and assessment

- añadir laboratorios con pasos, comandos, verificaciones, retos y pistas
- crear solución visible con penalización de XP

### Fase 5 - PDF and QA

- generar HTML del curso
- compilar PDF reproducible
- ejecutar validación, QA y tests de UI

---

## 10. Recomendación final

La arquitectura ideal para este laboratorio es una plataforma educativa basada en un frontend ligero, contenido como datos y automatización con scripts Node. Es la mejor combinación entre profesionalismo, velocidad de ejecución, mantenibilidad y capacidad de crecimiento.

Esto permite construir un entorno serio, práctico y escalable sin caer en una infraestructura innecesaria ni en un curso superficial. La prioridad es enseñar mediante ejecución, medición, reparación y documentación real.

---

## 11. Siguiente paso

La siguiente fase será la definición curricular real del curso y el diseño de la ruta de 24 semanas, materializada en `docs/CURRICULUM.md` junto con el plan de implementación a seguir.
