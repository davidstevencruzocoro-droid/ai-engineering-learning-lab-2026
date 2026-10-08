# Testing — Estrategia de pruebas del laboratorio

Este documento cubre dos cosas distintas que no hay que confundir: (1) cómo se prueba *este repositorio* (la plataforma), y (2) cómo se espera que *tú* pruebes los proyectos que construyes en cada laboratorio.

## 1. Cómo se prueba esta plataforma

- `npm run validate` — valida el contenido real (`scripts/validate-content.js`): estructura de las 24 semanas, labs completos, glosario sin duplicados, recursos en HTTPS. Ver `docs/ARCHITECTURE.md` sección 4.5.
- `npm test` (`node --test`) — suites unitarias del pipeline de contenido y de la lógica pura de XP/nivel/progreso y estado local.
- `npm run test:e2e` — flujos del usuario en Chromium real, definidos en `tests/e2e/learning-flows.pw.js`. Playwright inicia Vite en `127.0.0.1:4174` y lo detiene al terminar.
- `tests/server/local-api.test.mjs` — validación de perfiles cerrados, argumentos seguros del sandbox, contratos del mentor e inventario, y rechazo de orígenes no locales.
- `npm run build` — build de producción de Vite; falla si hay un error de import o sintaxis.
- `npm run pdf` — genera el PDF completo; falla si el pipeline de contenido está roto.

### Preparación de Playwright

Después de `npm install`, instala el navegador una vez con `npx playwright install chromium`. En CI puede usarse `npx playwright install --with-deps chromium` en una imagen Linux compatible.

La suite E2E cubre:

- recompensas de las cuatro etapas de ayuda, XP al completar y persistencia al recargar;
- completar sin consultar ayuda (100% de XP);
- persistencia del estado independiente de proyectos y del checklist de empleo, sin alterar XP;
- presencia de los modos de entrenamiento y ausencia de desbordamiento horizontal en móvil.
- contrato de UI del runner y el mentor, consentimiento de contexto, tratamiento de respuestas como texto y mensajes cuando los servicios locales no están disponibles.
- renderizado del inventario local, incluida la versión de PowerShell y el recuento de contenedores Docker.

Cada test borra el progreso de la aplicación antes de ejecutarse. Los tests unitarios continúan separados; `npm test` no requiere iniciar navegador.

Las pruebas reales de ejecución en Docker y respuesta de Ollama requieren los servicios locales: `npm run lab:sandbox:build`, `npm run lab:server`, Vite y el modelo `llama3.2:latest`. La suite CI no descarga ni arranca Docker/Ollama para probar el runner; allí se validan los contratos y las UI con APIs simuladas.

## 2. Cómo se espera que pruebes TUS proyectos de laboratorio

La filosofía de este laboratorio (ver `docs/LAB-RULES.md`) es: **probar que algo funciona no es suficiente — hay que probar que falla correctamente.**

### Pirámide de pruebas enseñada en la semana 6

```text
        /\
       /E2E\        pocas, lentas, cubren el flujo completo de usuario
      /------\
     /Integra-\     moderadas, cubren la interacción entre componentes
    /  ción    \    (API + base de datos, servicio + IA externa)
   /------------\
  /   Unitarias   \ muchas, rápidas, cubren lógica aislada
 /------------------\
```

### Qué probar siempre, además del camino feliz

- **El caso de error más probable** de cada funcionalidad (input inválido, dependencia caída, dato faltante).
- **Los límites** (cero elementos, un elemento, el máximo permitido).
- **La regresión**: cuando corriges un bug, añade una prueba que falle sin tu fix y pase con él — así ese bug no puede volver sin que lo notes.

### Testing específico de sistemas con IA (semanas 13-18)

Probar un sistema con LLM es distinto a probar código determinista, porque la misma entrada puede no producir siempre la misma salida exacta. En su lugar:

- Prueba el **contrato de salida** (¿es JSON válido? ¿tiene los campos esperados?), no el texto exacto.
- Usa un conjunto de casos de evaluación con criterios medibles (ver lab 14 y `docs/AI-EVALUATION.md`), no un único `assert` de igualdad de texto.
- Prueba explícitamente que el sistema rechaza preguntas sin evidencia (lab 15) en vez de solo probar que responde bien a lo que sí sabe.

### Herramientas según el tipo de proyecto

| Si construyes con... | Usa |
|---|---|
| Java / Spring Boot | JUnit 5 + Mockito |
| JavaScript / TypeScript | el test runner nativo de Node, o Vitest si el proyecto ya usa Vite |
| Frontend con flujos de usuario complejos | Cypress o Playwright |
| Contenido/documentación (como este propio repo) | scripts de validación propios, como `scripts/validate-content.js` |

No añadas una herramienta de testing nueva "porque es popular" si el test runner nativo de tu stack ya resuelve el caso — menos dependencias es una decisión válida, no una carencia.
