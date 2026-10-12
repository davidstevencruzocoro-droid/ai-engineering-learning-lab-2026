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

## Profundización técnica
El laboratorio 6 de este mismo Lab ("Break the System") califica justamente una implementación real del patrón más usado para tolerancia a fallos entre servicios: el **Circuit Breaker**. El arnés de verificación (`server/grading.mjs`) construye una instancia así:
```javascript
const cb = new CircuitBreaker(3, 60); // 3 fallos consecutivos, 60ms de espera antes de reintentar
```
Y exige exactamente este comportamiento:
1. Tras **3 fallos consecutivos** llamando `cb.ejecutar(funcionQueFalla)`, el circuito pasa a estado `'abierto'`.
2. Mientras está `'abierto'`, llamar `cb.ejecutar(...)` de nuevo **rechaza inmediatamente sin ejecutar la función real** — ni siquiera lo intenta.
3. Pasado el tiempo de espera, si la siguiente ejecución tiene éxito, el circuito vuelve a `'cerrado'` (funcionamiento normal).

La idea central es evitar que un servicio que ya sabes que está caído siga recibiendo llamadas que solo van a fallar y a sumar latencia — "dejar de intentar durante un tiempo" es, contraintuitivamente, más resiliente que "reintentar siempre con la esperanza de que esta vez funcione". Comparado con el patrón de reintentos con backoff exponencial de la lección de Integraciones (semana 11): un backoff decide cuánto esperar *entre intentos de una misma llamada*; un circuit breaker decide cuándo **dejar de intentar del todo** después de fallos repetidos, protegiendo al servicio que llama de perder tiempo y recursos en una dependencia que ya sabe que está caída.

La forma completa de este patrón modela tres estados explícitos, no solo dos — y es exactamente la que exige el ejercicio calificado del laboratorio de esta semana (`lab-19`, sección "Ejercicio calificado"): `'cerrado'` (normal), `'abierto'` (falla rápido, sin intentar), y `'semi-abierto'` (ya pasó el tiempo de espera, se permite una llamada de prueba antes de decidir si vuelve a cerrar o se reabre). Si quieres ver una implementación completa, ya está en ese mismo laboratorio — no la repitas aquí sin intentarlo tú primero.

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
