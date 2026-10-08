---
id: lab-23
week: 23
xp: 60
title: "Proyecto final: construcción"
---

# Lab 23: Construir el proyecto final con evidencia real

## Objetivo
Implementar lo definido en el documento de diseño de la semana 22, priorizando que el flujo principal funcione de extremo a extremo antes que pulir funcionalidades secundarias.

## Duración
3-4 sesiones

## Requisitos
- el documento de diseño del lab 22
- el entorno de desarrollo y los componentes reutilizables de semanas anteriores

## Tareas
1. Construye primero el "camino feliz" completo de extremo a extremo (frontend → backend → base de datos → IA si aplica), aunque sea con datos de prueba.
2. Añade manejo de errores en los puntos críticos identificados como riesgo en el diseño (semana 22), no en todos los puntos posibles.
3. Escribe al menos las pruebas que cubran el flujo principal y el error más probable de ese flujo.
4. Documenta cada decisión que se desvió del diseño original y por qué (los planes cambian al implementar; lo importante es dejar constancia).

## Pista
Construir "todo al 80%" simultáneamente es más arriesgado que construir "una parte al 100%" primero: si te quedas sin tiempo, prefieres tener un flujo completo y simple que diez flujos a medias.

## Pista 2
Completa un recorrido vertical con datos de prueba desde la interfaz hasta la persistencia. Mantén fuera las integraciones opcionales hasta que ese recorrido funcione.

## Pista 3
Automatiza una prueba de éxito y el error más probable del flujo. Compara las decisiones reales con el diseño de semana 22 y registra cada desviación con su motivo.

## Solución
Orden de construcción recomendado:
```text
1. Modelo de datos + migración mínima
2. Endpoint(s) del flujo principal (sin IA todavía, con datos de prueba)
3. Frontend mínimo que consuma ese endpoint
4. Integración de IA/RAG/agente (si aplica) sobre el flujo ya funcionando
5. Manejo de errores en los puntos de riesgo identificados
6. Tests del flujo principal + su error más probable
```
Registra las desviaciones del diseño en una sección del propio documento de diseño:
```markdown
## Desviaciones durante la construcción
- Cambié X por Y porque [razón concreta encontrada al implementar].
```

## Penalización XP
-10 XP por entregar sin validación funcional ni control de calidad (que "compile" no es el criterio; que resuelva el problema del flujo principal, sí).

## Evidencia
El código del proyecto, las pruebas del flujo principal ejecutándose, y la sección de desviaciones documentada.

## Criterio de aprobación
El flujo principal del proyecto funciona de extremo a extremo con datos reales (no solo de prueba interna), tiene al menos una prueba automatizada, y las desviaciones del diseño están documentadas.
