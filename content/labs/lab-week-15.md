---
id: lab-15
week: 15
xp: 50
title: "RAG con documentos propios"
---

# Lab 15: RAG que cita sus fuentes y rechaza lo que no sabe

## Objetivo
Construir un sistema de recuperación aumentada por generación (RAG) que responda solo con lo que puede justificar con un fragmento real de tus documentos.

## Duración
2-3 sesiones

## Requisitos
- entre 5 y 10 documentos de texto propios (notas, documentación de un proyecto tuyo, artículos que tengas permiso de usar)
- acceso a una API de embeddings y a una API de LLM

## Tareas
1. Divide (chunking) cada documento en fragmentos de tamaño razonable (ej. 300-500 palabras) conservando de qué documento viene cada fragmento.
2. Genera un embedding por fragmento y guárdalos con su texto y su origen (puede ser en memoria o en un array; no necesitas una base de datos vectorial dedicada para este lab).
3. Dada una pregunta, recupera los fragmentos más similares (similitud coseno) y pásalos al LLM como contexto, pidiéndole explícitamente que cite de qué fragmento sacó cada afirmación.
4. Haz una pregunta que NO esté cubierta por tus documentos y verifica que el sistema responde "no tengo evidencia suficiente" en vez de inventar una respuesta.

## Pista
El paso que la mayoría se salta es forzar al modelo a decir "no lo sé" — sin esa instrucción explícita, el LLM preferirá inventar una respuesta plausible antes que admitir falta de evidencia.

## Pista 2
Guarda texto, origen y metadatos con cada embedding. Recupera los fragmentos más similares y pasa solo ese contexto, junto con instrucciones para citar su procedencia.

## Pista 3
Prueba una pregunta respondible y otra sin evidencia. La segunda debe producir una abstención clara; comprueba que cada cita corresponde al fragmento recuperado.

## Solución
```javascript
function similitudCoseno(a, b) {
  const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0));
  const normB = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0));
  return dot / (normA * normB);
}

function recuperarFragmentos(preguntaEmbedding, fragmentos, k = 3) {
  return fragmentos
    .map((f) => ({ ...f, score: similitudCoseno(preguntaEmbedding, f.embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}

const promptSistema = `Responde SOLO usando los fragmentos proporcionados.
Cita el número de fragmento junto a cada afirmación, como [1], [2].
Si los fragmentos no contienen la respuesta, di exactamente:
"No tengo evidencia suficiente en los documentos para responder esto."`;
```

## Penalización XP
-10 XP por respuestas sin evidencia citada (grounded evidence) o que inventan una respuesta cuando no hay contexto suficiente.

## Evidencia
Una pregunta respondida correctamente con citas a fragmentos reales, y una pregunta fuera de dominio donde el sistema admite no tener evidencia.

## Criterio de aprobación
El sistema recupera fragmentos relevantes, cita su origen en cada respuesta, y rechaza explícitamente preguntas que sus documentos no cubren.
