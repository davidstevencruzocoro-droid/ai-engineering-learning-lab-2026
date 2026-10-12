---
id: 22
level: 5
xp: 30
title: "Semana 22 · Proyecto final I"
---

# Semana 22: Proyecto final I

## Objetivo
Definir la idea, los objetivos y la arquitectura del proyecto final con criterio y foco.

## Por qué importa
Un buen proyecto final no empieza con código: empieza con claridad de problema y alcance.

## Conceptos
- alcance
- objetivos
- arquitectura inicial
- riesgo
- milestones

## Arquitectura
```text
Idea
  ↓
Alcance y objetivos
  ↓
Arquitectura base
  ↓
Plan de desarrollo
```

## Profundización técnica
La arquitectura de un proyecto se olvida rápido si solo vive en tu cabeza. La práctica real para que una decisión de arquitectura sobreviva al tiempo (y a que alguien más, o tú mismo en 6 meses, se pregunte "¿por qué hicimos esto así?") es un **ADR** (Architecture Decision Record): un documento corto por cada decisión importante, versionado junto al código:
```markdown
# ADR 001: Usar SQLite en vez de PostgreSQL para el MVP

### Contexto
El proyecto necesita persistencia, pero todavía no hay usuarios reales ni necesidad
de concurrencia de escritura alta. Levantar y operar Postgres añade una dependencia
de infraestructura que no se justifica en esta etapa.

### Decisión
Usar SQLite como base de datos para el MVP, con un archivo único versionado fuera
de Git (en .gitignore).

### Consecuencias
- Positivo: cero infraestructura adicional, el proyecto corre con `npm install && npm start`.
- Negativo: no soporta escrituras concurrentes reales; habrá que migrar a Postgres
  si el proyecto pasa de prototipo a necesitar más de un escritor simultáneo.
- Riesgo aceptado: la migración futura requerirá reescribir las consultas específicas
  de SQLite (ej. `AUTOINCREMENT` vs `SERIAL`).
```
Guardar esto en `docs/adr/001-sqlite-vs-postgres.md` (un archivo por decisión, numerados) hace que la arquitectura inicial del proyecto sea algo que se puede **auditar y cuestionar** después, en vez de un recuerdo vago de "creo que lo decidimos así porque era más simple".

El otro artefacto que evita que el proyecto se vuelva ilegible a la semana 3 es un README que, desde el primer commit, responde sin ambigüedad:
```markdown
### Qué es esto
(una frase: el problema que resuelve, no la lista de tecnologías)

### Cómo correrlo
(los comandos exactos, probados en una máquina limpia — no "debería funcionar con...")

### Arquitectura
(un diagrama de texto simple: qué componente habla con cuál)

### Estado actual
(qué funciona, qué es un placeholder, qué falta)
```
Un README que no responde "cómo correrlo" con comandos exactos es la causa más común de que un proyecto, por bueno que sea el código, parezca abandonado o poco profesional al primer vistazo.

## Laboratorio
Preparar la base del proyecto final con visión de producto y diseño técnico.

## Preparación
- problema concreto,
- público objetivo,
- restricciones de tiempo y tecnología,
- visión de evidencia de éxito

## Paso 1
Definir el problema y la propuesta de valor.

## Paso 2
Organizar arquitectura, componentes y entregables.

## Paso 3
Establecer un plan y métricas mínimas de éxito.

## Verificación
- claridad del alcance,
- proporción entre tiempo y alcance,
- diseño básico ejecutable.

## Errores comunes
- alcance demasiado amplio,
- solución sin criterio,
- falta de plan de validación,
- objetivos vagos.

## Debugging
Si la idea parece “genial” pero no tiene límites ni objetivo, probablemente faltan requisitos.

## Reto
Reducir el proyecto a una versión mínima pero valiosa.

## BREAK THE SYSTEM
Probar si el proyecto resiste cambios de alcance sin perder valor.

## RECOVERY
Ajustar alcance, estructura y prioridades con evidencia.

## Evaluación
- ¿El proyecto tiene un problema claro?
- ¿Tiene un alcance metodológico?
- ¿Hay plan para medir éxito?

## Evidencia
Guardar propuesta del proyecto, arquitectura base y plan de entregas.

## Criterio de aprobación
El estudiante debe poder explicar por qué el proyecto tiene sentido y cómo se va a construir con criterio.
