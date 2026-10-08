---
id: 10
level: 3
xp: 25
title: "Semana 10 · Seguridad"
---

# Semana 10: Seguridad y resiliencia

## Objetivo
Entender cómo proteger una aplicación desde el diseño, no solo desde el parche final.

## Por qué importa
La seguridad no es un lujo ni un detalle opcional: es una propiedad del sistema.

## Conceptos
- OWASP
- autenticación
- autorización
- secrets
- validación de entradas
- resiliencia

## Arquitectura
```text
Cliente
  ↓
API
  ↓
Validación + auth + policy
  ↓
Datos y servicios externos
```

## Laboratorio
Revisar un servicio con fallos comunes y corregir la causa raíz en lugar de aplicar soluciones superficiales.

## Preparación
- entorno seguro de pruebas
- acceso a endpoints con datos sensibles
- análisis de logs y respuestas

## Paso 1
Mapear los puntos de entrada y las rutas más críticas.

## Paso 2
Aplicar validación y control de acceso mínimo necesario.

## Paso 3
Medir el impacto real mediante pruebas de seguridad y observación del comportamiento.

## Verificación
```bash
curl -i http://localhost:8080/api/admin
```

## Errores comunes
- falta de validación,
- tokens expuestos,
- secretos en repositorio,
- permisos demasiado amplios.

## Debugging
Asume que la vulnerabilidad es un problema de diseño, no solo de código.

## Reto
Cambiar una política de seguridad para comprobar si un flujo protegido se rompe de forma predecible.

## BREAK THE SYSTEM
Forzar un caso límite con entrada anómala o permisos incorrectos.

## RECOVERY
Corregir el control de acceso y documentar la decisión para evitar regresiones.

## Evaluación
- ¿La aplicación valida entradas?
- ¿Se minimiza el alcance de permisos?
- ¿La evidencia demuestra la corrección?

## Evidencia
Guardar pull requests, notas de seguridad y tests de validación.

## Criterio de aprobación
El estudiante debe poder explicar los riesgos principales y cómo evaluar su impacto.
