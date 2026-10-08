---
id: 19
level: 5
xp: 25
title: "Semana 19 · Sistemas distribuidos"
---

# Semana 19: Sistemas distribuidos

## Objetivo
Entender cómo múltiples servicios cooperan para ofrecer un sistema tolerante, escalable y observable.

## Por qué importa
La mayoría de sistemas modernos ya no viven en una sola aplicación monolítica.

## Conceptos
- servicio
- comunicación asincrónica
- tolerancia a fallos
- consistencia
- observabilidad distribuida

## Arquitectura
```text
Cliente
  ↓
API
  ├─ Servicio A
  ├─ Servicio B
  └─ Servicio C
```

## Laboratorio
Diseñar una funcionalidad dividida en varios servicios con límites claros y dependencia controlada.

## Preparación
- un conjunto de servicios mínimos,
- una tarea que requiera coordinación,
- criterio para distinguir responsabilidades.

## Paso 1
Dividir el problema en servicios con interfaces claras.

## Paso 2
Definir contrato de comunicación y manejo de errores.

## Paso 3
Probar cómo falla cada componente y cómo se recupera el sistema.

## Verificación
- trazas entre servicios,
- tiempos de ejecución,
- manejo de fallos parciales.

## Errores comunes
- acoplamiento fuerte,
- fallos sin observabilidad,
- dependencias ocultas,
- diseño con una sola responsabilidad no clara.

## Debugging
Cuando falla un sistema distribuido, sigue el flujo de comunicación y no asumas que el problema está en un único servicio.

## Reto
Que un servicio falle y comprobar qué impacto tiene en el resto del sistema.

## BREAK THE SYSTEM
Introducir un timeout o una dependencia no disponible y reproducir el fallo.

## RECOVERY
Corregir la tolerancia a fallos y documentar la dependencia crítica.

## Evaluación
- ¿Los servicios tienen límites claros?
- ¿El sistema puede degradar con control?
- ¿Hay observabilidad suficiente?

## Evidencia
Guardar diagramas, logs y notas de diseño.

## Criterio de aprobación
El estudiante debe poder explicar qué cambia al diseñar sistemas distribuidos frente a sistemas monolíticos.
