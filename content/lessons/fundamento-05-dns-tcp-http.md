---
id: fundamento-05
week: 2
order: 1
category: "Redes y HTTP"
title: "DNS, TCP y HTTP: tres capas, tres trabajos distintos"
---

# DNS, TCP y HTTP: tres capas, tres trabajos distintos

## Pregunta de diagnóstico
¿Cuál es la diferencia entre DNS, TCP y HTTP? ¿En qué orden intervienen?

## Modelo mental
Son tres capas independientes que resuelven problemas distintos, en este orden:

- **DNS (Domain Name System)**: traduce un nombre legible (`github.com`) a una dirección IP (`140.82.x.x`). Es como una guía telefónica. No transporta datos de tu aplicación, solo resuelve "¿a qué dirección me conecto?".
- **TCP (Transmission Control Protocol)**: una vez tienes la IP, TCP establece una conexión confiable entre tu máquina y esa IP+puerto. Garantiza que los datos lleguen completos y en orden (o que falle explícitamente), pero no sabe nada sobre el *contenido* de lo que transporta — es "tubería", no "mensaje".
- **HTTP (HyperText Transfer Protocol)**: el formato del mensaje que viaja *dentro* de esa tubería TCP ya abierta. Define método (`GET`, `POST`), ruta, cabeceras y cuerpo. HTTP no sabe nada de IPs ni de confiabilidad de red — confía en que TCP ya resolvió eso.

## En este proyecto
Cuando el navegador pide `http://127.0.0.1:4176/api/health` directamente (sin pasar por el proxy de Vite):

- **DNS**: no interviene — `127.0.0.1` ya es una dirección IP literal, no un nombre que resolver.
- **TCP**: el navegador abre una conexión contra `127.0.0.1:4176`, donde `server/index.mjs` tiene un socket escuchando (`server.listen(4176, '127.0.0.1')`). Si nada estuviera escuchando en ese puerto, fallaría *aquí* — un error de conexión rechazada, antes de que exista ningún HTTP.
- **HTTP**: sobre esa conexión TCP ya abierta, viaja la petición `GET /api/health` con sus cabeceras, y el servidor responde con un código `200` y un cuerpo JSON.

Esto explica por qué `isLoopback(remoteAddress)` — la verificación de seguridad real del servidor — opera a nivel de **TCP** (mira la IP de origen de la conexión), mientras que `isAllowedOrigin` opera a nivel de **HTTP** (mira la cabecera `Origin` del mensaje). Son capas distintas: alguien podría falsificar la cabecera `Origin` de un mensaje HTTP, pero no puede falsificar fácilmente desde qué IP se abrió la conexión TCP — por eso `isLoopback` es la barrera que realmente importa, y `isAllowedOrigin` es solo una capa adicional de defensa.

## Para verificar que entendiste
- Si escribes mal la IP (`127.0.0.2` en vez de `127.0.0.1`) pero el puerto es correcto, ¿en qué capa fallaría la conexión?
- ¿Por qué un atacante que falsifica la cabecera HTTP `Origin` no puede, solo con eso, hacerse pasar por una conexión TCP local?
- ¿Qué capa de las tres tendría que fallar para que veas un error de "no se pudo resolver el nombre" al visitar `github.com`?

## Caso avanzado
`isLoopback()` en este servidor es deliberadamente simple:
```text
function isLoopback(address = '') {
  return address === '::1' || address === '127.0.0.1' || address.startsWith('127.');
}
```
Mira directamente `request.socket.remoteAddress` — la IP de la conexión TCP tal como la ve el sistema operativo. Eso es sólido mientras el navegador se conecte directamente a este servidor, como ocurre hoy.

Pero si este mismo servidor se desplegara algún día detrás de un proxy reverso (por ejemplo, Nginx corriendo en la misma máquina para servir HTTPS), `request.socket.remoteAddress` dejaría de ser la IP del cliente real — sería la IP del proxy (que, si corre en la misma máquina, casualmente también sería `127.0.0.1`, pasando la verificación por una razón completamente distinta a la que fue diseñada para comprobar). Para recuperar la IP original del cliente en ese escenario, un proxy típicamente añade una cabecera como `X-Forwarded-For` — pero esa cabecera la pone CUALQUIERA que hable HTTP con el proxy, incluyendo un atacante, a menos que el proxy la sobrescriba explícitamente. Confiar en `X-Forwarded-For` sin que el proxy la controle estrictamente es un error de seguridad real y común en sistemas de producción.

Esto es exactamente por qué la capa en la que se verifica una defensa importa tanto como la defensa misma: `isLoopback` es sólida verificando TCP directo; se volvería frágil si un día dependiera, sin cuidado, de una cabecera HTTP que viaja en una capa que cualquiera puede escribir.

**Para verificar que entendiste (avanzado):** si este Lab se desplegara detrás de un proxy reverso en la misma máquina, ¿por qué `isLoopback(request.socket.remoteAddress)` seguiría devolviendo `true` incluso para una petición que en realidad viene de otra computadora en la red?
