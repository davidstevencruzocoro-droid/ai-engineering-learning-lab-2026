---
id: lab-14
week: 14
xp: 45
title: "Prompt engineering y evaluación"
---

# Lab 14: Comparar prompts con un conjunto de evaluación propio

## Objetivo
Dejar de elegir un prompt "porque suena mejor" y empezar a elegirlo porque gana en un conjunto de casos medibles.

## Duración
2 sesiones

## Requisitos
- acceso a una API de LLM
- un problema concreto y acotado (clasificar texto, extraer datos de un formato, resumir con una estructura fija, etc.)

## Tareas
1. Define entre 10 y 20 casos de entrada con su salida esperada (aunque sea aproximada) para tu problema.
2. Escribe 3 versiones de prompt para el mismo problema: una vaga, una con instrucciones y restricciones claras, y una con ejemplos (few-shot).
3. Ejecuta las 3 versiones contra todos tus casos y registra: aciertos, formato correcto/incorrecto, y tokens usados.
4. Elige la versión ganadora con datos, no con intuición, y documenta en qué casos concretos falló cada una.

## Pista
Un prompt "parece" mejor cuando lees una sola respuesta bonita; la diferencia real aparece cuando lo corres contra 15 casos variados, incluyendo los raros.

## Pista 2
Congela entradas y criterios antes de correr la evaluación. Prueba cada versión con exactamente los mismos casos y registra por separado calidad, formato y tokens.

## Pista 3
Incluye entradas ambiguas y fuera de alcance, inspecciona fallos concretos y elige con la tabla completa; no modifiques el conjunto para favorecer al prompt ganador.

## Solución
```javascript
const casos = [
  { entrada: 'Factura #123, total 45.00 EUR, vencimiento 2026-01-15', esperado: { total: 45.00, moneda: 'EUR' } },
  // ... más casos
];

async function evaluarPrompt(prompt, casos) {
  let aciertos = 0;
  let tokensTotal = 0;

  for (const caso of casos) {
    const resultado = await llamarLLM(prompt.replace('{{input}}', caso.entrada));
    tokensTotal += resultado.tokensUsados;
    if (JSON.stringify(resultado.salida) === JSON.stringify(caso.esperado)) {
      aciertos++;
    }
  }

  return { aciertos, total: casos.length, tokensTotal };
}
```
Compara `evaluarPrompt(promptA, casos)`, `evaluarPrompt(promptB, casos)` y `evaluarPrompt(promptC, casos)` y registra los tres resultados lado a lado.

## Penalización XP
-8 XP por prompts genéricos y sin comparación medible entre versiones.

## Evidencia
Tabla con los 3 prompts, su tasa de acierto, tokens promedio por llamada, y al menos 2 casos donde la versión ganadora falló (ningún prompt es perfecto; documentarlo es parte del criterio).

## Criterio de aprobación
Existe una comparación cuantitativa entre al menos 3 versiones de prompt sobre el mismo conjunto de casos, y la elección final está justificada con esos números.
