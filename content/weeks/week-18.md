---
id: 18
level: 4
xp: 25
title: "Semana 18 · LLMOps"
---

# Semana 18: LLMOps

## Objetivo
Aplicar disciplina operativa para mantener soluciones con IA en producción de forma segura y monitorizable.

## Por qué importa
Una aplicación con IA necesita observabilidad, control de versiones y gestión de fallos como cualquier sistema crítico.

## Conceptos
- versionado de prompts
- observabilidad
- trazas
- retraining
- rollback

## Arquitectura
```text
Sistema productivo
  ↓
Prompt + Modelo + Config
  ↓
Trazas y métricas
  ↓
Decisiones de mejora
```

## Laboratorio
Crear un flujo de observación básico para respuesta, coste y errores.

## Preparación
- entorno con ejecución real,
- registro de prompts y salidas,
- criterio de fallo o regresión

## Paso 1
Definir qué datos se rastrean en cada ejecución.

## Paso 2
Capturar métricas útiles y mantener historial de cambios.

## Paso 3
Usar evidencia para decidir si se mejora o se revierte una versión.

## Verificación
- logs de ejecución,
- trazas por solicitud,
- comparación entre versionados.

## Errores comunes
- sin trazabilidad,
- cambios sin registro,
- sin comparación de comportamiento,
- sin criterio de rollback.

## Debugging
Cuando algo sale mal, empieza por ver qué cambió en la versión y qué datos se usaron.

## Reto
Comparar dos versiones de prompt para detectar un cambio de calidad o coste.

## BREAK THE SYSTEM
Introducir una versión de prompt con un efecto negativo y observar la recuperación.

## RECOVERY
Volver a una versión anterior y justificar la decisión con evidencia.

## Evaluación
- ¿Se puede trazar cada comportamiento?
- ¿Se compara calidad y coste?
- ¿Se maneja rollback con criterio?

## Evidencia
Guardar informes, métricas y decisiones de operación.

## Criterio de aprobación
El estudiante debe poder explicar que operar IA no es solo hacer funcionar un modelo: es controlar el sistema completo.
