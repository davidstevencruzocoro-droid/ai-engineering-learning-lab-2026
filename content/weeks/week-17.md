---
id: 17
level: 4
xp: 25
title: "Semana 17 · Evaluación de IA"
---

# Semana 17: Evaluación de IA

## Objetivo
Medir si la solución con IA cumple con objetivos específicos, no solo si “parece buena”.

## Por qué importa
La calidad en IA se evalúa con métricas y casos reales, no con una sola impresión visual.

## Conceptos
- métricas
- benchmark
- ground truth
- robustez
- evaluación humana

## Arquitectura
```text
Tarea
  ↓
Casos de prueba
  ↓
Modelo
  ↓
Métricas y comparación
```

## Profundización técnica
Para evaluar algo como el Log Analyzer de este Lab con rigor (no "probé tres errores y se veía bien"), el patrón real es un **golden set**: una colección fija de casos de entrada con la salida esperada ya conocida, que se vuelve a correr cada vez que cambias el prompt o el modelo — exactamente lo mismo que hace una suite de tests automatizados con código, aplicado a IA:
```javascript
const goldenSet = [
  {
    input: "TypeError: Cannot read properties of undefined (reading 'level')",
    esperado: { clasificacion: /tipo|type/i, menciona: /undefined/i }
  },
  {
    input: 'ECONNREFUSED 127.0.0.1:5432',
    esperado: { clasificacion: /red|conexión/i, menciona: /5432|postgres|base de datos/i }
  }
  // ... docenas de casos reales recolectados con el tiempo
];

async function evaluarGoldenSet(analizarLog) {
  let aciertos = 0;
  for (const caso of goldenSet) {
    const resultado = await analizarLog(caso.input);
    const pasa = caso.esperado.clasificacion.test(resultado.clasificacion)
      && caso.esperado.menciona.test(resultado.texto);
    if (pasa) aciertos++;
  }
  return { aciertos, total: goldenSet.length };
}
```
Esto convierte "¿el prompt nuevo es mejor?" de una impresión subjetiva a un número comparable: corres el golden set contra el prompt viejo, contra el prompt nuevo, y comparas cuántos casos pasa cada uno — igual que comparas cobertura de tests antes y después de un cambio.

Para tareas donde la respuesta correcta no es tan verificable con una expresión regular (texto libre, resúmenes, explicaciones), una técnica adicional es **LLM-as-judge**: usar un segundo modelo (o el mismo, en una llamada separada) para calificar la respuesta contra un rubric explícito:
```text
Califica la siguiente respuesta del 1 al 5 según estos criterios:
- ¿Identifica correctamente la causa más probable? (1-5)
- ¿La sugerencia de solución es accionable, no genérica? (1-5)
No expliques tu razonamiento, responde solo con dos números separados por coma.
```
Esto no reemplaza al golden set determinista — lo complementa para los casos donde "correcto" es más una cuestión de calidad que de coincidencia exacta.

## Laboratorio
Evaluar varias aproximaciones y comparar resultados con criterios objetivos.

## Preparación
- casos reales o simulados
- formato de evaluación claro
- umbrales de éxito

## Paso 1
Definir qué indicador importa más: calidad, velocidad, coste, cobertura o robustez.

## Paso 2
Construir una pequeña suite de pruebas objetiva.

## Paso 3
Comparar y documentar la diferencia entre alternativas.

## Verificación
- puntuaciones por caso,
- errores reproducibles,
- observación de sesgos o fallos puntuales.

## Errores comunes
- usar una sola prueba,
- evaluar solo la salida final,
- no registrar criterios,
- medir una métrica que no importa.

## Debugging
Recuerda: si no defines la evaluación, no puedes decidir mejor o peor con rigor.

## Reto
Comparar dos enfoques distintos y decidir cuál domina para un caso concreto.

## BREAK THE SYSTEM
Hacer que un caso limite falle para capturar la diferencia de calidad.

## RECOVERY
Corregir la estrategia y redefinir la evaluación para que sea más justa.

## Evaluación
- ¿La métrica refleja valor real?
- ¿Se comparan alternativas de forma justa?
- ¿La decisión se apoya en evidencia?

## Evidencia
Guardar resultados, notas de análisis y criterio de decisión.

## Criterio de aprobación
El estudiante debe poder explicar qué significa evaluar una solución con IA de forma profesional.
