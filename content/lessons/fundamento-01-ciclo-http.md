---
id: fundamento-01
week: 1
order: 1
category: "Redes y HTTP"
title: "De URL a página: qué pasa realmente"
---

# De URL a página: qué pasa realmente

## Pregunta de diagnóstico
Explica qué pasa desde que escribes una URL hasta que aparece una página web.

## Modelo mental
En términos simples: tu navegador pide, un servidor responde, el navegador dibuja. En términos precisos, son varias capas independientes:

1. **Resolución de nombre (DNS):** si escribiste un dominio (`google.com`), tu equipo pregunta "¿qué IP tiene esto?" antes de poder conectar. Si ya es una IP (`127.0.0.1`), este paso se salta.
2. **Conexión de transporte (TCP):** tu navegador abre una conexión con esa IP y ese puerto — un intercambio de tres pasos (SYN, SYN-ACK, ACK) antes de enviar ningún dato real.
3. **Petición HTTP:** sobre esa conexión ya abierta, el navegador envía una petición de texto estructurado (método, ruta, cabeceras).
4. **Respuesta HTTP:** el servidor responde con un código de estado, cabeceras y un cuerpo (HTML, JSON, lo que sea).
5. **Render:** el navegador interpreta el HTML, y por cada recurso que ese HTML referencia (CSS, JS, imágenes), repite los pasos 1-4 para cada uno.

## En este proyecto
Cuando abres `http://127.0.0.1:5174/` en este mismo Lab:

- No hay DNS — `127.0.0.1` ya es una IP (tu propia máquina, "localhost").
- El navegador abre TCP contra el puerto `5174`, donde Vite (`npm run dev`) está escuchando.
- Pide `GET /` por HTTP. Vite responde con `index.html`.
- El navegador lee `<script type="module" src="/app/js/app.js">` y repite el ciclo completo (DNS skip → TCP ya reusado → HTTP GET) para traer `app.js`, que a su vez importa `data.js`.
- Por separado, cuando usas el Mentor Ollama o la calificación de código, `app.js` hace `fetch('/api/mentor', ...)` — eso dispara OTRO ciclo HTTP completo, pero esta vez Vite actúa de proxy y reenvía la petición a `server/index.mjs` en el puerto `4176` (ver `vite.config.mjs`, bloque `proxy`).

Dos ciclos HTTP distintos, dos servidores distintos (Vite para archivos estáticos, tu `server/index.mjs` para la API local), en la misma página.

## Para verificar que entendiste
- Explica con tus palabras por qué `127.0.0.1` no necesita DNS pero `github.com` sí.
- ¿Qué pasos del ciclo se repiten cuando el navegador pide `app.js` después de `index.html`?
- Si el servidor local (puerto 4176) estuviera apagado, ¿en qué paso del ciclo fallaría la petición del Mentor Ollama?

## Caso avanzado
Hay un detalle de este mismo proyecto que casi nadie nota hasta que lo rompe: `app.js` corre en el puerto de Vite (por ejemplo `5175`) y llama a `fetch('/api/mentor', ...)`, pero el servidor que realmente responde (`server/index.mjs`) escucha en el puerto `4176` — un puerto **distinto**. Si el navegador llamara directamente a `http://127.0.0.1:4176/api/mentor` desde una página servida en `http://127.0.0.1:5175`, eso sería una petición **cross-origin** (mismo host, puerto distinto cuenta como origen distinto), y el navegador exigiría primero un preflight `OPTIONS` (verificación CORS) antes de dejar pasar la petición real.

Esto no pasa en este Lab, y la razón está en `vite.config.mjs`:
```text
server: {
  proxy: {
    '/api': { target: 'http://127.0.0.1:4176', changeOrigin: true }
  }
}
```
Vite intercepta cualquier petición a `/api/*` y la reenvía él mismo (del lado del servidor, no del navegador) hacia el puerto `4176`. Desde la perspectiva del navegador, la petición nunca salió de `http://127.0.0.1:5175` — sigue siendo same-origin, así que no hay preflight CORS en absoluto. El "salto" de puerto ocurre completamente oculto detrás del proxy. Esto es exactamente el patrón que usan la mayoría de aplicaciones reales en producción (un reverse proxy como Nginx) para evitar exponer CORS entre su frontend y su backend.

**Para verificar que entendiste (avanzado):** si quitaras el bloque `proxy` de `vite.config.mjs` y cambiaras `fetch('/api/mentor')` por `fetch('http://127.0.0.1:4176/api/mentor')` en `app.js`, ¿qué error nuevo esperarías ver en la consola del navegador la primera vez que lo probaras?
