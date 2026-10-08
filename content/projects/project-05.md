---
id: project-05
title: "Proyecto 5: Agente"
weekStart: 16
weekEnd: 18
xp: 200
---

# Proyecto 5: Agente

## Visión
Construir un agente con herramientas reales (incluyendo, idealmente, el RAG del Proyecto 4 y la API del Proyecto 1/2 como herramientas) con permisos mínimos, guardrails explícitos y observabilidad de sus decisiones.

## Problema
Un agente con acceso ilimitado a "hacer lo que haga falta" es un riesgo, no una ventaja. Este proyecto obliga a diseñar control antes que capacidad.

## Stack
API de LLM con tool calling, el RAG del Proyecto 4 (opcional pero recomendado como herramienta), el dashboard de observabilidad del lab 18.

## Entregables
- Al menos 3 herramientas con esquema de entrada explícito, una de ellas de solo lectura, una de escritura con validación, y una "peligrosa" que requiere confirmación humana antes de ejecutarse.
- Registro completo de las decisiones del agente: qué herramienta eligió, con qué parámetros, y por qué (el razonamiento o justificación que produjo el modelo).
- Un caso de prueba donde el agente intenta la acción peligrosa y queda bloqueada hasta confirmación.
- Dashboard u output con coste, latencia y tasa de error de las interacciones del agente.

## Criterios de éxito
- Ninguna acción irreversible se ejecuta sin un punto de control humano explícito.
- El agente solo tiene acceso a las herramientas que su tarea requiere (least privilege verificable).
- Existe trazabilidad completa: se puede reconstruir qué decidió el agente y por qué en cualquier interacción pasada.

## Conexión con el proyecto final
Este agente es el componente de "acción autónoma con control" que el proyecto final integra junto con el RAG, la API y la automatización de los proyectos anteriores.
