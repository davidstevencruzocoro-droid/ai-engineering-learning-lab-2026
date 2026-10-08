---
id: lab-11
week: 11
xp: 40
title: "Integración con servicios externos"
---

# Lab 11: Integrar una API externa con tolerancia a fallos

## Objetivo
Consumir una API externa real (pública y gratuita) asumiendo que puede fallar, responder lento o devolver datos inesperados, en vez de asumir que siempre funcionará.

## Duración
2 sesiones

## Requisitos
- una API pública gratuita para probar (por ejemplo cualquier API REST pública de prueba; revisa su documentación oficial para el endpoint y límites actuales)
- cliente HTTP de tu stack (fetch, HttpClient, RestTemplate, etc.)

## Tareas
1. Haz una llamada exitosa y mapea la respuesta a un objeto propio (no reenvíes el JSON crudo de la API externa a tus usuarios).
2. Añade un timeout explícito: si la API no responde en un tiempo razonable, tu sistema no debe quedarse colgado.
3. Añade reintentos con backoff ante errores 5xx o de red, pero nunca ante errores 4xx (esos no se arreglan reintentando).
4. Simula que la API cae (apágala, apunta a una URL inválida, o fuerza un timeout) y verifica que tu sistema degrada con un mensaje claro en vez de romperse.

## Pista
Reintentar un 429 (rate limit) inmediatamente y sin esperar es la forma más común de convertir un problema pequeño en una suspensión de tu API key.

## Pista 2
Clasifica la respuesta antes de reintentar: los errores 4xx requieren corregir la solicitud; los errores de red y algunos 5xx pueden admitir reintentos con límite.

## Pista 3
Combina timeout con backoff exponencial acotado y jitter. Respeta `Retry-After` para 429 y prueba timeout, 4xx y 5xx con respuestas simuladas.

## Solución
```javascript
async function fetchConReintentos(url, intentos = 3) {
  for (let i = 0; i < intentos; i++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (res.status >= 500) throw new Error(`Error del servidor: ${res.status}`);
      if (!res.ok) return { error: `Error del cliente: ${res.status}` };

      return { data: await res.json() };
    } catch (err) {
      if (i === intentos - 1) return { error: 'Servicio externo no disponible' };
      await new Promise((r) => setTimeout(r, 2 ** i * 500));
    }
  }
}
```

## Penalización XP
-9 XP por integraciones frágiles y sin observabilidad (sin logs de qué falló ni por qué).

## Evidencia
Logs de un reintento real ocurriendo, captura del comportamiento cuando la API externa no está disponible, y el contrato (tipo/interfaz) que expone tu sistema independientemente de la forma de la respuesta externa.

## Criterio de aprobación
El sistema sigue respondiendo (con un mensaje claro de degradación) cuando la API externa falla, y distingue correctamente entre errores que vale la pena reintentar y errores que no.
