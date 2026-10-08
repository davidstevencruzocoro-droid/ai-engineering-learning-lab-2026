# Contributing

Este laboratorio está diseñado para crecer de manera modular.

## Regla de oro: el contenido vive en `content/**/*.md`, no en `app/js/data.js`

`app/js/data.js` ya no contiene contenido hardcodeado (semanas, labs, retos, glosario, recursos): todo eso se genera a partir de `content/**/*.md` vía `npm run content:build` → `generated/content.json`. **Nunca edites `generated/content.json` a mano** — se sobreescribe en cada build. Si necesitas cambiar un dato, edita el Markdown fuente.

(`projectMilestones`, `projectDeliverables`, `finalEvidence` y `projectStatus` en `data.js` son la excepción: son narrativa del dashboard, no contenido curricular, y se mantienen ahí hasta que la Fase B rediseñe el modelo de "6 proyectos acumulativos" del manifiesto.)

## Cómo ampliar el contenido

1. Añade una nueva semana en `content/weeks/week-NN.md` con frontmatter:
   ```
   ---
   id: NN
   level: 1-5
   xp: 20-30
   title: "Semana NN · Título"
   ---
   ```
   seguido de las secciones `## Objetivo`, `## Por qué importa`, `## Conceptos`, etc. (ver la sección 8 de `docs/CURRICULUM.md` para la lista completa de secciones obligatorias).
2. Añade su laboratorio en `content/labs/lab-week-NN.md` con frontmatter `id`, `week`, `xp`, `title`, y como mínimo las secciones `## Objetivo`, `## Pista`, `## Solución`, `## Penalización XP`, `## Criterio de aprobación`.
3. Ejecuta `npm run content:build` para regenerar `generated/content.json` y revisa que tu contenido aparezca correctamente.
4. Ejecuta:
   - `npm run validate` (falla si falta una sección obligatoria; avisa si el contenido queda en fallback)
   - `npm run test`
   - `npm run build`
   - `npm run pdf` (opcional, para ver tu contenido reflejado en el documento completo)

## Estándar para lecciones

Cada lección debe incluir:

- objetivo,
- por qué importa,
- conceptos,
- ejemplo,
- práctica,
- verificación,
- errores comunes,
- debugging,
- reto,
- break the system,
- recovery,
- evaluación.

## Estándar para laboratorios

Los laboratorios deben tener:

- preparación,
- pasos claros,
- objetivo final,
- verificación,
- pistas,
- solución guiada opcional,
- evidencia.
