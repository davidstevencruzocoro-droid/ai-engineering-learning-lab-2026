---
id: project-03
title: "Proyecto 3: Automatización empresarial"
weekStart: 9
weekEnd: 12
xp: 200
---

# Proyecto 3: Automatización empresarial

## Visión
Desplegar el sistema del Proyecto 2 en un entorno real con HTTPS, corregir sus vulnerabilidades de seguridad más importantes, y conectarlo a un flujo de automatización de negocio con un servicio externo.

## Problema
Un sistema que solo corre en local o en un contenedor de desarrollo no genera valor de negocio. Este proyecto obliga a cruzar esa frontera con las mismas exigencias de seguridad y operación de un sistema real.

## Stack
Linux (VPS o VM), Nginx, Certbot/HTTPS, OWASP Top 10, n8n, al menos una API externa o webhook real.

## Entregables
- Despliegue del sistema accesible por un dominio propio con HTTPS válido.
- Al menos dos vulnerabilidades reales identificadas y corregidas con evidencia de antes/después (inyección SQL, XSS, u otra del OWASP Top 10).
- Un workflow de n8n que conecta el sistema desplegado con al menos un servicio externo (ej. notificación, hoja de cálculo, CRM de prueba), con manejo explícito de errores.

## Criterios de éxito
- El sistema responde por HTTPS y sobrevive a un reinicio del servidor sin intervención manual.
- Las vulnerabilidades corregidas tienen evidencia de explotación (antes) y de bloqueo (después).
- El workflow de automatización distingue entre dato inválido, fallo de envío y éxito (no todo es "funcionó" o "no funcionó").

## Conexión con el proyecto final
El entorno de despliegue, las correcciones de seguridad y el patrón de automatización de este proyecto son la base operativa del proyecto final.
