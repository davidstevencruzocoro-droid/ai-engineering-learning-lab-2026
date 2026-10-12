---
id: 12
level: 3
xp: 25
title: "Semana 12 · n8n"
---

# Semana 12: Automatización con n8n

## Objetivo
Automatizar flujos de trabajo repetitivos con herramientas visuales y servicios reales.

## Por qué importa
Muchos procesos empresariales no requieren software complejo; requieren coordinación, triggers y automatización.

## Conceptos
- webhook
- trigger
- workflow
- data mapping
- orquestación

## Arquitectura
```text
Disparador
  ↓
Transformación / validación
  ↓
Acción en servicio externo
  ↓
Resultado y registro
```

## Profundización técnica
Un workflow de n8n se exporta como JSON — entender esa estructura es lo que te permite versionarlo en Git, revisarlo en un PR, y no depender solo de capturas de pantalla como evidencia:
```json
{
  "name": "Notificar pedido nuevo",
  "nodes": [
    { "name": "Webhook", "type": "n8n-nodes-base.webhook",
      "parameters": { "path": "pedido-nuevo", "httpMethod": "POST" } },
    { "name": "Validar payload", "type": "n8n-nodes-base.if",
      "parameters": { "conditions": { "string": [{ "value1": "={{$json.total}}", "operation": "notEmpty" }] } } },
    { "name": "Enviar notificación", "type": "n8n-nodes-base.slack" }
  ],
  "connections": {
    "Webhook": { "main": [[{ "node": "Validar payload" }]] },
    "Validar payload": { "main": [[{ "node": "Enviar notificación" }]] }
  }
}
```
El nodo `IF` ("Validar payload") es la diferencia entre un workflow de demo y uno confiable: sin él, un payload malformado del webhook sigue avanzando por el flujo y falla en un nodo posterior con un error menos claro.

El riesgo de seguridad real de cualquier webhook público (n8n, Stripe, GitHub, lo que sea) es que la URL del endpoint, por diseño, es pública — cualquiera que la descubra puede enviarle un payload falso haciéndose pasar por el servicio real. La mitigación estándar es verificar una firma criptográfica que el servicio emisor incluye en cada petición:
```javascript
const crypto = require('crypto');
function verificarFirmaWebhook(payload, firmaRecibida, secreto) {
  const firmaCalculada = crypto
    .createHmac('sha256', secreto)
    .update(payload)
    .digest('hex');
  return crypto.timingSafeEqual(Buffer.from(firmaCalculada), Buffer.from(firmaRecibida));
}
```
Esto calcula un HMAC (hash con clave secreta compartida) del cuerpo real de la petición y lo compara con el que el servicio emisor envió en una cabecera — si no coinciden, el payload fue modificado o no viene de quien dice venir, y el flujo debe rechazarlo antes de ejecutar ninguna acción. Nota que la comparación usa `crypto.timingSafeEqual`, no `===` — la razón exacta está en la lección de Fundamentos sobre variables de entorno y secretos.

## Laboratorio
Crear un flujo básico que reciba un evento, procese datos y active una acción en un servicio externo.

## Preparación
- cuenta de prueba
- acceso a servicios mínimos
- definiciones de entrada y salida

## Paso 1
Definir un trigger concreto y una salida predecible.

## Paso 2
Añadir validación y lógica de transformación.

## Paso 3
Probar ejecución real y revisar evidencia del resultado.

## Verificación
- logs del workflow
- payload de entrada
- salida del servicio externo

## Errores comunes
- datos sin normalizar,
- disparadores demasiado amplios,
- manejo insuficiente de errores.

## Debugging
Inspecciona cada nodo del flujo y valida que los datos se transforme como esperas.

## Reto
Diseñar un flujo con dos servicios y una validación intermedia.

## BREAK THE SYSTEM
Producir un payload incorrecto para detectar el punto de fallo del flujo.

## RECOVERY
Reparar la lógica y anotar la corrección para que el flujo sea más robusto.

## Evaluación
- ¿El flujo es observable?
- ¿Se identifica el punto exacto del error?
- ¿La automatización añade valor real?

## Evidencia
Guardar screenshots del flujo, ejemplos de ejecución y decisiones de diseño.

## Criterio de aprobación
El estudiante debe poder explicar el valor de automatizar procesos repetitivos con control y trazabilidad.
