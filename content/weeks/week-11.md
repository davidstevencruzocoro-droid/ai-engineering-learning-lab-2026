---
id: 11
level: 3
xp: 25
title: "Semana 11 · Integraciones"
---

# Semana 11: Integraciones y servicios externos

## Objetivo
Conectar sistemas distintos sin depender de su implementación interna.

## Por qué importa
La mayoría de aplicaciones reales necesitan interactuar con otros servicios, APIs y plataformas.

## Conceptos
- contratos de integración
- webhook
- timeout
- retries
- serialización y eventos

## Arquitectura
```text
Sistema 1
  ↓
API / cliente / adapter
  ↓
Sistema 2
```

## Laboratorio
Crear una integración con una API externa y capturar los fallos más habituales del mundo real.

## Preparación
- credenciales de prueba
- endpoint de ejemplo
- registro de respuestas y errores

## Paso 1
Definir el contrato y las respuestas esperadas.

## Paso 2
Implementar el adaptador para manejar errores y fallos de red.

## Paso 3
Validar con pruebas de integración y observabilidad básica.

## Verificación
```bash
curl -X POST http://localhost:8080/api/integrations/test
```

## Errores comunes
- JSON mal formado,
- respuestas inesperadas,
- timeouts,
- integración acoplada al entorno local.

## Debugging
Inspecciona las llamadas HTTP, el encabezado y el cuerpo antes de ajustar la lógica de negocio.

## Reto
Escenario donde el servicio externo responde tarde o con una estructura rara.

## BREAK THE SYSTEM
Introducir una respuesta no esperada y comprobar cómo se comporta la integración.

## RECOVERY
Diseñar manejo de errores y reintentos siguiendo el principio de degradación controlada.

## Evaluación
- ¿Hay tolerancia a fallos?
- ¿Se validan respuestas externas?
- ¿La integración es observables?

## Evidencia
Guardar logs, pruebas y descripciones del contrato.

## Criterio de aprobación
El estudiante debe poder explicar cómo una integración segura y observable reduce riesgo operativo.
