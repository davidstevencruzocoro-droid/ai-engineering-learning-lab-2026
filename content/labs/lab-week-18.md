---
id: lab-18
week: 18
xp: 50
title: "LLMOps y observabilidad"
---

# Lab 18: Dashboard mínimo de observabilidad para IA

## Objetivo
Instrumentar un servicio de IA (puedes reutilizar el del lab 13) para que cada llamada quede registrada de forma consultable: coste, latencia, éxito/fallo y versión de prompt usada.

## Duración
2 sesiones

## Requisitos
- el servicio de IA del lab 13 (o uno equivalente)
- un almacén simple para los registros (un archivo JSON/CSV append-only es suficiente; no hace falta una base de datos)

## Tareas
1. Registra cada llamada con: timestamp, versión del prompt usado, tokens de entrada/salida, coste estimado, latencia y si hubo error.
2. Versiona tus prompts explícitamente (ej. `prompt-extraccion-v1`, `prompt-extraccion-v2`) para poder comparar su rendimiento en el tiempo.
3. Construye un resumen simple (una función, un script, o una vista en tu dashboard) que calcule: coste total del día, latencia promedio, y tasa de error.
4. Provoca deliberadamente una degradación (por ejemplo, fuerza varios timeouts) y verifica que tu resumen la refleja claramente.

## Pista
No necesitas Grafana ni un APM completo para este lab: necesitas que, al final del día, puedas responder "¿cuánto gasté, qué tan rápido respondió, y cuántas veces falló?" sin adivinar.

## Pista 2
Escribe un registro estructurado por llamada con timestamp, versión del prompt, uso, coste, latencia y estado. Evita guardar secretos o datos personales innecesarios.

## Pista 3
Calcula coste total, latencia y tasa de error sobre un intervalo explícito. Fuerza un timeout controlado y confirma que aparece en el registro y cambia las métricas.

## Solución
```javascript
function registrarLlamada(log) {
  fs.appendFileSync('llm-log.jsonl', JSON.stringify({
    timestamp: new Date().toISOString(),
    promptVersion: log.promptVersion,
    tokensEntrada: log.tokensEntrada,
    tokensSalida: log.tokensSalida,
    costoEstimado: log.costoEstimado,
    latenciaMs: log.latenciaMs,
    error: log.error ?? null
  }) + '\n');
}

function resumenDelDia() {
  const registros = fs.readFileSync('llm-log.jsonl', 'utf8')
    .trim().split('\n').map(JSON.parse);

  return {
    costoTotal: registros.reduce((sum, r) => sum + r.costoEstimado, 0),
    latenciaPromedio: promedio(registros.map((r) => r.latenciaMs)),
    tasaError: registros.filter((r) => r.error).length / registros.length
  };
}
```

## Penalización XP
-8 XP si no hay trazabilidad ni observación (no puedes responder cuánto gastaste o cuántas llamadas fallaron sin leer logs crudos a mano).

## Evidencia
El archivo de log con al menos 10 llamadas registradas, el resumen calculado, y una captura de la tasa de error subiendo durante la degradación simulada.

## Criterio de aprobación
Puedes responder coste total, latencia promedio y tasa de error del día consultando tu propio sistema, sin leer logs crudos manualmente.
