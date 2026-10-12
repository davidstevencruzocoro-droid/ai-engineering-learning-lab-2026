---
id: fundamento-08
week: 2
order: 4
category: "Redes y HTTP"
title: "Diagnosticar un error HTTP 500"
---

# Diagnosticar un error HTTP 500

## Pregunta de diagnóstico
Un cliente reporta que recibe un error HTTP 500. ¿Cómo lo diagnosticarías?

## Modelo mental
Un `500 Internal Server Error` significa una sola cosa con certeza: **el servidor reconoció la petición pero algo se rompió procesándola** — no es un problema del cliente (eso sería un `4xx`), es un problema del lado del servidor. Más allá de eso, el código no te dice la causa — hay que buscarla.

Orden de diagnóstico, de más barato a más caro:
1. **Mira los logs del servidor en el momento exacto de la petición** — busca el stack trace o el error capturado.
2. **Reproduce la petición exacta** (mismo método, misma ruta, mismo cuerpo) de forma aislada, para confirmar que es reproducible y no un evento de una sola vez (por ejemplo, memoria agotada momentáneamente).
3. **Aísla la causa**: ¿falla antes de tocar una dependencia externa (bug de lógica) o después (la dependencia — base de datos, Docker, Ollama — no respondió o respondió distinto a lo esperado)?
4. **Corrige y verifica con la misma petición** que falló originalmente.

## En este proyecto
En `server/index.mjs`, cada ruta de la API está envuelta en manejo de errores que, ante una excepción no prevista, responde `500` con un mensaje genérico — y por diseño deliberado, **nunca** incluye el stack trace completo en la respuesta al cliente (eso sería una fuga de información interna). El stack trace completo se queda en la consola del proceso del servidor, no en la respuesta HTTP.

Eso significa que si alguna vez ves un `500` en este Lab —por ejemplo al llamar a `/api/grade` o `/api/mentor`— el primer paso NO es mirar la respuesta en el navegador (ahí solo verás un mensaje corto), sino mirar la terminal donde corre `npm run lab:server`, que es donde queda el detalle real del error.

Ejemplo concreto y verificable: si Ollama no está corriendo cuando llamas a `/api/mentor`, `callOllama()` lanza una excepción al no poder conectar a `127.0.0.1:11434` — el cliente recibe un `500` (o un error de conexión más específico según cómo esté envuelto), pero la causa raíz real ("Ollama no está escuchando") solo es visible en los logs del servidor, no en la respuesta HTTP.

## Para verificar que entendiste
- ¿Por qué el servidor de este Lab oculta el stack trace completo al cliente en vez de devolverlo en la respuesta `500`?
- Si pides `/api/mentor` sin tener Ollama corriendo, ¿dónde exactamente esperarías ver la causa real del fallo?
- ¿Qué diferencia práctica hay entre un `500` reproducible siempre y un `500` que solo aparece una vez de cada veinte peticiones idénticas?

## Caso avanzado
En `server/index.mjs`, el código de estado de un error no se elige a mano caso por caso — se deriva así:
```text
const status = error.statusCode || (error instanceof RangeError || error instanceof TypeError ? 400 : 500);
```
Es decir: si el error es un `RangeError` o `TypeError` (los tipos que se lanzan deliberadamente cuando una validación falla, como un payload mal formado), se clasifica como `400` (error del cliente). Cualquier otro tipo de error se clasifica como `500` (error del servidor).

Esto tiene una consecuencia sutil: si en algún punto del código hay un **bug de programación real** (no una validación fallida) que por accidente lanza un `TypeError` — por ejemplo, llamar a `.length` sobre un valor que resultó ser `undefined` por un error de lógica — el servidor lo reportaría como `400`, como si el cliente hubiera mandado datos inválidos, cuando en realidad el problema está en el propio código del servidor. Un diagnóstico apresurado podría culpar al cliente ("mandó algo mal") cuando la causa real es un bug interno disfrazado por el tipo de excepción que accidentalmente se lanzó.

Esta es una razón real por la que, al diagnosticar un error, el código de estado HTTP es una pista útil pero nunca la prueba final — siempre hay que mirar el mensaje y, si es posible, el log del servidor, antes de asumir de qué lado está la causa.

**Para verificar que entendiste (avanzado):** si una función de este servidor tuviera un bug donde accidentalmente intenta leer una propiedad de un objeto `undefined` (lanzando un `TypeError` no relacionado con validación), ¿qué código HTTP vería el cliente, y por qué eso podría confundir el diagnóstico inicial?
