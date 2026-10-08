---
id: lab-22
week: 22
xp: 60
title: "Proyecto final: diseño y arquitectura"
---

# Lab 22: Diseñar el proyecto final antes de construirlo

## Objetivo
Producir un documento de diseño real para tu proyecto final, con decisiones justificadas, antes de escribir una sola línea de implementación.

## Duración
2-3 sesiones

## Requisitos
- todo lo construido en las semanas 1-21 (tienes piezas reutilizables: API, auth, IA, RAG, agente, automatización, Docker, CI/CD)
- una idea concreta de problema a resolver (puede ser el mismo MVP del lab 21, llevado a su versión completa)

## Tareas
1. Define el problema, el usuario y el alcance exacto (qué incluye y qué NO incluye explícitamente el proyecto final).
2. Diseña la arquitectura: qué componentes tendrá (frontend, backend, base de datos, IA/RAG/agente si aplica, automatización), cómo se comunican, y por qué esa arquitectura y no otra.
3. Identifica los 3 riesgos técnicos más grandes del proyecto y cómo los vas a mitigar o validar temprano.
4. Define el plan de entrega: qué construirás en la semana 23 (construcción) y qué dejarás para la 24 (producción y demo).

## Pista
El riesgo más común en un proyecto final no es técnico — es de alcance: intentar meter todo lo aprendido en las 24 semanas en un solo proyecto sin priorizar.

## Pista 2
Escribe explícitamente qué queda dentro y fuera del alcance. Dibuja los componentes y contratos principales antes de elegir detalles de implementación.

## Pista 3
Ordena los tres riesgos por impacto e incertidumbre, define una prueba temprana para cada uno y separa la entrega de construcción de la preparación de demo.

## Solución
Estructura mínima del documento de diseño (`docs/PROYECTO-FINAL-DISEÑO.md` en tu propio repo):
```markdown
# Diseño del proyecto final

## Problema y usuario
...

## Alcance
### Incluye
...
### No incluye (explícitamente, por ahora)
...

## Arquitectura
(diagrama de componentes + por qué esta arquitectura)

## Riesgos técnicos principales
1. Riesgo — cómo se mitiga
2. Riesgo — cómo se mitiga
3. Riesgo — cómo se mitiga

## Plan de entrega
- Semana 23: ...
- Semana 24: ...
```

## Penalización XP
-10 XP por empezar sin una visión de arquitectura ni alcance (saltar directo a programar sin este documento).

## Evidencia
El documento de diseño completo, con el diagrama de arquitectura y los riesgos identificados.

## Criterio de aprobación
Existe un documento de diseño con alcance explícito (incluye/no incluye), arquitectura justificada, y riesgos identificados con su mitigación — no una lista de tecnologías sin conexión entre sí.
