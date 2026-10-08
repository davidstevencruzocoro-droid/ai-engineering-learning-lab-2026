# Postmortem — Plantilla

Usa esta plantilla después de cada proyecto (y especialmente después del proyecto final, semana 24) y después de cualquier incidente real durante un laboratorio o un "Break the System". Un postmortem no busca culpables — busca que el mismo error no se repita sin que lo veas venir.

## Plantilla

```markdown
# Postmortem: [nombre del proyecto o incidente]

**Fecha:** [AAAA-MM-DD]
**Semana / laboratorio:** [ej. Semana 19, lab 19]

## ¿Qué construí / qué pasó?
Descripción neutral de los hechos, sin interpretación todavía.

## ¿Qué salió mal?
El problema concreto observado (un error, un dato incorrecto, un tiempo de respuesta inaceptable).

## ¿Por qué?
La causa raíz, no solo el síntoma inmediato. Pregúntate "¿por qué?" varias veces seguidas
hasta llegar a algo accionable (técnica de los "5 por qués").

## ¿Cómo lo detecté?
¿Un test, un log, un usuario, pura suerte? Si fue "pura suerte", eso es parte del problema.

## ¿Cómo lo corregí?
La solución aplicada, y si fue un parche temporal o una corrección de fondo.

## ¿Cómo evitaré que vuelva a ocurrir?
Un cambio concreto: una prueba nueva, una validación, una alerta, un cambio de proceso.
No vale "tendré más cuidado" — eso no es una prevención verificable.

## ¿Qué aprendí?
Lo técnico y, si aplica, lo de proceso/decisión.

## ¿Qué haría diferente?
Con lo que sabes ahora, qué decisión temprana cambiarías.
```

## Por qué esto importa más de lo que parece

El sistema de evaluación de este laboratorio (`docs/CURRICULUM.md` sección 5) pondera la documentación y el aprendizaje de los fallos, no solo el resultado final. Un proyecto que falló y tiene un postmortem honesto demuestra más competencia profesional que un proyecto que "funcionó a la primera" sin que el autor pueda explicar los riesgos que corrió sin saberlo.
