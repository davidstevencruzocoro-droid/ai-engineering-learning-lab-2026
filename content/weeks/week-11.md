---
id: 11
level: 3
xp: 25
title: "Semana 11 · Integraciones"
---

# Semana 11: Integraciones y servicios externos

## Objetivo
Conectar sistemas distintos sin depender de su implementación interna.

## Por qué importa
La mayoría de aplicaciones reales necesitan interactuar con otros servicios, APIs y plataformas.

## Conceptos
- contratos de integración
- webhook
- timeout
- retries
- serialización y eventos

## Arquitectura
```text
Sistema 1
  ↓
API / cliente / adapter
  ↓
Sistema 2
```

## Profundización técnica
Dos patrones reales que separan una integración "que funciona en la demo" de una que sobrevive en producción.

**Reintentos con backoff exponencial, no reintentos inmediatos.** Si un servicio externo falla porque está sobrecargado, reintentar inmediatamente (y muchas veces) empeora la sobrecarga. El patrón correcto espera cada vez más entre intentos:
```javascript
async function fetchWithRetry(url, options, maxRetries = 4) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeout);
      if (response.ok) return response;
      if (response.status < 500) return response; // 4xx no se arregla reintentando
    } catch (error) {
      clearTimeout(timeout);
      if (attempt === maxRetries) throw error;
    }
    const delay = Math.min(1000 * 2 ** attempt, 10_000);
    await new Promise((r) => setTimeout(r, delay));
  }
}
```
`AbortController` con `setTimeout` evita quedarte esperando indefinidamente si el servicio externo nunca responde. El backoff (`1000 * 2 ** attempt`) espera 1s, 2s, 4s, 8s — dando tiempo a que el servicio externo se recupere, en vez de machacarlo. Un error `4xx` (problema con tu petición) se devuelve de inmediato porque reintentar lo mismo no va a cambiar el resultado — solo los `5xx` (problema del lado del servidor externo) justifican reintentar.

**Idempotency keys — evitar duplicar un efecto al reintentar.** Si tu reintento es sobre una operación que *cambia estado* (crear un pedido, cobrar un pago), reintentar a ciegas puede duplicar el efecto si la primera llamada sí tuvo éxito pero la respuesta se perdió en la red. La solución real (usada por APIs como la de Stripe) es enviar una clave única por operación lógica:
```javascript
const idempotencyKey = `order-${orderId}-${userId}`;
await fetch('https://api.proveedor.com/charges', {
  method: 'POST',
  headers: { 'Idempotency-Key': idempotencyKey },
  body: JSON.stringify(payload)
});
```
El servicio externo recuerda esa clave: si la misma clave llega dos veces, devuelve el resultado de la primera ejecución sin repetir el efecto — el reintento se vuelve seguro incluso para operaciones que cuestan dinero.

## Laboratorio
Crear una integración con una API externa y capturar los fallos más habituales del mundo real.

## Preparación
- credenciales de prueba
- endpoint de ejemplo
- registro de respuestas y errores

## Paso 1
Definir el contrato y las respuestas esperadas.

## Paso 2
Implementar el adaptador para manejar errores y fallos de red.

## Paso 3
Validar con pruebas de integración y observabilidad básica.

## Verificación
```bash
curl -X POST http://localhost:8080/api/integrations/test
```

## Errores comunes
- JSON mal formado,
- respuestas inesperadas,
- timeouts,
- integración acoplada al entorno local.

## Debugging
Inspecciona las llamadas HTTP, el encabezado y el cuerpo antes de ajustar la lógica de negocio.

## Reto
Escenario donde el servicio externo responde tarde o con una estructura rara.

## BREAK THE SYSTEM
Introducir una respuesta no esperada y comprobar cómo se comporta la integración.

## RECOVERY
Diseñar manejo de errores y reintentos siguiendo el principio de degradación controlada.

## Evaluación
- ¿Hay tolerancia a fallos?
- ¿Se validan respuestas externas?
- ¿La integración es observables?

## Evidencia
Guardar logs, pruebas y descripciones del contrato.

## Criterio de aprobación
El estudiante debe poder explicar cómo una integración segura y observable reduce riesgo operativo.
