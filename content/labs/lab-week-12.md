---
id: lab-12
week: 12
xp: 40
title: "Automatización con n8n"
---

# Lab 12: Flujo de automatización empresarial en n8n

## Objetivo
Construir un workflow en n8n que reciba un evento, lo valide, lo transforme y produzca una salida verificable — no solo conectar nodos a ver qué pasa.

## Duración
2 sesiones

## Requisitos
- n8n corriendo localmente (Docker: `docker run -it --rm -p 5678:5678 n8nio/n8n` — verifica la imagen y el puerto actuales en la documentación oficial de n8n)
- un servicio de destino de prueba (puede ser un webhook de prueba, un Google Sheet, o un endpoint propio)

## Tareas
1. Crea un trigger de tipo Webhook que reciba un JSON simulando "nuevo cliente" (nombre, email, mensaje).
2. Añade un nodo de validación: si falta el email, el flujo debe detenerse y registrar el motivo, no continuar con datos incompletos.
3. Transforma el dato (por ejemplo, normaliza el email a minúsculas y añade una marca de tiempo).
4. Envía el resultado a un destino real (otro webhook, una hoja de cálculo, o un log persistente) y añade una rama de error que notifique si el envío falla.

## Pista
Un workflow que no distingue entre "el dato llegó mal" y "el envío falló" mezcla dos tipos de error completamente distintos y hace imposible depurar en producción.

## Pista 2
Valida el payload en una rama antes de transformar o enviar. Mantén la causa de rechazo separada del estado de fallo del destino para poder corregir cada problema.

## Pista 3
Registra un identificador de ejecución y el resultado de cada etapa. Simula email ausente y destino caído; el primer caso debe detenerse por validación y el segundo activar la rama de error.

## Solución
Estructura de nodos recomendada:
```text
Webhook (trigger)
  ↓
IF: ¿tiene email?
  ├─ No → Set (motivo: "email faltante") → NoOp / Log de rechazo
  └─ Sí → Function (normalizar + timestamp)
              ↓
           HTTP Request (enviar a destino)
              ↓
           IF: ¿respuesta 2xx?
              ├─ No → Notificación de error
              └─ Sí → Log de éxito
```
El nodo `Function` en n8n ejecuta JavaScript directamente:
```javascript
return items.map(item => ({
  json: {
    email: item.json.email.toLowerCase(),
    nombre: item.json.nombre,
    recibidoEn: new Date().toISOString()
  }
}));
```

## Penalización XP
-8 XP por automatizar sin verificar el flujo real (probarlo una sola vez "a mano" sin revisar el historial de ejecuciones de n8n).

## Evidencia
Captura del workflow completo, capturas de al menos dos ejecuciones en el historial de n8n (una exitosa y una rechazada por validación), y el JSON de entrada/salida de cada caso.

## Criterio de aprobación
El flujo distingue claramente entre dato inválido, envío fallido y éxito, y cada caso queda trazable en el historial de ejecuciones de n8n.
