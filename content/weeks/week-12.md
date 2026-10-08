---
id: 12
level: 3
xp: 25
title: "Semana 12 · n8n"
---

# Semana 12: Automatización con n8n

## Objetivo
Automatizar flujos de trabajo repetitivos con herramientas visuales y servicios reales.

## Por qué importa
Muchos procesos empresariales no requieren software complejo; requieren coordinación, triggers y automatización.

## Conceptos
- webhook
- trigger
- workflow
- data mapping
- orquestación

## Arquitectura
```text
Disparador
  ↓
Transformación / validación
  ↓
Acción en servicio externo
  ↓
Resultado y registro
```

## Laboratorio
Crear un flujo básico que reciba un evento, procese datos y active una acción en un servicio externo.

## Preparación
- cuenta de prueba
- acceso a servicios mínimos
- definiciones de entrada y salida

## Paso 1
Definir un trigger concreto y una salida predecible.

## Paso 2
Añadir validación y lógica de transformación.

## Paso 3
Probar ejecución real y revisar evidencia del resultado.

## Verificación
- logs del workflow
- payload de entrada
- salida del servicio externo

## Errores comunes
- datos sin normalizar,
- disparadores demasiado amplios,
- manejo insuficiente de errores.

## Debugging
Inspecciona cada nodo del flujo y valida que los datos se transforme como esperas.

## Reto
Diseñar un flujo con dos servicios y una validación intermedia.

## BREAK THE SYSTEM
Producir un payload incorrecto para detectar el punto de fallo del flujo.

## RECOVERY
Reparar la lógica y anotar la corrección para que el flujo sea más robusto.

## Evaluación
- ¿El flujo es observable?
- ¿Se identifica el punto exacto del error?
- ¿La automatización añade valor real?

## Evidencia
Guardar screenshots del flujo, ejemplos de ejecución y decisiones de diseño.

## Criterio de aprobación
El estudiante debe poder explicar el valor de automatizar procesos repetitivos con control y trazabilidad.
