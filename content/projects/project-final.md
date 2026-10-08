---
id: project-final
title: "Proyecto final: AI Business Operations Platform"
weekStart: 22
weekEnd: 24
xp: 250
---

# Proyecto final: AI Business Operations Platform

## Visión
Integrar los componentes construidos a lo largo del laboratorio (API/datos, infraestructura, seguridad, automatización, RAG, agente, producto) en una sola plataforma operativa de negocio con IA, diseñada, construida y puesta en producción con evidencia real.

## Problema
Las piezas sueltas de las 24 semanas demuestran habilidades individuales; el proyecto final demuestra la habilidad más escasa y más valiosa: integrar todo en un sistema coherente que un negocio real podría usar.

## Stack
Todo lo construido en los Proyectos 1-6: frontend, backend, base de datos, autenticación/autorización, IA, RAG, agente con herramientas, automatización con n8n, Docker, CI/CD, seguridad aplicada, observabilidad.

## Entregables
- **Semana 22 — Diseño:** documento de arquitectura con problema, usuario, alcance explícito (incluye/no incluye), diagrama de componentes y los 3 riesgos técnicos principales con su mitigación (lab 22).
- **Semana 23 — Construcción:** el flujo principal funcionando de extremo a extremo, con pruebas del camino principal y su error más probable, y las desviaciones del diseño documentadas (lab 23).
- **Semana 24 — Producción y demo:** despliegue accesible por HTTPS, checklist de producción completo, README final, y una demo de 5 minutos con narrativa problema → solución → evidencia (lab 24).

## Criterios de éxito
- La plataforma integra al menos: un componente de datos/API propio, un componente de IA con evidencia (RAG o agente, idealmente ambos), y un componente de automatización o resiliencia operativa.
- Es accesible públicamente y un tercero puede ejecutarla siguiendo solo el README.
- Existe una demo de 5 minutos y un postmortem (`docs/POSTMORTEM.md`) del proyecto completo.

## Relación con el resto del laboratorio
Este proyecto no se construye desde cero en la semana 22: es la integración deliberada de los Proyectos 1 a 6. Si alguno de esos proyectos quedó incompleto, el primer paso de la semana 22 es decidir conscientemente qué piezas entran en el alcance final y cuáles se dejan fuera — ver el principio de alcance explícito en `content/labs/lab-week-22.md`.
