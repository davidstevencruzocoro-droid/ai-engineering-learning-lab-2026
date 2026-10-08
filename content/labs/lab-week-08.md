---
id: lab-08
week: 8
xp: 35
title: "Pipeline CI/CD automatizado"
---

# Lab 08: CI/CD en práctica

## Objetivo
Automatizar validación y entrega para reducir errores humanos y mejorar la confianza en cada cambio.

## Duración
2 sesiones

## Requisitos
- repositorio con cambios reales
- pipeline básico
- validaciones mínimas ejecutadas automáticamente

## Tareas
1. Definir qué validaciones son obligatorias.
2. Crear un pipeline con instalación, tests y build.
3. Ejecutar la validación automática.
4. Corregir el pipeline cuando falla por una causa real.

## Pista
No valides solo una cosa: la calidad mínima suele incluir instalación, comprobaciones y build.

## Pista 2
Haz que el pipeline use el lockfile y ejecute los mismos comandos reproducibles que una persona ejecutaría localmente; separa instalación, tests y build para localizar fallos.

## Pista 3
Provoca un fallo deliberado en una prueba y confirma que CI bloquea el resultado. Después restáuralo y comprueba que una ejecución limpia llega hasta el build.

## Solución
```yaml
steps:
  - run: npm install
  - run: npm run validate
  - run: npm run test
  - run: npm run build
```

## Penalización XP
-2 XP por pipelines que no validan de verdad o que aceptan entregas sin comprobar la calidad.

## Evidencia
Guardar el pipeline, historial de ejecuciones y decisión de calidad adoptada.

## Criterio de aprobación
El flujo automatizado detecta fallos en tiempo real y ayuda a decidir si se entrega o no.
