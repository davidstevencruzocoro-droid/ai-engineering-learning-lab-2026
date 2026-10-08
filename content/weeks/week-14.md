---
id: 14
level: 4
xp: 25
title: "Semana 14 · Prompt engineering"
---

# Semana 14: Prompt engineering

## Objetivo
Diseñar instrucciones claras, medibles y útiles para obtener respuestas confiables.

## Por qué importa
Un prompt no es solo texto; es una interfaz de control sobre el comportamiento del modelo.

## Conceptos
- instrucciones
- contexto
- ejemplos
- restricción
- iteración

## Arquitectura
```text
Objetivo
  ↓
Prompt
  ↓
Modelo
  ↓
Salida + evaluación
```

## Laboratorio
Crear varios prompts para una misma tarea y comparar fiabilidad, formato y calidad.

## Preparación
- conjunto de casos de prueba
- criterio de evaluación
- salida esperada con formato concreto

## Paso 1
Definir la tarea con un objetivo claro.

## Paso 2
Probar instrucciones precisas y limitadas.

## Paso 3
Evaluar diferencias de resultado de forma objetiva.

## Verificación
- estructura de salida,
- cobertura del caso,
- nivel de ambigüedad de la respuesta.

## Errores comunes
- prompts ambiguos,
- demasiadas instrucciones contradictorias,
- falta de formato esperable,
- no medir resultados.

## Debugging
Los fallos suelen aparecer por mala especificación del problema, no por falta de inteligencia del modelo.

## Reto
Hacer que el modelo produzca un formato fijo incluso con entradas variadas.

## BREAK THE SYSTEM
Forzar casos de borde en entradas incompletas o ambiguas.

## RECOVERY
Ajustar instrucción y ejemplos para reforzar la robustez.

## Evaluación
- ¿La salida es consistente?
- ¿Se puede validar con pruebas?
- ¿El prompt es claramente entendible?

## Evidencia
Guardar prompts, salidas y criterios de comparación.

## Criterio de aprobación
El estudiante debe ser capaz de racionalizar un prompt antes de ejecutarlo en producción.
