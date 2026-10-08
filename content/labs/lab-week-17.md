---
id: lab-17
week: 17
xp: 50
title: "Benchmark y evaluación de IA"
---

# Lab 17: Evaluar dos soluciones de IA con el mismo criterio

## Objetivo
Decidir entre dos enfoques de IA (dos modelos, o un prompt simple vs. un RAG) con un benchmark propio en vez de con una impresión subjetiva.

## Duración
2 sesiones

## Requisitos
- acceso a al menos dos modelos o configuraciones distintas a comparar
- un conjunto de casos de prueba con respuesta esperada (puedes reutilizar el del lab 14 o el 15)

## Tareas
1. Define al menos 3 métricas relevantes para tu problema (por ejemplo: exactitud, groundedness/evidencia citada, coste por consulta, latencia).
2. Ejecuta ambas soluciones contra el mismo conjunto de casos, sin cambiar los casos entre una corrida y otra.
3. Registra las métricas de cada solución en una tabla comparable.
4. Escribe una recomendación: cuál usarías y en qué condiciones cambiarías de opinión (por ejemplo, "elegiría la opción B si el presupuesto mensual superara X").

## Pista
"Se ve mejor" no es una métrica. Si no puedes poner un número, no es parte de la evaluación todavía — conviértelo en un número (sí/no, 1-5, segundos, céntimos) antes de comparar.

## Pista 2
Elige métricas antes de correr la evaluación y define cómo se calcula cada una. Usa el mismo conjunto de casos, configuración y límites para ambas soluciones.

## Pista 3
Presenta resultados en una tabla con costes y errores, no solo promedios. Cierra con una recomendación condicionada a métricas concretas que podrían hacerte cambiar de opción.

## Solución
```javascript
function evaluar(solucion, casos) {
  const resultados = casos.map((caso) => solucion.ejecutar(caso));
  return {
    exactitud: resultados.filter((r) => r.correcto).length / casos.length,
    latenciaPromedioMs: promedio(resultados.map((r) => r.latenciaMs)),
    costoPromedio: promedio(resultados.map((r) => r.costo)),
    groundedness: resultados.filter((r) => r.citaFuente).length / casos.length
  };
}

const tablaComparativa = {
  solucionA: evaluar(solucionA, casosDePrueba),
  solucionB: evaluar(solucionB, casosDePrueba)
};
console.table(tablaComparativa);
```

## Penalización XP
-9 XP por evaluar solo por sensación, sin tabla comparativa ni métricas explícitas.

## Evidencia
La tabla comparativa completa, y al menos un caso concreto donde la solución "perdedora" en el agregado fue en realidad mejor (para demostrar que entiendes los matices, no solo el promedio).

## Criterio de aprobación
Existe una comparación con al menos 3 métricas numéricas sobre el mismo conjunto de casos, y una recomendación justificada con esos datos, no con preferencia personal.
