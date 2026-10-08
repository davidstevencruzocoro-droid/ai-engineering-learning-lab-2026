---
id: lab-06
week: 6
xp: 30
title: "Suite de testing y regresión"
---

# Lab 06: Testing y regresión

## Objetivo
Construir confianza en los cambios mediante pruebas que validen comportamiento real.

## Duración
2 sesiones

## Requisitos
- pruebas unitarias y/o de integración
- casos normales y de error
- flujo de ejecución repetible

## Tareas
1. Identificar una funcionalidad crítica del sistema.
2. Escribir al menos una prueba de éxito y una de fallo.
3. Ejecutar pruebas y corregir fallos.
4. Documentar la intención de cada prueba.

## Pista
Las pruebas deben describir comportamiento observable, no solo detalles de implementación.

## Pista 2
Escribe cada caso como preparación, acción y resultado esperado. El test de error debe comprobar el mensaje/estado de error, además de que el fallo ocurra.

## Pista 3
Ejecuta las pruebas contra el código actual, introduce una regresión pequeña para comprobar que una prueba falla y revierte esa regresión antes de entregar.

## Solución
```java
assertEquals("ok", response.getStatus());
```

## Penalización XP
-2 XP por pruebas demasiado frágiles o que solo validan el código en vez del comportamiento.

## Evidencia
Guardar la salida de testing, nombres de pruebas y casos cubiertos.

## Criterio de aprobación
La suite valida negativamente y positivamente los flujos principales sin ambigüedad.
