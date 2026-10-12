---
id: 13
level: 4
xp: 25
title: "Semana 13 · IA aplicada"
---

# Semana 13: IA aplicada y control de costes

## Objetivo
Diseñar soluciones con IA que entreguen valor real sin perder control operacional ni presupuestario.

## Por qué importa
El costo y la fiabilidad de una solución con IA dependen tanto del diseño como del uso responsable del modelo.

## Conceptos
- prompts
- tokens
- coste por llamada
- observabilidad
- calidad y latencia

## Arquitectura
```text
Usuario
  ↓
Aplicación
  ↓
Modelo de IA
  ↓
Observabilidad y control de coste
```

## Profundización técnica
El costo real de IA se mide y se controla en código, no solo en una hoja de cálculo. Este mismo Lab ya hace una forma simple de control de costo real: en `server/index.mjs`, `callOllama()` recibe un límite explícito de tokens de salida:
```javascript
async function callOllama(systemPrompt, messages, { temperature = 0.25, numPredict = 450 } = {}) {
  // ...
}
```
`numPredict: 450` fuerza al modelo a cortar su respuesta después de ~450 tokens. Con un modelo local (Ollama) esto controla tiempo de respuesta y uso de GPU/CPU; con una API de pago (OpenAI, Anthropic, etc.) ese mismo límite controla directamente cuánto dinero cuesta cada llamada, porque esos proveedores cobran por token de entrada *y* de salida.

Para estimar costo real con una API de pago, el cálculo es simple pero hay que hacerlo explícito en el código, no de memoria:
```javascript
function estimarCosto(tokensEntrada, tokensSalida, precioPorMilEntrada, precioPorMilSalida) {
  return (tokensEntrada / 1000) * precioPorMilEntrada + (tokensSalida / 1000) * precioPorMilSalida;
}
```
Dos palancas reales para bajar ese costo sin degradar calidad percibida:
- **Caché de respuestas**: si la misma pregunta (o una semánticamente equivalente) se repite, guardar la respuesta anterior y no volver a llamar al modelo. Un caché simple por hash exacto del prompt ya evita pagar dos veces por la pregunta idéntica.
- **Elegir el modelo más barato que cumple el umbral de calidad**, no el más potente disponible — un modelo pequeño para clasificar texto en 3 categorías no necesita el mismo modelo que escribe código complejo.

Con un modelo local como Ollama (el que usa este Lab), el "costo por token" es cero en dinero directo, pero no es gratis: consume CPU/GPU y tiempo de respuesta del propio servidor — por eso `numPredict` sigue siendo relevante aunque no haya factura.

## Laboratorio
Medir qué tan costosa y útil es una interacción con un modelo para un caso concreto.

## Preparación
- acceso a un modelo de IA
- ejemplos de entrada/salida
- registro del coste por ejecución

## Paso 1
Definir una tarea simple y observable.

## Paso 2
Probar varias aproximaciones de prompt o contexto.

## Paso 3
Comparar coste, calidad y continuidad de la respuesta.

## Verificación
```bash
curl -X POST http://localhost:8080/api/ai/evaluate
```

## Errores comunes
- prompts demasiado largos,
- contexto innecesario,
- sin evaluación de respuesta,
- coste sin análisis de retorno.

## Debugging
Revisa la relación entre contexto, modelo y salida antes de suponer que más es mejor.

## Reto
Reducir coste sin destruir calidad de la respuesta.

## BREAK THE SYSTEM
Intentar una entrada ambigua o un contexto excesivo para detectar el punto de fallo.

## RECOVERY
Aplicar un diseño más preciso y medir la mejora.

## Evaluación
- ¿Se entiende qué coste genera cada uso?
- ¿La respuesta es verificable?
- ¿La solución escala con disciplina?

## Evidencia
Guardar pruebas, coste y conclusiones del análisis.

## Criterio de aprobación
El estudiante debe poder explicar cómo balancear calidad, costo y control.
