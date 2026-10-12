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

## Profundización técnica
Este Lab no implementa RAG hoy (el Mentor Ollama responde solo con su conocimiento entrenado, sin recuperar documentos), así que esto es la implementación real de los tres pasos que sí tendría que existir para construir uno — útil para cuando construyas el tuyo.

**1. Chunking con solapamiento**, no solo cortar cada N caracteres: cortar a lo bruto puede partir una idea a la mitad justo en el límite del chunk. Un solapamiento pequeño asegura que ninguna idea quede huérfana entre dos fragmentos:
```javascript
function chunkText(text, chunkSize = 500, overlap = 50) {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize - overlap) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
}
```

**2. Embeddings y similitud coseno** para encontrar los chunks relevantes a una pregunta: cada chunk se convierte en un vector numérico (vía un modelo de embeddings), y la pregunta del usuario también. Los chunks más "cercanos" en ese espacio vectorial son los más relevantes:
```javascript
function similitudCoseno(a, b) {
  const punto = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const normaA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const normaB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return punto / (normaA * normaB); // 1 = idénticos, 0 = sin relación
}
```
En la práctica no calculas esto a mano para miles de documentos — se usa una base de datos vectorial (pgvector, Chroma, Pinecone) que indexa los vectores y responde "dame los 5 chunks más parecidos" en milisegundos.

**3. Grounding real: que el modelo pueda decir "no lo sé".** La parte que más proyectos de RAG hacen mal es instruir al modelo para que *solo* conteste con la evidencia recuperada, y rechace explícitamente inventar cuando no hay nada relevante:
```text
Responde ÚNICAMENTE usando el CONTEXTO proporcionado abajo. Si el CONTEXTO no contiene
información suficiente para responder, di explícitamente "No tengo información suficiente
en los documentos para responder esto" — nunca inventes una respuesta.

CONTEXTO:
{{chunks_recuperados}}

PREGUNTA: {{pregunta_usuario}}
```
Sin esta instrucción explícita, el modelo tiende a "alucinar" una respuesta plausible aunque los chunks recuperados no tengan relación real con la pregunta — el riesgo central que un sistema RAG serio existe precisamente para prevenir.

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
