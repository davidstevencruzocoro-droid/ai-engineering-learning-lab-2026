---
id: 15
level: 4
xp: 25
title: "Semana 15 · RAG"
---

# Semana 15: RAG y recuperación de conocimiento

## Objetivo
Combinar un modelo con información contextual externa para mejorar la calidad y la trazabilidad.

## Por qué importa
Cuando la respuesta debe basarse en hechos externos, la memoria interna del modelo no es suficiente.

## Conceptos
- RAG
- índice
- chunks
- recuperación
- citación

## Arquitectura
```text
Documentos
  ↓
Indexación / chunking
  ↓
Recuperación relevante
  ↓
Modelo + contexto
  ↓
Respuesta con referencias
```

## Laboratorio
Construir una pequeña RAG con documentos propios y validar que la respuesta se soporta en la fuente.

## Preparación
- varios documentos de prueba
- estrategia de chunking
- criterio de relevancia

## Paso 1
Preparar los documentos y definir la unidad de recuperación.

## Paso 2
Añadir recuperación y contexto a la query.

## Paso 3
Validar si la respuesta usa evidencia concreta y no fabrica información.

## Verificación
- cita o referencia a fuente,
- calidad de respuesta,
- manejo de preguntas fuera de contexto.

## Errores comunes
- documentos sin estructura,
- chunks demasiado grandes,
- respuestas sin referencias,
- recuperación demasiado general.

## Debugging
Si la respuesta es confusa, revisa primero la fuente recuperada, no la lógica del modelo.

## Reto
Un sistema que debe contestar sobre un único conjunto de documentos sin inventar contenido.

## BREAK THE SYSTEM
Hacer preguntas fuera del alcance de los documentos y verificar el comportamiento.

## RECOVERY
Reforzar la estrategia de recuperación y la política de no respuesta cuando falta evidencia.

## Evaluación
- ¿La respuesta demuestra evidencia?
- ¿La fuente es útil para el caso?
- ¿El sistema sabe decir que no sabe?

## Evidencia
Guardar documentos, índices, queries y resultados de validación.

## Criterio de aprobación
El estudiante debe poder explicar la diferencia entre una respuesta generativa y una respuesta con evidencia externa.
