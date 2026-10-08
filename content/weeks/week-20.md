---
id: 20
level: 5
xp: 25
title: "Semana 20 · Performance"
---

# Semana 20: Performance y optimización

## Objetivo
Detectar cuellos de botella y mejorar la eficiencia sin perder claridad ni estabilidad.

## Por qué importa
Una solución que funciona pero es demasiado lenta o cara no es una solución completa.

## Conceptos
- latencia
- throughput
- profiling
- caché
- optimización

## Arquitectura
```text
Sistema
  ↓
Métricas
  ↓
Cuello de botella
  ↓
Optimización
```

## Laboratorio
Medir una operación crítica y actuar sobre el punto más costoso.

## Preparación
- carga de ejemplo,
- herramientas de benchmarking,
- trazas de tiempo y uso de recursos

## Paso 1
Definir qué significa “rápido” en este caso concreto.

## Paso 2
Medir la operación con un caso realista.

## Paso 3
Aplicar una mejora y volver a medir el efecto.

## Verificación
- tiempos de ejecución,
- uso de memoria,
- efectos de caché o paralelización.

## Errores comunes
- optimizar sin datos,
- mejorar una parte irrelevante,
- sacrificar legibilidad sin beneficio real,
- no volver a medir.

## Debugging
La optimización empieza con evidencia, no con suposiciones de rendimiento.

## Reto
Reducir tiempo de respuesta con un cambio concreto y documentar el antes y después.

## BREAK THE SYSTEM
Generar carga y detectar si el sistema se degrada de forma peligrosa.

## RECOVERY
Aplicar la mejora con ajuste de medición para observar el efecto real.

## Evaluación
- ¿Se midió antes y después?
- ¿La optimización cambia un punto crítico?
- ¿Se preservó la claridad del sistema?

## Evidencia
Guardar benchmarks, capturas y conclusiones del ajuste.

## Criterio de aprobación
El estudiante debe poder justificar por qué un cambio de rendimiento es útil y no solo aparente.
