---
id: lab-13
week: 13
xp: 45
title: "IA aplicada y control de costes"
---

# Lab 13: Servicio de IA con timeout, retry y control de costes

## Objetivo
Construir un servicio propio (no un notebook de prueba) que llame a una API de LLM con las mismas protecciones que le pondrías a cualquier dependencia externa: timeout, reintentos, logging y control de coste.

## Duración
2 sesiones

## Requisitos
- acceso a una API de LLM (clave propia; revisa el modelo y precio vigentes en la documentación oficial del proveedor que uses — no asumas un precio fijo, cambia con frecuencia)
- cliente HTTP de tu stack

## Tareas
1. Haz una llamada con un prompt fijo y registra en un log: tokens de entrada, tokens de salida, y tiempo de respuesta.
2. Añade un timeout explícito y un único reintento ante error de red o 5xx (nunca reintentes automáticamente ante un error de validación de tu propio prompt).
3. Calcula el coste estimado de la llamada a partir de los tokens reales devueltos por la API (no lo estimes "a ojo" contando caracteres).
4. Añade un límite de presupuesto simple: si el acumulado del día supera un umbral que tú definas, el servicio debe rechazar nuevas llamadas con un error claro en vez de seguir gastando.

## Pista
La mayoría de APIs de LLM devuelven el conteo de tokens de entrada y salida en la propia respuesta (`usage` o equivalente) — úsalo para el coste real, no una aproximación propia.

## Pista 2
Guarda juntos el uso informado por la API, la latencia y el identificador de modelo; aplica el precio vigente por millón de tokens de entrada/salida de ese modelo.

## Pista 3
Comprueba la estimación con una llamada de coste pequeño. Antes de enviar otra solicitud, compara el gasto acumulado con el presupuesto y rechaza con un error explícito si se excede.

## Solución
```javascript
async function llamarLLM(prompt, presupuestoRestante) {
  if (presupuestoRestante <= 0) {
    return { error: 'Presupuesto diario agotado' };
  }

  const inicio = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch('https://api.proveedor-llm.example/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({ prompt })
    });
    clearTimeout(timeout);
    const data = await res.json();

    console.log({
      tokensEntrada: data.usage?.input_tokens,
      tokensSalida: data.usage?.output_tokens,
      latenciaMs: Date.now() - inicio
    });

    return { data };
  } catch (err) {
    return { error: 'Servicio de IA no disponible' };
  }
}
```
Nota: la URL y la forma exacta de `usage` son de ejemplo — usa el endpoint y el formato de respuesta reales de la documentación oficial del proveedor que elijas.

## Penalización XP
-9 XP por decidir el límite de presupuesto "a ojo" sin basarte en el coste real por token documentado por el proveedor.

## Evidencia
Log de al menos 5 llamadas con tokens y coste estimado por llamada, y una captura del servicio rechazando una llamada por presupuesto agotado.

## Criterio de aprobación
El servicio nunca se queda colgado esperando al LLM indefinidamente, registra coste real por llamada, y deja de aceptar peticiones cuando se supera el presupuesto definido.
