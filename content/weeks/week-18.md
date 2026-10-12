---
id: 18
level: 4
xp: 25
title: "Semana 18 · LLMOps"
---

# Semana 18: LLMOps

## Objetivo
Aplicar disciplina operativa para mantener soluciones con IA en producción de forma segura y monitorizable.

## Por qué importa
Una aplicación con IA necesita observabilidad, control de versiones y gestión de fallos como cualquier sistema crítico.

## Conceptos
- versionado de prompts
- observabilidad
- trazas
- retraining
- rollback

## Arquitectura
```text
Sistema productivo
  ↓
Prompt + Modelo + Config
  ↓
Trazas y métricas
  ↓
Decisiones de mejora
```

## Profundización técnica
Este Lab ya versiona sus prompts de producción de la forma más simple y más efectiva que existe: como código, dentro de Git. `MENTOR_SYSTEM_PROMPT` y `LOG_ANALYZER_SYSTEM_PROMPT` viven como constantes en `server/index.mjs` — cualquier cambio a esos prompts pasa por `git diff`, un commit con mensaje explicando el *por qué*, y (si algo sale mal) un `git revert` tan simple como el de cualquier otro bug de código. Eso ya es mejor LLMOps que editar un prompt "en caliente" en un panel de administración sin historial.

Lo que le falta a este Lab hoy — y lo que un sistema LLMOps maduro añade encima de solo versionar el texto — es trazabilidad de **cada ejecución**, no solo del prompt. El patrón real es asignar un identificador único a cada llamada y registrar todo lo relevante junto:
```javascript
async function callOllamaConTraza(systemPrompt, messages, options) {
  const trazaId = randomUUID();
  const inicio = Date.now();
  try {
    const respuesta = await callOllama(systemPrompt, messages, options);
    registrarTraza({
      trazaId,
      promptVersion: 'mentor-v3', // referencia al commit o tag que introdujo este prompt
      modelo: OLLAMA_MODEL,
      duracionMs: Date.now() - inicio,
      tokensEntrada: estimarTokens(messages),
      exito: true
    });
    return respuesta;
  } catch (error) {
    registrarTraza({ trazaId, promptVersion: 'mentor-v3', duracionMs: Date.now() - inicio, exito: false, error: error.message });
    throw error;
  }
}
```
Con esto acumulado a lo largo del tiempo, "¿el prompt nuevo empeoró la latencia?" o "¿qué porcentaje de llamadas falla desde el cambio de ayer?" dejan de ser preguntas que requieren adivinar — son una consulta sobre datos reales. Esa es la diferencia entre "tengo un prompt que funciona" y "opero un sistema de IA con la misma disciplina que cualquier servicio en producción".

## Laboratorio
Crear un flujo de observación básico para respuesta, coste y errores.

## Preparación
- entorno con ejecución real,
- registro de prompts y salidas,
- criterio de fallo o regresión

## Paso 1
Definir qué datos se rastrean en cada ejecución.

## Paso 2
Capturar métricas útiles y mantener historial de cambios.

## Paso 3
Usar evidencia para decidir si se mejora o se revierte una versión.

## Verificación
- logs de ejecución,
- trazas por solicitud,
- comparación entre versionados.

## Errores comunes
- sin trazabilidad,
- cambios sin registro,
- sin comparación de comportamiento,
- sin criterio de rollback.

## Debugging
Cuando algo sale mal, empieza por ver qué cambió en la versión y qué datos se usaron.

## Reto
Comparar dos versiones de prompt para detectar un cambio de calidad o coste.

## BREAK THE SYSTEM
Introducir una versión de prompt con un efecto negativo y observar la recuperación.

## RECOVERY
Volver a una versión anterior y justificar la decisión con evidencia.

## Evaluación
- ¿Se puede trazar cada comportamiento?
- ¿Se compara calidad y coste?
- ¿Se maneja rollback con criterio?

## Evidencia
Guardar informes, métricas y decisiones de operación.

## Criterio de aprobación
El estudiante debe poder explicar que operar IA no es solo hacer funcionar un modelo: es controlar el sistema completo.
