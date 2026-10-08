---
id: 16
level: 4
xp: 25
title: "Semana 16 · Agentes"
---

# Semana 16: Agentes y herramientas

## Objetivo
Crear sistemas capaces de ejecutar pasos con herramientas, contexto y estrategia de decisión.

## Por qué importa
Los agentes amplían la capacidad de un sistema para actuar, no solo responder.

## Conceptos
- agente
- tool calling
- planificación
- iteración
- memoria operativa

## Arquitectura
```text
Usuario
  ↓
Agente
  ├─ plan
  ├─ herramientas
  └─ respuesta
```

## Laboratorio
Diseñar un agente simple que use herramientas e interprete resultados para completar una tarea.

## Preparación
- herramientas mínimas:
  - buscador,
  - calculadora,
  - validación de datos
- objetivo claro y medible

## Paso 1
Definir el trabajo que el agente debe hacer.

## Paso 2
Añadir herramientas y política de decisión.

## Paso 3
Observar si el agente actúa con intención y hace seguimiento de resultados.

## Verificación
- se ejecutan las herramientas correctas,
- se revisan resultados intermedios,
- se documenta la ruta de decisión.

## Errores comunes
- herramientas mal descritas,
- demasiada autonomía sin validación,
- ambigüedad en el objetivo,
- sin registro de decisiones.

## Debugging
Si un agente hace cosas raras, revisa la calidad de sus instrucciones y la definición de herramientas.

## Reto
Crear un agente para una tarea de análisis y validación concretas.

## BREAK THE SYSTEM
Dar instrucciones conflictivas o ambigüas para ver cómo reacciona.

## RECOVERY
Clarificar objetivos, restringir herramientas y volver a probar con observabilidad.

## Evaluación
- ¿Puede completar el objetivo con herramientas?
- ¿Tiene una estrategia observable?
- ¿Se valida la salida final?

## Evidencia
Guardar logs de ejecución, decisiones y salidas finalizadas.

## Criterio de aprobación
El estudiante debe entender que un agente no es una caja mágica: es una combinación de instrucciones, herramientas y control.
